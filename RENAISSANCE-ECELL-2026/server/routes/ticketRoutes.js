import express from 'express';
import { purchaseTicket, getAllTickets, verifyTicket } from '../controllers/ticketController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to purchase a ticket
router.post('/purchase', purchaseTicket);

// Admin route to get all tickets
router.get('/', verifyToken, isAdmin, getAllTickets);

// Admin route to verify/reject a ticket
router.patch('/:id/verify', verifyToken, isAdmin, verifyTicket);

export default router;
