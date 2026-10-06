import { useState } from "react";
import { CheckCircle2, ClipboardList, GraduationCap, LockKeyhole, Save } from "lucide-react";
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

export default function CampusAmbassador() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [tasks, setTasks] = useState(initialTasks);
  const [loginError, setLoginError] = useState("");

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
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_45%)] px-4 pb-16 pt-32 text-[#173247] sm:px-6">
          <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/25 shadow-[0_24px_70px_rgba(12,43,61,0.3)] backdrop-blur-2xl md:grid-cols-2">
          <div className="relative flex flex-col justify-center overflow-hidden bg-white/20 p-7 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#0EA5E9]/15 blur-3xl" />
            <span className="relative mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#9E6D1F]/45 bg-white/45 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#815719] shadow-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              Campus Ambassador Portal
            </span>
            <h1 className="relative mb-4 font-cinzel text-3xl font-bold leading-tight text-[#102C40] sm:text-4xl">
              Lead the voyage from your campus.
            </h1>
            <p className="relative max-w-md text-sm leading-7 text-[#365467]">
              Manage your ambassador tasks, share your unique promo code, and
              help your campus experience Renaissance 2026.
            </p>
            <div className="relative mt-8 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-sm backdrop-blur-xl">
                <p className="mb-1 text-[#527486]">Event dates</p>
                <p className="font-semibold text-[#173247]">25–26 October 2026</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-sm backdrop-blur-xl">
                <p className="mb-1 text-[#527486]">Your role</p>
                <p className="font-semibold text-[#173247]">Campus Captain</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="border-t border-white/60 bg-white/35 p-7 backdrop-blur-2xl sm:p-12 md:border-l md:border-t-0">
            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C5A25F]/40 bg-[#F4EBD9]/70 text-[#815719] shadow-sm">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold text-[#102C40]">Ambassador login</h2>
              <p className="mt-2 text-xs leading-6 text-[#527486]">
                Use the credentials issued by the Renaissance team.
              </p>
            </div>
            <label className="mb-4 block text-xs font-semibold uppercase tracking-wider text-[#365467]">
              Email address
              <input
                type="email"
                value={credentials.email}
                onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                placeholder="you@college.edu"
                className="mt-2 w-full rounded-xl border border-white/80 bg-white/55 px-4 py-3 text-sm text-[#173247] shadow-inner outline-none transition placeholder:text-[#6B8492] focus:border-[#C5A25F] focus:bg-white/75"
              />
            </label>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#365467]">
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-white/80 bg-white/55 px-4 py-3 text-sm text-[#173247] shadow-inner outline-none transition placeholder:text-[#6B8492] focus:border-[#C5A25F] focus:bg-white/75"
              />
            </label>
            {loginError && <p className="mt-3 text-xs text-red-300">{loginError}</p>}
            <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A25F] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#020610] transition hover:bg-[#E1C276]">
              Enter portal
            </button>
            <p className="mt-5 text-center text-[11px] text-[#527486]">
              Demo portal: any non-empty credentials will open the dashboard.
            </p>
          </form>
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
