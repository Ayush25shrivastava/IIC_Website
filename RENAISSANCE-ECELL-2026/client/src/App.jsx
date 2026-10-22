import { useEffect, useState, lazy, Suspense } from "react";
import "./pages/campus-ambassador.css";

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
import { prefetchTeamPhotos } from "./lib/server1-api";
import SEO from "./components/SEO";

const renaissanceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Renaissance'26 - 10th Edition",
  "description": "Annual Entrepreneurship Summit of MNNIT Allahabad organized by E-Cell.",
  "url": "https://iic.mnnit.ac.in/renaissance",
  "image": "https://iic.mnnit.ac.in/renaissance-logo.png",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "organizer": {
    "@type": "Organization",
    "name": "E-Cell MNNIT Allahabad",
    "url": "https://iic.mnnit.ac.in/renaissance"
  },
  "location": {
    "@type": "Place",
    "name": "MNNIT Allahabad",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Barrister Mullah Colony, Teliarganj",
      "addressLocality": "Prayagraj",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "211004",
      "addressCountry": "IN"
    }
  }
};

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
const CampusAmbassador = lazy(() => import("./pages/CampusAmbassadorPortal"));
const CampusAmbassadorLayout = lazy(() => import("./pages/CampusAmbassadorLayout"));
const CampusAmbassadorDashboard = lazy(() => import("./pages/CampusAmbassadorDashboard"));
const AdminSession = lazy(() => import("./pages/AdminSession"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CampusAmbassadorAdmin = lazy(() => import("./pages/CampusAmbassadorAdmin"));
const TicketsAccommodation = lazy(() => import("./pages/TicketsAccommodation"));
const TicketsAdmin = lazy(() => import("./pages/TicketsAdmin"));
const VolunteerManagement = lazy(() => import("./pages/VolunteerManagement"));
const VolunteerScanner = lazy(() => import("./pages/VolunteerScanner"));
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
  if (/^\/(?:admin|volunteer)(?:\/|$)/.test(pathname)) return null;
  return <>
    <PageTransitionShimmer />
    <AdisyonShader className="fixed inset-0 z-0 opacity-90 mix-blend-screen pointer-events-none" />
    {showIntro && <RenaissanceIntro onComplete={onIntroComplete} onSkip={onIntroComplete} />}
    <Navbar key={pathname} />
  </>;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !/^\/(?:admin|volunteer)(?:\/|$)/.test(window.location.pathname));

  useEffect(() => {
    // Start prefetching team photos and images immediately upon website entrance
    prefetchTeamPhotos();
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const hasRenaissanceBase =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/renaissance");

  const configuredBaseUrl = import.meta.env.BASE_URL;
  // Relative Vite bases ("./") keep bundled assets working under either the
  // domain root or /renaissance, but must not become React Router basenames.
  const viteBasename =
    configuredBaseUrl.startsWith("/") && configuredBaseUrl !== "/"
      ? configuredBaseUrl.replace(/\/$/, "")
      : "";

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
              <Route
                path="/"
                element={
                  <>
                    <SEO
                      title="Renaissance'26 | 10th Edition • E-Cell MNNIT Allahabad"
                      description="Official website of Renaissance'26, the 10th edition of annual entrepreneurship summit organized by E-Cell MNNIT Allahabad. Register for startup competitions, workshops, and speaker sessions."
                      canonical="https://iic.mnnit.ac.in/renaissance"
                      jsonLd={renaissanceJsonLd}
                    />
                    <Home />
                  </>
                }
              />

              <Route
                path="/udbhav"
                element={<Navigate to="/" replace />}
              />

              {/* Sponsors */}
              <Route
                path="/sponsors"
                element={
                  <>
                    <SEO
                      title="Sponsors & Partners | Renaissance'26 • MNNIT Allahabad"
                      description="Explore the sponsors, industrial partners, and associates powering Renaissance'26 E-Summit at MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/sponsors"
                    />
                    <Sponsors />
                  </>
                }
              />

              <Route
                path="/udbhav/sponsors"
                element={<Sponsors />}
              />

              {/* Registration */}
              <Route
                path="/register"
                element={
                  <>
                    <SEO
                      title="Register | Renaissance'26 • E-Cell MNNIT Allahabad"
                      description="Register now for events, competitions, and masterclasses at Renaissance'26, MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/register"
                    />
                    <Registration />
                  </>
                }
              />

              <Route
                path="/events/:eventId/register"
                element={
                  <>
                    <SEO
                      title="Event Registration | Renaissance'26 • MNNIT Allahabad"
                      description="Register for flagship competitions at Renaissance'26, MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/register"
                    />
                    <Registration />
                  </>
                }
              />

              <Route
                path="/udbhav/events/:eventId/register"
                element={<Registration />}
              />

              {/* Events */}
              <Route
                path="/events"
                element={
                  <>
                    <SEO
                      title="Events & Competitions | Renaissance'26 • MNNIT Allahabad"
                      description="Explore flagship competitions including B-Plan (Fish Tank), Strategy Wiz, Business Wars, and Creative Quest at Renaissance'26."
                      canonical="https://iic.mnnit.ac.in/renaissance/events"
                    />
                    <Events />
                  </>
                }
              />

              <Route
                path="/udbhav/events"
                element={<Events />}
              />

              {/* Tickets & Accommodation */}
              <Route
                path="/tickets-accommodation"
                element={
                  <>
                    <SEO
                      title="Tickets & Accommodation | Renaissance'26 • MNNIT Allahabad"
                      description="Secure official attendee passes, summit merchandise, and campus accommodation for Renaissance'26."
                      canonical="https://iic.mnnit.ac.in/renaissance/tickets-accommodation"
                    />
                    <TicketsAccommodation />
                  </>
                }
              />
              <Route
                path="/volunteer"
                element={
                  <>
                    <SEO
                      title="Volunteer Scanner | Renaissance'26"
                      robots="noindex, nofollow"
                    />
                    <VolunteerScanner />
                  </>
                }
              />
              <Route
                path="/udbhav/tickets-accommodation"
                element={<TicketsAccommodation />}
              />
              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <>
                    <SEO
                      title="User Dashboard | Renaissance'26"
                      robots="noindex, nofollow"
                    />
                    <Dashboard />
                  </>
                }
              />

              <Route
                path="/udbhav/dashboard"
                element={<Dashboard />}
              />

              {/* Teams */}
              <Route
                path="/teams"
                element={
                  <>
                    <SEO
                      title="Our Team | Renaissance'26 • E-Cell MNNIT Allahabad"
                      description="Meet the core organizing committee, student coordinators, and mentors of Renaissance'26 E-Cell MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/teams"
                    />
                    <Teams />
                  </>
                }
              />

              <Route
                path="/udbhav/teams"
                element={<Teams />}
              />

              {/* Gallery */}
              <Route
                path="/gallery"
                element={
                  <>
                    <SEO
                      title="Gallery | Renaissance'26 • E-Cell MNNIT Allahabad"
                      description="Glimpses, memories, and captured moments from editions of Renaissance E-Summit at MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/gallery"
                    />
                    <Gallery />
                  </>
                }
              />

              <Route
                path="/udbhav/gallery"
                element={<Gallery />}
              />

              {/* Support Us */}
              <Route
                path="/support-us"
                element={
                  <>
                    <SEO
                      title="Support Us | Renaissance'26 • E-Cell MNNIT Allahabad"
                      description="Support student entrepreneurship and innovation initiatives at Renaissance'26, MNNIT Allahabad."
                      canonical="https://iic.mnnit.ac.in/renaissance/support-us"
                    />
                    <SupportUs />
                  </>
                }
              />

              <Route
                path="/udbhav/support-us"
                element={<SupportUs />}
              />

              <Route path="/campus-ambassador" element={<CampusAmbassadorLayout />}>
                <Route
                  index
                  element={
                    <>
                      <SEO
                        title="Campus Ambassador Program | Renaissance'26 • MNNIT Allahabad"
                        description="Become a Campus Ambassador for Renaissance'26. Represent your college, lead entrepreneurship drives, and unlock exclusive rewards."
                        canonical="https://iic.mnnit.ac.in/renaissance/campus-ambassador"
                      />
                      <CampusAmbassador />
                    </>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <>
                      <SEO
                        title="CA Dashboard | Renaissance'26"
                        robots="noindex, nofollow"
                      />
                      <CampusAmbassadorDashboard />
                    </>
                  }
                />
              </Route>

              {/* Keep previously shared dashboard and login URLs working. */}
              <Route
                path="/campus-ambassador/dashboard"
                element={<Navigate to="/campus-ambassador" replace />}
              />

              <Route path="/admin" element={<AdminSession />}>
                <Route index element={<Navigate to="campus-ambassadors" replace />} />
                <Route path="login" element={<AdminLogin />} />
                <Route path="campus-ambassadors" element={<CampusAmbassadorAdmin />} />
                <Route path="tickets" element={<TicketsAdmin />} />
                <Route path="volunteer" element={<VolunteerManagement />} />
              </Route>
              <Route path="/campus-ambassador/admin" element={<Navigate to="/admin" replace />} />

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
