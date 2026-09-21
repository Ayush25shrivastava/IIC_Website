import { useEffect, useState } from "react";
import {
  Anchor,
  Archive,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  UserCog,
  UserPlus,
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
    <div
      className={`relative overflow-hidden rounded-[26px] border border-[#258EA4]/25 bg-[rgba(235,249,251,0.88)] shadow-[0_22px_58px_rgba(7,61,80,0.18),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

const fieldClass = "h-11 w-full rounded-xl border border-[#258EA4]/25 bg-white/72 px-3 text-xs font-medium text-[#173F52] outline-none transition placeholder:text-[#7294A0] hover:border-[#258EA4]/40 focus:border-[#0D7892] focus:bg-white/88 focus:ring-4 focus:ring-[#0D7892]/10";
const textareaClass = "w-full rounded-xl border border-[#258EA4]/25 bg-white/72 p-3 text-xs font-medium text-[#173F52] outline-none transition placeholder:text-[#7294A0] hover:border-[#258EA4]/40 focus:border-[#0D7892] focus:bg-white/88 focus:ring-4 focus:ring-[#0D7892]/10";
const primaryButton = "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#075F75]/20 bg-[#08758D] px-4 text-xs font-black text-white shadow-[0_10px_22px_rgba(8,117,141,0.22)] transition hover:-translate-y-0.5 hover:bg-[#066A80] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50";
const secondaryButton = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#258EA4]/24 bg-white/62 px-3 text-xs font-bold text-[#276578] shadow-sm transition hover:border-[#258EA4]/40 hover:bg-white/82 disabled:cursor-not-allowed disabled:opacity-50";

function statusTone(status) {
  if (status === "ACTIVE" || status === "VERIFIED" || status === "COMPLETED") {
    return "border-emerald-300/70 bg-emerald-100/80 text-emerald-700";
  }
  if (status === "DISABLED" || status === "REJECTED") {
    return "border-rose-300/70 bg-rose-100/80 text-rose-700";
  }
  if (status === "ARCHIVED") {
    return "border-slate-300/70 bg-slate-100/80 text-slate-600";
  }
  if (status === "IN_PROGRESS" || status === "PENDING_VERIFICATION") {
    return "border-amber-300/70 bg-amber-100/80 text-amber-700";
  }
  return "border-sky-300/70 bg-sky-100/80 text-sky-700";
}

function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${statusTone(status)}`}>
      {nice(status)}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <ShellCard className="group min-h-[128px] p-4 sm:p-5">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full border border-[#2393A9]/12" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full border border-[#B98B3C]/12" />
      <div className="relative z-10 flex h-full items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#38A7BA]/20 bg-[#CFF2F6]/85 text-[#0782A0] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#245B6D] sm:text-[10px]">{label}</p>
          <p className="mt-1 text-[30px] font-black leading-none text-[#153D50] sm:text-[34px]">{value}</p>
          <p className="mt-2 text-[10px] leading-4 text-[#64838E]">{detail}</p>
        </div>
        <span className="mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#118FAA]/85 text-white opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </ShellCard>
  );
}

function EmptyState({ icon: Icon, title, detail }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-[#258EA4]/30 bg-white/36 px-5 py-7 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9F3F6] text-[#0D7892]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xs font-black text-[#214F60]">{title}</p>
      <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#6B8892]">{detail}</p>
    </div>
  );
}

function VoyageDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img src="/sticker-compass.png" alt="" className="absolute -left-14 top-[16%] w-56 -rotate-12 opacity-[0.10] grayscale mix-blend-multiply sm:w-72" />
      <img src="/sticker-anchor.png" alt="" className="absolute -right-14 top-[32%] w-52 rotate-12 opacity-[0.08] grayscale mix-blend-multiply sm:w-64" />
      <img src="/sticker-wheel.png" alt="" className="absolute left-[3%] top-[60%] w-44 -rotate-12 opacity-[0.07] grayscale mix-blend-multiply sm:w-56" />
      <img src="/card-decor-stamp.png" alt="" className="absolute right-[5%] top-[72%] w-36 rotate-12 opacity-[0.09] grayscale mix-blend-multiply sm:w-48" />
      <img src="/sticker-ship.png" alt="" className="absolute -left-10 top-[82%] w-56 opacity-[0.075] grayscale mix-blend-multiply sm:w-72" />
    </div>
  );
}

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
    <main className="relative min-h-screen overflow-hidden px-3 pb-7 pt-[94px] text-[#173F52] sm:px-5 lg:px-7">
      <section className="relative z-10 mx-auto grid w-full max-w-[1040px] gap-3.5 lg:grid-cols-[1.03fr_0.97fr]">
        <ShellCard className="relative hidden min-h-[476px] p-6 lg:flex lg:flex-col lg:justify-between lg:p-7">
          <img
            src="/sticker-compass.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-14 w-72 rotate-12 select-none opacity-[0.10] grayscale mix-blend-multiply"
          />
          <img
            src="/pirate-wheel-half.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 w-64 -rotate-12 select-none opacity-[0.09] grayscale mix-blend-multiply"
          />
          <img
            src="/sticker-ship.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 right-5 w-52 select-none opacity-[0.10] grayscale mix-blend-multiply"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.68),transparent_32%),linear-gradient(rgba(23,116,139,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(23,116,139,0.035)_1px,transparent_1px)] [background-size:auto,28px_28px,28px_28px]"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1689A0]/25 bg-white/58 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#176C82] shadow-sm">
              <Compass className="h-3.5 w-3.5" />
              Renaissance X · Command bridge
            </span>

            <p className="mt-5 font-mono text-[8px] font-black uppercase tracking-[0.28em] text-[#4B7B8A]">
              Fleet administration
            </p>
            <h1 className="mt-2 max-w-[500px] font-cinzel text-[32px] font-black uppercase leading-[1.04] tracking-[-0.025em] text-[#153E51]">
              Navigate the
              <span className="block text-[#B17E2E]">ambassador fleet</span>
            </h1>
            <p className="mt-3.5 max-w-[480px] text-[11px] leading-5 text-[#466D7A]">
              A secure command deck for managing campus captains, promo codes,
              missions and referral activity across Renaissance.
            </p>

            <div className="my-4 flex items-center gap-3 text-[#1F8CA2]" aria-hidden="true">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#1F8CA2]/55" />
              <Anchor className="h-4 w-4 text-[#B17E2E]" />
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#1F8CA2]/55" />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                [Users, "Crew roster", "Ambassadors"],
                [Tag, "Signal flags", "Promo codes"],
                [ClipboardList, "Mission log", "Tasks"],
              ].map(([Icon, title, detail]) => (
                <div key={title} className="rounded-2xl border border-[#248EA4]/20 bg-white/48 p-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A98AC]/18 bg-[#D8F3F6]/80 text-[#0A819C]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.08em] text-[#234F60]">{title}</p>
                  <p className="mt-1 text-[9px] text-[#6A8791]">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl border border-[#B98B3C]/20 bg-[#F8F2E5]/55 px-4 py-2.5">
            <span className="flex items-center gap-2 text-[10px] font-semibold text-[#6A552C]">
              <ShieldCheck className="h-4 w-4 text-[#A87527]" />
              Restricted command access
            </span>
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[#7C6A46]">
              Authorized officers only
            </span>
          </div>
        </ShellCard>

        <ShellCard className="relative flex min-h-[476px] flex-col justify-center p-5 sm:p-6 lg:p-7">
          <img
            src="/sticker-compass.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 w-52 select-none opacity-[0.07] grayscale mix-blend-multiply lg:hidden"
          />

          <div className="relative z-10 mx-auto w-full max-w-[430px]">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#208AA0]/30 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.96),rgba(207,241,245,0.92)_72%)] text-[#B17E2E] shadow-[0_10px_26px_rgba(8,96,119,0.14)]">
                <KeyRound className="h-6 w-6" />
              </div>
              <p className="mt-3 font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#39788A]">
                Renaissance command authority
              </p>
              <h2 className="mt-1.5 font-cinzel text-[25px] font-black uppercase leading-tight text-[#163E51]">
                Admin command deck
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#587B87]">
                Authenticate to manage the Campus Ambassador programme.
              </p>
            </div>

            <div className="my-4 flex items-center gap-3 text-[#238FA5]/70" aria-hidden="true">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#B17E2E]/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-[#315B6B]">Admin email</span>
                <span className="relative block">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials((v) => ({ ...v, email: e.target.value }))}
                    autoComplete="email"
                    placeholder="admin@renaissance.com"
                    className={`${fieldClass} h-11 pl-10`}
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-[#315B6B]">Password</span>
                <span className="relative block">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
                  <input
                    type={show ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials((v) => ({ ...v, password: e.target.value }))}
                    autoComplete="current-password"
                    placeholder="Enter secure password"
                    className={`${fieldClass} h-11 pl-10 pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#587B87] transition hover:bg-[#0D7892]/10 hover:text-[#0D7892]"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              {error && (
                <div className="rounded-xl border border-red-300/80 bg-red-50/90 px-3.5 py-3 text-[11px] leading-5 text-red-700 shadow-sm">
                  <span className="font-black">Command link unavailable. </span>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className={`${primaryButton} h-11 w-full text-[11px]`}>
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserCog className="h-4 w-4" />}
                {loading ? "Establishing secure link..." : "Enter admin portal"}
              </button>
            </form>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#258EA4]/18 bg-white/42 px-3 py-2.5 text-[9px] font-semibold text-[#557986]">
                <ShieldCheck className="mb-1 h-3.5 w-3.5 text-[#0D7892]" />
                Protected admin session
              </div>
              <div className="rounded-xl border border-[#B98B3C]/18 bg-[#FBF5E8]/45 px-3 py-2.5 text-[9px] font-semibold text-[#6F6247]">
                <Anchor className="mb-1 h-3.5 w-3.5 text-[#A87527]" />
                Server-backed authority
              </div>
            </div>
          </div>
        </ShellCard>
      </section>
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
  const [taskForm, setTaskForm] = useState({ title: "", description: "", ambassadorId: "" });

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

  async function hardDeleteAmbassador(item) {
    const confirmed = window.confirm(
      `Permanently delete ${item.name}? This removes the account, sessions, tasks and unused promo codes. This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusy(true); setError(""); setNotice("");
    try {
      await adminApi.hardDeleteAmbassador(item.id);
      setNotice(`${item.name} was permanently deleted.`);
      await loadAdminData();
    } catch (requestError) {
      setError(message(requestError, "Could not permanently delete ambassador."));
    } finally {
      setBusy(false);
    }
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

  async function archivePromo(promo) {
    const confirmed = window.confirm(`Archive promo code ${promo.code}? It will be disabled and detached as the primary promo code.`);
    if (!confirmed) return;

    setBusy(true); setError(""); setNotice("");
    try {
      await adminApi.archivePromoCode(promo.id);
      setNotice(`Promo code ${promo.code} was archived.`);
      await loadAdminData();
    } catch (requestError) {
      setError(message(requestError, "Could not archive promo code."));
    } finally {
      setBusy(false);
    }
  }

  async function hardDeletePromo(promo) {
    const confirmed = window.confirm(`Permanently delete promo code ${promo.code}? This cannot be undone.`);
    if (!confirmed) return;

    setBusy(true); setError(""); setNotice("");
    try {
      await adminApi.hardDeletePromoCode(promo.id);
      setNotice(`Promo code ${promo.code} was permanently deleted.`);
      await loadAdminData();
    } catch (requestError) {
      setError(message(requestError, "Could not permanently delete promo code."));
    } finally {
      setBusy(false);
    }
  }

  async function createTask(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await adminApi.createTask(taskForm);
      setTaskForm({ title: "", description: "", ambassadorId: "" });
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
      <main className="relative min-h-screen bg-transparent px-3 pb-16 pt-[106px] text-[#173F52] sm:px-5 lg:px-8">
        <VoyageDecor />
        <section className="relative z-10 mx-auto w-full max-w-[1500px] space-y-4">
          <ShellCard className="min-h-[156px] border-[#B98B3C]/30 p-5 sm:p-7 lg:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute right-[17%] top-1/2 hidden -translate-y-1/2 text-[#168AA2]/[0.08] xl:block">
              <Compass className="h-36 w-36" strokeWidth={0.8} />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B98B3C]/45 to-transparent" />
            <div className="relative z-10 flex min-h-[104px] flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#2D7185] sm:text-[10px]">Renaissance X · Admin command</p>
                <h1 className="mt-2 font-cinzel text-[28px] font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#143E52] sm:text-[34px] lg:text-[40px]">
                  Campus Ambassador Operations
                </h1>
                <p className="mt-2 text-xs font-medium text-[#64818C] sm:text-sm">Signed in as {admin.name} · {admin.role}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button type="button" onClick={refreshAll} disabled={busy} className={`${primaryButton} min-w-[116px]`}>
                  <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button type="button" onClick={logout} className={`${secondaryButton} min-w-[116px] border-[#B98B3C]/28 text-[#315B6B]`}>
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </ShellCard>

          {createdCredential && (
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50/92 px-4 py-3 text-xs text-amber-900 shadow-[0_10px_28px_rgba(126,91,24,0.10)] backdrop-blur-xl sm:text-sm">
              <strong>New ambassador credentials, shown once:</strong> {createdCredential.ambassadorId} · {createdCredential.email} · <span className="font-mono font-black">{createdCredential.temporaryPassword}</span>
              <button type="button" className="ml-3 text-xs font-black underline underline-offset-2" onClick={() => setCreatedCredential(null)}>Dismiss</button>
            </div>
          )}
          {notice && <div className="rounded-2xl border border-emerald-300/80 bg-emerald-50/92 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-xl sm:text-sm">{notice}</div>}
          {error && <div className="rounded-2xl border border-red-300/80 bg-red-50/92 px-4 py-3 text-xs font-semibold text-red-700 shadow-sm backdrop-blur-xl sm:text-sm">{error}</div>}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Active ambassadors" value={dashboard?.ambassadors?.ACTIVE ?? 0} detail="Building tomorrow's leaders" />
            <StatCard icon={ClipboardList} label="Open tasks" value={(dashboard?.tasks?.ASSIGNED ?? 0) + (dashboard?.tasks?.IN_PROGRESS ?? 0)} detail="Actions awaiting completion" />
            <StatCard icon={ShieldCheck} label="Verified referrals" value={dashboard?.referrals?.VERIFIED ?? 0} detail="Trusted voices, bigger impact" />
            <StatCard icon={Tag} label="Active promo codes" value={dashboard?.activePromoCodes ?? 0} detail="Spreading the Renaissance" />
          </div>

          <ShellCard className="rounded-[22px] p-2 sm:p-2.5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-1">
                  {tabs.map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTab(value)}
                      className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-black transition sm:px-5 ${tab === value ? "bg-[#08758D] text-white shadow-[0_8px_20px_rgba(8,117,141,0.22)]" : "text-[#2D6273] hover:bg-white/62"}`}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-2 pr-3 xl:flex">
                <Compass className="h-4 w-4 text-[#B98B3C]" />
                <span className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#66838D]">Chart people · Build impact · Sail together</span>
                <Anchor className="h-5 w-5 text-[#9C7131]" />
              </div>
            </div>
          </ShellCard>

          {tab === "ambassadors" && (
            <>
              <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <ShellCard className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><Anchor className="h-5 w-5" /></span>
                    <div>
                      <h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Add ambassador</h2>
                      <p className="mt-1 text-[10px] font-medium text-[#68858F]">Bring new changemakers on board</p>
                    </div>
                  </div>
                  <form onSubmit={createAmbassador} className="mt-5 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-[#456E7C]">Full name</span>
                      <span className="relative block"><UserPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4F8190]" /><input className={`${fieldClass} pl-10`} placeholder="Full name" value={ambassadorForm.name} onChange={(e) => setAmbassadorForm((v) => ({ ...v, name: e.target.value }))} required /></span>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-[#456E7C]">Phone</span>
                      <span className="relative block"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4F8190]" /><input className={`${fieldClass} pl-10`} placeholder="Phone (optional)" value={ambassadorForm.phone} onChange={(e) => setAmbassadorForm((v) => ({ ...v, phone: e.target.value }))} /></span>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-[#456E7C]">Email address</span>
                      <span className="relative block"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4F8190]" /><input className={`${fieldClass} pl-10`} type="email" placeholder="you@college.edu" value={ambassadorForm.email} onChange={(e) => setAmbassadorForm((v) => ({ ...v, email: e.target.value }))} required /></span>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-[#456E7C]">College / institution</span>
                      <span className="relative block"><Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4F8190]" /><input className={`${fieldClass} pl-10`} placeholder="College / institution" value={ambassadorForm.college} onChange={(e) => setAmbassadorForm((v) => ({ ...v, college: e.target.value }))} required /></span>
                    </label>
                    <button disabled={busy} className={`${primaryButton} mt-1 w-full sm:col-span-2`}><Anchor className="h-4 w-4" /> Add ambassador</button>
                  </form>
                </ShellCard>

                <ShellCard className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><Users className="h-5 w-5" /></span>
                      <div>
                        <h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Ambassador directory</h2>
                        <p className="mt-1 text-[10px] font-medium text-[#68858F]">Manage and view all campus ambassadors</p>
                      </div>
                    </div>
                    <label className="relative block sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#587B87]" /><input className={`${fieldClass} pl-10`} placeholder="Search ambassadors..." value={ambassadorSearch} onChange={(e) => setAmbassadorSearch(e.target.value)} /></label>
                  </div>

                  {editingAmbassador && (
                    <form onSubmit={saveAmbassador} className="mt-4 grid gap-2 rounded-2xl border border-[#258EA4]/20 bg-white/48 p-3 sm:grid-cols-2">
                      <input className={fieldClass} value={editingAmbassador.name} onChange={(e) => setEditingAmbassador((v) => ({ ...v, name: e.target.value }))} />
                      <input className={fieldClass} type="email" value={editingAmbassador.email} onChange={(e) => setEditingAmbassador((v) => ({ ...v, email: e.target.value }))} />
                      <input className={fieldClass} value={editingAmbassador.phone || ""} onChange={(e) => setEditingAmbassador((v) => ({ ...v, phone: e.target.value }))} placeholder="Phone" />
                      <input className={fieldClass} value={editingAmbassador.college} onChange={(e) => setEditingAmbassador((v) => ({ ...v, college: e.target.value }))} />
                      <div className="flex gap-2 sm:col-span-2"><button className={primaryButton}><Save className="h-4 w-4" /> Save changes</button><button type="button" onClick={() => setEditingAmbassador(null)} className={secondaryButton}>Cancel</button></div>
                    </form>
                  )}

                  <div className="mt-4 overflow-x-auto rounded-2xl border border-[#258EA4]/16 bg-white/44">
                    <table className="w-full min-w-[760px] text-left text-[11px]">
                      <thead className="border-b border-[#258EA4]/14 bg-[#D9F2F5]/55 text-[9px] font-black uppercase tracking-[0.1em] text-[#32697A]">
                        <tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">College</th><th className="px-3 py-3">Ambassador ID</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Actions</th></tr>
                      </thead>
                      <tbody>
                        {visibleAmbassadors.length === 0 ? (
                          <tr><td colSpan="6" className="px-4 py-8 text-center text-[#6C8993]">No ambassadors onboard yet.</td></tr>
                        ) : visibleAmbassadors.map((item) => (
                          <tr key={item.id} className="border-b border-[#258EA4]/10 last:border-0 hover:bg-white/35">
                            <td className="px-3 py-3 font-black text-[#214B5B]">{item.name}</td>
                            <td className="px-3 py-3 text-[#557783]">{item.email}</td>
                            <td className="px-3 py-3 text-[#557783]">{item.college}</td>
                            <td className="px-3 py-3 font-mono text-[10px] font-bold text-[#3A7080]">{item.ambassadorId}</td>
                            <td className="px-3 py-3"><StatusPill status={item.status} /></td>
                            <td className="px-3 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <select value={item.status} disabled={item.status === "ARCHIVED" || busy} onChange={(e) => setAmbassadorStatus(item.id, e.target.value)} className="h-8 rounded-lg border border-[#258EA4]/20 bg-white/70 px-2 text-[10px] font-bold text-[#315B6B] outline-none">
                                  <option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option><option value="ARCHIVED">Archived</option>
                                </select>
                                <button type="button" onClick={() => setEditingAmbassador({ ...item })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#258EA4]/20 bg-white/65 text-[#237083] transition hover:bg-white" disabled={item.status === "ARCHIVED"} aria-label={`Edit ${item.name}`}><Pencil className="h-3.5 w-3.5" /></button>
                                <button type="button" onClick={() => archiveAmbassador(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50/80 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-35" disabled={item.status === "ARCHIVED" || busy} title="Soft archive" aria-label={`Archive ${item.name}`}><Archive className="h-3.5 w-3.5" /></button>
                                <button type="button" onClick={() => hardDeleteAmbassador(item)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-300 bg-rose-50/85 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-35" disabled={item.status !== "ARCHIVED" || busy} title={item.status === "ARCHIVED" ? "Permanently delete" : "Archive before permanent delete"} aria-label={`Permanently delete ${item.name}`}><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ShellCard>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["promos", Tag, "Promo code management", "Create and manage promotional codes"],
                  ["tasks", ClipboardList, "Task management", "Assign and track ambassador tasks"],
                  ["referrals", CheckCircle2, "Referral tracking", "Monitor referrals and conversions"],
                ].map(([target, Icon, title, detail]) => (
                  <button key={target} type="button" onClick={() => setTab(target)} className="group flex min-h-[92px] items-center gap-3 rounded-[22px] border border-[#258EA4]/22 bg-[rgba(235,249,251,0.86)] p-4 text-left shadow-[0_14px_34px_rgba(7,61,80,0.14)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[rgba(242,252,253,0.94)]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D0F0F4] text-[#0782A0]"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-cinzel text-sm font-black uppercase text-[#173F52]">{title}</span><span className="mt-1 block text-[10px] text-[#68858F]">{detail}</span></span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#258EA4]/20 bg-white/60 text-[#18778C] transition group-hover:translate-x-0.5"><ChevronRight className="h-4 w-4" /></span>
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "promos" && (
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <ShellCard className="p-5 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><Tag className="h-5 w-5" /></span><div><h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Create promo code</h2><p className="mt-1 text-[10px] text-[#68858F]">Assign a tracked code to an active ambassador</p></div></div>
                <form onSubmit={createPromo} className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#456E7C]">Promo code</span><span className="relative block"><Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4F8190]" /><input className={`${fieldClass} pl-10 font-mono uppercase`} placeholder="ADITYA26" value={promoForm.code} onChange={(e) => setPromoForm((v) => ({ ...v, code: e.target.value.toUpperCase() }))} required /></span></label>
                  <select className={`${fieldClass} sm:col-span-2`} value={promoForm.ambassadorId} onChange={(e) => setPromoForm((v) => ({ ...v, ambassadorId: e.target.value }))} required><option value="">Choose ambassador</option>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.ambassadorId}</option>)}</select>
                  <select className={fieldClass} value={promoForm.discountType} onChange={(e) => setPromoForm((v) => ({ ...v, discountType: e.target.value }))}><option value="NONE">No discount</option><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select>
                  <input className={fieldClass} type="number" min="0" placeholder="Discount value" value={promoForm.discountValue} onChange={(e) => setPromoForm((v) => ({ ...v, discountValue: e.target.value }))} />
                  <input className={`${fieldClass} sm:col-span-2`} type="number" min="1" placeholder="Maximum uses (optional)" value={promoForm.maxUses} onChange={(e) => setPromoForm((v) => ({ ...v, maxUses: e.target.value }))} />
                  <button disabled={busy} className={`${primaryButton} w-full sm:col-span-2`}><Tag className="h-4 w-4" /> Assign promo</button>
                </form>
              </ShellCard>

              <ShellCard className="p-5 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><Tag className="h-5 w-5" /></span><div><h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Promo code directory</h2><p className="mt-1 text-[10px] text-[#68858F]">Usage, discounts and activation controls</p></div></div>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-[#258EA4]/16 bg-white/44">
                  <table className="w-full min-w-[720px] text-left text-[11px]">
                    <thead className="border-b border-[#258EA4]/14 bg-[#D9F2F5]/55 text-[9px] font-black uppercase tracking-[0.1em] text-[#32697A]"><tr><th className="px-3 py-3">Code</th><th className="px-3 py-3">Ambassador</th><th className="px-3 py-3">Discount</th><th className="px-3 py-3">Usage</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
                    <tbody>{promoCodes.length === 0 ? <tr><td colSpan="6" className="px-4 py-8 text-center text-[#6C8993]">No active promo codes yet.</td></tr> : promoCodes.map((promo) => (
                      <tr key={promo.id} className="border-b border-[#258EA4]/10 last:border-0 hover:bg-white/35"><td className="px-3 py-3 font-mono font-black text-[#A9752B]">{promo.code}</td><td className="px-3 py-3 font-semibold text-[#315B6B]">{ambassadorName(promo.ambassadorId)}</td><td className="px-3 py-3 text-[#557783]">{nice(promo.discountType)} · {promo.discountValue}</td><td className="px-3 py-3 text-[#557783]">{promo.usageCount} / {promo.maxUses ?? "∞"}</td><td className="px-3 py-3"><StatusPill status={promo.isArchived ? "ARCHIVED" : promo.isActive ? "ACTIVE" : "DISABLED"} /></td><td className="px-3 py-3"><div className="flex items-center justify-end gap-1.5"><button type="button" disabled={busy || promo.isArchived} onClick={() => togglePromo(promo)} className="h-8 rounded-lg border border-[#258EA4]/20 bg-white/70 px-2.5 text-[10px] font-black text-[#315B6B] disabled:opacity-35">{promo.isActive ? "Disable" : "Enable"}</button><button type="button" disabled={busy || promo.isArchived} onClick={() => archivePromo(promo)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50/80 text-amber-700 disabled:opacity-35" title="Soft archive" aria-label={`Archive ${promo.code}`}><Archive className="h-3.5 w-3.5" /></button><button type="button" disabled={busy || !promo.isArchived} onClick={() => hardDeletePromo(promo)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-300 bg-rose-50/85 text-rose-700 disabled:opacity-35" title={promo.isArchived ? "Permanently delete" : "Archive before permanent delete"} aria-label={`Permanently delete ${promo.code}`}><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </ShellCard>
            </div>
          )}

          {tab === "tasks" && (
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <ShellCard className="p-5 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><ClipboardList className="h-5 w-5" /></span><div><h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Create / assign task</h2><p className="mt-1 text-[10px] text-[#68858F]">Launch a new ambassador mission</p></div></div>
                <form onSubmit={createTask} className="mt-5 space-y-3">
                  <input className={fieldClass} placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))} required />
                  <textarea rows="5" className={textareaClass} placeholder="Task description" value={taskForm.description} onChange={(e) => setTaskForm((v) => ({ ...v, description: e.target.value }))} required />
                  <select className={fieldClass} value={taskForm.ambassadorId} onChange={(e) => setTaskForm((v) => ({ ...v, ambassadorId: e.target.value }))} required><option value="">Assign ambassador</option>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.ambassadorId}</option>)}</select>
                  <button disabled={busy} className={`${primaryButton} w-full`}><Plus className="h-4 w-4" /> Create task</button>
                </form>
              </ShellCard>

              <ShellCard className="p-5 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><ClipboardList className="h-5 w-5" /></span><div><h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Task management</h2><p className="mt-1 text-[10px] text-[#68858F]">Assign, track and review ambassador progress</p></div></div>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-[#258EA4]/16 bg-white/44">
                  <table className="w-full min-w-[820px] text-left text-[11px]">
                    <thead className="border-b border-[#258EA4]/14 bg-[#D9F2F5]/55 text-[9px] font-black uppercase tracking-[0.1em] text-[#32697A]"><tr><th className="px-3 py-3">Task</th><th className="px-3 py-3">Ambassador</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Assigned</th><th className="px-3 py-3 text-right">Actions</th></tr></thead>
                    <tbody>{tasks.length === 0 ? <tr><td colSpan="5" className="px-4 py-8 text-center text-[#6C8993]">No missions assigned yet.</td></tr> : tasks.map((task) => (
                      <tr key={task.taskId} className="border-b border-[#258EA4]/10 last:border-0 align-top hover:bg-white/35">
                        <td className="px-3 py-3"><p className="font-black text-[#214B5B]">{task.title}</p><p className="mt-1 font-mono text-[9px] text-[#56808E]">{task.taskId}</p>{(task.remarks || task.completionDetails) && <p className="mt-1 max-w-xs text-[9px] leading-4 text-[#78919A]">{task.remarks || task.completionDetails}</p>}</td>
                        <td className="px-3 py-3"><select className="h-8 max-w-[170px] rounded-lg border border-[#258EA4]/20 bg-white/70 px-2 text-[10px] font-semibold text-[#315B6B] outline-none" value={task.ambassadorId} disabled={busy || task.status === "COMPLETED"} onChange={(e) => reassignTask(task.taskId, e.target.value)}>{activeAmbassadors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></td>
                        <td className="px-3 py-3"><StatusPill status={task.status} /></td>
                        <td className="px-3 py-3 text-[#557783]">{task.assignedAt ? new Date(task.assignedAt).toLocaleDateString() : "—"}</td>
                        <td className="px-3 py-3"><div className="flex items-center justify-end gap-1.5"><select className="h-8 rounded-lg border border-[#258EA4]/20 bg-white/70 px-2 text-[10px] font-bold text-[#315B6B] outline-none" value={task.status} disabled={busy} onChange={(e) => updateTaskStatus(task.taskId, e.target.value)}><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><button type="button" onClick={() => deleteTask(task.taskId)} disabled={busy || task.status !== "ASSIGNED"} className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50/70 text-rose-600 disabled:opacity-40" aria-label={`Delete ${task.title}`}><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </ShellCard>
            </div>
          )}

          {tab === "referrals" && (
            <ShellCard className="p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F2F5] text-[#08758D]"><CheckCircle2 className="h-5 w-5" /></span><div><h2 className="font-cinzel text-xl font-black uppercase text-[#163E51]">Referral tracking</h2><p className="mt-1 text-[10px] text-[#68858F]">Monitor registrations and conversions attributed to ambassador promo codes</p></div></div>
                <form onSubmit={searchReferrals} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[220px_180px_170px_auto]">
                  <input className={fieldClass} placeholder="Name / email / registration" value={referralSearch} onChange={(e) => setReferralSearch(e.target.value)} />
                  <select className={fieldClass} value={referralAmbassadorId} onChange={(e) => setReferralAmbassadorId(e.target.value)}><option value="">All ambassadors</option>{ambassadors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                  <select className={fieldClass} value={referralStatus} onChange={(e) => setReferralStatus(e.target.value)}><option value="">All statuses</option><option value="PENDING_VERIFICATION">Pending</option><option value="VERIFIED">Verified</option><option value="REJECTED">Rejected</option></select>
                  <button className={secondaryButton}><Search className="h-4 w-4" /> Search</button>
                </form>
              </div>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[#258EA4]/16 bg-white/44">
                <table className="w-full min-w-[980px] text-left text-[11px]">
                  <thead className="border-b border-[#258EA4]/14 bg-[#D9F2F5]/55 text-[9px] font-black uppercase tracking-[0.1em] text-[#32697A]"><tr><th className="px-3 py-3">Registration ID</th><th className="px-3 py-3">Participant</th><th className="px-3 py-3">Ambassador</th><th className="px-3 py-3">Promo code</th><th className="px-3 py-3">Package</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Date</th></tr></thead>
                  <tbody>{referrals.length === 0 ? <tr><td colSpan="8" className="px-4 py-10 text-center text-[#6C8993]">No referrals recorded yet.</td></tr> : referrals.map((row) => (
                    <tr key={row._id || row.registrationId} className="border-b border-[#258EA4]/10 last:border-0 hover:bg-white/35"><td className="px-3 py-3 font-mono text-[10px] font-black text-[#315B6B]">{row.registrationId}</td><td className="px-3 py-3 font-semibold text-[#315B6B]">{row.name}<span className="block text-[9px] font-normal text-[#78919A]">{row.email}</span></td><td className="px-3 py-3 text-[#557783]">{ambassadorName(row.ambassadorId)}</td><td className="px-3 py-3 font-mono font-black text-[#A9752B]">{row.promoCode || "—"}</td><td className="px-3 py-3 text-[#557783]">{row.packageName || row.packageCode}</td><td className="px-3 py-3 text-[#557783]">{nice(row.paymentStatus)}</td><td className="px-3 py-3"><StatusPill status={row.status} /></td><td className="px-3 py-3 text-[#557783]">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}</td></tr>
                  ))}</tbody>
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
