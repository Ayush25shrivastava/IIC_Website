import React, { useEffect, useRef } from "react";
import faculty from "../data/faculty.json";
import fourthYear from "../data/fourth_year.json";
import thirdYear from "../data/third_year.json";
import secondYear from "../data/second_year.json";
import { FaLinkedin } from "react-icons/fa";
import gsap from "gsap";

import detBg from "../assets/watch.jpg";

const Card = ({ member }) => {
  return (
    <div className="relative group w-[260px] rounded-xl transition-all duration-300 hover:scale-105">

      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 border-2 border-[#d6b89a] shadow-[0_0_25px_rgba(214,184,154,0.6)]"></div>

      {/* Card body */}
      <div className="relative bg-[#e6d6c3] border border-[#c4ad93] rounded-xl p-4 
      shadow-[0_18px_45px_rgba(0,0,0,0.35)] 
      group-hover:shadow-[0_28px_65px_rgba(0,0,0,0.5)] 
      transition-all duration-300">

        
        <div className="absolute inset-0 rounded-xl border border-[#f1e4d6]/40 pointer-events-none"></div>

        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 rounded-xl pointer-events-none"></div>

        {/* Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden border border-[#cdb79e]">
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-[200px] object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="font-playfair text-xl font-semibold text-[#2b1f17]">
            {member.name}
          </h3>

          {member.registration_no && (
            <p className="text-xs tracking-widest text-[#6e5c4b] mb-4">
              REG: {member.registration_no}
            </p>
          )}

          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-[#6e5c4b] hover:text-[#2b1f17] transition"
          >
            <FaLinkedin size={18} />
            <span className="text-xs tracking-widest uppercase">
              LinkedIn
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

const ConciseCard = ({ member }) => {
  return (
    <div className="relative group w-[260px] rounded-xl transition-all duration-300 hover:scale-105 h-[160px]">

      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 border-2 border-[#d6b89a] shadow-[0_0_25px_rgba(214,184,154,0.6)]"></div>

      {/* Card body */}
      <div className="relative bg-[#e6d6c3] border border-[#c4ad93] rounded-xl p-5 h-full
      shadow-[0_18px_45px_rgba(0,0,0,0.35)] 
      group-hover:shadow-[0_28px_65px_rgba(0,0,0,0.5)] 
      transition-all duration-300 flex flex-col justify-center items-center">

        
        <div className="absolute inset-0 rounded-xl border border-[#f1e4d6]/40 pointer-events-none"></div>

        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 rounded-xl pointer-events-none"></div>

        {/* Info */}
        <div className="text-center relative z-10 w-full flex flex-col items-center h-full justify-center">
          <h3 className="font-playfair text-[1.15rem] font-semibold text-[#2b1f17] mb-1 leading-tight flex-grow flex items-center">
            {member.name}
          </h3>

          {member.registration_no && (
            <p className="text-xs tracking-widest text-[#6e5c4b] mt-1">
              REG: {member.registration_no}
            </p>
          )}

          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[#6e5c4b] hover:text-[#2b1f17] transition bg-[#c4ad93]/30 py-2 px-4 rounded-lg border border-[#c4ad93]/50 hover:bg-[#c4ad93]/50 w-full"
          >
            <FaLinkedin size={18} />
            <span className="text-xs tracking-widest uppercase">
              LinkedIn
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

const HorizontalScroll = ({ team, isConcise = false }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (team.length <= 3) return;

    const el = scrollRef.current;
    const totalWidth = el.scrollWidth / 2;

    const animation = gsap.to(el, {
      x: -totalWidth,
      duration: 30,
      ease: "linear",
      repeat: -1
    });

    const pause = () => animation.pause();
    const resume = () => animation.resume();

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      animation.kill();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [team]);

  if (team.length <= 3) {
    return (
      <div className="flex justify-center gap-12 flex-wrap">
        {team.map((member) => (
          isConcise ? <ConciseCard key={member.registration_no} member={member} /> : <Card key={member.registration_no} member={member} />
        ))}
      </div>
    );
  }

  const duplicated = [...team, ...team];

  return (
    <div className="overflow-hidden w-full">
      <div ref={scrollRef} className="flex gap-10 w-max items-center">
        {duplicated.map((member, index) => (
          isConcise ? <ConciseCard key={index} member={member} /> : <Card key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="text-center mb-14 group">
    <h2 className="text-4xl md:text-5xl font-playfair text-[#f5e6d3] tracking-wide
    relative inline-block transition-all duration-500 group-hover:scale-105
    drop-shadow-[0_0_12px_rgba(214,184,154,0.7)]">
      
      {children}

      <span className="block h-[3px] w-16 bg-[#d6b89a] mx-auto mt-3 rounded-full
      shadow-[0_0_12px_rgba(214,184,154,0.9)] transition-all duration-500
      group-hover:w-24"></span>

    </h2>
  </div>
);

const Teams = () => {
  return (
    <div className="relative min-h-screen text-white pb-32 overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${detBg})` }}
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-16">

        {/* Page Title */}
        <h1 className="text-6xl md:text-7xl font-playfair text-center mb-6 text-[#f5e6d3]
        drop-shadow-[0_0_15px_rgba(214,184,154,0.8)]">
          Meet Our Team
        </h1>

        
        <div className="flex justify-center mb-20">
          <p className="text-center text-[#e6d4bd] text-lg 
          backdrop-blur-md bg-black/30 px-6 py-3 rounded-lg shadow-lg">
            The minds behind innovation, creativity and execution.
          </p>
        </div>

        {/* FACULTY INCHARGE */}
        <SectionTitle>Faculty Incharge</SectionTitle>

        <div className="flex justify-center gap-16 flex-wrap mb-32">
          {faculty.faculty.map((member, index) => (
            <Card key={index} member={member} />
          ))}
        </div>

        {/* FINAL YEAR */}
        <SectionTitle>Final Year</SectionTitle>

        <div className="flex justify-center gap-16 flex-wrap mb-32">
          {fourthYear.fourth_year.map((member) => (
            <Card key={member.registration_no} member={member} />
          ))}
        </div>

        {/* THIRD YEAR */}
        <SectionTitle>Third Year</SectionTitle>

        {/* WEB */}
        <section className="mb-28">
          <SectionTitle>Web Team</SectionTitle>
          <HorizontalScroll team={thirdYear.third_year.web_team} />
        </section>

        {/* MARKETING */}
        <section className="mb-28">
          <SectionTitle>Marketing Team</SectionTitle>
          <HorizontalScroll team={thirdYear.third_year.marketing_team} />
        </section>

        {/* DESIGN */}
        <section className="mb-28">
          <SectionTitle>Design Team</SectionTitle>
          <HorizontalScroll team={thirdYear.third_year.design_team} />
        </section>

        {/* CONTENT */}
        <section className="mb-28">
          <SectionTitle>Content Team</SectionTitle>
          <HorizontalScroll team={thirdYear.third_year.content_team} />
        </section>

        {/* VIDEO */}
        <section className="mb-28">
          <SectionTitle>Video Team</SectionTitle>
          <HorizontalScroll team={thirdYear.third_year.video_team} />
        </section>

        {/* SECOND YEAR */}
        <SectionTitle>Second Year</SectionTitle>

        {/* WEB */}
        <section className="mb-28">
          <SectionTitle>Web Team</SectionTitle>
          <HorizontalScroll team={secondYear.second_year.web_team} isConcise={true} />
        </section>

        {/* MARKETING */}
        <section className="mb-28">
          <SectionTitle>Marketing Team</SectionTitle>
          <HorizontalScroll team={secondYear.second_year.marketing_team} isConcise={true} />
        </section>

        {/* DESIGN */}
        <section className="mb-28">
          <SectionTitle>Design Team</SectionTitle>
          <HorizontalScroll team={secondYear.second_year.design_team} isConcise={true} />
        </section>

        {/* CONTENT */}
        <section className="mb-28">
          <SectionTitle>Content Team</SectionTitle>
          <HorizontalScroll team={secondYear.second_year.content_team} isConcise={true} />
        </section>

        {/* VIDEO */}
        <section className="mb-28">
          <SectionTitle>Video Team</SectionTitle>
          <HorizontalScroll team={secondYear.second_year.video_team} isConcise={true} />
        </section>

      </div>
    </div>
  );
};

export default Teams;