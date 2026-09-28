import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Anchor, LoaderCircle } from "lucide-react";
import { ambassadorApi } from "../lib/server1-api";
import "./campus-ambassador.css";

export default function CampusAmbassadorLayout() {
  const [ambassador, setAmbassador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionNotice, setSessionNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = /\/dashboard\/?$/.test(pathname);

  const handleAuthError = useCallback((requestError) => {
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
    let active = true;
    ambassadorApi.me().then((data) => {
      if (active) setAmbassador(data.ambassador);
    }).catch((requestError) => {
      if (!active) return;
      if (requestError.status !== 401 && requestError.code !== "ACCOUNT_DISABLED") {
        setError("We couldn't reach the sign-in service. Check your connection and try again.");
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  // Revalidate on return to the tab and periodically so revoked/expired sessions leave the dashboard.
  useEffect(() => {
    if (!ambassador) return;
    const check = () => {
      if (document.visibilityState !== "visible") return;
      ambassadorApi.me().catch(handleAuthError);
    };
    const timer = setInterval(check, 60000);
    window.addEventListener("focus", check);
    return () => { clearInterval(timer); window.removeEventListener("focus", check); };
  }, [ambassador, handleAuthError]);

  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      await ambassadorApi.logout();
      setSessionNotice("");
      setAmbassador(null);
      navigate("/campus-ambassador", { replace: true });
    } catch {
      setError("We couldn't sign you out. Please try Logout again.");
    } finally { setLoggingOut(false); }
  }

  let content;
  if (loading) content = <div className="ca-gate" role="status"><LoaderCircle className="animate-spin" /> Restoring your session…</div>;
  else if (error && !ambassador) content = <div className="ca-gate"><Anchor /><p role="alert">{error}</p><button className="ca-btn-primary" onClick={() => { setLoading(true); setError(""); setAttempt((n) => n + 1); }}>Try again</button></div>;
  else if (isDashboard && !ambassador) content = <Navigate to="/campus-ambassador" replace />;
  else if (!isDashboard && ambassador) content = <Navigate to="/campus-ambassador/dashboard" replace />;
  else content = <Outlet context={{ ambassador, setAmbassador: (next) => { setAmbassador(next); setSessionNotice(""); }, sessionNotice, logout, loggingOut, handleAuthError }} />;

  return <div className={isDashboard ? "ca-portal" : "ca-sign-in"}>{error && ambassador && <div className="ca-session-error" role="alert">{error}</div>}{content}</div>;
}
