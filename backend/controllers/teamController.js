import Team from '../models/teamModel.js';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import { generateTeamCode } from '../utils/generateTeamCode.js';
export const createTeam = async (req, res) => {
    try {
        const { eventId, teamName, leaderIsMnnit } = req.body;
        const leader = req.user;

        const isMnnit = leaderIsMnnit !== undefined ? Boolean(leaderIsMnnit) : Boolean(leader.isMnnit);
        const leaderRegNo = leader.studentId || req.body.leader?.collegeRegNo || '';

        if (isMnnit && !leaderRegNo) {
            return res.status(400).json({
                success: false,
                message: 'Leader college registration number is required for MNNIT students'
            });
        }

        const leaderData = {
            name: leader.name,
            email: leader.email,
            collegeRegNo: leaderRegNo,
            isMnnit: isMnnit
        };

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.eventType !== 'Team') {
            return res.status(400).json({
                success: false,
                message: 'This event is not a team event'
            });
        }


        const existingTeam = await Team.findOne({
            event: eventId,
            'leader.user': leader._id
        });

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'You have already created a team for this event'
            });
        }


        let teamCode;
        let codeExists = true;
        while (codeExists) {
            teamCode = generateTeamCode();
            const existing = await Team.findOne({ teamCode });
            if (!existing) codeExists = false;
        }

        const existingMemberTeam = await Team.findOne({
            event: eventId,
            'members.user': leader._id
        });

        if (existingMemberTeam) {
            return res.status(400).json({
                success: false,
                message: `You are already a member of team '${existingMemberTeam.name}' for this event`
            });
        }

        const team = await Team.create({
            name: teamName,
            event: eventId,
            leader: {
                user: leader._id,
                email: leaderData.email.toLowerCase(),
                collegeRegNo: leaderData.collegeRegNo,
                name: leaderData.name,
                isMnnit: leaderData.isMnnit
            },
            members: [],
            teamCode
        });

        event.teams.push(team._id);
        await event.save();

        const populatedTeam = await Team.findById(team._id)
            .populate('event', 'name eventType minTeamSize maxTeamSize date venue');

        res.status(201).json({
            success: true,
            message: 'Team created successfully. Share the team code with your members to join.',
            data: populatedTeam,
            teamCode: teamCode
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const joinTeam = async (req, res) => {
    try {
        const { teamCode, isMnnit: reqIsMnnit } = req.body;
        const user = req.user;
        const isMnnit = reqIsMnnit !== undefined ? Boolean(reqIsMnnit) : Boolean(user.isMnnit);
        const userRegNo = user.studentId || '';

        if (isMnnit && !userRegNo) {
            return res.status(400).json({
                success: false,
                message: 'College registration number is required to join a team for MNNIT students'
            });
        }

        const team = await Team.findOne({ teamCode }).populate('event');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Invalid team code'
            });
        }

        const event = team.event;

        if (team.members.length + 1 >= event.maxTeamSize) {
            return res.status(400).json({
                success: false,
                message: 'Team is already full'
            });
        }

        if (team.leader.user?.toString() === user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You are the leader of this team'
            });
        }

        const isMember = team.members.some(
            m => m.user?.toString() === user._id.toString()
        );

        if (isMember) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this team'
            });
        }

        const existingTeamQuery = {
            event: event._id,
            $or: [
                { 'leader.user': user._id },
                { 'members.user': user._id }
            ]
        };

        const existingTeam = await Team.findOne(existingTeamQuery);

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: `You are already registered in team '${existingTeam.name}' for this event`
            });
        }

        team.members.push({
            user: user._id,
            email: user.email.toLowerCase(),
            collegeRegNo: userRegNo,
            name: user.name,
            isMnnit: isMnnit
        });

        await team.save();

        res.status(200).json({
            success: true,
            message: 'Successfully joined the team',
            data: team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getTeamDetails = async (req, res) => {
    try {
        const { id: teamId } = req.params;

        const team = await Team.findById(teamId)
            .populate('event', 'name eventType minTeamSize maxTeamSize date venue');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateTeam = async (req, res) => {
    try {
        const { id: teamId } = req.params;
        const { teamName, members, leaderEmail, leaderRegNo, leaderIsMnnit } = req.body;

        const team = await Team.findById(teamId).populate('event');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        if (team.leader.email !== leaderEmail.toLowerCase() ||
            team.leader.collegeRegNo !== leaderRegNo) {
            return res.status(403).json({
                success: false,
                message: 'Only team leader can update the team'
            });
        }

        if (leaderIsMnnit !== undefined) {
            team.leader.isMnnit = Boolean(leaderIsMnnit);
        }


        if (teamName) {
            team.name = teamName;
        }


        if (members) {

            const allMembers = [team.leader, ...members];
            const seen = new Set();
            const allEmails = allMembers.map(m => m.email.toLowerCase());
            
            const dbUsers = await User.find({ email: { $in: allEmails } });
            const emailToUserMap = {};
            dbUsers.forEach(u => emailToUserMap[u.email.toLowerCase()] = u);

            const allUserIds = [];

            for (const member of allMembers) {
                const email = member.email.toLowerCase();
                const dbUser = emailToUserMap[email];
                
                if (!dbUser) {
                    return res.status(400).json({
                        success: false,
                        message: `User with email '${email}' is not registered on the platform`
                    });
                }

                const isMnnit = Boolean(member.isMnnit || dbUser.isMnnit);
                const regNo = member.collegeRegNo || dbUser.studentId || '';

                if (isMnnit && !regNo) {
                    return res.status(400).json({
                        success: false,
                        message: `College registration number is required for MNNIT member: ${email}`
                    });
                }

                const key = dbUser._id.toString();

                if (seen.has(key)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate member in request: ${email}`
                    });
                }
                seen.add(key);
                allUserIds.push(dbUser._id);
            }

            const searchOr = [
                { 'leader.user': { $in: allUserIds } },
                { 'members.user': { $in: allUserIds } }
            ];

            const existingMemberTeam = await Team.findOne({
                event: team.event,
                _id: { $ne: teamId },
                $or: searchOr
            });

            if (existingMemberTeam) {
                return res.status(400).json({
                    success: false,
                    message: `One or more users in your request are already registered in another team '${existingMemberTeam.name}' for this event`
                });
            }

            team.members = members.map(m => {
                const email = m.email.toLowerCase();
                const dbUser = emailToUserMap[email];
                return {
                    user: dbUser._id,
                    email: email,
                    collegeRegNo: m.collegeRegNo || dbUser.studentId || '',
                    name: m.name || dbUser.name || '',
                    isMnnit: Boolean(m.isMnnit || dbUser.isMnnit)
                };
            });
        }

        await team.save();

        res.status(200).json({
            success: true,
            message: 'Team updated successfully',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const { id: teamId } = req.params;
        const { leaderEmail, leaderRegNo } = req.body;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        if (team.leader.email !== leaderEmail.toLowerCase() ||
            team.leader.collegeRegNo !== leaderRegNo) {
            return res.status(403).json({
                success: false,
                message: 'Only team leader can delete the team'
            });
        }

        const Event = (await import('../models/eventModel.js')).default;
        await Event.findByIdAndUpdate(team.event, {
            $pull: { teams: teamId }
        });

        await Team.findByIdAndDelete(teamId);

        res.status(200).json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyTeams = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;
        const collegeRegNo = user.studentId || ''; 

        const leaderQuery = { 'leader.user': user._id };

        const asLeader = await Team.find(leaderQuery)
            .populate('event', 'name eventType date venue category description image');

        const memberQuery = { 'members.user': user._id };

        const asMember = await Team.find(memberQuery)
            .populate('event', 'name eventType date venue category description image');

        const allTeams = [...asLeader, ...asMember];
        
        // Remove duplicates just in case
        const uniqueTeams = Array.from(
            new Map(allTeams.map(team => [team._id.toString(), team])).values()
        );

        res.status(200).json({
            success: true,
            data: uniqueTeams,
            stats: {
                total: uniqueTeams.length,
                asLeader: asLeader.length,
                asMember: asMember.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};