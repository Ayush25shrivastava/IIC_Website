import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API_BASE_URL } from '../utils/config';

gsap.registerPlugin(ScrollTrigger);

const EventSection = () => {
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const navigate = useNavigate();

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
                className="flex md:overflow-x-auto overflow-y-hidden gap-8 px-8 md:px-20 py-8 cursor-grab active:cursor-grabbing no-scrollbar flex-col md:flex-row scroll-smooth"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {eventsData.map((event, index) => (
                    <div key={event._id} className="shrink-0 w-full md:w-[450px] flex items-center justify-center box-border">
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
                                                onClick={() => navigate(`/udbhav/events/${event._id}/register`)}
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
                    </div>
                ))}
            </div>
            <style jsx>{`
                .theme-detective {
                    background-image: repeating-linear-gradient(45deg, #dcd9d2 0px, #dcd9d2 10px, #d4d1ca 10px, #d4d1ca 11px);
                }
                .no-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .no-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .no-scrollbar::-webkit-scrollbar-thumb {
                    background: #0E0E0E33;
                    border-radius: 10px;
                }
                .no-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0E0E0E66;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: thin;
                    scrollbar-color: #0E0E0E33 transparent;
                }
            `}</style>
        </section>
    );
};

export default EventSection;
