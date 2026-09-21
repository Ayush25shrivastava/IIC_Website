import { useState } from "react";
import {
  Anchor,
  CheckCircle2,
  ClipboardList,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  ShipWheel,
  Trophy,
  Users,
  Waves,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";

const initialTasks = [
  {
    id: "task-1",
    title: "Promote Renaissance 2026",
    description: "Share the official event creatives with students at your college.",
    status: "In Progress",
    remarks: "",
  },
  {
    id: "task-2",
    title: "Register interested participants",
    description: "Help students register using your unique campus ambassador code.",
    status: "Assigned",
    remarks: "",
  },
  {
    id: "task-3",
    title: "Build your campus team",
    description: "Connect with student clubs and identify event volunteers.",
    status: "Assigned",
    remarks: "",
  },
];

const statusOptions = ["Assigned", "In Progress", "Completed"];

function NauticalCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      <span className="absolute left-2 top-2 h-9 w-9 rounded-tl-xl border-l border-t border-[#238FA5]/60" />
      <span className="absolute right-2 top-2 h-9 w-9 rounded-tr-xl border-r border-t border-[#238FA5]/60" />
      <span className="absolute bottom-2 left-2 h-9 w-9 rounded-bl-xl border-b border-l border-[#238FA5]/60" />
      <span className="absolute bottom-2 right-2 h-9 w-9 rounded-br-xl border-b border-r border-[#238FA5]/60" />

      <span className="absolute left-[18px] top-[18px] h-1.5 w-1.5 rotate-45 border border-[#B98B3C]/70 bg-[#E9F8F8]/90" />
      <span className="absolute right-[18px] top-[18px] h-1.5 w-1.5 rotate-45 border border-[#B98B3C]/70 bg-[#E9F8F8]/90" />
      <span className="absolute bottom-[18px] left-[18px] h-1.5 w-1.5 rotate-45 border border-[#B98B3C]/70 bg-[#E9F8F8]/90" />
      <span className="absolute bottom-[18px] right-[18px] h-1.5 w-1.5 rotate-45 border border-[#B98B3C]/70 bg-[#E9F8F8]/90" />
    </div>
  );
}

function VoyageStat({ icon: Icon, title, detail }) {
  return (
    <div className="group relative z-10 flex min-w-0 flex-col items-center text-center">
      <span className="relative mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-[#238FA5]/45 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,0.96),rgba(193,235,239,0.9)_72%)] text-[#0D7892] shadow-[inset_0_0_18px_rgba(255,255,255,0.45),0_8px_20px_rgba(20,104,125,0.13)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#0D7892]/70 group-hover:text-[#075B70]">
        <span
          aria-hidden="true"
          className="absolute inset-[4px] rounded-full border border-dashed border-[#B98B3C]/28"
        />
        <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.75} />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 h-1.5 w-1.5 rotate-45 border border-[#B98B3C]/65 bg-[#E7F7F8]"
        />
      </span>
      <strong className="font-mono text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#173F52] sm:text-[10px]">
        {title}
      </strong>
      <span className="mt-1 max-w-[126px] text-[8px] leading-[1.35] text-[#4F7380] sm:text-[9px]">
        {detail}
      </span>
    </div>
  );
}

