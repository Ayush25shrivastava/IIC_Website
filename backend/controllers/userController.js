import User from '../models/userModel.js';
import Event from '../models/eventModel.js';
import Team from '../models/teamModel.js';
import Registration from '../models/registrationModel.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'registeredEvents',
                select: 'name category date eventType'
            })
            .populate({
                path: 'teams',
                populate: {
                    path: 'event',
                    select: 'name date'
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, collegeName, studentId, branch, year, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (name) user.name = name;
        if (collegeName) user.collegeName = collegeName;
        if (studentId) user.studentId = studentId;
        if (branch) user.branch = branch;
        if (year) user.year = year;
        if (phone) user.phone = phone;

        if (user.name && user.email && user.collegeName && user.studentId) {
            user.isProfileComplete = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id })
            .populate('event', 'name category date venue eventType')
            .populate({
                path: 'team',
                populate: {
                    path: 'leader members',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            $or: [
                { 'leader.email': req.user.email.toLowerCase() },
                { 'members.email': req.user.email.toLowerCase() }
            ]
        })
            .populate('event', 'name date eventType');

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
