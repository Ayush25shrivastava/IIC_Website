import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getUserRegistrations,
    getUserTeams
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.get('/registrations', verifyToken, getUserRegistrations);
router.get('/teams', verifyToken, getUserTeams);

export default router;
