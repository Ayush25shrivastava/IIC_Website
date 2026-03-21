import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFolder, FiSettings, FiUser, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/config';

const Dashboard = () => {
  const navigate = useNavigate();

  // User State mapped to Mongoose Schema
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
    studentId: '',
    branch: '',
    year: '',
    isMnnit: false,
    avatar: '',
    registeredEvents: [],
    teams: [] // From profile
  });

  // State to hold fully populated teams data
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Helper for auth headers
  const getHeaders = () => {
    const token = localStorage.getItem('jwt'); 
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch User Data and Teams on Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch User Profile
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, { 
          method: 'GET',
          headers: getHeaders() 
        });
        const profileData = await profileResponse.json();
        
        if (profileData.success) {
          const profile = profileData.data;
          setUser({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            collegeName: profile.collegeName || '',
            studentId: profile.studentId || '',
            branch: profile.branch || '',
            year: profile.year || '',
            isMnnit: profile.isMnnit || false,
            avatar: profile.avatar || '',
            registeredEvents: profile.registeredEvents || [],
            teams: profile.teams || []
          });
        }

        // 2. Fetch Detailed Teams Data (Populated with Events)
        const teamsResponse = await fetch(`${API_BASE_URL}/teams/my-teams`, {
          method: 'GET',
          headers: getHeaders()
        });
        const teamsData = await teamsResponse.json();

        if (teamsData.success) {
          setMyTeams(teamsData.data);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (localStorage.getItem('jwt')) {
      fetchDashboardData();
    } else {
      navigate('/udbhav'); // Redirect if no token
    }
  }, [navigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isMnnit') {
      setUser(prev => ({ 
        ...prev, 
        isMnnit: checked,
        collegeName: checked ? 'MNNIT Allahabad' : prev.collegeName 
      }));
    } else {
      setUser(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // Submit Updated Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(user)
      });
      const data = await response.json();

      if (data.success) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating.");
    } finally {
      setSaving(false);
    }
  };

  // Calculate Profile Completion Percentage
  const calculateCompletion = () => {
    const trackingFields = ['name', 'email', 'phone', 'collegeName', 'studentId', 'branch', 'year'];
    let filled = 0;
    
    trackingFields.forEach(field => {
      if (user[field] && String(user[field]).trim() !== '') {
        filled++;
      }
    });

    return Math.round((filled / trackingFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  if (loading) {
    return <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center text-[#B8A18A] font-mono animate-pulse">Loading Intelligence...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#B8A18A] font-merriweather selection:bg-[#B8A18A] selection:text-white flex overflow-hidden">
      
      {/* Sidebar (Desktop Only) */}
      <aside className="w-64 border-r border-[#7C6C58]/20 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-8 border-b border-[#7C6C58]/20 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-[#B8A18A] overflow-hidden">
                {user.avatar && <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />}
             </div>
             <span className="font-playfair font-bold text-white tracking-widest text-sm uppercase">You</span>
          </div>
          
          <nav className="space-y-2 px-4">
            <button  onClick={() => navigate('/udbhav')} className="w-full cursor-pointer flex items-center gap-4 px-4 py-3 bg-[#7C6C58]/10 text-white rounded-lg border border-[#7C6C58]/30 transition-colors cursor-default">
              <FiHome size={20} /> {/* Swapped to FiHome for consistency */}
              <span className="text-sm font-bold tracking-wider">Home</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative p-6 md:p-10">
        
        {/* Mobile Header Navigation (Hidden on Desktop) */}
        <div className="md:hidden flex justify-between items-center mb-6 pb-4 border-b border-[#7C6C58]/20 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#B8A18A] overflow-hidden">
               {user.avatar && <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />}
            </div>
            <span className="font-playfair font-bold text-white tracking-widest text-sm uppercase">You</span>
          </div>
          <button onClick={() => navigate('/udbhav')} className="flex items-center gap-2 px-4 py-2 bg-[#7C6C58]/10 text-white rounded-lg border border-[#7C6C58]/30 hover:bg-[#7C6C58]/20 transition-colors">
            <FiHome size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Home</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 mt-4 md:mt-4">
          
          <div className="mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">User Dashboard</h1>
            <p className="text-[#7C6C58] font-mono text-xs tracking-widest uppercase">ID // {user.studentId || 'UNASSIGNED'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-8 shadow-lg relative">
              <h2 className="font-playfair text-2xl font-bold text-white mb-6 tracking-wide border-b border-[#7C6C58]/30 pb-4">Update Intelligence</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Full Name</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} required className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Email Identity</label>
                    <input type="email" name="email" value={user.email} disabled className="w-full bg-[#0E0E0E]/50 border border-[#7C6C58]/20 rounded-lg px-4 py-3 text-[#7C6C58] cursor-not-allowed text-sm font-mono" title="Email cannot be changed" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Comms Line (Phone)</label>
                    <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono" />
                  </div>

                  {/* Is MNNIT Checkbox */}
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-6 h-6 border-2 border-[#7C6C58] rounded group-hover:border-[#B8A18A] transition-colors bg-[#0E0E0E]">
                        <input type="checkbox" name="isMnnit" checked={user.isMnnit} onChange={handleChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                        {user.isMnnit && <FiCheckCircle className="text-[#B8A18A] w-4 h-4" />}
                      </div>
                      <span className="text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest group-hover:text-white transition-colors">I am an MNNIT Student</span>
                    </label>
                  </div>

                  {/* College Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Institution Name</label>
                    <input type="text" name="collegeName" value={user.collegeName} onChange={handleChange} disabled={user.isMnnit} className={`w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono ${user.isMnnit ? 'opacity-50 cursor-not-allowed' : ''}`} />
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Registration No.</label>
                    <input type="text" name="studentId" value={user.studentId} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono" />
                  </div>

                  {/* Branch & Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Branch</label>
                      <input type="text" name="branch" value={user.branch} onChange={handleChange} placeholder="e.g. CSE" className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-[#7C6C58] font-bold font-mono tracking-widest mb-2">Year</label>
                      <input type="number" name="year" min="1" max="5" value={user.year} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-[#7C6C58]/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B8A18A] text-sm font-mono" />
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-[#7C6C58]/30">
                  <button type="submit" disabled={saving} className="w-full py-4 bg-[#B8A18A] text-[#0E0E0E] font-black uppercase text-xs tracking-[0.4em] rounded-xl hover:shadow-[0_0_20px_rgba(184,161,138,0.3)] transition-all disabled:opacity-50">
                    {saving ? 'Encrypting Data...' : 'Save Operations Data'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Right Column: Tracker & Details */}
            <div className="space-y-8">
              
              {/* Profile Tracker */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-6 shadow-lg">
                <h3 className="font-playfair text-xl font-bold text-white mb-4">Profile Integrity</h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[#7C6C58] font-mono text-xs uppercase tracking-widest">Completion</span>
                  <span className="text-2xl font-bold font-mono text-white">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-[#0E0E0E] rounded-full h-3 border border-[#7C6C58]/40 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${completionPercentage}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-[#B8A18A] h-full"
                  />
                </div>
                {completionPercentage < 100 && (
                  <p className="mt-4 text-xs italic text-[#7C6C58]">Fill missing fields to achieve operational readiness.</p>
                )}
              </motion.div>

              {/* Registered Events */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-6 shadow-lg h-64 flex flex-col">
                <h3 className="font-playfair text-xl font-bold text-white mb-4 border-b border-[#7C6C58]/30 pb-2">Active Deployments (Events)</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {user.registeredEvents.length > 0 ? (
                    user.registeredEvents.map((event, idx) => (
                      <div key={idx} className="bg-[#0E0E0E] border border-[#7C6C58]/20 p-3 rounded-lg flex justify-between items-center group hover:border-[#B8A18A]/50 transition-colors">
                        <span className="font-bold text-sm text-white">{event.name || 'Unknown Event'}</span>
                        <span className="text-[10px] font-mono uppercase text-[#7C6C58] group-hover:text-[#B8A18A]">Confirmed</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs italic text-[#7C6C58] text-center">No active deployments found.</div>
                  )}
                </div>
              </motion.div>

              {/* Teams - Fetched from /api/teams/my-teams */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#7C6C58]/30 rounded-2xl p-6 shadow-lg h-64 flex flex-col">
                <h3 className="font-playfair text-xl font-bold text-white mb-4 border-b border-[#7C6C58]/30 pb-2">Allied Squads (Teams)</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {myTeams.length > 0 ? (
                    myTeams.map((team, idx) => (
                      <div key={team._id || idx} className="bg-[#0E0E0E] border border-[#7C6C58]/20 p-3 rounded-lg flex justify-between items-center group hover:border-[#B8A18A]/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white block truncate max-w-[120px]" title={team.name}>{team.name}</span>
                          <span className="text-[10px] font-mono text-[#7C6C58]">Code: {team.teamCode}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="font-bold text-xs text-[#B8A18A] block truncate max-w-[120px]" title={team.event?.name}>
                            {team.event?.name || 'Unknown Event'}
                          </span>
                          <span className="text-[9px] font-mono text-[#7C6C58] uppercase">
                            Squad Size: {(team.members?.length || 0) + 1}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs italic text-[#7C6C58] text-center">Not affiliated with any squad.</div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      {/* Internal Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7C6C58; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;