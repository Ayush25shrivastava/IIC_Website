import mongoose from 'mongoose';
import Event from '../models/eventModel.js';
import Registration from '../models/registrationModel.js';
import Team from '../models/teamModel.js';
import User from '../models/userModel.js';

export const getAllEvents = async (req, res) => {
    try {
        const { category, eventType, search } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (eventType) {
            filter.eventType = eventType;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(filter)
            .sort({ date: 1 })
            .select('-participants -teams');

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('participants', 'name email avatar')
            .populate({
                path: 'teams',
                populate: {
                    path: 'leader members',
                    select: 'name email avatar'
                }
            });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const registerForEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        console.log(eventId);
        

        const { teamId } = req.body;
        const userId = req.user._id;

        // 1. Robust Query: Support both MongoDB ObjectId and Event Name
        let query = {};
        if (mongoose.Types.ObjectId.isValid(eventId)) {
            query = { _id: eventId };
        } else {
            query = { name: { $regex: new RegExp(`^${eventId}$`, 'i') } };
        }

        const event = await Event.findOne(query);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event not found for identifier: ${eventId}`
            });
        }

        // Use the true MongoDB ObjectId for all database relations going forward
        const actualEventId = event._id;
        let registrationType = 'individual';

        // 2. Validate Team logic if the Event Type is Team
        if (event.eventType === 'Team') {
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: 'This is a team event. Please provide a teamId.'
                });
            }

            const team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found.'
                });
            }

            // Verify the user is actually part of this team
            const isLeader = team.leader.email === req.user.email.toLowerCase();
            const isMember = team.members.some(m => m.email === req.user.email.toLowerCase());

            if (!isLeader && !isMember) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not a member of this team.'
                });
            }

            registrationType = 'team';
        }

        // 3. Prevent Double Registration using the actualEventId
        const existingRegistration = await Registration.findOne({
            user: userId,
            event: actualEventId
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // 4. Ensure Max Participants aren't exceeded
        if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Event has reached maximum participants'
            });
        }

        // 5. Create Registration
        const registration = await Registration.create({
            user: userId,
            event: actualEventId,
            team: teamId || null,
            registrationType,
            paymentStatus: event.registrationFee > 0 ? 'pending' : 'free'
        });

        // 6. Update associated models
        event.participants.push(userId);
        await event.save();

        await User.findByIdAndUpdate(userId, {
            $addToSet: { registeredEvents: actualEventId }
        });

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            data: registration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getEventParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {

            query = { name: { $regex: new RegExp(`^${id}$`, 'i') } };
        }

        const event = await Event.findOne(query)
            .populate('participants', 'name email avatar collegeName')
            .populate({
                path: 'teams',
                populate: {
                    path: 'leader members',
                    select: 'name email avatar'
                }
            });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                individualParticipants: event.participants,
                teams: event.teams,
                totalIndividual: event.participants.length,
                totalTeams: event.teams.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
