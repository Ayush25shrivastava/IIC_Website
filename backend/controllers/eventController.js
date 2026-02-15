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
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }


        if (event.eventType === 'Team') {
            return res.status(400).json({
                success: false,
                message: 'This is a team event. Please create or join a team.'
            });
        }


        const existingRegistration = await Registration.findOne({
            user: userId,
            event: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }


        if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Event has reached maximum participants'
            });
        }


        const registration = await Registration.create({
            user: userId,
            event: eventId,
            registrationType: 'individual',
            paymentStatus: event.registrationFee > 0 ? 'pending' : 'free'
        });


        event.participants.push(userId);
        await event.save();

        await User.findByIdAndUpdate(userId, {
            $addToSet: { registeredEvents: eventId }
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
