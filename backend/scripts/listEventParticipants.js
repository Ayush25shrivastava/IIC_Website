import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js'; // Needed for population
import Team from '../models/teamModel.js'; // Needed for population

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listParticipants = async () => {
    const eventNameArg = process.argv.slice(2).join(' ');

    if (!eventNameArg) {
        console.log(`${colors.red}Please provide an event name.${colors.reset}`);
        console.log(`Usage: node scripts/listEventParticipants.js <event_name>`);
        process.exit(1);
    }

    await connectDB();

    try {
        const event = await Event.findOne({
            name: { $regex: new RegExp(eventNameArg, 'i') }
        })
            .populate('participants', 'name email collegeRegNo')
            .populate({
                path: 'teams',
                populate: {
                    path: 'leader members',
                    select: 'name email collegeRegNo'
                }
            });

        if (!event) {
            console.log(`${colors.red}Event not found matching "${eventNameArg}"${colors.reset}`);
            process.exit(1);
        }

        console.log(`\n${colors.cyan}--- PARTICIPANT LIST FOR: ${event.name} ---${colors.reset}\n`);
        console.log(`Type: ${colors.yellow}${event.eventType}${colors.reset}`);

        if (event.eventType === 'Solo') {
            console.log(`Total Participants: ${colors.green}${event.participants.length}${colors.reset}\n`);
            if (event.participants.length > 0) {
                event.participants.forEach((p, i) => {
                    console.log(`${i + 1}. ${p.name} (${p.email}) - ${p.collegeRegNo || 'No RegNo'}`);
                });
            } else {
                console.log("No participants registered yet.");
            }
        } else {
            console.log(`Total Teams: ${colors.green}${event.teams.length}${colors.reset}\n`);
            if (event.teams.length > 0) {
                event.teams.forEach((team, i) => {
                    console.log(`${colors.yellow}Team #${i + 1}: ${team.name}${colors.reset} (Code: ${team.teamCode})`);
                    console.log(`  Leader: ${team.leader.name} (${team.leader.email})`);
                    console.log(`  Members:`);
                    team.members.forEach((m, j) => {
                        console.log(`    ${j + 1}. ${m.name} (${m.email})`);
                    });
                    console.log('');
                });
            } else {
                console.log("No teams registered yet.");
            }
        }
        console.log('');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listParticipants();
