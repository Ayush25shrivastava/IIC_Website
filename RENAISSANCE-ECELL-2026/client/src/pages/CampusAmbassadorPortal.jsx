import { useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Anchor, ClipboardList, Compass, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Tag, Users, LoaderCircle } from "lucide-react";
function PortalCard({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-[#208AA0]/24 bg-[linear-gradient(145deg,rgba(239,252,252,0.94),rgba(194,233,238,0.91))] shadow-[0_20px_55px_rgba(7,61,80,0.18)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
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

            {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

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
  const { login: signIn, sessionNotice } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function login(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const signedIn = await signIn(credentials);
      if (!signedIn) return;
      setCredentials({ email: "", password: "" });
      navigate("/campus-ambassador/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.status >= 500 || !requestError.status
        ? "The sign-in service is unavailable. Please try again."
        : requestError.message);
    } finally { setPending(false); }
  }
  return <LoginPanel credentials={credentials} setCredentials={setCredentials}
    onSubmit={login} pending={pending} error={error || sessionNotice || location.state?.message}
    showPassword={showPassword} setShowPassword={setShowPassword} />;
}
