import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Trash2, Plus, Minus, CheckCircle2, AlertCircle, Loader2, Crop, Layers } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import ImageCropperModal from "./ImageCropperModal";

const CATEGORIES = [
  { id: "faculty", label: "Faculty Incharge", prefix: "Faculty Incharge" },
  { id: "final_year", label: "Our Team (Final Year)", prefix: "Team Final Year" },
  { id: "pre_final_year", label: "Our Team (Pre-Final Year)", prefix: "Team Pre-Final Year" },
  { id: "second_year", label: "Our Team (Second Year)", prefix: "Team Second Year" },
  { id: "alumni", label: "Alumni Network", prefix: "Alumni" },
];

const PRESET_SUBTEAMS = [
  "Marketing Team",
  "Media Team",
  "Event Management Team",
  "Web Team",
  "Design Team",
  "Content Team",
  "General",
];

export default function TeamManagement() {
  const [selectedCategory, setSelectedCategory] = useState("faculty");
  const [selectedSubteamFilter, setSelectedSubteamFilter] = useState("ALL");
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    subTeam: "General",
    role: "",
    registrationNo: "",
    sequence: 1,
    email: "",
    linkedin: "",
    instagram: "",
    imageUrl: "",
  });

  const [isCustomSubteam, setIsCustomSubteam] = useState(false);

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageToCrop, setRawImageToCrop] = useState(null);
  const fileInputRef = useRef(null);

  // Load team members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.teamMembers();
      const allMembers = response.members || [];
      setMembers(allMembers);
    } catch (err) {
      setError(err?.message || "Failed to load team management data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Filter members by currently selected category and subteam
  const categoryMembers = members
    .filter((m) => {
      if (m.category !== selectedCategory) return false;
      if (selectedCategory === "pre_final_year" && selectedSubteamFilter !== "ALL") {
        return (m.subTeam || "General") === selectedSubteamFilter;
      }
      return true;
    })
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  // Current selected member
  const currentMember =
    categoryMembers.find((m) => m._id === selectedMemberId) || categoryMembers[0] || null;

  // Sync form data when currentMember changes or category changes
  useEffect(() => {
    if (currentMember) {
      setSelectedMemberId(currentMember._id);
      const sub = currentMember.subTeam || (selectedCategory === "pre_final_year" ? "Marketing Team" : "General");
      setFormData({
        name: currentMember.name || "",
        subTeam: sub,
        role: currentMember.role || "",
        registrationNo: currentMember.registrationNo || "",
        sequence: currentMember.sequence || 1,
        email: currentMember.email || "",
        linkedin: currentMember.linkedin || "",
        instagram: currentMember.instagram || "",
        imageUrl: currentMember.imageUrl || "",
      });
      setIsCustomSubteam(!PRESET_SUBTEAMS.includes(sub) && Boolean(sub));
    } else {
      setSelectedMemberId("");
      const defaultSub = selectedCategory === "pre_final_year" ? "Marketing Team" : "General";
      setFormData({
        name: "",
        subTeam: defaultSub,
        role: "",
        registrationNo: "",
        sequence: 1,
        email: "",
        linkedin: "",
        instagram: "",
        imageUrl: "",
      });
      setIsCustomSubteam(false);
    }
  }, [currentMember?._id, selectedCategory]);

  // Adjust slots: +1 Slot / -1 Slot
  const handleAdjustSlots = async (action) => {
    try {
      setSaving(true);
      setError("");
      setSuccessNotice("");
      await adminApi.adjustTeamSlots({
        category: selectedCategory,
        action,
      });
      await fetchMembers();
      setSuccessNotice(`Slot ${action === "add" ? "added" : "removed"} successfully.`);
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      setError(err?.message || `Failed to ${action} slot.`);
    } finally {
      setSaving(false);
    }
  };

  // Handle Image Selection from file picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageToCrop(event.target.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle Crop Complete
  const handleCropComplete = (croppedDataUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl: croppedDataUrl }));
    setSuccessNotice("Cropped image attached. Click 'Save Details' to persist.");
    setTimeout(() => setSuccessNotice(""), 4000);
  };

  // Delete current image
  const handleDeleteImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setSuccessNotice("Image cleared. Click 'Save Details' to persist.");
    setTimeout(() => setSuccessNotice(""), 4000);
  };

  // Save Details
  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a name for this member slot.");
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

    if (!currentMember) {
      // Create new member in this category
      try {
        setSaving(true);
        setError("");
        await adminApi.createTeamMember({
          ...formData,
          category: selectedCategory,
          categoryLabel: categoryObj?.label,
        });
        await fetchMembers();
        setSuccessNotice("Team member details created and saved successfully!");
        setTimeout(() => setSuccessNotice(""), 4000);
      } catch (err) {
        setError(err?.message || "Failed to create team member.");
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      setSaving(true);
      setError("");
      await adminApi.updateTeamMember(currentMember._id, {
        ...formData,
        category: selectedCategory,
        categoryLabel: categoryObj?.label,
      });
      await fetchMembers();
      setSuccessNotice("Team member details saved successfully!");
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      setError(err?.message || "Failed to update team member.");
    } finally {
      setSaving(false);
    }
  };

  const currentCategoryConfig = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const activeSlotIndex = categoryMembers.findIndex((m) => m._id === selectedMemberId);
  const displaySlotIndex = activeSlotIndex >= 0 ? activeSlotIndex + 1 : 1;

  // Collect all unique subteams for filtering
  const existingSubteams = Array.from(
    new Set(
      members
        .filter((m) => m.category === selectedCategory && m.subTeam)
        .map((m) => m.subTeam.trim())
    )
  );

  return (
    <div className="w-full text-neutral-100 font-sans">
      {/* Notifications */}
      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-600/40 bg-red-950/50 p-4 text-red-200 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-400" />
            <span className="text-sm">{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-xs text-red-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {successNotice && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-950/50 p-4 text-emerald-200 shadow-lg">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{successNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Management</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage Faculty, Final Year, and Pre-Final Year teams, sub-teams (Marketing, Media, Web, etc.), roles, and cropped portraits.
        </p>
      </div>

      {/* Top Control Bar: Category & Image Space Selection */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* 1. Select Category */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#FF3E24]">1. Select Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubteamFilter("ALL");
            }}
            className="w-full rounded-xl border border-neutral-800 bg-[#160b0b] px-4 py-3 text-sm text-neutral-200 transition focus:border-[#FF3E24] focus:outline-none focus:ring-1 focus:ring-[#FF3E24]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Sub-team filter for Pre-Final Year */}
          {selectedCategory === "pre_final_year" && existingSubteams.length > 0 && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Layers size={13} /> Filter sub-team:
              </span>
              <select
                value={selectedSubteamFilter}
                onChange={(e) => setSelectedSubteamFilter(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-[#160b0b] px-2.5 py-1 text-xs text-neutral-300"
              >
                <option value="ALL">All Sub-teams</option>
                {existingSubteams.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between pt-1 gap-3">
            <span className="text-xs text-neutral-400">
              Currently showing{" "}
              <strong className="text-neutral-200">{categoryMembers.length} slots</strong>.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleAdjustSlots("add")}
                className="flex items-center gap-1 rounded-lg bg-[#F58220] px-4 py-1.5 text-xs font-bold text-black transition hover:bg-[#ff9337] active:scale-95 disabled:opacity-50"
              >
                <Plus size={14} /> + 1 Slot
              </button>
              <button
                type="button"
                disabled={saving || categoryMembers.length === 0}
                onClick={() => handleAdjustSlots("remove")}
                className="flex items-center gap-1 rounded-lg bg-neutral-800 px-4 py-1.5 text-xs font-bold text-neutral-300 transition hover:bg-neutral-700 active:scale-95 disabled:opacity-50"
              >
                <Minus size={14} /> - 1 Slot
              </button>
            </div>
          </div>
        </div>

        {/* 2. Select Image Space / Member */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#FF3E24]">2. Select Image Space</label>
          <select
            value={selectedMemberId}
            disabled={categoryMembers.length === 0}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-[#160b0b] px-4 py-3 text-sm text-neutral-200 transition focus:border-[#FF3E24] focus:outline-none focus:ring-1 focus:ring-[#FF3E24] disabled:opacity-50"
          >
            {categoryMembers.length === 0 ? (
              <option value="">No slots in this view. Click '+ 1 Slot' to add</option>
            ) : (
              categoryMembers.map((m, idx) => (
                <option key={m._id} value={m._id}>
                  [#{idx + 1}] {m.name || "Empty Slot"} {m.subTeam ? `(${m.subTeam})` : ""} {m.imageUrl ? "(✓ Image)" : ""}
                </option>
              ))
            )}
          </select>
          <span className="block text-xs text-neutral-500">
            Select a member to preview and edit photo, designation, and team information.
          </span>
        </div>
      </div>

      {/* Main Slot Details & Image Card */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#120808]/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        {/* Slot Section Title */}
        <div className="mb-6 flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#FF3E24]">
            <Crop size={20} className="text-[#FF3E24]" />
            {currentCategoryConfig.prefix} {displaySlotIndex}
            {formData.subTeam && selectedCategory === "pre_final_year" && (
              <span className="ml-2 text-xs font-normal text-neutral-400">
                · {formData.subTeam}
              </span>
            )}
          </h2>

          {currentMember && (
            <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-xs text-neutral-400">
              ID: {currentMember._id.slice(-6)}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Image Management Area */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Current Image Display */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-300">Current Image</span>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="flex items-center gap-1 rounded-md bg-red-600/90 px-2.5 py-1 text-xs font-semibold text-white shadow transition hover:bg-red-700"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>

                <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0404]">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt={formData.name || "Member preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <div className="mb-2 h-20 w-20 rounded-full border border-dashed border-neutral-700 bg-neutral-900 flex items-center justify-center text-xs">
                        No Photo
                      </div>
                      <span className="text-xs">No image uploaded for this slot</span>
                    </div>
                  )}

                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setRawImageToCrop(formData.imageUrl);
                        setCropperOpen(true);
                      }}
                      className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/75 px-3 py-1 text-xs font-medium text-orange-400 backdrop-blur-md transition hover:bg-black"
                    >
                      <Crop size={14} /> Re-crop
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <div className="mb-2">
                  <span className="text-sm font-semibold text-neutral-300">Upload & Crop</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-900/60 bg-[#0d0404]/80 p-6 text-center transition hover:border-[#FF3E24] hover:bg-[#160808]"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900/80 text-neutral-300 shadow">
                    <Upload size={26} className="text-[#FF3E24]" />
                  </div>
                  <p className="text-sm font-bold text-neutral-200">
                    Click to select image for <br />
                    <span className="text-[#FF3E24]">
                      {currentCategoryConfig.prefix} {displaySlotIndex}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    JPG, PNG, WebP — will be cropped before upload
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member Details Form */}
            <form onSubmit={handleSaveDetails} className="space-y-6 pt-4 border-t border-neutral-800">
              <h3 className="text-lg font-bold text-white">Team Member Details</h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-300">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    placeholder="e.g. Prof. Mukul Shukla or Shreyansh Rathi"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                  />
                </div>

                {/* Role / Description Box */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                    Role Description (e.g. President, Media co-lead)
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    placeholder="e.g. President, Media co-lead, Web Lead"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                  />
                  <span className="mt-1 block text-[10px] text-neutral-500">
                    Appears inside the card's description box
                  </span>
                </div>

                {/* Sub-Team (for Pre-Final Year / Customizable) */}
                {selectedCategory === "pre_final_year" ? (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-300">
                        Sub-team (Department)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomSubteam(!isCustomSubteam)}
                        className="text-[10px] text-orange-400 hover:underline"
                      >
                        {isCustomSubteam ? "Choose from list" : "+ Custom sub-team"}
                      </button>
                    </div>

                    {isCustomSubteam ? (
                      <input
                        type="text"
                        value={formData.subTeam}
                        placeholder="Type custom team name..."
                        onChange={(e) => setFormData({ ...formData, subTeam: e.target.value })}
                        className="w-full rounded-xl border border-orange-500 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:outline-none"
                      />
                    ) : (
                      <select
                        value={formData.subTeam}
                        onChange={(e) => setFormData({ ...formData, subTeam: e.target.value })}
                        className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white transition focus:border-[#FF3E24] focus:outline-none"
                      >
                        {PRESET_SUBTEAMS.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    )}
                    <span className="mt-1 block text-[10px] text-neutral-500">
                      e.g. Marketing Team, Media Team, Event Management Team, Web Team
                    </span>
                  </div>
                ) : (
                  /* Sequence (Order) */
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                      Sequence (Order)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sequence}
                      onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Second row if Pre-Final Year (Sequence + Registration Number) */}
              {selectedCategory === "pre_final_year" && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                      Sequence (Order within team)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sequence}
                      onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                      Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.registrationNo}
                      placeholder="e.g. 20241001"
                      onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Social Attributes */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#FF3E24]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="e.g. member@mnnit.ac.in"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-red-950/60 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#FF3E24] focus:outline-none"
                  />
                </div>

                {/* LinkedIn Profile URL */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#00A3FF]">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    placeholder="https://linkedin.com/in/username"
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full rounded-xl border border-sky-950/60 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#00A3FF] focus:outline-none"
                  />
                </div>

                {/* Instagram Profile URL */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#E02888]">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    placeholder="https://instagram.com/username"
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full rounded-xl border border-pink-950/60 bg-[#0d0404] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#E02888] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                  className="rounded-xl bg-[#0084FF] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0074e0] active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Details"}
                </button>

                {currentMember && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      if (window.confirm(`Delete ${currentMember.name || "this slot"} permanently?`)) {
                        try {
                          setSaving(true);
                          await adminApi.deleteTeamMember(currentMember._id);
                          await fetchMembers();
                          setSuccessNotice("Member deleted successfully.");
                        } catch (err) {
                          setError(err?.message || "Failed to delete member.");
                        } finally {
                          setSaving(false);
                        }
                      }
                    }}
                    className="rounded-xl border border-red-900/60 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-950/40"
                  >
                    Delete Slot Permanently
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal
          imageSrc={rawImageToCrop}
          targetTitle={`${currentCategoryConfig.prefix} ${displaySlotIndex}`}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperOpen(false)}
        />
      )}
    </div>
  );
}
