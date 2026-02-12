import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IoPeopleSharp } from "react-icons/io5";
import { MdEventNote } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { RiGalleryFill } from "react-icons/ri";
import { CgOrganisation } from "react-icons/cg";
import { API_BASE_URL } from '../utils/config';
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
        const showAnim = gsap.from(navRef.current, {
            yPercent: -100,
            paused: true,
            duration: 0.2
        }).progress(1);

        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                self.direction === -1 ? showAnim.play() : showAnim.reverse()
            }
        });
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
        <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-[#7C6C58] bg-opacity-90 backdrop-blur-sm text-[#0E0E0E] transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Logo Placeholder - Replace with actual image */}
                <div className="font-playfair font-bold text-2xl tracking-wider text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-orange-400">
                        UDBHAV
                    </span>
                </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-8 font-merriweather text-sm font-medium text-white absolute left-1/2 transform -translate-x-1/2">
                <a href="#home" className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
                    <span className="text-lg"><IoMdHome /></span>
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
                    <span className="text-lg"><MdEventNote /></span>
                    Events
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
                    <span className="text-lg"><IoPeopleSharp /></span>
                    Teams
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
                    <span className="text-lg"><RiGalleryFill /></span>
                    Gallery
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
                    <span className="text-lg"><CgOrganisation /></span>
                    Sponsors
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
                </a>
            </div>

            {/* Right Side: Register & Profile */}
            <div className="hidden md:flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img
                                src={user.image}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full border border-[#B8A18A] object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/32' }}
                            />
                            <span className="text-[#B8A18A] font-merriweather text-sm hidden lg:block">
                                {user.name.split(' ')[0]}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-merriweather text-white hover:text-[#B8A18A] transition-colors uppercase"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleGoogleLogin}
                            className="px-6 py-2 border border-[#B8A18A] text-[#B8A18A] font-merriweather text-sm font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all duration-300"
                        >
                            Register
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="text-white hover:text-[#B8A18A] transition-colors"
                            aria-label="Profile"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
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
