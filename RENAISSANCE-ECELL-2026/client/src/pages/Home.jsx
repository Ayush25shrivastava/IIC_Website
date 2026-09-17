import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Navigation,
  Wind,
  UserCheck,
  Clock,
  Compass,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useSmoothScroll } from "../lib/smoothScroll";
import ContactFooter from "../components/ContactFooter";
import NauticalDepthMeter from "../components/NauticalDepthMeter";
import NauticalCartographyBg from "../components/NauticalCartographyBg";


gsap.registerPlugin(ScrollTrigger, Draggable);

const EVENTS = [
  {
    id: "01",
    name: "Deep Sea Coding",
    category: "Flagship 36-Hour Sprint",
    time: "10:00 AM • Day 1",
    desc: "Build autonomous subsea systems, AI agents, and deep-tech prototypes in a 36-hour continuous build sprint.",
    prize: "₹2,50,000 Pool",
  },
  {
    id: "02",
    name: "Pitchers 10.0",
    category: "Venture Capital Arena",
    time: "02:00 PM • Day 1",
    desc: "Present your high-impact startup to top syndicate investors, angel funds, and tier-1 venture cartographers.",
    prize: "₹5,00,000 Pool",
  },
  {
    id: "03",
    name: "Case Odyssey",
    category: "Corporate Strategy Battle",
    time: "10:00 AM • Day 2",
    desc: "Solve high-stakes strategic challenges and market disruption problems presented by global corporate leaders.",
    prize: "₹1,50,000 Pool",
  },
];

const CURRENT_SPONSORS = [
  { name: "Bank of Baroda", image: "/sponsors/Bank-of-Baroda-logo.jpg" },
  { name: "Royal Enfield", image: "/sponsors/Royal_Enfield_Logo_full.png" },
  { name: "Campa Cola", image: "/sponsors/campacola.jpeg" },
  { name: "D2D", image: "/sponsors/D2D LOGO (1).png" },
  { name: "Summit Armada", image: "/sponsors/LOGO.png" },
  { name: "Voyage Guild", image: "/sponsors/unnamed.png" },
];

const PAST_SPONSORS = [
  { name: "Dalal Street", image: "/sponsors/dalal-street.png" },
  { name: "ICICI Bank", image: "/sponsors/icici.png" },
  { name: "OLA", image: "/sponsors/ola.png" },
  { name: "Burger Singh", image: "/sponsors/burger-singh.png" },
  { name: "Make My Trip", image: "/sponsors/makemytrip.png" },
  { name: "MINISO", image: "/sponsors/miniso.png" },
  { name: "Cafe Coffee Day", image: "/sponsors/ccd.png" },
  { name: "Coca Cola", image: "/sponsors/coca-cola.png" },
  { name: "KDM", image: "/sponsors/kdm.png" },
  { name: "Domino's", image: "/sponsors/dominos.png" },
];



