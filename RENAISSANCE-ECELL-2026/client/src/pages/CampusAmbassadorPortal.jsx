import { useEffect, useState } from "react";
import {
  Anchor,
  CheckCircle2,
  ClipboardList,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
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
  const [referrals, setReferrals] = useState([]);
  const [taskDrafts, setTaskDrafts] = useState({});
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginPending, setLoginPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [savingTaskId, setSavingTaskId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
    const [dashboardData, taskData, referralData] = await Promise.all([
      ambassadorApi.dashboard(),
      ambassadorApi.tasks({ page: 1, limit: 50 }),
      ambassadorApi.referrals({ page: 1, limit: 20 }),
    ]);
    setDashboard(dashboardData);
    setAmbassador(dashboardData.ambassador);
    applyTasks(taskData.tasks || []);
    setReferrals(referralData.referrals || []);
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
    setReferrals([]);
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

  return (
    <>
      <main className="min-h-screen px-4 pb-16 pt-[112px] text-[#173F52] sm:px-6">
        <section className="mx-auto w-full max-w-6xl space-y-5">
          <PortalCard className="p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#39788A]">Ambassador command deck</span>
                <h1 className="mt-1 font-cinzel text-3xl font-black text-[#163E51]">Welcome, {ambassador?.name || "Captain"}</h1>
                <p className="mt-2 text-sm text-[#557986]">{ambassador?.college} · {ambassador?.ambassadorId}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={refreshPortal}
                  disabled={refreshing}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#208AA0]/25 bg-white/55 px-4 text-xs font-bold text-[#276578] hover:bg-white/80 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#B17E2E]/25 bg-[#B17E2E]/10 px-4 text-xs font-bold text-[#80591F] hover:bg-[#B17E2E]/15"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </PortalCard>

          {error && <p className="rounded-2xl border border-red-300 bg-red-50/95 px-4 py-3 text-sm text-red-700 shadow-sm">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [ClipboardList, "Assigned tasks", taskStats.total ?? 0],
              [CheckCircle2, "Completed", taskStats.completed ?? 0],
              [GraduationCap, "Registrations", referralStats.total ?? 0],
              [Users, "Verified", referralStats.verified ?? 0],
            ].map(([Icon, label, value]) => (
              <PortalCard key={label} className="p-5">
                <Icon className="h-5 w-5 text-[#0D7892]" />
                <p className="mt-3 text-3xl font-black text-[#163E51]">{value}</p>
                <p className="mt-1 text-xs font-semibold text-[#587B87]">{label}</p>
              </PortalCard>
            ))}
          </div>

          <PortalCard className="overflow-hidden p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#39788A]">Your referral code</p>
                <p className="mt-1 font-mono text-3xl font-black tracking-[0.08em] text-[#B17E2E]">{promoCode?.code || "NOT ASSIGNED"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right text-xs text-[#557986] sm:grid-cols-3">
                <div><strong className="block text-lg text-[#163E51]">{promoCode?.usageCount ?? 0}</strong>Uses</div>
                <div><strong className="block text-lg text-[#163E51]">{promoCode?.remainingUses ?? "∞"}</strong>Remaining</div>
                <div><strong className="block text-lg text-[#163E51]">{promoCode?.effectiveStatus || "N/A"}</strong>Status</div>
              </div>
            </div>
          </PortalCard>

          <PortalCard className="p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="font-cinzel text-2xl font-black text-[#163E51]">Assigned missions</h2>
              <p className="mt-1 text-xs text-[#587B87]">Task changes are stored directly in the Renaissance backend.</p>
            </div>

            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#208AA0]/30 bg-white/35 p-8 text-center text-sm text-[#557986]">No missions assigned yet.</div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const draft = taskDrafts[task.taskId] || { remarks: "", completionDetails: "" };
                  const saving = savingTaskId === task.taskId;
                  return (
                    <article key={task.taskId} className="rounded-2xl border border-[#208AA0]/20 bg-white/48 p-4 sm:p-5">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#39788A]">{task.taskId}</p>
                          <h3 className="mt-1 font-bold text-[#173F52]">{task.title}</h3>
                          <p className="mt-1 max-w-3xl text-xs leading-5 text-[#587B87]">{task.description}</p>
                        </div>
                        <select
                          value={task.status}
                          disabled={saving}
                          onChange={(event) => updateTaskStatus(task.taskId, event.target.value)}
                          className="h-10 rounded-xl border border-[#208AA0]/25 bg-white/75 px-3 text-xs font-bold text-[#23667A] outline-none disabled:opacity-60"
                        >
                          {allowedTaskStatuses(task.status).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <textarea
                          rows={3}
                          value={draft.remarks}
                          onChange={(event) => setTaskDrafts((current) => ({
                            ...current,
                            [task.taskId]: { ...draft, remarks: event.target.value },
                          }))}
                          placeholder="Remarks"
                          className="rounded-xl border border-[#208AA0]/20 bg-white/65 p-3 text-xs outline-none focus:border-[#0D7892]"
                        />
                        <textarea
                          rows={3}
                          value={draft.completionDetails}
                          onChange={(event) => setTaskDrafts((current) => ({
                            ...current,
                            [task.taskId]: { ...draft, completionDetails: event.target.value },
                          }))}
                          placeholder="Completion details"
                          className="rounded-xl border border-[#208AA0]/20 bg-white/65 p-3 text-xs outline-none focus:border-[#0D7892]"
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#63838D]">Status: {statusLabel(task.status)}</span>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => saveTaskDetails(task.taskId)}
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#B17E2E]/25 bg-[#B17E2E]/10 px-4 text-xs font-bold text-[#80591F] hover:bg-[#B17E2E]/15 disabled:opacity-50"
                        >
                          {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </PortalCard>

          <PortalCard className="p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-cinzel text-2xl font-black text-[#163E51]">Recent registrations</h2>
                <p className="mt-1 text-xs text-[#587B87]">Only referral-safe registration information is shown here.</p>
              </div>
              <span className="text-xs font-semibold text-[#39788A]">Latest {referrals.length} referrals</span>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#208AA0]/18 bg-white/45">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-[#208AA0]/15 bg-white/45 text-[10px] uppercase tracking-wider text-[#39788A]">
                  <tr><th className="px-4 py-3">Registration</th><th className="px-4 py-3">Participant</th><th className="px-4 py-3">Package</th><th className="px-4 py-3">Status</th></tr>
                </thead>
                <tbody>
                  {referrals.length === 0 ? (
                    <tr><td colSpan="4" className="px-4 py-7 text-center text-[#63838D]">No promo registrations yet.</td></tr>
                  ) : referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-[#208AA0]/10 last:border-0">
                      <td className="px-4 py-3 font-mono font-bold text-[#315B6B]">{referral.registrationId}</td>
                      <td className="px-4 py-3">{referral.participantName}</td>
                      <td className="px-4 py-3">{referral.packageName || referral.packageCode}</td>
                      <td className="px-4 py-3 font-semibold text-[#0D7892]">{statusLabel(referral.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PortalCard>
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
