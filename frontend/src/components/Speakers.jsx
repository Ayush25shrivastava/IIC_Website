import React, { useRef, useState } from 'react';
import detectiveImage from '../assets/detective-image.png';
import { FaLinkedinIn } from "react-icons/fa";

// ✅ Handle both URL + local image + fallback
const getSpeakerImageUrl = (image) => {
    if (!image) return detectiveImage;

    if (image.startsWith('http')) return image;

    try {
        return new URL(`../assets/speakers/${image}`, import.meta.url).href;
    } catch {
        return detectiveImage;
    }
};

const speakersData = [
    {
        id: 1,
        name: "Alok Sharma",
        role: "Head of Data Platforms & Security Engineering at Meesho",
        // expertise: "Data Platforms, Security Engineering, Scalable Systems, Startup Leadership",
        designation: "Leading role at Meesho",
        alumniOf: "MNNIT ECE 2008",
        status: "RECOGNISED",
        image: "alok.jpeg", 
        linkedin: "https://www.linkedin.com/in/ialok/"
    },
    {
        id: 2,
        name: "Praveen Kumar",
        role: "Building in AI × LegalTech",
        // expertise: "Entrepreneurship, AI, Finance, Management Consulting",
        designation: "Entrepreneur",
        alumniOf: "MNNIT ECE 2008",
        status: "RECOGNISED",
        image: "https://media.licdn.com/dms/image/v2/D5603AQH9JVQtk1EQ9A/profile-displayphoto-shrink_400_400/B56Zc_13pPGQAk-/0/1749122776185?e=2147483647&v=beta&t=5M2ZXRkcbl_JsdBZb4BOaKV7BgC4MNOetILgjcdH32c",
        linkedin: "https://www.linkedin.com/in/praveen-kumar-iima/"
    },
    {
        id: 3,
        name: "Rishabh Sharma",
        role: "UPSC CSE Rank 116 | Consulting Analyst at Deloitte ",
        // expertise: "Public Policy, Consulting, Data Analysis",
        designation: "Consulting Analyst",
        alumniOf: "MNNIT CHE 2022",
        status: "RECOGNISED",
        image: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774953907/WhatsApp_Image_2026-03-31_at_12.44.42_anlrrq.jpg",
        linkedin: "https://www.linkedin.com/in/rishabh-sharma-503773187/"
    },
    {
        id: 4,
        name: "Nikky Kumar Jha",
        role: "Co-Founder at Saptkrishi Scientific",
        // expertise: "Agriculture Innovation, Cold Storage Solutions, Social Entrepreneurship",
        designation: "Co-Founder",
        alumniOf: "IIT Kanpur 2024",
        status: "RECOGNISED",
        image: "nikky.png",
        linkedin: "https://www.linkedin.com/in/nikkykumarjha/"
    },
    {
        id: 3,
        name: "Rishabh Sharma",
        data: "MNNIT CE 2022",
        role: "UPSC CSE Rank 116 | Consulting Analyst at Deloitte ",
        expertise: "Public Policy, Consulting, Data Analysis",
        designation: "Consulting Analyst at Deloitte",
        status: "RECOGNISED",
        image: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774953907/WhatsApp_Image_2026-03-31_at_12.44.42_anlrrq.jpg",
        linkedin: "https://www.linkedin.com/in/rishabh-sharma-503773187/"
    },
    {
        id: 4,
        name: "Nikky Kumar Jha",
        // data: "MNNIT ECE 2008",
        role: "Co-Founder at Saptkrishi Scientific",
        expertise: "Agriculture Innovation, Cold Storage Solutions, Social Entrepreneurship",
        designation: "Co-Founder",
        status: "RECOGNISED",
        image: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774956241/Screenshot_2026-03-31_165349_dgycrv.png",
        linkedin: "https://www.linkedin.com/in/nikkykumarjha/"
    },
    
    
    
    // {
    //     id: 5,
    //     name: "Speaker 5",
    //     role: "Company 5",
    //     expertise: "Surveillance",
    //     designation: "CEO",
    //     status: "RECOGNISED",
    //     image: "",
    //     linkedin: "https://linkedin.com"
    // },
    // {
    //     id: 6,
    //     name: "Speaker 6",
    //     role: "Company 6",
    //     expertise: "Retired Military Officer",
    //     designation: "Ex-Army Officer",
    //     status: "RECOGNISED",
    //     image: "",
    //     linkedin: "https://linkedin.com"
    // }
];

