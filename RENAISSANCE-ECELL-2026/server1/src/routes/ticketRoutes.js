import express from 'express';
import { purchaseTicket, getAllTickets, verifyTicket, getTicketStatus, scanTicket } from '../controllers/ticketController.js';
import { requireAdminAuth } from '../middleware/admin-auth.js';
import { requireTrustedOrigin } from '../middleware/trusted-origin.js';

const router = express.Router();

// Public route to purchase a ticket
router.post('/purchase', purchaseTicket);

// Public route to get ticket status
router.get('/status/:ticketId', getTicketStatus);

// Admin routes use the same cookie-backed session as the current command center.
router.get('/admin', requireAdminAuth, getAllTickets);

router.patch('/admin/:id/verify', requireAdminAuth, requireTrustedOrigin, verifyTicket);
router.post('/admin/scan', requireAdminAuth, requireTrustedOrigin, scanTicket);

export default router;
