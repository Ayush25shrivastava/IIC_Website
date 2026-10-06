import { useEffect, useState } from "react";
import {
  Anchor,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Compass,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  KeyRound,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Megaphone,
  RefreshCw,
  Save,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import { ambassadorApi, ApiClientError } from "../lib/server1-api";

const STATUS_OPTIONS = [
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

function statusLabel(value) {
  return STATUS_OPTIONS.find((option) => option.value === value)?.label
    || String(value || "").replaceAll("_", " ");
}

function allowedTaskStatuses(status) {
  if (status === "COMPLETED") return STATUS_OPTIONS.filter((item) => item.value === "COMPLETED");
  if (status === "IN_PROGRESS") return STATUS_OPTIONS.filter((item) => item.value !== "ASSIGNED");
  return STATUS_OPTIONS;
}

function errorMessage(error, fallback) {
  if (error instanceof ApiClientError) return error.message;
  return fallback;
}

function PortalCard({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-[#208AA0]/24 bg-[linear-gradient(145deg,rgba(239,252,252,0.94),rgba(194,233,238,0.91))] shadow-[0_20px_55px_rgba(7,61,80,0.18)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function DashboardCard({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,rgba(248,253,253,0.95),rgba(223,246,249,0.90))] shadow-[0_16px_42px_rgba(5,63,83,0.14),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-[#2A91A6]/10 backdrop-blur-xl ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {children}
    </div>
  );
}

function taskTone(status) {
  if (status === "COMPLETED") return "border-emerald-300/70 bg-emerald-50/85 text-emerald-700";
  if (status === "IN_PROGRESS") return "border-amber-300/70 bg-amber-50/85 text-amber-700";
  return "border-[#57AFC0]/35 bg-[#E4F7F9]/90 text-[#176C82]";
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-24 text-[#173F52]">
      <PortalCard className="flex min-w-[280px] items-center justify-center gap-3 p-7">
        <LoaderCircle className="h-5 w-5 animate-spin text-[#0D7892]" />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.16em]">Opening command deck</span>
      </PortalCard>
    </main>
  );
}

function PasswordChange({ initialCurrentPassword = "", onChanged, onLogout }) {
  const [form, setForm] = useState({
    currentPassword: initialCurrentPassword,
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const data = await ambassadorApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      await onChanged(data.ambassador);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not change your password."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-[112px] text-[#173F52] sm:px-6">
      <PortalCard className="mx-auto max-w-xl overflow-hidden p-6 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#178DA4]/30 bg-white/60 text-[#B17E2E] shadow-sm">
          <KeyRound className="h-6 w-6" />
        </div>
        <div className="mt-4 text-center">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#39788A]">First login security</p>
          <h1 className="mt-2 font-cinzel text-2xl font-black uppercase text-[#163E51]">Set your permanent password</h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#4F7380]">
            Your temporary password must be replaced before the ambassador dashboard can be accessed.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {[
            ["Current password", "currentPassword"],
            ["New password", "newPassword"],
            ["Confirm new password", "confirmPassword"],
          ].map(([label, key]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#315B6B]">{label}</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  autoComplete={key === "currentPassword" ? "current-password" : "new-password"}
                  className="h-11 w-full rounded-xl border border-[#238FA5]/30 bg-white/70 pl-10 pr-11 text-sm outline-none transition focus:border-[#0D7892] focus:ring-4 focus:ring-[#0D7892]/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#577A86] hover:bg-[#0D7892]/10"
                  aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
          ))}

          {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0D7892,#39B4C5)] font-mono text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Save secure password
          </button>
        </form>

        <button type="button" onClick={onLogout} className="mx-auto mt-5 block text-xs font-semibold text-[#547783] hover:text-[#0D7892]">
          Sign out instead
        </button>
      </PortalCard>
    </main>
  );
}

function LoginPanel({ credentials, setCredentials, onSubmit, pending, error, showPassword, setShowPassword }) {
  return (
    <main className="min-h-screen px-3 pb-8 pt-[96px] text-[#173F52] sm:px-5 lg:px-6">
      <section className="mx-auto grid w-full max-w-[1160px] gap-4 md:grid-cols-[1.12fr_0.88fr]">
        <PortalCard className="relative isolate min-h-[430px] overflow-hidden p-6 sm:p-8 lg:p-10">
          <img
            src="/pirate-wheel-half.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-14 top-16 w-48 -rotate-12 select-none opacity-[0.14] grayscale mix-blend-multiply"
          />
          <img
            src="/sticker-compass.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 top-14 w-64 select-none opacity-[0.2] grayscale mix-blend-multiply"
          />
          <img
            src="/sticker-ship.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-9 -left-7 w-52 select-none opacity-[0.18] grayscale mix-blend-multiply"
          />
          <div className="relative z-10 flex min-h-[360px] flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#178DA4]/30 bg-white/55 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#176C82]">
              <Compass className="h-3.5 w-3.5" /> Campus Ambassador Command Portal
            </span>
            <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.28em] text-[#39788A]">Renaissance X · Authorized access</p>
            <h1 className="mt-2 font-cinzel text-3xl font-black uppercase leading-tight text-[#163E51] sm:text-4xl">
              Welcome back,
              <span className="block text-[#B17E2E]">campus captain</span>
            </h1>
            <div className="my-5 flex items-center gap-3 text-[#21899D]">
              <span className="h-px w-16 bg-current/40" />
              <Anchor className="h-4 w-4 text-[#B17E2E]" />
              <span className="h-px w-16 bg-current/40" />
            </div>
            <p className="max-w-lg text-xs leading-6 text-[#365F70]">
              Sign in with the credentials issued by the Renaissance team. Your live missions, promo performance and registrations are loaded directly from the secure command server.
            </p>
            <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-3">
              {[
                [ClipboardList, "Missions"],
                [Users, "Network"],
                [Tag, "Promo"],
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-[#208AA0]/18 bg-white/45 p-3">
                  <Icon className="mx-auto h-5 w-5 text-[#0D7892]" />
                  <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-wider text-[#315B6B]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </PortalCard>

        <PortalCard className="flex min-h-[430px] flex-col justify-center p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#18849A]/30 bg-white/60 text-[#B17E2E]">
              <Anchor className="h-5 w-5" />
            </div>
            <h2 className="mt-3 font-cinzel text-2xl font-black uppercase text-[#163E51]">Captain&apos;s Login</h2>
            <p className="mt-1 text-xs text-[#567985]">Access your dashboard and command your journey.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#315B6B]">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
                <input
                  type="email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-[#238FA5]/30 bg-white/70 pl-10 pr-3 text-sm outline-none focus:border-[#0D7892] focus:ring-4 focus:ring-[#0D7892]/10"
                  placeholder="you@college.edu"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#315B6B]">Password</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="h-11 w-full rounded-xl border border-[#238FA5]/30 bg-white/70 pl-10 pr-11 text-sm outline-none focus:border-[#0D7892] focus:ring-4 focus:ring-[#0D7892]/10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#577A86] hover:bg-[#0D7892]/10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            {error && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0D7892,#3AB7C8)] font-mono text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
              Board the flagship
            </button>
          </form>
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#238FA5]/15 pt-4 text-center text-[10px] text-[#557B87]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0D7892]" /> Secure credential-based access
          </div>
        </PortalCard>
      </section>
    </main>
  );
}

export default function CampusAmbassadorPortal() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [ambassador, setAmbassador] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskDrafts, setTaskDrafts] = useState({});
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginPending, setLoginPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [savingTaskId, setSavingTaskId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState("");
  const [showAllTasks, setShowAllTasks] = useState(false);

  function applyTasks(nextTasks) {
    setTasks(nextTasks);
    setTaskDrafts((current) => {
      const next = { ...current };
      for (const task of nextTasks) {
        next[task.taskId] = {
          remarks: next[task.taskId]?.remarks ?? task.remarks ?? "",
          completionDetails: next[task.taskId]?.completionDetails ?? task.completionDetails ?? "",
        };
      }
      return next;
    });
  }

  async function loadPortalData() {
    const [dashboardData, taskData] = await Promise.all([
      ambassadorApi.dashboard(),
      ambassadorApi.tasks({ page: 1, limit: 50 }),
    ]);
    setDashboard(dashboardData);
    setAmbassador(dashboardData.ambassador);
    applyTasks(taskData.tasks || []);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const data = await ambassadorApi.me();
        if (!active) return;
        setAmbassador(data.ambassador);
        setMustChangePassword(Boolean(data.mustChangePassword ?? data.ambassador?.mustChangePassword));
        setIsAuthenticated(true);
        if (!(data.mustChangePassword ?? data.ambassador?.mustChangePassword)) {
          await loadPortalData();
        }
      } catch (requestError) {
        if (active && requestError instanceof ApiClientError && requestError.status !== 401) {
          setError(requestError.message);
        }
      } finally {
        if (active) setSessionLoading(false);
      }
    }

    bootstrap();
    return () => { active = false; };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginPending(true);
    setError("");
    try {
      const data = await ambassadorApi.login(credentials);
      const passwordChangeRequired = Boolean(data.mustChangePassword ?? data.ambassador?.mustChangePassword);
      setAmbassador(data.ambassador);
      setMustChangePassword(passwordChangeRequired);
      setIsAuthenticated(true);
      if (!passwordChangeRequired) await loadPortalData();
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not sign in."));
    } finally {
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    try {
      await ambassadorApi.logout();
    } catch {
      // Clearing local UI state is still correct when the server session is already gone.
    }
    setIsAuthenticated(false);
    setMustChangePassword(false);
    setAmbassador(null);
    setDashboard(null);
    setTasks([]);
    setCredentials({ email: "", password: "" });
    setError("");
  }

  async function handlePasswordChanged(nextAmbassador) {
    setAmbassador(nextAmbassador);
    setMustChangePassword(false);
    setCredentials((current) => ({ ...current, password: "" }));
    await loadPortalData();
  }

  async function refreshPortal() {
    setRefreshing(true);
    setError("");
    try {
      await loadPortalData();
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not refresh dashboard data."));
    } finally {
      setRefreshing(false);
    }
  }

  async function copyReferralCode() {
    const code = dashboard?.promoCode?.code;
    if (!code) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1600);
    } catch {
      setError("Could not copy the referral code. Please copy it manually.");
    }
  }

  async function updateTaskStatus(taskId, status) {
    setSavingTaskId(taskId);
    setError("");
    try {
      const data = await ambassadorApi.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task.taskId === taskId ? data.task : task)));
      const dashboardData = await ambassadorApi.dashboard();
      setDashboard(dashboardData);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not update task status."));
    } finally {
      setSavingTaskId("");
    }
  }

  async function saveTaskDetails(taskId) {
    setSavingTaskId(taskId);
    setError("");
    try {
      const draft = taskDrafts[taskId] || {};
      const data = await ambassadorApi.updateTaskDetails(taskId, {
        remarks: draft.remarks ?? "",
        completionDetails: draft.completionDetails ?? "",
      });
      setTasks((current) => current.map((task) => (task.taskId === taskId ? data.task : task)));
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not save task details."));
    } finally {
      setSavingTaskId("");
    }
  }

  if (sessionLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <>
        <LoginPanel
          credentials={credentials}
          setCredentials={setCredentials}
          onSubmit={handleLogin}
          pending={loginPending}
          error={error}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <ContactFooter />
      </>
    );
  }

  if (mustChangePassword) {
    return (
      <>
        <PasswordChange
          initialCurrentPassword={credentials.password}
          onChanged={handlePasswordChanged}
          onLogout={handleLogout}
        />
        <ContactFooter />
      </>
    );
  }

  const promoCode = dashboard?.promoCode;
  const taskStats = dashboard?.taskStats || {};
  const referralStats = dashboard?.referralStats || {};
  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 3);

  return (
    <>
      <main className="min-h-screen bg-transparent px-3 pb-14 pt-[106px] text-[#173F52] sm:px-5 lg:px-8">
        <section className="mx-auto w-full max-w-[1500px] space-y-3.5">
          <DashboardCard className="min-h-[146px] border-[#C69A4A]/35 p-5 sm:p-6 lg:px-8 lg:py-6">
            <img src="/card-decor-globe.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[31%] hidden h-full w-[58%] object-cover object-center select-none opacity-[0.055] grayscale mix-blend-multiply lg:block" />
            <img src="/sticker-compass.png" alt="" aria-hidden="true" className="pointer-events-none absolute right-[22%] top-1/2 hidden w-40 -translate-y-1/2 select-none opacity-[0.075] grayscale mix-blend-multiply xl:block" />
            <img src="/sticker-anchor.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-4 w-24 select-none opacity-[0.05] grayscale mix-blend-multiply" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#C3923D]/50 to-transparent" />
            <div className="relative z-10 flex min-h-[92px] flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-[#2D7185] sm:text-[10px]">Ambassador command deck</p>
                <h1 className="mt-2 font-cinzel text-[28px] font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#143E52] sm:text-[36px] lg:text-[43px]">
                  Welcome, {ambassador?.name || "Captain"}
                </h1>
                <p className="mt-2 text-xs font-medium text-[#64818C] sm:text-sm">{ambassador?.college} · {ambassador?.ambassadorId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={refreshPortal}
                  disabled={refreshing}
                  className="inline-flex h-11 min-w-[116px] items-center justify-center gap-2 rounded-xl border border-[#208AA0]/22 bg-white/75 px-4 text-xs font-black text-[#276578] shadow-[0_8px_18px_rgba(11,92,113,0.10)] transition hover:bg-white disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 min-w-[116px] items-center justify-center gap-2 rounded-xl border border-[#A87527]/30 bg-[linear-gradient(110deg,#C49542,#A87527)] px-4 text-xs font-black text-white shadow-[0_9px_20px_rgba(151,105,35,0.20)] transition hover:brightness-105"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </DashboardCard>

          {error && <p className="rounded-2xl border border-red-300 bg-red-50/95 px-4 py-3 text-sm text-red-700 shadow-sm">{error}</p>}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [ClipboardList, "Assigned tasks", taskStats.total ?? 0, "Tasks awaiting your action", "/sticker-wheel.png", false],
              [CheckCircle2, "Completed", taskStats.completed ?? 0, "Tasks successfully completed", "/sticker-compass.png", true],
              [GraduationCap, "Registrations", referralStats.total ?? 0, "People registered via you", "/card-decor-globe.png", false],
              [ShieldCheck, "Verified", referralStats.verified ?? 0, "Verified registrations", "/sticker-anchor.png", true],
            ].map(([Icon, label, value, detail, decorSrc, gold]) => (
              <DashboardCard key={label} className="min-h-[120px] p-4">
                <img src={decorSrc} alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-2 w-28 select-none opacity-[0.065] grayscale mix-blend-multiply" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-11 bg-[linear-gradient(180deg,transparent,rgba(70,184,204,0.08))]" />
                <div className="relative z-10 flex items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${gold ? "border-[#D6B267]/30 bg-[#F8ECCF]/90 text-[#A87527]" : "border-[#38A7BA]/22 bg-[#D8F5F7]/90 text-[#0782A0]"}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#245B6D] sm:text-[10px]">{label}</p>
                    <p className="mt-1 text-[32px] font-black leading-none text-[#153D50]">{value}</p>
                    <p className="mt-2 text-[10px] leading-4 text-[#64838E]">{detail}</p>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>

          <DashboardCard className="min-h-[106px] border-[#C69A4A]/28 px-5 py-4 sm:px-7">
            <img src="/sticker-anchor.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-5 -top-7 w-24 select-none opacity-[0.06] grayscale mix-blend-multiply" />
            <img src="/sticker-compass.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-[-52px] left-[30%] w-32 select-none opacity-[0.045] grayscale mix-blend-multiply" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#39788A]">Your referral code</p>
                  <Tag className="h-3.5 w-3.5 text-[#A87527]" />
                </div>
                {promoCode?.code ? (
                  <>
                    <p className="mt-1 font-cinzel text-[28px] font-black uppercase tracking-[0.08em] text-[#A87527] sm:text-[34px]">{promoCode.code}</p>
                    <p className="mt-0.5 text-[10px] text-[#64818C]">Share this code and bring more voyagers aboard!</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-[#64818C]">No referral code assigned yet.</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                <div className="min-w-[58px] text-center">
                  <strong className="block text-xl font-black text-[#153E50]">{promoCode?.usageCount ?? 0}</strong>
                  <span className="text-[10px] text-[#64818C]">Uses</span>
                </div>
                <span className="hidden h-12 w-px bg-[#2A91A6]/20 sm:block" />
                <div className="min-w-[70px] text-center">
                  <strong className="block text-xl font-black text-[#153E50]">{promoCode?.remainingUses ?? "∞"}</strong>
                  <span className="text-[10px] text-[#64818C]">Remaining</span>
                </div>
                <span className="hidden h-12 w-px bg-[#2A91A6]/20 sm:block" />
                <div className="min-w-[74px] text-center">
                  <strong className={`block text-base font-black ${promoCode?.effectiveStatus === "ACTIVE" ? "text-emerald-700" : "text-[#153E50]"}`}>{promoCode?.effectiveStatus || "N/A"}</strong>
                  <span className="text-[10px] text-[#64818C]">Status</span>
                </div>
                {promoCode?.code && (
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0B6680] px-4 text-xs font-black text-white shadow-[0_9px_20px_rgba(9,91,113,0.18)] transition hover:bg-[#07576E]"
                  >
                    <Copy className="h-4 w-4" /> {copiedCode ? "Copied" : "Copy code"}
                  </button>
                )}
              </div>
            </div>
          </DashboardCard>

          <div className="grid gap-3.5 xl:grid-cols-[2.05fr_0.85fr]">
            <DashboardCard className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A91A6]/18 bg-[#D9F4F7] text-[#0D7892]"><ClipboardList className="h-4 w-4" /></span>
                  <h2 className="font-cinzel text-[16px] font-black uppercase text-[#173F52]">Active missions</h2>
                </div>
                {tasks.length > 3 && (
                  <button type="button" onClick={() => setShowAllTasks((value) => !value)} className="text-[9px] font-black uppercase tracking-[0.06em] text-[#2D7185] hover:text-[#0D7892]">
                    {showAllTasks ? "Show less" : "View all"}
                  </button>
                )}
              </div>

              {tasks.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-[#208AA0]/25 bg-white/45 px-4 py-8 text-center">
                  <Compass className="mx-auto h-6 w-6 text-[#7AA8B3]" />
                  <p className="mt-2 text-xs font-black text-[#315B6B]">No active missions yet.</p>
                  <p className="mx-auto mt-1 max-w-xs text-[10px] leading-4 text-[#6A8791]">Your next mission will appear here when assigned by the Renaissance team.</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {visibleTasks.map((task) => {
                    const draft = taskDrafts[task.taskId] || { remarks: "", completionDetails: "" };
                    const saving = savingTaskId === task.taskId;
                    const expanded = expandedTaskId === task.taskId;

                    return (
                      <article key={task.taskId} className="overflow-hidden rounded-2xl border border-[#258EA4]/16 bg-white/62">
                        <div className="flex items-center gap-3 p-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF4F6] text-[#0D7892]">
                            <Megaphone className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-black text-[#214B5B]">{task.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-[9px] text-[#68858F]">{task.description}</p>
                          </div>
                          <span className={`hidden rounded-lg border px-2 py-1 text-[8px] font-black uppercase tracking-[0.07em] sm:inline-flex ${taskTone(task.status)}`}>{statusLabel(task.status)}</span>
                          <button type="button" onClick={() => setExpandedTaskId(expanded ? "" : task.taskId)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#258EA4]/16 bg-white/80 text-[#2D7185]" aria-label={`${expanded ? "Close" : "Open"} ${task.title}`}>
                            <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>

                        {expanded && (
                          <div className="border-t border-[#258EA4]/12 bg-[#F5FCFC]/72 p-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <select
                                value={task.status}
                                disabled={saving}
                                onChange={(event) => updateTaskStatus(task.taskId, event.target.value)}
                                className="h-9 rounded-xl border border-[#208AA0]/22 bg-white/85 px-3 text-[10px] font-bold text-[#23667A] outline-none disabled:opacity-60"
                              >
                                {allowedTaskStatuses(task.status).map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-[#6D8B95]">{task.taskId}</span>
                            </div>

                            <div className="mt-2 grid gap-2">
                              <textarea
                                rows={2}
                                value={draft.remarks}
                                onChange={(event) => setTaskDrafts((current) => ({
                                  ...current,
                                  [task.taskId]: { ...draft, remarks: event.target.value },
                                }))}
                                placeholder="Remarks"
                                className="rounded-xl border border-[#208AA0]/18 bg-white/80 p-2.5 text-[10px] outline-none focus:border-[#0D7892]"
                              />
                              <textarea
                                rows={2}
                                value={draft.completionDetails}
                                onChange={(event) => setTaskDrafts((current) => ({
                                  ...current,
                                  [task.taskId]: { ...draft, completionDetails: event.target.value },
                                }))}
                                placeholder="Completion details"
                                className="rounded-xl border border-[#208AA0]/18 bg-white/80 p-2.5 text-[10px] outline-none focus:border-[#0D7892]"
                              />
                            </div>

                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => saveTaskDetails(task.taskId)}
                              className="mt-2 inline-flex h-9 items-center gap-2 rounded-xl border border-[#B17E2E]/24 bg-[#B17E2E]/10 px-3 text-[10px] font-black text-[#80591F] hover:bg-[#B17E2E]/15 disabled:opacity-50"
                            >
                              {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save mission details
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </DashboardCard>

            <DashboardCard className="p-4">
              <img src="/card-decor-stamp.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 w-32 select-none opacity-[0.065] grayscale mix-blend-multiply" />
              <div className="relative z-10 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D2AC65]/22 bg-[#FBF0D6]/80 text-[#A87527]"><Compass className="h-4 w-4" /></span>
                <h2 className="font-cinzel text-[16px] font-black uppercase text-[#173F52]">Captain&apos;s tips</h2>
              </div>

              <div className="relative z-10 mt-3 space-y-2">
                {[
                  [Lightbulb, "Share your referral code everywhere", "Classrooms, groups and social media."],
                  [Users, "Help your peers understand", "What makes Renaissance special."],
                  [BarChart3, "Track your progress", "Aim for new milestones."],
                  [Heart, "You are more than an ambassador", "You are a changemaker."],
                ].map(([Icon, title, detail], index) => (
                  <div key={title} className="flex items-start gap-2.5 rounded-xl border border-[#258EA4]/12 bg-white/58 p-2.5">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-[#FFF2CA] text-[#B37C16]" : index === 3 ? "bg-rose-50 text-rose-500" : "bg-[#DDF4F6] text-[#0D7892]"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[10px] font-black leading-4 text-[#315B6B]">{title}</p>
                      <p className="text-[9px] leading-4 text-[#708B94]">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="flex items-center justify-center gap-3 py-1 text-center">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/65" />
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-white/75">Renaissance · A voyage towards a brighter tomorrow</p>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/65" />
          </div>
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
