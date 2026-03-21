import React from 'react';
import { motion } from 'framer-motion';
import udbhav from '../assets/udbhav-logo.png';
import tedx from "../assets/WhatsApp Image 2026-03-21 at 1.08.30 AM.jpeg";
import renaissance from "../assets/WhatsApp Image 2026-03-21 at 1.09.44 AM.jpeg";

const IICPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://www.mnnit.ac.in/dic2020/aboutus.png')` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            INSTITUTION'S <span className="text-blue-400">INNOVATION</span> COUNCIL
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium text-gray-200">
            Nurturing ideas, fostering entrepreneurs, and building the future of technology.
          </p>
        </motion.div>

        <div className="absolute top-[87.5%] w-full">
          <LiveBar />
        </div>
      </section>

      {/* ABOUT CARD */}
      <section className="py-24 px-6 flex justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">About IIC</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Ministry of Human Resource Development (MHRD), Govt. of India has established ‘MHRD’s Innovation Cell (MIC)’ to systematically foster the culture of Innovation amongst all Higher Education Institutions (HEIs). The primary mandate of MIC is to encourage, inspire and nurture young students by supporting them to work with new ideas while they are in formative years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FUNCTION + FOCUS */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          <GlassCard title="Functions of Institutes’s Innovation Council" content={`
1.To conduct various innovation and entrepreneurship-related activities prescribed by Central MIC in time bounded fashion.
2. Identify and reward innovations and share success stories.
3.Organize periodic workshops/ seminars/ interactions with entrepreneurs, investors, professionals and create a mentor pool for student innovators.
4.Network with peers and national entrepreneurship development organizations.
5. Create an Institution’s Innovation portal to highlight innovative projects carried out by institution’s faculty and students.
6. Organize Hackathons, idea competition, mini-challenges etc with the involvement of industries.
          `} />

          <GlassCard title="IIC – Focus" content={`
Major Focus of IIC
1. To create a vibrant local innovation ecosystem
2. Start-up/ entrepreneurship supporting Mechanism in HEIs
3. Prepare institute for Atal Ranking of Institutions on Innovation Achievements Framework (ARRIA)
4.Establish Function Ecosystem for Scouting Ideas and Pre-incubation of Ideas
5. Develop better Cognitive Ability amongst Technology Students
          `} />

        </div>
      </section>

      {/* EVENT CARDS */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <ImageButton image={tedx} link="/" />
          <ImageButton image={renaissance} link="/" />
          <ImageButton image={udbhav} link="/udbhav" />

        </div>
      </section>

      <div className="pb-24">
        <LiveBar />
      </div>

    </div>
  );
};

const LiveBar = () => (
  <div className="bg-neutral-900 py-3 overflow-hidden">
    <div className="flex w-max animate-marquee">

      {[...Array(2)].map((_, idx) => (
        <div key={idx} className="flex">
          {[1,2,3,4].map(i => (
            <a
              key={i}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-10 text-amber-200 font-semibold tracking-widest uppercase flex items-center gap-2 hover:text-white transition"
            >
              <span className="animate-spin inline-block">●</span>
              ✨ Udbhav is <span className='text-red-400'>Live Now</span> — Register Today 🚀
              <span className="animate-spin inline-block">●</span>
            </a>
          ))}
        </div>
      ))}

    </div>
  </div>
);

const GlassCard = ({ title, content }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200 shadow-md"
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
      {content}
    </p>
  </motion.div>
);

const EventCard = ({ image, title, description, link }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-lg transition"
  >
    <div className="p-5 flex flex-col h-full">

      <a href={link} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      </a>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">
        {title}
      </h3>

      <p className="text-gray-600 text-sm flex-grow leading-relaxed whitespace-pre-line">
        {description}
      </p>

      <a href={link} target="_blank" rel="noopener noreferrer" className="mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition"
        >
          Register Now
        </motion.button>
      </a>

    </div>
  </motion.div>
);

export default IICPage;