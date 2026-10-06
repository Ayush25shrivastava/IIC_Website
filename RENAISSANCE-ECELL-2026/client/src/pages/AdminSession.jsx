import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminApi } from "../lib/server1-api";
import "./admin-dashboard.css";

export default function AdminSession() {
  const [admin, setAdmin] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const visitRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const loginPage = /\/login\/?$/.test(pathname);
  const handleError = useCallback((err) => {
    if (!visitRef.current?.active) return true;
    if (err.status === 401 || err.status === 403) {
      visitRef.current.authenticated = false;
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
    const visit = { active: true, authenticated: false, pendingLogin: false };
    visitRef.current = visit;

    // Never restore cookies from a previous visit, including a force-closed browser.
    // Keep the form available offline and retry cleanup before accepting a login.
    visit.reset = adminApi.logout();
    void visit.reset.catch(() => {});

    const endVisit = () => {
      if (!visit.active) return;
      visit.active = false;
      if (visit.authenticated || visit.pendingLogin) {
        void adminApi.logout({ keepalive: true }).catch(() => {});
      }
    };
    const onPageHide = () => {
      endVisit();
      setAdmin(null);
    };
    const onPageShow = (event) => {
      if (!event.persisted) return;
      setAdmin(null);
      setAttempt((value) => value + 1);
    };
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      endVisit();
    };
  }, [attempt]);

  async function login(credentials) {
    const visit = visitRef.current;
    if (!visit?.active) return false;
    visit.pendingLogin = true;
    try {
      await visit.reset.catch(() => {
        if (visit.active) return adminApi.logout();
      });
      if (!visit.active || visitRef.current !== visit) return false;
      const data = await adminApi.login(credentials);
      // Leaving during login queues revocation after the in-flight login request.
      if (!visit.active || visitRef.current !== visit) return false;
      visit.authenticated = true;
      setAdmin(data.admin);
      return true;
    } finally {
      visit.pendingLogin = false;
    }
  }

  useEffect(() => {
    if (!admin) return;
    let active = true;
    const check = () => {
      if (document.visibilityState !== "visible" || !visitRef.current?.active) return;
      adminApi.me().catch((err) => { if (active) handleError(err); });
    };
    const interval = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { active = false; clearInterval(interval); window.removeEventListener("focus", check); };
  }, [admin, handleError]);

  async function logout() {
    const visit = visitRef.current;
    await adminApi.logout(); // A failed revocation must not look like a successful logout.
    if (!visit?.active || visitRef.current !== visit) return;
    visit.authenticated = false;
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  }

  if (!admin && !loginPage) return <Navigate to="/admin/login" replace />;
  if (admin && loginPage) return <Navigate to="/admin/campus-ambassadors" replace />;
  return <Outlet context={{ admin, login, logout, handleError }} />;
}
