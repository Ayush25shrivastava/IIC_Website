import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const eventsData = [
    {
        id: 1,
        title: "Theta Decay",
        date: "Oct 24",
        category: "Intelligence",
        image: "https://projectoption.com/_astro/slv-long-puts-negative-theta.DnZJW_Hw_Z1gGRkT.webp",
        description: "The signal is fading. Decode the patterns before the entropy reaches critical mass.",
        mode: "Offline",
        teamSize: "1-3 Members",
        intel: "Priority Alpha. Requires deep analytical skills. Surveillance suggests high volatility in data streams. Agents must process data packets in real-time to avoid system collapse."
    },
    {
        id: 2,
        title: "Seed Start Summit",
        date: "Oct 25",
        category: "Briefing",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        description: "Planting the roots of a new investigation. Where ideas germinate in the dark soil of progress.",
        mode: "Online",
        teamSize: "Solo / Duo",
        intel: "A gathering of early-stage architects. Protocol: Secure digital handshake required. This briefing covers the initial phase of the Udbhav infrastructure."
    },
    {
        id: 3,
        title: "Mock IPL Auction",
        date: "Oct 26",
        category: "High Stakes",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        description: "Every man has a price. Place your bets and build your empire while the gavel falls.",
        mode: "Offline",
        teamSize: "4 Members",
        intel: "Economic warfare simulation. Keep your ledger close and your rivals closer. The auction floor is a battlefield where only the most calculated risks pay off."
    },
    {
        id: 4,
        title: "Case Clash",
        date: "Oct 27",
        category: "Interrogation",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7FgZssadiFZ-3985Ssgs9noykiSKZJytDow&s",
        description: "Two stories, one truth. Pit your logic against the evidence in a room with no exits.",
        mode: "Offline",
        teamSize: "2 Members",
        intel: "Logic-based confrontation. Cross-examine the data. Do not let the suspect dictate the narrative. You have 60 minutes to reach the verdict."
    },
    {
        id: 5,
        title: "Quest Youth",
        date: "Oct 28",
        category: "Recon",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
        description: "The next generation of watchers. A hunt through the landscape for what was lost.",
        mode: "Offline",
        teamSize: "3-5 Members",
        intel: "Field operation. Tracking required. The targets are moving through public sectors. Use all available sensors to recover the lost encryption keys."
    },
    {
        id: 6,
        title: "Stall Mania",
        date: "Oct 29",
        category: "Market",
        image: "https://content.jdmagicbox.com/v2/comp/bangalore/x1/080pxx80.xx80.180411155049.x6x1/catalogue/momentum-events-jp-nagar-bangalore-decorators-8gye2hclm3.jpg",
        description: "A bustling front for the underground. Trade, barter, and watch your back in the chaos.",
        mode: "Offline",
        teamSize: "Flexible",
        intel: "Open commerce zone. High probability of finding restricted assets. Exchange rates fluctuate based on supply chain disruptions. Trust no one."
    },
    {
        id: 7,
        title: "Viral Vision",
        date: "Oct 30",
        category: "Surveillance",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        description: "The eyes are everywhere. Capture the moment before it spreads through the network like a fever.",
        mode: "Online",
        teamSize: "Solo",
        intel: "Content propagation mission. Monitor social frequencies. Maintain low profile while transmitting high-value digital assets to the central node."
    },
    {
        id: 8,
        title: "Venture Vault",
        date: "Oct 31",
        category: "Evidence",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW1jQatQstPf75hjyBO274Qcy5mZwSsNZyOg&s0",
        description: "Locked away for a reason. Crack the safe and secure the assets of the final operation.",
        mode: "Offline",
        teamSize: "3 Members",
        intel: "Final containment breach. High-security protocols in place. Recovery of assets is mandatory. Failure is not an option for the final extraction."
    }
];

