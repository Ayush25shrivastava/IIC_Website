import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, RefreshCw, X } from "lucide-react";
import { createTeamPhotoApi, teamPhotoUrl } from "../lib/server1-api";
import { TEAM_PHOTO_CATEGORIES, STUDENT_TEAMS } from "../data/teamPhotoCategories";
import PhotoCropper from "./PhotoCropper";
import { localAdminMode, legacyTeamPhotos } from "../lib/local-admin";
import { adminStyles } from "../lib/adminStyles";

const photoApi = createTeamPhotoApi(localAdminMode);

function PhotoEditor({ member, busy, onSave, onClose }) {
  const dialog = useRef(null);
  const [form, setForm] = useState({ name: member?.name || "", category: member?.category || "faculty", team: STUDENT_TEAMS.includes(member?.team) ? member.team : "", linkedin: member?.linkedin || "", image_url: member?.uploaded ? "" : member?.image_url || "" });
  const [cropSource, setCropSource] = useState(null);
  const [originalSource, setOriginalSource] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { const element = dialog.current; element.showModal(); return () => element.close(); }, []);
  const field = (key) => ({ value: form[key], onChange: (event) => setForm({ ...form, [key]: event.target.value }) });
  const hasTeam = form.category === "third" || form.category === "second";
  const preview = form.image_url || (member && teamPhotoUrl(member));
  return <dialog ref={dialog} className={adminStyles.dialog} aria-labelledby="team-photo-editor" onCancel={(event) => { event.preventDefault(); if (!busy) { if (cropSource) setCropSource(null); else onClose(); } }} data-lenis-prevent>
    <header className={adminStyles.dialogHeader}><h2 id="team-photo-editor" className={adminStyles.h2}>{cropSource ? "Crop your photo" : member ? "Edit team member" : "Add team member"}</h2><button type="button" aria-label={cropSource ? "Cancel photo crop" : "Close editor"} disabled={busy} onClick={() => cropSource ? setCropSource(null) : onClose()}><X size={20} /></button></header>
    {cropSource ? <PhotoCropper source={cropSource} onCancel={() => setCropSource(null)} onApply={(image_url) => {
      setForm((previous) => ({ ...previous, image_url }));
      setOriginalSource(cropSource); setCropSource(null); setError("");
    }} /> : <form className={adminStyles.form} onSubmit={async (event) => {
      event.preventDefault(); setError("");
      const body = { ...form, position: "", team: hasTeam ? form.team : "" };
      if (member && !body.image_url) delete body.image_url;
      try { await onSave(body); } catch (err) { setError(err.message || "Unable to save this team member."); }
    }}>
      {error && <p className={adminStyles.alert} role="alert">{error}</p>}
      <fieldset disabled={busy} className={adminStyles.photoFields}>
        <label className="grid gap-[7px] font-semibold text-[#173f52]">Name<input required minLength={2} maxLength={120} {...field("name")} className={adminStyles.input} /></label>
        <label className="grid gap-[7px] font-semibold text-[#173f52]">Type<select value={form.category} onChange={(event) => {
          const category = event.target.value;
          setForm({ ...form, category, team: ["third", "second"].includes(category) ? form.team : "" });
        }} className={adminStyles.select}>{TEAM_PHOTO_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        {hasTeam && <label className="grid gap-[7px] font-semibold text-[#173f52]">Team<select required {...field("team")} className={adminStyles.select}><option value="">Select a team</option>{STUDENT_TEAMS.map((team) => <option key={team} value={team}>{team}</option>)}</select></label>}
        <label className="grid gap-[7px] font-semibold text-[#173f52]">LinkedIn profile (optional)<input type="url" maxLength={500} placeholder="https://www.linkedin.com/in/…" {...field("linkedin")} className={adminStyles.input} /></label>
        <label className="grid gap-[7px] font-semibold text-[#173f52]">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" className={adminStyles.input} onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setError("");
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPEG, PNG or WebP photo."); return; }
          if (file.size > 10 * 1024 * 1024) { setError("Choose a photo smaller than 10 MB."); return; }
          setCropSource(file);
        }} /></label>
        <small className={adminStyles.small}>JPEG, PNG or WebP, up to 10 MB. Crop and zoom your photo before saving.</small>
        {!form.image_url.startsWith("data:") && <label className="grid gap-[7px] font-semibold text-[#173f52]">Or use an HTTPS photo URL<input type="url" required={!member} maxLength={2000} placeholder={member?.uploaded ? "Leave blank to keep the current photo" : "https://…"} {...field("image_url")} className={adminStyles.input} /></label>}
        {preview && <img className={adminStyles.photoPreview} src={preview} alt="Team photo preview" />}
        {member?.cloudinaryPublicId && !form.image_url.startsWith("data:") && <button type="button" className={adminStyles.btn} onClick={() => setCropSource(preview)}>Edit crop</button>}
        {form.image_url.startsWith("data:") && <div className={adminStyles.actions}>
          <button type="button" className={adminStyles.btn} onClick={() => setCropSource(originalSource || form.image_url)}>Edit crop</button>
          <button type="button" className={adminStyles.btn} onClick={() => { setForm({ ...form, image_url: "" }); setOriginalSource(null); }}>Clear selected upload</button>
        </div>}
      </fieldset>
      <button className={adminStyles.btnGold} disabled={busy}>{busy ? "Saving…" : "Save team member"}</button>
    </form>}
  </dialog>;
}

