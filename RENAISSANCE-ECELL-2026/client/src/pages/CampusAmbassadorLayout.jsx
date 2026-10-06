import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ambassadorApi } from "../lib/server1-api";
import "./campus-ambassador.css";

export default function CampusAmbassadorLayout() {
  const [ambassador, setAmbassador] = useState(null);
  const [error, setError] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const visitRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = /\/dashboard\/?$/.test(pathname);

  const handleAuthError = useCallback((requestError) => {
    if (!visitRef.current?.active) return true;
    if (requestError.status === 401 || requestError.code === "ACCOUNT_DISABLED") {
      visitRef.current.authenticated = false;
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
    const visit = { active: true, authenticated: false, pendingLogin: false };
    visitRef.current = visit;

    // Never restore a previous visit from cookies, even if the browser was
    // force-closed and could not deliver its pagehide logout request.
    // Show the login form immediately; network/database availability must not
    // prevent signed-out visitors from reaching it. Retry cleanup on submit.
    visit.reset = ambassadorApi.logout();
    void visit.reset.catch(() => {});

    const endVisit = () => {
      if (!visit.active) return;
      visit.active = false;
      if (visit.authenticated || visit.pendingLogin) {
        // Keep the revocation request alive during navigation/tab closure.
        // A failed delivery is retried by the next portal visit above.
        void ambassadorApi.logout({ keepalive: true }).catch(() => {});
      }
    };
    const onPageHide = () => {
      endVisit();
      setAmbassador(null);
    };
    const onPageShow = (event) => {
      if (!event.persisted) return;
      setAmbassador(null);
      setError("");
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
        if (visit.active) return ambassadorApi.logout();
      });
      if (!visit.active || visitRef.current !== visit) return false;
      const data = await ambassadorApi.login(credentials);
      // A login response arriving after navigation must not reopen the portal.
      // endVisit queues server revocation behind that in-flight login.
      if (!visit.active || visitRef.current !== visit) return false;
      visit.authenticated = true;
      setAmbassador(data.ambassador);
      setSessionNotice("");
      return true;
    } finally {
      visit.pendingLogin = false;
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
      visit.authenticated = false;
      setSessionNotice("");
      setAmbassador(null);
      navigate("/campus-ambassador", { replace: true });
    } catch {
      setError("We couldn't sign you out. Please try Logout again.");
    } finally { setLoggingOut(false); }
  }

  let content;
  if (isDashboard && !ambassador) content = <Navigate to="/campus-ambassador" replace />;
  else if (!isDashboard && ambassador) content = <Navigate to="/campus-ambassador/dashboard" replace />;
  else content = <Outlet context={{ ambassador, login, sessionNotice, logout, loggingOut, handleAuthError }} />;

  return <div className={isDashboard ? "ca-portal" : "ca-sign-in"}>{error && ambassador && <div className="ca-session-error" role="alert">{error}</div>}{content}</div>;
}
