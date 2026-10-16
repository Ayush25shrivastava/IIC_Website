import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Upload,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crop,
  Layers,
  Users,
  Edit3,
  X,
  RefreshCw,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { adminApi } from "../lib/server1-api";
import ImageCropperModal from "./ImageCropperModal";

const CATEGORIES = [
  { id: "faculty", label: "Faculty Incharge", prefix: "Faculty Incharge", isFaculty: true },
  { id: "final_year", label: "Our Team (Final Year)", prefix: "Final Year", isFaculty: false },
  { id: "pre_final_year", label: "Our Team (Pre-Final Year)", prefix: "Pre-Final Year", isFaculty: false },
  { id: "second_year", label: "Our Team (Second Year)", prefix: "Second Year", isFaculty: false },
  { id: "alumni", label: "Alumni Network", prefix: "Alumni", isFaculty: false },
];

const DEFAULT_PRESET_SUBTEAMS = [
  "Marketing Team",
  "Media Team",
  "Event Management Team",
  "Web Team",
  "Design Team",
  "Content Team",
  "Corporate Relations",
  "Sponsorship Team",
  "Public Relations",
  "Logistics Team",
  "General",
];

const STORAGE_CUSTOM_SUBTEAMS_KEY = "renaissance_admin_custom_subteams";