export default function TeamPhotoManagement({ handleError }) {
  const [legacyPhotos] = useState(legacyTeamPhotos);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const sequence = useRef(0);
  const load = useCallback(() => {
    const current = ++sequence.current;
    return photoApi.teamPhotos()
      .then((data) => { if (sequence.current === current) { setMembers(data.members); setError(""); } })
      .catch((err) => { if (sequence.current === current && !handleError(err)) setError(err.message || "Unable to load team photos."); })
      .finally(() => { if (sequence.current === current) setLoading(false); });
  }, [handleError]);
  useEffect(() => { load(); return () => { sequence.current += 1; }; }, [load]);
  const refresh = () => { setLoading(true); setError(""); load(); };
  const visible = members.filter((member) => (!category || member.category === category) && `${member.name} ${member.position} ${member.team}`.toLowerCase().includes(search.trim().toLowerCase()));
  const pendingImports = legacyPhotos.filter((photo) => !members.some((member) => member.id === photo.id));
  async function importPhotos() {
    setBusy(true); setError(""); setNotice("");
    let importError;
    try {
      for (const photo of pendingImports) {
        const { name, category, image_url, position = "", team = "", linkedin = "" } = photo;
        await photoApi.importTeamPhoto(photo.id, { name, category, image_url, position, team, linkedin });
      }
      setNotice("Existing photos copied to Cloudinary. Your browser copies are kept as a backup.");
    } catch (err) { if (!handleError(err)) importError = err.message || "Import interrupted. You can safely retry."; }
    finally { await load(); if (importError) setError(importError); setBusy(false); }
  }
  async function save(body) {
    setBusy(true); setNotice("");
    try {
      if (editor.member) await photoApi.updateTeamPhoto(editor.member.id, body);
      else await photoApi.createTeamPhoto(body);
      setEditor(null); setNotice("Team member saved to Cloudinary. The team page will show this update."); await load();
    } catch (err) { handleError(err); throw err; }
    finally { setBusy(false); }
  }
  async function remove(member) {
    if (!window.confirm(`Remove ${member.name} and their photo from the team page?`)) return;
    setBusy(true); setError(""); setNotice("");
    try { await photoApi.deleteTeamPhoto(member.id); setNotice("Team member removed."); await load(); }
    catch (err) { if (!handleError(err)) setError(err.message || "Unable to remove team member."); }
    finally { setBusy(false); }
  }
  return <section className={adminStyles.panel}>
    <p className={adminStyles.notice}>Team photos are saved to Cloudinary and loaded fresh when you open this page.</p>
    <div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Management</p><h2 className={adminStyles.h2}>Team photo management</h2><p className="text-[13px] text-[#527e8e] mt-1">Manage faculty and student photos shown on the team page.</p></div><button className={adminStyles.btnGold} disabled={busy || loading || !!error} onClick={() => setEditor({})}><Plus size={18} /> Add member</button></div>
    {error && <div className={adminStyles.alert} role="alert"><span>{error}</span><button className={adminStyles.btn} onClick={refresh} disabled={busy || loading}>Retry</button></div>}
    {notice && <div className={adminStyles.notice} role="status">{notice}</div>}
    {!loading && !error && pendingImports.length > 0 && <div className={adminStyles.notice + " flex items-center justify-between"}><p className="m-0">{pendingImports.length} existing photos can be copied to Cloudinary.</p><button className={adminStyles.btn} disabled={busy} onClick={importPhotos}>{busy ? "Please wait…" : "Import existing photos"}</button></div>}
    <div className={adminStyles.filters}><input className={adminStyles.input + " flex-1 max-w-[420px]"} aria-label="Search team members" placeholder="Search name, role or team…" value={search} onChange={(event) => setSearch(event.target.value)} /><select className={adminStyles.filterSelect} aria-label="Filter team photo type" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All types</option>{TEAM_PHOTO_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><button className={adminStyles.btn} disabled={busy || loading} onClick={refresh}><RefreshCw size={16} /> Refresh</button></div>
    {loading ? <p className={adminStyles.empty} role="status">Loading team photos…</p> : !error && <>
      {!visible.length && <div className={adminStyles.empty}><ImagePlus size={32} /><p>No team members in this view. Add a member or change the filters.</p></div>}
      <div className={adminStyles.photoGrid}>{visible.map((member) => <article key={member.id} className={adminStyles.photoCard}>
        <img src={teamPhotoUrl(member)} alt={member.name} loading="lazy" />
        <div><span className={adminStyles.kicker}>{TEAM_PHOTO_CATEGORIES.find(([id]) => id === member.category)?.[1]}</span><h3 className={adminStyles.h3}>{member.name}</h3><p className="min-h-[22px] mb-[14px] break-all text-[#527e8e]">{[member.position, member.team].filter(Boolean).join(" · ")}</p><div className={adminStyles.actions}><button className={adminStyles.btn} disabled={busy} onClick={() => setEditor({ member })}>Edit</button><button className={adminStyles.btnDanger} disabled={busy} onClick={() => remove(member)}>Remove</button></div></div>
      </article>)}</div>
    </>}
    {editor && <PhotoEditor member={editor.member} busy={busy} onSave={save} onClose={() => setEditor(null)} />}
  </section>;
}
