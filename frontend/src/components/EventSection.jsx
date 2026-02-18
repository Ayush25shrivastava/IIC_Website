import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const EventSection = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const totalWidth = triggerRef.current.scrollWidth;
                const windowWidth = window.innerWidth;
                const scrollWidth = totalWidth - windowWidth;

                if (scrollWidth > 0) {
                    gsap.to(triggerRef.current, {
                        x: -scrollWidth,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: `+=${scrollWidth}`,
                            scrub: 1,
                            pin: true,
                            anticipatePin: 1,
                        },
                    });
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="events" className="bg-[#dcd9d2] text-[#0E0E0E] overflow-hidden relative theme-detective">
            <div className="md:h-screen w-full flex flex-col md:flex-row items-center md:items-start overflow-hidden">
                <div
                    ref={triggerRef}
                    className="flex flex-col md:flex-row md:h-full w-full md:w-auto p-8 md:p-0 gap-8 md:gap-0 items-center"
                >
                    {/* Spacer for start of scroll (optional, reduced size) */}
                    <div className="hidden md:block w-[10vw] shrink-0"></div>

                    {/* Events List */}
                    {eventsData.map((event) => (
                        <div
                            key={event.id}
                            className="shrink-0 w-full md:w-[500px] md:h-full flex items-center justify-center p-4 md:p-8 box-border"
                        >
                            {/* Case File Card */}
                            <div className="relative w-full h-auto min-h-[600px] bg-[#fdfbf7] md:rotate-1 rounded-sm shadow-[5px_5px_15px_rgba(0,0,0,0.2)] flex flex-col border border-[#d1ccc0] group hover:rotate-0 transition-transform duration-500 overflow-hidden">

                                {/* Folder Tab Effect (Visual only) */}
                                <div className="absolute top-0 right-0 w-24 h-8 bg-[#f3efe6] border-b border-l border-[#d1ccc0] rounded-bl-lg"></div>

                                {/* Paper Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

                                {/* Content Container */}
                                <div className="p-6 md:p-8 flex flex-col h-full relative z-10">

                                    {/* Header: ID and Topic */}
                                    <div className="flex justify-between items-start mb-6 border-b-2 border-[#0E0E0E]/80 pb-2">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs text-[#0E0E0E]/60 uppercase tracking-widest">Case File ID</span>
                                            <span className="font-mono text-xl text-[#0E0E0E] font-bold">#00{event.id}-{event.category.toUpperCase().substring(0, 3)}</span>
                                        </div>
                                        <div className="border-2 border-red-700 text-red-700 px-2 py-1 transform -rotate-12 opacity-80 font-black uppercase text-xs tracking-wider border-double">
                                            Confidential
                                        </div>
                                    </div>

                                    {/* Attached Evidence (Image) */}
                                    <div className="relative mb-6 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500 w-[90%] mx-auto">
                                        {/* Paperclip Visual */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 border-2 border-[#5a5a5a] rounded-full z-20 bg-transparent border-b-0"></div>
                                        <div className="p-2 bg-white shadow-md border border-[#eee]">
                                            <div className="h-40 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="pt-2 text-center">
                                                <p className="font-mono text-[10px] text-[#0E0E0E]/50 tracking-widest uppercase">Fig 1.1: Target Evidence</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Case Details */}
                                    <div className="flex-grow space-y-4">
                                        <h3 className="font-playfair text-3xl font-bold text-[#0E0E0E] mb-2 leading-none border-b border-[#0E0E0E]/10 pb-2">{event.title}</h3>

                                        <div className="font-mono text-xs space-y-3 text-[#0E0E0E]">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Date of incident</span>
                                                    <span className="font-bold">{event.date}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Operation Mode</span>
                                                    <span className="font-bold">{event.mode}</span>
                                                </div>
                                            </div>

                                            <div className="bg-[#0e0e0e]/5 p-3 rounded-sm border-l-2 border-[#0E0E0E]">
                                                <span className="block text-[#0E0E0E]/50 uppercase text-[9px] mb-1">Mission Intel</span>
                                                <p className="leading-relaxed opacity-80 italic">"{event.intel}"</p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="block text-[#0E0E0E]/50 uppercase text-[9px]">Required Personnel</span>
                                                    <span className="font-bold">{event.teamSize}</span>
                                                </div>
                                                <button className="px-4 py-2 border border-[#0E0E0E] text-[#0E0E0E] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0E0E0E] hover:text-[#dcd9d2] transition-colors duration-300">
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

                    {/* End Spacer */}
                    <div className="hidden md:block w-[10vw]"></div>
                </div>
            </div>
            <style jsx>{`
                .theme-detective {
                    background-image: repeating-linear-gradient(
                        45deg,
                        #dcd9d2 0px,
                        #dcd9d2 10px,
                        #d4d1ca 10px,
                        #d4d1ca 11px
                    );
                }
            `}</style>
        </section>
    );
};

export default EventSection;
