import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiUser, FiZap } from 'react-icons/fi';
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
  const [userName, setUserName] = useState(''); // To display user identity for individual reg

  const getHeaders = () => {
    const token = localStorage.getItem('jwt');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch Teams and User Info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Teams
        const teamResponse = await fetch(`${API_BASE_URL}/teams/my-teams`, { 
          method: 'GET',
          headers: getHeaders() 
        });
        const teamData = await teamResponse.json();
        if (teamData.success) setMyTeams(teamData.data);

        // Fetch User Profile (to get the name for individual registration)
        const userResponse = await fetch(`${API_BASE_URL}/users/profile`, { // Changed from /auth/me to match your user routes
          method: 'GET',
          headers: getHeaders()
        });
        const userData = await userResponse.json();
        if (userData.success) setUserName(userData.data.name);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    if (localStorage.getItem('jwt')) {
      fetchData();
    }
  }, [eventId]);

  // --- REGISTRATION LOGIC ---

  const handleIndividualRegister = async () => {
    if (!window.confirm(`Register for this event individually as "${userName}"?`)) return;

    try {
      // UPDATED: Pointing to the standard /register route without passing a teamId
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({}) // Empty body since no teamId is needed
      });
      const data = await response.json();

      if (data.success) {
        alert("Successfully registered individually!");
        navigate('/udbhav/dashboard'); 
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Individual registration error:", error);
      alert("An error occurred during registration.");
    }
  };

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
        alert(data.message || "Invalid Code!");
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
        alert("Your team is successfully registered!");
        navigate('/udbhav/dashboard');
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
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">Event Registration</h1>
            <p className="text-[#7C6C58] font-mono text-xs tracking-widest uppercase italic">Event ID: {eventId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Individual Registration Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] border border-[#B8A18A]/20 rounded-2xl p-6 flex flex-col justify-between hover:border-[#B8A18A]/50 transition-all shadow-lg group">
              <div>
                <div className="flex justify-between items-start mb-4">
                   <h2 className="font-playfair text-xl font-bold text-white tracking-wide">Solo Entry</h2>
                   <FiUser className="text-[#7C6C58] group-hover:text-[#B8A18A] transition-colors" size={20}/>
                </div>
                <p className="text-[#7C6C58] text-xs italic mb-6 leading-relaxed">Register directly for individual participation.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-[#0E0E0E] p-3 rounded-lg border border-[#7C6C58]/20">
                    <p className="text-[10px] uppercase font-mono text-[#7C6C58] mb-1">Identity Confirmed</p>
                    <p className="text-white font-bold text-sm truncate">{userName || "Authenticating..."}</p>
                </div>
                <button onClick={handleIndividualRegister} className="w-full py-3 bg-[#B8A18A]/10 border border-[#B8A18A]/30 text-[#B8A18A] font-bold uppercase rounded-lg text-[10px] tracking-[0.2em] hover:bg-[#B8A18A] hover:text-[#0E0E0E] transition-all">
                  Register Solo
                </button>
              </div>
            </motion.div>

            {/* 2. Create Team Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#1A1A1A]/80 border border-[#7C6C58]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#B8A18A]/50 transition-colors shadow-lg group">
              <div>
                <h2 className="font-playfair text-xl font-bold text-white mb-2 tracking-wide">Create Team</h2>
                <p className="text-[#7C6C58] text-xs italic mb-8 leading-relaxed">Start a new group and invite others to join.</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-dashed border-[#7C6C58] flex items-center justify-center text-[#B8A18A] opacity-50 group-hover:opacity-100 group-hover:border-[#B8A18A] transition-all duration-500">
                  <FiPlus size={24} />
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="w-full py-3 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-[10px] tracking-[0.2em] hover:bg-[#B8A18A] transition-colors">
                  Create New
                </button>
              </div>
            </motion.div>

            {/* 3. Join Team Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1A1A1A]/80 border border-[#7C6C58]/30 rounded-2xl p-6 flex flex-col hover:border-[#B8A18A]/50 transition-colors shadow-lg">
              <div>
                <h2 className="font-playfair text-xl font-bold text-white mb-2 tracking-wide">Join Team</h2>
                <p className="text-[#7C6C58] text-xs italic mb-6 leading-relaxed">Enter an existing team's unique access code.</p>
              </div>
              <div className="mt-auto space-y-3">
                <input type="text" placeholder="Code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] font-mono text-sm" />
                <button onClick={handleJoinTeam} className="w-full py-3 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-[10px] tracking-[0.2em] hover:bg-[#B8A18A] transition-colors whitespace-nowrap">
                  Join Team
                </button>
              </div>
            </motion.div>
          </div>

          {/* My Teams Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-8">
            <div className="flex items-center gap-3 mb-6">
                <FiZap className="text-[#B8A18A]" />
                <h3 className="font-playfair text-2xl font-bold text-white tracking-wide">Affiliated Teams</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTeams.filter(t => t.event?._id === eventId || t.event === eventId).map((team) => (
                <div key={team._id} className="p-5 bg-transparent border border-[#7C6C58]/30 rounded-xl flex items-center justify-between hover:bg-[#1A1A1A]/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-[#7C6C58]/50 flex items-center justify-center text-[10px] text-[#7C6C58] group-hover:border-[#B8A18A] transition-colors">
                        {team.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      <p className="text-[10px] text-[#7C6C58] font-mono uppercase tracking-tighter">
                        {team.members.length + 1} Members • {team.status}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleRegisterEvent(team._id)} className="px-4 py-2 border border-[#7C6C58]/40 rounded text-[10px] text-white hover:bg-[#B8A18A] hover:text-[#0E0E0E] hover:border-[#B8A18A] transition-colors uppercase font-black tracking-widest">
                    Submit
                  </button>
                </div>
              ))}
              {myTeams.length === 0 && <p className="text-xs italic text-[#7C6C58]">No team associations found for this event profile.</p>}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Internal Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
      `}</style>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1E1E1E] border border-[#B8A18A]/50 rounded-2xl w-full max-w-md p-8 relative">
            <button onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); }} className="absolute top-4 right-4 text-[#7C6C58] hover:text-white">✕</button>
            <h2 className="font-playfair text-2xl font-bold text-white uppercase tracking-tight mb-6">Create Team</h2>
            
            {!generatedCode ? (
              <form onSubmit={handleCreateTeam} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase text-[#7C6C58] font-black font-mono tracking-[0.3em] mb-2">Team Alias</label>
                  <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-[10px] tracking-[0.4em] rounded-xl transition-all">
                  Initialize & Generate Code
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#7C6C58] text-[10px] uppercase tracking-widest mb-4">Access Credentials</p>
                <div className="bg-[#0E0E0E] border border-[#B8A18A] p-6 rounded-xl inline-block mb-6">
                  <p className="font-mono text-4xl text-white font-bold tracking-[0.2em]">{generatedCode}</p>
                </div>
                <p className="text-[10px] text-[#7C6C58] italic mb-6">Distribute this code to authorized collaborators only.</p>
                <button onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); }} className="w-full py-3 bg-transparent border border-[#7C6C58] text-[#B8A18A] font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all">
                  Done
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