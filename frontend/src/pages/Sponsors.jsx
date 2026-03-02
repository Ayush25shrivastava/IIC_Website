import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import det1 from '../assets/det1.webp';

gsap.registerPlugin(ScrollTrigger);

const images = import.meta.glob('../assets/past sponsors/*', { eager: true, query: '?url', import: 'default' });
const sponsorLogos = Object.values(images);

const sponsorTiers = [
    { 
        id: "MASTERMIND", 
        title: "The Masterminds", 
        description: "Primary entities funding the operation. Direct oversight of all project phases.",
        logos: sponsorLogos.slice(0, 1),
    },
    { 
        id: "SYNDICATE", 
        title: "The Syndicate", 
        description: "Strategic alliances providing high-level technical and logistical resources.",
        logos: sponsorLogos.slice(1, 3),
    },
    { 
        id: "INFORMANTS", 
        title: "The Informants", 
        description: "Wide-range network providing essential intelligence across various sectors.",
        logos: sponsorLogos.slice(3, 7),
    },
];

const Sponsors = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.tier-section');

            sections.forEach((section) => {
                const horizontalContainer = section.querySelector('.horizontal-scroll');
                const moveAmount = horizontalContainer.scrollWidth - window.innerWidth;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${moveAmount + window.innerHeight}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        pinSpacing: true,
                    }
                });

                if (moveAmount > 0) {
                    tl.to(horizontalContainer, {
                        x: -moveAmount,
                        ease: "none",
                    });
                }
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="relative text-[#dcd9d2] min-h-screen">

            {/* BACKGROUND */}
            <div 
                className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat grayscale-[5%]"
                style={{ 
                    backgroundImage: `url(${det1})`,
                    filter: "brightness(0.65) contrast(1.05)" 
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]"></div>
            </div>

            <div className="relative z-10">

                {/* INTRO */}
                <div className="h-[90vh] flex flex-col items-center justify-center text-center px-4">
                    <h1 className="font-playfair text-6xl md:text-9xl uppercase font-black tracking-tighter mb-6 leading-none drop-shadow-2xl">
                        The <span className="text-[#B8A18A]">Partners</span>
                    </h1>
                    <p className="font-merriweather italic text-lg md:text-2xl text-white font-bold max-w-2xl drop-shadow-xl px-4">
                        "Every great investigation requires the right backing. Meet the hands behind Udbhav."
                    </p>
                </div>

                {/* TIERS */}
                {sponsorTiers.map((tier) => (
                    <section 
                        key={tier.id} 
                        className="tier-section h-screen w-full flex items-center overflow-hidden"
                    >
                        <div className="horizontal-scroll flex items-center h-full px-[8vw] gap-[6vw]">
                            
                            {/* INFO CARD */}
                            <div className="w-[85vw] sm:w-[480px] shrink-0">
                                <div className="relative p-10 border-l-8 border-[#B8A18A] bg-[#0a0a0a]/85 shadow-[20px_20px_40px_rgba(0,0,0,0.7)]">
                                    <span className="font-mono text-sm text-[#B8A18A] tracking-[0.5em] uppercase mb-4 block font-bold">
                                        SECTION: {tier.id}
                                    </span>
                                    <h2 className="font-playfair text-5xl md:text-7xl text-white font-black mb-6 leading-none uppercase">
                                        {tier.title}
                                    </h2>
                                    <p className="font-merriweather italic text-[#dcd9d2]/80 leading-relaxed mb-8 text-base md:text-lg">
                                        "{tier.description}"
                                    </p>
                                </div>
                            </div>

                            {/* DOSSIER CARDS */}
                            {tier.logos.map((logo, idx) => (
                                <SponsorDossier key={idx} logo={logo} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* FOOTER */}
                <div className="h-screen flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="font-playfair text-5xl opacity-80 italic text-[#B8A18A] drop-shadow-2xl">
                        Case Files Remain Open...
                    </p>
                    <p className="font-mono text-xs mt-4 tracking-[0.5em] opacity-50 uppercase">
                        Investigation Ongoing
                    </p>
                </div>
            </div>
        </div>
    );
};

const SponsorDossier = ({ logo }) => {
    return (
        <div className="sponsor-dossier group relative 
            w-[320px] sm:w-[360px] md:w-[380px]
            h-[480px] 
            shrink-0 
            flex items-center justify-center">

            <div className="relative w-full h-full 
                bg-gradient-to-br from-[#f5efe4] to-[#e3dacb]
                rounded-xl
                shadow-[0_25px_60px_rgba(0,0,0,0.7)]
                border border-[#B8A18A]/40
                overflow-hidden
                transition-all duration-500
                group-hover:-translate-y-4
                group-hover:rotate-[0.8deg]
                group-hover:shadow-[0_35px_90px_rgba(184,161,138,0.5)]">

                {/* HEADER */}
                <div className="bg-[#111] px-5 py-4 flex justify-between items-center">
                    <div>
                        <p className="font-mono text-[10px] text-[#B8A18A] uppercase tracking-widest">
                            Case File
                        </p>
                        <p className="font-mono text-[12px] text-white font-bold tracking-wider">
                            DOSSIER_042
                        </p>
                    </div>

                    <div className="bg-red-700 text-white text-[9px] px-3 py-1 font-bold uppercase tracking-widest rounded-sm shadow-md">
                        Restricted
                    </div>
                </div>

                {/* BODY */}
                <div className="p-6 flex flex-col justify-between h-[calc(100%-72px)]">

                    {/* IMAGE */}
                    <div className="relative w-full aspect-square bg-white rounded-md shadow-inner border border-black/10 overflow-hidden">

                        <div className="absolute inset-0 z-20 bg-black flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                            <span className="text-[#B8A18A] text-xs font-mono tracking-widest animate-pulse">
                                DECRYPTING...
                            </span>
                        </div>

                        <div className="w-full h-full flex items-center justify-center p-10 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700">
                            <img 
                                src={logo}
                                alt="Sponsor"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* TEXT */}
                    <div className="mt-6 space-y-3">
                        <h3 className="font-playfair text-xl text-black font-bold italic border-b border-black/20 pb-1">
                            Classified Partner
                        </h3>

                        <p className="font-merriweather text-black/70 text-sm leading-relaxed">
                            Strategic collaborator contributing to operational intelligence 
                            and logistical expansion.
                        </p>
                    </div>
                </div>

                
                <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#B8A18A]/20 group-hover:border-[#B8A18A]/60 transition-all duration-500"></div>
            </div>

            {/* THREAD */}
            <div className="absolute -top-[100px] left-1/2 w-[2px] h-[100px] bg-red-600/40 hidden md:block border-dashed border-l"></div>
        </div>
    );
};

export default Sponsors;