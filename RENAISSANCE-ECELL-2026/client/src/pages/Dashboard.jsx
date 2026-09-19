import { useState } from "react";
import { getStoredProfile, saveStoredProfile, getStoredTeams, getStoredRegistrations } from "../utils/mockStore";
import ContactFooter from "../components/ContactFooter";

export default function Dashboard({ embedded = false }) {
  const [profile, setProfile] = useState(getStoredProfile());
  const [teams] = useState(getStoredTeams());
  const [registrations] = useState(getStoredRegistrations());
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setIsEditing(false);
    alert("Profile saved successfully!");
  };

  return (
    <div className={`${embedded ? "py-12 sm:py-16" : "min-h-[100svh] pt-24 pb-12 sm:pt-28"} flex flex-col justify-between overflow-x-hidden bg-transparent text-[#F4EBD9]`}>
      <div className="mx-auto mb-12 w-full max-w-5xl px-3 sm:mb-16 sm:px-6">
        <div className="mb-6 rounded-2xl border border-[#C5A25F]/25 bg-[#020610]/80 p-4 shadow-2xl backdrop-blur-xl sm:mb-8 sm:rounded-3xl sm:p-8">
          <div className="flex flex-col items-stretch justify-between gap-4 border-b border-[#C5A25F]/20 pb-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#C5A25F] bg-[#041021] border border-[#C5A25F]/30 uppercase mb-2 font-semibold">
                Participant Docket
              </span>
              <h1 className="mb-1 font-cinzel text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-3xl">User Dashboard</h1>
              <p className="break-words font-mono text-[11px] text-[#E2E8F0] sm:text-xs">ID: {profile.studentId} • {profile.collegeName}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full cursor-pointer rounded-lg border border-[#C5A25F] px-4 py-2.5 font-montserrat text-xs font-bold uppercase text-[#C5A25F] shadow-md transition-colors hover:bg-[#C5A25F] hover:text-[#020610] sm:w-auto sm:py-2"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#041021]/85 backdrop-blur-xl border border-[#C5A25F]/25 shadow-2xl mb-8">
          <h3 className="font-cinzel text-lg font-bold text-[#C5A25F] mb-4">Profile Information</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#94A3B8] mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#050B14] border border-[#D4AF37]/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#050B14] border border-[#D4AF37]/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#050B14] border border-[#D4AF37]/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#94A3B8] mb-1">Registration No.</label>
              <input
                type="text"
                name="studentId"
                value={profile.studentId}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#050B14] border border-[#D4AF37]/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#94A3B8] mb-1">College</label>
              <input
                type="text"
                name="collegeName"
                value={profile.collegeName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#050B14] border border-[#D4AF37]/20 rounded px-3 py-2 text-white"
              />
            </div>
            {isEditing && (
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-[#D4AF37] text-[#050B14] font-bold uppercase"
                >
                  Save Profile
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Registrations & Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#0A192F]/40 border border-[#C5A25F]/20">
            <h3 className="font-cinzel text-lg font-bold text-[#F4EBD9] mb-4">
              Registered Events ({registrations.length})
            </h3>
            <div className="space-y-3">
              {registrations.map((r, i) => (
                <div key={i} className="p-3 bg-[#050B14] rounded border border-[#C5A25F]/15 flex justify-between text-xs">
                  <span>{r.eventName}</span>
                  <span className="text-[#0EA5E9] font-mono font-bold">{r.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0A192F]/40 border border-[#C5A25F]/20">
            <h3 className="font-cinzel text-lg font-bold text-[#F4EBD9] mb-4">
              My Teams ({teams.length})
            </h3>
            <div className="space-y-3">
              {teams.map((t, i) => (
                <div key={i} className="p-3 bg-[#050B14] rounded border border-[#C5A25F]/15 flex justify-between text-xs">
                  <div>
                    <span className="font-bold block">{t.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">{t.eventName}</span>
                  </div>
                  <span className="text-[#C5A25F] font-mono font-bold">{t.teamCode}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!embedded && <ContactFooter />}
    </div>
  );
}
