import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const eventsData = [
    {
        id: 1,
        title: "Theta Decay",
        date: "Oct 24",
        category: "Intelligence",
        image: "https://projectoption.com/_astro/slv-long-puts-negative-theta.DnZJW_Hw_Z1gGRkT.webp",
        description: "The signal is fading. Decode the patterns before the entropy reaches critical mass."
    },
    {
        id: 2,
        title: "Seed Start Summit",
        date: "Oct 25",
        category: "Briefing",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        description: "Planting the roots of a new investigation. Where ideas germinate in the dark soil of progress."
    },
    {
        id: 3,
        title: "Mock IPL Auction",
        date: "Oct 26",
        category: "High Stakes",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        description: "Every man has a price. Place your bets and build your empire while the gavel falls."
    },
    {
        id: 4,
        title: "Case Clash",
        date: "Oct 27",
        category: "Interrogation",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7FgZssadiFZ-3985Ssgs9noykiSKZJytDow&s",
        description: "Two stories, one truth. Pit your logic against the evidence in a room with no exits."
    },
    {
        id: 5,
        title: "Quest Youth",
        date: "Oct 28",
        category: "Recon",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
        description: "The next generation of watchers. A hunt through the landscape for what was lost."
    },
    {
        id: 6,
        title: "Stall Mania",
        date: "Oct 29",
        category: "Market",
        image: "https://content.jdmagicbox.com/v2/comp/bangalore/x1/080pxx80.xx80.180411155049.x6x1/catalogue/momentum-events-jp-nagar-bangalore-decorators-8gye2hclm3.jpg",
        description: "A bustling front for the underground. Trade, barter, and watch your back in the chaos."
    },
    {
        id: 7,
        title: "Viral Vision",
        date: "Oct 30",
        category: "Surveillance",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        description: "The eyes are everywhere. Capture the moment before it spreads through the network like a fever."
    },
    {
        id: 8,
        title: "Venture Vault",
        date: "Oct 31",
        category: "Evidence",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW1jQatQstPf75hjyBO274Qcy5mZwSsNZyOg&s0",
        description: "Locked away for a reason. Crack the safe and secure the assets of the final operation."
    }
];

const Events = () => {
    const cardsRef = useRef([]);
    const titleRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Parallax effect on the "Flat Circle"
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

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Cinematic Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
            
            {/* The Flat Circle Background */}
            <div
                ref={bgRef}
                className="absolute inset-0 bg-repeat bg-cover bg-center z-0 pointer-events-none"
                style={{
                    backgroundImage:
                    "url('https://fcmod.org/wp-content/uploads/2020/03/philatelist-1844080_640-e1585082769528.jpg')",
                    backgroundSize: "contain",
                    opacity: 0.15
                }}
            />
            <div className="max-w-7xl mx-auto relative z-10">
                <header ref={titleRef} className="mb-20 border-l border-[#7C6C58]/30 pl-8">
                    <h1 className="font-playfair text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-none">
                        Active <span className="text-[#7C6C58]">Docket</span> <br /> 
                        <span className="text-4xl md:text-6xl italic font-light opacity-80 uppercase font-merriweather">Udbhav 2026</span>
                    </h1>
                    <p className="mt-6 font-merriweather text-sm md:text-base max-w-xl opacity-50 leading-relaxed uppercase tracking-[0.3em]">
                        "The world is a graveyard. You just gotta know where to dig."
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {eventsData.map((event, index) => (
                        <div 
                            key={event.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative bg-[#121212] border-t border-[#7C6C58]/20 transition-all duration-700"
                        >
                            {/* Evidence Photo */}
                            <div className="relative h-60 overflow-hidden">
                                <img 
                                    src={event.image} 
                                    alt={event.title}
                                    className="w-full h-full object-cover desaturate group-hover:desaturate-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                                <div className="absolute top-4 right-4 px-2 py-1 bg-[#7C6C58]/20 backdrop-blur-md border border-[#7C6C58]/40 text-[9px] text-[#B8A18A] tracking-[0.2em] uppercase">
                                    {event.category}
                                </div>
                            </div>

                            {/* Docket Content */}
                            <div className="p-6 border-x border-b border-white/5 group-hover:border-[#7C6C58]/40 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-playfair text-2xl font-bold text-white group-hover:text-[#B8A18A] transition-colors leading-tight">
                                        {event.title}
                                    </h3>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-[#7C6C58] tracking-tighter">{event.date}</p>
                                    </div>
                                </div>
                                
                                <p className="font-merriweather text-xs italic leading-relaxed opacity-60 mb-8 h-12 overflow-hidden">
                                    "{event.description}"
                                </p>
                                
                                <button className="w-full py-3 border border-[#7C6C58]/30 group-hover:border-[#B8A18A] text-[#7C6C58] group-hover:text-[#0E0E0E] group-hover:bg-[#B8A18A] transition-all duration-500 font-bold uppercase text-[9px] tracking-[0.4em]">
                                    Analyze File
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-32 pb-10 text-center opacity-20 flex flex-col items-center gap-2">
                <div className="w-16 h-[1px] bg-[#7C6C58]"></div>

            </div>
        </div>
    );
};

export default Events;