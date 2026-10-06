import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";
import logo from "../assets/renaissance-logo.png";

export default function AdminLogin() {
  const { login } = useOutletContext();
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
      if (!await login({ email: form.email, password: form.password })) return;
      setForm({ email: "", password: "" });
      // Fixed internal destination: query-string return URLs are intentionally ignored.
      navigate("/admin/campus-ambassadors", { replace: true });
    } catch (err) { setError(err.status ? err.message : "Could not reach the admin service. Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="admin-app admin-login">
    <section className="admin-panel admin-login-card">
      <img src={logo} alt="Renaissance" className="admin-logo" />
      <span className="admin-kicker"><ShieldCheck size={18} /> Admin command center</span>
      <h1>Welcome aboard.</h1>
      <p>Sign in to guide your campus ambassador crew.</p>
      <form onSubmit={submit}>
        <label>Admin email<input type="email" autoComplete="username" required {...field("email")} /></label>
        <label>Password<span className="admin-password"><input type={show ? "text" : "password"} autoComplete="current-password" required {...field("password")} /><button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        <button className="admin-gold" disabled={busy}>{busy ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />}Sign in</button>
      </form>
      <small>E-CELL · MNNIT ALLAHABAD</small>
    </section>
  </main>;
}
