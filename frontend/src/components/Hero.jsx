import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef(null);
    const bgImageRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background Image Zoom-Out Parallax
            gsap.fromTo(bgImageRef.current,
                { scale: 1.2 },
                {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            // Text Entrance Animation
            gsap.from(textRef.current.children, {
                y: 100,
                opacity: 0,
                duration: 1.5,
                stagger: 0.3,
                ease: "power3.out",
                delay: 0.5
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center">
            {/* Background Image Wrapper */}
            <div className="absolute inset-0 z-0">
                <div
                    ref={bgImageRef}
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://wallpapercave.com/wp/wp15704476.jpg')",
                        filter: "brightness(0.6) grayscale(100%) contrast(1.2)"
                    }}
                ></div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div ref={textRef} className="relative z-10 flex flex-col items-center gap-6 px-4">
                <h1 className="font-playfair text-6xl md:text-9xl text-white font-bold tracking-tight drop-shadow-2xl">
                    Udbhav
                    <div className="w-full h-1 bg-[#B8A18A] rounded-full"></div>
                </h1>

                <p className="font-merriweather text-lg md:text-2xl text-[#dcd9d2] max-w-2xl font-light italic">
                    Vision • Venture • Victory
                </p>

                <div className="mt-8 flex flex-col md:flex-row gap-6">
                    <button className="px-10 py-4 border-2 border-[#B8A18A] bg-[#B8A18A] text-[#0E0E0E] font-merriweather font-bold uppercase hover:bg-transparent hover:text-[#B8A18A] transition-all duration-300 transform hover:scale-105">
                        Register Now
                    </button>
                    <button className="px-10 py-4 border-2 border-[#B8A18A] text-[#B8A18A] font-merriweather font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300 transform hover:scale-105">
                        Explore Events
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