const Events = () => {
    const [selectedId, setSelectedId] = useState(null);
    const cardsRef = useRef([]);
    const titleRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        gsap.to(bgRef.current, {
            y: 50,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2
            }
        });

        tl.fromTo(titleRef.current.children, 
            { opacity: 0, y: 40, skewY: 5 },
            { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.2 }
        );

        tl.fromTo(cardsRef.current, 
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.1, ease: "expo.out" },
            "-=0.8"
        );
    }, []);

    const activeEvent = eventsData.find(e => e.id === selectedId);

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] pt-32 pb-20 px-6 relative overflow-x-hidden">
            {/* Cinematic Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[60]"></div>
            
            {/* ENHANCED VISIBILITY BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 bg-repeat bg-cover bg-center z-0 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://fcmod.org/wp-content/uploads/2020/03/philatelist-1844080_640-e1585082769528.jpg')", 
                    backgroundSize: "contain",
                    opacity: 0.4, // Increased opacity for better visibility
                    filter: "contrast(1.1) brightness(0.7)" // Added contrast to make the text/stamps pop
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <header ref={titleRef} className="mb-20 border-l border-[#7C6C58]/30 pl-8">
                    <h1 className="font-playfair text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-none">
                        Active <span className="text-[#7C6C58]">Docket</span> <br /> 
                        <span className="text-4xl md:text-6xl italic font-light opacity-80 uppercase font-merriweather">Udbhav 2026</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {eventsData.map((event, index) => (
                        <motion.div 
                            layoutId={`card-${event.id}`}
                            key={event.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative bg-[#1A1A1A]/90 backdrop-blur-sm rounded-xl border border-[#7C6C58]/20 transition-all duration-700 cursor-pointer overflow-hidden shadow-xl"
                            onClick={() => setSelectedId(event.id)}
                            whileHover={{ y: -8, borderColor: "rgba(184, 161, 138, 0.4)" }}
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover desaturate group-hover:desaturate-0 group-hover:scale-110 transition-all duration-1000 opacity-50 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-playfair text-2xl font-bold text-white group-hover:text-[#B8A18A] transition-colors leading-tight mb-2">{event.title}</h3>
                                <p className="font-merriweather text-xs italic opacity-60 h-12 overflow-hidden mb-6 italic">"{event.description}"</p>
                                <button className="w-full py-3 rounded-lg border border-[#7C6C58]/30 group-hover:border-[#B8A18A] text-[#7C6C58] group-hover:text-[#0E0E0E] group-hover:bg-[#B8A18A] transition-all duration-500 font-bold uppercase text-[9px] tracking-[0.4em]">Analyze File</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* EXPANDED VIEW - STANDARDIZED SIZE */}
            <AnimatePresence>
                {selectedId && activeEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden backdrop-blur-md">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90" onClick={() => setSelectedId(null)} />
                        
                        <motion.div 
                            layoutId={`card-${selectedId}`}
                            className="relative bg-[#1E1E1E] border border-[#B8A18A]/50 w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-2xl shadow-[0_0_100px_rgba(184,161,138,0.2)]"
                        >
                            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-[110] text-[#7C6C58] hover:text-white transition-all p-2 bg-black/60 rounded-full w-10 h-10 flex items-center justify-center">✕</button>

                            <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden shrink-0">
                                <img src={activeEvent.image} className="w-full h-full object-cover" alt="Event" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 lg:p-12 overflow-hidden bg-[#1E1E1E]">
                                <div className="flex items-center gap-3 mb-4 shrink-0">
                                    <span className="h-[1px] w-8 bg-[#B8A18A]/40"></span>
                                    <span className="text-[10px] tracking-[0.5em] text-[#B8A18A] uppercase font-bold font-mono tracking-widest">Docket No. 00{activeEvent.id}</span>
                                </div>
                                
                                <h2 className="font-playfair text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight shrink-0">{activeEvent.title}</h2>
                                
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 mb-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Status</p>
                                            <p className="text-[#B8A18A] font-bold text-xs uppercase">{activeEvent.mode}</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Capacity</p>
                                            <p className="text-[#B8A18A] font-bold text-xs uppercase">{activeEvent.teamSize}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[9px] uppercase text-[#7C6C58] mb-3 font-bold font-mono tracking-widest">Mission Briefing</p>
                                        <p className="font-merriweather italic text-[#D1D1D1] text-sm md:text-base leading-relaxed pl-4 border-l-2 border-[#B8A18A]/30">
                                            {activeEvent.intel}
                                        </p>
                                    </div>
                                    
                                    <div className="text-[11px] text-[#7C6C58] font-mono leading-relaxed space-y-2 pt-4">
                                        <p>&gt; DEPLOYMENT DATE: {activeEvent.date}</p>
                                        <p>&gt; SECTOR: {activeEvent.category}</p>
                                        <p>&gt; ENCRYPTION: SECURE</p>
                                    </div>
                                </div>

                                <button className="group relative w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-xs tracking-[0.6em] rounded-xl shrink-0 hover:shadow-[0_0_25px_rgba(184,161,138,0.4)] transition-all">
                                    <span className="relative z-10">Authorize Access</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-32 pb-10 text-center opacity-20 flex flex-col items-center gap-2">
                <div className="w-16 h-[1px] bg-[#7C6C58]"></div>
                <p className="text-[10px] tracking-widest uppercase italic">The world is a graveyard. You just gotta know where to dig.</p>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Events;