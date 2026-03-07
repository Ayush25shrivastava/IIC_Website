import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFolder, FiSettings, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Dialog States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Mock Data (since we focus on UI, we will just use mock state for now until user integrates real API)
  const [myTeams, setMyTeams] = useState([
    { id: 1, name: 'Alpha Project', members: '5 Members', status: 'Active' },
    { id: 2, name: 'Beta Squad', members: '5 Members', status: 'Active' },
    { id: 3, name: 'Gamma Group', members: '5 Members', status: 'Active' },
    { id: 4, name: 'Delta Force', members: '5 Members', status: 'Active' },
  ]);

  const [generatedCode, setGeneratedCode] = useState(null);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (teamName && teamSize) {
      // Simulate API call to backend that generates a code
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(newCode);
      
      const newTeam = {
        id: Date.now(),
        name: teamName,
        members: `1/${teamSize} Members`,
        status: 'Active'
      };
      setMyTeams([newTeam, ...myTeams]);
    }
  };

  const handleJoinTeam = () => {
    if (!joinCode.trim()) {
      alert("Please enter a valid Team Code.");
      return;
    }

    // Simulate joining with mock code (in real scenario this is an API call parsing success message)
    if (joinCode.length > 3) { // Mock condition for a "valid" code
      alert(`Successfully joined team with code: ${joinCode}`);
      
      const newJoinedTeam = {
        id: Date.now(),
        name: `Joined Team (${joinCode})`,
        members: `New Member`,
        status: 'Active'
      };
      setMyTeams([newJoinedTeam, ...myTeams]);
      setJoinCode('');
    } else {
      alert("Invalid Code! Could not join the team.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] font-merriweather selection:bg-[#B8A18A] selection:text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#7C6C58]/20 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Header/Logo placeholder */}
          <div className="p-8 border-b border-[#7C6C58]/20 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-[#B8A18A]"></div>
             <span className="font-playfair font-bold text-white tracking-widest text-sm uppercase">Events</span>
          </div>
          
          <nav className="space-y-2 px-4">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-4 py-3 text-[#7C6C58] hover:text-[#B8A18A] rounded-lg transition-colors group">
              <FiHome size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wider">Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-[#7C6C58]/10 text-white rounded-lg border border-[#7C6C58]/30 transition-colors cursor-default">
              <FiUsers size={20} />
              <span className="text-sm font-bold tracking-wider">Teams</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-[#7C6C58] hover:text-[#B8A18A] rounded-lg transition-colors group">
              <FiFolder size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wider">Projects</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-[#7C6C58] hover:text-[#B8A18A] rounded-lg transition-colors group">
              <FiSettings size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wider">Settings</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-[#7C6C58] hover:text-[#B8A18A] rounded-lg transition-colors group">
              <FiUser size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wider">Profile</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-[#7C6C58]/20">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-[#7C6C58] hover:text-red-400 rounded-lg transition-colors group">
            <FiLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wider">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative p-6 md:p-10">
        
        {/* Top Navbar logic for mobile could go here, but focusing on the main layout */}
        <div className="max-w-4xl mx-auto space-y-10 mt-10 md:mt-4">
          
          <div className="mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">Team Register</h1>
            <p className="text-[#7C6C58] font-mono text-xs tracking-widest uppercase">Event Id // {eventId || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Create Team Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-8 flex flex-col justify-between hover:border-[#B8A18A]/50 transition-colors shadow-lg group relative"
            >
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-2 tracking-wide">Create Team</h2>
                <p className="text-[#7C6C58] text-sm italic mb-8">Start a new collaboration group.</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#7C6C58] flex items-center justify-center text-[#B8A18A] opacity-50 group-hover:opacity-100 group-hover:border-[#B8A18A] transition-all duration-500">
                  <FiPlus size={32} />
                </div>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full py-3 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-sm tracking-widest hover:bg-[#B8A18A] transition-colors"
                >
                  Create New Team
                </button>
              </div>
            </motion.div>

            {/* Join Team Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-8 flex flex-col hover:border-[#B8A18A]/50 transition-colors shadow-lg"
            >
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-2 tracking-wide">Join Team</h2>
                <p className="text-[#7C6C58] text-sm italic mb-8">Ask your team lead for the code.</p>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter Team Code" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="flex-1 bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] font-mono text-sm"
                  />
                  <button 
                    onClick={handleJoinTeam}
                    className="py-3 px-8 bg-white text-[#0E0E0E] font-bold uppercase rounded-lg text-sm tracking-widest hover:bg-[#B8A18A] transition-colors whitespace-nowrap"
                  >
                    Join
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* My Teams Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-8"
          >
            <h3 className="font-playfair text-2xl font-bold text-white tracking-wide mb-6">My Teams</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTeams.map((team, idx) => (
                <div key={team.id} className="p-5 bg-transparent border border-[#7C6C58]/30 rounded-xl flex items-center justify-between hover:bg-[#1A1A1A]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#7C6C58]/50 flex items-center justify-center -rotate-45 text-[#7C6C58]">
                       {/* Abstract avatar placeholder */}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{team.name}</h4>
                      <p className="text-xs text-[#7C6C58]">{team.members} • {team.status}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-[#7C6C58]/40 rounded text-xs text-white hover:bg-[#B8A18A] hover:text-[#0E0E0E] hover:border-[#B8A18A] transition-colors uppercase font-bold tracking-wider">
                    View Team
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </main>

      {/* Internal Styles for Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
      `}</style>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E1E1E] border border-[#B8A18A]/50 rounded-2xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(184,161,138,0.15)]"
          >
            <button 
              onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); setTeamSize(''); }} 
              className="absolute top-4 right-4 text-[#7C6C58] hover:text-white pb-1"
            >
              ✕
            </button>
            <h2 className="font-playfair text-3xl font-bold text-white uppercase tracking-tight mb-6 mt-2">Initialize Team</h2>
            
            {!generatedCode ? (
              <form onSubmit={handleCreateTeam} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Team Name</label>
                  <input 
                    type="text" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Max Members</label>
                  <input 
                    type="number" 
                    min="1"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    required
                    className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-xs tracking-[0.4em] rounded-xl hover:shadow-[0_0_20px_rgba(184,161,138,0.3)] transition-all"
                  >
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
                <button 
                  onClick={() => { setIsCreateModalOpen(false); setGeneratedCode(null); setTeamName(''); setTeamSize(''); }} 
                  className="w-full py-3 bg-transparent border border-[#7C6C58] text-[#B8A18A] font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#7C6C58]/20 transition-all"
                >
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
