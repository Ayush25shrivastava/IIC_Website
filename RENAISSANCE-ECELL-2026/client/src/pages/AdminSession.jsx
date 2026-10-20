import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { adminApi } from "../lib/server1-api";
import { localAdminMode, LOCAL_ADMIN } from "../lib/local-admin";
import { adminStyles } from "../lib/adminStyles";

export default function AdminSession() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
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
    let active = true;
    adminApi.me().then((data) => {
      if (active) setAdmin(data.admin);
    })
      .catch((err) => {
        if (!active) return;
        if (localAdminMode) {
          // If on localhost and not authenticated, fallback to local admin for photo management
          setAdmin((curr) => (curr && curr.id !== "local-admin" ? curr : LOCAL_ADMIN));
          return;
        }
        if (err.status !== 401 && err.status !== 403) {
          setError("We couldn't reach the admin service. Please try again.");
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!admin || admin.id === "local-admin") return;
    const check = () => { if (document.visibilityState === "visible") adminApi.me().catch(handleError); };
    const interval = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { clearInterval(interval); window.removeEventListener("focus", check); };
  }, [admin, handleError]);

  async function logout() {
    try { await adminApi.logout(); } catch { /* Ignore network errors on logout */ }
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  }

  // Navigation and the sign-in form must work even when the API is offline.
  const isRealAdmin = admin && admin.id !== "local-admin";
  const context = { admin, setAdmin, logout, handleError };
  if (adminEntry) return <Navigate to={admin ? "/admin/campus-ambassadors" : "/admin/login"} replace />;
  if (loginPage) return isRealAdmin ? <Navigate to="/admin/campus-ambassadors" replace /> : <Outlet context={context} />;
  if (loading && !admin) return <div className={adminStyles.gate} role="status"><LoaderCircle className="animate-spin text-[#0d7892]" size={28} /> Checking admin session…</div>;
  if (error && !admin) return <div className={adminStyles.gate}><p role="alert" className="text-[#933830] font-semibold">{error}</p><button className={adminStyles.btn} onClick={() => { setError(""); setLoading(true); setAttempt((n) => n + 1); }}>Try again</button><button className={adminStyles.btn} onClick={() => navigate("/admin/login")}>Go to admin sign-in</button></div>;
  if (!admin && !loginPage) return <Navigate to="/admin/login" replace />;
  if ((pathname.endsWith("/tickets") || pathname.endsWith("/volunteer")) && !isRealAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet context={context} />;
}
