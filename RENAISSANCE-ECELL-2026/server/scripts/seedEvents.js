import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/eventModel.js';
import connectDB from '../config/db.js';

dotenv.config();

const events = [
    {
        name: "The Yellow King's Hackathon",
        description: "A 24-hour coding marathon where teams must solve mysterious algorithmic challenges. Inspired by the cryptic symbols and dark conspiracies of Carcosa, decode the patterns and build innovative solutions.",
        rules: "Teams of 2-4 members. Must submit working code and presentation. No plagiarism. Use any tech stack.",
        category: "Technical",
        date: new Date('2026-03-15T09:00:00'),
        venue: "CS Lab Block A",
        image: "/events/hackathon.jpg",
        eventType: "Team",
        minTeamSize: 2,
        maxTeamSize: 4,
        problemStatement: "Build a full-stack application that solves a real-world problem using AI/ML. The app should have a working frontend, backend API, and incorporate at least one ML model. Bonus points for dark UI themes inspired by crime investigation boards.",
        prizes: [
            { position: '1st', amount: '₹25,000 + Certificates' },
            { position: '2nd', amount: '₹15,000 + Certificates' },
            { position: '3rd', amount: '₹10,000 + Certificates' }
        ],
        eligibility: "Open to all college students. Basic coding knowledge required.",
        registrationDeadline: new Date('2026-03-10T23:59:59'),
        maxParticipants: null,
        registrationFee: 100,
        isRegistrationOpen: true
    },
    {
        name: "Carcosa Case Files: Web Dev Challenge",
        description: "Design and develop a crime investigation dashboard. Your team must create an immersive, dark-themed web application that would make even Rust Cohle proud.",
        rules: "Teams of 2-3. Must use modern web technologies. Responsive design mandatory. Deploy live before submission.",
        category: "Technical",
        date: new Date('2026-03-18T10:00:00'),
        venue: "Seminar Hall 1",
        image: "/events/webdev.jpg",
        eventType: "Team",
        minTeamSize: 2,
        maxTeamSize: 3,
        problemStatement: "Create a crime investigation dashboard with features like case timeline, evidence board, suspect profiles, and map visualization. Must include dark mode, real-time updates simulation, and interactive UI elements. Extra points for noir aesthetics.",
        prizes: [
            { position: '1st', amount: '₹20,000' },
            { position: '2nd', amount: '₹12,000' },
            { position: '3rd', amount: '₹8,000' }
        ],
        eligibility: "Undergrad and postgrad students. HTML/CSS/JS knowledge required.",
        registrationDeadline: new Date('2026-03-15T23:59:59'),
        maxParticipants: 40,
        registrationFee: 50,
        isRegistrationOpen: true
    },
    {
        name: "The Rust Code: Cybersecurity CTF",
        description: "Capture The Flag competition where teams hack through layers of mystery. Decrypt clues, exploit vulnerabilities, and uncover hidden flags in this digital detective challenge.",
        rules: "Teams of 2-5 members. No DDoS attacks. Ethical hacking only. All tools allowed.",
        category: "Technical",
        date: new Date('2026-03-20T14:00:00'),
        venue: "Online Platform",
        image: "/events/ctf.jpg",
        eventType: "Team",
        minTeamSize: 2,
        maxTeamSize: 5,
        problemStatement: "Navigate through 10 progressively difficult cybersecurity challenges including cryptography, reverse engineering, web exploitation, forensics, and steganography. Each solved challenge reveals a flag and unlocks the next mystery.",
        prizes: [
            { position: '1st', amount: '₹30,000 + Swag' },
            { position: '2nd', amount: '₹18,000' },
            { position: '3rd', amount: '₹12,000' }
        ],
        eligibility: "All students familiar with basic security concepts",
        registrationDeadline: new Date('2026-03-18T23:59:59'),
        maxParticipants: null,
        registrationFee: 150,
        isRegistrationOpen: true
    },
    {
        name: "Dora Lange's Data Quest",
        description: "A data science and ML competition. Teams must analyze cryptic datasets, find patterns in chaos, and build predictive models that would impress even the most meticulous detective.",
        rules: "Teams of 2-4. Use any ML framework. Submit Jupyter notebook and presentation. Accuracy and innovation both matter.",
        category: "Technical",
        date: new Date('2026-03-22T11:00:00'),
        venue: "AI Lab",
        image: "/events/datascience.jpg",
        eventType: "Team",
        minTeamSize: 2,
        maxTeamSize: 4,
        problemStatement: "Analyze a mystery crime dataset to predict case outcomes. Build classification models, perform exploratory data analysis, visualize patterns, and create a presentation explaining your detective methodology. Dataset will be provided on event day.",
        prizes: [
            { position: '1st', amount: '₹22,000' },
            { position: '2nd', amount: '₹14,000' },
            { position: '3rd', amount: '₹9,000' }
        ],
        eligibility: "Students with Python and basic ML knowledge",
        registrationDeadline: new Date('2026-03-20T23:59:59'),
        maxParticipants: 50,
        registrationFee: 75,
        isRegistrationOpen: true
    },
    {
        name: "Detectives' Design Derby",
        description: "UI/UX design competition with a noir theme. Teams must design interfaces for a fictional detective agency app - mood boards, wireframes, prototypes, the whole investigation.",
        rules: "Teams of 2-3. Use Figma/Adobe XD. Must create working prototype. Present your design thinking.",
        category: "Technical",
        date: new Date('2026-03-25T10:00:00'),
        venue: "Design Studio",
        image: "/events/design.jpg",
        eventType: "Team",
        minTeamSize: 2,
        maxTeamSize: 3,
        problemStatement: "Design a complete mobile app for a detective agency. Include screens for: case dashboard, evidence locker, interview notes, timeline builder, and suspect database. Must follow noir/true detective aesthetics with modern UX principles.",
        prizes: [
            { position: '1st', amount: '₹18,000 + Design Tools Subscription' },
            { position: '2nd', amount: '₹11,000' },
            { position: '3rd', amount: '₹7,000' }
        ],
        eligibility: "All students interested in design",
        registrationDeadline: new Date('2026-03-23T23:59:59'),
        maxParticipants: 30,
        registrationFee: 50,
        isRegistrationOpen: true
    },

    // INDIVIDUAL/SOLO EVENTS
    {
        name: "Solo Detective: Speed Coding Challenge",
        description: "Individual rapid-fire coding competition. Solve algorithmic mysteries under time pressure. Channel your inner Rust Cohle - focused, determined, relentless.",
        rules: "Solo participants only. 2 hours. Platform-based. Any language allowed. Score based on correctness and speed.",
        category: "Technical",
        date: new Date('2026-03-17T15:00:00'),
        venue: "Online Platform",
        image: "/events/speedcoding.jpg",
        eventType: "Solo",
        minTeamSize: 1,
        maxTeamSize: 1,
        problemStatement: "Solve 8-10 algorithmic problems of varying difficulty within 2 hours. Problems will range from easy array manipulations to complex dynamic programming and graph theory. Platform: HackerRank/CodeChef.",
        prizes: [
            { position: '1st', amount: '₹15,000' },
            { position: '2nd', amount: '₹10,000' },
            { position: '3rd', amount: '₹6,000' }
        ],
        eligibility: "All students with programming knowledge",
        registrationDeadline: new Date('2026-03-15T23:59:59'),
        maxParticipants: null,
        registrationFee: 50,
        isRegistrationOpen: true
    },
    {
        name: "The Interrogation Room: Tech Quiz",
        description: "Individual technical quiz covering CS fundamentals, latest tech trends, cybersecurity, and pop culture references to detective shows. Fast thinking required.",
        rules: "Solo event. MCQ format. Negative marking. Top scorers advance to rapid-fire round.",
        category: "Technical",
        date: new Date('2026-03-19T16:00:00'),
        venue: "Auditorium",
        image: "/events/quiz.jpg",
        eventType: "Solo",
        minTeamSize: 1,
        maxTeamSize: 1,
        problemStatement: "Two rounds: 1) Written MCQ round (50 questions, 45 mins) covering DSA, DBMS, OS, Networks, Security, and AI. 2) Rapid-fire buzzer round for top 10 participants (20 questions, instant answers required).",
        prizes: [
            { position: '1st', amount: '₹12,000 + Books' },
            { position: '2nd', amount: '₹8,000' },
            { position: '3rd', amount: '₹5,000' }
        ],
        eligibility: "All college students",
        registrationDeadline: new Date('2026-03-17T23:59:59'),
        maxParticipants: 100,
        registrationFee: 30,
        isRegistrationOpen: true
    },
    {
        name: "Code in the Dark: Blind Coding",
        description: "The ultimate test - code without seeing the output. Create a pixel-perfect replica of a mystery design using only HTML/CSS, with your monitor turned off. Detectives work in the dark.",
        rules: "Individual only. No preview allowed. HTML/CSS only. 15 minutes. Judged on accuracy.",
        category: "Technical",
        date: new Date('2026-03-21T17:00:00'),
        venue: "CS Lab Block B",
        image: "/events/blindcoding.jpg",
        eventType: "Solo",
        minTeamSize: 1,
        maxTeamSize: 1,
        problemStatement: "Replicate a given design using HTML and CSS within 15 minutes - with your screen completely off. A reference image will be shown before the timer starts. You'll code blind and see results only at the end. May the best detective win.",
        prizes: [
            { position: '1st', amount: '₹10,000' },
            { position: '2nd', amount: '₹6,000' },
            { position: '3rd', amount: '₹4,000' }
        ],
        eligibility: "Anyone who knows HTML/CSS",
        registrationDeadline: new Date('2026-03-19T23:59:59'),
        maxParticipants: 50,
        registrationFee: 40,
        isRegistrationOpen: true
    },
    {
        name: "The Long Bright Debug",
        description: "Individual debugging marathon. You're given intentionally broken code across multiple languages - find all bugs before time runs out. Perfect for detail-oriented minds.",
        rules: "Solo participation. Multiple rounds of increasing difficulty. Document all bugs found. Fastest and most accurate wins.",
        category: "Technical",
        date: new Date('2026-03-24T13:00:00'),
        venue: "Online Platform",
        image: "/events/debug.jpg",
        eventType: "Solo",
        minTeamSize: 1,
        maxTeamSize: 1,
        problemStatement: "Debug 5 progressively complex code snippets in Python, Java, JavaScript, C++, and SQL. Each snippet contains 3-5 intentional bugs (syntax, logic, runtime). Identify all bugs, fix them, and document the issues. Time limit: 90 minutes.",
        prizes: [
            { position: '1st', amount: '₹14,000' },
            { position: '2nd', amount: '₹9,000' },
            { position: '3rd', amount: '₹5,500' }
        ],
        eligibility: "Students familiar with multiple programming languages",
        registrationDeadline: new Date('2026-03-22T23:59:59'),
        maxParticipants: null,
        registrationFee: 35,
        isRegistrationOpen: true
    }
];

const seedEvents = async () => {
    try {
        await connectDB();

        // Clear existing events
        await Event.deleteMany({});
        console.log('🗑️  Cleared existing events');

        // Insert new events
        await Event.insertMany(events);
        console.log('✅ Successfully seeded events with True Detective theme!');
        console.log(`📊 Total events created: ${events.length}`);
        console.log(`   - Team events: ${events.filter(e => e.eventType === 'Team').length}`);
        console.log(`   - Solo events: ${events.filter(e => e.eventType === 'Solo').length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents();
