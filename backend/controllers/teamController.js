import Team from '../models/teamModel.js';
import Event from '../models/eventModel.js';
import { generateTeamCode } from '../utils/generateTeamCode.js';

export const createTeam = async (req, res) => {
    try {
        const { eventId, teamName, members } = req.body;
        const leader = req.user; 

        const leaderRegNo = leader.studentId || req.body.leader?.collegeRegNo;

        if (!leaderRegNo) {
            return res.status(400).json({
                success: false,
                message: 'Leader college registration number is required (update profile or provide in body)'
            });
        }

        const leaderData = {
            name: leader.name,
            email: leader.email,
            collegeRegNo: leaderRegNo
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


        const allMembers = [leaderData, ...(members || [])];
        const seen = new Set();
        const allEmails = [];
        const allRegNos = [];

        for (const member of allMembers) {
            const email = member.email.toLowerCase();
            const regNo = member.collegeRegNo;
            const key = `${email}-${regNo}`;

            if (seen.has(key)) {
                return res.status(400).json({
                    success: false,
                    message: `Duplicate member in current request: ${member.email}`
                });
            }
            seen.add(key);
            allEmails.push(email);
            allRegNos.push(regNo);
        }


        const existingMemberTeam = await Team.findOne({
            event: eventId,
            $or: [
                { 'leader.email': { $in: allEmails } },
                { 'leader.collegeRegNo': { $in: allRegNos } },
                { 'members.email': { $in: allEmails } },
                { 'members.collegeRegNo': { $in: allRegNos } }
            ]
        });

        if (existingMemberTeam) {

            let duplicateMember = null;
            let duplicateReason = '';


            if (allEmails.includes(existingMemberTeam.leader.email.toLowerCase())) {
                duplicateMember = existingMemberTeam.leader.email;
                duplicateReason = 'email';
            } else if (allRegNos.includes(existingMemberTeam.leader.collegeRegNo)) {
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
                    if (allRegNos.includes(member.collegeRegNo)) {
                        duplicateMember = member.collegeRegNo;
                        duplicateReason = 'registration number';
                        break;
                    }
                }
            }

            return res.status(400).json({
                success: false,
                message: `User with ${duplicateReason} '${duplicateMember}' is already registered in team '${existingMemberTeam.name}' for this event`
            });
        }

        const team = await Team.create({
            name: teamName,
            event: eventId,
            leader: {
                email: leaderData.email.toLowerCase(),
                collegeRegNo: leaderData.collegeRegNo,
                name: leaderData.name
            },
            members: (members || []).map(m => ({
                email: m.email.toLowerCase(),
                collegeRegNo: m.collegeRegNo,
                name: m.name || ''
            })),
            teamCode
        });

        event.teams.push(team._id);
        await event.save();

        const populatedTeam = await Team.findById(team._id)
            .populate('event', 'name eventType minTeamSize maxTeamSize date venue');

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: populatedTeam
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
        const { teamName, members, leaderEmail, leaderRegNo } = req.body;

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
                const regNo = member.collegeRegNo;
                const key = `${email}-${regNo}`;

                if (seen.has(key)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate member in request: ${member.email}`
                    });
                }
                seen.add(key);
                allEmails.push(email);
                allRegNos.push(regNo);
            }


            const existingMemberTeam = await Team.findOne({
                event: team.event,
                _id: { $ne: teamId },
                $or: [
                    { 'leader.email': { $in: allEmails } },
                    { 'leader.collegeRegNo': { $in: allRegNos } },
                    { 'members.email': { $in: allEmails } },
                    { 'members.collegeRegNo': { $in: allRegNos } }
                ]
            });

            if (existingMemberTeam) {
                let duplicateMember = null;
                let duplicateReason = '';

                if (allEmails.includes(existingMemberTeam.leader.email.toLowerCase())) {
                    duplicateMember = existingMemberTeam.leader.email;
                    duplicateReason = 'email';
                } else if (allRegNos.includes(existingMemberTeam.leader.collegeRegNo)) {
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
                        if (allRegNos.includes(member.collegeRegNo)) {
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
                collegeRegNo: m.collegeRegNo,
                name: m.name || ''
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
        const { email, collegeRegNo } = req.body;

        if (!email || !collegeRegNo) {
            return res.status(400).json({
                success: false,
                message: 'Email and college registration number are required'
            });
        }

        const asLeader = await Team.find({
            'leader.email': email.toLowerCase(),
            'leader.collegeRegNo': collegeRegNo
        }).populate('event', 'name eventType date venue category');

        const asMember = await Team.find({
            'members': {
                $elemMatch: {
                    email: email.toLowerCase(),
                    collegeRegNo: collegeRegNo
                }
            }
        }).populate('event', 'name eventType date venue category');

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
