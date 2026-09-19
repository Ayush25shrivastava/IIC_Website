import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation, Users, UserPlus, Sparkles, CheckCircle2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS_DATA } from "../data/eventsData";
import {
  generateTeamCode,
  getStoredProfile,
  getStoredRegistrations,
  getStoredTeams,
  saveStoredRegistrations,
  saveStoredTeams,
} from "../utils/mockStore";

export default function Registration({ embedded = false }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [selectedEventId, setSelectedEventId] = useState(
    eventId || "event-1"
  );
  const [profile] = useState(getStoredProfile());
  const [teams, setTeams] = useState(getStoredTeams());
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("solo"); // "solo" | "create" | "join"

  const activeEvent =
    EVENTS_DATA.find((event) => event.id === selectedEventId) ||
    EVENTS_DATA[0];

  const handleSoloRegister = () => {
    const registrations = getStoredRegistrations();

    saveStoredRegistrations([
      {
        eventId: activeEvent.id,
        eventName: activeEvent.name,
        type: "Solo",
        registeredAt: "2026-03-20",
      },
      ...registrations,
    ]);

    alert(`Successfully registered solo for ${activeEvent.name}!`);

    if (!embedded) {
      navigate("/dashboard");
    }
  };

  const handleCreateCrew = (event) => {
    event.preventDefault();

    if (!teamName.trim()) {
      return;
    }

    const code = generateTeamCode();

    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamName.trim(),
      eventId: activeEvent.id,
      eventName: activeEvent.name,
      teamCode: code,
      leaderName: profile.name,
      members: [],
      status: "Registered",
    };

    const updatedTeams = [newTeam, ...teams];

    saveStoredTeams(updatedTeams);
    setTeams(updatedTeams);
    setGeneratedCode(code);
    setTeamName("");
  };

  const handleJoinCrew = (event) => {
    event.preventDefault();

    if (!joinCode.trim()) {
      return;
    }

    alert(`Joined team with code: ${joinCode.trim().toUpperCase()}`);

    if (!embedded) {
      navigate("/dashboard");
    }
  };

  const handleEventChange = (event) => {
    setSelectedEventId(event.target.value);
    setGeneratedCode(null);
  };

  return (
    <div
      className={`${
        embedded ? "py-4 sm:py-6" : "min-h-[100svh] pt-20 sm:pt-24 pb-12 sm:pb-16"
      } relative flex items-center justify-center overflow-x-hidden bg-transparent px-3 text-white sm:px-6`}
    >
      {/* Background Glow Decors */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#C5A25F]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 my-auto">
        {/* Sleek Glassmorphic Oceanic Manifest Card */}
        <div className="relative rounded-3xl border border-[#C5A25F]/40 bg-[#040f21]/90 backdrop-blur-2xl p-5 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] shadow-[0_0_35px_rgba(197,162,95,0.18)] overflow-hidden">
          {/* Header Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#C5A25F] to-transparent" />

          {/* Title Header */}
          <div className="text-center mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A25F]/50 bg-[#C5A25F]/15 text-[#C5A25F] text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2.5 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#C5A25F]" />
              <span>Official Expedition Ledger</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Summit Enlistment
            </h1>

            <p className="text-xs sm:text-sm text-[#F4EBD9]/80 font-light max-w-md mx-auto mt-1.5 leading-relaxed">
              Chart your course for Renaissance 2026. Register solo or form your voyage crew.
            </p>
          </div>

          {/* Track / Event Selector */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#020713]/80 border border-white/10 mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A25F]/15 border border-[#C5A25F]/40 flex items-center justify-center text-[#C5A25F] shrink-0">
                <Navigation className="w-4 h-4 -rotate-45" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A25F] font-bold block truncate">
                  Select Target Challenge
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                  {activeEvent.name}
                </h3>
              </div>
            </div>

            <select
              value={selectedEventId}
              onChange={handleEventChange}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#040f21] border border-white/15 text-xs text-[#F4EBD9] font-mono focus:outline-none focus:border-[#C5A25F] cursor-pointer"
            >
              {EVENTS_DATA.map((event) => (
                <option key={event.id} value={event.id} className="bg-[#040f21] text-white">
                  {event.name} ({event.category})
                </option>
              ))}
            </select>
          </div>

          {/* Registration Mode Tabs */}
      <div className="mb-6 grid grid-cols-1 gap-1 rounded-2xl border border-white/10 bg-[#020713]/80 p-1 sm:mb-8 sm:grid-cols-3 sm:gap-2 sm:p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("solo")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "solo"
                  ? "bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] border border-[#C5A25F]/60 shadow-[0_0_20px_rgba(197,162,95,0.45)]"
                  : "text-[#94A3B8] hover:text-[#F4EBD9]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block sm:inline-block" />
              <span className="truncate">Solo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] border border-[#C5A25F]/60 shadow-[0_0_20px_rgba(197,162,95,0.45)]"
                  : "text-[#94A3B8] hover:text-[#F4EBD9]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block sm:inline-block" />
              <span className="truncate">Create Crew</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("join")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "join"
                  ? "bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] border border-[#C5A25F]/60 shadow-[0_0_20px_rgba(197,162,95,0.45)]"
                  : "text-[#94A3B8] hover:text-[#F4EBD9]"
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block sm:inline-block" />
              <span className="truncate">Join Crew</span>
            </button>
          </div>

          {/* Animated Mode Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Solo Registration */}
              {activeTab === "solo" && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#020713]/60 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                      Solo Entry Manifest
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Enlist individually as a single voyager for {activeEvent.name}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSoloRegister}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(197,162,95,0.6)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0 border border-[#C5A25F]/60"
                  >
                    Enlist Solo Now
                  </button>
                </div>
              )}

              {/* Create Crew */}
              {activeTab === "create" && (
                <form onSubmit={handleCreateCrew} className="space-y-4">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#020713]/60 border border-white/10 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-[#C5A25F] uppercase tracking-wider mb-2 font-bold">
                        Voyage Crew Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mariana Pioneers"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#040f21] border border-white/15 text-base sm:text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#C5A25F]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(197,162,95,0.6)] transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer border border-[#C5A25F]/60"
                    >
                      Commission New Crew
                    </button>

                    {generatedCode && (
                      <div className="mt-4 p-4 rounded-xl bg-[#C5A25F]/15 border border-[#C5A25F]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#C5A25F] shrink-0" />
                          <span className="text-xs text-white">Crew Code Generated:</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#C5A25F] bg-[#020713] px-3 py-1 rounded-lg border border-[#C5A25F]/30 tracking-wider">
                          {generatedCode}
                        </span>
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* Join Crew */}
              {activeTab === "join" && (
                <form onSubmit={handleJoinCrew} className="space-y-4">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#020713]/60 border border-white/10 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-[#C5A25F] uppercase tracking-wider mb-2 font-bold">
                        Enter Crew Access Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. REN-9X42"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#040f21] border border-white/15 text-base sm:text-sm text-white font-mono placeholder-[#64748B] focus:outline-none focus:border-[#C5A25F] uppercase tracking-wider"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(197,162,95,0.6)] transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer border border-[#C5A25F]/60"
                    >
                      Join Existing Crew
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}