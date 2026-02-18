import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import LoginSuccess from './components/LoginSuccess';
import EventSection from './components/EventSection';
import EventTimeline from './components/EventTimeline';
import Events from './pages/events';
import Sponsors from './pages/Sponsors';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    <BrowserRouter>
      <div className="bg-[#dcd9d2] text-[#0E0E0E] min-h-screen overflow-x-hidden font-merriweather selection:bg-[#B8A18A] selection:text-white">
        <Routes>

          {/* Home Route (UNCHANGED) */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="pt-24 md:pt-0">
                  <Hero />
                  <About />
                  <EventSection />
                  <EventTimeline />
                  <section id="contact" className="h-[50vh] flex items-center justify-center bg-[#7C6C58] text-white">
                    <h2 className="font-playfair text-4xl">Contact Us</h2>
                  </section>
                </main>

                <footer className="py-8 text-center text-sm text-[#0E0E0E] bg-[#dcd9d2] border-t border-[#7C6C58]">
                  © 2026 Udbhav - IIC MNNIT. All rights reserved.
                </footer>
              </>
            }
          />

          {/* Events Page */}
          <Route
            path="/events"
            element={
              <>
                <Navbar />
                <Events />
              </>
            }
          />

          <Route
            path="/sponsors"
            element={
              <>
                <Navbar />
                <Sponsors />
              </>
            }
          />
          {/* Login Success */}
          <Route path="/login/success" element={<LoginSuccess />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