function BookHinge({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-[-15px] z-30 hidden h-9 w-[20px] rounded-[5px] border border-[#8D6426] bg-[linear-gradient(90deg,#563814_0%,#C19042_28%,#7A531E_52%,#D0A85B_75%,#4A3011_100%)] shadow-[inset_0_1px_0_rgba(255,232,171,0.32),0_3px_8px_rgba(0,0,0,0.5)] lg:block ${className}`}
    >
      <span className="absolute inset-x-[4px] top-[7px] h-px bg-[#F2D28A]/30" />
      <span className="absolute inset-x-[4px] bottom-[7px] h-px bg-[#2A1908]/60" />
    </span>
  );
}

export default function CampusAmbassador() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [tasks, setTasks] = useState(initialTasks);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setLoginError("Enter your ambassador email and password to continue.");
      return;
    }
    setLoginError("");
    setIsAuthenticated(true);
  };

  const updateTask = (id, field, value) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <>
        <main className="min-h-screen px-3 pb-8 pt-[88px] text-[#173F52] sm:px-5 sm:pt-[94px] lg:px-6 lg:pt-[100px]">
        <section className="mx-auto grid w-full max-w-[1160px] items-stretch gap-3 md:grid-cols-[1.12fr_0.88fr] md:gap-3.5 lg:gap-4">
          {/* Voyage manifesto card */}
          <article className="relative isolate min-h-[360px] overflow-hidden rounded-[24px] border border-[#2B8FA3]/40 bg-[linear-gradient(145deg,rgba(236,251,251,0.96)_0%,rgba(205,239,242,0.94)_48%,rgba(163,221,229,0.93)_100%)] px-5 py-5 shadow-[0_24px_60px_rgba(15,97,119,0.22),inset_0_0_74px_rgba(255,255,255,0.42)] backdrop-blur-md sm:min-h-[390px] sm:px-7 sm:py-6 md:min-h-[430px] lg:px-9 lg:py-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[11px] rounded-[19px] border border-[#238FA5]/18"
            />
            <NauticalCorners />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.52),transparent_34%),radial-gradient(circle_at_78%_66%,rgba(24,151,173,0.12),transparent_29%),linear-gradient(rgba(20,91,111,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(20,91,111,0.025)_1px,transparent_1px)] [background-size:auto,auto,28px_28px,28px_28px]"
            />

            {/* Layered nautical chart graphics - decorative only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-7 top-[52%] z-0 h-px bg-gradient-to-r from-transparent via-[#198FA7]/22 to-transparent"
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 700 250"
              className="pointer-events-none absolute inset-x-0 bottom-[66px] z-0 hidden h-[180px] w-full opacity-[0.38] sm:block"
              preserveAspectRatio="none"
            >
              <path
                d="M38 176 C142 92 220 207 332 128 C425 62 515 178 662 82"
                fill="none"
                stroke="rgba(18,137,158,0.56)"
                strokeWidth="1.2"
                strokeDasharray="4 9"
              />
              <path
                d="M64 196 C155 124 246 218 350 151 C448 87 531 196 640 116"
                fill="none"
                stroke="rgba(30,118,154,0.30)"
                strokeWidth="0.9"
              />
              <circle cx="90" cy="153" r="4" fill="rgba(221,183,103,0.72)" />
              <circle cx="331" cy="128" r="4" fill="rgba(221,183,103,0.72)" />
              <circle cx="596" cy="117" r="4" fill="rgba(221,183,103,0.72)" />
              <path
                d="M331 119 l9 9 -9 9 -9 -9 z"
                fill="none"
                stroke="rgba(221,183,103,0.62)"
                strokeWidth="1"
              />
            </svg>

            <img
              src="/sticker-ship.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-7 -left-7 z-0 w-[155px] -rotate-3 select-none opacity-[0.20] grayscale mix-blend-multiply sm:w-[185px] md:w-[205px]"
            />

            <img
              src="/pirate-wheel-half.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-12 top-[70px] z-0 w-[145px] -rotate-[18deg] select-none opacity-[0.15] grayscale mix-blend-multiply sm:w-[170px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 z-0 hidden -translate-y-1/2 flex-col items-center gap-2 text-[#147E96]/42 md:flex"
            >
              <span className="h-8 w-px bg-gradient-to-b from-transparent to-current" />
              <span className="font-mono text-[7px] tracking-[0.24em]">N</span>
              <span className="h-1.5 w-1.5 rotate-45 border border-current" />
              <span className="font-mono text-[7px] tracking-[0.24em]">S</span>
              <span className="h-8 w-px bg-gradient-to-t from-transparent to-current" />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-1/2 z-0 hidden -translate-y-1/2 flex-col items-center gap-2 text-[#147E96]/36 md:flex"
            >
              <span className="h-8 w-px bg-gradient-to-b from-transparent to-current" />
              <span className="font-mono text-[7px] tracking-[0.24em]">E</span>
              <span className="h-1.5 w-1.5 rotate-45 border border-current" />
              <span className="font-mono text-[7px] tracking-[0.24em]">W</span>
              <span className="h-8 w-px bg-gradient-to-t from-transparent to-current" />
            </div>

            <img
              src="/sticker-compass.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-[-34px] top-[72px] z-0 w-[215px] select-none opacity-[0.22] grayscale mix-blend-multiply sm:right-[-22px] sm:w-[238px] md:top-[84px] md:w-[255px]"
            />

            <div className="relative z-10 flex h-full min-h-[318px] flex-col sm:min-h-[342px] md:min-h-[378px]">
              <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#178DA4]/35 bg-white/58 px-3 py-1 font-mono text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#176C82] shadow-[inset_0_0_16px_rgba(255,255,255,0.45),0_5px_18px_rgba(18,101,122,0.08)] backdrop-blur-sm sm:text-[9px]">
                  <Compass className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Campus Ambassador Command Portal
                </span>

                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[7px] uppercase tracking-[0.17em] text-[#456F7F] sm:text-[8px]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-[#B07B2A]" strokeWidth={1.6} />
                    Port · MNNIT Allahabad
                  </span>
                  <span className="hidden h-1 w-1 rotate-45 border border-[#18849A]/45 sm:block" />
                  <span className="inline-flex items-center gap-1.5">
                    <Waves className="h-3 w-3 text-[#0E839D]" strokeWidth={1.6} />
                    Fleet · Renaissance X
                  </span>
                </div>

                <div className="mt-4 sm:mt-5">
                  <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.34em] text-[#37788C] sm:text-[9px]">
                    Renaissance X · Authorized Ambassador Access
                  </p>
                  <h1 className="font-cinzel text-[27px] font-black uppercase leading-[1.08] tracking-[-0.025em] text-[#163E51] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] sm:text-[31px] md:text-[33px] lg:text-[36px]">
                    Welcome back,
                    <span className="block text-[#B17E2E]">campus captain</span>
                  </h1>
                </div>

                <div className="my-3 flex items-center gap-2.5 text-[#21899D]" aria-hidden="true">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-current sm:w-16" />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#21899D]/35 bg-white/55 text-[#B17E2E]">
                    <Anchor className="h-2.5 w-2.5" strokeWidth={1.6} />
                  </span>
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-current sm:w-16" />
                </div>

                <p className="max-w-[455px] text-[10px] leading-5 text-[#365F70] sm:text-[11px] md:text-[11.5px]">
                  Sign in with the credentials issued by the Renaissance team to
                  access your ambassador dashboard, manage assigned missions, track
                  campus activity, and continue your voyage.
                </p>

                <div className="relative mt-auto w-full pt-5 sm:pt-6">
                  <div className="mb-3 flex items-center justify-center gap-2 font-mono text-[7px] uppercase tracking-[0.24em] text-[#3C7180] sm:text-[8px]">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#18849A]/55" />
                    <span className="rounded-full border border-[#18849A]/22 bg-white/48 px-2.5 py-1 backdrop-blur-sm">
                      Your command deck
                    </span>
                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#18849A]/55" />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[13%] right-[13%] top-[53px] hidden border-t border-dashed border-[#16879D]/32 sm:block"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[31%] top-[45px] hidden h-4 w-4 rotate-45 border-l border-t border-[#16879D]/32 sm:block"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[31%] top-[45px] hidden h-4 w-4 rotate-45 border-r border-t border-[#16879D]/32 sm:block"
                  />

                  <div className="grid grid-cols-3 gap-2 sm:gap-5">
                    <VoyageStat
                      icon={ShipWheel}
                      title="Your Voyage"
                      detail="Renaissance 2026"
                    />
                    <VoyageStat
                      icon={Users}
                      title="Your Crew"
                      detail="Ambassador Network"
                    />
                    <VoyageStat
                      icon={Trophy}
                      title="Active Mission"
                      detail="Lead. Engage. Deliver."
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Captain's logbook login card */}
          <div className="relative lg:pl-[2px]">
            <div
              aria-hidden="true"
              className="absolute bottom-[16px] left-[-10px] top-[16px] z-10 hidden w-[13px] rounded-l-md border-y border-l border-[#76501D] bg-[linear-gradient(90deg,#241708,#604019_52%,#1A1006)] shadow-[0_0_18px_rgba(0,0,0,0.7)] lg:block"
            />
            <BookHinge className="top-[62px]" />
            <BookHinge className="top-1/2 -translate-y-1/2" />
            <BookHinge className="bottom-[62px]" />

            <form
              onSubmit={handleLogin}
              className="relative isolate flex min-h-[360px] h-full flex-col overflow-hidden rounded-[24px] border border-[#2B8FA3]/40 bg-[linear-gradient(155deg,rgba(241,252,252,0.97)_0%,rgba(213,241,244,0.96)_54%,rgba(177,225,232,0.95)_100%)] p-5 shadow-[0_26px_64px_rgba(15,97,119,0.22),inset_0_0_58px_rgba(255,255,255,0.42)] backdrop-blur-md sm:min-h-[390px] sm:p-6 md:min-h-[430px] lg:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[19px] border border-[#238FA5]/18"
              />
              <NauticalCorners />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.62),transparent_34%),radial-gradient(circle_at_12%_90%,rgba(18,151,173,0.10),transparent_35%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_49%,transparent_50%)]"
              />

              <div className="relative z-10 mx-auto flex w-full max-w-[390px] flex-1 flex-col">
                <header className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#18849A]/38 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,0.94),rgba(190,234,239,0.92)_70%)] text-[#B17E2E] shadow-[0_8px_24px_rgba(15,97,119,0.12),inset_0_0_18px_rgba(255,255,255,0.55)]">
                    <Anchor className="h-5 w-5" strokeWidth={1.55} />
                  </div>

                  <h2 className="mt-3 font-cinzel text-[22px] font-black uppercase tracking-[0.02em] text-[#163E51] sm:text-[24px] md:text-[25px]">
                    Captain&apos;s Login
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-[315px] text-[9px] leading-4 text-[#4E7481] sm:text-[10px]">
                    Access your dashboard and command your journey.
                  </p>
                </header>

                <div className="my-3.5 flex items-center gap-3 text-[#238FA5]" aria-hidden="true">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
                  <span className="h-1.5 w-1.5 rotate-45 border border-current" />
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#315B6B]">
                      Email address
                    </span>
                    <span className="relative block">
                      <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]"
                        strokeWidth={1.7}
                      />
                      <input
                        type="email"
                        autoComplete="email"
                        value={credentials.email}
                        onChange={(event) =>
                          setCredentials({
                            ...credentials,
                            email: event.target.value,
                          })
                        }
                        placeholder="you@college.edu"
                        className="h-[44px] w-full rounded-[9px] border border-[#238FA5]/35 bg-white/68 pl-10 pr-3 text-sm text-[#153C4E] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition duration-200 placeholder:text-[#7194A0] focus:border-[#0D7892] focus:bg-white/82 focus:shadow-[0_0_0_3px_rgba(13,120,146,0.10),inset_0_0_18px_rgba(255,255,255,0.35)]"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#315B6B]">
                      Password
                    </span>
                    <span className="relative block">
                      <LockKeyhole
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D7892]"
                        strokeWidth={1.7}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={credentials.password}
                        onChange={(event) =>
                          setCredentials({
                            ...credentials,
                            password: event.target.value,
                          })
                        }
                        placeholder="Enter your password"
                        className="h-[44px] w-full rounded-[9px] border border-[#238FA5]/35 bg-white/68 pl-10 pr-11 text-sm text-[#153C4E] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition duration-200 placeholder:text-[#7194A0] focus:border-[#0D7892] focus:bg-white/82 focus:shadow-[0_0_0_3px_rgba(13,120,146,0.10),inset_0_0_18px_rgba(255,255,255,0.35)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#537B88] transition hover:bg-[#0D7892]/10 hover:text-[#0D7892] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7892]/35"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>
                </div>

                {loginError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg border border-red-400/25 bg-red-50/85 px-3 py-2 text-[11px] leading-5 text-red-700"
                  >
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="group mt-4 flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-[#0D7892]/35 bg-[linear-gradient(135deg,#0D7892_0%,#159CB3_52%,#4BC0CF_100%)] px-4 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_9px_24px_rgba(16,113,137,0.22)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_11px_30px_rgba(16,113,137,0.28)] active:translate-y-0"
                >
                  <Compass
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                    strokeWidth={2}
                  />
                  Board the flagship
                </button>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-center gap-2 border-t border-[#238FA5]/16 pt-3 text-center text-[8px] leading-4 text-[#557B87] sm:text-[10px]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-[#0D7892]"
                      strokeWidth={1.7}
                    />
                    <span>Secure login. Your voyage awaits in protected waters.</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
        </main>
        <ContactFooter />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen px-4 pb-16 pt-32 text-[#F4EBD9] sm:px-6">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-5 rounded-3xl border border-[#C5A25F]/30 bg-[#020610]/80 p-6 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="mb-2 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A25F]">Ambassador dashboard</span>
            <h1 className="font-cinzel text-3xl font-bold">Welcome, Aditya</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">MNNIT Allahabad · Campus Ambassador</p>
          </div>
          <div className="rounded-2xl border border-[#C5A25F]/40 bg-[#C5A25F]/10 p-4 sm:min-w-52">
            <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]">Your promo code</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-widest text-[#E1C276]">ADITYA26</p>
            <p className="mt-1 text-[10px] text-[#94A3B8]">Share this code with your campus</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Assigned tasks", tasks.length, ClipboardList],
            ["Completed", tasks.filter((task) => task.status === "Completed").length, CheckCircle2],
            ["Registrations", "24", GraduationCap],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-[#C5A25F]/20 bg-[#041021]/80 p-5 backdrop-blur-xl">
              <Icon className="mb-3 h-5 w-5 text-[#C5A25F]" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-[#94A3B8]">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-[#C5A25F]/20 bg-[#041021]/80 p-5 backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="font-cinzel text-2xl font-bold">Assigned tasks</h2>
            <p className="mt-1 text-xs text-[#94A3B8]">Keep your task status and completion notes up to date.</p>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-2xl border border-[#C5A25F]/15 bg-[#020610]/80 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{task.description}</p>
                  </div>
                  <select
                    value={task.status}
                    onChange={(event) => updateTask(task.id, "status", event.target.value)}
                    className="rounded-lg border border-[#C5A25F]/30 bg-[#041021] px-3 py-2 text-xs font-semibold text-[#E1C276] outline-none"
                  >
                    {statusOptions.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={task.remarks}
                    onChange={(event) => updateTask(task.id, "remarks", event.target.value)}
                    placeholder="Add completion details or remarks"
                    className="flex-1 rounded-lg border border-[#C5A25F]/15 bg-[#041021] px-3 py-2 text-xs text-white outline-none focus:border-[#C5A25F]"
                  />
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C5A25F]/40 px-4 py-2 text-xs font-bold text-[#E1C276] transition hover:bg-[#C5A25F]/10">
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
      </main>
      <ContactFooter />
    </>
  );
}
