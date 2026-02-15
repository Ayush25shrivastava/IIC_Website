import express from 'express';
import {
    createTeam,
    getTeamDetails,
    updateTeam,
    deleteTeam,
    getMyTeams
} from '../controllers/teamController.js';

const router = express.Router();


import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createTeam);              
router.get('/:id', getTeamDetails);        
router.put('/:id', updateTeam);            
router.delete('/:id', deleteTeam);         
router.post('/my-teams', getMyTeams);      

export default router;
