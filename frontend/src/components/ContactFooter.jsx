import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa'; // Using FaTwitter for X as it's common, or FaXTwitter if available in newer versions.
import { FaXTwitter } from "react-icons/fa6"; // Standard X icon
import UdbhavLogo from '../assets/udbhav-logo.png';

const ContactFooter = () => {
    const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Keep background unscrollable when modal is open
    React.useEffect(() => {
        if (isPartnersModalOpen || isContactModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isPartnersModalOpen, isContactModalOpen]);

    return (
        <section id="contact" className="bg-[#C5A25F] text-[#0E0E0E] relative overflow-hidden pt-16 pb-8 border-t border-[#0E0E0E]/10 md:pl-40 transition-all duration-300">

            {/* Background Texture (optional for detective feel) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col h-full justify-between min-h-[300px]">

                {/* Top Section: Logo & Nav Links */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">

                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <img src={UdbhavLogo} alt="Udbhav Logo" className="h-24 w-auto opacity-90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-6 md:gap-8 font-merriweather text-xs md:text-sm font-bold uppercase tracking-wide text-[#0E0E0E]/70">
                        <a href="/udbhav/#about" className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all">About Us</a>
                        <a href="#partners" onClick={(e) => { e.preventDefault(); setIsPartnersModalOpen(true); }} className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all cursor-pointer">Partner With Us</a>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); setIsContactModalOpen(true); }} className="hover:text-[#0E0E0E] hover:underline decoration-[#0E0E0E] transition-all cursor-pointer">Contact Us</a>
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
                        <a href="https://www.linkedin.com/company/iicmnnitallahabad/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-xl text-[#0E0E0E] hover:text-[#0077b5] transition-colors bg-[#0E0E0E]/5 p-2 rounded-full hover:bg-[#0E0E0E]/10 border border-[#0E0E0E]/10">
                            <FaLinkedin />
                        </a>
                        <a href="https://www.instagram.com/iic_mnnit/" target="_blank" rel="noopener noreferrer" className="text-xl text-[#0E0E0E] hover:text-[#E4405F] transition-colors bg-[#0E0E0E]/5 p-2 rounded-full hover:bg-[#0E0E0E]/10 border border-[#0E0E0E]/10">
                            <FaInstagram />
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

            {/* Partners Modal */}
            {isPartnersModalOpen && (
                <div data-lenis-prevent="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:pl-40 bg-[#0E0E0E]/80 backdrop-blur-md overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setIsPartnersModalOpen(false); }}>
                    <div className="relative w-full max-w-5xl bg-[#dcd9d2] border-[3px] border-[#C5A25F] rounded-lg shadow-[0_0_40px_rgba(197,162,95,0.4)] my-8 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-[#1a1a1a] p-6 border-b-[3px] border-[#C5A25F] flex justify-between items-center z-10 rounded-t-[5px]">
                            <h2 className="text-2xl md:text-3xl font-playfair font-black text-[#C5A25F] tracking-widest uppercase">Partner With Us</h2>
                            <button onClick={() => setIsPartnersModalOpen(false)} className="text-[#C5A25F] hover:text-white transition-colors text-4xl leading-none font-playfair">&times;</button>
                        </div>

                        {/* Modal Content */}
                        <div data-lenis-prevent="true" className="p-6 md:p-10 overflow-y-auto font-merriweather text-[#0E0E0E] custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply relative rounded-b-lg">


                            <div className="relative z-10 space-y-16">
                                {/* WHY PARTNER WITH US */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                        <h3 className="text-2xl md:text-3xl font-playfair font-black text-[#0E0E0E] uppercase tracking-widest text-center">Why Partner With Us</h3>
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Card */}
                                        <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block">Legacy of Innovation</h4>
                                            <p className="text-[#8c7343] italic text-sm mt-3 mb-4 font-bold">"The future belongs to those who shape it."</p>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">UDBHAV 3.0 is a refined convergence of vision, intellect, and innovation. Partnering with us places your brand at the heart of a thoughtfully curated platform where exceptional minds (students, researchers, and industry leaders) come together to design solutions that matter. Your association reflects leadership, foresight, and a commitment to shaping what lies ahead.</p>
                                        </div>
                                        {/* Card */}
                                        <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block">Distinctive Brand Presence</h4>
                                            <p className="text-[#8c7343] italic text-sm mt-3 mb-4 font-bold">"Visibility with purpose and prestige."</p>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">UDBHAV 3.0 offers carefully positioned brand exposure to a discerning and influential audience. From premium on-ground placements to curated digital visibility, your brand is presented with elegance and intent, ensuring recognition that feels organic, respected, and enduring rather than promotional.</p>
                                        </div>
                                        {/* Card */}
                                        <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block">Purpose Beyond Partnership</h4>
                                            <p className="text-[#8c7343] italic text-sm mt-3 mb-4 font-bold">"An investment in progress."</p>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">Supporting UDBHAV 3.0 is a declaration of values. It signifies belief in education, inclusive growth, and innovation as forces of lasting change. Your sponsorship aligns your organization with initiatives that elevate society while reinforcing your identity as a brand driven by purpose and responsibility.</p>
                                        </div>
                                        {/* Card */}
                                        <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block">Curated Connections</h4>
                                            <p className="text-[#8c7343] italic text-sm mt-3 mb-4 font-bold">"Where relationships are built, not exchanged."</p>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">UDBHAV 3.0 creates an environment for meaningful interaction with thought leaders, decision-makers, innovators, and future leaders. Sponsorship grants access to a carefully curated network, enabling collaborations and partnerships that extend well beyond the event.</p>
                                        </div>
                                        {/* Card */}
                                        <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md md:col-span-2 transform hover:-translate-y-1 transition-transform">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block">Enduring Impact</h4>
                                            <p className="text-[#8c7343] italic text-sm mt-3 mb-4 font-bold">"Presence that resonates. Influence that lasts."</p>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">Your partnership with UDBHAV 3.0 enhances brand stature, deepens engagement, and strengthens long-term positioning. It is not merely visibility—it is alignment with a forward-thinking ecosystem that values excellence, innovation, and sustained growth.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* SPONSORSHIP BENEFITS TABLE */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                        <h3 className="text-2xl md:text-3xl font-playfair font-black text-[#0E0E0E] uppercase tracking-widest text-center">Sponsorship Benefits</h3>
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                    </div>
                                    <div className="overflow-x-auto rounded border border-[#0E0E0E] shadow-xl bg-white/40">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-[#1a1a1a] text-white">
                                                    <th className="p-4 md:p-5 border-b-2 border-[#C5A25F] font-playfair text-lg md:text-xl font-black tracking-wide w-1/4">Benefits</th>
                                                    <th className="p-4 md:p-5 border-b-2 border-[#C5A25F] border-l border-[#0E0E0E]/50 font-playfair text-lg md:text-xl font-black tracking-wide w-3/8 text-[#C5A25F]">Title Sponsor</th>
                                                    <th className="p-4 md:p-5 border-b-2 border-[#C5A25F] border-l border-[#0E0E0E]/50 font-playfair text-lg md:text-xl font-black tracking-wide w-3/8 text-[#C5A25F]">Associate Sponsor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#0E0E0E] font-medium divide-y divide-[#0E0E0E]/20">
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Logo Visibility</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Prime logo placement on banners at entry gates, MP Hall, main entrances, and CAD Lab walls <strong>(8 banners)</strong></td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Logo placement on banners at gates, MP Hall entrance, and CAD Lab walls <strong>(5 banners)</strong></td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Website Presence</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Featured branding with priority placement on the official event website</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Sponsor listing on the official website below Title Sponsor</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Stage Acknowledgment</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Announcement as Title Sponsor and invitation as Chief Guest for prize distribution in MP Hall (Audience ~5000)</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Sponsor acknowledgment as Associate Sponsor during MP Hall sessions (Audience ~5000)</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Media Exposure</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Extensive coverage with dedicated posts on Instagram, Facebook, LinkedIn, website, and press mentions</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">One dedicated Instagram post; remaining mentions shared with other sponsors</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Social Media Promotion</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Highlighted as Main Sponsor across all social campaigns</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Mentioned as Associate Partner on social media</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">On-Ground Visibility</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Premium stall space at a prime location near MP Hall</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Standard stall space within the event area</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Entry Gate Branding</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Exclusive banner branding at the main event entry gate</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Standard-sized banner at entry (smaller than Title Sponsor)</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Custom Banner Placement</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">2m x 1m banners at premium campus locations including MP Hall and CAD Lab</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Permission to display posters and standard banners</td>
                                                </tr>
                                                <tr className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 md:p-5 font-black font-playfair text-lg text-[#0E0E0E] border-r border-[#0E0E0E]/20 bg-[#C5A25F]/10">Presentations & Ads</td>
                                                    <td className="p-4 md:p-5 border-r border-[#0E0E0E]/20 leading-relaxed">Exclusive company advertisement inside MP Hall before key sessions</td>
                                                    <td className="p-4 md:p-5 leading-relaxed">Optional advertisement opportunity subject to availability</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* DELIVERABLES */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                        <h3 className="text-2xl md:text-3xl font-playfair font-black text-[#0E0E0E] uppercase tracking-widest text-center">Deliverables</h3>
                                        <div className="h-0.5 flex-1 bg-[#C5A25F]"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start gap-1">
                                                Digital Real Estate
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1">"The Virtual Takeover"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0">Secure a permanent digital footprint with premium logo placement on our official homepage and a direct gateway to your social media handles. We amplify this with a "digital spotlight" across LinkedIn, Instagram, and Facebook, using sponsor shoutouts, creative stories, and event countdowns to make your brand the focus of online conversations.</p>
                                        </div>

                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start gap-1">
                                                Visual Saturation
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1">"Everywhere You Look"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0">Achieve total brand immersion. We deploy eye-catching banners and posters in high-traffic zones from main entrances to keynote stages ensuring seamless integration with the event's aesthetic. We elevate this presence with interactive QR codes and dynamic displays, captivating attendees at every physical touchpoint.</p>
                                        </div>

                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start gap-1">
                                                Ground Zero
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1">"The Experience Hub"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0">Move beyond "visibility" to "interaction." You will command a dedicated marketing stall at a prime venue, creating a direct channel to showcase products and services to a diverse crowd. To ensure a flawless execution, a dedicated team of volunteers will act as your personal concierge, assisting with all on-site requirements.</p>
                                        </div>

                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start gap-1">
                                                Print Authority
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1">"Inked Impact"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0">Gain credibility that lasts. We feature your brand in pre-event newspaper advertisements and press releases, boosting your reputation through trusted print media channels. Your influence extends beyond the weekend with mentions in post-event recap blogs, keeping your brand memorable for a wider offline readership.</p>
                                        </div>

                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start gap-1">
                                                Extended Reach
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1">"Beyond the Campus Gates"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0">Your impact isn't limited to just our institute. UDBHAV 3.0 attracts a vibrant mix of participants, including students from colleges across the region, giving you access to a broader, inter-collegiate talent pool. This creates a unique opportunity to connect with future leaders and innovators from diverse academic backgrounds.</p>
                                        </div>

                                        <div className="bg-white/50 p-6 border-l-4 border-[#C5A25F] shadow-md hover:bg-white/80 transition-colors md:col-span-2">
                                            <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide flex flex-col items-start justify-center text-center mx-auto gap-1">
                                                Center Stage
                                                <span className="text-[#8c7343] font-normal italic text-sm border-t border-[#C5A25F] pt-1 mt-1 mx-auto">"The Voice of the Event"</span>
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mt-3 mb-0 text-center">Be the name everyone hears. Your brand will be amplified through Emcee announcements throughout the fest, ensuring you remain top-of-mind for the audience. Title Sponsors receive the ultimate honor: an exclusive invitation to serve as the Chief Guest for the prize distribution ceremony.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div data-lenis-prevent="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:pl-40 bg-[#0E0E0E]/80 backdrop-blur-md overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setIsContactModalOpen(false); }}>
                    <div className="relative w-full max-w-xl bg-[#dcd9d2] border-[3px] border-[#C5A25F] rounded-lg shadow-[0_0_40px_rgba(197,162,95,0.4)] my-8 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-[#1a1a1a] p-6 border-b-[3px] border-[#C5A25F] flex justify-between items-center z-10 rounded-t-[5px]">
                            <h2 className="text-2xl md:text-3xl font-playfair font-black text-[#C5A25F] tracking-widest uppercase">Contact Us</h2>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-[#C5A25F] hover:text-white transition-colors text-4xl leading-none font-playfair">&times;</button>
                        </div>

                        {/* Modal Content */}
                        <div data-lenis-prevent="true" className="p-6 md:p-10 overflow-y-auto font-merriweather text-[#0E0E0E] custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply relative rounded-b-lg">
                            <div className="relative z-10 space-y-8">
                                <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform text-center md:text-left">
                                    <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block uppercase">Address</h4>
                                    <p className="text-base leading-relaxed text-[#0E0E0E]/90 mb-0 mt-3 font-bold">Institution's Innovation Council</p>
                                    <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0 mt-1">Motilal Nehru National Institute of Technology</p>
                                    <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0">Allahabad, Prayagraj - 211004, INDIA</p>
                                </div>
                                <div className="bg-white/50 p-6 border border-[#0E0E0E]/20 shadow-md transform hover:-translate-y-1 transition-transform text-center md:text-left">
                                    <h4 className="text-xl font-black text-[#0E0E0E] mb-2 font-playfair tracking-wide border-b border-[#C5A25F] pb-2 inline-block uppercase">Email</h4>
                                    <p className="text-sm leading-relaxed text-[#0E0E0E]/80 mb-0 mt-3">
                                        <a href="mailto:iic@mnnit.ac.in" className="text-[#0E0E0E] hover:text-[#C5A25F] font-bold text-lg transition-colors underline decoration-[#C5A25F] decoration-2 underline-offset-4">iic@mnnit.ac.in</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ContactFooter;
