import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ExternalLink,
  X,
  Trophy,
  Users,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ContactFooter from "../components/ContactFooter";

export default function Events({ embedded = false }) {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, 32]),
    { stiffness: 40, damping: 30, mass: 0.8 },
  );
  const heroParallaxX = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, -12]),
    { stiffness: 40, damping: 30, mass: 0.8 },
  );
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1.02, 1.06]);
  const heroCueOpacity = useTransform(heroScrollProgress, [0, 0.42], [1, 0]);
  // Pointer parallax disabled — was causing jank on scroll
  const heroPointerX = useMotionValue(0);
  const heroPointerY = useMotionValue(0);
  const heroCombinedX = heroParallaxX;
  const heroCombinedY = heroParallaxY;

  const handleHeroPointerMove = (_event) => {
    // Intentionally no-op — pointer parallax removed for performance
  };

  const resetHeroPointer = () => {
    heroPointerX.set(0);
    heroPointerY.set(0);
  };

  const openStandaloneEvent = (event) => {
    setSelectedEventModal(event);
  };

  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All Events");

  // Standalone /events catalogue. The embedded homepage timeline below stays untouched.
  const standaloneCategories = [
    "All Events",
    "Strategy & Planning",
    "Quizzes & Treasure Hunt",
    "Finance",
    "Business Development",
  ];

  const standaloneEvents = [
    {
      id: "b-plan",
      title: "B-Plan",
      eventNo: "01",
      category: "Flagship Business Plan",
      categories: [
        "All Events",
        "Strategy & Planning",
        "Business Development",
        "Finance",
      ],
      tagline: "Got a million-dollar idea? Prove it.",
      prize: "₹25,000",
      capacity: "1-4 Members",
      time: "TBD",
      location: "MNNIT Allahabad",
      cardImage: "/b-plan-card.jpeg",
      cardImagePosition: "center",
      registrationUrl:
        "http://unstop.com/o/UL8OJ4R?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
      description:
        "Pitch your venture idea to an expert panel. Define your market opportunity, business model, and financial viability in Renaissance 10.0's flagship business-plan challenge.",
      detailDescription: [
        "B-Plan is the flagship business-plan competition of Renaissance 10.0, providing aspiring founders and student innovators with a platform to bring viable concepts to life. Participants present comprehensive business blueprints covering market problem statements, customer discovery, revenue models, and financial forecasts.",
        "Step into the 'Fish Tank' to pitch your venture before a distinguished panel of industry veterans, angel investors, and seasoned founders. Receive sharp, constructive feedback, defend your strategic decisions, and take a definitive step toward securing mentorship, grants, and real-world venture backing.",
      ],
    },
    {
      id: "strategy-wiz",
      title: "Strategy-Wiz",
      eventNo: "02",
      category: "Strategy & Marketing",
      categories: ["All Events", "Strategy & Planning"],
      tagline: "From Product to Phenomenon: Architecting Iconic Launches",
      prize: "₹15,000",
      capacity: "1-3 Members",
      time: "TBD",
      location: "MNNIT Allahabad",
      cardImage: "/strategy-wiz-card.jpeg",
      cardImagePosition: "center",
      registrationUrl:
        "https://unstop.com/competitions/strategy-wiz-renaissance-100-motilal-nehru-national-institute-of-technology-1755423?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
      description:
        "Craft a high-impact launch strategy. Analyze market dynamics, define your target audience, and build an iconic go-to-market plan.",
      detailDescription: [
        "A groundbreaking product is only as impactful as the strategy behind its launch. Strategy-Wiz challenges teams to step into the role of chief marketing strategists and product architects, designing comprehensive go-to-market blueprints for next-generation consumer and enterprise innovations.",
        "Analyze evolving market dynamics, define high-value customer segments, and formulate compelling promotional campaigns. Defend your positioning, pricing, and distribution roadmap before experienced industry leaders who know what it takes to turn products into market-defining moments.",
      ],
    },
    {
      id: "biz-war",
      title: "Business Wars",
      eventNo: "03",
      category: "Market Strategy",
      categories: ["All Events", "Strategy & Planning"],
      tagline: "Think Fast. Strategize Better. Win the Market",
      prize: "₹15,000",
      capacity: "2-4 Members",
      time: "TBD",
      location: "MNNIT Allahabad",
      cardImage: "/biz-war-card.jpeg",
      cardImagePosition: "right center",
      registrationUrl:
        "https://unstop.com/competitions/biz-wars-renaissance-100-motilal-nehru-national-institute-of-technology-1756444?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
      description:
        "Navigate real-world market turbulence, outmaneuver competitors, and make critical strategic decisions in a high-pressure competition.",
      detailDescription: [
        "Business Wars is an intense, multi-round corporate strategy simulation where teams command competing enterprises navigating turbulent market environments. Teams must balance profitability with aggressive expansion while countering moves from formidable rival firms.",
        "Make high-stakes decisions under strict time limits: respond to sudden macroeconomic shifts, supply disruptions, aggressive price wars, and regulatory changes. Every strategic pivot directly impacts your firm's market share, requiring agile thinking, teamwork, and decisive leadership.",
      ],
    },
    {
      id: "biz-tech-quiz",
      title: "Biz-Tech Quiz",
      eventNo: "04",
      category: "Quiz Competition",
      categories: ["All Events", "Quizzes & Treasure Hunt"],
      tagline: "Where Technology Collides with Business Acumen",
      prize: "Cash & Goodies",
      capacity: "1-2 Members",
      time: "TBD",
      location: "MNNIT Campus",
      cardImage: null,
      registrationUrl: null,
      description:
        "Conducted by Gnosis Quiz Club, test your knowledge across technology breakthroughs, startups, venture pivots, and global business titans.",
      detailDescription: [
        "Conducted by the Gnosis Quiz Club of MNNIT Allahabad, the Biz-Tech Quiz tests the sharpest minds at the intersection of business acumen, corporate history, emerging technology, and startup culture.",
        "Prepare for an electric battle of wits spanning silicon valley milestones, corporate battles, venture capital shifts, patent triumphs, and frontier innovations in artificial intelligence. From written screening rounds to lightning-fast stage buzzer showdowns, precision and speed will decide the victor.",
      ],
    },
    {
      id: "treasure-hunt",
      title: "Treasure Hunt",
      eventNo: "05",
      category: "Campus Adventure",
      categories: ["All Events", "Quizzes & Treasure Hunt"],
      tagline: "Decode the Clues. Navigate the Campus. Claim the Bounty.",
      prize: "Prizes & Goodies",
      capacity: "3-5 Members",
      time: "TBD",
      location: "MNNIT Campus",
      cardImage: null,
      registrationUrl: null,
      description:
        "An adventurous campus-wide quest. Decode cryptic clues, navigate hidden waypoints across MNNIT, and race against the clock.",
      detailDescription: [
        "Get ready for an adrenaline-pumping campus-wide quest across MNNIT Allahabad! Treasure Hunt combines cryptographic puzzle-solving, physical exploration, and team collaboration into an exhilarating high-stakes adventure.",
        "Work together as a cohesive unit to crack complex riddles, decode coordinate markers, and unlock successive checkpoints scattered across campus landmarks. Outpace rival crews, avoid dead ends, and race against the clock to unearth the grand bounty waiting at the final destination.",
      ],
    },
    {
      id: "mock-ipl-auction",
      title: "Mock IPL Auction",
      eventNo: "06",
      category: "Strategy & Auction",
      categories: ["All Events", "Strategy & Planning", "Finance"],
      tagline: "Step into the shoes of an IPL franchise owner!",
      prize: "Cash Prize Pool",
      capacity: "2-4 Members",
      time: "TBD",
      location: "MNNIT Allahabad",
      cardImage: null,
      registrationUrl: null,
      description:
        "Manage token purses, evaluate player valuations, and build a championship-winning squad under live auction pressure.",
      detailDescription: [
        "Step into the high-stakes franchise war room and experience the thrill of the IPL auction table! In this strategic simulation, participants assume the role of team owners and analysts managing a finite purse of bidding tokens.",
        "Evaluate player statistics, navigate budget constraints, and formulate data-driven acquisition tactics under intense live bidding. Balance your roster across all-rounders, pace bowlers, and match-winning batsmen to assemble the most formidable playing XI within strict salary cap rules.",
      ],
    },
  ];

  if (!embedded) {
    const normalizedSearch = eventSearch.trim().toLowerCase();
    const visibleEvents = standaloneEvents.filter((event) => {
      const matchesFilter =
        eventFilter === "All Events" ||
        (event.categories ?? [event.category]).includes(eventFilter);
      const matchesSearch =
        !normalizedSearch ||
        `${event.title} ${(event.categories ?? [event.category]).join(" ")} ${event.location} ${event.description}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });

    return (
      <main
        className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#030911] text-[#F4EBD9]"
        aria-label="Events"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetHeroPointer}
      >
        {/* Background Subtle Nautical Chart Grid */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Hero Section with Cinematic Nautical Artwork */}
        <motion.div
          ref={heroRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden sm:h-[400px] lg:h-[420px]"
        >
          <motion.div
            className="absolute -inset-[3%]"
            style={
              prefersReducedMotion
                ? undefined
                : {
                    x: heroCombinedX,
                    y: heroCombinedY,
                    scale: heroScale,
                  }
            }
          >
            <motion.img
              src="/bg_images/events.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-top will-change-transform"
              draggable="false"
            />
          </motion.div>

          {/* Wakes and Sunlight Shimmer */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute left-[44%] top-[72%] h-px w-[34%] origin-left bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[0.35px]"
                animate={{
                  x: [-42, 54, -42],
                  opacity: [0.08, 0.82, 0.08],
                  scaleX: [0.58, 1.38, 0.58],
                }}
                transition={{ duration: 8.6, ease: "easeOut", delay: 1.1 }}
              />
              <motion.div
                className="absolute left-[50%] top-[77%] h-px w-[27%] origin-left bg-gradient-to-r from-transparent via-[#dff8ff]/75 to-transparent"
                animate={{
                  x: [34, -38, 34],
                  opacity: [0.06, 0.66, 0.06],
                  scaleX: [0.7, 1.32, 0.7],
                }}
                transition={{ duration: 9.8, ease: "easeOut", delay: 1.8 }}
              />
              <motion.div
                className="absolute -left-[28%] top-[59%] h-28 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl mix-blend-screen"
                animate={{ x: [0, 1700], opacity: [0, 0.55, 0] }}
                transition={{ duration: 12.8, ease: "easeInOut", delay: 1.2 }}
              />
            </>
          )}

          {/* Smooth Fade from Hero Art to Dark Oceanic Canvas */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030911]/20 via-[#030911]/60 to-[#030911]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#030911]/85 to-[#030911]" />

          {/* Hero Typography */}
          <motion.div
            className="absolute left-5 top-[90px] max-w-[85vw] sm:left-14 sm:top-[110px] lg:left-[8.5vw] lg:top-[120px]"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            <h1 className="font-cinzel text-5xl font-black leading-none tracking-[-0.015em] sm:text-7xl lg:text-[96px]">
              <span className="relative inline-block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#F4EBD9] via-[#E6CE94] to-[#D4AF37] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] after:absolute after:bottom-0 after:left-[4%] after:h-px after:w-[92%] after:bg-gradient-to-r after:from-transparent after:via-[#d4af37] after:to-transparent">
                Events
              </span>
            </h1>
            <p className="mt-2 font-montserrat text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4af37] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-xs lg:mt-3 lg:text-sm">
              <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-[8%] after:h-px after:w-[84%] after:bg-gradient-to-r after:from-transparent after:via-[#c99535] after:to-transparent">
                Renaissance 10.0 — MNNIT Allahabad
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Events Catalogue Section */}
        <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16 pt-[230px] sm:px-6 sm:pt-[270px] lg:px-8 lg:pt-[300px]">
          {/* Category Filter Navigation Bar */}
          <div className="relative z-10 mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {standaloneCategories.map((cat) => {
              const isActive = eventFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEventFilter(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? "bg-[#d4af37] text-[#0C2B3D] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-105"
                      : "bg-[#091522]/80 text-[#d4af37]/80 border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:text-white hover:bg-[#0F2236]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 6 Events Grid: Clean, Fast & Zero Lag */}
          {visibleEvents.length > 0 ? (
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {visibleEvents.map((event) => (
                <article
                  key={event.id}
                  onClick={() => openStandaloneEvent(event)}
                  className="event-card-simple-animate group relative isolate flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#d4af37]/60 bg-[#F4EBD9]/95 text-[#0C2B3D] shadow-[0_12px_35px_rgba(0,0,0,0.45)] hover:border-[#d4af37] hover:shadow-[0_18px_45px_rgba(212,175,55,0.25)] hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  {/* Brass Nautical Corner Accents */}
                  <span className="pointer-events-none absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/70 group-hover:border-[#d4af37] transition-colors" />
                  <span className="pointer-events-none absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/70 group-hover:border-[#d4af37] transition-colors" />
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/70 group-hover:border-[#d4af37] transition-colors" />
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/70 group-hover:border-[#d4af37] transition-colors" />

                  <div className="flex flex-col gap-2">
                    {/* Top Header Row: Category & Clean Event Number Badge */}
                    <div className="flex items-center justify-between w-full pb-2 border-b border-[#0C2B3D]/10">
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-75 text-[#0C2B3D] truncate max-w-[180px]">
                        {event.category}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#0C2B3D]/20 bg-[#0C2B3D]/10 text-[#0C2B3D] uppercase tracking-wider font-extrabold shrink-0">
                        EVENT {event.eventNo} / 06
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl sm:text-2xl font-black font-cinzel tracking-tight text-[#0C2B3D] group-hover:text-[#1C4ED8] transition-colors">
                      {event.title}
                    </h3>

                    {/* Tagline quote */}
                    {event.tagline && (
                      <p className="text-[11px] sm:text-xs font-semibold italic opacity-85 text-[#0C2B3D] line-clamp-1">
                        "{event.tagline}"
                      </p>
                    )}

                    {/* Animated Synchronized Glowing Prize */}
                    <div className="pt-0.5 pb-0.5">
                      <div className="prize-glow-animated inline-flex items-center gap-1.5 text-[#8a5d00] font-mono text-xs sm:text-sm font-black tracking-wide">
                        <Trophy className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>Prize Pool: {event.prize}</span>
                      </div>
                    </div>

                    {/* Description: concise and punchy */}
                    <p className="line-clamp-2 text-[11px] sm:text-xs font-mono leading-relaxed opacity-85 text-[#0C2B3D] mt-0.5">
                      {event.description}
                    </p>
                  </div>

                  {/* Action Button: Matched with Home.jsx Wheel Card */}
                  <div className="pt-3 sm:pt-4 mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openStandaloneEvent(event);
                      }}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-[#1C4ED8] hover:bg-[#1E40AF] text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(28,78,216,0.35)] hover:shadow-[0_6px_22px_rgba(28,78,216,0.55)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[20px] border border-[#d4af37]/30 bg-[#0A1624]/90 px-6 py-12 text-center shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
              <p className="font-cinzel text-lg font-bold text-[#F4EBD9]">
                No events found on this horizon.
              </p>
              <p className="mt-1 font-montserrat text-sm text-[#8E9CA8]">
                Try selecting another category or check back soon.
              </p>
            </div>
          )}

          {/* Nautical Horizon Divider */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex items-center justify-center gap-3 text-center sm:gap-5"
          >
            <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.28em] text-[#d4af37] sm:text-xs">
              Same Ocean
              <motion.span
                className="mx-1.5 inline-block text-base leading-none text-[#d4af37]"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -4, 0], rotate: [-4, 4, -4] }
                }
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ⚓
              </motion.span>
              Higher Horizons
            </span>
            <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
          </motion.div>
        </section>

        {/* Large Clean Modal: 100% Responsive on Mobile, Zero AI Slop, Identically Sized Buttons */}
        <AnimatePresence>
          {selectedEventModal && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 md:p-8 overflow-y-auto"
              onClick={() => setSelectedEventModal(null)}
            >
              <motion.div
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 15 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }
                }
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#10161D] text-[#CBD5E1] shadow-[0_25px_90px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col my-auto"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedEventModal.title} details`}
              >
                {/* Close Button Top Right */}
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 sm:gap-6 items-stretch p-4 sm:p-6 md:p-7 overflow-y-auto">
                  {/* Left Column: Event Poster (Clean Poster Image, No AI Slop) */}
                  <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-[#070D15] overflow-hidden flex items-center justify-center h-48 sm:h-60 md:h-full min-h-[190px] md:min-h-[440px]">
                    {selectedEventModal.cardImage ? (
                      <img
                        src={selectedEventModal.cardImage}
                        alt={selectedEventModal.title}
                        className="w-full h-full object-contain max-h-[440px] rounded-xl"
                        style={{
                          objectPosition:
                            selectedEventModal.cardImagePosition || "center",
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-[#0B1726] via-[#070E18] to-[#03060B] border border-[#c5a25f]/20 rounded-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-mono text-[10px] font-bold text-[#c5a25f] tracking-[0.2em] uppercase">
                            RENAISSANCE 10.0
                          </span>
                          <span className="font-mono text-[10px] text-white/60 tracking-wider">
                            EVENT {selectedEventModal.eventNo}
                          </span>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <div className="w-14 h-14 mx-auto mb-3 rounded-full border border-[#c5a25f]/40 bg-[#c5a25f]/10 flex items-center justify-center text-[#c5a25f]">
                            <Trophy className="w-7 h-7" />
                          </div>
                          <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-1">
                            {selectedEventModal.title}
                          </h3>
                          <p className="font-mono text-xs text-[#c5a25f] tracking-wide uppercase">
                            {selectedEventModal.tagline}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8E9CA8]">{selectedEventModal.location}</span>
                          <span className="text-[#c5a25f] font-bold">{selectedEventModal.prize}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Clean Event Dossier (Richly Filled, Zero Awkward Space) */}
                  <div className="flex flex-col justify-between pt-1 md:pt-0">
                    <div>
                      {/* Event Title */}
                      <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-wide pr-8">
                        {selectedEventModal.title}
                      </h2>

                      {/* Two Spec Cards Side-by-Side (No text cutoffs) */}
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mt-3 sm:mt-4">
                        <div className="bg-[#17202B] border border-white/10 rounded-xl p-3 sm:p-3.5">
                          <span className="block font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8E9CA8]">
                            CATEGORY
                          </span>
                          <span className="block font-mono text-xs sm:text-sm font-bold text-white uppercase mt-1 leading-snug break-words">
                            {selectedEventModal.category}
                          </span>
                        </div>
                        <div className="bg-[#17202B] border border-white/10 rounded-xl p-3 sm:p-3.5">
                          <span className="block font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8E9CA8]">
                            TEAM & PRIZE
                          </span>
                          <span className="block font-mono text-xs sm:text-sm font-bold text-[#f8d368] uppercase mt-1 leading-snug break-words drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]">
                            {selectedEventModal.capacity} • {selectedEventModal.prize}
                          </span>
                        </div>
                      </div>

                      {/* Event Overview: Well-Proportioned, Natural Spacing, No Clipping */}
                      <div className="mt-4 sm:mt-5">
                        <span className="block font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#c5a25f]">
                          EVENT OVERVIEW
                        </span>
                        <div className="mt-2.5 border-l-2 border-[#c5a25f]/60 pl-3.5 space-y-2.5 font-montserrat text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                          {Array.isArray(selectedEventModal.detailDescription) ? (
                            selectedEventModal.detailDescription.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))
                          ) : (
                            <p>{selectedEventModal.detailDescription}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons: Identically Sized Register & WhatsApp Buttons in Equal Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6">
                      {selectedEventModal.registrationUrl ? (
                        <a
                          href={selectedEventModal.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-[50px] w-full px-4 rounded-xl bg-[#c5a25f] hover:bg-[#d8b56f] text-[#0C2B3D] font-montserrat font-bold text-xs sm:text-sm uppercase tracking-wider text-center transition-all shadow-lg hover:shadow-[0_8px_25px_rgba(197,162,95,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Register on Unstop</span>
                          <ExternalLink className="w-4 h-4 shrink-0" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEventModal(null);
                            navigate(`/events/${selectedEventModal.id}/register`);
                          }}
                          className="h-[50px] w-full px-4 rounded-xl bg-[#c5a25f] hover:bg-[#d8b56f] text-[#0C2B3D] font-montserrat font-bold text-xs sm:text-sm uppercase tracking-wider text-center transition-all shadow-lg hover:shadow-[0_8px_25px_rgba(197,162,95,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Register Now</span>
                        </button>
                      )}

                      {/* Identically Sized WhatsApp Community Button */}
                      <a
                        href="https://whatsapp.com/channel/0029VbDqDCA8V0tjtrkBsT46"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-[50px] w-full px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase text-center transition-all shadow-lg hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FaWhatsapp className="w-4 h-4 text-white shrink-0" />
                        <span>Join WhatsApp Group</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <ContactFooter />
      </main>
    );
  }

  // Structured 2-Day event dataset with clean placeholder copy
  const timelineData = {
    1: {
      dayNumber: 1,
      bannerTitle: "DAY 1",
      subtitle: "NEW SHORES • INAUGURAL & SPRINTS",
      nodePos: { x: 220, y: 220 },
      events: [
        {
          id: "event-1-keynote",
          title: "Summit Keynote & Inaugural",
          category: "Flagship Session",
          time: "TBD",
          location: "MNNIT",
          icon: "compass",
          prize: "Summit Access",
          tag: "Flagship",
          description:
            "Placeholder description: The grand inaugural ceremony bringing together visionaries, innovators, and industry leaders to kickstart the summit journey.",
          teamSize: "Individual / Open",
          rules: [
            "Placeholder rule: Valid summit entry credentials required at entrance.",
            "Placeholder rule: Seating is allocated on a first-come, first-served basis.",
          ],
        },
        {
          id: "event-1-hackathon",
          title: "Hackathon Sprint: Round 1",
          category: "Technical Challenge",
          time: "TBD",
          location: "MNNIT",
          icon: "swords",
          prize: "₹2,50,000 Bounty",
          tag: "Team (2-4)",
          description:
            "Placeholder description: High-intensity prototype development marathon across deep tech, AI, and startup domain problem statements.",
          teamSize: "2 - 4 Members",
          rules: [
            "Placeholder rule: All source code must be built during the allotted time.",
            "Placeholder rule: Live functional demo required for jury review.",
          ],
        },
      ],
    },
    2: {
      dayNumber: 2,
      bannerTitle: "DAY 2",
      subtitle: "BIGGER WAVES • GRAND FINALS",
      nodePos: { x: 460, y: 220 },
      events: [
        {
          id: "event-2-finals",
          title: "Hackathon Finals & Pitch",
          category: "Product Pitch",
          time: "TBD",
          location: "MNNIT",
          icon: "swords",
          prize: "₹2,50,000 Bounty",
          tag: "Jury Round",
          description:
            "Placeholder description: Qualifying finalist teams demonstrate working products and pitch before venture capitalists and technical architects.",
          teamSize: "Finalist Teams",
          rules: [
            "Placeholder rule: 5-minute product presentation followed by 3-minute jury Q&A.",
            "Placeholder rule: Working deployment link mandatory.",
          ],
        },
        {
          id: "event-2-startup-arena",
          title: "Startup Arena & Angel Pitch",
          category: "Venture Capital",
          time: "TBD",
          location: "MNNIT",
          icon: "anchor",
          prize: "₹10,00,000+ Deals",
          tag: "Pitch Battle",
          description:
            "Placeholder description: Early-stage startup founders present their business models to angel investors and institutional venture funds.",
          teamSize: "Founder Teams",
          rules: [
            "Placeholder rule: Pitch deck submission required prior to slot.",
            "Placeholder rule: Investment term sheets subject to due diligence.",
          ],
        },
        {
          id: "event-2-valedictory",
          title: "Valedictory & Awards Gala",
          category: "Grand Ceremony",
          time: "TBD",
          location: "MNNIT",
          icon: "trophy",
          prize: "Trophies & Honors",
          tag: "Grand Finale",
          description:
            "Placeholder description: The official summit closing ceremony celebrating winners, fellowship honors, and distribution of trophies.",
          teamSize: "All Attendees",
          rules: [
            "Placeholder rule: Open to all summit delegates and participants.",
            "Placeholder rule: Winners must present verified credentials.",
          ],
        },
      ],
    },
  };

  const activeDayData = timelineData[activeDay] || timelineData[1];

  const renderBadgeIcon = (iconType) => {
    switch (iconType) {
      case "swords":
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#38BDF8] filter drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 4.5l5 5L8 21l-5-5L14.5 4.5z" />
            <path d="M18.5 8.5l-4-4" />
            <path d="M5.5 18.5l-2 2" />
            <path d="M9.5 4.5l-5 5L16 21l5-5L9.5 4.5z" />
            <path d="M5.5 8.5l4-4" />
            <path d="M18.5 18.5l2 2" />
          </svg>
        );
      case "trophy":
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#38BDF8] filter drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
            <path
              d="M6 4h12v6c0 3.31-2.69 6-6 6s-6-2.69-6-6V4z"
              fill="rgba(56,189,248,0.25)"
            />
          </svg>
        );
      case "compass":
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#38BDF8] filter drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon
              points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
              fill="#38BDF8"
            />
          </svg>
        );
      case "anchor":
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#38BDF8] filter drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="3" />
            <line x1="12" y1="22" x2="12" y2="8" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative w-full min-h-screen text-slate-100 select-none ${embedded ? "pt-2 pb-2" : "pt-24 sm:pt-28 pb-16"
        } px-4 sm:px-6 flex flex-col justify-start items-center overflow-x-hidden`}
      style={{
        background:
          "radial-gradient(ellipse 95% 75% at 50% 18%, #030b17 0%, #020710 45%, #000205 100%)",
      }}
    >
      {/* 1. Cinematic Noise & Nautical Chart Overlays */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.18) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00040a]/20 to-black/90 z-0" />

      {/* 2. Top Header & Day Switcher */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto shrink-0 mb-1">
        {/* Left Simple Text Regarding Page */}
        <div className="flex flex-col text-left">
          <h1 className="font-cinzel text-sm sm:text-base md:text-lg font-bold tracking-widest text-[#38BDF8] flex items-center gap-1.5 uppercase drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
            <span className="text-xs">✦</span> EVENTS
          </h1>
          <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
            SUMMIT SCHEDULE & TIMELINE
          </p>
        </div>

        {/* Center Day Switcher Tabs (Strictly 2 Days) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 mx-auto md:mx-0 bg-slate-950/80 p-1 sm:p-1.5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          {[1, 2].map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-4 sm:px-6 py-1 sm:py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 ${activeDay === d
                  ? "bg-gradient-to-r from-[#38BDF8]/25 to-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/60 shadow-[0_0_15px_rgba(56,189,248,0.35)] scale-105"
                  : "text-slate-400 hover:text-slate-200 hover:border-white/20 border border-transparent"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${activeDay === d
                    ? "bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]"
                    : "bg-slate-600"
                  }`}
              />
              <span>Day {d}</span>
            </button>
          ))}
        </div>

        {/* Right Balancing Spacer (Empty, balances center alignment) */}
        <div className="hidden md:block w-28" />
      </div>

      {/* 3. Central Interactive Marine Stage (Spacious 2-Day Layout with Zero Overlap) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto h-[400px] sm:h-[440px] md:h-[470px] my-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.95)] bg-[#030914]/50 backdrop-blur-md shrink-0">
        {/* Subtle Marine Backlight Orbs */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-blue-900/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[320px] h-[180px] bg-[#38BDF8]/5 rounded-full blur-[90px] pointer-events-none" />

        {/* Background Astrolabe & Rhumb Lines (Pure Fine SVG, No Compass Rose) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 450"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="goldBeam" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Nautical Grid Arcs & Astrolabe Markings */}
          <g stroke="#38BDF8" strokeWidth="0.6" opacity="0.15" fill="none">
            <circle cx="350" cy="225" r="140" strokeDasharray="3 6" />
            <circle cx="350" cy="225" r="260" strokeDasharray="4 8" />
            <circle cx="350" cy="225" r="380" strokeDasharray="2 5" />
            <line x1="0" y1="225" x2="1000" y2="225" strokeDasharray="3 6" />
            <line x1="350" y1="0" x2="350" y2="450" strokeDasharray="3 6" />
            <line x1="50" y1="0" x2="650" y2="450" strokeDasharray="2 7" />
            <line x1="650" y1="0" x2="50" y2="450" strokeDasharray="2 7" />
          </g>

          {/* Primary Clean Cyan Dashed Trajectory Line connecting Day 1 -> Day 2 */}
          <path
            d="M 200 225 C 270 175, 390 275, 460 225"
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeDasharray="6 6"
            fill="none"
            filter="url(#goldBeam)"
            opacity="0.85"
          />

          {/* Active Glowing Trajectory Connector to Right-Side Event Dossier */}
          {activeDay === 1 && (
            <path
              d="M 200 225 C 280 130, 480 150, 640 225"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              filter="url(#goldBeam)"
              opacity="0.8"
            />
          )}
          {activeDay === 2 && (
            <path
              d="M 460 225 C 520 180, 580 260, 640 225"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              filter="url(#goldBeam)"
              opacity="0.85"
            />
          )}
        </svg>

        {/* Interactive Waypoint Nodes (Day 1 & Day 2 Only - Zero Overlap with Cards) */}
        {/* DAY 1 Node */}
        <div
          onClick={() => setActiveDay(1)}
          style={{ left: "20%", top: "50%" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group flex flex-col items-center"
        >
          {activeDay === 1 && (
            <div className="absolute -inset-4 rounded-full border border-[#38BDF8] animate-ping opacity-75 pointer-events-none" />
          )}
          {/* Astrolabe Circular Ring when active */}
          {activeDay === 1 && (
            <div className="absolute -inset-3 rounded-full border border-[#38BDF8]/50 border-dashed animate-spin-slow pointer-events-none" />
          )}
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-md ${activeDay === 1
                ? "bg-[#040e1f] border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.7)] scale-110"
                : "bg-[#020612]/90 border-white/30 group-hover:border-[#38BDF8] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              }`}
          >
            <span className="font-cinzel text-xs font-black text-[#38BDF8]">
              01
            </span>
          </div>
          <div className="mt-2 text-center pointer-events-none">
            <h3 className="font-cinzel text-xs font-bold text-white tracking-wider group-hover:text-[#38BDF8] transition-colors">
              DAY 1
            </h3>
            <p className="text-[8px] sm:text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
              NEW SHORES
            </p>
          </div>
        </div>

        {/* DAY 2 Node */}
        <div
          onClick={() => setActiveDay(2)}
          style={{ left: "46%", top: "50%" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group flex flex-col items-center"
        >
          {activeDay === 2 && (
            <div className="absolute -inset-4 rounded-full border border-[#38BDF8] animate-ping opacity-75 pointer-events-none" />
          )}
          {/* Astrolabe Circular Ring when active */}
          {activeDay === 2 && (
            <div className="absolute -inset-3 rounded-full border border-[#38BDF8]/50 border-dashed animate-spin-slow pointer-events-none" />
          )}
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-md ${activeDay === 2
                ? "bg-[#040e1f] border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.7)] scale-110"
                : "bg-[#020612]/90 border-white/30 group-hover:border-[#38BDF8] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              }`}
          >
            <span className="font-cinzel text-xs font-black text-[#38BDF8]">
              02
            </span>
          </div>
          <div className="mt-2 text-center pointer-events-none">
            <h3 className="font-cinzel text-xs font-bold text-white tracking-wider group-hover:text-[#38BDF8] transition-colors">
              DAY 2
            </h3>
            <p className="text-[8px] sm:text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
              GRAND FINALE
            </p>
          </div>
        </div>

        {/* 4. Event Cards (Dedicated Right Column - Zero Overlap with Waypoints) */}
        <div className="absolute right-[3%] sm:right-[4%] top-1/2 -translate-y-1/2 w-[38%] sm:w-[35%] lg:w-[33%] max-w-[370px] flex flex-col gap-2.5 z-30">
          {activeDayData.events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEventModal(event)}
              className="relative p-3 sm:p-3.5 rounded-2xl bg-[#040e1f]/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(56,189,248,0.15)] hover:border-[#38BDF8]/70 hover:shadow-[0_16px_40px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex items-center gap-3"
            >
              {/* Cyan Anchor Connector Point */}
              <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 items-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-[#020612] border border-[#38BDF8] flex items-center justify-center shadow-[0_0_8px_#38BDF8]">
                  <div className="w-1 h-1 rounded-full bg-[#38BDF8]" />
                </div>
              </div>

              {/* Metallic Emblem Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#020712] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:scale-105 group-hover:border-[#38BDF8] transition-all">
                {renderBadgeIcon(event.icon)}
              </div>

              {/* Text Meta Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/25">
                    {event.tag}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                    🕒 {event.time}
                  </span>
                </div>
                <h3 className="font-cinzel text-xs sm:text-[13px] font-bold text-white tracking-wide truncate group-hover:text-[#38BDF8] transition-colors">
                  {event.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] font-montserrat text-slate-300 mt-0.5 truncate flex items-center gap-1">
                  <span>📍</span>
                  <span className="text-slate-200">{event.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Horizon Inscription */}
      <div className="relative z-10 flex items-center justify-center gap-3 text-center shrink-0 pointer-events-none select-none py-0.5 mb-1">
        <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent to-[#38BDF8]/40" />
        <span className="font-cinzel text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-[#38BDF8] uppercase">
          DIFFERENT CREWS ✦ SAME HORIZON
        </span>
        <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-l from-transparent to-[#38BDF8]/40" />
      </div>

      {/* 5. Dark Glassmorphic Event Dossier Modal */}
      {selectedEventModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedEventModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#030914]/95 border border-[#38BDF8]/40 backdrop-blur-2xl text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(56,189,248,0.2)]"
          >
            {/* Ghost Close Button */}
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-[#38BDF8] hover:border-[#38BDF8]/50 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-[#38BDF8]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                {renderBadgeIcon(selectedEventModal.icon)}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  {selectedEventModal.tag}
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1 leading-tight">
                  {selectedEventModal.title}
                </h2>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-montserrat">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">
                  Time & Slot
                </span>
                <span className="text-slate-200 font-semibold">🕒 {selectedEventModal.time}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">
                  Location
                </span>
                <span className="text-slate-200 font-semibold">📍 {selectedEventModal.location}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">
                  Bounty / Honors
                </span>
                <span className="text-[#38BDF8] font-semibold">💰 {selectedEventModal.prize}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">
                  Participation
                </span>
                <span className="text-slate-200 font-semibold">👥 {selectedEventModal.teamSize}</span>
              </div>
            </div>

            {/* Description / Briefing */}
            <div className="mb-5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold mb-1">
                Voyage Briefing
              </h4>
              <p className="font-montserrat text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedEventModal.description}
              </p>
            </div>

            {/* Directives & Rules */}
            {selectedEventModal.rules && (
              <div className="mb-6">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold mb-1.5">
                  Directives & Rules
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs font-montserrat text-slate-400">
                  {selectedEventModal.rules.map((rule, rIdx) => (
                    <li key={rIdx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedEventModal(null);
                  navigate(`/events/${selectedEventModal.id}/register`);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-[#fbbf24] hover:text-white border border-[#fbbf24]/40 hover:border-[#fbbf24] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
              >
                Register For Voyage ➔
              </button>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-montserrat text-xs font-bold uppercase tracking-wider border border-white/10 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
