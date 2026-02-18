import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
    {
        time: "09:00 AM",
        date: "Oct 24",
        title: "Theta Decay",
        location: "Main Auditorium",
        type: "Briefing",
        status: "SCHEDULED"
    },
    {
        time: "11:30 AM",
        date: "Oct 25",
        title: "Seed Start Summit",
        location: "Conference Room B",
        type: "Intel Gathering",
        status: "CONFIRMED"
    },
    {
        time: "02:00 PM",
        date: "Oct 26",
        title: "Mock IPL Auction",
        location: "War Room",
        type: "High Stakes",
        status: "PENDING"
    },
    {
        time: "04:30 PM",
        date: "Oct 27",
        title: "Case Clash",
        location: "Interrogation Cell",
        type: "Analysis",
        status: "CLASSIFIED"
    },
    {
        time: "10:00 AM",
        date: "Oct 28",
        title: "Quest Youth",
        location: "Field Ops",
        type: "Recon",
        status: "ACTIVE"
    },
    {
        time: "01:00 PM",
        date: "Oct 29",
        title: "Stall Mania",
        location: "The Market",
        type: "Undercover",
        status: "OPEN"
    },
    {
        time: "10:00 AM",
        date: "Oct 30",
        title: "Viral Vision",
        location: "Cyber Deck",
        type: "Surveillance",
        status: "ONLINE"
    },
    {
        time: "06:00 PM",
        date: "Oct 31",
        title: "Venture Vault",
        location: "Secure Vault",
        type: "Extraction",
        status: "LOCKED"
    }
];

const EventTimeline = () => {
    const sectionRef = useRef(null);
    const lineRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Timeline Line Animation
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1.5
                    }
                }
            );

            // Cards Animation
            cardsRef.current.forEach((card, index) => {
                const direction = index % 2 === 0 ? -70 : 70;

                gsap.fromTo(card,
                    {
                        opacity: 0,
                        x: direction,
                        rotation: index % 2 === 0 ? -5 : 5
                    },
                    {
                        opacity: 1,
                        x: 0,
                        rotation: 2, // Settle to slightly random angle for "thrown on desk" look? changed to 0 for clean read
                        duration: 0.3,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 65%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="timeline" className="relative min-h-screen bg-[#0E0E0E] py-32 overflow-hidden">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-playfair text-5xl md:text-7xl font-bold text-[#dcd9d2] mb-4">Operation Timeline</h2>
                    {/* <p className="font-mono text-[#B8A18A] tracking-widest uppercase text-sm">Synchronize Watch // Sequence of Events</p> */}
                </div>

                <div className="relative">
                    {/* Central Timeline Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#7C6C58]/30 -translate-x-1/2 md:translate-x-0">
                        <div ref={lineRef} className="w-full bg-[#B8A18A] shadow-[0_0_15px_rgba(184,161,138,0.5)]"></div>
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {timelineData.map((item, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Empty space for alternating layout */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Timeline Node/Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#0E0E0E] border-2 border-[#B8A18A] rounded-full -translate-x-1/2 z-20 shadow-[0_0_10px_#B8A18A]">
                                    <div className="w-full h-full bg-[#B8A18A] rounded-full animate-pulse opacity-50"></div>
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                                    <div
                                        ref={el => cardsRef.current[index] = el}
                                        className="relative bg-[#f5f1e6] p-1 shadow-lg transform transition-transform hover:scale-105 duration-300 postcard-border"
                                        style={{
                                            maxWidth: '400px',
                                            marginLeft: index % 2 === 0 ? '0' : 'auto', // Align correctly on desktop
                                            marginRight: index % 2 !== 0 ? '0' : 'auto'
                                        }}
                                    >
                                        {/* Airmail Border Visual handled by CSS class below */}
                                        <div className="bg-[#f5f1e6] p-6 h-full border border-[#d1ccc0] relative overflow-hidden">

                                            {/* Stamp Area */}
                                            <div className="absolute top-4 right-4 w-16 h-20 border border-dashed border-[#ccc] flex items-center justify-center opacity-50">
                                                <span className="text-[8px] text-center uppercase text-[#999] font-mono leading-tight">Postage<br />Paid<br />Udbhav</span>
                                            </div>

                                            {/* Postmark */}
                                            <div className="absolute top-2 right-12 w-20 h-20 rounded-full border-2 border-[#0E0E0E]/20 flex items-center justify-center rotate-[-15deg] pointer-events-none">
                                                <div className="text-[8px] text-[#0E0E0E]/30 font-bold uppercase text-center leading-none">
                                                    MNNIT<br />ALLHBD<br />{item.date}
                                                </div>
                                            </div>

                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="border-b-2 border-dotted border-[#0E0E0E]/20 pb-2">
                                                    <h3 className="font-playfair text-2xl font-bold text-[#2a2a2a] leading-tight">{item.title}</h3>
                                                    <span className="font-mono text-xs text-[#d63031] font-bold uppercase tracking-wider">{item.status}</span>
                                                </div>

                                                <div className="space-y-2 font-mono text-sm text-[#4a4a4a]">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-4 h-4 text-[#7C6C58]">🕒</span>
                                                        <span>{item.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-4 h-4 text-[#7C6C58]">📍</span>
                                                        <span>{item.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-4 h-4 text-[#7C6C58]">📂</span>
                                                        <span className="uppercase">{item.type}</span>
                                                    </div>
                                                </div>

                                                {/* Handwritten Note Style */}
                                                <div className="mt-2 pt-2">
                                                    <p className="font-merriweather italic text-xs text-[#666]">
                                                        "Attendance mandatory. Briefing at {item.time}."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .postcard-border {
                    background: repeating-linear-gradient(
                        135deg,
                        #e74c3c 0px,
                        #e74c3c 10px,
                        #f5f1e6 10px,
                        #f5f1e6 20px,
                        #3498db 20px,
                        #3498db 30px,
                        #f5f1e6 30px,
                        #f5f1e6 40px
                    );
                }
            `}</style>
        </section>
    );
};

export default EventTimeline;
