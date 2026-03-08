import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFolder, FiSettings, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../utils/config';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Dialog & Form States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  
  // Real Data States
  const [myTeams, setMyTeams] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);

  // Helper function to always grab the freshest token right before a request
  const getHeaders = () => {
    const token = localStorage.getItem('jwt'); // Make sure 'token' matches your exact localStorage key
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch Existing Teams
  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/teams/my-teams`, { 
          method: 'GET',
          headers: getHeaders() 
        });
        const data = await response.json();
        if (data.success) {
          setMyTeams(data.data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    
    // Check if token exists before trying to fetch
    if (localStorage.getItem('jwt')) {
      fetchMyTeams();
    }
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (teamName) {
      try {
        const response = await fetch(`${API_BASE_URL}/teams/create`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ eventId, teamName })
        });
        const data = await response.json();
        
        if (data.success) {
          setGeneratedCode(data.teamCode);
          setMyTeams([data.data, ...myTeams]);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) return alert("Please enter a valid Team Code.");

    try {
      const response = await fetch(`${API_BASE_URL}/teams/join`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ teamCode: joinCode })
      });
      const data = await response.json();

      if (data.success) {
        alert("Successfully joined team!");
        setMyTeams([data.data, ...myTeams]);
        setJoinCode('');
      } else {
        alert(data.message || "Invalid Code! Could not join the team.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  const handleRegisterEvent = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ teamId })
      });
      const data = await response.json();

      if (data.success) {
        alert("Your team is successfully registered for the event!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error registering event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] font-merriweather selection:bg-[#B8A18A] selection:text-white flex overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar relative p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-10 mt-10 md:mt-4">
          <div className="mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">Team Register</h1>
            <p className="text-[#7C6C58] font-mono text-xs tracking-widest uppercase">Event Id // {eventId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Team Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-8 flex flex-col justify-between hover:border-[#B8A18A]/50 transition-colors shadow-lg group relative">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-2 tracking-wide">Create Team</h2>
                <p className="text-[#7C6C58] text-sm italic mb-8">Start a new collaboration group.</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#7C6C58] flex items-center justify-center text-[#B8A18A] opacity-50 group-hover:opacity-100 group-hover:border-[#B8A18A] transition-all duration-500">
                  <FiPlus size={32} />
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="w-full py-3 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-sm tracking-widest hover:bg-[#B8A18A] transition-colors">
                  Create New Team
                </button>
              </div>
            </motion.div>

            {/* Join Team Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-8 flex flex-col hover:border-[#B8A18A]/50 transition-colors shadow-lg">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-2 tracking-wide">Join Team</h2>
                <p className="text-[#7C6C58] text-sm italic mb-8">Ask your team lead for the code.</p>
              </div>
              <div className="mt-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" placeholder="Enter Team Code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="flex-1 bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] font-mono text-sm" />
                  <button onClick={handleJoinTeam} className="py-3 px-8 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-sm tracking-widest hover:bg-[#B8A18A] transition-colors whitespace-nowrap">
                    Join
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* My Teams Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-8">
            <h3 className="font-playfair text-2xl font-bold text-white tracking-wide mb-6">My Teams for this Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTeams.filter(t => t.event?._id === eventId || t.event === eventId).map((team) => (
                <div key={team._id} className="p-5 bg-transparent border border-[#7C6C58]/30 rounded-xl flex items-center justify-between hover:bg-[#1A1A1A]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#7C6C58]/50 flex items-center justify-center -rotate-45 text-[#7C6C58]"></div>
                    <div>
                      <h4 className="font-bold text-white">{team.name}</h4>
                      <p className="text-xs text-[#7C6C58]">{team.members.length + 1} Members • {team.status}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRegisterEvent(team._id)} className="px-4 py-2 border border-[#7C6C58]/40 rounded text-xs text-white hover:bg-[#B8A18A] hover:text-[#0E0E0E] hover:border-[#B8A18A] transition-colors uppercase font-bold tracking-wider">
                    Register For Event
                  </button>
                </div>
              ))}
              {myTeams.length === 0 && <p className="text-sm italic opacity-60">You have not joined any teams yet.</p>}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Internal Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
      `}</style>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1E1E1E] border border-[#B8A18A]/50 rounded-2xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(184,161,138,0.15)]">
            <button onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); }} className="absolute top-4 right-4 text-[#7C6C58] hover:text-white pb-1">✕</button>
            <h2 className="font-playfair text-3xl font-bold text-white uppercase tracking-tight mb-6 mt-2">Initialize Team</h2>
            
            {!generatedCode ? (
              <form onSubmit={handleCreateTeam} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Team Name</label>
                  <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-xs tracking-[0.4em] rounded-xl hover:shadow-[0_0_20px_rgba(184,161,138,0.3)] transition-all">
                    Generate Team Code
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-[#7C6C58] text-sm mb-4">Your Team Access Code</p>
                <div className="bg-[#0E0E0E] border border-[#B8A18A] p-6 rounded-xl inline-block mb-6 shadow-[0_0_15px_rgba(184,161,138,0.2)]">
                  <p className="font-mono text-4xl text-white font-bold tracking-[0.2em]">{generatedCode}</p>
                </div>
                <p className="text-xs text-[#7C6C58] italic mb-6">Share this code with your members to let them join.</p>
                <button onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); }} className="w-full py-3 bg-transparent border border-[#7C6C58] text-[#B8A18A] font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#7C6C58]/20 transition-all">
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Registration;