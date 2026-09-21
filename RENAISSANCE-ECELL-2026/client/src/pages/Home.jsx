import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Navigation,
  Wind,
  UserCheck,
  Clock,
  Compass,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useSmoothScroll } from "../lib/smoothScroll";
import ContactFooter from "../components/ContactFooter";
import NauticalCartographyBg from "../components/NauticalCartographyBg";

gsap.registerPlugin(ScrollTrigger, Draggable);

const EVENTS = [
  {
    id: "01",
    name: "B-Plan",
    category: "Flagship Business Plan",
    tagline: "Got a million-dollar idea? Prove it.",
    desc: "B-Plan is the flagship business-plan showdown of Renaissance - India’s premier student entrepreneurship summit. This isn’t just about dreaming big; it’s about building smart. Present a rock-solid plan, defend it before expert judges, and turn your concept into a venture that investors notice.\n\nAll you need to know about B-Plan (Fish Tank-Business Plan) : Business plan pitching competetion at Renaissance 10.0",
    prize: "₹25,000",
    registrationUrl:
      "http://unstop.com/o/UL8OJ4R?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
  },
  {
    id: "02",
    name: "Strategy-Wiz",
    category: "Ultimate Strategy Challenge",
    tagline: "From Product to Phenomenon: Architecting Iconic Launches",
    desc: "A great product can fail; a legendary launch builds an empire. The product is ready, the market is waiting. Do you have the masterplan to make it iconic?\n\nStrategy-Wiz, the ultimate strategy challenge, is designed for future business leaders and innovators. Teams will craft the blueprint for market domination: analyse markets, design innovative launch plans, and compete to showcase the most impactful marketing strategy.",
    prize: "₹15,000",
    registrationUrl:
      "https://unstop.com/competitions/strategy-wiz-renaissance-100-motilal-nehru-national-institute-of-technology-1755423?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
  },
  {
    id: "03",
    name: "Business Wars",
    category: "Market Strategy Competition",
    tagline: "Think Fast. Strategize Better. Win the Market",
    desc: "In business, having a good idea is only the beginning. The real challenge is making the right decisions when the stakes are high and your competitors are waiting for you to slip.\n\nBusiness Wars is a high-pressure business strategy competition where teams step into the shoes of competing businesses and battle through real-world market scenarios.",
    prize: "₹15,000",
    registrationUrl:
      "https://unstop.com/competitions/biz-wars-renaissance-100-motilal-nehru-national-institute-of-technology-1756444?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
  },
  {
    id: "04",
    name: "Biz-Tech Quiz",
    category: "Business & Technology Quiz",
    tagline: "Put your business acumen and tech knowledge to the test!",
    desc: "Biz-Tech Quiz, conducted by the Gnosis Quiz Club, brings together intriguing questions at the intersection of business, technology, startups, and innovation.",
    prize: "TBD",
    registrationUrl: null,
  },
  {
    id: "05",
    name: "Treasure Hunt",
    category: "Campus Adventure",
    tagline: "Get ready for an exciting adventure across the MNNIT campus!",
    desc: "Treasure Hunt challenges participants to crack clues, explore hidden corners, and race against time to uncover the treasure, with exciting prizes and goodies waiting at the finish line.",
    prize: "Prizes & Goodies",
    registrationUrl: null,
  },
  {
    id: "06",
    name: "Mock IPL Auction",
    category: "Strategy & Auction",
    tagline: "Step into the shoes of an IPL franchise owner!",
    desc: "In this Mock IPL Auction, participants receive a limited pool of tokens and compete to build their dream teams by strategically bidding on players, balancing budgets, and making every bid count.",
    prize: "TBD",
    registrationUrl: null,
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
  { name: "Paytm Build for India", image: "/sponsors/paytm-build-for-india.png" },
  { name: "Haldiram Bhujiawala", image: "/sponsors/haldiram-bhujiawala.png" },
  { name: "Superhits Red FM 93.5", image: "/sponsors/red-fm-93-5.png" },
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

    const items = grid.querySelectorAll(".speaker-card");
    if (items.length === 0) return;

    items.forEach((item) => {
      item.style.willChange = "transform, opacity, filter";
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, index) => {
              const delay = index * 100;
              item.style.transitionDelay = `${delay}ms`;
              item.classList.add("opacity-100", "translate-y-0");
              item.classList.remove("opacity-0", "translate-y-[30px]");

              setTimeout(() => {
                item.style.willChange = "auto";
                item.style.transitionDelay = "0ms"; // reset for hover
              }, delay + 800);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, [speakers]);

  return (
    <section className="relative w-full bg-transparent flex flex-col items-center justify-center px-4 sm:px-12 pt-20 sm:pt-32 pb-20 sm:pb-32 overflow-hidden select-none z-20">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center justify-center relative z-10 my-auto">
        <div className="speakers-header text-center mb-12 sm:mb-20">
          <span className="text-xs sm:text-sm text-[#E6DFD3] font-black uppercase tracking-[0.3em] block mb-3 opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Eminent Voyagers
          </span>
          <h2 className="text-[2.2rem] sm:text-5xl md:text-6xl font-black tracking-tight animate-renaissance-theme pb-2 leading-tight">
            Featured Keynote Speakers
          </h2>
        </div>

        <div ref={gridRef} className="w-full flex items-center justify-center">
          <div className="speaker-card relative flex w-full max-w-2xl translate-y-[20px] items-center justify-center px-6 py-10 sm:px-12 sm:py-14 rounded-2xl sm:rounded-3xl border border-[#d4af37]/60 bg-[#F4EBD9]/95 text-[#0C2B3D] backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.5)] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <span className="font-mono text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-[0.14em] text-center uppercase text-[#0C2B3D]">
              To be announced soon...
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumSponsorsGrid({ title, subtitle, sponsors }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll(".premium-sponsor-item");
    if (items.length === 0) return;

    items.forEach((item) => {
      item.style.willChange = "transform, opacity";
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, index) => {
              const delay = index * 80;
              item.style.transitionDelay = `${delay}ms`;
              item.classList.add("opacity-100", "translate-y-0", "scale-100");
              item.classList.remove(
                "opacity-0",
                "translate-y-[20px]",
                "scale-90",
              );

              setTimeout(() => {
                item.style.willChange = "auto";
              }, delay + 800);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, [sponsors]);

  return (
    <section className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 bg-transparent flex flex-col items-center justify-center z-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 text-center relative z-10">
        <span className="text-xs sm:text-sm font-mono text-[#E6DFD3] uppercase tracking-[0.25em] font-bold block mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {subtitle}
        </span>

        <h2 className="text-[2.2rem] sm:text-5xl font-extrabold tracking-tight animate-black-gold leading-tight">
          {title}
        </h2>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full max-w-[1200px] mx-auto"
      >
        {sponsors.map((sponsor, idx) => (
          <div
            key={idx}
            className="premium-sponsor-item aspect-video flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-5 opacity-0 translate-y-[20px] scale-90 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
          >
            <span className="text-[#E6DFD3] font-mono text-[11px] sm:text-sm font-bold tracking-wider text-center uppercase opacity-85">
              To be announced soon...
            </span>
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

    const items = grid.querySelectorAll(".sponsor-item");
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, index) => {
              const delay = index * 80;
              item.style.transitionDelay = `${delay}ms`;
              item.classList.add("opacity-100", "translate-y-0");
              item.classList.remove("opacity-0", "translate-y-10");

              setTimeout(
                () => {
                  item.style.willChange = "auto";
                  item.style.transitionDelay = "0ms";
                },
                800 + delay + 50,
              );
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

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
            className="sponsor-item aspect-video flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-5 opacity-0 translate-y-10 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)]"
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
  const scrollIndicatorRef = useRef(null);

  const speakersSectionRef = useRef(null);

  useEffect(() => {
    const isDesktopViewport = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Fade out scroll indicator as user begins scrolling
      if (scrollIndicatorRef.current && heroSectionRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          ease: "power1.out",
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom 85%",
            scrub: 0.3,
          },
        });
      }

      // Desktop Only (min-width: 768px): Pinned Parallax Timeline
      mm.add("(min-width: 768px)", () => {
        if (aboutSectionRef.current) {
          const aboutTl = gsap.timeline({
            scrollTrigger: {
              trigger: aboutSectionRef.current,
              start: "top top",
              end: "+=1000",
              pin: true,
              scrub: 0.4,
            },
          });
          if (aboutAuraRef.current) {
            aboutTl.fromTo(
              aboutAuraRef.current,
              { scale: 0.7, opacity: 0.2 },
              { scale: 1.25, opacity: 0.75, ease: "none" },
              0
            );
          }
          if (aboutTitleRef.current) {
            aboutTl.fromTo(
              aboutTitleRef.current,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1.05, ease: "power2.out" },
              0.1
            );
          }
          if (aboutDescRef.current) {
            aboutTl.fromTo(
              aboutDescRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, ease: "power2.out" },
              0.25
            );
          }
          [statCard1Ref, statCard2Ref, statCard3Ref, statCard4Ref].forEach((ref, idx) => {
            if (ref.current) {
              aboutTl.fromTo(
                ref.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, ease: "power2.out" },
                0.4 + idx * 0.1
              );
            }
          });
          aboutTl.to({}, { duration: 0.3 });
        }
      });

      // Pinned Events Parallax Timeline (Desktop + Mobile)
      if (eventsSectionRef.current) {
        if (wheelImgRef.current) {
          gsap.set(wheelImgRef.current, { transformOrigin: "50% 50%" });
        }

        let lastRippleTime = 0;
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: eventsSectionRef.current,
            start: "top top",
            end: "+=1200",
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        if (wheelImgRef.current) {
          mainTl.to(
            wheelImgRef.current,
            {
              rotation: 540,
              ease: "none",
              duration: 10,
              onUpdate: function () {
                const now = performance.now();
                if (now - lastRippleTime < 35) return;
                lastRippleTime = now;

                // When wheel rotates, interact with the WebGL ocean water along the moving wheel rim!
                const progress = this.progress();
                const angle = (progress * 540 * Math.PI) / 180;
                const isMobile = window.innerWidth < 768;
                const cx = isMobile ? window.innerWidth / 2 : 0;
                const cy = window.innerHeight / 2;
                const radius = window.innerHeight * (isMobile ? 0.38 : 0.46);
                const rippleX = cx + Math.cos(angle) * radius;
                const rippleY = cy + Math.sin(angle) * radius;

                window.dispatchEvent(
                  new PointerEvent("pointermove", {
                    clientX: Math.max(0, Math.min(window.innerWidth, rippleX)),
                    clientY: Math.max(0, Math.min(window.innerHeight, rippleY)),
                    bubbles: false,
                  })
                );
              },
            },
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

          mainTl.fromTo(
            [visualEl, detailsEl],
            { opacity: 0, y: 20, pointerEvents: "none" },
            { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.6, ease: "power2.out" },
            startTime
          );

          mainTl.to([visualEl, detailsEl], { opacity: 1, duration: 1.2 }, startTime + 0.6);

          if (idx < totalEvents - 1) {
            mainTl.to(
              [visualEl, detailsEl],
              {
                opacity: 0,
                y: -20,
                pointerEvents: "none",
                duration: 0.6,
                ease: "power2.in",
              },
              startTime + 2.0
            );
          }
        });
      }

      // Mobile Only (max-width: 767px): About section unpinned flow
      mm.add("(max-width: 767px)", () => {
        if (aboutSectionRef.current) {
          gsap.fromTo(
            [
              aboutTitleRef.current,
              aboutDescRef.current,
              statCard1Ref.current,
              statCard2Ref.current,
              statCard3Ref.current,
              statCard4Ref.current,
            ],
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              scrollTrigger: {
                trigger: aboutSectionRef.current,
                start: "top 85%",
              },
            }
          );
        }
      });

      // Keynote Speakers entrance
      if (speakersSectionRef.current) {
        const speakersHeaderEl =
          speakersSectionRef.current.querySelector(".speakers-header");
        const speakerCardEls =
          speakersSectionRef.current.querySelectorAll(".speaker-card-item");

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
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }

        if (speakerCardEls.length > 0) {
          speakersTl.fromTo(
            speakerCardEls,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
            "-=0.2"
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
    <div className="relative z-10 w-full overflow-x-clip text-white selection:bg-[#38BDF8] selection:text-[#020610]">
      <NauticalCartographyBg />

      {/* ============================================================ */}
      {/* 1. HERO SECTION (100vh)                                      */}
      {/* ============================================================ */}
      <section
        ref={heroSectionRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center overflow-visible mx-auto"
      >
        <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto overflow-visible my-auto">
          {/* Wide soft cloud behind the Renaissance logo */}
          <div className="pointer-events-none absolute left-1/2 top-[36%] z-0 h-[240px] w-[96vw] max-w-[1450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.70)_32%,rgba(255,255,255,0.38)_56%,rgba(255,255,255,0.14)_72%,rgba(255,255,255,0)_88%)] blur-[38px] sm:h-[285px] md:h-[330px]" />

          {/* Centered Transparent Emblem Logo */}
          <div className="relative z-10 w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-6 sm:mb-8 flex items-center justify-center overflow-visible">
            <img
              src="/renaissance-logo-clean.png"
              alt="Renaissance 10th Edition Emblem"
              onError={(e) => {
                e.currentTarget.src = "/renaissance-logo-transparent.png";
              }}
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] drop-shadow-[0_0_30px_rgba(56,189,248,0.35)] select-none pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.32em] text-[#0C5D75] mb-8 drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]">
            E-Cell MNNIT Allahabad • Annual Entrepreneurship Summit
          </p>

          {/* Action CTAs: Register Now + Explore Events */}
          <div className="overflow-visible flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
            <button
              type="button"
              aria-label="Register Now"
              className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#d4af37] text-[#0C2B3D] font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] overflow-visible cursor-pointer border border-[#d4af37]/60 w-full sm:w-auto"
            >
              <UserCheck className="w-4 h-4 text-[#0C2B3D] overflow-visible" />
              <span>Register Now</span>
            </button>

            <a
              href="#events"
              onClick={(e) => {
                e.preventDefault();
                if (smoothScroll?.scrollTo && eventsSectionRef.current) {
                  smoothScroll.scrollTo(eventsSectionRef.current, {
                    duration: 1.2,
                  });
                } else {
                  eventsSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
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
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/90 text-xs font-mono overflow-visible pointer-events-none transition-opacity duration-300"
        >
          <span className="tracking-widest uppercase text-[10px] sm:text-[11px] font-semibold">
            Scroll To Navigate
          </span>
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
        className="relative z-10 flex min-h-0 w-full flex-col items-center justify-center bg-transparent px-4 pb-14 pt-20 text-center sm:min-h-[85vh] sm:px-6 sm:pb-12 sm:pt-32"
      >
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-0 text-center sm:px-4">
          <h2
            ref={aboutTitleRef}
            className="z-10 mb-4 font-sans text-[2.4rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight animate-renaissance-theme sm:mb-6 leading-tight"
          >
            About Renaissance
          </h2>

          <p
            ref={aboutDescRef}
            className="text-sm sm:text-base md:text-xl text-[#F4EBD9] font-medium leading-relaxed mb-8 sm:mb-10 max-w-3xl z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          >
            The Institution’s Innovation Council and Entrepreneurship Cell at
            MNNIT Allahabad present the 10th edition of Renaissance. The summit
            brings together students, founders, and leaders to foster
            entrepreneurship and innovation across diverse disciplines.
          </p>

          {/* Summit Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full my-4 sm:my-6 z-10">
            <div
              ref={statCard1Ref}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                5000+
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-bold mt-1.5">
                Footfall
              </span>
            </div>

            <div
              ref={statCard2Ref}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="whitespace-nowrap text-[1.35rem] sm:text-2xl md:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight leading-none">
                ₹2.5 Lakh+
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-bold mt-1.5">
                Prize Pool
              </span>
            </div>

            <div
              ref={statCard3Ref}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                20+
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-bold mt-1.5">
                Startups & VCs
              </span>
            </div>

            <div
              ref={statCard4Ref}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#040f21]/60 border border-[#d4af37]/30 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#d4af37] tracking-tight">
                10th
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#CBD5E1] uppercase tracking-wider font-bold mt-1.5">
                Edition
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED EVENTS SECTION                                  */}
      {/* ============================================================ */}
      <section
        id="events"
        ref={eventsSectionRef}
        className="featured-events-section relative flex min-h-[100svh] h-[100svh] w-full flex-col justify-center md:justify-between overflow-hidden bg-transparent px-4 py-6 select-none sm:px-6 md:px-12 md:pb-6 md:pt-32"
      >
        {/* Giant Rotating Nautical Wheel */}
        <div
          ref={wheelContainerRef}
          className="featured-events-wheel pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[120vw] w-[120vw] max-h-[520px] max-w-[520px] sm:h-[110vw] sm:w-[110vw] sm:max-h-[560px] sm:max-w-[560px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible opacity-45 md:left-0 md:h-[calc(100svh-8px)] md:w-[calc(100svh-8px)] md:max-h-[calc(100svh-8px)] md:max-w-[calc(100svh-8px)] md:opacity-100 aspect-square"
        >
          <div className="absolute w-[88%] h-[88%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22)_0%,rgba(56,189,248,0.18)_38%,rgba(4,16,33,0.55)_65%,transparent_80%)] blur-2xl pointer-events-none" />
          <img
            ref={wheelImgRef}
            src="/pirate-wheel-transparent.png"
            alt="Nautical Wheel"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] select-none pointer-events-none will-change-transform overflow-visible"
          />
        </div>

        {/* Right Half Container: Events Header & Event Showcase */}
        <div className="relative z-20 mx-auto my-auto flex w-full max-w-7xl flex-col items-center justify-center md:items-end">
          <div className="flex w-full max-w-md sm:max-w-xl flex-col gap-3 sm:gap-4 md:ml-auto">
            {/* Header */}
            <div
              ref={eventsHeaderRef}
              className="featured-events-header w-full flex items-end justify-between pb-2 border-b border-white/10"
            >
              <div>
                <span className="text-[11px] sm:text-xs font-mono text-white uppercase tracking-[0.25em] font-extrabold flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-1">
                  <Compass className="w-3.5 h-3.5 text-white" />
                  <span>Summit Flagships</span>
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-whitegold-shine pb-1 sm:pb-2">
                  Featured Events
                </h2>
              </div>
            </div>

            {/* Event Showcase Cards */}
            <div className="relative w-full h-[320px] sm:h-[380px] md:h-[480px]">
              {EVENTS.map((event, idx) => (
                <div
                  key={event.id}
                  className="absolute inset-0 h-full w-full flex flex-col pointer-events-none"
                >
                  {/* Unified Event Card */}
                  <div
                    ref={(el) => {
                      visualsRef.current[idx] = el;
                      detailsRef.current[idx] = el;
                    }}
                    className="w-full p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#d4af37]/60 bg-[#F4EBD9]/95 text-[#0C2B3D] backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col gap-2 sm:gap-3 overflow-hidden will-change-transform pointer-events-auto"
                  >
                    <div className="flex items-center justify-between w-full pb-1.5 sm:pb-2 border-b border-[#0C2B3D]/10">
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-70">
                        {event.category}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#0C2B3D]/20 bg-[#0C2B3D]/10 text-[#0C2B3D] uppercase tracking-wider font-extrabold">
                        CHALLENGE {event.id} / 03
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-sans tracking-tight mb-0.5 sm:mb-1">
                        {event.name}
                      </h3>
                      {event.tagline && (
                        <p className="text-[11px] sm:text-sm font-semibold italic opacity-85 mb-1 text-[#0C2B3D] line-clamp-1">
                          "{event.tagline}"
                        </p>
                      )}
                      <div className="text-[11px] sm:text-sm font-mono font-bold opacity-80 text-[#d4af37]">
                        Prize Pool: {event.prize}
                      </div>
                    </div>

                    {/* Compact text summary on mobile so user has up/down areas to scroll */}
                    <p className="featured-events-description line-clamp-2 md:line-clamp-none text-[11px] sm:text-xs md:text-sm font-mono leading-relaxed opacity-90 text-[#0C2B3D] whitespace-pre-line overflow-hidden md:overflow-y-auto max-h-[48px] sm:max-h-[100px] md:max-h-[160px] pr-1">
                      {event.desc}
                    </p>

                    <div className="pt-2 sm:pt-3 mt-auto border-t border-[#0C2B3D]/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 w-full">
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-[#1C4ED8] hover:bg-[#1E40AF] text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(28,78,216,0.35)] hover:shadow-[0_6px_22px_rgba(28,78,216,0.55)] hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                        <span>Register on Unstop</span>
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                      <Link
                        to="/events"
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
                      >
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
          <span className="hidden sm:inline text-[#64748B]">
            10th Edition Summit
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. KEYNOTE SPEAKERS SECTION (FULL SCREEN UNPINNED SCRUB GRID)*/}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 6. KEYNOTE SPEAKERS SECTION */}
      <FeaturedSpeakersGrid speakers={SPEAKERS} />

      {/* ============================================================ */}
      {/* 7. SPONSORS SECTION                                          */}
      <PremiumSponsorsGrid
        title="Current Sponsors"
        subtitle="Industry & Innovation Partners"
        sponsors={CURRENT_SPONSORS}
      />
      <StaggeredSponsorsGrid
        title="Past Sponsors"
        subtitle="Pioneers & Legacy Partners"
        sponsors={PAST_SPONSORS}
      />

      {/* ============================================================ */}
      {/* 8. GLOBAL SUMMIT FOOTER                                      */}
      {/* ============================================================ */}
      <ContactFooter />
    </div>
  );
}
