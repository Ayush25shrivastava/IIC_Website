import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import LoginSuccess from './components/LoginSuccess';
import EventSection from './components/EventSection';
import EventTimeline from './components/EventTimeline';
import PastSponsors from './components/PastSponsors';
import CurrentSponsors from './components/CurrentSponsors';
import Speakers from './components/Speakers';
import ContactFooter from './components/ContactFooter';
import Events from './pages/events';
import Sponsors from './pages/Sponsors';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Gallery from './pages/gallery';
import Registration from './pages/Registration';
import Dashboard from './pages/dashboard';
import CustomCursor from './components/CustomCursor';
import Teams from './pages/Teams';
import GlobalLandingPage from './pages/GlobalLandingPage';
import SlidingBar from './components/SlidingBar';

import SEO from './components/SEO';

const udbhavJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Udbhav - Annual Entrepreneurship & Financial Literacy Summit",
  "description": "The flagship entrepreneurship and financial literacy summit of MNNIT Allahabad organized by Institution's Innovation Council (IIC).",
  "url": "https://iic.mnnit.ac.in/udbhav",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "organizer": {
    "@type": "Organization",
    "name": "Institution's Innovation Council, MNNIT Allahabad",
    "url": "https://iic.mnnit.ac.in"
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

gsap.registerPlugin(ScrollTrigger);

function App() {

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <BrowserRouter>
        <div className="bg-[#dcd9d2] text-[#0E0E0E] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#B8A18A] selection:text-white">
          <Routes>

            {/* IIC Global Landing Route */}
            <Route path="/" element={<GlobalLandingPage />} />

            {/* Home Route (UDBHAV) */}
            <Route
              path="/udbhav"
              element={
                <>
                  <SEO
                    title="Udbhav | IIC MNNIT Allahabad"
                    description="Udbhav is the premier annual entrepreneurship and financial literacy summit organized by Institution's Innovation Council (IIC) MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav"
                    jsonLd={udbhavJsonLd}
                  />
                  <Navbar />
                  <div className="hidden md:block">
                    <SlidingBar />
                  </div>

                  {/* Mobile: SlidingBar BELOW Navbar */}
                  <div className="block md:hidden">
                    <SlidingBar />
                  </div>
                  <main>
                    <Hero />
                    <About />
                    <CurrentSponsors />
                    <EventSection />
                    <EventTimeline />
                    <PastSponsors />
                    <Speakers />
                    <ContactFooter />
                  </main>

                </>
              }
            />

            {/* Events Page */}
            <Route
              path="/udbhav/events"
              element={
                <>
                  <SEO
                    title="Events | Udbhav • IIC MNNIT Allahabad"
                    description="Explore flagship competitions, case clashes, hackathons, and challenges at Udbhav Summit, MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav/events"
                  />
                  <Navbar />
                  <main>
                    <Events />
                    <ContactFooter />
                  </main>
                </>
              }
            />

            {/* Registration Page */}
            <Route
              path="/udbhav/events/:eventId/register"
              element={
                <>
                  <SEO
                    title="Register | Udbhav • IIC MNNIT Allahabad"
                    description="Register for competitions and events at Udbhav Summit, MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav/events"
                  />
                  <main>
                    <Registration />
                  </main>
                </>
              }
            />

            <Route
              path="/udbhav/dashboard"
              element={
                <>
                  <SEO
                    title="User Dashboard | Udbhav"
                    description="User dashboard for registered participants of Udbhav Summit."
                    robots="noindex, nofollow"
                  />
                  <main>
                    <Dashboard />
                  </main>
                </>
              }
            />

            {/* Gallery Page */}
            <Route
              path="/udbhav/gallery"
              element={
                <>
                  <SEO
                    title="Gallery | Udbhav • IIC MNNIT Allahabad"
                    description="Moments, keynotes, and glimpses from previous editions of Udbhav Summit at MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav/gallery"
                  />
                  <Navbar />
                  <main>
                    <Gallery />
                    <ContactFooter />
                  </main>
                </>
              }
            />

            <Route
              path="/udbhav/sponsors"
              element={
                <>
                  <SEO
                    title="Sponsors & Partners | Udbhav • IIC MNNIT Allahabad"
                    description="Sponsors, corporate partners, and patrons of Udbhav Summit, MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav/sponsors"
                  />
                  <Navbar />
                  <main>
                    <Sponsors />
                    <ContactFooter />
                  </main>
                </>
              }
            />
            <Route
              path="/udbhav/teams"
              element={
                <>
                  <SEO
                    title="Our Team | Udbhav • IIC MNNIT Allahabad"
                    description="Meet the organizing team, student leads, and faculty advisors of Udbhav Summit at MNNIT Allahabad."
                    canonical="https://iic.mnnit.ac.in/udbhav/teams"
                  />
                  <Navbar />
                  <main>
                    <Teams />
                    <ContactFooter />
                  </main>
                </>
              }
            />
            {/* Login Success */}
            <Route path="/udbhav/login/success" element={<LoginSuccess />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
