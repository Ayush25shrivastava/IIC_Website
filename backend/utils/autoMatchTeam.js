import Team from '../models/teamModel.js';
import User from '../models/userModel.js';
import Registration from '../models/registrationModel.js';

export const autoMatchPendingTeamMembers = async (user) => {
    try {
        const teamsWithPendingMember = await Team.find({
            'pendingMembers.email': user.email.toLowerCase()
        }).populate('event');

        if (teamsWithPendingMember.length === 0) {
            return { matched: 0, teams: [] };
        }

        const matchedTeams = [];

        for (const team of teamsWithPendingMember) {
            const pendingMember = team.pendingMembers.find(
                pm => pm.email.toLowerCase() === user.email.toLowerCase() &&
                    pm.collegeRegNo === user.studentId
            );

            if (pendingMember) {
                team.pendingMembers = team.pendingMembers.filter(
                    pm => !(pm.email.toLowerCase() === user.email.toLowerCase() &&
                        pm.collegeRegNo === user.studentId)
                );
                if (!team.members.includes(user._id)) {
                    team.members.push(user._id);
                }

                await team.save();

                const existingRegistration = await Registration.findOne({
                    user: user._id,
                    event: team.event._id
                });

                if (!existingRegistration) {
                    await Registration.create({
                        user: user._id,
                        event: team.event._id,
                        team: team._id,
                        registrationType: 'team',
                        paymentStatus: team.event.registrationFee > 0 ? 'pending' : 'free'
                    });
                }

                await User.findByIdAndUpdate(user._id, {
                    $addToSet: {
                        teams: team._id,
                        registeredEvents: team.event._id
                    }
                });

                const Event = (await import('../models/eventModel.js')).default;
                await Event.findByIdAndUpdate(team.event._id, {
                    $addToSet: { participants: user._id }
                });

                matchedTeams.push(team);
            }
        }

        return {
            matched: matchedTeams.length,
            teams: matchedTeams
        };
    } catch (error) {
        console.error('Error auto-matching pending members:', error);
        throw error;
    }
};
