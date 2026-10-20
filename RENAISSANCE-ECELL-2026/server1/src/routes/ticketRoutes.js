import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
    purchaseTicket, getAllTickets, verifyTicket, updateTicket, getTicketStatus, scanTicket,
    getTicketStageConfigs, addTicketStage, deleteTicketStage,
    setTicketSoldOut,
} from '../controllers/ticketController.js';
import { requireAdminAuth } from '../middleware/admin-auth.js';
import { requireTrustedOrigin } from '../middleware/trusted-origin.js';
import { requireVolunteerScanner } from '../middleware/volunteer-scanner-auth.js';
import {
    adminListVolunteerScanners,
    adminSetVolunteerScannerStatus,
    getVolunteerScannerSession,
    loginVolunteerScanner,
    logoutVolunteerScanner,
    registerVolunteerScanner,
} from '../controllers/volunteer-scanner.controller.js';

const volunteerLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler(_req, res) {
        res.status(429).json({ success: false, message: 'Too many sign-in attempts. Try again later.' });
    },
});
const volunteerRegisterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler(_req, res) {
        res.status(429).json({ success: false, message: 'Too many access requests. Try again later.' });
    },
});

const router = express.Router();

// Public route to purchase a ticket
router.post('/purchase', purchaseTicket);
router.get('/availability', getTicketStageConfigs);

// Public route to get ticket status
router.get('/status/:ticketId', getTicketStatus);

// Volunteer requests are reviewed by admins before they can use scanner routes.
router.post('/volunteer/register', requireTrustedOrigin, volunteerRegisterLimiter, registerVolunteerScanner);
router.post('/volunteer/login', requireTrustedOrigin, volunteerLoginLimiter, loginVolunteerScanner);
router.get('/volunteer/session', requireVolunteerScanner, getVolunteerScannerSession);
router.post('/volunteer/logout', requireTrustedOrigin, logoutVolunteerScanner);
router.get('/volunteer/stages', requireVolunteerScanner, getTicketStageConfigs);
router.post('/volunteer/scan', requireVolunteerScanner, requireTrustedOrigin, scanTicket);

// Admin routes use the same cookie-backed session as the current command center.
router.get('/admin/stages', requireAdminAuth, getTicketStageConfigs);
router.get('/admin/volunteers', requireAdminAuth, adminListVolunteerScanners);
router.patch('/admin/volunteers/:id/status', requireAdminAuth, requireTrustedOrigin, adminSetVolunteerScannerStatus);
router.patch('/admin/availability/:ticketType', requireAdminAuth, requireTrustedOrigin, setTicketSoldOut);
router.post('/admin/stages/:ticketType', requireAdminAuth, requireTrustedOrigin, addTicketStage);
router.delete('/admin/stages/:ticketType/:stageId', requireAdminAuth, requireTrustedOrigin, deleteTicketStage);
router.get('/admin', requireAdminAuth, getAllTickets);

router.patch('/admin/:id', requireAdminAuth, requireTrustedOrigin, updateTicket);
router.patch('/admin/:id/verify', requireAdminAuth, requireTrustedOrigin, verifyTicket);
router.post('/admin/scan', requireAdminAuth, requireTrustedOrigin, scanTicket);

export default router;
