import React, { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IoPeopleSharp } from "react-icons/io5";
import { MdEventNote } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { RiGalleryFill } from "react-icons/ri";
import { CgOrganisation } from "react-icons/cg";
import { API_BASE_URL } from '../utils/config';
import UdbhavLogo from '../assets/udbhav-logo.png';
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const navRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [user, setUser] = useState(() => {
        const savedJwt = localStorage.getItem('jwt');
        const savedName = localStorage.getItem('userName');
        const savedImage = localStorage.getItem('userImage');

        if (savedJwt && savedName && savedImage) {
            return { name: savedName, image: savedImage };
        }
        return null;
    });

    useEffect(() => {
        let ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Mobile Animation
            mm.add("(max-width: 768px)", () => {
                const showAnim = gsap.from(navRef.current, {
                    yPercent: -100,
                    paused: true,
                    duration: 0.2,
                }).progress(1);

                ScrollTrigger.create({
                    start: "top top",
                    end: 99999,
                    onUpdate: (self) => {
                        self.direction === -1 ? showAnim.play() : showAnim.reverse()
                    }
                });
            });

            // Desktop Entrance Animation
            mm.add("(min-width: 768px)", () => {
                // gsap.from(navRef.current, {
                //     x: -100,
                //     opacity: 0,
                //     duration: 1,
                //     ease: "power3.out",
                //     delay: 0.2
                // });

                gsap.from(navRef.current.children, {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    delay: 0.2
                });
            });
        }, navRef);

        return () => ctx.revert();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userName');
        localStorage.removeItem('userImage');
        setUser(null);
    };

    return (
        <nav ref={navRef} className="fixed z-50 transition-all duration-300 bg-[#7C6C58] bg-opacity-95 backdrop-blur-md text-[#0E0E0E] shadow-2xl
            md:fixed md:left-6 md:top-1/2 md:-translate-y-1/2 md:h-[85vh] md:w-30 md:flex-col md:rounded-2xl md:py-8
            hover:shadow-[0_0_25px_rgba(184,161,138,0.6)] md:hover:scale-[1.02] border border-white/10
            top-0 left-0 w-full h-20 flex flex-row items-center justify-between px-4 py-4">

            <div className="nav-item flex items-center gap-4 md:flex-col md:gap-1">
                {/* Logo */}
                <div className="flex justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
                    <img src={UdbhavLogo} alt="Udbhav Logo" className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="nav-item hidden md:flex flex-col gap-3 font-merriweather text-sm font-medium text-white w-full px-1 mt-4">
                <Link to="/" className="nav-item relative group flex md:flex-col items-center gap-3 md:gap-0.5 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-inner hover:-translate-y-1">
                    <span className="text-xl md:text-2xl mb-1 group-hover:text-[#0E0E0E] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"><IoMdHome /></span>
                    <span className="md:text-[8px] md:uppercase md:tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">Home</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#0E0E0E] rounded-r-md transition-all duration-300 group-hover:h-2/3 opacity-0 group-hover:opacity-100"></span>
                </Link>
                <Link to="/events" className="nav-item relative group flex md:flex-col items-center gap-3 md:gap-0.5 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-inner hover:-translate-y-1">
                    <span className="text-xl md:text-2xl mb-1 group-hover:text-[#0E0E0E] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"><MdEventNote /></span>
                    <span className="md:text-[8px] md:uppercase md:tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">Events</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#0E0E0E] rounded-r-md transition-all duration-300 group-hover:h-2/3 opacity-0 group-hover:opacity-100"></span>
                </Link>
                <a href="#" className="nav-item relative group flex md:flex-col items-center gap-3 md:gap-0.5 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-inner hover:-translate-y-1">
                    <span className="text-xl md:text-2xl mb-1 group-hover:text-[#0E0E0E] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"><IoPeopleSharp /></span>
                    <span className="md:text-[8px] md:uppercase md:tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">Teams</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#0E0E0E] rounded-r-md transition-all duration-300 group-hover:h-2/3 opacity-0 group-hover:opacity-100"></span>
                </a>
                <a href="#" className="nav-item relative group flex md:flex-col items-center gap-3 md:gap-0.5 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-inner hover:-translate-y-1">
                    <span className="text-xl md:text-2xl mb-1 group-hover:text-[#0E0E0E] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"><RiGalleryFill /></span>
                    <span className="md:text-[8px] md:uppercase md:tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">Gallery</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#0E0E0E] rounded-r-md transition-all duration-300 group-hover:h-2/3 opacity-0 group-hover:opacity-100"></span>
                </a>
                <a href="/sponsors" className="nav-item relative group flex md:flex-col items-center gap-3 md:gap-0.5 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-inner hover:-translate-y-1">
                    <span className="text-xl md:text-2xl mb-1 group-hover:text-[#0E0E0E] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"><CgOrganisation /></span>
                    <span className="md:text-[8px] md:uppercase md:tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">Sponsors</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#0E0E0E] rounded-r-md transition-all duration-300 group-hover:h-2/3 opacity-0 group-hover:opacity-100"></span>
                </a>
            </div>

            {/* Desktop Auth Section - Bottom */}
            <div className="hidden md:flex flex-col items-center gap-3 w-full px-1 mb-2">
                {user ? (
                    <div className="nav-item flex flex-col items-center gap-2 w-full p-2 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                        <img
                            src={user.image}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full border border-[#B8A18A] object-cover hover:scale-110 transition-transform"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/32' }}
                        />
                        <span className="text-[#B8A18A] font-merriweather text-[10px] text-center truncate w-full px-1">
                            {user.name.split(' ')[0]}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-[10px] font-merriweather text-white hover:text-[#0E0E0E] hover:bg-[#B8A18A] transition-all duration-300 uppercase tracking-widest w-full py-1 border border-white/20 rounded"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="nav-item flex flex-col gap-2 w-full">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full px-1 py-1.5 border border-[#B8A18A] text-white font-merriweather text-[10px] font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300 rounded hover:shadow-[0_0_15px_#B8A18A] hover:-translate-y-0.5"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button - Right Side */}
            <button
                className="md:hidden text-white z-50 relative"
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#0E0E0E] bg-opacity-95 z-40 flex flex-col items-center justify-center transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col gap-8 text-center">
                    <a href="#home" onClick={toggleMobileMenu} className="font-merriweather text-2xl text-white hover:text-[#B8A18A] transition-colors flex items-center justify-center gap-2">
                        <span className="text-2xl"><IoMdHome /></span> Home
                    </a>
                    <a href="#" onClick={toggleMobileMenu} className="font-merriweather text-2xl text-white hover:text-[#B8A18A] transition-colors flex items-center justify-center gap-2">
                        <span className="text-2xl"><MdEventNote /></span> Events
                    </a>
                    <a href="#" onClick={toggleMobileMenu} className="font-merriweather text-2xl text-white hover:text-[#B8A18A] transition-colors flex items-center justify-center gap-2">
                        <span className="text-2xl"><IoPeopleSharp /></span> Teams
                    </a>
                    <a href="#" onClick={toggleMobileMenu} className="font-merriweather text-2xl text-white hover:text-[#B8A18A] transition-colors flex items-center justify-center gap-2">
                        <span className="text-2xl"><RiGalleryFill /></span> Gallery
                    </a>
                    <a href="#" onClick={toggleMobileMenu} className="font-merriweather text-2xl text-white hover:text-[#B8A18A] transition-colors flex items-center justify-center gap-2">
                        <span className="text-2xl"><CgOrganisation /></span> Sponsors
                    </a>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        referrerPolicy="no-referrer"
                                        className="w-12 h-12 rounded-full border border-[#B8A18A] object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/32' }}
                                    />
                                    <span className="text-[#B8A18A] font-merriweather text-lg">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => { handleLogout(); toggleMobileMenu(); }}
                                    className="px-8 py-3 border border-[#B8A18A] text-[#B8A18A] font-merriweather text-lg font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { handleGoogleLogin(); toggleMobileMenu(); }}
                                className="px-8 py-3 border border-[#B8A18A] text-[#B8A18A] font-merriweather text-lg font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300"
                            >
                                Register
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;