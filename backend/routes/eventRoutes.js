import express from 'express';
import {
    getAllEvents,
    getEventById,
    registerForEvent,
    getEventParticipants
} from '../controllers/eventController.js';
import { verifyToken, isEventOpen } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/:id/participants', getEventParticipants);
router.post('/:id/register', verifyToken, isEventOpen, registerForEvent);

export default router;
