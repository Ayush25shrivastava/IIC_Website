import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Alias for consistency
export const verifyToken = protect;

// Check if user is team leader
export const isTeamLeader = async (req, res, next) => {
  try {
    const { id: teamId } = req.params;
    const Team = (await import('../models/teamModel.js')).default;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.'
      });
    }

    if (team.leader.email !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can perform this action.'
      });
    }

    req.team = team;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check if event registration is still open
export const isEventOpen = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const Event = (await import('../models/eventModel.js')).default;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event.'
      });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed.'
      });
    }

    req.event = event;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { protect };