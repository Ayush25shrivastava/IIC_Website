import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../utils/config';
import { EVENT_RESOURCES } from '../data/eventResources';

gsap.registerPlugin(ScrollTrigger);

const EventSection = () => {
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const navigate = useNavigate();

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [scrollProgress, setScrollProgress] = useState(0);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedId]);

    // Fetch Events from Server
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

    // Sync slider with scroll position
    useEffect(() => {
        const container = triggerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollWidth = container.scrollWidth - container.clientWidth;
            if (scrollWidth <= 0) return;
            const progress = (container.scrollLeft / scrollWidth) * 100;
            setScrollProgress(progress);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [eventsData]);

    const handleSliderChange = (e) => {
        const container = triggerRef.current;
        if (!container) return;

        const value = parseFloat(e.target.value);
        setScrollProgress(value);

        const scrollWidth = container.scrollWidth - container.clientWidth;
        container.scrollLeft = (value / 100) * scrollWidth;
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - triggerRef.current.offsetLeft);
        setScrollLeft(triggerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - triggerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        triggerRef.current.scrollLeft = scrollLeft - walk;
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#dcd9d2] text-[#0E0E0E]">
                <p className="font-mono text-xl uppercase tracking-widest animate-pulse">Decrypting Files...</p>
            </div>
        );
    }

    return (
        <section ref={sectionRef} id="events" className="bg-[#dcd9d2] text-[#0E0E0E] overflow-hidden relative theme-detective py-20">
            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#0E0E0E] mb-2 uppercase tracking-wide">
                    Operational Events
                </h2>
                <div className="h-1 w-24 bg-[#0E0E0E]/40 mx-auto mb-4"></div>
                <p className="font-mono text-[#555] text-sm uppercase tracking-widest">
                    Active Missions & Investigations
                </p>
            </div>

            <div 
                ref={triggerRef} 
                className="flex md:overflow-x-auto md:ml-24 overflow-y-hidden gap-8 px-8 md:px-20 py-8 cursor-grab active:cursor-grabbing no-scrollbar flex-col md:flex-row scroll-smooth"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <AnimatePresence>
                    {eventsData.map((event, index) => (
                        <motion.div 
                            layoutId={`card-${event._id}`}
                            key={event._id} 
                            className="shrink-0 w-full md:w-[450px] flex items-center justify-center box-border"
                        >
                            <div className="relative w-full h-auto min-h-[580px] bg-[#fdfbf7] md:rotate-1 rounded-sm shadow-[5px_5px_15px_rgba(0,0,0,0.2)] flex flex-col border border-[#d1ccc0] group hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                
                                {/* Folder Tab Effect (Visual only) */}
                                <div className="absolute top-0 right-0 w-24 h-8 bg-[#f3efe6] border-b border-l border-[#d1ccc0] rounded-bl-lg"></div>

                                {/* Paper Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

                                <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6 border-b-2 border-[#0E0E0E]/80 pb-2">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs text-[#0E0E0E]/60 uppercase tracking-widest">Case File ID</span>
                                            <span className="font-mono text-xl text-[#0E0E0E] font-bold">
                                                #00{index + 1}-{event.category?.toUpperCase().substring(0, 3) || 'EVT'}
                                            </span>
                                        </div>
                                        <div className="border-2 border-red-700 text-red-700 px-2 py-1 transform -rotate-12 opacity-80 font-black uppercase text-xs tracking-wider border-double">
                                            Confidential
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="relative mb-6 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500 w-[90%] mx-auto">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 border-2 border-[#5a5a5a] rounded-full z-20 bg-transparent border-b-0"></div>
                                        <div className="p-2 bg-white shadow-md border border-[#eee]">
                                            <div className="h-40 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                                                <img 
                                                    src={event.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} 
                                                    alt={event.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div className="pt-2 text-center">
                                                <p className="font-mono text-[10px] text-[#0E0E0E]/50 tracking-widest uppercase">Fig 1.1: Target Evidence</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow space-y-4">
                                        <h3 className="font-playfair text-3xl font-bold text-[#0E0E0E] mb-2 leading-none border-b border-[#0E0E0E]/10 pb-2">
                                            {event.name}
                                        </h3>
                                        
                                        <div className="font-mono text-xs space-y-3 text-[#0E0E0E]">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Date of incident</span>
                                                    <span className="font-bold">
                                                        {event.date}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Operation Venue</span>
                                                    <span className="font-bold truncate block">{event.venue}</span>
                                                </div>
                                            </div>

                                            <div className="bg-[#0e0e0e]/5 p-3 rounded-sm border-l-2 border-[#0E0E0E]">
                                                <span className="block text-[#0E0E0E]/50 uppercase text-[9px] mb-1">Mission Intel</span>
                                                <p className="leading-relaxed opacity-80 italic line-clamp-3">
                                                    "{event.description || event.problemStatement}"
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Required Personnel</span>
                                                    <span className="font-bold">
                                                        {event.eventType === 'Team' 
                                                            ? `${event.minTeamSize}-${event.maxTeamSize} Members` 
                                                            : 'Solo Agent'}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedId(event._id)}
                                                    className="px-4 py-2 border border-[#0E0E0E] text-[#0E0E0E] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0E0E0E] hover:text-[#dcd9d2] transition-colors duration-300">
                                                    Register
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Stamp */}
                                    <div className="mt-4 pt-4 border-t-2 border-dotted border-[#0E0E0E]/20 flex justify-between items-center opacity-70">
                                        <span className="font-mono text-[10px] uppercase">Auth: Udbhav HQ</span>
                                        <span className="font-merriweather italic text-xs">Priority Level: High</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Custom Slider / Scrollbar */}
            <div className="hidden md:flex flex-col items-center mt-12 px-20">
                <div className="relative w-full max-w-3xl h-[1.5px] bg-[#0E0E0E]/10 rounded-full">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        value={scrollProgress} 
                        onChange={handleSliderChange}
                        className="custom-scrollbar-slider absolute -top-[9px] w-full bg-transparent appearance-none cursor-pointer z-20"
                    />
                    <div 
                        className="absolute top-0 left-0 h-full bg-[#0E0E0E]/60"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between w-full max-w-3xl mt-2 font-mono text-[8px] uppercase tracking-[0.2em] opacity-40">
                    <span>Evidence Start</span>
                    <span>Operation Progress</span>
                    <span>Evidence End</span>
                </div>
            </div>

            {/* EXPANDED VIEW - COPIED FROM events.jsx */}
            <AnimatePresence>
                {selectedId && eventsData.find(e => e._id === selectedId) && (() => {
                    const activeEvent = eventsData.find(e => e._id === selectedId);
                    const activeResources = EVENT_RESOURCES[activeEvent.name] || { rulebook: "#" };
                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden backdrop-blur-md">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90" onClick={() => setSelectedId(null)} />

                            <motion.div
                                layoutId={`card-${selectedId}`}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative bg-[#1E1E1E] border border-[#B8A18A]/50 w-full max-w-5xl h-[85vh] md:h-[80vh] overflow-hidden flex flex-col md:flex-row rounded-2xl shadow-[0_0_100px_rgba(184,161,138,0.2)]"
                                style={{ overscrollBehavior: "contain" }}
                            >
                                <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-[110] text-[#7C6C58] hover:text-white transition-all p-2 bg-black/60 rounded-full w-10 h-10 flex items-center justify-center">✕</button>

                                <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden shrink-0">
                                    <img src={activeEvent.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt={activeEvent.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent md:bg-gradient-to-r" />
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 lg:p-12 min-h-0 overflow-hidden bg-[#1E1E1E]">
                                    <div className="flex items-center gap-3 mb-4 shrink-0">
                                        <span className="h-[1px] w-8 bg-[#B8A18A]/40"></span>
                                        <span className="text-[10px] tracking-[0.5em] text-[#B8A18A] uppercase font-bold font-mono tracking-widest text-[#B8A18A]">Docket No. {activeEvent._id.slice(-6)}</span>
                                    </div>

                                    <h2 className="font-playfair text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight shrink-0">{activeEvent.name}</h2>

                                    <div
                                        className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 mb-8 pb-4 overscroll-contain text-[#B1B1B1]"
                                        onWheel={(e) => e.stopPropagation()}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <p className="text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Category</p>
                                                <p className="text-[#B8A18A] font-bold text-xs uppercase">{activeEvent.category}</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <p className="text-[9px] uppercase text-[#7C6C58] mb-1 font-bold">Capacity</p>
                                                <p className="text-[#B8A18A] font-bold text-xs uppercase">
                                                    {activeEvent.eventType === 'Team'
                                                        ? `${activeEvent.minTeamSize}-${activeEvent.maxTeamSize} Members`
                                                        : 'Solo'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[9px] uppercase text-[#7C6C58] mb-3 font-bold font-mono tracking-widest">Mission Briefing</p>
                                            <p className="font-merriweather italic text-[#D1D1D1] text-sm md:text-base leading-relaxed pl-4 border-l-2 border-[#B8A18A]/30">
                                                {activeEvent.description}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-4 pt-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <a
                                                    href={activeResources.rulebook || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 text-center py-3 border border-[#B8A18A] text-[#B8A18A] font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300"
                                                >
                                                    View Rulebook
                                                </a>

                                                {activeEvent.name === "Hack 18" && activeResources.problemStatement && (
                                                    <a
                                                        href={activeResources.problemStatement}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 text-center py-3 border border-[#7C6C58] text-[#7C6C58] font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#7C6C58] hover:text-white transition-all duration-300"
                                                    >
                                                        Problem Statements
                                                    </a>
                                                )}
                                            </div>

                                            {activeEvent.name === "Hack 18" && activeResources.googleForm && (
                                                <a
                                                    href={activeResources.googleForm}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full text-center py-3 bg-[#7C6C58]/20 border border-[#7C6C58]/50 text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#7C6C58] transition-all duration-300"
                                                >
                                                    Submit Mission Report (Google Form)
                                                </a>
                                            )}
                                        </div>

                                        <div className="text-[11px] text-[#7C6C58] font-mono leading-relaxed space-y-2 pt-4">
                                            <p>&gt; EVENT DATE: {activeEvent.date}</p>
                                            <p>&gt; VENUE: {activeEvent.venue}</p>
                                            <p>&gt; EVENT TYPE: {activeEvent.eventType?.toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/udbhav/events/${activeEvent._id}/register`)}
                                        className="group relative w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-xs tracking-[0.6em] rounded-xl shrink-0 hover:shadow-[0_0_25px_rgba(184,161,138,0.4)] transition-all"
                                    >
                                        <span className="relative z-10">Authorize Access</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

            <style>{`
                .theme-detective {
                    background-image: repeating-linear-gradient(45deg, #dcd9d2 0px, #dcd9d2 10px, #d4d1ca 10px, #d4d1ca 11px);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .custom-scrollbar-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 2px;
                    height: 20px;
                    background: #0E0E0E;
                    border-radius: 2px;
                    box-shadow: 0 0 5px rgba(0,0,0,0.1);
                }
                .custom-scrollbar-slider::-moz-range-thumb {
                    width: 2px;
                    height: 20px;
                    background: #0E0E0E;
                    border-radius: 2px;
                    border: none;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; border: 1px solid rgba(184, 161, 138, 0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #B8A18A; }
            `}</style>
        </section>
    );
};

export default EventSection;
