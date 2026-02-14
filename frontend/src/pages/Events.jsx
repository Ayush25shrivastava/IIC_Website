import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const eventData = [
    { 
        id: 1, 
        title: "The Algorithm Heist", 
        type: "Competitive Programming", 
        size: "Solo/Duo", 
        mode: "Online", 
        
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000", 
        description: "A high-stakes data breach has occurred. Use your C++ skills to decrypt the firewall and recover the lost packets before the timer hits zero." 
    },
    { 
        id: 2, 
        title: "The UI Noir", 
        type: "Web Design", 
        size: "1-3 Members", 
        mode: "Offline", 
        
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000", 
        description: "Craft a digital interface that breathes the atmosphere of a 1940s detective novel. Only the best UX will solve this mystery." 
    }
];

const Events = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const isLoggedIn = !!localStorage.getItem('jwt');

    const handleAction = (eventId) => {
        if (!isLoggedIn) {
            
            window.location.href = `http://localhost:5000/auth/google`;
        } else {
            
            window.location.href = `/register/${eventId}`;
        }
    };

    return (
        <div className="pt-32 pb-20 px-8 min-h-screen bg-[#0E0E0E] text-[#dcd9d2]">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <h1 className="font-playfair text-6xl text-[#B8A18A] uppercase tracking-tighter">Active Case Files</h1>
                    <div className="w-24 h-1 bg-[#B8A18A] mx-auto mt-4"></div>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventData.map(event => (
                        <div key={event.id} className="group relative bg-[#161616] border border-[#7C6C58] overflow-hidden hover:border-[#B8A18A] transition-all duration-500 shadow-2xl">
                            {/* EVENT IMAGE */}
                            <div className="h-56 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            
                            <div className="p-6">
                                <h3 className="font-playfair text-2xl text-[#B8A18A] mb-2">{event.title}</h3>
                                <div className="flex justify-between text-xs font-mono uppercase text-gray-500 mb-6">
                                    <span>Type: {event.type}</span>
                                    <span>Mode: {event.mode}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedEvent(event)}
                                    className="w-full py-3 border border-[#B8A18A] text-[#B8A18A] hover:bg-[#B8A18A] hover:text-[#0E0E0E] font-bold uppercase transition-all"
                                >
                                    Open File
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ENLARGED DOSSIER MODAL */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm transition-all">
                    <div className="bg-[#dcd9d2] text-[#0E0E0E] max-w-5xl w-full p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border-8 border-double border-[#7C6C58]">
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-6 text-4xl hover:text-red-800">×</button>
                        
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="md:w-2/5">
                                {/* DOSSIER IMAGE */}
                                <img src={selectedEvent.image} className="w-full border-4 border-[#0E0E0E] sepia contrast-125 shadow-xl rotate-[-1deg]" />
                                <div className="mt-8 space-y-2 font-mono text-sm border-t-2 border-[#7C6C58] pt-4">
                                    <p><strong>SUBJECT:</strong> {selectedEvent.title}</p>
                                    <p><strong>TEAM SIZE:</strong> {selectedEvent.size}</p>
                                    <p><strong>LOCATION:</strong> {selectedEvent.mode}</p>
                                    <p><strong>STATUS:</strong> OPEN</p>
                                </div>
                            </div>
                            <div className="md:w-3/5 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-playfair text-5xl font-black mb-6 uppercase underline decoration-4 underline-offset-8">Confidential</h2>
                                    <p className="font-merriweather text-xl leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleAction(selectedEvent.id)}
                                    className="mt-12 py-5 bg-[#0E0E0E] text-[#B8A18A] text-xl font-bold uppercase hover:bg-[#7C6C58] transition-all shadow-lg"
                                >
                                    Accept Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;