export default function TeamManagement() {
  const [selectedCategory, setSelectedCategory] = useState("faculty");
  const [selectedSubteamFilter, setSelectedSubteamFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Custom sub-teams stored in localStorage
  const [customSubteams, setCustomSubteams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_SUBTEAMS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // null = creating new
  const [addSubteamModalOpen, setAddSubteamModalOpen] = useState(false);
  const [newSubteamName, setNewSubteamName] = useState("");

  // Form State inside edit modal
  const [formData, setFormData] = useState({
    name: "",
    category: "faculty",
    subTeam: "General",
    role: "",
    registrationNo: "",
    sequence: 1,
    email: "",
    linkedin: "",
    instagram: "",
    imageUrl: "",
  });
  const [isCustomSubteamInput, setIsCustomSubteamInput] = useState(false);

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

  // Combine default presets, saved custom sub-teams, and any subteams already in database
  const allAvailableSubteams = useMemo(() => {
    const fromMembers = members
      .map((m) => (m.subTeam || "").trim())
      .filter((s) => Boolean(s) && s !== "General");
    const merged = Array.from(
      new Set([...DEFAULT_PRESET_SUBTEAMS.filter((s) => s !== "General"), ...customSubteams, ...fromMembers])
    ).sort();
    return ["General", ...merged];
  }, [members, customSubteams]);

  // Handle adding a brand new sub-team
  const handleAddNewSubteam = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSubteamName.trim();
    if (!trimmed) return;

    if (!allAvailableSubteams.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      const updated = Array.from(new Set([...customSubteams, trimmed]));
      setCustomSubteams(updated);
      try {
        localStorage.setItem(STORAGE_CUSTOM_SUBTEAMS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save custom subteams to localStorage", err);
      }
    }

    setSelectedSubteamFilter(trimmed);
    setFormData((prev) => ({ ...prev, subTeam: trimmed }));
    setIsCustomSubteamInput(false);
    setNewSubteamName("");
    setAddSubteamModalOpen(false);
    setSuccessNotice(`Sub-team "${trimmed}" added! You can now assign members to it.`);
    setTimeout(() => setSuccessNotice(""), 4000);
  };

  // Open edit modal for an existing member
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const sub = member.subTeam || "General";
    setFormData({
      name: member.name || "",
      category: member.category || selectedCategory,
      subTeam: sub,
      role: member.role || "",
      registrationNo: member.registrationNo || "",
      sequence: member.sequence || 1,
      email: member.email || "",
      linkedin: member.linkedin || "",
      instagram: member.instagram || "",
      imageUrl: member.imageUrl || "",
    });
    setIsCustomSubteamInput(!allAvailableSubteams.includes(sub) && Boolean(sub));
    setEditModalOpen(true);
  };

  // Open create modal for a new slot in the current category
  const handleOpenCreate = (subTeamPreset = null) => {
    setEditingMember(null);
    const defaultSub =
      subTeamPreset ||
      (selectedSubteamFilter !== "ALL"
        ? selectedSubteamFilter
        : selectedCategory === "pre_final_year"
        ? "Marketing Team"
        : "General");

    const categoryMembers = members.filter((m) => m.category === selectedCategory);
    const nextSeq = categoryMembers.length > 0 ? Math.max(...categoryMembers.map((m) => m.sequence || 0)) + 1 : 1;

    setFormData({
      name: "",
      category: selectedCategory,
      subTeam: defaultSub,
      role: selectedCategory === "faculty" ? "Faculty Incharge" : "",
      registrationNo: "",
      sequence: nextSeq,
      email: "",
      linkedin: "",
      instagram: "",
      imageUrl: "",
    });
    setIsCustomSubteamInput(false);
    setEditModalOpen(true);
  };

  // Quick adjust: +1 Slot / -1 Slot
  const handleAdjustSlots = async (action) => {
    try {
      setSaving(true);
      setError("");
      setSuccessNotice("");
      await adminApi.adjustTeamSlots({
        category: selectedCategory,
        action,
        subTeam: selectedSubteamFilter !== "ALL" ? selectedSubteamFilter : undefined,
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

  // Image Selection
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

  // Crop Complete
  const handleCropComplete = (croppedDataUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl: croppedDataUrl }));
    setSuccessNotice("Cropped portrait attached. Click 'Save Member Details' to persist.");
    setTimeout(() => setSuccessNotice(""), 4000);
  };

  // Delete current image
  const handleDeleteImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // Save Details
  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a name for this member slot.");
      return;
    }

    const targetCategory = formData.category || selectedCategory;
    const catConfig = CATEGORIES.find((c) => c.id === targetCategory);

    try {
      setSaving(true);
      setError("");

      if (!editingMember) {
        // Create new member
        await adminApi.createTeamMember({
          ...formData,
          category: targetCategory,
          categoryLabel: catConfig?.label || "Our Team",
        });
        setSuccessNotice("New team member slot added successfully!");
      } else {
        // Update member
        await adminApi.updateTeamMember(editingMember._id, {
          ...formData,
          category: targetCategory,
          categoryLabel: catConfig?.label || "Our Team",
        });
        setSuccessNotice("Team member details updated successfully!");
      }

      await fetchMembers();
      setEditModalOpen(false);
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      setError(err?.message || "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a specific member
  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Permanently delete ${memberName || "this slot"}?`)) return;

    try {
      setSaving(true);
      setError("");
      await adminApi.deleteTeamMember(memberId);
      await fetchMembers();
      if (editModalOpen && editingMember?._id === memberId) {
        setEditModalOpen(false);
      }
      setSuccessNotice("Member slot deleted successfully.");
      setTimeout(() => setSuccessNotice(""), 4000);
    } catch (err) {
      setError(err?.message || "Failed to delete member.");
    } finally {
      setSaving(false);
    }
  };

  // Filter members by category, subteam, and search query
  const categoryMembers = useMemo(() => {
    let list = members;
    if (selectedCategory !== "all") {
      list = list.filter((m) => m.category === selectedCategory);
    }

    if (selectedSubteamFilter !== "ALL") {
      list = list.filter((m) => (m.subTeam || "General") === selectedSubteamFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.role || "").toLowerCase().includes(q) ||
          (m.subTeam || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  }, [members, selectedCategory, selectedSubteamFilter, searchQuery]);

  // Group by subteams for display if showing Pre-Final or if subteams exist
  const membersBySubteam = useMemo(() => {
    return categoryMembers.reduce((acc, m) => {
      const st = (m.subTeam || "General").trim();
      if (!acc[st]) acc[st] = [];
      acc[st].push(m);
      return acc;
    }, {});
  }, [categoryMembers]);

  // Subteam counts in current category
  const activeCategorySubteams = useMemo(() => {
    const list = members.filter((m) => selectedCategory === "all" || m.category === selectedCategory);
    const set = new Set(list.map((m) => (m.subTeam || "General").trim()));
    return Array.from(set).sort();
  }, [members, selectedCategory]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts = { faculty: 0, final_year: 0, pre_final_year: 0, second_year: 0, alumni: 0 };
    members.forEach((m) => {
      if (m.category && counts[m.category] !== undefined) {
        counts[m.category]++;
      }
    });
    return counts;
  }, [members]);

  const currentCategoryConfig =
    CATEGORIES.find((c) => c.id === selectedCategory) || {
      id: "all",
      label: "All Team Members",
      prefix: "Team",
      isFaculty: false,
    };

  return (
    <div className="w-full text-[#173f52]">
      {/* Top Banner / Hero matching Admin theme */}
      <section className="admin-hero !pt-2 !pb-6">
        <p className="admin-kicker">Renaissance X · The Command Deck</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="!text-3xl sm:!text-4xl text-[#e2f4f7]">
              Management & <em>Organizing Guild</em>
            </h1>
            <p className="mt-1 text-sm text-[#c5e6ee]">
              Manage faculty incharges, core council, student leaders, customizable sub-teams, and cropped portraits.
            </p>
          </div>

          <div className="admin-actions flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenCreate()}
              className="admin-gold shadow-md flex items-center gap-1.5"
            >
              <Plus size={18} /> Add Member Slot
            </button>
            <button
              type="button"
              onClick={() => {
                setNewSubteamName("");
                setAddSubteamModalOpen(true);
              }}
              className="border border-[#b6dce4] bg-[#e5f6fa] text-[#247d96] hover:bg-[#f4fcfd] flex items-center gap-1.5"
            >
              <Layers size={17} className="text-[#0d7892]" /> + Add Sub-Team
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={fetchMembers}
              title="Refresh roster"
              className="border border-[#b6dce4] bg-[#e5f6fa] text-[#527e8e] hover:bg-[#f4fcfd] p-2.5"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {error && (
        <div className="admin-alert mb-5 flex items-center justify-between" role="alert">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="admin-text-button">
            Dismiss
          </button>
        </div>
      )}

      {successNotice && (
        <div className="admin-notice mb-5 flex items-center gap-2" role="status">
          <CheckCircle2 size={18} className="text-emerald-700" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Program Summary Stats Bar */}
      <section className="admin-stats mb-6" aria-label="Roster totals">
        {[
          { label: "Faculty Incharge", val: categoryCounts.faculty, cat: "faculty" },
          { label: "Final Year", val: categoryCounts.final_year, cat: "final_year" },
          { label: "Pre-Final Year", val: categoryCounts.pre_final_year, cat: "pre_final_year" },
          { label: "Second Year", val: categoryCounts.second_year, cat: "second_year" },
        ].map((item, idx) => (
          <article
            key={item.label}
            onClick={() => {
              setSelectedCategory(item.cat);
              setSelectedSubteamFilter("ALL");
            }}
            className={`admin-panel admin-stat cursor-pointer transition-transform hover:-translate-y-0.5 ${
              selectedCategory === item.cat ? "gold ring-2 ring-[#d8b15c]" : ""
            }`}
          >
            <div>
              <span className="admin-kicker">{item.label}</span>
              <Users size={20} />
            </div>
            <strong>{item.val}</strong>
            <p className="text-xs">
              {item.cat === "faculty" && "2 Lead Professors"}
              {item.cat === "final_year" && "Council Leadership"}
              {item.cat === "pre_final_year" && "Department Leads"}
              {item.cat === "second_year" && "Associate Members"}
            </p>
          </article>
        ))}
      </section>

      {/* Main Admin Panel Container */}
      <div className="admin-panel mb-8">
        {/* Navigation Tabs for Categories */}
        <div className="border-b border-[#b6dce4] bg-[#e5f6f8] px-6 pt-5 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubteamFilter("ALL");
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? "border border-[#d8b15c] bg-gradient-to-r from-[#f9ebbd] to-[#efd084] text-[#72551c] shadow-sm"
                        : "border border-[#b6dce4] bg-[#e5f6fa] text-[#376579] hover:bg-[#f0fbfc]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        isSelected ? "bg-[#dfba62] text-[#44310d]" : "bg-[#cbe7ee] text-[#173f52]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubteamFilter("ALL");
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "border border-[#d8b15c] bg-gradient-to-r from-[#f9ebbd] to-[#efd084] text-[#72551c] shadow-sm"
                    : "border border-[#b6dce4] bg-[#e5f6fa] text-[#376579] hover:bg-[#f0fbfc]"
                }`}
              >
                <span>All Members</span>
                <span className="rounded-full bg-[#cbe7ee] px-2 py-0.5 text-[10px] font-mono text-[#173f52]">
                  {members.length}
                </span>
              </button>
            </div>

            {/* Quick Slot Adjustment Controls */}
            {selectedCategory !== "all" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleAdjustSlots("add")}
                  className="admin-gold !px-3.5 !py-2 !text-xs font-bold shadow-sm"
                  title="Add empty slot in this category"
                >
                  <Plus size={15} /> + 1 Slot
                </button>
                <button
                  type="button"
                  disabled={saving || categoryMembers.length === 0}
                  onClick={() => handleAdjustSlots("remove")}
                  className="border border-[#b6dce4] bg-[#e5f6fa] px-3.5 py-2 text-xs font-bold text-[#527e8e] hover:bg-[#f0fbfc] disabled:opacity-50"
                  title="Remove highest sequence slot"
                >
                  <Minus size={15} /> - 1 Slot
                </button>
              </div>
            )}
          </div>

          {/* Sub-teams Filter & Custom Sub-team Bar */}
          <div className="mt-4 pt-3 border-t border-[#b6dce4]/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#527e8e] flex items-center gap-1.5 mr-1 font-mono uppercase tracking-wider">
                <Layers size={14} className="text-[#b17e2e]" /> Sub-Teams:
              </span>

              <button
                type="button"
                onClick={() => setSelectedSubteamFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedSubteamFilter === "ALL"
                    ? "bg-[#0d7892] text-white shadow-sm"
                    : "border border-[#b6dce4] bg-[#e5f6fa] text-[#376579] hover:bg-[#f0fbfc]"
                }`}
              >
                All Sub-Teams
              </button>

              {activeCategorySubteams.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedSubteamFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                    selectedSubteamFilter === st
                      ? "bg-[#0d7892] text-white shadow-sm"
                      : "border border-[#b6dce4] bg-[#e5f6fa] text-[#376579] hover:bg-[#f0fbfc]"
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      selectedSubteamFilter === st ? "bg-[#064e5f] text-white" : "bg-[#cce7ee] text-[#173f52]"
                    }`}
                  >
                    {categoryMembers.filter((m) => (m.subTeam || "General") === st).length}
                  </span>
                </button>
              ))}

              {/* Add Custom Sub-Team Button */}
              <button
                type="button"
                onClick={() => {
                  setNewSubteamName("");
                  setAddSubteamModalOpen(true);
                }}
                className="rounded-lg border border-dashed border-[#0d7892] bg-[#d9f2f6] px-3 py-1.5 text-xs font-bold text-[#0d7892] transition hover:bg-[#c6ecf2] flex items-center gap-1"
              >
                <Plus size={13} /> Add Sub-Team
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-[#648c9b]" />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search member by name, role…"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!py-1.5 !pl-9 !pr-4 !text-xs !w-60"
              />
            </div>
          </div>
        </div>

        {/* Members Roster / Cards Display */}
        <div className="p-6">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#0d7892]" size={36} />
              <p className="text-xs text-[#527e8e]">Loading guild directory…</p>
            </div>
          ) : categoryMembers.length === 0 ? (
            <div className="admin-empty">
              <Users size={36} className="text-[#7eb0c2] mb-3" />
              <p className="font-semibold text-base text-[#173f52]">No member slots found in this view.</p>
              <p className="text-xs text-[#527e8e] mt-1 mb-4">
                {searchQuery
                  ? "Try clearing your search query."
                  : "Click '+ Add Member Slot' or '+ 1 Slot' to add people to this category."}
              </p>
              <button
                type="button"
                onClick={() => handleOpenCreate()}
                className="admin-gold inline-flex items-center gap-1.5 !px-5 !py-2 !text-xs"
              >
                <Plus size={16} /> Add First Member Slot
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* If viewing Faculty: If 2, centered 2 side-by-side as screenshot; If >2, 4-in-a-row */}
              {selectedCategory === "faculty" ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-[#173f52]">
                        Faculty Leadership ({categoryMembers.length})
                      </h3>
                      <p className="text-xs text-[#527e8e]">
                        {categoryMembers.length <= 2
                          ? "Displayed side-by-side centered on the public website."
                          : "Displayed in a responsive 4-in-a-row grid on the public website."}
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      categoryMembers.length <= 2
                        ? "flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4"
                        : "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center"
                    }
                  >
                    {categoryMembers.map((member) => (
                      <AdminMemberCard
                        key={member._id}
                        member={member}
                        isFaculty={true}
                        onEdit={() => handleOpenEdit(member)}
                        onDelete={() => handleDeleteMember(member._id, member.name)}
                        onReCrop={() => {
                          setEditingMember(member);
                          setFormData({ ...member });
                          setRawImageToCrop(member.imageUrl);
                          setCropperOpen(true);
                        }}
                      />
                    ))}

                    {/* Add Slot Card at the end */}
                    <button
                      type="button"
                      onClick={() => handleOpenCreate()}
                      className="group flex w-full max-w-[270px] min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a8d3de] bg-[#eaf7f9]/60 p-6 text-center transition hover:border-[#b17e2e] hover:bg-[#dff2f5]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cbe8ee] text-[#173f52] transition-transform group-hover:scale-110">
                        <Plus size={24} />
                      </div>
                      <span className="mt-3 font-cinzel text-sm font-bold text-[#173f52]">
                        + Add Faculty Slot
                      </span>
                      <span className="text-[11px] text-[#527e8e] mt-1">
                        New faculty incharge card
                      </span>
                    </button>
                  </div>
                </div>
              ) : selectedSubteamFilter === "ALL" && Object.keys(membersBySubteam).length > 1 ? (
                /* Sub-teams grouped sections with 4 in a row */
                Object.entries(membersBySubteam).map(([subteamName, subMembers]) => (
                  <div key={subteamName} className="subteam-admin-section">
                    <div className="mb-4 flex items-center justify-between border-b border-[#b6dce4] pb-2">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-[#b17e2e]" />
                        <h3 className="font-cinzel text-lg font-bold uppercase tracking-wide text-[#173f52]">
                          {subteamName}
                        </h3>
                        <span className="rounded-full bg-[#cce7ee] px-2.5 py-0.5 font-mono text-xs font-bold text-[#173f52]">
                          {subMembers.length} {subMembers.length === 1 ? "member" : "members"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenCreate(subteamName)}
                        className="admin-text-button !text-xs !font-bold flex items-center gap-1"
                      >
                        <Plus size={14} /> Add to {subteamName}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
                      {subMembers.map((member) => (
                        <AdminMemberCard
                          key={member._id}
                          member={member}
                          isFaculty={false}
                          onEdit={() => handleOpenEdit(member)}
                          onDelete={() => handleDeleteMember(member._id, member.name)}
                          onReCrop={() => {
                            setEditingMember(member);
                            setFormData({ ...member });
                            setRawImageToCrop(member.imageUrl);
                            setCropperOpen(true);
                          }}
                        />
                      ))}

                      {/* Add Slot Card for this subteam */}
                      <button
                        type="button"
                        onClick={() => handleOpenCreate(subteamName)}
                        className="group flex w-full max-w-[270px] min-h-[340px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a8d3de] bg-[#eaf7f9]/60 p-6 text-center transition hover:border-[#b17e2e] hover:bg-[#dff2f5]"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cbe8ee] text-[#173f52] transition-transform group-hover:scale-110">
                          <Plus size={24} />
                        </div>
                        <span className="mt-3 font-cinzel text-sm font-bold text-[#173f52]">
                          + Add Slot
                        </span>
                        <span className="text-[11px] text-[#527e8e] mt-1">
                          Add to {subteamName}
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* Flat 4-in-a-row grid */
                <div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
                    {categoryMembers.map((member) => (
                      <AdminMemberCard
                        key={member._id}
                        member={member}
                        isFaculty={false}
                        onEdit={() => handleOpenEdit(member)}
                        onDelete={() => handleDeleteMember(member._id, member.name)}
                        onReCrop={() => {
                          setEditingMember(member);
                          setFormData({ ...member });
                          setRawImageToCrop(member.imageUrl);
                          setCropperOpen(true);
                        }}
                      />
                    ))}

                    {/* Add Slot Card at the end */}
                    <button
                      type="button"
                      onClick={() => handleOpenCreate()}
                      className="group flex w-full max-w-[270px] min-h-[340px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a8d3de] bg-[#eaf7f9]/60 p-6 text-center transition hover:border-[#b17e2e] hover:bg-[#dff2f5]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cbe8ee] text-[#173f52] transition-transform group-hover:scale-110">
                        <Plus size={24} />
                      </div>
                      <span className="mt-3 font-cinzel text-sm font-bold text-[#173f52]">
                        + Add Member Slot
                      </span>
                      <span className="text-[11px] text-[#527e8e] mt-1">
                        New slot in {currentCategoryConfig.prefix}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Member Modal (Matching .admin-dialog style) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062030]/80 p-4 backdrop-blur-md">
          <div className="admin-dialog !w-full !max-w-3xl !max-h-[92vh] overflow-y-auto">
            <header className="border-b border-[#b6dce4] pb-3 mb-5 flex items-center justify-between">
              <div>
                <span className="admin-kicker text-[#b17e2e]">
                  {editingMember ? `Slot #${formData.sequence} · Configuration` : "New Slot Creation"}
                </span>
                <h2 className="text-xl font-bold font-cinzel text-[#173f52]">
                  {editingMember ? `Edit ${formData.name || "Member Details"}` : "Add New Team Member"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-[#527e8e] hover:text-[#173f52] p-1"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSaveDetails} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {/* Left Column: Portrait Photo & Cropping (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <label className="mb-2 block w-full text-xs font-bold text-[#173f52]">
                    Member Portrait Photo
                  </label>

                  <div className="relative flex aspect-square w-full max-w-[210px] items-center justify-center overflow-hidden rounded-2xl border-2 border-[#afd6e1] bg-[#f0fbfc] shadow-inner group">
                    {formData.imageUrl ? (
                      <>
                        <img
                          src={formData.imageUrl}
                          alt={formData.name || "Preview"}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                          <button
                            type="button"
                            onClick={() => {
                              setRawImageToCrop(formData.imageUrl);
                              setCropperOpen(true);
                            }}
                            className="admin-gold !px-3 !py-1.5 !text-xs font-bold flex items-center gap-1 shadow"
                          >
                            <Crop size={14} /> Re-crop
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow hover:bg-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-[#648c9b]">
                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcf1f5] text-[#173f52]">
                          <Upload size={24} className="text-[#0d7892]" />
                        </div>
                        <span className="text-xs font-semibold text-[#173f52]">No Photo Selected</span>
                        <span className="text-[10px] mt-1 text-[#527e8e]">
                          Click upload below to add portrait
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="mt-3 flex w-full max-w-[230px] flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-[#b6dce4] bg-[#e5f6fa] hover:bg-[#f0fbfc] px-3 py-2 text-xs font-bold text-[#173f52] rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Upload size={14} />
                      {formData.imageUrl ? "Replace Photo" : "Upload & Crop Photo"}
                    </button>

                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setRawImageToCrop(formData.imageUrl);
                          setCropperOpen(true);
                        }}
                        className="text-xs text-[#0d7892] hover:underline flex items-center justify-center gap-1 font-semibold"
                      >
                        <Crop size={13} /> Fine-tune Framing & Zoom
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Information & Details (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#173f52]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      placeholder="e.g. Prof. Mukul Shukla or Shreyansh Rathi"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Category & Sub-team Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#173f52]">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-bold text-[#173f52]">Sub-team</label>
                        <button
                          type="button"
                          onClick={() => setIsCustomSubteamInput(!isCustomSubteamInput)}
                          className="text-[10px] text-[#0d7892] font-semibold hover:underline"
                        >
                          {isCustomSubteamInput ? "Select from list" : "+ Custom team"}
                        </button>
                      </div>

                      {isCustomSubteamInput ? (
                        <input
                          type="text"
                          value={formData.subTeam}
                          placeholder="Type custom sub-team name..."
                          onChange={(e) => setFormData({ ...formData, subTeam: e.target.value })}
                          className="!border-[#b17e2e]"
                        />
                      ) : (
                        <select
                          value={formData.subTeam}
                          onChange={(e) => {
                            if (e.target.value === "__NEW_CUSTOM__") {
                              setIsCustomSubteamInput(true);
                              setFormData({ ...formData, subTeam: "" });
                            } else {
                              setFormData({ ...formData, subTeam: e.target.value });
                            }
                          }}
                        >
                          {allAvailableSubteams.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                          <option value="__NEW_CUSTOM__">+ Create Custom Sub-Team...</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Role Description & Sequence */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[#173f52]">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        placeholder="e.g. President, Media Co-lead, Faculty Incharge"
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                      <small className="mt-1 text-[10px] text-[#527e8e]">
                        Appears inside the card badge
                      </small>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#173f52]">
                        Sequence (#)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.sequence}
                        onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Social Profile Links */}
                  <div className="space-y-3 pt-2 border-t border-[#b6dce4]">
                    <div>
                      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#0077B5]">
                        <FaLinkedin size={13} /> LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        placeholder="https://www.linkedin.com/in/username"
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#E4405F]">
                          <FaInstagram size={13} /> Instagram Profile URL
                        </label>
                        <input
                          type="url"
                          value={formData.instagram}
                          placeholder="https://instagram.com/username"
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#EA4335]">
                          <FaEnvelope size={13} /> Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          placeholder="e.g. member@mnnit.ac.in"
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#b6dce4] pt-4">
                {editingMember ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleDeleteMember(editingMember._id, editingMember.name)}
                    className="admin-danger !text-xs font-semibold"
                  >
                    <Trash2 size={14} /> Delete Member Slot
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="border border-[#b6dce4] bg-[#e5f6fa] px-4 py-2 text-xs font-semibold text-[#527e8e] hover:bg-[#f0fbfc]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.name.trim()}
                    className="admin-gold !px-6 !py-2.5 !text-xs font-bold shadow-md"
                  >
                    {saving ? "Saving…" : "Save Member Details"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Sub-Team Modal */}
      {addSubteamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062030]/80 p-4 backdrop-blur-md">
          <div className="admin-dialog !w-full !max-w-md">
            <header className="border-b border-[#b6dce4] pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="admin-kicker text-[#b17e2e]">Sub-Team Customization</span>
                <h2 className="text-lg font-bold font-cinzel text-[#173f52]">
                  Add New Department / Sub-Team
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddSubteamModalOpen(false)}
                className="text-[#527e8e] hover:text-[#173f52] p-1"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleAddNewSubteam} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#173f52]">
                  New Sub-Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSubteamName}
                  placeholder="e.g. Corporate Relations, Sponsorship, Media..."
                  onChange={(e) => setNewSubteamName(e.target.value)}
                />
                <small className="mt-1 text-[11px] text-[#527e8e]">
                  This team will immediately be available for filtering and member assignments.
                </small>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b6dce4]">
                <button
                  type="button"
                  onClick={() => setAddSubteamModalOpen(false)}
                  className="border border-[#b6dce4] bg-[#e5f6fa] px-4 py-2 text-xs font-semibold text-[#527e8e] hover:bg-[#f0fbfc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubteamName.trim()}
                  className="admin-gold !px-5 !py-2 !text-xs font-bold"
                >
                  Create Sub-Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal
          imageSrc={rawImageToCrop}
          targetTitle={formData.name ? `${formData.name} Portrait` : "Member Portrait"}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperOpen(false)}
        />
      )}
    </div>
  );
}

// Visual Admin Card Component
function AdminMemberCard({ member, isFaculty, onEdit, onDelete, onReCrop }) {
  const imageSrc = member.imageUrl || "/placeholder-speaker.svg";

  return (
    <article className="group relative flex w-full max-w-[270px] sm:w-[260px] h-full shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#b6dce4] bg-gradient-to-b from-[#f0fbfc] to-[#e4f5f8] p-4 text-center shadow-[0_8px_20px_rgba(14,74,103,0.08)] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.04] hover:border-[#0d7892] hover:shadow-[0_20px_40px_rgba(14,74,103,0.20)]">
      {/* Top badges: Sequence & Subteam */}
      <div className="mb-2.5 flex items-center justify-between text-[11px]">
        <span className="rounded-md bg-[#d8eff4] border border-[#a8d3de] px-2 py-0.5 font-mono font-bold text-[#173f52]">
          #{member.sequence || 1}
        </span>
        {member.subTeam && (
          <span className="rounded-md bg-[#fff2d6] border border-[#dfc382] px-2 py-0.5 font-semibold text-[#805e19] truncate max-w-[150px]">
            {member.subTeam}
          </span>
        )}
      </div>

      <div>
        {/* Photo Container - Square 1:1 matching Photo 1 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#b6dce4] bg-[#dcf1f5] shadow-inner transition-colors group-hover:border-[#0d7892]">
          <img
            src={imageSrc}
            alt={member.name || "Member"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-speaker.svg";
            }}
          />

          {/* Quick Crop / Edit overlay button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg bg-white/90 p-2 text-xs font-bold text-[#173f52] shadow hover:bg-white"
              title="Edit Details"
            >
              <Edit3 size={15} />
            </button>
            {member.imageUrl && (
              <button
                type="button"
                onClick={onReCrop}
                className="rounded-lg bg-[#b17e2e] p-2 text-xs font-bold text-white shadow hover:brightness-110"
                title="Crop & Center"
              >
                <Crop size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Member Name */}
        <h4 className="mt-3 min-h-[2.4rem] flex items-center justify-center font-cinzel text-base font-bold uppercase leading-snug tracking-wide text-[#173f52] transition-colors group-hover:text-[#0d7892] line-clamp-2">
          {member.name || "Empty Slot"}
        </h4>

        {/* Role Badge */}
        <div className="mt-2 min-h-[32px] flex items-center justify-center rounded-lg border border-[#b6dce4] bg-[#e5f6fa] px-2.5 py-1 text-center font-montserrat text-xs font-bold uppercase tracking-wider text-[#376579] shadow-sm">
          {member.role || (isFaculty ? "Faculty Incharge" : "Member")}
        </div>
      </div>

      {/* Footer: Social Icons & Action Buttons */}
      <div className="mt-4 border-t border-[#b6dce4]/60 pt-3">
        {/* Social Presence icons */}
        <div className="flex items-center justify-center gap-3 text-[#527e8e] mb-3">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              title="LinkedIn Profile"
              className="hover:text-[#0077B5] transition-colors"
            >
              <FaLinkedin size={15} />
            </a>
          ) : (
            <FaLinkedin size={15} className="opacity-25" />
          )}

          {member.instagram ? (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              title="Instagram Profile"
              className="hover:text-[#E4405F] transition-colors"
            >
              <FaInstagram size={15} />
            </a>
          ) : (
            <FaInstagram size={15} className="opacity-25" />
          )}

          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              title="Send Email"
              className="hover:text-[#EA4335] transition-colors"
            >
              <FaEnvelope size={14} />
            </a>
          ) : (
            <FaEnvelope size={14} className="opacity-25" />
          )}
        </div>

        {/* Card Edit and Delete buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-lg border border-[#b6dce4] bg-[#e5f6fa] py-1.5 text-xs font-bold text-[#173f52] transition hover:bg-[#d9f2f6]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
            title="Delete this slot"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
