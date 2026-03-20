import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from 'framer-motion';
import img1 from "../assets/past images/DSC_0364.jpg";
import img2 from "../assets/past images/DSC_0392.jpg";
import img3 from "../assets/past images/DSC_0454.jpg";
import img4 from "../assets/past images/DSC_0690.jpg";
import img5 from "../assets/past images/DSC_0704.jpg";
import img6 from "../assets/past images/DSC_0733.jpg";
import img7 from "../assets/past images/DSC_0757.jpg";
import img8 from "../assets/past images/DSC_0752.jpg";
import img9 from "../assets/past images/DSC_04981.jpg";
import img10 from "../assets/past images/DSC_0736.jpg";
import img11 from "../assets/past images/DSC_0740.jpg";
import img12 from "../assets/past images/DSC_0715.jpg";
import img13 from "../assets/past images/DSC_0534.jpg";
import img14 from "../assets/past images/DSC_0458.jpg";
import img15 from "../assets/past images/DSC_0442.jpg";
import img16 from "../assets/past images/DSC_0438.jpg";

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
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
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
        <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] md:pl-40 pt-32 pb-20 px-6 relative overflow-x-hidden">

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
                        Event <span className="text-[#7C6C58]">Archive</span> <br />
                    </h1>
                </header>

                {/* CONFIDENTIAL ASSETS */}
                <section className="mb-40">
                    <div className="flex flex-col items-center mb-24 text-center relative">

                        <h2
                            ref={(el) => (sectionHeadings.current[0] = el)}
                            className="font-playfair text-3xl md:text-5xl lg:text-[80px] text-white uppercase tracking-[0.25em] leading-none"
                        >
                            PAST SPEAKERS
                        </h2>

                        <div className="mt-8 backdrop-blur-md bg-black/50 border border-[#7C6C58]/30 px-10 py-4 rounded-xl shadow-2xl">
                            <p className="font-serif italic text-lg md:text-xl text-[#D6C3A5] tracking-wide">
                                Notable speakers who have contributed valuable insights in our past events.
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
                            PAST EVENT HIGHLIGHTS
                        </h2>

                        <div className="mt-8 backdrop-blur-md bg-black/50 border border-[#7C6C58]/30 px-10 py-4 rounded-xl shadow-2xl">
                            <p className="font-serif italic text-lg md:text-xl text-[#D6C3A5] tracking-wide">
                                A collection of memorable moments and highlights from past events.
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleryPhotos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group bg-[#1A1A1A]/80 p-3 border border-[#7C6C58]/20 shadow-2xl hover:rotate-1 transition-transform duration-500 backdrop-blur-sm"
                            >
                                <div className="overflow-hidden bg-black aspect-video">
                                    <img
                                        src={photo}
                                        alt="Evidence"
                                        className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-1000"
                                    />
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




















