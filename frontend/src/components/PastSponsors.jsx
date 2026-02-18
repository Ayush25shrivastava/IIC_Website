import React from 'react';

// Import images from assets/past sponsors
const images = import.meta.glob('../assets/past sponsors/*', { eager: true, query: '?url', import: 'default' });
const sponsorLogos = Object.values(images);

const PastSponsors = () => {
    return (
        <section className="bg-[#f5f1e6] py-8 border-t border-[#7C6C58] overflow-hidden relative">
            {/* Background Texture for Detective Theme */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            {/* Heading */}
            <div className="text-center mb-6 relative z-10">
                <h3 className="font-playfair text-2xl md:text-3xl text-[#0E0E0E] uppercase tracking-widest drop-shadow-sm">
                    Our Past Sponsors
                </h3>
                <div className="h-0.5 w-24 bg-[#7C6C58] mx-auto mt-2"></div>
            </div>

            {/* Scrolling Banner */}
            <div className="relative w-full overflow-hidden bg-[#dcd9d2]/30 py-4 border-y border-[#b8a18a]/30 backdrop-blur-sm">

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f5f1e6] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f5f1e6] to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-scroll hover:pause">
                    {/* First set of logos */}
                    {sponsorLogos.map((src, idx) => (
                        <div key={`sponsor-1-${idx}`} className="mx-8 w-32 h-16 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                            <img src={src} alt={`Sponsor ${idx}`} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                        </div>
                    ))}
                    {/* Second set for infinite loop (MUST match first set structure exactly) */}
                    {sponsorLogos.map((src, idx) => (
                        <div key={`sponsor-2-${idx}`} className="mx-8 w-32 h-16 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                            <img src={src} alt={`Sponsor ${idx}`} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PastSponsors;
