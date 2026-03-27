import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import det1 from '../assets/det2.avif';
import partnersData from '../data/logos.json';
import topSecretImg from '../assets/top-secret.jpg';

gsap.registerPlugin(ScrollTrigger);

const getImageUrl = (name, folder = "past sponsors") => {
  return new URL(`../assets/${folder}/${name}`, import.meta.url).href;
};

const Sponsors = () => {
  const boardRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.sponsor-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 80,
          duration: 0.9,
          ease: "power3.out"
        });
      });
    }, boardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={boardRef} className="relative min-h-screen text-[#e8dcc8] pb-32 overflow-x-hidden">
      
      {/* BACKGROUND BOARD */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url(${det1})` }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] opacity-25"></div>
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      {/* THREAD WEB */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50">
        <svg className="w-full h-full min-h-[300vh]">
          <line x1="10%" y1="20%" x2="90%" y2="40%" stroke="#7f1d1d" strokeWidth="3" />
          <line x1="20%" y1="60%" x2="80%" y2="85%" stroke="#7f1d1d" strokeWidth="3" />
          <line x1="85%" y1="10%" x2="15%" y2="75%" stroke="#991b1b" strokeWidth="2" />
          <line x1="5%" y1="50%" x2="95%" y2="55%" stroke="#5a1212" strokeWidth="2" />
          <line x1="30%" y1="5%" x2="60%" y2="95%" stroke="#4a0f0f" strokeWidth="2" />
          <line x1="70%" y1="0%" x2="40%" y2="100%" stroke="#4a0f0f" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28">

        {/* HEADER */}
        <header className="text-center mb-24 md:mb-28">
          <h1 className="font-playfair text-6xl md:text-8xl font-bold tracking-wide mb-6 leading-tight">
            <span className="text-[#f5e9d8]">Our Partners & </span>{" "}
            <span className="text-[#d6c6b1] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Sponsors
            </span>
          </h1>

          <div className="inline-block px-8 py-4 bg-black/40 backdrop-blur-md border border-[#cbbfae]/30 rounded-md">
            <p className="italic text-[#e6d8c3] text-lg tracking-wide">
              Documented alliances and strategic backers shaping the mission.
            </p>
          </div>
        </header>

        {/* HIERARCHICAL TIERS */}
        <div className="space-y-32 md:space-y-40">
          {partnersData.map((tier) => (
            <div key={tier.id} className="relative text-center">

              {/* Tier Heading */}
              <div className="mb-16 relative">
                <div className="w-9 h-9 bg-[#8b0000] rounded-full mx-auto mb-5 shadow-[0_0_30px_rgba(139,0,0,0.6)] border-2 border-[#4a0000]"></div>

                <h2 className="font-playfair text-4xl md:text-5xl font-semibold uppercase tracking-[0.3em] text-[#f1e6d6] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                  The {tier.title}
                </h2>

                <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#cbbfae] to-transparent mx-auto mt-4 mb-3"></div>

                <p className="text-sm text-[#d8c9b4] italic tracking-wide">
                  The Official {tier.title}
                </p>
              </div>

              {/* Cards */}
              <div className={`grid gap-x-16 gap-y-14 justify-center ${
                (tier.id === 'TITLE' || tier.id === 'ACCESSORIES_PARTNER' || tier.id === 'MEDIA_PARTNER' || tier.id === 'TRAVEL_PARTNER' || tier.id === 'PLATFORM_PARTNER')
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : tier.id === 'SYNDICATE'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              }`}>
                {tier.logos.map((logo, index) => (
                  <SponsorCard
                    key={index}
                    logo={logo}
                    sponsorType={tier.title}
                    isRevealed={tier.id === 'TITLE' || tier.id === 'ACCESSORIES_PARTNER' || tier.id === 'MEDIA_PARTNER' || tier.id === 'TRAVEL_PARTNER' || tier.id === 'PLATFORM_PARTNER'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SponsorCard = ({ logo, sponsorType, isRevealed }) => {
  return (
    <div className="sponsor-card relative group mx-auto w-full max-w-[300px]">
      
      {/* Thread */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[4px] h-16 bg-[#7f1d1d] z-10"></div>

      {/* Pin */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
        <div className="w-8 h-8 bg-[#8b0000] rounded-full shadow-lg border-2 border-[#4a0000] flex items-center justify-center">
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* CARD */}
      <div className={`bg-[#f1e6d6] border border-[#cbbfae] p-6 pb-10 shadow-[20px_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[25px_35px_80px_rgba(0,0,0,0.95)] relative select-none ${
  isRevealed ? '' : 'blur-[4px]'
}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-25 pointer-events-none"></div>

        <div className="bg-white p-6 rounded shadow-inner flex items-center justify-center h-44">
          <img
            src={isRevealed ? getImageUrl(logo.fileName, logo.folder || "past sponsors") : topSecretImg}
            alt={logo.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="mt-6 text-black text-center">
          <h3 className="font-playfair text-xl font-bold tracking-wide">
            {logo.name}
          </h3>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-700 mt-3">
            {sponsorType} 
          </p>
        </div>

        <div className="absolute bottom-3 right-3 text-[#7f1d1d] text-[10px] font-mono opacity-60 tracking-widest">
          VERIFIED
        </div>
      </div>
    </div>
  );
};

export default Sponsors;