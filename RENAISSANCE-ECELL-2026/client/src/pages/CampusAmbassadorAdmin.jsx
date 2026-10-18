import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, BadgeCheck, CheckCheck, ClipboardList, Compass, Download, Eye, EyeOff, Globe, Images, LayoutGrid, LoaderCircle, LogOut, Menu, Plus, RefreshCw, Search, ShieldCheck, Ticket, Users, X } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import { downloadCsv } from "../lib/admin-csv";
import { localAdminMode } from "../lib/local-admin";
import { adminStyles } from "../lib/adminStyles";
import TeamPhotoManagement from "../components/TeamPhotoManagement";
import logo from "../assets/renaissance-logo.png";

const sections = [
  ["overview", "Overview", LayoutGrid], ["ambassadors", "Ambassadors", Users],
  ["tasks", "Tasks & assignments", ClipboardList], ["reviews", "Submission reviews", BadgeCheck],
  ["promos", "Promo & registrations", Ticket], ["management", "Management", Images],
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
  return <dialog ref={ref} className={adminStyles.dialog} onCancel={(e) => { e.preventDefault(); onClose(); }} aria-labelledby="admin-dialog-title" data-lenis-prevent>
    <header className={adminStyles.dialogHeader}><h2 id="admin-dialog-title" className={adminStyles.h2}>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></header>{children}
  </dialog>;
}
function AmbassadorForm({ ambassador, busy, onSave }) {
  const [form, setForm] = useState({ name: ambassador?.name || "", email: ambassador?.email || "", college: ambassador?.college || "", promoCode: ambassador?.promoCode || "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return <form onSubmit={(e) => { e.preventDefault(); onSave(ambassador ? form : { ...form, password }); }} className={adminStyles.form}>
    {[["name", "Full name", "text"], ["college", "College / institution", "text"], ["email", "Email", "email"], ["promoCode", "Unique promo code", "text"]].map(([key, label, type]) => <label key={key} className="grid gap-[7px] font-semibold text-[#173f52]">{label}<input type={type} required maxLength={key === "promoCode" ? 32 : key === "email" ? 254 : key === "college" ? 180 : 120} minLength={key === "promoCode" ? 3 : 2} pattern={key === "promoCode" ? "[A-Za-z0-9][A-Za-z0-9-]{2,31}" : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={adminStyles.input} /></label>)}
    {!ambassador && <>
      <label htmlFor="ambassador-password" className="grid gap-[7px] font-semibold text-[#173f52]">Password
        <span className={adminStyles.passwordWrapper}>
          <input id="ambassador-password" type={showPassword ? "text" : "password"} required minLength={8} maxLength={128} autoComplete="new-password" aria-describedby="ambassador-password-help" value={password} onChange={(e) => setPassword(e.target.value)} className={adminStyles.passwordInput} />
          <button type="button" aria-label={showPassword ? "Hide ambassador password" : "Show ambassador password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className={adminStyles.passwordToggle}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </span>
      </label>
      <small id="ambassador-password-help" className={adminStyles.small}>Use 8–128 characters. Share this email and password with the ambassador so they can sign in directly.</small>
    </>}
    <button className={adminStyles.btnGold} disabled={busy}>{busy ? "Saving…" : ambassador ? "Save ambassador" : "Create ambassador"}</button>
  </form>;
}
function TaskForm({ task, ambassadors, busy, onSave }) {
  const [form, setForm] = useState({ title: task?.title || "", description: task?.description || "", dueAt: localDate(task?.dueAt), ambassadorId: task?.ambassadorId || "" });
  const props = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
  return <form className={adminStyles.form} onSubmit={(e) => { e.preventDefault(); onSave({ ...form, dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null }); }}>
    <label className="grid gap-[7px] font-semibold text-[#173f52]">Task title<input required minLength={3} maxLength={180} {...props("title")} className={adminStyles.input} /></label>
    <label className="grid gap-[7px] font-semibold text-[#173f52]">Description<textarea required minLength={3} maxLength={2000} rows={4} {...props("description")} className={adminStyles.textarea} /></label>
    <label className="grid gap-[7px] font-semibold text-[#173f52]">Due date<input type="datetime-local" {...props("dueAt")} className={adminStyles.input} /></label>
    {!task && <label className="grid gap-[7px] font-semibold text-[#173f52]">Assign to<select required {...props("ambassadorId")} className={adminStyles.select}><option value="">Choose ambassador</option><option value="ALL">All currently active ambassadors</option>{ambassadors.filter((a) => a.status === "ACTIVE").map((a) => <option key={a.id} value={a.id}>{a.name} · {a.college}</option>)}</select></label>}
    <button className={adminStyles.btnGold} disabled={busy}>{busy ? "Saving…" : task ? "Save task" : "Assign task"}</button>
  </form>;
}

export default function CampusAmbassadorAdmin() {
  const { admin, logout, handleError } = useOutletContext();
  const [tab, setTab] = useState(localAdminMode ? "management" : "overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!localAdminMode);
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
    if (localAdminMode) return;
    const seq = ++requestSequence.current;
    const [summary, ambassadors, tasks, promos, registrations] = await Promise.all([
      adminApi.dashboard(), allPages(adminApi.ambassadors, "ambassadors"), allPages(adminApi.tasks, "tasks"),
      allPages(adminApi.promoCodes, "promoCodes"), allPages(adminApi.referrals, "registrations"),
    ]);
    if (seq === requestSequence.current) setData({ summary, ambassadors, tasks, promos, registrations });
  }, []);
  const report = useCallback((err) => { if (!handleError(err)) setError(err.status ? err.message : "The admin service could not be reached. Please try again."); }, [handleError]);
  useEffect(() => {
    if (localAdminMode) return;
    let active = true;
    load().catch((err) => { if (active) report(err); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; requestSequence.current += 1; };
  }, [load, report]);
  useEffect(() => {
    if (localAdminMode) return;
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
  function roster(rows, compact = false) {
    return <div className={adminStyles.tableScroll}><table className={adminStyles.table}><thead><tr><th className={adminStyles.th}>Ambassador</th><th className={adminStyles.th}>Promo code</th><th className={adminStyles.th}>Registrations</th>{!compact && <th className={adminStyles.th}>Task progress</th>}<th className={adminStyles.th}>Account</th><th className={adminStyles.th}><span className="sr-only">Actions</span></th></tr></thead><tbody>
      {!rows.length && <tr><td colSpan={compact ? 5 : 6} className={adminStyles.empty}>No ambassadors match this view.</td></tr>}
      {rows.map((a) => <tr key={a.id}><td className={adminStyles.td}><div className={adminStyles.person}><span className={adminStyles.avatar}>{initials(a.name)}</span><div><strong className="text-[13px] text-[#173f52] font-semibold">{a.name}</strong><small className={adminStyles.small}>{a.college}</small></div></div></td><td className={`${adminStyles.td} ${adminStyles.code}`}>{a.promoCode || "Not assigned"}</td><td className={adminStyles.td}><strong className="text-[13px] text-[#173f52] font-semibold">{a.registrationCount}</strong></td>{!compact && <td className={adminStyles.td}><small className={adminStyles.small}>{a.taskProgress.completed} / {a.taskProgress.total} complete</small><progress className={adminStyles.progressBar} aria-label={`${a.name} task completion`} max={a.taskProgress.total || 1} value={a.taskProgress.completed} /></td>}<td className={adminStyles.td}><span className={`${adminStyles.statusBadge} ${a.status === "ACTIVE" ? adminStyles.statusActive : adminStyles.statusMuted}`}>{nice(a.status)}</span></td><td className={adminStyles.td}><button className={adminStyles.btnText} aria-label={`Manage ${a.name}`} onClick={() => setModal({ type: "ambassador-details", ambassador: a })}>Manage</button></td></tr>)}
    </tbody></table></div>;
  }

  return <div className={adminStyles.app}>
    <aside className={`${adminStyles.sidebar} ${mobileOpen ? "max-[900px]:translate-x-0" : "max-[900px]:-translate-x-full"}`}>
      <div className={adminStyles.sidebarBrand}><img src={logo} alt="Renaissance" className={adminStyles.sidebarBrandImg} /><span className={adminStyles.kicker}>Admin command center</span></div>
      <p className={adminStyles.sidebarNavLabel}>The command deck</p>
      <nav aria-label="Admin navigation" className={adminStyles.sidebarNav}>
        {sections.map(([id, label, Icon]) => <button key={id} className={`${adminStyles.sidebarNavItem} ${tab === id ? adminStyles.sidebarNavSelected : ""}`} aria-current={tab === id ? "page" : undefined} onClick={() => navigateSection(id)}><Icon size={20} /><span>{label}</span>{id === "reviews" && pending.length > 0 && <b className={adminStyles.sidebarNavBadge}>{pending.length}</b>}</button>)}
        <Link to="/admin/tickets" className={adminStyles.sidebarNavItem}>
          <Ticket size={20} />
          <span>Ticket management</span>
        </Link>
        <Link to="/" className={adminStyles.sidebarNavItem}>
          <Globe size={20} />
          <span>Return to website</span>
        </Link>
      </nav>
      <div className={adminStyles.sidebarFooter}><ShieldCheck /><div><strong>{admin.name}</strong><small className={adminStyles.small}>Program administrator</small></div><button aria-label={localAdminMode ? "Exit local portal" : "Sign out"} disabled={busy} onClick={async () => { setBusy(true); try { await logout(); } catch (err) { report(err); setBusy(false); } }}><LogOut size={18} /></button></div>
      <p className={adminStyles.sidebarCredit}>E-CELL · MNNIT ALLAHABAD</p>
    </aside>
    <main className={adminStyles.main}>
      <header className={adminStyles.topbar}>
        <div className={adminStyles.topbarGroup}>
          <button className={adminStyles.topbarMobileMenu} aria-label="Toggle admin navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button>
          <Compass size={20} />
          <span className={adminStyles.topbarKicker}>Command center</span>
          <span aria-hidden="true" className="hidden min-[901px]:inline">›</span>
          <strong className="text-[#173f52] font-semibold">{sections.find(([id]) => id === tab)[1]}</strong>
        </div>
        <div className={adminStyles.topbarGroup}>
          <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#b6dce4] bg-[#f4fcfd] text-[#376579] hover:bg-white text-xs font-semibold no-underline transition-colors">
            <Globe size={15} />
            <span>Return to website</span>
          </Link>
          <span className={adminStyles.topbarAccess}><ShieldCheck size={16} /> Admin access</span>
          <span className={adminStyles.avatar}>{initials(admin.name)}</span>
        </div>
      </header>
      <section className={adminStyles.hero}>
        <p className={adminStyles.heroKicker}>Renaissance X · Administration</p>
        <div className={adminStyles.heroContent}>
          <h1 className={adminStyles.h1}>{tab === "management" ? <>Your team. <em className="text-[#f4d789] not-italic">In focus.</em></> : <>Your fleet. <em className="text-[#f4d789] not-italic">One command.</em></>}</h1>
          {tab !== "management" && !localAdminMode && <div className={adminStyles.actions}>
            <button className={adminStyles.btnHero} onClick={() => setModal({ type: "task" })} disabled={loading || !data}><Plus size={19} /> Assign task</button>
            <button className={adminStyles.btnHeroGold} onClick={() => setModal({ type: "ambassador" })} disabled={loading || !data}><Plus size={19} /> Add ambassador</button>
          </div>}
        </div>
        <p className="text-[16px] mt-4 max-[520px]:text-[13px] text-[#e2f4f7]">{tab === "management" ? "Manage faculty and student team photos in one place." : "Manage your ambassadors, guide their missions, and follow their impact."}</p>
      </section>
      {error && <div className={adminStyles.alert} role="alert"><span>{error}</span><button className={adminStyles.btn} onClick={() => mutate(load, "Dashboard refreshed.")}>Retry</button></div>}
      {notice && <div className={adminStyles.notice} role="status">{notice}</div>}
      {credential && <div className={adminStyles.credential} role="status"><strong>New credential · shown once</strong><p className="my-1">{credential.ambassador.email}</p><code className="font-mono text-[18px] bg-[#fdf2cc] p-1 rounded inline-block my-2">{credential.temporaryPassword}</code><p className="my-1">Share this email and password privately with the ambassador.</p><button className={adminStyles.btn + " mt-2"} onClick={() => setCredential(null)}>Dismiss credential</button></div>}
      {tab === "management" ? <TeamPhotoManagement handleError={localAdminMode ? () => false : handleError} /> : localAdminMode ? <section className={`${adminStyles.panelMain} ${adminStyles.empty}`}><h2 className={adminStyles.h2}>Local admin portal</h2><p className="my-3">Team photo management is available without sign-in. Ambassador and ticket operations require the connected admin service.</p><button className={adminStyles.btn} onClick={() => navigateSection("management")}>Manage team photos</button></section> : loading ? <div className={`${adminStyles.panelMain} ${adminStyles.empty}`} role="status"><LoaderCircle className="animate-spin text-[#0d7892]" size={28} /> Loading your command center…</div> : !data ? <div className={`${adminStyles.panelMain} ${adminStyles.empty}`}>Dashboard data is unavailable. Use Retry above.</div> : <>
        <section className={adminStyles.statsGrid} aria-label="Program totals">
          {[[Users, "Campus ambassadors", summary.ambassadors.total, `${summary.ambassadors.ACTIVE} active in the crew`], [Ticket, "Total registrations", summary.referrals.total, "Attributed records · all statuses"], [CheckCheck, "Tasks completed", `${summary.tasks.COMPLETED}/${summary.tasks.total}`, `${summary.tasks.ASSIGNED + summary.tasks.IN_PROGRESS} missions still underway`], [BadgeCheck, "Awaiting review", summary.pendingReviews, "Submissions ready for your review"]].map(([Icon, label, value, detail], i) => <article key={label} className={`${adminStyles.statCard} ${i === 3 ? adminStyles.statCardGold : ""}`}><div className={adminStyles.statHead}><span className={adminStyles.kicker}>{label}</span><Icon size={23} /></div><strong className={adminStyles.statValue}>{value}</strong><p className={adminStyles.statDetail}>{detail}</p></article>)}
        </section>
        {tab === "overview" && <div className={adminStyles.overviewGrid}><section className={adminStyles.panel}><div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Your campus network</p><h2 className={adminStyles.h2}>Ambassador roster</h2></div><button className={adminStyles.btnText} onClick={() => navigateSection("ambassadors")}>View all <ArrowRight size={17} /></button></div>{roster(ambassadors.slice(0, 6), true)}</section><section className={adminStyles.reviewQueue}><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Requires your attention</p><div className="flex justify-between items-center gap-3 mb-[18px]"><h2 className={adminStyles.h2}>Ready for review</h2><span className="font-[var(--font-montserrat)] text-[14px] border border-[#dfbd6b] text-[#987027] rounded-[9px] bg-[#fff1d4] px-[10px] py-[6px] self-center font-semibold">{pending.length}</span></div>{!pending.length && <p className={adminStyles.empty}>All caught up. New submissions will appear here.</p>}{pending.slice(0, 5).map((task) => <button key={task.id} className={adminStyles.reviewQueueItem} onClick={() => { setFeedback(""); setModal({ type: "review", task }); }}><ClipboardList size={22} className="shrink-0 text-[#ab893c]" /><span><strong className="text-[#173f52] font-semibold">{task.title}</strong><small className={adminStyles.small}>{owner(task.ambassadorId)?.name || "Ambassador"}</small></span><ArrowRight size={16} className="ml-auto text-[#376579]" /></button>)}</section></div>}
        {tab === "ambassadors" && <section className={adminStyles.panel}><div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>People & access</p><h2 className={adminStyles.h2}>All ambassadors <small className="inline ml-[10px] font-[var(--font-montserrat)] text-[14px] text-[#527e8e]">{visibleAmbassadors.length}</small></h2></div><button className={adminStyles.btn} onClick={exportAmbassadors}><Download size={18} /> Export report</button></div><div className={adminStyles.filters}><label className={adminStyles.searchWrapper}><Search size={19} /><input className={adminStyles.input} aria-label="Search ambassadors" placeholder="Search name, college, email or code…" value={search} onChange={(e) => setSearch(e.target.value)} /></label><select className={adminStyles.filterSelect} aria-label="Filter accounts" value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}><option value="">All accounts</option><option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option><option value="ARCHIVED">Archived</option></select></div>{roster(visibleAmbassadors)}</section>}
        {(tab === "tasks" || tab === "reviews") && <section className={adminStyles.panel}><div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Missions & progress</p><h2 className={adminStyles.h2}>{tab === "reviews" ? "Submission reviews" : "Tasks & assignments"}</h2></div></div><div className={adminStyles.filters}><input className={adminStyles.input + " flex-1 max-w-[520px] basis-[280px]"} aria-label="Search tasks" placeholder="Search title or ambassador…" value={search} onChange={(e) => setSearch(e.target.value)} />{tab === "tasks" && <select className={adminStyles.filterSelect} aria-label="Filter task status" value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="">All statuses</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>}</div><div className={adminStyles.taskList}>{!visibleTasks.length && <p className={adminStyles.empty}>No tasks match this view.</p>}{visibleTasks.map((task) => <article key={task.id} className="py-[22px] border-t border-[#b1d7e1]"><div className={adminStyles.taskHeading}><div><span className={adminStyles.kicker}>{owner(task.ambassadorId)?.name || "Ambassador"}</span><h3 className={adminStyles.h3}>{task.title}</h3></div><span className={`${adminStyles.statusBadge} ${adminStyles.statusActive}`}>{nice(task.status)}</span></div><p className="whitespace-pre-wrap my-3 text-[#173f52]">{task.description}</p><small className={adminStyles.small}>Due: {date(task.dueAt)} · Review: {nice(task.reviewStatus)}</small>{task.remarks && <p className="my-2"><strong className="text-[#173f52] font-semibold">Completion remarks:</strong> {task.remarks}</p>}{task.completionDetails && <p className={adminStyles.evidence}><strong className="text-[#173f52] font-semibold">Submission evidence:</strong> {task.completionDetails}</p>}{task.reviewFeedback && <p className="my-2"><strong className="text-[#173f52] font-semibold">Admin feedback:</strong> {task.reviewFeedback}</p>}<div className={adminStyles.actions}><button className={adminStyles.btn} disabled={busy} onClick={() => setModal({ type: "task", task })}>Edit task</button>{task.status !== "COMPLETED" && <button className={adminStyles.btn} disabled={busy} onClick={() => { setAssignee(task.ambassadorId); setModal({ type: "reassign", task }); }}>Reassign</button>}{task.status === "COMPLETED" && task.reviewStatus !== "APPROVED" && <button className={adminStyles.btnGold} onClick={() => { setFeedback(""); setModal({ type: "review", task }); }}>Review submission</button>}{task.status === "ASSIGNED" && !task.startedAt && !task.remarks && !task.completionDetails && <button className={adminStyles.btnDanger} disabled={busy} onClick={() => setModal({ type: "delete-task", task })}>Delete</button>}</div></article>)}</div></section>}
        {tab === "promos" && <><section className={adminStyles.panel}><div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Codes & attribution</p><h2 className={adminStyles.h2}>Ambassador promo codes</h2></div></div><div className={adminStyles.promoList}>{!data.promos.length && <p className={adminStyles.empty}>Create an ambassador to assign a promo code.</p>}{data.promos.map((promo) => <article key={promo.id} className="flex items-center flex-wrap gap-[14px] border-t border-[#b5dbe3] py-[18px]"><div className="flex-[1_1_200px]"><strong className={adminStyles.code}>{promo.code}</strong><small className={adminStyles.small}>{owner(promo.ambassadorId)?.name || "Ambassador"} · {promo.isPrimary ? "Primary" : "Additional"}</small></div><span className={`${adminStyles.statusBadge} ${promo.isActive && !promo.isArchived ? adminStyles.statusActive : adminStyles.statusMuted}`}>{promo.isArchived ? "Archived" : promo.isActive ? "Active" : "Disabled"}</span><button className={adminStyles.btn} disabled={busy || promo.isArchived} onClick={() => { setFeedback(promo.code); setModal({ type: "promo", promo }); }}>Edit code</button><button className={adminStyles.btn} disabled={busy || promo.isArchived} onClick={() => mutate(() => adminApi.setPromoCodeStatus(promo.id, !promo.isActive), "Promo status updated.")}>{promo.isActive ? "Disable" : "Enable"}</button><button className={adminStyles.btnDanger} disabled={busy} onClick={() => setModal({ type: "confirm", title: promo.isArchived ? "Permanently delete promo code?" : "Archive promo code?", message: promo.isArchived ? `Delete ${promo.code}? This cannot be undone. Codes linked to registrations cannot be deleted.` : `Archive ${promo.code}? It will no longer be usable. Historical registration attribution is preserved.`, action: () => promo.isArchived ? adminApi.hardDeletePromoCode(promo.id) : adminApi.archivePromoCode(promo.id), success: promo.isArchived ? "Promo code permanently deleted." : "Promo code archived." })}>{promo.isArchived ? "Delete permanently" : "Archive"}</button></article>)}</div></section><section className={adminStyles.panel}><div className={adminStyles.panelHeading}><div><p className={`text-[#527f90] mb-[10px] ${adminStyles.kicker}`}>Your crew's impact</p><h2 className={adminStyles.h2}>Attributed registrations <small className="inline ml-[10px] font-[var(--font-montserrat)] text-[14px] text-[#527e8e]">{registrations.length}</small></h2></div><button className={adminStyles.btn} onClick={exportRegistrations}><Download size={18} /> Export CSV</button></div><div className={adminStyles.filters}><input className={adminStyles.input + " flex-1 max-w-[520px] basis-[280px]"} aria-label="Search registrations" placeholder="Search participant, code or registration…" value={search} onChange={(e) => setSearch(e.target.value)} /><select className={adminStyles.filterSelect} aria-label="Filter registrations by ambassador" value={registrationOwner} onChange={(e) => setRegistrationOwner(e.target.value)}><option value="">All ambassadors</option>{ambassadors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select><select className={adminStyles.filterSelect} aria-label="Filter registration status" value={registrationFilter} onChange={(e) => setRegistrationFilter(e.target.value)}><option value="">All statuses</option><option value="VERIFIED">Verified</option><option value="PENDING_VERIFICATION">Pending verification</option><option value="REJECTED">Rejected</option></select></div><div className={adminStyles.tableScroll}><table className={adminStyles.table}><thead><tr><th className={adminStyles.th}>Participant</th><th className={adminStyles.th}>Ambassador</th><th className={adminStyles.th}>Original code</th><th className={adminStyles.th}>Package</th><th className={adminStyles.th}>Status</th></tr></thead><tbody>{!registrations.length && <tr><td colSpan={5} className={adminStyles.empty}>No registrations match this view.</td></tr>}{registrations.map((r) => <tr key={r._id}><td className={adminStyles.td}><strong className="text-[13px] text-[#173f52] font-semibold">{r.name}</strong><small className={adminStyles.small}>{r.email}</small></td><td className={adminStyles.td}>{owner(r.ambassadorId)?.name || "Ambassador"}</td><td className={`${adminStyles.td} ${adminStyles.code}`}>{r.promoCode}</td><td className={adminStyles.td}>{r.packageName}</td><td className={adminStyles.td}>{nice(r.status)}</td></tr>)}</tbody></table></div></section></>}
        <footer className={adminStyles.dataFooter}><span>Live program data · updates every 30 seconds</span><button className={adminStyles.btn} disabled={busy} onClick={() => mutate(load, "Dashboard refreshed.")}><RefreshCw size={16} /> Refresh</button></footer>
      </>}
    </main>
    {modal && <Modal title={({ ambassador: modal.ambassador ? "Edit ambassador" : "Add ambassador", "ambassador-details": "Ambassador account", task: modal.task ? "Edit task" : "Assign a mission", review: "Review submission", reassign: "Reassign task", "delete-task": "Delete task?", promo: "Edit promo code", confirm: modal.title })[modal.type]} onClose={() => { if (!busy) setModal(null); }}>
      {error && <p className={adminStyles.alert} role="alert">{error}</p>}
      {modal.type === "confirm" && <div className={adminStyles.form}><p className="my-2 text-[#173f52]">{modal.message}</p><button className={adminStyles.btnDanger} disabled={busy} onClick={() => mutate(modal.action, modal.success)}>Confirm</button></div>}
      {modal.type === "ambassador" && <AmbassadorForm ambassador={modal.ambassador} busy={busy} onSave={saveAmbassador} />}
      {modal.type === "task" && <TaskForm task={modal.task} ambassadors={ambassadors} busy={busy} onSave={saveTask} />}
      {modal.type === "ambassador-details" && <div className={adminStyles.form}><h3 className={adminStyles.h3}>{modal.ambassador.name}</h3><p className="my-1 text-[#173f52]">{modal.ambassador.email} · {modal.ambassador.college}</p><p className="my-1 text-[#173f52]">{modal.ambassador.registrationCount} registrations · {modal.ambassador.promoCode || "No code"}</p><button className={adminStyles.btn} disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => setModal({ type: "ambassador", ambassador: modal.ambassador })}>Edit profile & code</button><button className={adminStyles.btn} disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => mutate(() => adminApi.setAmbassadorStatus(modal.ambassador.id, modal.ambassador.status === "ACTIVE" ? "DISABLED" : "ACTIVE"), "Account status updated.")}>{modal.ambassador.status === "ACTIVE" ? "Disable account and revoke access" : "Enable account"}</button><details className="p-[15px] border border-[#b8d6df] rounded-[10px]"><summary className="cursor-pointer font-semibold text-[#173f52]">Reset sign-in credential</summary><p className="my-2 text-[#173f52]">This invalidates existing sessions and replaces the password. The new credential is shown once.</p><button className={adminStyles.btnDanger} disabled={busy || modal.ambassador.status === "ARCHIVED"} onClick={() => mutate(async () => setCredential(await adminApi.resetCredential(modal.ambassador.id)), "Credential reset. Deliver the new credential privately.")}>Confirm credential reset</button></details>
        {modal.ambassador.status !== "ARCHIVED" ? <button className={adminStyles.btnDanger} disabled={busy} onClick={() => { const a = modal.ambassador; setModal({ type: "confirm", title: "Archive ambassador?", message: `Archive ${a.name}? This revokes access and permanently retires the account while preserving referral history.`, action: () => adminApi.archiveAmbassador(a.id), success: "Ambassador archived." }); }}>Archive account</button> : <>
          <p className="my-2 text-[#527e8e]">Archived accounts with registrations must be kept to preserve attribution.</p>
          <button className={adminStyles.btnDanger} disabled={busy || modal.ambassador.registrationCount > 0} onClick={() => { const a = modal.ambassador; setModal({ type: "confirm", title: "Permanently delete ambassador?", message: `Delete ${a.name}, their tasks, promo codes and sessions? This cannot be undone.`, action: () => adminApi.hardDeleteAmbassador(a.id), success: "Ambassador permanently deleted." }); }}>Permanently delete account</button>
        </>}
      </div>}
      {modal.type === "review" && <div className={adminStyles.form}><h3 className={adminStyles.h3}>{modal.task.title}</h3><p className="my-1"><strong className="text-[#173f52] font-semibold">{owner(modal.task.ambassadorId)?.name}</strong></p><p className="my-1 text-[#173f52]">Remarks: {modal.task.remarks || "None provided"}</p><p className={adminStyles.evidence}>Evidence: {modal.task.completionDetails || "None provided"}</p><label className="grid gap-[7px] font-semibold text-[#173f52]">Feedback (required for changes)<textarea rows={4} maxLength={2000} value={feedback} onChange={(e) => setFeedback(e.target.value)} className={adminStyles.textarea} /></label><div className={adminStyles.actions}><button className={adminStyles.btnGold} disabled={busy} onClick={() => mutate(() => adminApi.reviewTask(modal.task.taskId, { decision: "APPROVED", feedback }), "Submission approved.")}>Approve</button><button className={adminStyles.btn} disabled={busy || !feedback.trim()} onClick={() => mutate(() => adminApi.reviewTask(modal.task.taskId, { decision: "CHANGES_REQUESTED", feedback }), "Changes requested. Feedback is now visible in the CA portal.")}>Request changes</button></div></div>}
      {modal.type === "reassign" && <form className={adminStyles.form} onSubmit={(e) => { e.preventDefault(); mutate(() => adminApi.assignTask(modal.task.taskId, assignee), "Task reassigned."); }}><p className="my-2 text-[#173f52]">Reassignment clears the previous ambassador's remarks, evidence and review. The task returns to Assigned.</p><label className="grid gap-[7px] font-semibold text-[#173f52]">New assignee<select required value={assignee} onChange={(e) => setAssignee(e.target.value)} className={adminStyles.select}><option value="">Choose an active ambassador</option>{ambassadors.filter((a) => a.status === "ACTIVE").map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label><button className={adminStyles.btnGold} disabled={busy}>Confirm reassignment</button></form>}
      {modal.type === "delete-task" && <div className={adminStyles.form}><p className="my-2 text-[#173f52]">Delete “{modal.task.title}”? Only tasks without submitted progress can be deleted.</p><button className={adminStyles.btnDanger} disabled={busy} onClick={() => mutate(() => adminApi.deleteTask(modal.task.taskId), "Task deleted.")}>Confirm delete</button></div>}
      {modal.type === "promo" && <form className={adminStyles.form} onSubmit={(e) => { e.preventDefault(); mutate(() => adminApi.updatePromoCode(modal.promo.id, { code: feedback }), "Promo code updated. Historical registration attribution is preserved."); }}><label className="grid gap-[7px] font-semibold text-[#173f52]">Promo code<input required minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9-]{2,31}" value={feedback} onChange={(e) => setFeedback(e.target.value)} className={adminStyles.input} /></label><p className="my-2 text-[#527e8e]">Existing registrations retain their original code and ambassador attribution.</p><button disabled={busy} className={adminStyles.btnGold}>Save code</button></form>}
    </Modal>}
  </div>;
}
