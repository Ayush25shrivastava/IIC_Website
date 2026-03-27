import React from 'react';
import { motion } from 'framer-motion';
import udbhav from '../assets/udbhav image.png';
import tedx from "../assets/WhatsApp Image 2026-03-21 at 1.09.44 AM.png";
import renaissance from "../assets/WhatsApp Image 2026-03-21 at 1.08.30 AM.jpeg";
import mnnit from "../assets/mnnit image.png";
import IICFooter from "../components/IICFooter"

const IICPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#0E0E0E] font-merriweather selection:bg-[#B8A18A] selection:text-white">
      <style>{`
        * { cursor: auto !important; }
        a, button, [role="button"], input { cursor: pointer !important; }
        .custom-cursor-container { display: none !important; }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${mnnit})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6 text-[#fdfbf7]"
        >
          <h1 className="text-5xl md:text-8xl font-playfair font-black tracking-tight mb-8 leading-tight drop-shadow-xl">
            INSTITUTION'S <span className="text-[#B8A18A]">INNOVATION</span> COUNCIL
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto font-merriweather leading-relaxed text-[#fdfbf7]/90 drop-shadow-md">
            Nurturing ideas, fostering entrepreneurs, and building the future of technology.
          </p>
        </motion.div>

        <div className="absolute top-[87.5%] w-full">
          <LiveBar />
        </div>
      </section>

      {/* ABOUT CARD */}
      <section id="aboutus" className="py-20 px-6">
      <section className="flex justify-center">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-16 rounded-[2rem] bg-white border border-[#d1ccc0] shadow-[15px_15px_40px_rgba(0,0,0,0.08)]"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-black mb-8 text-center text-[#0E0E0E]">About IIC</h2>
            <p className="text-[#0E0E0E]/80 leading-loose text-lg md:text-xl text-center md:text-left">
              ​An Initiative under the Ministry of Education (MoE) and AICTE
​The Institution’s Innovation Council (IIC) at Motilal Nehru National Institute of Technology (MNNIT) Allahabad was established under the mandate of the Ministry of Education’s Innovation Cell (MIC). Its primary objective is to systematically foster the culture of Innovation and Entrepreneurship (I&E) amongst students and faculty and promote innovations in fields like IoT, AI/ML, healthcare, and agritech.
            </p>
          </motion.div>
        </div>
      </section>
      </section>

      {/* FUNCTION + FOCUS */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">

          <GlassCard title="Vision of Institutes’s Innovation Council" content={`
              ​To establish a sustainable, globally recognized innovation ecosystem at MNNIT Allahabad that nurtures creativity, facilitates deep-tech research, and drives the development of indigenous technologies and successful startups.
              To promote ethical innovation, inclusivity, and long-term societal impact through technology and entrepreneurship.
              To create an environment where students are encouraged to think critically, experiment freely, and translate ideas into practical solutions addressing real-world challenges.
          `} />

          <GlassCard title="IIC – Mission" content={`
                ​To Cultivate: Foster a pervasive culture of innovation through structured ideation workshops, design challenges, and hackathons in alignment with the National Innovation and Startup Policy (NISP).
                ​To Incubate: Provide state-of-the-art infrastructure, mentorship, and administrative support to early-stage startups.
                ​To Accelerate: Facilitate the commercialization of Intellectual Property (IP) and technology transfer by connecting innovators with angel investors, venture capitalists, and government grants.

          `} />

        </div>
      </section>

      {/* EVENT CARDS */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

          <EventCard 
            image={tedx} 
            title="TEDx MNNIT"
            description="Experience world-class speakers and ideas worth spreading."
            link="#" 
          />

          <EventCard 
            image={udbhav} 
            title="Udbhav"
            description="The flagship tech-management-cultural festival of the Institute."
            link="/udbhav" 
          />
          
          <EventCard 
            image={renaissance} 
            title="Renaissance"
            description="The annual entrepreneurship summit fostering business acumen."
            link="#" 
          />

        </div>
      </section>

      <div className="pb-24">
        <LiveBar />
      </div>

      <IICFooter /> 

    </div>
  );
};

const LiveBar = () => (
  <div className="bg-[#0E0E0E] py-4 overflow-hidden border-y border-[#B8A18A]/30">
    <div className="flex w-max animate-marquee">

      {[...Array(2)].map((_, idx) => (
        <div key={idx} className="flex">
          {[1,2,3,4].map(i => (
            <a
              key={i}
              href="/udbhav"
              className="mx-12 text-[#B8A18A] font-merriweather tracking-widest uppercase flex items-center gap-3 hover:text-[#fdfbf7] transition-colors"
            >
              <span className="animate-spin inline-block text-xs">◆</span>
              ✨ Udbhav is <span className='text-[#fdfbf7] font-bold'>Live Now</span> — Register Today 🚀
              <span className="animate-spin inline-block text-xs">◆</span>
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
    className="p-10 md:p-12 rounded-[2rem] bg-white border border-[#d1ccc0] shadow-[15px_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[20px_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500"
  >
    <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-6 text-[#0E0E0E]">{title}</h3>
    <p className="whitespace-pre-line text-[#0E0E0E]/80 leading-loose text-sm md:text-base">
      {content}
    </p>
  </motion.div>
);

const ImageButton = ({ image, link }) => (
  <motion.a
    href={link}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="relative h-56 rounded-2xl overflow-hidden shadow-xl cursor-pointer block"
  >
    <img
      src={image}
      alt="event"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300" />
  </motion.a>
);

const EventCard = ({ image, title, description, link }) => (
  <motion.div
    className="rounded-[2rem] border border-[#d1ccc0] bg-white shadow-[15px_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[20px_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden group"
  >
    <div className="p-6 md:p-8 flex flex-col h-full bg-[#fdfbf7]/50">

      <a href={link} rel="noopener noreferrer" className="overflow-hidden rounded-2xl mb-6 block">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-fill transform group-hover:scale-110 transition-transform duration-700"
        />
      </a>

      <h3 className="text-2xl font-playfair font-bold mb-4 text-[#0E0E0E]">
        {title}
      </h3>

      <p className="text-[#0E0E0E]/70 text-sm md:text-base flex-grow leading-relaxed whitespace-pre-line">
        {description}
      </p>

      <a href={link} rel="noopener noreferrer" className="mt-8 block">
        <button
          className="w-full py-4 rounded-xl bg-[#0E0E0E] text-[#fdfbf7] font-merriweather uppercase tracking-widest text-xs font-bold shadow-[5px_5px_15px_rgba(0,0,0,0.2)] hover:bg-[#B8A18A] hover:text-[#0E0E0E] hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer"
        >
          Explore / Register
        </button>
      </a>

    </div>
  </motion.div>
);

export default IICPage;