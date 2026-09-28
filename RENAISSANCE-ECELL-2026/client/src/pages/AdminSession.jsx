import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import "./admin-dashboard.css";

export default function AdminSession() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const loginPage = pathname.endsWith("/login");
  const handleError = useCallback((err) => {
    if (err.status === 401 || err.status === 403) {
      setAdmin(null);
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    const previousTitle = document.title;
    const existing = document.querySelector('meta[name="robots"]');
    const meta = existing || document.createElement("meta");
    const previousContent = meta.content;
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    if (!existing) document.head.append(meta);
    document.title = "Admin Command Center | Renaissance";
    return () => { document.title = previousTitle; if (existing) meta.content = previousContent; else meta.remove(); };
  }, []);

  useEffect(() => {
    let active = true;
    adminApi.me().then((data) => { if (active) setAdmin(data.admin); })
      .catch((err) => { if (active && err.status !== 401 && err.status !== 403) setError("We couldn't reach the admin service. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!admin) return;
    const check = () => { if (document.visibilityState === "visible") adminApi.me().catch(handleError); };
    const interval = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { clearInterval(interval); window.removeEventListener("focus", check); };
  }, [admin, handleError]);

  async function logout() {
    await adminApi.logout(); // A failed revocation must not look like a successful logout.
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  }

  if (loading) return <div className="admin-app admin-gate" role="status"><LoaderCircle className="animate-spin" /> Checking admin session…</div>;
  if (error) return <div className="admin-app admin-gate"><p role="alert">{error}</p><button onClick={() => { setError(""); setLoading(true); setAttempt((n) => n + 1); }}>Try again</button></div>;
  if (!admin && !loginPage) return <Navigate to="/admin/login" replace />;
  if (admin && loginPage) return <Navigate to="/admin/campus-ambassadors" replace />;
  return <Outlet context={{ admin, setAdmin, logout, handleError }} />;
}
