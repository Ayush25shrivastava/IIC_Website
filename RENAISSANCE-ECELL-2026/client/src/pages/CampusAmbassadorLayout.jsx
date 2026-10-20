import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ambassadorApi } from "../lib/server1-api";
import "./campus-ambassador.css";

export default function CampusAmbassadorLayout() {
  const [ambassador, setAmbassador] = useState(null);
  const [error, setError] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const visitRef = useRef(null);
  const pathnameRef = useRef("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = /\/dashboard\/?$/.test(pathname);
  pathnameRef.current = pathname;

  const handleAuthError = useCallback((requestError) => {
    if (!visitRef.current?.active) return true;
    if (requestError.status === 401 || requestError.code === "ACCOUNT_DISABLED") {
      setAmbassador(null);
      setSessionNotice(requestError.code === "ACCOUNT_DISABLED"
        ? "Your account is unavailable. Please contact the Renaissance team."
        : "Your session has expired. Please sign in again.");
      navigate("/campus-ambassador", { replace: true, state: {
        message: requestError.code === "ACCOUNT_DISABLED"
          ? "Your account is unavailable. Please contact the Renaissance team."
          : "Your session has expired. Please sign in again.",
      } });
      return true;
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    const visit = { active: true, pendingLogin: false };
    visitRef.current = visit;

    const restoreSession = async () => {
      try {
        const data = await ambassadorApi.me();
        if (!visit.active || visit.pendingLogin) return;
        setAmbassador(data.ambassador);
        setSessionNotice("");
      } catch (requestError) {
        if (!visit.active || visit.pendingLogin) return;
        if (requestError.status === 401 || requestError.code === "ACCOUNT_DISABLED") {
          setAmbassador(null);
          if (/\/dashboard\/?$/.test(pathnameRef.current)) {
            if (requestError.code === "ACCOUNT_DISABLED") {
              const message = "Your account is unavailable. Please contact the Renaissance team.";
              setSessionNotice(message);
              navigate("/campus-ambassador", { replace: true, state: { message } });
            } else {
              navigate("/campus-ambassador", { replace: true });
            }
          }
        }
      } finally {
        if (visit.active && !visit.pendingLogin) setCheckingSession(false);
      }
    };

    void restoreSession();

    // Do not revoke the server session on reload or tab close. Explicit Logout
    // revokes only the session represented by this browser's cookies.
    const onPageHide = () => { visit.active = false; };
    const onPageShow = (event) => {
      if (!event.persisted) return;
      setAmbassador(null);
      setError("");
      setCheckingSession(true);
      setAttempt((value) => value + 1);
    };
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      visit.active = false;
    };
  }, [attempt, navigate]);

  async function login(credentials) {
    const visit = visitRef.current;
    if (!visit?.active) return false;
    visit.pendingLogin = true;
    try {
      if (!visit.active || visitRef.current !== visit) return false;
      const data = await ambassadorApi.login(credentials);
      if (!visit.active || visitRef.current !== visit) return false;
      setAmbassador(data.ambassador);
      setSessionNotice("");
      return true;
    } finally {
      visit.pendingLogin = false;
      if (visit.active && visitRef.current === visit) setCheckingSession(false);
    }
  }

  // Revalidate on return to the tab and periodically so revoked/expired sessions leave the dashboard.
  useEffect(() => {
    if (!ambassador) return;
    let active = true;
    const check = () => {
      if (document.visibilityState !== "visible" || !visitRef.current?.active) return;
      ambassadorApi.me().catch((requestError) => { if (active) handleAuthError(requestError); });
    };
    const timer = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", check); };
  }, [ambassador, handleAuthError]);

  async function logout() {
    const visit = visitRef.current;
    setLoggingOut(true);
    setError("");
    try {
      await ambassadorApi.logout();
      if (!visit?.active || visitRef.current !== visit) return;
      setSessionNotice("");
      setAmbassador(null);
      navigate("/campus-ambassador", { replace: true });
    } catch {
      setError("We couldn't sign you out. Please try Logout again.");
    } finally { setLoggingOut(false); }
  }

  let content;
  if (isDashboard && checkingSession) content = <div className="ca-gate" role="status">Checking your session…</div>;
  else if (isDashboard && !ambassador) content = <Navigate to="/campus-ambassador" replace />;
  else if (!isDashboard && ambassador) content = <Navigate to="/campus-ambassador/dashboard" replace />;
  else content = <Outlet context={{ ambassador, login, sessionNotice, logout, loggingOut, handleAuthError }} />;

  return <div className={isDashboard ? "ca-portal" : "ca-sign-in"}>{error && ambassador && <div className="ca-session-error" role="alert">{error}</div>}{content}</div>;
}
