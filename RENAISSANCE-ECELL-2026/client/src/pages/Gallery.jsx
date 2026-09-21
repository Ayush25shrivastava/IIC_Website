import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactFooter from "../components/ContactFooter";

const MASONRY_IMAGES = [
  { id: 1, src: "/past_events/Copy of REN (1).png", delay: 0.1, span: "col-span-2 row-span-2 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2" },
  { id: 10, src: "/past_events/Untitled design (3).png", delay: 0.15, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-2" },
  { id: 3, src: "/past_events/Copy of REN (5).png", delay: 0.2, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-2 xl:row-span-1" },
  { id: 14, src: "/past_events/Untitled design (8).png", delay: 0.15, span: "col-span-2 row-span-1 md:col-span-2 md:row-span-1 xl:col-span-1 xl:row-span-1" },
  { id: 5, src: "/past_events/Copy of REN (9).png", delay: 0.1, span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2" },
  
  { id: 12, src: "/past_events/Untitled design (6).png", delay: 0.25, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1" },
  { id: 7, src: "/past_events/Copy of REN.png", delay: 0.2, span: "col-span-2 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-2 xl:row-span-1" },
  { id: 8, src: "/past_events/Untitled design (1).png", delay: 0.25, span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2" },
  { id: 2, src: "/past_events/Copy of REN (4).png", delay: 0.15, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-2 xl:col-span-1 xl:row-span-2" },
  { id: 16, src: "/past_events/Untitled design (10).png", delay: 0.25, span: "col-span-2 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1" },

  { id: 11, src: "/past_events/Untitled design (4).png", delay: 0.2, span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2" },
  { id: 6, src: "/past_events/Copy of REN (12).png", delay: 0.15, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-2 xl:col-span-1 xl:row-span-2" },
  { id: 13, src: "/past_events/Untitled design (7).png", delay: 0.1, span: "col-span-2 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-2 xl:row-span-1" },
  { id: 4, src: "/past_events/Copy of REN (8).png", delay: 0.25, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1" },
  { id: 15, src: "/past_events/Untitled design (9).png", delay: 0.2, span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2" },

  { id: 9, src: "/past_events/Untitled design (2).png", delay: 0.1, span: "col-span-2 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1" },
  { id: 17, src: "/past_events/Untitled design (11).png", delay: 0.1, span: "col-span-1 row-span-1 md:col-span-2 md:row-span-1 xl:col-span-2 xl:row-span-1" },
  { id: 18, src: "/past_events/Untitled design (12).png", delay: 0.15, span: "col-span-1 row-span-1 md:col-span-1 md:row-span-2 xl:col-span-2 xl:row-span-2" },
  { id: 19, src: "/past_events/Untitled design.png", delay: 0.2, span: "col-span-2 row-span-1 md:col-span-2 md:row-span-1 xl:col-span-1 xl:row-span-1" }
];

const PAST_SPEAKERS = [
  { id: 1, name: "Brajesh Maheshwari", designation: "Director of Allen career institute", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlAt6fhjuH78w28TfoD4ig2YgoyJTITMGxl6kzuesfJB2l7kfxAVJn6UQ&s=10" },
  { id: 2, name: "VIJENDER SINGH CHAUHAN", designation: "Interviewer,Communicator, Personality Evaluator, Teacher, Academic, Keynote Speaker- 13xTEDx", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnnnCo-nr9XoghsQhqGUvmi5CVNDKtOKbFo64025xL9EhcGi8b9xiZO5JG&s=10" },
  { id: 3, name: "anugrah agnihotri", designation: "Former Senior Software Engineer At Citrix And Bcg Consultant,Building DOT", img: "https://media.licdn.com/dms/image/v2/D5622AQEl4D26hcgXCw/feedshare-shrink_800/B56ZSMsWQpHQAg-/0/1737527230400?e=2147483647&v=beta&t=3bTVbPxvHraHGu0bQbfba7hPs4kEHUVU3_lHLi-3NYE", objectPosition: "object-top" },
  { id: 4, name: "jagriti kesarwani", designation: "former program  manager at google, digital strategist", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPzwGZznHyyCoJht9PNiYXvT54EGa6nPVXHO6IQhF_uQ&s=10" },
  { id: 5, name: "acyuta mohan das", designation: "CSR Strategist,Value Edu Consultant", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmTlnZtU_Ts0npX5INpnpcb2UX54E8MYGGyN1icZVWUA&s=10" },
  { id: 5, name: "akshay singh", designation: "India's only Paranormal Illusionist,  Indian Mentalist, Ethical Hacker", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9YpzAIpz6rk5ZFOPnu3SuKUPMhVI8bh1EAyR3qHP8Bw&s=10" },
  { id: 5, name: "neha agarwal", designation: "Founder of mathematically inclined", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS36KANgvdTvmh1Yn3l9QZXTDwX73HVJHrUrcF0CmTgfQ&s=10" },
  { id: 5, name: "NEELAM JAIN", designation: "FOUNDER & CEO,PERIFERRY & FORBES 30U30 2021", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfRdEsJIOlWf5obecfCFFTAqvsTl6zr9oPaJsb5_Enig&s=10" },
  { id: 5, name: "Sandeep Jain", designation: "Founder & CEO,GeeksforGeeksCSR", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmRzNak8wdLRti5FPCSyfzeI4zrMZUzDMBi6hHUBhupQ&s=10" },
  { id: 5, name: "SHRIYA LUHIA", designation: "FIRST FEMALE F1 RACER", img: "https://img.etimg.com/photo/msid-119117114,imgsize-49392/ShriyaLohia.jpg" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const marqueeRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const container = marqueeRef.current;
    if (!container) return;

    let animationFrameId;
    // Initialize scroll position in the middle to allow seamless left scrolling
    container.scrollLeft = container.scrollWidth / 2;

    const animate = () => {
      if (!isHovered.current) {
        container.scrollLeft -= 1.5; // Controls the auto-scroll speed left-to-right
      }
      
      // Infinite wrap logic
      if (container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2;
      } else if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <main className="relative min-h-[100svh] w-full overflow-x-hidden bg-scroll bg-gradient-to-br from-[#9AC8DB] via-[#D3E3DD] to-[#F4EBD9] font-montserrat text-[#0C2B3D] selection:bg-[#C5A25F] selection:text-white md:bg-fixed">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Intro Header */}
      <section className="relative z-10 flex min-h-[52svh] w-full flex-col justify-end overflow-hidden px-4 pb-12 pt-24 sm:min-h-[60vh] sm:px-6 sm:pb-24 lg:px-24">
        {/* Ocean Image Background fading into transparent */}
        <div className="absolute inset-0 pointer-events-none -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]">
          <img
            src="/bg_images/events.png"
            alt="Renaissance Ocean Voyage"
            aria-hidden="true"
            className="h-full w-full object-cover object-top opacity-60 mix-blend-multiply"
            draggable="false"
          />
        </div>
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="font-cinzel text-6xl md:text-[8vw] font-extrabold text-[#0C2B3D] leading-none uppercase tracking-tight"
          >
            Archive
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
          className="mt-8 flex items-center gap-6"
        >
          <div className="h-px w-24 sm:w-48 bg-[#C5A25F] opacity-60"></div>
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#8E6422] uppercase font-bold">
            A visual documentation of past expeditions
          </p>
        </motion.div>
      </section>

      {/* Past Speakers Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full py-16 sm:py-24 overflow-hidden"
      >
        <div className="px-6 lg:px-24 mb-16 text-center sm:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block"
          >
            <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0C2B3D] tracking-tight uppercase">
              Past Speakers
            </h2>
            <div className="h-[2px] w-1/2 sm:w-2/3 bg-[#C5A25F] opacity-80 mt-4 mx-auto sm:mx-0"></div>
          </motion.div>
        </div>

        {/* Infinite Marquee Left to Right with Manual Scroll */}
        <div className="w-full overflow-hidden relative">
          <div 
            ref={marqueeRef}
            onMouseEnter={() => isHovered.current = true}
            onMouseLeave={() => isHovered.current = false}
            className="flex w-full cursor-grab overflow-x-auto py-5 active:cursor-grabbing hide-scrollbar sm:py-8"
          >
            {[...PAST_SPEAKERS, ...PAST_SPEAKERS, ...PAST_SPEAKERS, ...PAST_SPEAKERS].map((speaker, idx) => (
              <div
                key={`${speaker.id}-${idx}`}
                onClick={() => {
                  if (window.matchMedia("(pointer: coarse)").matches) {
                    isHovered.current = !isHovered.current;
                  }
                }}
                className="group mx-3 w-[78vw] max-w-[280px] flex-shrink-0 cursor-pointer sm:mx-8 sm:w-80 sm:max-w-none"
              >
                
                {/* Image Container with Offset Square */}
                <div className="relative w-full aspect-square mb-6">
                  {/* Solid background offset (Blue matching theme text color) */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-full h-full bg-[#0C2B3D] transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
                  
                  {/* Portrait */}
                  <div className="relative w-full h-full overflow-hidden bg-[#F4EBD9]">
                    <img 
                      src={speaker.img} 
                      alt={speaker.name} 
                      className={`w-full h-full object-cover ${speaker.objectPosition || 'object-center'} filter lg:grayscale lg:contrast-125 lg:brightness-90 lg:group-hover:grayscale-0 lg:group-hover:contrast-100 lg:group-hover:brightness-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]`} 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#C5A25F]/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="pl-4 sm:pl-5 border-l-2 border-[#C5A25F] group-hover:border-[#0C2B3D] transition-colors duration-500">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0C2B3D] uppercase tracking-wide leading-tight">
                    {speaker.name}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-xs text-[#8E6422] uppercase tracking-widest mt-1.5 font-bold">
                    {speaker.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Masonry Grid Layout (Archive) */}
      <section className="relative z-10 w-full px-2 sm:px-4 md:px-6 pb-32">
        <div className="px-3 sm:px-0 mb-12 sm:mb-16 text-center sm:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block"
          >
            <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0C2B3D] tracking-tight uppercase">
              Event Photos
            </h2>
            <div className="h-[2px] w-1/2 sm:w-2/3 bg-[#C5A25F] opacity-80 mt-4 mx-auto sm:mx-0"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] gap-3 sm:gap-4 md:gap-5 grid-flow-dense w-full">
          {MASONRY_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                ease: [0.19, 1, 0.22, 1],
                delay: img.delay 
              }}
              layoutId={`gallery-img-${img.id}`}
              onClick={() => setSelectedImage(img)}
              className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-[#E8D7C2]/30 group cursor-pointer w-full h-full ${img.span || ''}`}
            >
              <img
                src={img.src}
                alt={`Archive capture ${index + 1}`}
                className="w-full h-full object-cover object-center block filter contrast-[1.05] brightness-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0A2239] opacity-[0.03] mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      <ContactFooter />

      {/* Click-to-Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center bg-[#0C2B3D]/90 p-3 pt-16 backdrop-blur-md cursor-zoom-out sm:p-8 sm:pt-20"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-24 right-6 sm:top-28 sm:right-8 lg:right-12 z-[110] flex items-center justify-center w-12 h-12 rounded-full bg-[#F4EBD9]/10 text-[#F4EBD9] hover:bg-[#F4EBD9]/20 transition-colors border border-[#F4EBD9]/20 shadow-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 1L1 13M1 1L13 13" />
              </svg>
            </button>

            <motion.div 
              layoutId={`gallery-img-${selectedImage.id}`}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt="Enlarged Archive Capture"
                className="w-full h-full object-contain rounded-lg shadow-2xl filter contrast-[1.05]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
