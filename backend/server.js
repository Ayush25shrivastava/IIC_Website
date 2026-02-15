// server.js
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport'; // 1. Import Passport
import cors from 'cors';
import connectDB from './config/db.js';

// 2. Import your Passport Config Function
import passportConfig from './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

// 3. Initialize Passport
app.use(passport.initialize());

// 4. RUN THE CONFIGURATION (This fixes your error)
passportConfig(passport);

// 5. Routes (Must come AFTER step 4)
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/teams', teamRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));