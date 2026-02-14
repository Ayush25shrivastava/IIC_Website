import React from 'react';

const sponsorData = {
    detective: [ // Title Sponsors
        { name: "Apex Solutions", logo: "https://via.placeholder.com/300x150/0E0E0E/B8A18A?text=APEX+SOLUTIONS" }
    ],
    informants: [ // Tech Partners
        { name: "Cyber Intel", logo: "https://via.placeholder.com/200x100/0E0E0E/B8A18A?text=CYBER+INTEL" },
        { name: "Code Vault", logo: "https://via.placeholder.com/200x100/0E0E0E/B8A18A?text=CODE+VAULT" }
    ],
    refreshments: [ // Beverage Partners
        { name: "Black Coffee Co.", logo: "https://via.placeholder.com/150x80/0E0E0E/B8A18A?text=BLACK+COFFEE" }
    ]
};

const SponsorSection = ({ title, list, sizeClass }) => (
    <div className="mb-24 text-center">
        <h2 className="font-playfair text-3xl text-[#B8A18A] mb-12 uppercase italic tracking-widest">{title}</h2>
        <div className="flex flex-wrap justify-center gap-10">
            {list.map((sponsor, idx) => (
                <div key={idx} className={`bg-[#dcd9d2] p-4 border-2 border-[#7C6C58] shadow-lg transform transition-transform hover:-rotate-3 hover:scale-105 ${sizeClass}`}>
                    <div className="w-full h-full border border-dashed border-[#7C6C58] flex items-center justify-center p-2">
                        {/* SPONSOR LOGO */}
                        <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full grayscale contrast-125" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Sponsors = () => {
    return (
        <div className="pt-32 pb-20 px-8 min-h-screen bg-[#0E0E0E] relative overflow-hidden">
            {/* NOIR DECORATION: A subtle vignette effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-0"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="text-center mb-20">
                    <h1 className="font-playfair text-6xl text-white mb-4">The Syndicate</h1>
                    <p className="text-[#B8A18A] italic font-merriweather">Those who fund the investigation</p>
                </header>

                <SponsorSection title="Chief Detectives" list={sponsorData.detective} sizeClass="w-80 h-44" />
                <SponsorSection title="The Informants" list={sponsorData.informants} sizeClass="w-64 h-32" />
                <SponsorSection title="The Mess Hall" list={sponsorData.refreshments} sizeClass="w-52 h-28" />
            </div>
        </div>
    );
};

export default Sponsors;