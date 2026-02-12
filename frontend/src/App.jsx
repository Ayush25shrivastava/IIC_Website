import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import LoginSuccess from './components/LoginSuccess';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
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

    // Synchronize Lenis with GSAP ScrollTrigger
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
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <Hero />
                <About />
                <section id="events" className="h-screen flex items-center justify-center bg-[#0E0E0E] text-[#B8A18A]">
                  <h2 className="font-playfair text-6xl">Events Coming Soon...</h2>
                </section>
                <section id="schedule" className="h-screen flex items-center justify-center bg-[#dcd9d2] text-[#0E0E0E]">
                  <h2 className="font-playfair text-6xl">Event Schedule</h2>
                </section>
                <section id="contact" className="h-[50vh] flex items-center justify-center bg-[#7C6C58] text-white">
                  <h2 className="font-playfair text-4xl">Contact Us</h2>
                </section>
              </main>

              <footer className="py-8 text-center text-sm text-[#0E0E0E] bg-[#dcd9d2] border-t border-[#7C6C58]">
                © 2024 Udbhav - IIC MNNIT. All rights reserved.
              </footer>
            </>
          } />

          <Route path="/login/success" element={<LoginSuccess />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
