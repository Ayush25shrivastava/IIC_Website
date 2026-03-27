import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import loopVideo from '../assets/loop_video.mp4';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const countersRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%", // Start animation when top of section hits 80% viewport
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });

            countersRef.current.forEach((counter) => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix');

                gsap.fromTo(counter,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        scrollTrigger: {
                            trigger: counter,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        },
                        onUpdate: function () {
                            counter.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80 grayscale filter brightness-50"
                >
                    <source src={loopVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay for readibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E] via-transparent to-[#0E0E0E] opacity-90"></div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="relative z-10 max-w-4xl text-center text-white space-y-8">
                <div className="flex justify-center mb-6">
                    <span className="w-20 h-1 bg-[#B8A18A]"></span>
                </div>

                <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-4 text-[#B8A18A]">
                    About UDBHAV
                </h2>

                <p className="font-merriweather text-lg md:text-xl leading-relaxed text-[#dcd9d2]">
                    Annual Entrepreneurship & Financial Literacy Summit
                </p>

                <p className="font-merriweather text-lg md:text-xl leading-relaxed text-[#dcd9d2]">
                    Organized under the aegis of IIC, Udbhav is MNNIT’s premier event designed to bridge the gap between technical education and business acumen. The summit features business plan competitions, financial literacy workshops, and expert lectures, serving as a catalyst for student-led enterprise.
                </p>

                <p className="font-merriweather text-lg md:text-xl leading-relaxed text-[#dcd9d2]">
                    At MNNIT Allahabad, we believe that the next big idea can come from anywhere. Whether you are a student with a prototype, a researcher with a patent, or an alumnus looking to give back, IIC provides the platform to turn vision into reality.
Together, let us build a self-reliant and innovative future

                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 border border-[#7C6C58] bg-[#0E0E0E] bg-opacity-50 backdrop-blur-sm rounded-lg hover:border-[#B8A18A] transition-colors duration-300">
                        <h3
                            ref={el => countersRef.current[0] = el}
                            data-target="15"
                            data-suffix="+"
                            className="font-playfair text-4xl font-bold text-[#B8A18A] mb-2"
                        >
                            0+
                        </h3>
                        <p className="font-merriweather text-sm text-gray-300">Startups Incubated</p>
                    </div>
                    <div className="p-6 border border-[#7C6C58] bg-[#0E0E0E] bg-opacity-50 backdrop-blur-sm rounded-lg hover:border-[#B8A18A] transition-colors duration-300">
                        <h3
                            ref={el => countersRef.current[1] = el}
                            data-target="40"
                            data-suffix="+"
                            className="font-playfair text-4xl font-bold text-[#B8A18A] mb-2"
                        >
                            0+
                        </h3>
                        <p className="font-merriweather text-sm text-gray-300">Events Organized</p>
                    </div>
                    <div className="p-6 border border-[#7C6C58] bg-[#0E0E0E] bg-opacity-50 backdrop-blur-sm rounded-lg hover:border-[#B8A18A] transition-colors duration-300">
                        <h3
                            ref={el => countersRef.current[2] = el}
                            data-target="2"
                            data-suffix="k+"
                            className="font-playfair text-4xl font-bold text-[#B8A18A] mb-2"
                        >
                            0k+
                        </h3>
                        <p className="font-merriweather text-sm text-gray-300">Student Reach</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
