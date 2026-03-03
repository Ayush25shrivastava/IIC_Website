import Team from '../models/teamModel.js';
import Event from '../models/eventModel.js';
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
            'leader.email': leaderData.email.toLowerCase(),
            'leader.collegeRegNo': leaderData.collegeRegNo
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

        const memberMatchQuery = { email: leaderData.email.toLowerCase() };
        if (leaderData.collegeRegNo) {
            memberMatchQuery.collegeRegNo = leaderData.collegeRegNo;
        }

        const existingMemberTeam = await Team.findOne({
            event: eventId,
            'members': {
                $elemMatch: memberMatchQuery
            }
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

        if (team.leader.email === user.email.toLowerCase() || team.leader.collegeRegNo === userRegNo) {
            return res.status(400).json({
                success: false,
                message: 'You are the leader of this team'
            });
        }

        const isMember = team.members.some(
            m => m.email === user.email.toLowerCase() || (userRegNo && m.collegeRegNo === userRegNo)
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
                { 'leader.email': user.email.toLowerCase() },
                { 'members.email': user.email.toLowerCase() }
            ]
        };

        if (userRegNo) {
            existingTeamQuery.$or.push({ 'leader.collegeRegNo': userRegNo });
            existingTeamQuery.$or.push({ 'members.collegeRegNo': userRegNo });
        }

        const existingTeam = await Team.findOne(existingTeamQuery);

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: `You are already registered in team '${existingTeam.name}' for this event`
            });
        }

        team.members.push({
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
            const allEmails = [];
            const allRegNos = [];

            for (const member of allMembers) {
                const email = member.email.toLowerCase();
                const isMnnit = Boolean(member.isMnnit);
                const regNo = member.collegeRegNo || '';

                if (isMnnit && !regNo) {
                    return res.status(400).json({
                        success: false,
                        message: `College registration number is required for MNNIT member: ${email}`
                    });
                }

                const key = regNo ? `${email}-${regNo}` : `${email}`;

                if (seen.has(key)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate member in request: ${member.email}`
                    });
                }
                seen.add(key);
                allEmails.push(email);
                if (regNo) allRegNos.push(regNo);
            }

            const searchOr = [
                { 'leader.email': { $in: allEmails } },
                { 'members.email': { $in: allEmails } }
            ];

            if (allRegNos.length > 0) {
                searchOr.push({ 'leader.collegeRegNo': { $in: allRegNos } });
                searchOr.push({ 'members.collegeRegNo': { $in: allRegNos } });
            }

            const existingMemberTeam = await Team.findOne({
                event: team.event,
                _id: { $ne: teamId },
                $or: searchOr
            });

            if (existingMemberTeam) {
                let duplicateMember = null;
                let duplicateReason = '';

                if (allEmails.includes(existingMemberTeam.leader.email.toLowerCase())) {
                    duplicateMember = existingMemberTeam.leader.email;
                    duplicateReason = 'email';
                } else if (existingMemberTeam.leader.collegeRegNo && allRegNos.includes(existingMemberTeam.leader.collegeRegNo)) {
                    duplicateMember = existingMemberTeam.leader.collegeRegNo;
                    duplicateReason = 'registration number';
                }

                if (!duplicateMember) {
                    for (const member of existingMemberTeam.members) {
                        if (allEmails.includes(member.email.toLowerCase())) {
                            duplicateMember = member.email;
                            duplicateReason = 'email';
                            break;
                        }
                        if (member.collegeRegNo && allRegNos.includes(member.collegeRegNo)) {
                            duplicateMember = member.collegeRegNo;
                            duplicateReason = 'registration number';
                            break;
                        }
                    }
                }

                return res.status(400).json({
                    success: false,
                    message: `User with ${duplicateReason} '${duplicateMember}' is already registered in another team '${existingMemberTeam.name}' for this event`
                });
            }

            team.members = members.map(m => ({
                email: m.email.toLowerCase(),
                collegeRegNo: m.collegeRegNo || '',
                name: m.name || '',
                isMnnit: Boolean(m.isMnnit)
            }));
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
        const collegeRegNo = user.studentId;

        const asLeader = await Team.find({
            'leader.email': email.toLowerCase(),
            'leader.collegeRegNo': collegeRegNo
        }).populate('event', 'name eventType date venue category description image');

        const asMember = await Team.find({
            'members': {
                $elemMatch: {
                    email: email.toLowerCase(),
                    collegeRegNo: collegeRegNo
                }
            }
        }).populate('event', 'name eventType date venue category description image');

        const allTeams = [...asLeader, ...asMember];
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