function FeaturedSpeakersGrid({ speakers }) {
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const items = grid.querySelectorAll('.speaker-card');
    if (items.length === 0) return;

    items.forEach(item => {
      item.style.willChange = 'transform, opacity, filter';
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, index) => {
            const delay = index * 100;
            item.style.transitionDelay = `${delay}ms`;
            item.classList.add('opacity-100', 'translate-y-0');
            item.classList.remove('opacity-0', 'translate-y-[30px]');
            
            setTimeout(() => {
              item.style.willChange = 'auto';
              item.style.transitionDelay = '0ms'; // reset for hover
            }, delay + 800);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
    return () => observer.disconnect();
  }, [speakers]);

  return (
    <section className="relative min-h-screen w-full bg-transparent flex flex-col items-center justify-center px-6 sm:px-12 pt-24 sm:pt-36 pb-48 sm:pb-64 overflow-hidden select-none z-20">
      {/* Heavy Marine Mist Overlay */}
      
      

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center justify-center relative z-10 my-auto">
        <div className="speakers-header text-center mb-16 sm:mb-24">
          <span className="text-[13px] sm:text-[14px] text-[#E6DFD3] font-black uppercase tracking-[0.3em] block mb-4 opacity-100">
            Eminent Voyagers
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-deepsea-shine pb-2">
            Featured Keynote Speakers
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {speakers.map((speaker, idx) => (
            <div
              key={speaker.id}
              className={`speaker-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-[rgba(10,15,30,0.6)] border border-white/10 hover:border-[#ffd700]/30 backdrop-blur-md opacity-0 translate-y-[30px] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${idx % 2 === 1 ? 'md:mt-16' : ''}`}
            >
              
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                 
              />
              <div 
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(5,10,20, 0.9) 0%, transparent 100%)' }}
              />
              
              <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {speaker.label}
                </h3>
                <p className="text-[0.85rem] font-mono text-[#E6DFD3] mt-1 font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  CEO, Oceanic Tech
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#020610] pointer-events-none z-10" />
    </section>
  );
}

function PremiumSponsorsGrid({ title, subtitle, sponsors }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const items = grid.querySelectorAll('.premium-sponsor-item');
    if (items.length === 0) return;

    items.forEach(item => {
      item.style.willChange = 'transform, opacity';
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, index) => {
            const delay = index * 80;
            item.style.transitionDelay = `${delay}ms`;
            item.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            item.classList.remove('opacity-0', 'translate-y-[20px]', 'scale-90');
            
            setTimeout(() => {
              item.style.willChange = 'auto';
            }, delay + 800);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
    return () => observer.disconnect();
  }, [sponsors]);

  return (
    <section className="relative w-full pt-32 pb-32 px-4 bg-gradient-to-b from-[#020610]/0 via-[#020610]/30 to-[#020610]/0 flex flex-col items-center justify-center z-20 select-none">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
        <span className="text-[10px] sm:text-xs font-mono text-[#E6DFD3] uppercase tracking-[0.25em] font-bold block mb-2">
          {subtitle}
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight animate-whitegold-shine">
          {title}
        </h2>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-[1200px] mx-auto"
      >
        {sponsors.map((sponsor, idx) => (
          <div
            key={idx}
            className="premium-sponsor-item relative aspect-video flex items-center justify-center p-6 opacity-0 translate-y-[20px] scale-90 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ transitionProperty: 'transform, border-color, background, opacity' }}
          >
            {/* Brass Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-[1px] border-l-[1px] border-[#d4af37]/40 rounded-tl-sm transition-all duration-300 "></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-[1px] border-r-[1px] border-[#d4af37]/40 rounded-tr-sm transition-all duration-300 "></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[1px] border-l-[1px] border-[#d4af37]/40 rounded-bl-sm transition-all duration-300 "></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[1px] border-r-[1px] border-[#d4af37]/40 rounded-br-sm transition-all duration-300 "></div>

            {sponsor.image ? (
              <span className="text-[#E6DFD3] text-6xl font-bold">{idx + 1}</span>
            ) : (
              <span className="text-[#E6DFD3] font-bold">{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function StaggeredSponsorsGrid({ title, subtitle, sponsors }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const items = grid.querySelectorAll('.sponsor-item');
    if (items.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, index) => {
            const delay = index * 80;
            item.style.transitionDelay = `${delay}ms`;
            item.classList.add('opacity-100', 'translate-y-0');
            item.classList.remove('opacity-0', 'translate-y-10');
            
            setTimeout(() => {
              item.style.willChange = 'auto';
              item.style.transitionDelay = '0ms';
            }, 800 + delay + 50);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
    
    return () => observer.disconnect();
  }, [sponsors]);

  return (
    <section className="relative w-full pt-32 pb-32 px-4 bg-gradient-to-b from-[#020610]/0 via-[#020610]/30 to-[#020610]/0 flex flex-col items-center justify-center z-20 select-none">
      {/* Ambient Glow for separation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#38BDF8]/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
        <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.25em] font-semibold block mb-1">
          {subtitle}
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          {title}
        </h2>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 w-full max-w-6xl mx-auto"
      >
        {sponsors.map((sponsor, idx) => (
          <div
            key={idx}
            className="sponsor-item aspect-video flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-5 opacity-0 translate-y-10 will-change-[transform,opacity] transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)]"
          >
            {sponsor.image ? (
              <img
                src={sponsor.image}
                alt={sponsor.name}
                className="max-w-full max-h-full object-contain drop-shadow-md"
                loading="lazy"
              />
            ) : (
              <span className="text-white font-bold">{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



const SPEAKERS = [
  { id: 1, label: "Speaker 01" },
  { id: 2, label: "Speaker 02" },
  { id: 3, label: "Speaker 03" },
  { id: 4, label: "Speaker 04" },
];

export default function Home() {
  const smoothScroll = useSmoothScroll();

  const heroSectionRef = useRef(null);
  const eventsSectionRef = useRef(null);
  const wheelContainerRef = useRef(null);
  const wheelImgRef = useRef(null);
  const eventsHeaderRef = useRef(null);
  const visualsRef = useRef([]);
  const detailsRef = useRef([]);
  const eventsFooterRef = useRef(null);

  // About Section Refs
  const aboutSectionRef = useRef(null);
  const aboutAuraRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const aboutDescRef = useRef(null);
  const statCard1Ref = useRef(null);
  const statCard2Ref = useRef(null);
  const statCard3Ref = useRef(null);
  const statCard4Ref = useRef(null);
  const aboutCtaRef = useRef(null);

  const speakersSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -------------------------------------------------------------
      // Section 2: About Renaissance (Shorter Pinned Parallax Timeline +=1500)
      // -------------------------------------------------------------
      if (aboutSectionRef.current) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutSectionRef.current,
            start: "top top",
            end: "+=1500",
            pin: true,
            scrub: 0.8,
          },
        });

        // 1. Deep Ocean Glow Aura Expands with scroll
        if (aboutAuraRef.current) {
          aboutTl.fromTo(
            aboutAuraRef.current,
            { scale: 0.7, opacity: 0.2 },
            { scale: 1.25, opacity: 0.75, ease: "none" },
            0
          );
        }

        // 2. Giant "About Renaissance" Title reveals
        if (aboutTitleRef.current) {
          aboutTl.fromTo(
            aboutTitleRef.current,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1.15, ease: "power2.out" },
            0.1
          );
        }

        // 3. Detailed Description text floats up
        if (aboutDescRef.current) {
          aboutTl.fromTo(
            aboutDescRef.current,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1.0, ease: "power2.out" },
            0.25
          );
        }

        // 4. Stat Cards drop down sequentially
        if (statCard1Ref.current) {
          aboutTl.fromTo(
            statCard1Ref.current,
            { opacity: 0, y: -60, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1.0, ease: "power2.out" },
            0.48
          );
        }

        if (statCard2Ref.current) {
          aboutTl.fromTo(
            statCard2Ref.current,
            { opacity: 0, y: -60, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1.0, ease: "power2.out" },
            0.58
          );
        }

        if (statCard3Ref.current) {
          aboutTl.fromTo(
            statCard3Ref.current,
            { opacity: 0, y: -60, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1.0, ease: "power2.out" },
            0.68
          );
        }

        if (statCard4Ref.current) {
          aboutTl.fromTo(
            statCard4Ref.current,
            { opacity: 0, y: -60, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1.0, ease: "power2.out" },
            0.78
          );
        }

        if (aboutCtaRef.current) {
          aboutTl.fromTo(
            aboutCtaRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, ease: "power2.out" },
            0.82
          );
        }

        // 5. Comfortable hold phase so full view stays pinned before unlocking
        aboutTl.to({}, { duration: 0.4 });
      }

      // -------------------------------------------------------------
      // Section 4: Featured Events (Unified Pinned Parallax Timeline +=3000)
      // -------------------------------------------------------------
      if (eventsSectionRef.current) {
        if (wheelImgRef.current) {
          gsap.set(wheelImgRef.current, { transformOrigin: "50% 50%" });
        }

        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: eventsSectionRef.current,
            start: "top top",
            end: "+=1800",
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        // Rotate pirate wheel smoothly across entire pin duration
        if (wheelImgRef.current) {
          mainTl.to(
            wheelImgRef.current,
            { rotation: 720, ease: "none", duration: 10 },
            0
          );
        }

        const totalEvents = EVENTS.length;
        const stepDuration = 3.0;

        EVENTS.forEach((_, idx) => {
          const visualEl = visualsRef.current[idx];
          const detailsEl = detailsRef.current[idx];
          if (!visualEl || !detailsEl) return;

          const startTime = idx * stepDuration;

          // Event Visual Fades In
          mainTl.fromTo(
            visualEl,
            { opacity: 0, scale: 0.9, pointerEvents: "none" },
            { opacity: 1, scale: 1.0, pointerEvents: "auto", duration: 0.6, ease: "power2.out" },
            startTime
          );

          // Details Panel Slides Up
          mainTl.fromTo(
            detailsEl,
            { opacity: 0, y: 30, pointerEvents: "none" },
            { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.6, ease: "power2.out" },
            startTime + 0.2
          );

          // Solid Hold phase so user can view/interact with the event card
          mainTl.to([visualEl, detailsEl], { opacity: 1, duration: 1.2 }, startTime + 0.8);

          // Exit transition for next event (if not last)
          if (idx < totalEvents - 1) {
            mainTl.to(
              [visualEl, detailsEl],
              {
                opacity: 0,
                y: -25,
                pointerEvents: "none",
                duration: 0.6,
                ease: "power2.in",
              },
              startTime + 2.2
            );
          }
        });
      }

      // -------------------------------------------------------------
      // Section 6: Keynote Speakers (Automatic Scroll Trigger Entrance)
      // -------------------------------------------------------------
      if (speakersSectionRef.current) {
        const speakersHeaderEl = speakersSectionRef.current.querySelector(".speakers-header");
        const speakerCardEls = speakersSectionRef.current.querySelectorAll(".speaker-card-item");

        const speakersTl = gsap.timeline({
          scrollTrigger: {
            trigger: speakersSectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        if (speakersHeaderEl) {
          speakersTl.fromTo(
            speakersHeaderEl,
            { opacity: 0, y: 35, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1.0, duration: 0.6, ease: "power2.out" }
          );
        }

        if (speakerCardEls.length > 0) {
          speakersTl.fromTo(
            speakerCardEls,
            { opacity: 0, y: 50, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1.0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
            "-=0.3"
          );
        }
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative z-10 w-full text-white selection:bg-[#38BDF8] selection:text-[#020610]">
      <NauticalCartographyBg />
      <NauticalDepthMeter />

      {/* ============================================================ */}
      {/* 1. HERO SECTION (100vh)                                      */}
      {/* ============================================================ */}
      <section
        ref={heroSectionRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center overflow-visible mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto overflow-visible my-auto">
          {/* Centered Transparent Emblem Logo */}
          <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-6 sm:mb-8 flex items-center justify-center overflow-visible">
            <img
              src="/renaissance-logo-clean.png"
              alt="Renaissance 10th Edition Emblem"
              onError={(e) => {
                e.currentTarget.src = "/renaissance-logo-transparent.png";
              }}
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] drop-shadow-[0_0_30px_rgba(56,189,248,0.35)] select-none pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.32em] text-[#38BDF8]/90 mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            E-Cell MNNIT Allahabad • Annual Entrepreneurship Summit
          </p>

          {/* Action CTAs: Register Now + Explore Events */}
          <div className="overflow-visible flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/register"
              className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#d4af37] text-[#0C2B3D] font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:scale-[1.03] overflow-visible cursor-pointer border border-[#d4af37]/60 w-full sm:w-auto"
            >
              <UserCheck className="w-4 h-4 text-[#0C2B3D] overflow-visible" />
              <span>Register Now</span>
            </Link>

            <a
              href="#events"
              onClick={(e) => {
                e.preventDefault();
                if (smoothScroll?.scrollTo && eventsSectionRef.current) {
                  smoothScroll.scrollTo(eventsSectionRef.current, { duration: 1.2 });
                } else {
                  eventsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-[#38BDF8]/50 bg-[#031d33]/80 backdrop-blur-md text-[#CBD5E1] hover:text-white hover:border-[#38BDF8] hover:bg-[#042542]/90 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] overflow-visible cursor-pointer w-full sm:w-auto"
            >
              <div className="overflow-visible flex items-center justify-center">
                <Navigation className="w-4 h-4 text-[#38BDF8] transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 overflow-visible" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase">
                Explore Events
              </span>
              <div className="overflow-visible flex items-center justify-center">
                <Wind className="w-3.5 h-3.5 text-[#38BDF8]/80 group-hover:text-[#38BDF8] transition-colors overflow-visible" />
              </div>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#38BDF8]/70 text-xs font-mono overflow-visible">
          <span className="tracking-widest uppercase text-[10px]">Scroll To Navigate</span>
          <div className="w-4 h-7 border border-[#38BDF8]/40 rounded-full flex items-start justify-center p-1 overflow-visible">
            <div className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ABOUT RENAISSANCE SECTION (PINNED PARALLAX SCROLL)       */}
      {/* ============================================================ */}
      <section
        ref={aboutSectionRef}
        className="relative min-h-[85vh] w-full flex flex-col items-center justify-center px-6 text-center z-10 bg-transparent pt-24 pb-8 sm:pt-32 sm:pb-12"
      >

        <div className="relative max-w-4xl mx-auto flex flex-col items-center justify-center text-center z-10 px-4">
                                        <h2
            ref={aboutTitleRef}
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] z-10 font-sans animate-whitegold-shine"
          >
            About Renaissance
          </h2>

          <p
            ref={aboutDescRef}
            className="text-base sm:text-xl text-[#f3e5ab] font-light leading-relaxed mb-10 max-w-3xl z-10 drop-shadow-[ 0_4px_10px_#000 ]"
          >
            The Institution’s Innovation Council and Entrepreneurship Cell at MNNIT Allahabad present the 10th edition of Renaissance. The summit brings together students, founders, and leaders to foster entrepreneurship and innovation across diverse disciplines.
          </p>

          {/* Summit Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full my-6 z-10">
            <div
              ref={statCard1Ref}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                5000+
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-semibold mt-1.5">
                Footfall
              </span>
            </div>

            <div
              ref={statCard2Ref}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                ₹2.5 Lakh+
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-semibold mt-1.5">
                Prize Pool
              </span>
            </div>

            <div
              ref={statCard3Ref}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                20+
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-semibold mt-1.5">
                Startups & VCs
              </span>
            </div>

            <div
              ref={statCard4Ref}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                10th
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-semibold mt-1.5">
                Edition
              </span>
            </div>
          </div>

          
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CURRENT SPONSORS SECTION */}
      <PremiumSponsorsGrid 
        title="Current Sponsors" 
        subtitle="Industry & Innovation Partners" 
        sponsors={CURRENT_SPONSORS} 
      />
{/* 4. FEATURED EVENTS SECTION (SHORTENED PIN DISTANCE +=2200)   */}
      {/* ============================================================ */}
      <section
        id="events"
        ref={eventsSectionRef}
        className="relative w-full min-h-screen sm:h-screen bg-transparent flex flex-col justify-between pt-28 sm:pt-32 pb-6 px-4 sm:px-12 overflow-visible select-none"
      >

        {/* Giant Rotating Nautical Wheel */}
        <div
          ref={wheelContainerRef}
          className="absolute left-1/2 md:left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[65vh] h-[65vh] sm:w-[95vh] sm:h-[95vh] md:w-[110vh] md:h-[110vh] pointer-events-none z-0 md:z-10 flex items-center justify-center opacity-25 md:opacity-100 overflow-visible"
        >
          <div className="absolute w-[68%] h-[68%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(217,119,6,0.08)_35%,rgba(56,189,248,0.08)_60%,transparent_75%)] blur-2xl pointer-events-none" />
          <img
            ref={wheelImgRef}
            src="/pirate-wheel-transparent.png"
            alt="Nautical Wheel"
            className="w-full h-full object-contain filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] drop-shadow-[0_0_50px_rgba(56,189,248,0.45)] select-none pointer-events-none will-change-transform overflow-visible"
          />
        </div>

        {/* Right Half Container: Events Header & Event Showcase */}
        <div className="max-w-7xl w-full mx-auto flex flex-col items-end justify-center my-auto relative z-20">
          <div className="w-full max-w-lg sm:max-w-xl ml-auto flex flex-col gap-3 sm:gap-4">

            {/* Header */}
            <div
              ref={eventsHeaderRef}
              className="w-full flex items-end justify-between pb-2 border-b border-white/10"
            >
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#0284c7] uppercase tracking-[0.25em] font-extrabold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Summit Flagships</span>
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-whitegold-shine pb-2">
                  Featured Events
                </h2>
              </div>
            </div>

            {/* Event Showcase Cards */}
            <div className="relative w-full h-[410px] sm:h-[450px] md:h-[480px]">
              {EVENTS.map((event, idx) => (
                <div
                  key={event.id}
                  className="absolute inset-0 w-full h-full flex flex-col gap-3 sm:gap-4 pointer-events-none"
                >
                  {/* Unified Event Card */}
                  <div
                    ref={(el) => {
                      visualsRef.current[idx] = el;
                      detailsRef.current[idx] = el;
                    }}
                    className="w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/60 bg-[#F4EBD9]/95 text-[#0C2B3D] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4 overflow-hidden will-change-transform pointer-events-auto shrink-0"
                  >
                    <div className="flex items-center justify-between w-full pb-2 border-b border-[#0C2B3D]/10">
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-70">
                        {event.category}
                      </span>
                      <span className="text-xs font-mono px-3 py-1 rounded-full border border-[#0C2B3D]/20 bg-[#0C2B3D]/10 text-[#0C2B3D] uppercase tracking-wider font-extrabold">
                        CHALLENGE {event.id} / 03
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight mb-2">
                        {event.name}
                      </h3>
                      <div className="text-sm sm:text-base font-mono font-bold opacity-80 text-[#d4af37]">
                        Prize Pool: {event.prize}
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm font-mono leading-relaxed opacity-90 text-[#0C2B3D]">
                      {event.desc}
                    </p>
                    
                    <div className="pt-4 mt-auto border-t border-[#0C2B3D]/10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                      <Link
                        to="/register"
                        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0C2B3D] text-[#f3e5ab] font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(12,43,61,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-[#f3e5ab]" />
                        Register Now
                      </Link>
                      <Link to="/events" className="text-xs font-bold uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">
                        View Schedule →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <div
          ref={eventsFooterRef}
          className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono text-[#64748B] relative z-20"
        >
          
          <span className="hidden sm:inline text-[#64748B]">10th Edition Summit</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PAST SPONSORS SECTION */}
      <StaggeredSponsorsGrid 
        title="Past Sponsors" 
        subtitle="Pioneers & Legacy Partners" 
        sponsors={PAST_SPONSORS} 
      />


      {/* ============================================================ */}
      {/* 6. KEYNOTE SPEAKERS SECTION (FULL SCREEN UNPINNED SCRUB GRID)*/}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 6. KEYNOTE SPEAKERS SECTION */}
      <FeaturedSpeakersGrid speakers={SPEAKERS} />

      {/* ============================================================ */}
      {/* 7. GLOBAL SUMMIT FOOTER                                      */}
      {/* ============================================================ */}
      <ContactFooter />
    </div>
  );
}
