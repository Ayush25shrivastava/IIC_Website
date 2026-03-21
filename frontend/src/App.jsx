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
                  <Navbar />
                  <main>
                    <Hero />
                    <About />
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
                  {/* Omit Navbar here for full app-like experience or keep it if consistent */}
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
