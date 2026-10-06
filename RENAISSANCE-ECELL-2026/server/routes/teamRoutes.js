import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
    createTeam,
    getTeamDetails,
    updateTeam,
    deleteTeam,
    getMyTeams,
    joinTeam
} from '../controllers/teamController.js';

const router = express.Router();

// 1. STATIC ROUTES GO FIRST
router.post('/create', verifyToken, createTeam);
router.post('/join', verifyToken, joinTeam);
router.get('/my-teams', verifyToken, getMyTeams); // <-- This MUST be above /:id

// 2. DYNAMIC ROUTES GO LAST
router.get('/:id', getTeamDetails);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

export default router;