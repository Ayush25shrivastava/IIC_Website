import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import { localAdminMode, LOCAL_ADMIN } from "../lib/local-admin";
import "./admin-dashboard.css";

export default function AdminSession() {
  const [admin, setAdmin] = useState(localAdminMode ? LOCAL_ADMIN : null);
  const [loading, setLoading] = useState(!localAdminMode);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const loginPage = pathname.endsWith("/login");
  const adminEntry = /^\/admin\/?$/.test(pathname);
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
    if (localAdminMode) return;
    let active = true;
    adminApi.me().then((data) => { if (active) setAdmin(data.admin); })
      .catch((err) => { if (active && err.status !== 401 && err.status !== 403) setError("We couldn't reach the admin service. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!admin || localAdminMode) return;
    const check = () => { if (document.visibilityState === "visible") adminApi.me().catch(handleError); };
    const interval = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { clearInterval(interval); window.removeEventListener("focus", check); };
  }, [admin, handleError]);

  async function logout() {
    if (localAdminMode) { navigate("/"); return; }
    await adminApi.logout(); // A failed revocation must not look like a successful logout.
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  }

  // Navigation and the sign-in form must work even when the API is offline.
  const context = { admin, setAdmin, logout, handleError };
  if (localAdminMode && pathname.endsWith("/tickets")) return <Navigate to="/admin/campus-ambassadors" replace />;
  if (adminEntry) return <Navigate to={admin ? "/admin/campus-ambassadors" : "/admin/login"} replace />;
  if (loginPage) return admin ? <Navigate to="/admin/campus-ambassadors" replace /> : <Outlet context={context} />;
  if (loading && !admin) return <div className="admin-app admin-gate" role="status"><LoaderCircle className="animate-spin" /> Checking admin session…</div>;
  if (error && !admin) return <div className="admin-app admin-gate"><p role="alert">{error}</p><button onClick={() => { setError(""); setLoading(true); setAttempt((n) => n + 1); }}>Try again</button><button onClick={() => navigate("/admin/login")}>Go to admin sign-in</button></div>;
  if (!admin && !loginPage) return <Navigate to="/admin/login" replace />;
  return <Outlet context={context} />;
}
