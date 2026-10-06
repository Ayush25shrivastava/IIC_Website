import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Team from '../models/teamModel.js';
import Event from '../models/eventModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`${colors.green}MongoDB Connected${colors.reset}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listTeams = async () => {
    await connectDB();

    console.log(`\n${colors.cyan}--- FETCHING ALL REGISTERED TEAMS ---${colors.reset}\n`);

    try {
        const teams = await Team.find()
            .populate('event', 'name')
            .sort({ createdAt: -1 });

        if (teams.length === 0) {
            console.log("No teams found.");
        } else {
            teams.forEach((team, index) => {
                console.log(`${colors.yellow}Team #${index + 1}: ${team.name}${colors.reset}`);
                console.log(`  Event: ${team.event?.name || 'Unknown Event'}`);
                console.log(`  Code:  ${team.teamCode}`);
                console.log(`  Leader: ${team.leader.name} (${team.leader.email})`);
                console.log(`  Members: ${team.members.length}`);
                team.members.forEach((m, i) => {
                    console.log(`    ${i + 1}. ${m.name} (${m.email})`);
                });
                console.log('');
            });
            console.log(`${colors.green}Total Teams: ${teams.length}${colors.reset}\n`);
        }
    } catch (error) {
        console.error(`Error fetching teams: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listTeams();
