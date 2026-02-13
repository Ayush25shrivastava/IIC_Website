import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Events from './pages/Events';
import Sponsors from './pages/Sponsors';
import LoginSuccess from './components/LoginSuccess';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper component to reset scroll on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* HIGHLIGHT: Navbar is now global across all routes */}
      <div className="bg-[#dcd9d2] text-[#0E0E0E] min-h-screen font-merriweather selection:bg-[#B8A18A] selection:text-white">
        <Navbar />
        
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={
            <main>
              <Hero />
              <About />
              <section id="schedule" className="h-screen flex items-center justify-center bg-[#dcd9d2] text-[#0E0E0E]">
                <h2 className="font-playfair text-6xl">Event Schedule</h2>
              </section>
              <section id="contact" className="h-[50vh] flex items-center justify-center bg-[#7C6C58] text-white">
                <h2 className="font-playfair text-4xl">Contact Us</h2>
              </section>
            </main>
          } />

          {/* HIGHLIGHT: Sub-pages registered here */}
          <Route path="/events" element={<Events />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/login/success" element={<LoginSuccess />} />
        </Routes>

        <footer className="py-8 text-center text-sm text-[#0E0E0E] bg-[#dcd9d2] border-t border-[#7C6C58]">
          © 2026 Udbhav - IIC MNNIT. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;