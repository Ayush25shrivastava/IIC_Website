import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const pastSpeakers = [
    { name: "Avadh Ojha", image: "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2025/02/11/3673336-awadh-ojha.jpg" },
    { name: "Maj Gen Yash Mor", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9foZhm3VIQEdUgnsy4XM8soPLl9Lj0C_S1WFo9LrPMvzAMKBF" },
    { name: "Dr. Nisha Khanna", image: "https://sippingthoughts.com/wp-content/uploads/2024/12/2-3-768x614.png" },
    { name: "Rajat Chauhan", image: "https://pbs.twimg.com/profile_images/1277549190541791234/7hFiRPij_400x400.jpg" },
    { name: "Kaustubh Agarwal", image: "https://nerdsofcomedy.com/wp-content/uploads/2025/07/Kaustubh_Agarwal.jpg" },
    { name: "Sandeep Jain", image: "https://todaymagazine.in/public/images/posts/post1726898114.jpg" },
    { name: "Vandana Sharma", image: "https://sosimg.sgp1.cdn.digitaloceanspaces.com/artist-gallery/7057669_1770113662.webp" },
    { name: "Dr. Gajendra Purohit", image: "https://gajendrapurohit.in/wp-content/uploads/2025/09/image-33-1-1024x683.jpg" },
];

const galleryPhotos = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800",
    "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
];

const Gallery = () => {
    const titleRef = useRef(null);
    const sectionHeadings = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
            titleRef.current.children,
            { opacity: 0, x: -50, skewX: 10 },
            { opacity: 1, x: 0, skewX: 0, duration: 1.5, stagger: 0.3 }
        );

        sectionHeadings.current.forEach((heading) => {
            gsap.fromTo(
                heading,
                {
                    opacity: 0,
                    y: 80,
                    filter: "blur(10px)",
                    letterSpacing: "0.5em"
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    letterSpacing: "0.15em",
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 80%",
                    }
                }
            );
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] pt-32 pb-20 px-6 relative overflow-x-hidden">

            {/* Background */}
            <div
                className="fixed inset-0 bg-center bg-cover z-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "url('https://img.freepik.com/premium-photo/old-cluttered-study-room-with-mismatched-furniture-books-papers-scattered-everywhere-illuminated-by-dim-warm-glow-reflecting-sense-intellect-nostalgia_95891-133184.jpg?semt=ais_rp_progressive&w=740&q=80')",
                    opacity: 0.35,
                    filter: "contrast(1.1) brightness(0.7)"
                }}
            />

            {/* Film Grain */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[60]"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* HEADER */}
                <header ref={titleRef} className="mb-28 border-l border-[#7C6C58]/30 pl-8">
                    <h1 className="font-playfair text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-none">
                        Intelligence <span className="text-[#7C6C58]">Archive</span> <br />
                    </h1>
                </header>

                {/* CONFIDENTIAL ASSETS */}
                <section className="mb-40">
                    <div className="flex flex-col items-center mb-24 text-center relative">

                        <h2
                            ref={(el) => (sectionHeadings.current[0] = el)}
                            className="font-playfair text-3xl md:text-5xl lg:text-[80px] text-white uppercase tracking-[0.25em] leading-none"
                        >
                            CONFIDENTIAL ASSETS
                        </h2>

                        <div className="mt-8 backdrop-blur-md bg-black/50 border border-[#7C6C58]/30 px-10 py-4 rounded-xl shadow-2xl">
                            <p className="font-serif italic text-lg md:text-xl text-[#D6C3A5] tracking-wide">
                                Documented operatives and classified contributors shaping the mission.
                            </p>
                        </div>

                    </div>

                    <div className="relative overflow-hidden py-10">
                        <div className="flex whitespace-nowrap animate-marquee">
                            {[...pastSpeakers, ...pastSpeakers].map((speaker, index) => (
                                <div key={index} className="inline-block mx-8 text-center group">
                                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#7C6C58]/20 group-hover:border-[#B8A18A] transition-all duration-700 grayscale group-hover:grayscale-0 scale-95 group-hover:scale-100">
                                        <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                                    </div>

                                    <h4 className="mt-6 font-playfair text-2xl text-white font-semibold tracking-wide">
                                        {speaker.name}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FIELD EVIDENCE */}
                <section>
                    <div className="flex flex-col items-center mb-24 text-center relative">

                        <h2
                            ref={(el) => (sectionHeadings.current[1] = el)}
                            className="font-playfair text-3xl md:text-5xl lg:text-[80px] text-white uppercase tracking-[0.25em] leading-none"
                        >
                            FIELD EVIDENCE
                        </h2>

                        <div className="mt-8 backdrop-blur-md bg-black/50 border border-[#7C6C58]/30 px-10 py-4 rounded-xl shadow-2xl">
                            <p className="font-serif italic text-lg md:text-xl text-[#D6C3A5] tracking-wide">
                                Archived visuals and documented intelligence from the field.
                            </p>
                        </div>

                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {galleryPhotos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group break-inside-avoid bg-[#1A1A1A]/80 p-3 border border-[#7C6C58]/20 shadow-2xl hover:rotate-1 transition-transform duration-500 backdrop-blur-sm"
                            >
                                <div className="overflow-hidden bg-black aspect-video md:aspect-auto">
                                    <img
                                        src={photo}
                                        alt="Evidence"
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                                    />
                                </div>

                                <div className="mt-4 flex justify-between items-center px-1">
                                    <span className="text-[9px] font-mono text-[#7C6C58]">
                                        REF_IMG_00{index + 104}
                                    </span>
                                    <span className="text-[9px] font-mono text-[#7C6C58]">
                                        CONFIDENTIAL
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* FOOTER */}
            <div className="mt-32 pb-10 text-center opacity-20 flex flex-col items-center gap-2 relative z-10">
                <div className="w-16 h-[1px] bg-[#7C6C58]"></div>
                <p className="text-[10px] tracking-widest uppercase italic">
                    Time is a flat circle. Everything we've ever done or will do, we're gonna do over and over and over again.
                </p>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: fit-content;
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default Gallery;