import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/config';

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    
    const cardsRef = useRef([]);
    const titleRef = useRef(null);
    const bgRef = useRef(null);
    const navigate = useNavigate();

    // 1. Fetch Events from Backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events`);
                const data = await response.json();
                if (data.success) {
                    setEventsData(data.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // 2. Run GSAP Animations only after loading is complete
    useEffect(() => {
        if (loading || eventsData.length === 0) return;

        let ctx = gsap.context(() => {
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
        });

        return () => ctx.revert();
    }, [loading, eventsData]);

    const activeEvent = eventsData.find(e => e._id === selectedId);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] flex flex-col items-center justify-center font-mono">
                <div className="w-16 h-16 border-t-2 border-[#B8A18A] rounded-full animate-spin mb-4"></div>
                <p className="tracking-[0.3em] uppercase text-xs text-center px-4">Accessing Mainframe...</p>
            </div>
        );
    }

    const RULEBOOK_LINK = "https://drive.google.com/your-rulebook-link";
    const PROBLEM_LINK = "https://drive.google.com/your-problem-link";

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] md:pl-40 pt-24 md:pt-32 pb-20 px-4 sm:px-6 relative overflow-x-hidden">
            {/* Cinematic Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[60]"></div>

            {/* Background */}
            <div ref={bgRef} className="fixed inset-0 bg-repeat bg-cover bg-center z-0 pointer-events-none"
                style={{
                    backgroundImage: "url('https://fcmod.org/wp-content/uploads/2020/03/philatelist-1844080_640-e1585082769528.jpg')",
                    backgroundSize: "contain",
                    opacity: 0.4, 
                    filter: "contrast(1.1) brightness(0.7)" 
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <header ref={titleRef} className="mb-12 md:mb-20 border-l-2 border-[#7C6C58]/30 pl-6 md:pl-8">
                    <h1 className="font-playfair text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter text-white uppercase leading-none break-words">
                        Active <span className="text-[#7C6C58]">Docket</span> <br />
                        <span className="text-3xl sm:text-4xl md:text-6xl italic font-light opacity-80 uppercase font-merriweather block mt-2">Udbhav 2026</span>
                    </h1>
                </header>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {eventsData.map((event, index) => (
                        <motion.div
                            layoutId={`card-${event._id}`}
                            key={event._id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative bg-[#1A1A1A]/90 backdrop-blur-sm rounded-xl border border-[#7C6C58]/20 transition-all duration-700 cursor-pointer overflow-hidden shadow-xl flex flex-col"
                            onClick={() => setSelectedId(event._id)}
                            whileHover={{ y: -8, borderColor: "rgba(184, 161, 138, 0.4)" }}
                        >
                            <div className="relative h-56 sm:h-60 overflow-hidden shrink-0">
                                <img src={event.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80'} alt={event.name} className="w-full h-full object-cover desaturate group-hover:desaturate-0 group-hover:scale-110 transition-all duration-1000 opacity-50 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
                            </div>
                            <div className="p-5 md:p-6 flex flex-col flex-1">
                                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white group-hover:text-[#B8A18A] transition-colors leading-tight mb-2 truncate">{event.name}</h3>
                                <p className="font-merriweather text-xs italic opacity-60 h-12 overflow-hidden mb-6 line-clamp-3 flex-1">"{event.description}"</p>
                                <button className="w-full py-3 mt-auto rounded-lg border border-[#7C6C58]/30 group-hover:border-[#B8A18A] text-[#7C6C58] group-hover:text-[#0E0E0E] group-hover:bg-[#B8A18A] transition-all duration-500 font-bold uppercase text-[9px] tracking-[0.4em]">Analyze File</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* EXPANDED VIEW MODAL */}
            <AnimatePresence>
                {selectedId && activeEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden backdrop-blur-md">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90" onClick={() => setSelectedId(null)} />

                        <motion.div
                            layoutId={`card-${selectedId}`}
                            className="relative bg-[#1E1E1E] border border-[#B8A18A]/50 w-full max-w-5xl h-[90vh] md:h-[80vh] overflow-hidden flex flex-col md:flex-row rounded-2xl shadow-[0_0_100px_rgba(184,161,138,0.2)]"
                        >
                            <button onClick={() => setSelectedId(null)} className="absolute top-3 right-3 md:top-4 md:right-4 z-[110] text-[#7C6C58] hover:text-white transition-all p-2 bg-black/60 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">✕</button>

                            {/* Image Section - Fixed height on mobile so text always has enough room */}
                            <div className="w-full h-48 sm:h-56 md:h-full md:w-[40%] lg:w-[45%] relative shrink-0">
                                <img src={activeEvent.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt={activeEvent.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/50 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#1E1E1E]/50 md:to-[#1E1E1E]" />
                            </div>

                            {/* Content Section - flex-1 and min-h-0 ensure proper internal scrolling */}
                            <div className="w-full flex-1 min-h-0 md:h-full md:w-[60%] lg:w-[55%] flex flex-col p-5 md:p-8 lg:p-10 bg-[#1E1E1E]">
                                
                                {/* Fixed Header Area inside Modal */}
                                <div className="shrink-0 mb-4 md:mb-6">
                                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                                        <span className="h-[1px] w-6 md:w-8 bg-[#B8A18A]/40"></span>
                                        <span className="text-[9px] md:text-[10px] tracking-[0.5em] text-[#B8A18A] uppercase font-bold font-mono">Docket No. {activeEvent._id.slice(-6)}</span>
                                    </div>
                                    <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">{activeEvent.name}</h2>
                                </div>

                                {/* Scrollable Details Area */}
                                <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-6 mb-6">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                                            <p className="text-[8px] md:text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Category</p>
                                            <p className="text-[#B8A18A] font-bold text-[10px] md:text-xs uppercase break-words">{activeEvent.category}</p>
                                        </div>
                                        <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/5">
                                            <p className="text-[8px] md:text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Capacity</p>
                                            <p className="text-[#B8A18A] font-bold text-[10px] md:text-xs uppercase break-words">
                                                {activeEvent.eventType === 'Team' 
                                                    ? `${activeEvent.minTeamSize}-${activeEvent.maxTeamSize} Members` 
                                                    : 'Solo'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[8px] md:text-[9px] uppercase text-[#7C6C58] mb-2 font-bold font-mono tracking-widest">Mission Briefing</p>
                                        <p className="font-merriweather italic text-[#D1D1D1] text-xs sm:text-sm leading-relaxed pl-3 md:pl-4 border-l-2 border-[#B8A18A]/30">
                                            {activeEvent.description}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[9px] uppercase text-[#7C6C58] mb-2 font-bold font-mono tracking-widest">Rules</p>
                                        <p className="font-merriweather italic text-[#D1D1D1] text-xs sm:text-sm leading-relaxed pl-3 md:pl-4 border-l-2 border-[#B8A18A]/30">
                                            {activeEvent.rules}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col md:flex-row gap-4 pt-4">

                                        {/* Rulebook Button (for ALL events) */}
                                        <a
                                            href={RULEBOOK_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-3 border border-[#B8A18A] text-[#B8A18A] font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300"
                                        >
                                            View Rulebook
                                        </a>

                                        {/* Problem Statements Button (ONLY Hack 18) */}
                                        {activeEvent.name === "Hack 18" && (
                                            <a
                                                href={PROBLEM_LINK}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-center py-3 border border-[#7C6C58] text-[#7C6C58] font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#7C6C58] hover:text-white transition-all duration-300"
                                            >
                                                Problem Statements
                                            </a>
                                        )}

                                    </div>

                                    <div className="text-[11px] text-[#7C6C58] font-mono leading-relaxed space-y-2 pt-4">
                                        <p>&gt; DEPLOYMENT DATE: {activeEvent.date}</p>
                                        <p>&gt; SECTOR (VENUE): {activeEvent.venue}</p>
                                        <p>&gt; TYPE: {activeEvent.eventType.toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Fixed action button at bottom of container */}
                                <button 
                                    onClick={() => navigate(`/udbhav/events/${activeEvent._id}/register`)}
                                    className="shrink-0 mt-auto group relative w-full py-3 md:py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] rounded-xl hover:shadow-[0_0_25px_rgba(184,161,138,0.4)] transition-all"
                                >
                                    <span className="relative z-10">Authorize Access</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-20 md:mt-32 pb-10 text-center opacity-20 flex flex-col items-center gap-2 px-4">
                <div className="w-12 md:w-16 h-[1px] bg-[#7C6C58]"></div>
                <p className="text-[8px] md:text-[10px] tracking-widest uppercase italic">The world is a graveyard. You just gotta know where to dig.</p>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default Events;
