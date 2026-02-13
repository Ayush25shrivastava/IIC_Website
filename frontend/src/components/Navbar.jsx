import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // HIGHLIGHT: Determine if we are on a dark sub-page (Events/Sponsors)
    const isDarkPage = location.pathname === '/events' || location.pathname === '/sponsors';

    const [user, setUser] = useState(() => {
        const savedJwt = localStorage.getItem('jwt');
        const savedName = localStorage.getItem('userName');
        const savedImage = localStorage.getItem('userImage');
        return (savedJwt && savedName && savedImage) ? { name: savedName, image: savedImage } : null;
    });

    useEffect(() => {
        const showAnim = gsap.from(navRef.current, {
            yPercent: -100,
            paused: true,
            duration: 0.3
        }).progress(1);

        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                self.direction === -1 ? showAnim.play() : showAnim.reverse();
            }
        });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = "/";
    };

    const NavLink = ({ to, icon, label }) => (
        <Link to={to} className="hover:text-[#0E0E0E] transition-colors relative group flex items-center gap-1">
            <span className="text-lg">{icon}</span>
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0E0E0E] transition-all group-hover:w-full"></span>
        </Link>
    );

    return (
        <nav 
            ref={navRef} 
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 
            ${isDarkPage ? 'bg-[#0E0E0E]/90 border-b border-[#7C6C58]' : 'bg-[#7C6C58]/90'} backdrop-blur-md text-white`}
        >
            {/* Logo */}
            <Link to="/" className="font-playfair font-bold text-2xl tracking-tighter text-white">
                UDBHAV <span className="text-[#B8A18A]">26</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-8 font-merriweather text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
                <NavLink to="/" icon={<IoMdHome />} label="Home" />
                <NavLink to="/events" icon={<MdEventNote />} label="Events" />
                <NavLink to="/sponsors" icon={<CgOrganisation />} label="Sponsors" />
                <NavLink to="/team" icon={<IoPeopleSharp />} label="Teams" />
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <img 
                            src={user.image} 
                            alt="User" 
                            className="w-9 h-9 rounded-full border-2 border-[#B8A18A] object-cover shadow-lg" 
                        />
                        <button onClick={handleLogout} className="text-xs uppercase tracking-widest hover:text-[#B8A18A]">Logout</button>
                    </div>
                ) : (
                    <button 
                        onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                        className="px-5 py-2 border-2 border-[#B8A18A] text-[#B8A18A] text-xs font-bold uppercase hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all"
                    >
                        Register Case
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-[#B8A18A]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-[#0E0E0E] z-[60] flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-top-10">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-8 text-4xl text-[#B8A18A]">×</button>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-playfair">Home</Link>
                    <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-playfair">Events</Link>
                    <Link to="/sponsors" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-playfair">Sponsors</Link>
                    {!user && (
                        <button onClick={() => window.location.href = `${API_BASE_URL}/auth/google`} className="bg-[#B8A18A] text-[#0E0E0E] px-8 py-3 font-bold">LOGIN</button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;