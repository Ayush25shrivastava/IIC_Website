import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import { adminStyles } from "../lib/adminStyles";
import logo from "../assets/renaissance-logo.png";

export default function AdminLogin() {
  const { setAdmin } = useOutletContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const field = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
  async function submit(event) {
    event.preventDefault();
    setError(""); setBusy(true);
    try {
      const data = await adminApi.login({ email: form.email, password: form.password });
      setAdmin(data.admin);
      setForm({ email: "", password: "" });
      // Fixed internal destination: query-string return URLs are intentionally ignored.
      navigate("/admin/campus-ambassadors", { replace: true });
    } catch (err) { setError(err.status ? err.message : "Could not reach the admin service. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className={adminStyles.loginMain}>
    <section className={adminStyles.loginCard}>
      <img src={logo} alt="Renaissance" className={adminStyles.loginLogo} />
      <span className={`flex gap-2 items-center text-[#8d702f] mb-[18px] ${adminStyles.kicker}`}><ShieldCheck size={18} /> Admin command center</span>
      <h1 className="font-cinzel text-[31px] font-semibold leading-[1.25] m-0 text-[#173f52]">Welcome aboard.</h1>
      <p className="mt-3 mb-[26px] text-[#527e8e]">Sign in to guide your campus ambassador crew.</p>
      <form onSubmit={submit} className={adminStyles.form}>
        <label className="grid gap-[7px] font-semibold text-[#173f52]">Admin email<input type="email" autoComplete="username" required {...field("email")} className={adminStyles.input} /></label>
        <label className="grid gap-[7px] font-semibold text-[#173f52]">Password<span className={adminStyles.passwordWrapper}><input type={show ? "text" : "password"} autoComplete="current-password" required {...field("password")} className={adminStyles.passwordInput} /><button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className={adminStyles.passwordToggle}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
        {error && <p className={adminStyles.alert} role="alert">{error}</p>}
        <button className={adminStyles.btnGold} disabled={busy}>{busy ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />}Sign in</button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#376579] hover:text-[#173f52] transition-colors">
          <ArrowLeft size={14} /> Return to website
        </Link>
      </div>
      <small className="block text-center mt-[24px] text-[#527e8e] font-mono tracking-[0.1em] text-[12px]">E-CELL · MNNIT ALLAHABAD</small>
    </section>
  </main>;
}
