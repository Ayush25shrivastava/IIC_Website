import React, { useRef, useState } from 'react';
import detectiveImage from '../assets/detective-image.png';

const speakersData = [
    {
        id: 1,
        name: "Agent Cipher",
        role: "Head of Cryptography",
        specialty: "Data Decryption",
        clearance: "Level 5",
        status: "ACTIVE"
    },
    {
        id: 2,
        name: "Detective Noir",
        role: "Lead Investigator",
        specialty: "Forensic Analysis",
        clearance: "Level 4",
        status: "ON DUTY"
    },
    {
        id: 3,
        name: "Professor Enigma",
        role: "Strategic Advisor",
        specialty: "Pattern Recognition",
        clearance: "Level 5",
        status: "CLASSIFIED"
    },
    {
        id: 4,
        name: "Shadow Walker",
        role: "Field Operative",
        specialty: "Infiltration",
        clearance: "Level 3",
        status: "UNKNOWN"
    },
    {
        id: 5,
        name: "The Oracle",
        role: "Information Broker",
        specialty: "Surveillance",
        clearance: "Level 4",
        status: "REDACTED"
    },
    {
        id: 6,
        name: "Dr. Watson",
        role: "Medical Examiner",
        specialty: "Autopsy",
        clearance: "Level 3",
        status: "ACTIVE"
    }
];

const Speakers = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse Drag to Scroll Implementation
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section id="speakers" className="bg-[#f5f1e6] py-20 border-t border-[#7C6C58] relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#0E0E0E] mb-2 uppercase tracking-wide">
                    Suspect Profiles
                </h2>
                <div className="h-1 w-24 bg-[#7C6C58] mx-auto mb-4"></div>
                <p className="font-mono text-[#555] text-sm uppercase tracking-widest">
                    Identify the Key Players
                </p>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex md:overflow-x-auto overflow-y-hidden gap-8 px-8 py-8 md:snap-x md:snap-mandatory cursor-grab active:cursor-grabbing no-scrollbar flex-col md:flex-row"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {speakersData.map((speaker, index) => (
                    <div
                        key={speaker.id}
                        className="flex-shrink-0 w-full md:w-[320px] snap-center"
                    >
                        {/* Speaker Card - Wanted Poster / Case File Style */}
                        <div className="bg-[#fdfbf7] p-4 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] border border-[#d1ccc0] relative group transition-transform duration-300 hover:-translate-y-2">

                            {/* Paperclip Effect */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 border-4 border-[#888] rounded-full z-20 border-b-0"></div>

                            {/* "Confidential" Stamp */}
                            <div className="absolute top-4 right-4 border-2 border-red-700 text-red-700 px-2 py-1 transform rotate-12 opacity-70 font-black uppercase text-[10px] tracking-wider border-double z-10">
                                {speaker.status}
                            </div>

                            {/* Image Container */}
                            <div className="h-64 overflow-hidden mb-4 border border-[#eee] relative bg-[#333]">
                                <img
                                    src={detectiveImage}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover filter grayscale sepia-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                />
                                {/* Fingerprint Overlay (CSS only) */}
                                <div className="absolute bottom-2 right-2 w-12 h-12 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/fingerprint.png')]"></div>
                            </div>

                            {/* Details */}
                            <div className="text-center space-y-2 border-t-2 border-dotted border-[#ccc] pt-4">
                                <h3 className="font-playfair text-2xl font-bold text-[#0E0E0E]">
                                    {speaker.name}
                                </h3>
                                <p className="font-merriweather text-[#7C6C58] italic text-sm">
                                    {speaker.role}
                                </p>

                                <div className="mt-4 text-left bg-[#f0ebd8] p-3 text-xs font-mono text-[#555] border-l-2 border-[#7C6C58]">
                                    <div className="flex justify-between mb-1">
                                        <span className="uppercase font-bold">Specialty:</span>
                                        <span>{speaker.specialty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="uppercase font-bold">Clearance:</span>
                                        <span>{speaker.clearance}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom ID Number */}
                            <div className="mt-4 pt-2 border-t border-[#eee] text-center">
                                <span className="font-mono text-[10px] text-[#aaa] tracking-[0.2em] uppercase">
                                    ID: 8492-AX-{speaker.id}0
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </section>
    );
};

export default Speakers;
