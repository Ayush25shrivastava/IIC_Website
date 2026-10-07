import { useEffect, useState, lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Components
import RenaissanceIntro from "./components/RenaissanceIntro";
import Navbar from "./components/Navbar";
import AdisyonShader from "./components/ui/adisyon-shader";
import SmoothScroll from "./components/SmoothScroll";
import PageTransitionShimmer from "./components/PageTransitionShimmer";
import { useSmoothScroll } from "./lib/smoothScroll";

// Home page is eagerly loaded for instant interactive entry
import Home from "./pages/Home";

// Code-split secondary routes on demand
const Events = lazy(() => import("./pages/Events"));
const Registration = lazy(() => import("./pages/Registration"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Teams = lazy(() => import("./pages/Teams"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const Gallery = lazy(() => import("./pages/Gallery"));
const LoginSuccess = lazy(() => import("./pages/LoginSuccess"));
const Login = lazy(() => import("./pages/Login"));
const CampusAmbassador = lazy(() => import("./pages/CampusAmbassadorPortal"));
const CampusAmbassadorLayout = lazy(() => import("./pages/CampusAmbassadorLayout"));
const CampusAmbassadorDashboard = lazy(() => import("./pages/CampusAmbassadorDashboard"));
const AdminSession = lazy(() => import("./pages/AdminSession"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CampusAmbassadorAdmin = lazy(() => import("./pages/CampusAmbassadorAdmin"));
const TicketsAccommodation = lazy(() => import("./pages/TicketsAccommodation"));
const TicketsAdmin = lazy(() => import("./pages/TicketsAdmin"));
const SupportUs = lazy(() => import("./pages/SupportUs"));

function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    scrollTo(0, {
      immediate: true,
      force: true,
    });
  }, [pathname, scrollTo]);

  return null;
}

function PublicChrome({ showIntro, onIntroComplete }) {
  const { pathname } = useLocation();
  if (/^\/admin(?:\/|$)/.test(pathname)) return null;
  return <>
    <PageTransitionShimmer />
    <AdisyonShader className="fixed inset-0 z-0 opacity-90 mix-blend-screen pointer-events-none" />
    {showIntro && <RenaissanceIntro onComplete={onIntroComplete} onSkip={onIntroComplete} />}
    <Navbar key={pathname} />
  </>;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !/\/admin(?:\/|$)/.test(window.location.pathname));

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const hasRenaissanceBase =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/renaissance");

  const viteBasename =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  const routerBasename =
    viteBasename || (hasRenaissanceBase ? "/renaissance" : "");

  return (
    <BrowserRouter basename={routerBasename}>
      <SmoothScroll>
        {/* Reset smooth scroll position whenever route changes */}
        <ScrollToTop />

        <PublicChrome showIntro={showIntro} onIntroComplete={handleIntroComplete} />

        {/* Main route views */}
        <div className="renaissance-page-shell relative z-10 min-h-screen w-full overflow-x-clip bg-transparent text-[#F4EBD9]">
          <Suspense
            fallback={<div className="min-h-screen bg-transparent" />}
          >
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              <Route
                path="/udbhav"
                element={<Navigate to="/" replace />}
              />

              {/* Sponsors */}
              <Route path="/sponsors" element={<Sponsors />} />

              <Route
                path="/udbhav/sponsors"
                element={<Sponsors />}
              />

              {/* Registration */}
              <Route
                path="/register"
                element={<Registration />}
              />

              <Route
                path="/events/:eventId/register"
                element={<Registration />}
              />

              <Route
                path="/udbhav/events/:eventId/register"
                element={<Registration />}
              />

              {/* Events */}
              <Route path="/events" element={<Events />} />

              <Route
                path="/udbhav/events"
                element={<Events />}
              />

              {/* Tickets & Accommodation */}
              <Route
                path="/tickets-accommodation"
                element={<TicketsAccommodation />}
              />
              <Route
                path="/udbhav/tickets-accommodation"
                element={<TicketsAccommodation />}
              />
              <Route
                path="/admin/tickets"
                element={<TicketsAdmin />}
              />

              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/udbhav/dashboard"
                element={<Dashboard />}
              />

              {/* Teams */}
              <Route path="/teams" element={<Teams />} />

              <Route
                path="/udbhav/teams"
                element={<Teams />}
              />

              {/* Gallery */}
              <Route path="/gallery" element={<Gallery />} />

              <Route
                path="/udbhav/gallery"
                element={<Gallery />}
              />

              {/* Support Us */}
              <Route path="/support-us" element={<SupportUs />} />

              <Route
                path="/udbhav/support-us"
                element={<SupportUs />}
              />

              {/* Auth callback */}
              <Route path="/login" element={<Login />} />

              <Route path="/campus-ambassador" element={<CampusAmbassadorLayout />}>
                <Route index element={<CampusAmbassador />} />
                <Route path="dashboard" element={<CampusAmbassadorDashboard />} />
              </Route>

              {/* Keep previously shared dashboard and login URLs working. */}
              <Route
                path="/campus-ambassador/dashboard"
                element={<Navigate to="/campus-ambassador" replace />}
              />

              <Route
                path="/admin"
                element={<CampusAmbassadorAdmin />}
              />

              <Route
                path="/admin/login"
                element={<Navigate to="/admin" replace />}
              />

              <Route
                path="/admin/campus-ambassadors"
                element={<Navigate to="/admin" replace />}
              />

              <Route
                path="/campus-ambassador/admin"
                element={<Navigate to="/admin" replace />}
              />

              <Route
                path="/login/success"
                element={<LoginSuccess />}
              />

              <Route
                path="/udbhav/login/success"
                element={<LoginSuccess />}
              />

              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </Suspense>
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}