const Speakers = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section id="speakers" className="bg-[#f5f1e6] py-20 border-t border-[#7C6C58] relative overflow-hidden scroll-mt-24">

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#0E0E0E] mb-2 uppercase tracking-wide">
                    Featured Speakers
                </h2>
                <div className="h-1 w-24 bg-[#7C6C58] mx-auto mb-4"></div>
                <p className="font-mono text-[#555] text-sm uppercase tracking-widest">
                    Insights from Leading Experts 
                </p>
            </div>

            <div
                ref={scrollRef}
                className="flex md:overflow-x-auto overflow-y-hidden gap-8 px-8 md:pl-0 md:ml-32 lg:ml-40 py-8 md:snap-x md:snap-mandatory cursor-grab active:cursor-grabbing no-scrollbar flex-col md:flex-row"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {speakersData.map((speaker) => (
                    <div key={speaker.id} className="flex-shrink-0 w-full md:w-[320px] snap-center">

                        <div className="bg-[#fdfbf7] p-4 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] border border-[#d1ccc0] relative group transition-transform duration-300 hover:-translate-y-2">

                            {/* <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-12 border-4 border-[#888] rounded-full z-20 border-b-0"></div> */}

                            <div className="absolute top-4 right-4 border-2 border-red-700 text-red-700 px-2 py-1 transform rotate-12 opacity-70 font-black uppercase text-[10px] tracking-wider border-double z-10">
                                {speaker.status}
                            </div>

                            {/* Image */}
                            <div className="h-64 overflow-hidden mb-4 border border-[#eee] relative bg-[#333]">
                                <img
                                    src={getSpeakerImageUrl(speaker.image)}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute bottom-2 right-2 w-12 h-12 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/fingerprint.png')]"></div>
                            </div>

                            <div className="text-center space-y-2 border-t-2 border-dotted border-[#ccc] pt-4">

                                {/* ✅ Name + Square LinkedIn Icon */}
                                <div className="flex items-center justify-center gap-2">
                                    <h3 className="font-playfair text-2xl font-bold text-[#0E0E0E]">
                                        {speaker.name}
                                    </h3>

                                    {speaker.linkedin && (
                                        <a
                                            href={speaker.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-5 h-5 border border-[#0A66C2] text-[#0A66C2] rounded-sm font-bold hover:bg-[#0A66C2] hover:text-white transition"
                                        >
                                            <FaLinkedinIn className="text-[11px] font-bold" />
                                        </a>
                                    )}
                                </div>
                                <p className="font-merriweather text-[#7C6C58] italic text-sm">
                                    {speaker.data}
                                </p>

                                <p className="font-merriweather text-[#7C6C58] italic text-sm">
                                    {speaker.role}
                                </p>

                                

                                <div className="mt-4 text-left bg-[#f0ebd8] p-3 text-xs font-mono text-[#555] border-l-2 border-[#7C6C58]">
                                    {/* <div className="flex justify-between mb-1">
                                        <span className="uppercase font-bold">Expertise:</span>
                                        <span>{speaker.expertise}</span>
                                    </div> */}
                                    <div className="flex justify-between mb-1">
                                        <span className="uppercase font-bold">Designation:</span>
                                        <span>{speaker.designation}</span>
                                    </div>
                                    {speaker.alumniOf && (
                                        <div className="flex justify-between">
                                            <span className="uppercase font-bold">Alumnus:</span>
                                            <span>{speaker.alumniOf}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-2 border-t border-[#eee] text-center">
                                <span className="font-mono text-[10px] text-[#aaa] tracking-[0.2em] uppercase">
                                    ID: 8492-AX-{speaker.id}0
                                </span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default Speakers;
