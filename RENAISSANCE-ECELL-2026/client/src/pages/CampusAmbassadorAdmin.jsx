import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowRight, BadgeCheck, CheckCheck, ClipboardList, Compass, Download, Eye, EyeOff, LayoutGrid, LoaderCircle, LogOut, Menu, Plus, RefreshCw, Search, ShieldCheck, Ticket, Users, X } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import { downloadCsv } from "../lib/admin-csv";
import logo from "../assets/renaissance-logo.png";

const sections = [
  ["overview", "Overview", LayoutGrid], ["ambassadors", "Ambassadors", Users],
  ["tasks", "Tasks & assignments", ClipboardList], ["reviews", "Submission reviews", BadgeCheck],
  ["promos", "Promo & registrations", Ticket],
];
const nice = (value) => String(value || "").toLowerCase().replaceAll("_", " ");
const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
const date = (value) => value ? new Date(value).toLocaleString() : "No deadline";
const localDate = (value) => { if (!value) return ""; const d = new Date(value); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
async function allPages(method, key, query = {}) {
  let page = 1, result = [], data;
  do { data = await method({ ...query, page, limit: 100 }); result = result.concat(data[key]); page += 1; } while (data.pagination.hasNextPage);
  return result;
}
function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="admin-dialog" onCancel={(e) => { e.preventDefault(); onClose(); }} aria-labelledby="admin-dialog-title" data-lenis-prevent>
    <header><h2 id="admin-dialog-title">{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></header>{children}
  </dialog>;
}
function AmbassadorForm({ ambassador, busy, onSave }) {
  const [form, setForm] = useState({ name: ambassador?.name || "", email: ambassador?.email || "", college: ambassador?.college || "", promoCode: ambassador?.promoCode || "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return <form onSubmit={(e) => { e.preventDefault(); onSave(ambassador ? form : { ...form, password }); }} className="admin-form">
    {[["name", "Full name", "text"], ["college", "College / institution", "text"], ["email", "Email", "email"], ["promoCode", "Unique promo code", "text"]].map(([key, label, type]) => <label key={key}>{label}<input type={type} required maxLength={key === "promoCode" ? 32 : key === "email" ? 254 : key === "college" ? 180 : 120} minLength={key === "promoCode" ? 3 : 2} pattern={key === "promoCode" ? "[A-Za-z0-9][A-Za-z0-9-]{2,31}" : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}
    {!ambassador && <>
      <label htmlFor="ambassador-password">Password
        <span className="admin-password">
          <input id="ambassador-password" type={showPassword ? "text" : "password"} required minLength={8} maxLength={128} autoComplete="new-password" aria-describedby="ambassador-password-help" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" aria-label={showPassword ? "Hide ambassador password" : "Show ambassador password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </span>
      </label>
      <small id="ambassador-password-help">Use 8–128 characters. Share this email and password with the ambassador so they can sign in directly.</small>
    </>}
    <button className="admin-gold" disabled={busy}>{busy ? "Saving…" : ambassador ? "Save ambassador" : "Create ambassador"}</button>
  </form>;
}
function TaskForm({ task, ambassadors, busy, onSave }) {
  const [form, setForm] = useState({ title: task?.title || "", description: task?.description || "", dueAt: localDate(task?.dueAt), ambassadorId: task?.ambassadorId || "" });
  const props = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
  return <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave({ ...form, dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null }); }}>
    <label>Task title<input required minLength={3} maxLength={180} {...props("title")} /></label>
    <label>Description<textarea required minLength={3} maxLength={2000} rows={4} {...props("description")} /></label>
    <label>Due date<input type="datetime-local" {...props("dueAt")} /></label>
    {!task && <label>Assign to<select required {...props("ambassadorId")}><option value="">Choose ambassador</option><option value="ALL">All currently active ambassadors</option>{ambassadors.filter((a) => a.status === "ACTIVE").map((a) => <option key={a.id} value={a.id}>{a.name} · {a.college}</option>)}</select></label>}
    <button className="admin-gold" disabled={busy}>{busy ? "Saving…" : task ? "Save task" : "Assign task"}</button>
  </form>;
}

export default function CampusAmbassadorAdmin() {
  const { admin, logout, handleError } = useOutletContext();
  const [tab, setTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("");
  const [registrationOwner, setRegistrationOwner] = useState("");
  const [modal, setModal] = useState(null);
  const [credential, setCredential] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [assignee, setAssignee] = useState("");
  const requestSequence = useRef(0);
  const load = useCallback(async () => {
    const seq = ++requestSequence.current;
    const [summary, ambassadors, tasks, promos, registrations] = await Promise.all([
      adminApi.dashboard(), allPages(adminApi.ambassadors, "ambassadors"), allPages(adminApi.tasks, "tasks"),
      allPages(adminApi.promoCodes, "promoCodes"), allPages(adminApi.referrals, "registrations"),
    ]);
    if (seq === requestSequence.current) setData({ summary, ambassadors, tasks, promos, registrations });
  }, []);
  const report = useCallback((err) => { if (!handleError(err)) setError(err.status ? err.message : "The admin service could not be reached. Please try again."); }, [handleError]);
  useEffect(() => {
    let active = true;
    load().catch((err) => { if (active) report(err); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; requestSequence.current += 1; };
  }, [load, report]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") load().catch(report); };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [load, report]);

  async function mutate(action, success) {
    setBusy(true); setError(""); setNotice("");
    try { await action(); setModal(null); setNotice(success); await load(); }
    catch (err) { report(err); }
    finally { setBusy(false); }
  }
  function navigateSection(next) { setTab(next); setSearch(""); setMobileOpen(false); }
  async function saveAmbassador(form) {
    await mutate(async () => {
      if (modal.ambassador) await adminApi.updateAmbassador(modal.ambassador.id, form);
      else { const result = await adminApi.createAmbassador(form); setCredential(result); }
    }, "Ambassador saved.");
  }
  function saveTask(form) {
    return mutate(async () => {
      if (modal.task) { const { title, description, dueAt } = form; await adminApi.updateTask(modal.task.taskId, { title, description, dueAt }); }
      else await adminApi.createTask(form);
    }, "Task assignment saved.");
  }
  const ambassadors = data?.ambassadors || [];
  const tasks = data?.tasks || [];
  const summary = data?.summary;
  const pending = tasks.filter((t) => t.status === "COMPLETED" && t.reviewStatus !== "APPROVED");
  const owner = (id) => ambassadors.find((a) => a.id === String(id));
  const term = search.trim().toLowerCase();
  const visibleAmbassadors = ambassadors.filter((a) => (!accountFilter || a.status === accountFilter) && [a.name, a.email, a.college, a.promoCode].some((s) => String(s || "").toLowerCase().includes(term)));
  const visibleTasks = (tab === "reviews" ? pending : tasks).filter((t) => (!taskFilter || t.status === taskFilter || tab === "reviews") && [t.title, t.description, owner(t.ambassadorId)?.name].some((s) => String(s || "").toLowerCase().includes(term)));
  const registrations = (data?.registrations || []).filter((r) => (!registrationFilter || r.status === registrationFilter) && (!registrationOwner || String(r.ambassadorId) === registrationOwner) && [r.name, r.email, r.promoCode, r.registrationId].some((s) => String(s || "").toLowerCase().includes(term)));
  function exportAmbassadors() { downloadCsv("renaissance-ambassadors.csv", [["Ambassador ID", "Name", "Email", "College", "Promo code", "Registrations (all statuses)", "Completed tasks", "Account"], ...visibleAmbassadors.map((a) => [a.ambassadorId, a.name, a.email, a.college, a.promoCode, a.registrationCount, a.taskProgress.completed, a.status])]); }
  function exportRegistrations() { downloadCsv("renaissance-registrations.csv", [["Registration ID", "Name", "Email", "Ambassador ID", "Original promo code", "Package", "Status", "Payment", "Created"], ...registrations.map((r) => [r.registrationId, r.name, r.email, owner(r.ambassadorId)?.ambassadorId || r.ambassadorId, r.promoCode, r.packageName, r.status, r.paymentStatus, r.createdAt])]); }
  function roster(rows, compact = false) { return <div className="admin-table-scroll"><table><thead><tr><th>Ambassador</th><th>Promo code</th><th>Registrations</th>{!compact && <th>Task progress</th>}<th>Account</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
    {!rows.length && <tr><td colSpan={compact ? 5 : 6} className="admin-empty">No ambassadors match this view.</td></tr>}
    {rows.map((a) => <tr key={a.id}><td><div className="admin-person"><span className="admin-avatar">{initials(a.name)}</span><div><strong>{a.name}</strong><small>{a.college}</small></div></div></td><td className="admin-code">{a.promoCode || "Not assigned"}</td><td><strong>{a.registrationCount}</strong></td>{!compact && <td><small>{a.taskProgress.completed} / {a.taskProgress.total} complete</small><progress aria-label={`${a.name} task completion`} max={a.taskProgress.total || 1} value={a.taskProgress.completed} /></td>}<td><span className={`admin-status ${a.status === "ACTIVE" ? "" : "muted"}`}>{nice(a.status)}</span></td><td><button className="admin-text-button" aria-label={`Manage ${a.name}`} onClick={() => setModal({ type: "ambassador-details", ambassador: a })}>Manage</button></td></tr>)}
  </tbody></table></div>; }

  return <div className="admin-app">
    <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
      <div className="admin-brand"><img src={logo} alt="Renaissance" /><span className="admin-kicker">Admin command center</span></div>
      <p className="admin-kicker admin-nav-label">The command deck</p>
      <nav aria-label="Admin navigation">{sections.map(([id, label, Icon]) => <button key={id} className={tab === id ? "selected" : ""} aria-current={tab === id ? "page" : undefined} onClick={() => navigateSection(id)}><Icon size={20} /><span>{label}</span>{id === "reviews" && pending.length > 0 && <b>{pending.length}</b>}</button>)}</nav>
      <div className="admin-sidebar-footer"><ShieldCheck /><div><strong>{admin.name}</strong><small>Program administrator</small></div><button aria-label="Sign out" disabled={busy} onClick={async () => { setBusy(true); try { await logout(); } catch (err) { report(err); setBusy(false); } }}><LogOut size={18} /></button></div>
      <p className="admin-kicker admin-credit">E-CELL · MNNIT ALLAHABAD</p>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><button className="admin-mobile-menu" aria-label="Toggle admin navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button><Compass size={20} /><span className="admin-kicker">Command center</span><span aria-hidden="true">›</span><strong>{sections.find(([id]) => id === tab)[1]}</strong></div><div><span className="admin-access"><ShieldCheck size={16} /> Admin access</span><span className="admin-avatar">{initials(admin.name)}</span></div></header>
      <section className="admin-hero"><p className="admin-kicker">Renaissance X · Administration</p><div><h1>Your fleet. <em>One command.</em></h1><div className="admin-actions"><button onClick={() => setModal({ type: "task" })} disabled={loading || !data}><Plus size={19} /> Assign task</button><button className="admin-gold" onClick={() => setModal({ type: "ambassador" })} disabled={loading || !data}><Plus size={19} /> Add ambassador</button></div></div><p>Manage your ambassadors, guide their missions, and follow their impact.</p></section>
      {error && <div className="admin-alert" role="alert">{error}<button onClick={() => mutate(load, "Dashboard refreshed.")}>Retry</button></div>}
      {notice && <div className="admin-notice" role="status">{notice}</div>}
      {credential && <div className="admin-credential" role="status"><strong>New credential · shown once</strong><p>{credential.ambassador.email}</p><code>{credential.temporaryPassword}</code><p>Share this email and password privately with the ambassador.</p><button onClick={() => setCredential(null)}>Dismiss credential</button></div>}
      {loading ? <div className="admin-panel admin-empty" role="status"><LoaderCircle className="animate-spin" /> Loading your command center…</div> : !data ? <div className="admin-panel admin-empty">Dashboard data is unavailable. Use Retry above.</div> : <>
        <section className="admin-stats" aria-label="Program totals">
          {[[Users, "Campus ambassadors", summary.ambassadors.total, `${summary.ambassadors.ACTIVE} active in the crew`], [Ticket, "Total registrations", summary.referrals.total, "Attributed records · all statuses"], [CheckCheck, "Tasks completed", `${summary.tasks.COMPLETED}/${summary.tasks.total}`, `${summary.tasks.ASSIGNED + summary.tasks.IN_PROGRESS} missions still underway`], [BadgeCheck, "Awaiting review", summary.pendingReviews, "Submissions ready for your review"]].map(([Icon, label, value, detail], i) => <article key={label} className={`admin-panel admin-stat ${i === 3 ? "gold" : ""}`}><div><span className="admin-kicker">{label}</span><Icon size={23} /></div><strong>{value}</strong><p>{detail}</p></article>)}
        </section>
        {tab === "overview" && <div className="admin-overview-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">Your campus network</p><h2>Ambassador roster</h2></div><button className="admin-text-button" onClick={() => navigateSection("ambassadors")}>View all <ArrowRight size={17} /></button></div>{roster(ambassadors.slice(0, 6), true)}</section><section className="admin-panel admin-review-queue"><p className="admin-kicker">Requires your attention</p><h2>Ready for review <span>{pending.length}</span></h2>{!pending.length && <p className="admin-empty">All caught up. New submissions will appear here.</p>}{pending.slice(0, 5).map((task) => <button key={task.id} onClick={() => { setFeedback(""); setModal({ type: "review", task }); }}><ClipboardList size={22} /><span><strong>{task.title}</strong><small>{owner(task.ambassadorId)?.name || "Ambassador"}</small></span><ArrowRight size={16} /></button>)}</section></div>}
        {tab === "ambassadors" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">People & access</p><h2>All ambassadors <small>{visibleAmbassadors.length}</small></h2></div><button onClick={exportAmbassadors}><Download size={18} /> Export report</button></div><div className="admin-filters"><label className="admin-search"><Search size={19} /><input aria-label="Search ambassadors" placeholder="Search name, college, email or code…" value={search} onChange={(e) => setSearch(e.target.value)} /></label><select aria-label="Filter accounts" value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}><option value="">All accounts</option><option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option><option value="ARCHIVED">Archived</option></select></div>{roster(visibleAmbassadors)}</section>}
        {(tab === "tasks" || tab === "reviews") && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">Missions & progress</p><h2>{tab === "reviews" ? "Submission reviews" : "Tasks & assignments"}</h2></div></div><div className="admin-filters"><input aria-label="Search tasks" placeholder="Search title or ambassador…" value={search} onChange={(e) => setSearch(e.target.value)} />{tab === "tasks" && <select aria-label="Filter task status" value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="">All statuses</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>}</div><div className="admin-task-list">{!visibleTasks.length && <p className="admin-empty">No tasks match this view.</p>}{visibleTasks.map((task) => <article key={task.id}><div className="admin-task-heading"><div><span className="admin-kicker">{owner(task.ambassadorId)?.name || "Ambassador"}</span><h3>{task.title}</h3></div><span className="admin-status">{nice(task.status)}</span></div><p>{task.description}</p><small>Due: {date(task.dueAt)} · Review: {nice(task.reviewStatus)}</small>{task.remarks && <p><strong>Completion remarks:</strong> {task.remarks}</p>}{task.completionDetails && <p className="admin-evidence"><strong>Submission evidence:</strong> {task.completionDetails}</p>}{task.reviewFeedback && <p><strong>Admin feedback:</strong> {task.reviewFeedback}</p>}<div className="admin-actions"><button disabled={busy} onClick={() => setModal({ type: "task", task })}>Edit task</button>{task.status !== "COMPLETED" && <button disabled={busy} onClick={() => { setAssignee(task.ambassadorId); setModal({ type: "reassign", task }); }}>Reassign</button>}{task.status === "COMPLETED" && task.reviewStatus !== "APPROVED" && <button className="admin-gold" onClick={() => { setFeedback(""); setModal({ type: "review", task }); }}>Review submission</button>}{task.status === "ASSIGNED" && !task.startedAt && !task.remarks && !task.completionDetails && <button className="admin-danger" disabled={busy} onClick={() => setModal({ type: "delete-task", task })}>Delete</button>}</div></article>)}</div></section>}
        {tab === "promos" && <><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">Codes & attribution</p><h2>Ambassador promo codes</h2></div></div><div className="admin-promo-list">{!data.promos.length && <p className="admin-empty">Create an ambassador to assign a promo code.</p>}{data.promos.map((promo) => <article key={promo.id}><div><strong className="admin-code">{promo.code}</strong><small>{owner(promo.ambassadorId)?.name || "Ambassador"} · {promo.isPrimary ? "Primary" : "Additional"}</small></div><span className="admin-status">{promo.isArchived ? "Archived" : promo.isActive ? "Active" : "Disabled"}</span><button disabled={busy || promo.isArchived} onClick={() => { setFeedback(promo.code); setModal({ type: "promo", promo }); }}>Edit code</button><button disabled={busy || promo.isArchived} onClick={() => mutate(() => adminApi.setPromoCodeStatus(promo.id, !promo.isActive), "Promo status updated.")}>{promo.isActive ? "Disable" : "Enable"}</button><button className="admin-danger" disabled={busy} onClick={() => setModal({ type: "confirm", title: promo.isArchived ? "Permanently delete promo code?" : "Archive promo code?", message: promo.isArchived ? `Delete ${promo.code}? This cannot be undone. Codes linked to registrations cannot be deleted.` : `Archive ${promo.code}? It will no longer be usable. Historical registration attribution is preserved.`, action: () => promo.isArchived ? adminApi.hardDeletePromoCode(promo.id) : adminApi.archivePromoCode(promo.id), success: promo.isArchived ? "Promo code permanently deleted." : "Promo code archived." })}>{promo.isArchived ? "Delete permanently" : "Archive"}</button></article>)}</div></section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">Your crew's impact</p><h2>Attributed registrations <small>{registrations.length}</small></h2></div><button onClick={exportRegistrations}><Download size={18} /> Export CSV</button></div><div className="admin-filters"><input aria-label="Search registrations" placeholder="Search participant, code or registration…" value={search} onChange={(e) => setSearch(e.target.value)} /><select aria-label="Filter registrations by ambassador" value={registrationOwner} onChange={(e) => setRegistrationOwner(e.target.value)}><option value="">All ambassadors</option>{ambassadors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select><select aria-label="Filter registration status" value={registrationFilter} onChange={(e) => setRegistrationFilter(e.target.value)}><option value="">All statuses</option><option value="VERIFIED">Verified</option><option value="PENDING_VERIFICATION">Pending verification</option><option value="REJECTED">Rejected</option></select></div><div className="admin-table-scroll"><table><thead><tr><th>Participant</th><th>Ambassador</th><th>Original code</th><th>Package</th><th>Status</th></tr></thead><tbody>{!registrations.length && <tr><td colSpan={5} className="admin-empty">No registrations match this view.</td></tr>}{registrations.map((r) => <tr key={r._id}><td><strong>{r.name}</strong><small>{r.email}</small></td><td>{owner(r.ambassadorId)?.name || "Ambassador"}</td><td className="admin-code">{r.promoCode}</td><td>{r.packageName}</td><td>{nice(r.status)}</td></tr>)}</tbody></table></div></section></>}
        <footer className="admin-data-footer"><span>Live program data · updates every 30 seconds</span><button disabled={busy} onClick={() => mutate(load, "Dashboard refreshed.")}><RefreshCw size={16} /> Refresh</button></footer>
      </>}
    </main>
    {modal && <Modal title={({ ambassador: modal.ambassador ? "Edit ambassador" : "Add ambassador", "ambassador-details": "Ambassador account", task: modal.task ? "Edit task" : "Assign a mission", review: "Review submission", reassign: "Reassign task", "delete-task": "Delete task?", promo: "Edit promo code", confirm: modal.title })[modal.type]} onClose={() => { if (!busy) setModal(null); }}>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {modal.type === "confirm" && <div className="admin-form"><p>{modal.message}</p><button className="admin-danger" disabled={busy} onClick={() => mutate(modal.action, modal.success)}>Confirm</button></div>}
      {modal.type === "ambassador" && <AmbassadorForm ambassador={modal.ambassador} busy={busy} onSave={saveAmbassador} />}
      {modal.type === "task" && <TaskForm task={modal.task} ambassadors={ambassadors} busy={busy} onSave={saveTask} />}
      {modal.type === "ambassador-details" && <div className="admin-form"><h3>{modal.ambassador.name}</h3><p>{modal.ambassador.email} · {modal.ambassador.college}</p><p>{modal.ambassador.registrationCount} registrations · {modal.ambassador.promoCode || "No code"}</p><button disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => setModal({ type: "ambassador", ambassador: modal.ambassador })}>Edit profile & code</button><button disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => mutate(() => adminApi.setAmbassadorStatus(modal.ambassador.id, modal.ambassador.status === "ACTIVE" ? "DISABLED" : "ACTIVE"), "Account status updated.")}>{modal.ambassador.status === "ACTIVE" ? "Disable account and revoke access" : "Enable account"}</button><details><summary>Reset sign-in credential</summary><p>This invalidates existing sessions and replaces the password. The new credential is shown once.</p><button className="admin-danger" disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => mutate(async () => setCredential(await adminApi.resetCredential(modal.ambassador.id)), "Credential reset. Deliver the new credential privately.")}>Confirm credential reset</button></details>
        {modal.ambassador.status !== "ARCHIVED" ? <button className="admin-danger" disabled={busy} onClick={() => { const a = modal.ambassador; setModal({ type: "confirm", title: "Archive ambassador?", message: `Archive ${a.name}? This revokes access and permanently retires the account while preserving referral history.`, action: () => adminApi.archiveAmbassador(a.id), success: "Ambassador archived." }); }}>Archive account</button> : <>
          <p>Archived accounts with registrations must be kept to preserve attribution.</p>
          <button className="admin-danger" disabled={busy || modal.ambassador.registrationCount > 0} onClick={() => { const a = modal.ambassador; setModal({ type: "confirm", title: "Permanently delete ambassador?", message: `Delete ${a.name}, their tasks, promo codes and sessions? This cannot be undone.`, action: () => adminApi.hardDeleteAmbassador(a.id), success: "Ambassador permanently deleted." }); }}>Permanently delete account</button>
        </>}
      </div>}
      {modal.type === "review" && <div className="admin-form"><h3>{modal.task.title}</h3><p><strong>{owner(modal.task.ambassadorId)?.name}</strong></p><p>Remarks: {modal.task.remarks || "None provided"}</p><p className="admin-evidence">Evidence: {modal.task.completionDetails || "None provided"}</p><label>Feedback (required for changes)<textarea rows={4} maxLength={2000} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></label><div className="admin-actions"><button className="admin-gold" disabled={busy} onClick={() => mutate(() => adminApi.reviewTask(modal.task.taskId, { decision: "APPROVED", feedback }), "Submission approved.")}>Approve</button><button disabled={busy || !feedback.trim()} onClick={() => mutate(() => adminApi.reviewTask(modal.task.taskId, { decision: "CHANGES_REQUESTED", feedback }), "Changes requested. Feedback is now visible in the CA portal.")}>Request changes</button></div></div>}
      {modal.type === "reassign" && <form className="admin-form" onSubmit={(e) => { e.preventDefault(); mutate(() => adminApi.assignTask(modal.task.taskId, assignee), "Task reassigned."); }}><p>Reassignment clears the previous ambassador's remarks, evidence and review. The task returns to Assigned.</p><label>New assignee<select required value={assignee} onChange={(e) => setAssignee(e.target.value)}><option value="">Choose an active ambassador</option>{ambassadors.filter((a) => a.status === "ACTIVE").map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label><button className="admin-gold" disabled={busy}>Confirm reassignment</button></form>}
      {modal.type === "delete-task" && <div className="admin-form"><p>Delete “{modal.task.title}”? Only tasks without submitted progress can be deleted.</p><button className="admin-danger" disabled={busy} onClick={() => mutate(() => adminApi.deleteTask(modal.task.taskId), "Task deleted.")}>Confirm delete</button></div>}
      {modal.type === "promo" && <form className="admin-form" onSubmit={(e) => { e.preventDefault(); mutate(() => adminApi.updatePromoCode(modal.promo.id, { code: feedback }), "Promo code updated. Historical registration attribution is preserved."); }}><label>Promo code<input required minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9-]{2,31}" value={feedback} onChange={(e) => setFeedback(e.target.value)} /></label><p>Existing registrations retain their original code and ambassador attribution.</p><button disabled={busy} className="admin-gold">Save code</button></form>}
    </Modal>}
  </div>;
}
