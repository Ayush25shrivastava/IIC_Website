import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import invboard from '../assets/invboard.png'

gsap.registerPlugin(ScrollTrigger);

const sponsorTiers = [
    {
        tier: "Title Sponsor",
        size: "w-64 h-64",
        glow: "shadow-[0_0_50px_rgba(184,161,138,0.4)]",
        sponsors: [{ id: 1, name: "OmniCorp Global", logo: "https://via.placeholder.com/200x200?text=Title+Sponsor" }]
    },
    {
        tier: "Platinum Partners",
        size: "w-48 h-48",
        glow: "shadow-[0_0_30px_rgba(255,255,255,0.1)]",
        sponsors: [
            { id: 2, name: "Nexus Tech", logo: "https://via.placeholder.com/150" },
            { id: 3, name: "Apex Industries", logo: "https://via.placeholder.com/150" }
        ]
    },
    {
        tier: "Gold Associates",
        size: "w-40 h-40",
        glow: "shadow-[0_0_20px_rgba(184,161,138,0.1)]",
        sponsors: [
            { id: 4, name: "Vortex Media", logo: "https://via.placeholder.com/120" },
            { id: 5, name: "Cipher Security", logo: "https://via.placeholder.com/120" },
            { id: 6, name: "Echo Labs", logo: "https://via.placeholder.com/120" }
        ]
    },
    {
        tier: "Silver Contributors",
        size: "w-32 h-32",
        glow: "shadow-none",
        sponsors: [
            { id: 7, name: "Alpha", logo: "https://via.placeholder.com/100" },
            { id: 8, name: "Beta", logo: "https://via.placeholder.com/100" },
            { id: 9, name: "Gamma", logo: "https://via.placeholder.com/100" },
            { id: 10, name: "Delta", logo: "https://via.placeholder.com/100" }
        ]
    }
];

const Sponsors = () => {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background Parallax
            gsap.to(bgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    scrub: true
                }
            });

            // Tier Entrance
            gsap.from(".tier-container", {
                opacity: 0,
                y: 50,
                stagger: 0.3,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="relative min-h-screen bg-[#0E0E0E] pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Archival Texture */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${invboard})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <header className="mb-20">
                    <h2 className="font-playfair text-5xl md:text-7xl text-white font-bold mb-4 uppercase tracking-tighter">
                        The <span className="text-[#B8A18A]">Benefactors</span>
                    </h2>
                    <div className="w-24 h-1 bg-[#B8A18A] mx-auto mb-6"></div>
                    <p className="font-merriweather italic text-[#dcd9d2]/60 max-w-xl mx-auto">
                        "Behind every great investigation lies a network of silent partners."
                    </p>
                </header>

                <div className="space-y-24">
                    {sponsorTiers.map((tier, idx) => (
                        <div key={idx} className="tier-container">
                            <h3 className="font-playfair text-[#B8A18A] text-2xl uppercase tracking-[0.5em] mb-10 opacity-80">
                                {tier.tier}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-12">
                                {tier.sponsors.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`group relative ${tier.size} rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center p-6 transition-all duration-500 hover:border-[#B8A18A]/50 hover:scale-110 ${tier.glow}`}
                                    >
                                        <img
                                            src={s.logo}
                                            alt={s.name}
                                            className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                        />
                                        {/* Tooltip effect */}
                                        <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity font-merriweather text-[10px] text-white tracking-widest uppercase">
                                            {s.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sponsors;







