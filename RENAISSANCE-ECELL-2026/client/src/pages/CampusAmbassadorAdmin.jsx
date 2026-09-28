import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import { adminApi, ApiClientError } from "../lib/server1-api";

const tabs = [
  ["ambassadors", "Ambassadors", Users],
  ["promos", "Promo Codes", Tag],
  ["tasks", "Tasks", ClipboardList],
  ["referrals", "Referrals", CheckCircle2],
];

function nice(value) {
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function message(error, fallback) {
  return error instanceof ApiClientError ? error.message : fallback;
}

function ShellCard({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-[#208AA0]/24 bg-[linear-gradient(145deg,rgba(239,252,252,0.96),rgba(194,233,238,0.93))] shadow-[0_20px_55px_rgba(7,61,80,0.18)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

const fieldClass = "h-10 w-full rounded-xl border border-[#208AA0]/25 bg-white/70 px-3 text-xs text-[#173F52] outline-none transition focus:border-[#0D7892] focus:ring-4 focus:ring-[#0D7892]/10";
const textareaClass = "w-full rounded-xl border border-[#208AA0]/25 bg-white/70 p-3 text-xs text-[#173F52] outline-none transition focus:border-[#0D7892] focus:ring-4 focus:ring-[#0D7892]/10";
const primaryButton = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0D7892,#3AB7C8)] px-4 text-xs font-black text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton = "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#208AA0]/25 bg-white/55 px-3 text-xs font-bold text-[#276578] hover:bg-white/80 disabled:opacity-50";

function AdminLogin({ onAuthenticated }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.login(credentials);
      onAuthenticated(data.admin, Boolean(data.mustChangePassword ?? data.admin?.mustChangePassword), credentials.password);
    } catch (requestError) {
      setError(message(requestError, "Could not sign in to the admin portal."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-[112px] text-[#173F52] sm:px-6">
      <ShellCard className="mx-auto max-w-lg p-6 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#208AA0]/30 bg-white/60 text-[#B17E2E]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="mt-4 text-center">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#39788A]">Renaissance command authority</p>
          <h1 className="mt-2 font-cinzel text-2xl font-black uppercase text-[#163E51]">Campus Ambassador Admin</h1>
          <p className="mt-2 text-xs leading-5 text-[#587B87]">Manage ambassadors, promo codes, missions and referral performance.</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#315B6B]">Admin email</span>
            <span className="relative block">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
              <input type="email" value={credentials.email} onChange={(e) => setCredentials((v) => ({ ...v, email: e.target.value }))} autoComplete="email" className={`${fieldClass} pl-10`} required />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#315B6B]">Password</span>
            <span className="relative block">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
              <input type={show ? "text" : "password"} value={credentials.password} onChange={(e) => setCredentials((v) => ({ ...v, password: e.target.value }))} autoComplete="current-password" className={`${fieldClass} pl-10 pr-10`} required />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#587B87] hover:bg-[#0D7892]/10" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className={`${primaryButton} w-full`}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserCog className="h-4 w-4" />} Enter admin portal
          </button>
        </form>
      </ShellCard>
    </main>
  );
}

function AdminPasswordChange({ currentPassword, onChanged, onLogout }) {
  const [form, setForm] = useState({ currentPassword, newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      onChanged(data.admin);
    } catch (requestError) {
      setError(message(requestError, "Could not change the admin password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-[112px] text-[#173F52] sm:px-6">
      <ShellCard className="mx-auto max-w-xl p-6 sm:p-8">
        <KeyRound className="mx-auto h-8 w-8 text-[#B17E2E]" />
        <h1 className="mt-3 text-center font-cinzel text-2xl font-black uppercase text-[#163E51]">Set permanent admin password</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm((v) => ({ ...v, currentPassword: e.target.value }))} className={fieldClass} required />
          <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm((v) => ({ ...v, newPassword: e.target.value }))} className={fieldClass} required />
          <input type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e) => setForm((v) => ({ ...v, confirmPassword: e.target.value }))} className={fieldClass} required />
          {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <button className={`${primaryButton} w-full`} disabled={loading}>{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save password</button>
        </form>
        <button type="button" onClick={onLogout} className="mx-auto mt-5 block text-xs font-semibold text-[#587B87]">Sign out instead</button>
      </ShellCard>
    </main>
  );
}

export default function CampusAmbassadorAdmin() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [temporaryCurrentPassword, setTemporaryCurrentPassword] = useState("");
  const [tab, setTab] = useState("ambassadors");
  const [dashboard, setDashboard] = useState(null);
  const [ambassadors, setAmbassadors] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [ambassadorSearch, setAmbassadorSearch] = useState("");
  const [referralSearch, setReferralSearch] = useState("");
  const [referralStatus, setReferralStatus] = useState("");
  const [referralAmbassadorId, setReferralAmbassadorId] = useState("");
  const [createdCredential, setCreatedCredential] = useState(null);
  const [ambassadorForm, setAmbassadorForm] = useState({ name: "", email: "", phone: "", college: "" });
  const [editingAmbassador, setEditingAmbassador] = useState(null);
  const [promoForm, setPromoForm] = useState({ code: "", ambassadorId: "", discountType: "NONE", discountValue: 0, maxUses: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", ambassadorId: "", dueAt: "" });

  async function loadAdminData() {
    const [dashboardData, ambassadorData, promoData, taskData, referralData] = await Promise.all([
      adminApi.dashboard(),
      adminApi.ambassadors({ page: 1, limit: 100 }),
      adminApi.promoCodes({ page: 1, limit: 100 }),
      adminApi.tasks({ page: 1, limit: 100 }),
      adminApi.referrals({ page: 1, limit: 100 }),
    ]);
    setDashboard(dashboardData);
    setAmbassadors(ambassadorData.ambassadors || []);
    setPromoCodes(promoData.promoCodes || []);
    setTasks(taskData.tasks || []);
    setReferrals(referralData.registrations || []);
  }

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const data = await adminApi.me();
        if (!active) return;
        setAdmin(data.admin);
        const needsChange = Boolean(data.admin?.mustChangePassword);
        setMustChangePassword(needsChange);
        if (!needsChange) await loadAdminData();
      } catch (requestError) {
        if (active && requestError instanceof ApiClientError && requestError.status !== 401) setError(requestError.message);
      } finally {
        if (active) setSessionLoading(false);
      }
    }
    bootstrap();
    return () => { active = false; };
  }, []);

  function authenticated(nextAdmin, changeRequired, password) {
    setAdmin(nextAdmin);
    setMustChangePassword(changeRequired);
    setTemporaryCurrentPassword(password || "");
    setError("");
    if (!changeRequired) loadAdminData().catch((requestError) => setError(message(requestError, "Could not load admin data.")));
  }

  async function logout() {
    try { await adminApi.logout(); } catch { /* local state is still cleared */ }
    setAdmin(null);
    setMustChangePassword(false);
    setDashboard(null);
    setAmbassadors([]);
    setPromoCodes([]);
    setTasks([]);
    setReferrals([]);
    setCreatedCredential(null);
  }

  async function refreshAll() {
    setBusy(true);
    setError("");
    try { await loadAdminData(); } catch (requestError) { setError(message(requestError, "Could not refresh admin data.")); }
    finally { setBusy(false); }
  }

  async function createAmbassador(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const data = await adminApi.createAmbassador({
        ...ambassadorForm,
        phone: ambassadorForm.phone || undefined,
      });
      setCreatedCredential({
        name: data.ambassador.name,
        email: data.ambassador.email,
        ambassadorId: data.ambassador.ambassadorId,
        temporaryPassword: data.temporaryPassword,
      });
      setAmbassadorForm({ name: "", email: "", phone: "", college: "" });
      await loadAdminData();
    } catch (requestError) { setError(message(requestError, "Could not create ambassador.")); }
    finally { setBusy(false); }
  }

  async function saveAmbassador(event) {
    event.preventDefault();
    if (!editingAmbassador) return;
    setBusy(true); setError("");
    try {
      await adminApi.updateAmbassador(editingAmbassador.id, {
        name: editingAmbassador.name,
        email: editingAmbassador.email,
        phone: editingAmbassador.phone || null,
        college: editingAmbassador.college,
      });
      setEditingAmbassador(null);
      setNotice("Ambassador profile updated.");
      await loadAdminData();
    } catch (requestError) { setError(message(requestError, "Could not update ambassador.")); }
    finally { setBusy(false); }
  }

  async function setAmbassadorStatus(id, status) {
    setBusy(true); setError("");
    try { await adminApi.setAmbassadorStatus(id, status); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Could not change ambassador status.")); }
    finally { setBusy(false); }
  }

  async function archiveAmbassador(id) {
    setBusy(true); setError("");
    try { await adminApi.archiveAmbassador(id); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Could not archive ambassador.")); }
    finally { setBusy(false); }
  }

  async function createPromo(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await adminApi.createPromoCode({
        code: promoForm.code,
        ambassadorId: promoForm.ambassadorId,
        discountType: promoForm.discountType,
        discountValue: Number(promoForm.discountValue || 0),
        maxUses: promoForm.maxUses ? Number(promoForm.maxUses) : null,
        isActive: true,
        isPrimary: true,
        validFrom: null,
        validUntil: null,
      });
      setPromoForm({ code: "", ambassadorId: "", discountType: "NONE", discountValue: 0, maxUses: "" });
      await loadAdminData();
    } catch (requestError) { setError(message(requestError, "Could not create promo code.")); }
    finally { setBusy(false); }
  }

  async function togglePromo(promo) {
    setBusy(true); setError("");
    try { await adminApi.setPromoCodeStatus(promo.id, !promo.isActive); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Could not update promo code.")); }
    finally { setBusy(false); }
  }

  async function createTask(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await adminApi.createTask({ ...taskForm, dueAt: taskForm.dueAt ? new Date(taskForm.dueAt).toISOString() : null });
      setTaskForm({ title: "", description: "", ambassadorId: "", dueAt: "" });
      await loadAdminData();
    } catch (requestError) { setError(message(requestError, "Could not create task.")); }
    finally { setBusy(false); }
  }

  async function updateTaskStatus(taskId, status) {
    setBusy(true); setError("");
    try { await adminApi.updateTask(taskId, { status }); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Could not update task.")); }
    finally { setBusy(false); }
  }

  async function reassignTask(taskId, ambassadorId) {
    setBusy(true); setError("");
    try { await adminApi.assignTask(taskId, ambassadorId); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Could not reassign task.")); }
    finally { setBusy(false); }
  }

  async function deleteTask(taskId) {
    setBusy(true); setError("");
    try { await adminApi.deleteTask(taskId); await loadAdminData(); }
    catch (requestError) { setError(message(requestError, "Only untouched assigned tasks can be deleted.")); }
    finally { setBusy(false); }
  }

  async function searchReferrals(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = await adminApi.referrals({ page: 1, limit: 100, search: referralSearch, status: referralStatus, ambassadorId: referralAmbassadorId });
      setReferrals(data.registrations || []);
    } catch (requestError) { setError(message(requestError, "Could not search referrals.")); }
    finally { setBusy(false); }
  }

  if (sessionLoading) {
    return <main className="flex min-h-screen items-center justify-center pt-24"><LoaderCircle className="h-7 w-7 animate-spin text-[#0D7892]" /></main>;
  }
  if (!admin) return <><AdminLogin onAuthenticated={authenticated} /><ContactFooter /></>;
  if (mustChangePassword) {
    return <><AdminPasswordChange currentPassword={temporaryCurrentPassword} onChanged={(nextAdmin) => { setAdmin(nextAdmin); setMustChangePassword(false); setTemporaryCurrentPassword(""); loadAdminData().catch((e) => setError(message(e, "Could not load admin data."))); }} onLogout={logout} /><ContactFooter /></>;
  }

  const activeAmbassadors = ambassadors.filter((item) => item.status === "ACTIVE");
  const visibleAmbassadors = ambassadors.filter((item) => {
    const term = ambassadorSearch.trim().toLowerCase();
    return !term || [item.name, item.email, item.ambassadorId, item.college].some((value) => String(value || "").toLowerCase().includes(term));
  });
  const ambassadorName = (id) => ambassadors.find((item) => item.id === String(id))?.name || "Unknown ambassador";

  return (
    <>
      <main className="min-h-screen px-4 pb-16 pt-[106px] text-[#173F52] sm:px-6">
        <section className="mx-auto w-full max-w-7xl space-y-5">
          <ShellCard className="p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#39788A]">Renaissance X · Admin command</p>
                <h1 className="mt-1 font-cinzel text-3xl font-black text-[#163E51]">Campus Ambassador Operations</h1>
                <p className="mt-1 text-xs text-[#587B87]">Signed in as {admin.name} · {admin.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={refreshAll} disabled={busy} className={secondaryButton}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Refresh</button>
                <button type="button" onClick={logout} className={`${secondaryButton} border-[#B17E2E]/25 text-[#80591F]`}><LogOut className="h-4 w-4" /> Sign out</button>
              </div>
            </div>
          </ShellCard>

          {createdCredential && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/95 p-4 text-sm text-amber-900 shadow-sm">
              <strong>New ambassador credentials, shown once:</strong> {createdCredential.ambassadorId} · {createdCredential.email} · <span className="font-mono font-black">{createdCredential.temporaryPassword}</span>
              <button type="button" className="ml-3 text-xs font-bold underline" onClick={() => setCreatedCredential(null)}>Dismiss</button>
            </div>
          )}
          {notice && <div className="rounded-2xl border border-emerald-300 bg-emerald-50/95 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
          {error && <div className="rounded-2xl border border-red-300 bg-red-50/95 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Users, "Active ambassadors", dashboard?.ambassadors?.ACTIVE ?? 0],
              [ClipboardList, "Open tasks", (dashboard?.tasks?.ASSIGNED ?? 0) + (dashboard?.tasks?.IN_PROGRESS ?? 0)],
              [CheckCircle2, "Verified referrals", dashboard?.referrals?.VERIFIED ?? 0],
              [Tag, "Active promo codes", dashboard?.activePromoCodes ?? 0],
            ].map(([Icon, label, value]) => (
              <ShellCard key={label} className="p-5"><Icon className="h-5 w-5 text-[#0D7892]" /><p className="mt-3 text-3xl font-black text-[#163E51]">{value}</p><p className="mt-1 text-xs font-semibold text-[#587B87]">{label}</p></ShellCard>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl border border-[#208AA0]/20 bg-white/35 p-2 backdrop-blur-md">
            {tabs.map(([value, label, Icon]) => (
              <button key={value} type="button" onClick={() => setTab(value)} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-black transition ${tab === value ? "bg-[#0D7892] text-white shadow-md" : "text-[#315B6B] hover:bg-white/60"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {tab === "ambassadors" && (
            <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
              <ShellCard className="p-5 sm:p-6">
                <h2 className="font-cinzel text-xl font-black text-[#163E51]">Add ambassador</h2>
                <form onSubmit={createAmbassador} className="mt-4 space-y-3">
                  <input className={fieldClass} placeholder="Full name" value={ambassadorForm.name} onChange={(e) => setAmbassadorForm((v) => ({ ...v, name: e.target.value }))} required />
                  <input className={fieldClass} type="email" placeholder="Email" value={ambassadorForm.email} onChange={(e) => setAmbassadorForm((v) => ({ ...v, email: e.target.value }))} required />
                  <input className={fieldClass} placeholder="Phone (optional)" value={ambassadorForm.phone} onChange={(e) => setAmbassadorForm((v) => ({ ...v, phone: e.target.value }))} />
                  <input className={fieldClass} placeholder="College / institution" value={ambassadorForm.college} onChange={(e) => setAmbassadorForm((v) => ({ ...v, college: e.target.value }))} required />
                  <button disabled={busy} className={`${primaryButton} w-full`}><Plus className="h-4 w-4" /> Create ambassador</button>
                </form>
              </ShellCard>

              <ShellCard className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-cinzel text-xl font-black text-[#163E51]">Ambassador directory</h2>
                  <label className="relative block sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#587B87]" /><input className={`${fieldClass} pl-10`} placeholder="Search ambassadors" value={ambassadorSearch} onChange={(e) => setAmbassadorSearch(e.target.value)} /></label>
                </div>
                <div className="mt-4 space-y-3">
                  {visibleAmbassadors.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-[#208AA0]/18 bg-white/48 p-4">
                      {editingAmbassador?.id === item.id ? (
                        <form onSubmit={saveAmbassador} className="grid gap-2 sm:grid-cols-2">
                          <input className={fieldClass} value={editingAmbassador.name} onChange={(e) => setEditingAmbassador((v) => ({ ...v, name: e.target.value }))} />
                          <input className={fieldClass} type="email" value={editingAmbassador.email} onChange={(e) => setEditingAmbassador((v) => ({ ...v, email: e.target.value }))} />
                          <input className={fieldClass} value={editingAmbassador.phone || ""} onChange={(e) => setEditingAmbassador((v) => ({ ...v, phone: e.target.value }))} placeholder="Phone" />
                          <input className={fieldClass} value={editingAmbassador.college} onChange={(e) => setEditingAmbassador((v) => ({ ...v, college: e.target.value }))} />
                          <div className="flex gap-2 sm:col-span-2"><button className={primaryButton}><Save className="h-4 w-4" /> Save</button><button type="button" onClick={() => setEditingAmbassador(null)} className={secondaryButton}>Cancel</button></div>
                        </form>
                      ) : (
                        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                          <div><p className="font-bold text-[#173F52]">{item.name}</p><p className="mt-1 text-xs text-[#587B87]">{item.ambassadorId} · {item.email} · {item.college}</p></div>
                          <div className="flex flex-wrap items-center gap-2">
                            <select value={item.status} disabled={item.status === "ARCHIVED" || busy} onChange={(e) => setAmbassadorStatus(item.id, e.target.value)} className={fieldClass}>
                              <option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option><option value="ARCHIVED">Archived</option>
                            </select>
                            <button type="button" onClick={() => setEditingAmbassador({ ...item })} className={secondaryButton} disabled={item.status === "ARCHIVED"}>Edit</button>
                            <button type="button" onClick={() => archiveAmbassador(item.id)} className={`${secondaryButton} text-red-700`} disabled={item.status === "ARCHIVED"}><Trash2 className="h-3.5 w-3.5" /> Archive</button>
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </ShellCard>
            </div>
          )}

          {tab === "promos" && (
            <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
              <ShellCard className="p-5 sm:p-6">
                <h2 className="font-cinzel text-xl font-black text-[#163E51]">Assign promo code</h2>
                <form onSubmit={createPromo} className="mt-4 space-y-3">
                  <input className={fieldClass} placeholder="Promo code e.g. ADITYA26" value={promoForm.code} onChange={(e) => setPromoForm((v) => ({ ...v, code: e.target.value.toUpperCase() }))} required />
                  <select className={fieldClass} value={promoForm.ambassadorId} onChange={(e) => setPromoForm((v) => ({ ...v, ambassadorId: e.target.value }))} required><option value="">Choose ambassador</option>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.ambassadorId}</option>)}</select>
                  <select className={fieldClass} value={promoForm.discountType} onChange={(e) => setPromoForm((v) => ({ ...v, discountType: e.target.value }))}><option value="NONE">No discount</option><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select>
                  <input className={fieldClass} type="number" min="0" placeholder="Discount value" value={promoForm.discountValue} onChange={(e) => setPromoForm((v) => ({ ...v, discountValue: e.target.value }))} />
                  <input className={fieldClass} type="number" min="1" placeholder="Maximum uses (optional)" value={promoForm.maxUses} onChange={(e) => setPromoForm((v) => ({ ...v, maxUses: e.target.value }))} />
                  <button disabled={busy} className={`${primaryButton} w-full`}><Tag className="h-4 w-4" /> Assign promo</button>
                </form>
              </ShellCard>
              <ShellCard className="p-5 sm:p-6">
                <h2 className="font-cinzel text-xl font-black text-[#163E51]">Promo codes</h2>
                <div className="mt-4 space-y-3">
                  {promoCodes.map((promo) => (
                    <article key={promo.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-[#208AA0]/18 bg-white/48 p-4 sm:flex-row sm:items-center">
                      <div><p className="font-mono text-lg font-black text-[#B17E2E]">{promo.code}</p><p className="text-xs text-[#587B87]">{ambassadorName(promo.ambassadorId)} · {promo.discountType} {promo.discountValue} · {promo.usageCount} uses</p></div>
                      <button type="button" disabled={busy} onClick={() => togglePromo(promo)} className={`${secondaryButton} ${promo.isActive ? "text-emerald-700" : "text-red-700"}`}>{promo.isActive ? "Active · Disable" : "Disabled · Enable"}</button>
                    </article>
                  ))}
                </div>
              </ShellCard>
            </div>
          )}

          {tab === "tasks" && (
            <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
              <ShellCard className="p-5 sm:p-6">
                <h2 className="font-cinzel text-xl font-black text-[#163E51]">Create mission</h2>
                <form onSubmit={createTask} className="mt-4 space-y-3">
                  <input className={fieldClass} placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))} required />
                  <textarea rows="5" className={textareaClass} placeholder="Task description" value={taskForm.description} onChange={(e) => setTaskForm((v) => ({ ...v, description: e.target.value }))} required />
                  <label className="block text-xs">Due date (optional)
                    <input type="datetime-local" className={fieldClass} value={taskForm.dueAt} onChange={(e) => setTaskForm((v) => ({ ...v, dueAt: e.target.value }))} />
                  </label>
                  <select className={fieldClass} value={taskForm.ambassadorId} onChange={(e) => setTaskForm((v) => ({ ...v, ambassadorId: e.target.value }))} required><option value="">Assign ambassador</option>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.ambassadorId}</option>)}</select>
                  <button disabled={busy} className={`${primaryButton} w-full`}><Plus className="h-4 w-4" /> Create task</button>
                </form>
              </ShellCard>
              <ShellCard className="p-5 sm:p-6">
                <h2 className="font-cinzel text-xl font-black text-[#163E51]">Task progress</h2>
                <div className="mt-4 space-y-3">
                  {tasks.map((task) => (
                    <article key={task.taskId} className="rounded-2xl border border-[#208AA0]/18 bg-white/48 p-4">
                      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start"><div><p className="font-mono text-[9px] font-bold text-[#39788A]">{task.taskId}</p><p className="mt-1 font-bold">{task.title}</p><p className="mt-1 text-xs text-[#587B87]">{task.description}</p></div><span className="text-xs font-black text-[#0D7892]">{nice(task.status)}</span></div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <select className={fieldClass} value={task.status} disabled={busy} onChange={(e) => updateTaskStatus(task.taskId, e.target.value)}><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>
                        <select className={fieldClass} value={task.ambassadorId} disabled={busy || task.status === "COMPLETED"} onChange={(e) => reassignTask(task.taskId, e.target.value)}>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                        <button type="button" onClick={() => deleteTask(task.taskId)} disabled={busy || task.status !== "ASSIGNED" || Boolean(task.startedAt || task.completedAt || task.remarks || task.completionDetails)} className={`${secondaryButton} text-red-700`}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                      </div>
                      {task.dueAt && <p className="mt-3 text-xs text-[#587B87]"><strong>Due:</strong> {new Date(task.dueAt).toLocaleString()}</p>}
                      {(task.remarks || task.completionDetails) && <div className="mt-3 rounded-xl bg-white/55 p-3 text-xs text-[#587B87]"><strong>Remarks:</strong> {task.remarks || "—"}<br /><strong>Completion:</strong> {task.completionDetails || "—"}</div>}
                    </article>
                  ))}
                </div>
              </ShellCard>
            </div>
          )}

          {tab === "referrals" && (
            <ShellCard className="p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
                <div><h2 className="font-cinzel text-xl font-black text-[#163E51]">Promo registrations</h2><p className="mt-1 text-xs text-[#587B87]">Track registrations attributed to Campus Ambassador promo codes.</p></div>
                <form onSubmit={searchReferrals} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[220px_190px_180px_auto]"><input className={fieldClass} placeholder="Name / email / registration" value={referralSearch} onChange={(e) => setReferralSearch(e.target.value)} /><select className={fieldClass} value={referralAmbassadorId} onChange={(e) => setReferralAmbassadorId(e.target.value)}><option value="">All ambassadors</option>{ambassadors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select className={fieldClass} value={referralStatus} onChange={(e) => setReferralStatus(e.target.value)}><option value="">All statuses</option><option value="PENDING_VERIFICATION">Pending</option><option value="VERIFIED">Verified</option><option value="REJECTED">Rejected</option></select><button className={secondaryButton}><Search className="h-4 w-4" /> Search</button></form>
              </div>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-[#208AA0]/18 bg-white/45">
                <table className="min-w-[900px] w-full text-left text-xs">
                  <thead className="border-b border-[#208AA0]/15 bg-white/45 text-[10px] uppercase tracking-wider text-[#39788A]"><tr><th className="px-4 py-3">Registration</th><th className="px-4 py-3">Participant</th><th className="px-4 py-3">Package</th><th className="px-4 py-3">Promo</th><th className="px-4 py-3">Ambassador</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th></tr></thead>
                  <tbody>{referrals.length === 0 ? <tr><td colSpan="7" className="px-4 py-8 text-center text-[#587B87]">No matching registrations.</td></tr> : referrals.map((row) => <tr key={row._id || row.registrationId} className="border-b border-[#208AA0]/10 last:border-0"><td className="px-4 py-3 font-mono font-bold">{row.registrationId}</td><td className="px-4 py-3">{row.name}<span className="block text-[10px] text-[#718C95]">{row.email}</span></td><td className="px-4 py-3">{row.packageName || row.packageCode}</td><td className="px-4 py-3 font-mono font-bold text-[#B17E2E]">{row.promoCode || "—"}</td><td className="px-4 py-3">{ambassadorName(row.ambassadorId)}</td><td className="px-4 py-3">{nice(row.paymentStatus)}</td><td className="px-4 py-3 font-bold text-[#0D7892]">{nice(row.status)}</td></tr>)}</tbody>
                </table>
              </div>
            </ShellCard>
          )}
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
