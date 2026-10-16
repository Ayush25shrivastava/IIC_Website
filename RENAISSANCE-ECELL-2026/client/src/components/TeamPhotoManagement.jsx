import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, RefreshCw, X } from "lucide-react";
import { adminApi, teamPhotoUrl } from "../lib/server1-api";
import { TEAM_PHOTO_CATEGORIES, STUDENT_TEAMS } from "../data/teamPhotoCategories";
import PhotoCropper from "./PhotoCropper";
import { localAdminMode, localTeamPhotoApi } from "../lib/local-admin";

const photoApi = localAdminMode ? localTeamPhotoApi : adminApi;

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
  return <dialog ref={dialog} className="admin-dialog" aria-labelledby="team-photo-editor" onCancel={(event) => { event.preventDefault(); if (!busy) { if (cropSource) setCropSource(null); else onClose(); } }} data-lenis-prevent>
    <header><h2 id="team-photo-editor">{cropSource ? "Crop your photo" : member ? "Edit team member" : "Add team member"}</h2><button type="button" aria-label={cropSource ? "Cancel photo crop" : "Close editor"} disabled={busy} onClick={() => cropSource ? setCropSource(null) : onClose()}><X size={20} /></button></header>
    {cropSource ? <PhotoCropper source={cropSource} onCancel={() => setCropSource(null)} onApply={(image_url) => {
      setForm((previous) => ({ ...previous, image_url }));
      setOriginalSource(cropSource); setCropSource(null); setError("");
    }} /> : <form className="admin-form" onSubmit={async (event) => {
      event.preventDefault(); setError("");
      const body = { ...form, position: "", team: hasTeam ? form.team : "" };
      if (member && !body.image_url) delete body.image_url;
      try { await onSave(body); } catch (err) { setError(err.message || "Unable to save this team member."); }
    }}>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <fieldset disabled={busy} className="admin-photo-fields">
        <label>Name<input required minLength={2} maxLength={120} {...field("name")} /></label>
        <label>Type<select value={form.category} onChange={(event) => {
          const category = event.target.value;
          setForm({ ...form, category, team: ["third", "second"].includes(category) ? form.team : "" });
        }}>{TEAM_PHOTO_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        {hasTeam && <label>Team<select required {...field("team")}><option value="">Select a team</option>{STUDENT_TEAMS.map((team) => <option key={team} value={team}>{team}</option>)}</select></label>}
        <label>LinkedIn profile (optional)<input type="url" maxLength={500} placeholder="https://www.linkedin.com/in/…" {...field("linkedin")} /></label>
        <label>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setError("");
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPEG, PNG or WebP photo."); return; }
          if (file.size > 10 * 1024 * 1024) { setError("Choose a photo smaller than 10 MB."); return; }
          setCropSource(file);
        }} /></label>
        <small>JPEG, PNG or WebP, up to 10 MB. Crop and zoom your photo before saving.</small>
        {!form.image_url.startsWith("data:") && <label>Or use an HTTPS photo URL<input type="url" required={!member} maxLength={2000} placeholder={member?.uploaded ? "Leave blank to keep the current photo" : "https://…"} {...field("image_url")} /></label>}
        {preview && <img className="admin-photo-preview" src={preview} alt="Team photo preview" />}
        {form.image_url.startsWith("data:") && <div className="admin-actions">
          <button type="button" onClick={() => setCropSource(originalSource || form.image_url)}>Edit crop</button>
          <button type="button" onClick={() => { setForm({ ...form, image_url: "" }); setOriginalSource(null); }}>Clear selected upload</button>
        </div>}
      </fieldset>
      <button className="admin-gold" disabled={busy}>{busy ? "Saving…" : "Save team member"}</button>
    </form>}
  </dialog>;
}

export default function TeamPhotoManagement({ handleError }) {
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
  async function save(body) {
    setBusy(true); setNotice("");
    try {
      if (editor.member) await photoApi.updateTeamPhoto(editor.member.id, body);
      else await photoApi.createTeamPhoto(body);
      setEditor(null); setNotice("Team member saved. The team page will show this update."); await load();
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
  return <section className="admin-panel">
    {localAdminMode && <p className="admin-notice">Local portal · Team photos are saved in this browser and appear on your local team page.</p>}
    <div className="admin-panel-heading"><div><p className="admin-kicker">Management</p><h2>Team photo management</h2><p>Manage faculty and student photos shown on the team page.</p></div><button className="admin-gold" disabled={busy || loading || !!error} onClick={() => setEditor({})}><Plus size={18} /> Add member</button></div>
    {error && <div className="admin-alert" role="alert">{error}<button onClick={refresh} disabled={busy || loading}>Retry</button></div>}
    {notice && <div className="admin-notice" role="status">{notice}</div>}
    <div className="admin-filters"><input aria-label="Search team members" placeholder="Search name, role or team…" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filter team photo type" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All types</option>{TEAM_PHOTO_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><button disabled={busy || loading} onClick={refresh}><RefreshCw size={16} /> Refresh</button></div>
    {loading ? <p className="admin-empty" role="status">Loading team photos…</p> : !error && <>
      {!visible.length && <div className="admin-empty"><ImagePlus size={32} /><p>No team members in this view. Add a member or change the filters.</p></div>}
      <div className="admin-photo-grid">{visible.map((member) => <article key={member.id} className="admin-photo-card">
        <img src={teamPhotoUrl(member)} alt={member.name} loading="lazy" />
        <div><span className="admin-kicker">{TEAM_PHOTO_CATEGORIES.find(([id]) => id === member.category)?.[1]}</span><h3>{member.name}</h3><p>{[member.position, member.team].filter(Boolean).join(" · ")}</p><div className="admin-actions"><button disabled={busy} onClick={() => setEditor({ member })}>Edit</button><button className="admin-danger" disabled={busy} onClick={() => remove(member)}>Remove</button></div></div>
      </article>)}</div>
    </>}
    {editor && <PhotoEditor member={editor.member} busy={busy} onSave={save} onClose={() => setEditor(null)} />}
  </section>;
}
