import React from 'react';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa'; // Using FaTwitter for X as it's common, or FaXTwitter if available in newer versions.
import { FaXTwitter } from "react-icons/fa6"; // Standard X icon
import UdbhavLogo from '../assets/udbhav-logo.png';

const ContactFooter = () => {
    return (
        <section id="contact" className="bg-[#C5A25F] text-[#0E0E0E] relative overflow-hidden pt-16 pb-8 border-t border-[#0E0E0E]/10 md:pl-40 transition-all duration-300">

            {/* Background Texture (optional for detective feel) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col h-full justify-between min-h-[400px]">

                {/* Top Section: Logo & Nav Links */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">

                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <img src={UdbhavLogo} alt="Udbhav Logo" className="h-12 w-auto opacity-90 drop-shadow-sm" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-6 md:gap-8 font-merriweather text-xs md:text-sm font-bold uppercase tracking-wide text-[#0E0E0E]/70">
                        <a href="#about" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">About Us</a>
                        <a href="#partners" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">Partner With Us</a>
                        <a href="#contact" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">Contact Us</a>
                        <a href="/privacy" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">Privacy Policy</a>
                        <a href="/refund" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">Refund Policy</a>
                        <a href="/terms" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">Terms & Conditions</a>
                    </nav>
                </div>

                {/* Middle/Bottom: Copyright & Socials */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 border-t border-[#0E0E0E]/10 pt-8 mt-auto">

                    {/* Copyright */}
                    <div className="text-xs font-mono text-[#0E0E0E]/60 font-semibold">
                        © 2026 Udbhav. All Rights Reserved.
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-6">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xl text-[#0E0E0E] hover:text-[#0077b5] transition-colors bg-[#0E0E0E]/5 p-2 rounded-full hover:bg-[#0E0E0E]/10 border border-[#0E0E0E]/10">
                            <FaLinkedin />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xl text-[#0E0E0E] hover:text-[#E4405F] transition-colors bg-[#0E0E0E]/5 p-2 rounded-full hover:bg-[#0E0E0E]/10 border border-[#0E0E0E]/10">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xl text-[#0E0E0E] hover:text-black transition-colors bg-[#0E0E0E]/5 p-2 rounded-full hover:bg-[#0E0E0E]/10 border border-[#0E0E0E]/10">
                            <FaXTwitter />
                        </a>
                    </div>
                </div>

                {/* Large Background Text - "UDBHAV" */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 translate-y-[35%] w-full text-center md:text-right pointer-events-none z-0">
                    <h1 className="text-[15vw] md:text-[18vw] font-black text-[#0E0E0E] opacity-[0.05] leading-none tracking-tighter select-none font-playfair uppercase">
                        UDBHAV
                    </h1>
                </div>

            </div>
        </section>
    );
};

export default ContactFooter;
