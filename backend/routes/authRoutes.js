import express from 'express';
import passport from 'passport';
const router = express.Router();
import { googleCallback } from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);


export default router;