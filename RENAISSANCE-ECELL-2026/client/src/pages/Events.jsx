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
    useTransform(heroScrollProgress, [0, 1], [0, 108]),
    { stiffness: 88, damping: 24, mass: 0.35 },
  );
  const heroParallaxX = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, -42]),
    { stiffness: 88, damping: 24, mass: 0.35 },
  );
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1.045, 1.13]);
  const heroCueOpacity = useTransform(heroScrollProgress, [0, 0.42], [1, 0]);
  const heroPointerX = useMotionValue(0);
  const heroPointerY = useMotionValue(0);
  const heroPointerSpringX = useSpring(heroPointerX, { stiffness: 110, damping: 22, mass: 0.28 });
  const heroPointerSpringY = useSpring(heroPointerY, { stiffness: 110, damping: 22, mass: 0.28 });
  const heroCombinedX = useTransform(
    [heroParallaxX, heroPointerSpringX],
    ([scrollX, pointerX]) => scrollX + pointerX,
  );
  const heroCombinedY = useTransform(
    [heroParallaxY, heroPointerSpringY],
    ([scrollY, pointerY]) => scrollY + pointerY,
  );

  const handleHeroPointerMove = (event) => {
    if (prefersReducedMotion || !heroRef.current) return;

    const bounds = heroRef.current.getBoundingClientRect();
    if (event.clientY > bounds.bottom) return;

    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroPointerX.set(normalizedX * 18);
    heroPointerY.set(normalizedY * 10);
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
    "Quizzes & Treasure Hunt",
    "Strategy & Planning",
    "Finance",
    "Business Development",
  ];

  const renderStandaloneCategoryIcon = (label) => {
    const iconClass = "h-[18px] w-[18px]";
    const commonProps = {
      className: iconClass,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.9,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    switch (label) {
      case "Quizzes & Treasure Hunt":
        return (
          <svg {...commonProps}>
            <path d="m4 5 5-2 6 2 5-2v15l-5 2-6-2-5 2V5Z" />
            <path d="M9 3v15" />
            <path d="M15 5v15" />
            <path d="M6.5 9.5c2.5-2 5.5 3 9-1" strokeDasharray="1.8 2.4" />
          </svg>
        );
      case "Strategy & Planning":
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="8.5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="12" cy="12" r="1.2" />
            <path d="m15.5 8.5 4-4" />
            <path d="m16 4.5 3.5.5-.5 3.5" />
          </svg>
        );
      case "Finance":
        return (
          <svg {...commonProps}>
            <path d="M5 20V10" />
            <path d="M10 20V5" />
            <path d="M15 20v-7" />
            <path d="M20 20H3" />
            <path d="m5 7 4-3 4 3 6-4" />
            <path d="M19 3v4h-4" />
          </svg>
        );
      case "Business Development":
        return (
          <svg {...commonProps}>
            <path d="M4 12.5 8.5 8l3 3 3-3 5.5 5.5" />
            <path d="m4 12.5 3 3 2-2 3 3 2.5-2.5 2 2 3-3" />
            <path d="M9.5 5.5 12 3l2.5 2.5" />
          </svg>
        );
      case "All Events":
      default:
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="m14.8 9.2-1.7 3.9-3.9 1.7 1.7-3.9 3.9-1.7Z" />
            <path d="M12 1.8v2" />
            <path d="M12 20.2v2" />
            <path d="M1.8 12h2" />
            <path d="M20.2 12h2" />
          </svg>
        );
    }
  };

  const standaloneEvents = [
    {
      id: "summit-keynote",
      title: "B-plan",
      category: "Strategy & Planning",
      categories: [
        "Strategy & Planning",
        "Business Development",
        "Finance",
      ],
      time: "TBD",
      location: "MNNIT",
      description: "Shape a venture idea into a credible business plan, then pitch it with clarity and conviction to an expert panel.",
      eyebrow: "Opening Summit",
      cardImage: "/b-plan-card.jpeg",
      compactModal: true,
      registrationUrl: "https://unstop.com/competitions/b-plan-renaissance-100-motilal-nehru-national-institute-of-technology-1755448?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
      detailDescription: [
        "Overview",
        "Have a venture idea worth backing? Bring it to the table.",
        "B-Plan invites you to turn a promising concept into a persuasive business case. Define the opportunity, shape a workable model, and show an expert panel why your idea can succeed beyond the drawing board.",
        "As Renaissance 10.0’s Fish Tank business-plan challenge, it is a place for emerging founders to pitch with clarity, answer tough questions, and take the first meaningful step toward building their venture.",
      ],
      visualPosition: "18% 58%",
    },
    {
      id: "hackathon-sprint",
      title: "Biz-War",
      category: "Strategy & Planning",
      categories: ["Strategy & Planning", "Quizzes & Treasure Hunt"],
      label: "Strategy & Planning",
      time: "TBD",
      location: "MNNIT",
      description: "Navigate market challenges, build decisive business strategies, and defend every move in a high-pressure competition.",
      eyebrow: "Innovation Lab",
      cardImage: "/biz-war-card.jpeg",
      cardImageFit: "cover",
      cardImagePosition: "right center",
      compactModal: true,
      registrationUrl: "https://unstop.com/competitions/biz-wars-renaissance-100-motilal-nehru-national-institute-of-technology-1756444?lb=useYavQm&utm_medium=Share&utm_source=competitions&utm_campaign=Divyaver74529",
      detailDescription: [
        "Think Fast. Strategize Better. Win the Market:",
        "Business Wars is a high-pressure business strategy competition where teams step into the shoes of competing businesses and battle through real-world market scenarios. Analyse the situation, identify opportunities, build strategies, respond to challenges, and defend your decisions against the competition.",
        "This is not just about knowing business. It is about thinking strategically, adapting quickly, and making decisions that create an edge.",
      ],
      visualPosition: "52% 48%",
    },
    {
      id: "product-masterclass",
      title: "Strategy-Wiz",
      category: "Strategy & Planning",
      categories: ["Strategy & Planning", "Quizzes & Treasure Hunt"],
      label: "Strategy & Planning",
      time: "TBD",
      location: "MNNIT",
      description: "Read the market, design a standout launch plan, and turn sharp insight into a compelling go-to-market strategy.",
      eyebrow: "Builder's Deck",
      cardImage: "/strategy-wiz-card.jpeg",
      cardImageFit: "cover",
      compactModal: true,
      registrationUrl: "https://unstop.com/competitions/strategy-wiz-renaissance-100-motilal-nehru-national-institute-of-technology-1755423",
      detailDescription: [
        "Overview",
        "Build the launch strategy that turns a strong product into a market moment.",
        "Strategy-Wiz challenges teams to think beyond the product itself: read the market, identify the audience, and create a launch plan with a clear point of difference. Your task is to connect sharp insight with a campaign that can earn attention and drive adoption.",
        "Bring a bold go-to-market vision, defend the choices behind it, and refine your approach under expert scrutiny. It is a strategic arena for future business leaders who can translate ideas into lasting brand impact.",
      ],
      visualPosition: "78% 50%",
    },
    {
      id: "biz-tech-quiz",
      title: "Biz-Tech Quiz",
      category: "Quizzes & Treasure Hunt",
      categories: ["Quizzes & Treasure Hunt", "Strategy & Planning"],
      label: "Quizzes & Treasure Hunt",
      time: "TBD",
      location: "MNNIT",
      description: "Put your business acumen and tech knowledge to the test! Biz-Tech Quiz, conducted by the Gnosis Quiz Club, brings together intriguing questions at the intersection of business, technology, startups, and innovation.",
      eyebrow: "Quiz Challenge",
      compactModal: true,
      detailDescription: [
        "Put your business acumen and tech knowledge to the test!",
        "Biz-Tech Quiz, conducted by the Gnosis Quiz Club, brings together intriguing questions at the intersection of business, technology, startups, and innovation."
      ],
      visualPosition: "30% 40%",
    },
    {
      id: "treasure-hunt",
      title: "Treasure Hunt",
      category: "Quizzes & Treasure Hunt",
      categories: ["Quizzes & Treasure Hunt"],
      label: "Quizzes & Treasure Hunt",
      time: "TBD",
      location: "MNNIT",
      description: "Get ready for an exciting adventure across the MNNIT campus! Treasure Hunt challenges participants to crack clues, explore hidden corners, and race against time to uncover the treasure, with exciting prizes and goodies waiting at the finish line.",
      eyebrow: "Campus Adventure",
      compactModal: true,
      detailDescription: [
        "Get ready for an exciting adventure across the MNNIT campus!",
        "Treasure Hunt challenges participants to crack clues, explore hidden corners, and race against time to uncover the treasure, with exciting prizes and goodies waiting at the finish line."
      ],
      visualPosition: "50% 50%",
    },
    {
      id: "mock-ipl-auction",
      title: "Mock IPL Auction",
      category: "Finance",
      categories: ["Finance", "Strategy & Planning"],
      label: "Finance",
      time: "TBD",
      location: "MNNIT",
      description: "Step into the shoes of an IPL franchise owner! In this Mock IPL Auction, participants receive a limited pool of tokens and compete to build their dream teams by strategically bidding on players, balancing budgets, and making every bid count.",
      eyebrow: "Auction Simulation",
      compactModal: true,
      detailDescription: [
        "Step into the shoes of an IPL franchise owner!",
        "In this Mock IPL Auction, participants receive a limited pool of tokens and compete to build their dream teams by strategically bidding on players, balancing budgets, and making every bid count."
      ],
      visualPosition: "70% 60%",
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
        className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#efe3cb] text-[#123f55]"
        aria-label="Events"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetHeroPointer}
      >
        {/* The hero copy sits in the clear left side of the supplied artwork. */}
        <motion.div
          ref={heroRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[330px] overflow-hidden sm:h-[360px] lg:h-[390px]"
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
              initial={
                prefersReducedMotion
                  ? false
                  : { x: 46, y: 4, scale: 1.055, rotate: 0.08 }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : { x: -34, y: -4, scale: 1.085, rotate: -0.08 }
              }
              transition={{
                duration: 14.5,
                ease: [0.22, 0.68, 0.26, 1],
              }}
            />
          </motion.div>

          {/* Faster wakes, sunlight glints and distant birds make the hero feel alive without WebGL. */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute left-[44%] top-[72%] h-px w-[34%] origin-left bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[0.35px]"
                animate={{ x: [-42, 54, -42], opacity: [0.08, 0.82, 0.08], scaleX: [0.58, 1.38, 0.58] }}
                transition={{ duration: 8.6, ease: "easeOut", delay: 1.1 }}
              />
              <motion.div
                className="absolute left-[50%] top-[77%] h-px w-[27%] origin-left bg-gradient-to-r from-transparent via-[#dff8ff]/75 to-transparent"
                animate={{ x: [34, -38, 34], opacity: [0.06, 0.66, 0.06], scaleX: [0.7, 1.32, 0.7] }}
                transition={{ duration: 9.8, ease: "easeOut", delay: 1.8 }}
              />
              <motion.div
                className="absolute left-[55%] top-[80%] h-[2px] w-[18%] origin-left rounded-full bg-gradient-to-r from-transparent via-white/65 to-transparent blur-[0.8px]"
                animate={{ x: [-24, 44, -24], opacity: [0, 0.7, 0], scaleX: [0.5, 1.45, 0.5] }}
                transition={{ duration: 8.1, ease: "easeOut", delay: 2.7 }}
              />
              <motion.div
                className="absolute left-[39%] top-[69%] h-8 w-[40%] rounded-[50%] border-t border-white/25 blur-[1.5px]"
                animate={{ x: [-18, 26, -18], scaleX: [0.82, 1.08, 0.82], opacity: [0.08, 0.42, 0.08] }}
                transition={{ duration: 10.8, ease: "easeInOut", delay: 0.8 }}
              />

              {/* Sunlight sweeping across the water gives the hero a cinematic shimmer. */}
              <motion.div
                className="absolute -left-[28%] top-[59%] h-28 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl mix-blend-screen"
                animate={{ x: [0, 1700], opacity: [0, 0.55, 0] }}
                transition={{ duration: 12.8, ease: "easeInOut", delay: 1.2 }}
              />

              {/* Tiny distant birds cross at different speeds for extra depth. */}
              <motion.span
                className="absolute left-[18%] top-[31%] font-serif text-lg text-[#173f51]/45 drop-shadow-sm"
                animate={{ x: [0, 165], y: [0, -13, 3], rotate: [-4, 5, -4], opacity: [0, 0.65, 0] }}
                transition={{ duration: 12.4, ease: "linear", delay: 1.6 }}
                aria-hidden="true"
              >
                ︿
              </motion.span>
              <motion.span
                className="absolute left-[30%] top-[38%] font-serif text-sm text-[#173f51]/35 drop-shadow-sm"
                animate={{ x: [0, 120], y: [0, 9, -4], rotate: [3, -5, 3], opacity: [0, 0.5, 0] }}
                transition={{ duration: 13.6, ease: "linear", delay: 2.4 }}
                aria-hidden="true"
              >
                ︿
              </motion.span>
            </>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-[#071421]/10 via-transparent to-[#efe3cb]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#efe3cb]" />

          <motion.div
            className="absolute left-10 top-[96px] max-w-[70vw] sm:left-20 sm:top-[110px] lg:left-[8.5vw] lg:top-[120px]"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            <h1 className="font-cinzel text-5xl font-black leading-none tracking-[-0.015em] drop-shadow-[0_3px_12px_rgba(255,255,255,.75)] sm:text-7xl lg:text-[104px]">
              <span className="relative inline-block pb-3 bg-gradient-to-b from-[#155d78] via-[#0b4259] to-[#062d40] bg-clip-text text-transparent after:absolute after:bottom-0 after:left-[6%] after:h-px after:w-[88%] after:bg-gradient-to-r after:from-transparent after:via-[#c99535] after:to-transparent">
                Events
              </span>
            </h1>
            <p className="mt-2 font-montserrat text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#164f66] drop-shadow-[0_2px_8px_rgba(255,255,255,.9)] sm:text-xs lg:mt-3 lg:text-sm">
              <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-[8%] after:h-px after:w-[84%] after:bg-gradient-to-r after:from-transparent after:via-[#c99535] after:to-transparent">
                Renaissance 10.0 — MNNIT Allahabad
              </span>
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/45 bg-[#073b4d]/35 px-3.5 py-2 font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md sm:flex"
            style={prefersReducedMotion ? undefined : { opacity: heroCueOpacity }}
            animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>Scroll to explore</span>
            <span className="text-[#efc96f]">↓</span>
          </motion.div>
        </motion.div>

        <section className="relative z-10 mx-auto w-full max-w-[1540px] px-3 pb-14 pt-[255px] sm:px-5 sm:pt-[282px] lg:px-8 lg:pt-[304px]">
          {/* Search and filters deliberately share one contained dock so they never overflow. */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.72 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-2 rounded-[24px] border border-white/80 bg-[#fffdf7]/92 p-2.5 shadow-[0_18px_45px_rgba(35,57,61,.16)] backdrop-blur-xl md:grid-cols-[minmax(220px,.55fr)_minmax(0,1.45fr)] md:items-center md:gap-3 md:p-3"
          >
            <label className="flex min-h-[54px] min-w-0 items-center gap-3 rounded-[17px] border border-[#d9ccb7] bg-white/95 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-[#1c6078]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="sr-only">Search events</span>
              <input
                value={eventSearch}
                onChange={(event) => setEventSearch(event.target.value)}
                placeholder="Search events..."
                className="min-w-0 flex-1 bg-transparent py-3 font-montserrat text-sm font-medium text-[#173f51] outline-none placeholder:text-[#79909a]"
              />
            </label>

            <div className="grid min-w-0 grid-cols-2 gap-2 rounded-[18px] border border-[#d9ccb7] bg-white/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.95)] sm:grid-cols-3 lg:grid-cols-5">
              {standaloneCategories.map((label) => {
                const isActive = eventFilter === label;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => setEventFilter(label)}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { y: -3, scale: 1.025 }
                    }
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.965 }}
                    transition={{ type: "spring", stiffness: 430, damping: 25 }}
                    className={`group/filter relative flex min-h-[54px] min-w-0 items-center justify-center gap-2.5 overflow-hidden rounded-[13px] border px-3 py-2 font-montserrat text-[11px] font-extrabold tracking-[-0.01em] transition-[color,background-color,border-color,box-shadow] duration-200 sm:text-[13px] ${isActive
                        ? "border-[#d8a642] bg-gradient-to-b from-[#12677f] to-[#0a526a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_7px_18px_rgba(12,88,112,.22)]"
                        : "border-transparent bg-transparent text-[#2c5c6e] hover:border-[#dfd3bf] hover:bg-[#f5f3ec] hover:text-[#123f55] hover:shadow-[0_5px_14px_rgba(38,82,96,.08)]"
                      }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border transition-all duration-200 ${isActive
                          ? "border-[#f0cf82]/45 bg-[#f4c86a]/15 text-[#f6cf79] shadow-[0_0_14px_rgba(230,183,88,.15)]"
                          : "border-[#d8c8aa] bg-[#fbf5e9] text-[#c69335] group-hover/filter:border-[#d7b86f] group-hover/filter:bg-[#fff9ec] group-hover/filter:text-[#ad7822]"
                        }`}
                      aria-hidden="true"
                    >
                      {renderStandaloneCategoryIcon(label)}
                    </span>
                    <span className="min-w-0 text-center leading-tight">{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="events-filter-active-glow"
                        className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f2c967] to-transparent"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Slow decorative currents behind the fleet, transform-only for smooth scrolling. */}
          <div className="pointer-events-none absolute inset-x-0 top-[360px] -z-0 h-[620px] overflow-hidden">
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute left-[-12%] top-24 h-56 w-56 rounded-full bg-[#1f7f96]/[0.07] blur-3xl"
                  animate={{ x: [0, 120, 0], y: [0, 34, 0], scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-[-8%] top-72 h-64 w-64 rounded-full bg-[#d6a64f]/[0.08] blur-3xl"
                  animate={{ x: [0, -96, 0], y: [0, -42, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute left-[-20%] top-[46%] h-[2px] w-[55%] rounded-full bg-gradient-to-r from-transparent via-[#2c8296]/25 to-transparent blur-[1px]"
                  animate={{ x: [0, 1250], opacity: [0, 0.55, 0], scaleX: [0.7, 1.2, 0.7] }}
                  transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
                />
              </>
            )}
          </div>

          {visibleEvents.length > 0 ? (
            <motion.div layout className="relative z-10 mt-4 grid auto-rows-fr grid-cols-1 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3 lg:gap-4">
              <AnimatePresence mode="popLayout">
                {visibleEvents.map((event, index) => (
                  <motion.article
                    layout
                    key={event.id}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 42, x: index % 2 === 0 ? -10 : 10, scale: 0.975 }
                    }
                    whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{
                      duration: 0.56,
                      delay: prefersReducedMotion ? 0 : (index % 3) * 0.065,
                      ease: [0.22, 1, 0.36, 1],
                      layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                    }}
                    whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.008 }}
                    className="group relative isolate flex flex-col h-full overflow-hidden rounded-sm border-[1.5px] border-[#d8c8b0] bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e5] to-[#f0e3ce] shadow-[0_8px_24px_rgba(25,40,45,.08),inset_0_0_0_1px_rgba(255,255,255,.6)] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-[#c9a75d] hover:shadow-[0_14px_38px_rgba(25,40,45,.14),0_0_20px_rgba(201,167,93,.2),inset_0_0_0_1px_rgba(255,255,255,.8)]"
                    style={{ contentVisibility: "auto", containIntrinsicSize: "350px" }}
                  >
                    {/* Subtle inner parchment noise texture overlay */}
                    <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                    {/* Corner Ornaments */}
                    <svg className="absolute left-1 top-1 h-3.5 w-3.5 text-[#cfbc9d] transition-colors duration-400 group-hover:text-[#c9a75d] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M2 12h20M12 7l5 5-5 5-5-5z" strokeWidth="1" strokeLinejoin="round" /></svg>
                    <svg className="absolute right-1 top-1 h-3.5 w-3.5 text-[#cfbc9d] transition-colors duration-400 group-hover:text-[#c9a75d] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M2 12h20M12 7l5 5-5 5-5-5z" strokeWidth="1" strokeLinejoin="round" /></svg>
                    <svg className="absolute left-1 bottom-1 h-3.5 w-3.5 text-[#cfbc9d] transition-colors duration-400 group-hover:text-[#c9a75d] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M2 12h20M12 7l5 5-5 5-5-5z" strokeWidth="1" strokeLinejoin="round" /></svg>
                    <svg className="absolute right-1 bottom-1 h-3.5 w-3.5 text-[#cfbc9d] transition-colors duration-400 group-hover:text-[#c9a75d] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M2 12h20M12 7l5 5-5 5-5-5z" strokeWidth="1" strokeLinejoin="round" /></svg>

                    <motion.button
                      type="button"
                      onClick={() => openStandaloneEvent(event)}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="relative flex h-full w-full flex-col text-left"
                      aria-label={`View details for ${event.title}`}
                    >
                      <div className="relative h-[145px] overflow-hidden sm:h-[152px] lg:h-[160px] border-b border-[#dfd0b7]/80 group-hover:border-[#c9a75d]/80 transition-colors duration-400">
                        <motion.div
                          className={`absolute -inset-3 bg-cover will-change-transform transition-[transform,filter] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${event.cardImage ? "filter sepia-[0.35] brightness-95 group-hover:sepia-0 group-hover:brightness-105" : "group-hover:scale-[1.055]"}`}
                          style={{
                            backgroundImage: event.cardImage
                              ? `url('${event.cardImage}')`
                              : "linear-gradient(180deg, rgba(4,35,50,.08), rgba(4,35,50,.46)), url('/ship-map-hero.jpg')",
                            backgroundPosition: event.cardImage
                              ? (event.cardImagePosition ?? "center")
                              : event.visualPosition,
                            backgroundSize: event.cardImage ? (event.cardImageFit ?? "contain") : undefined,
                            backgroundRepeat: event.cardImage ? "no-repeat" : undefined,
                            backgroundColor: event.cardImage ? "#eee1c5" : undefined,
                          }}
                          initial={
                            prefersReducedMotion || event.cardImage
                              ? false
                              : { x: 24, y: 3, scale: 1.075 }
                          }
                          whileInView={
                            prefersReducedMotion || event.cardImage
                              ? undefined
                              : { x: -20, y: -3, scale: 1.1 }
                          }
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: 11.5 + (index % 3) * 0.9,
                            ease: [0.2, 0.65, 0.24, 1],
                            delay: index * 0.28,
                          }}
                        />

                        {!event.cardImage && (
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,27,39,.12)_0%,rgba(2,27,39,.08)_48%,rgba(2,27,39,.68)_100%)]" />
                        )}

                        {!prefersReducedMotion && (
                          <motion.div
                            className="absolute -left-[35%] bottom-[18%] h-px w-[54%] bg-gradient-to-r from-transparent via-white/55 to-transparent"
                            animate={{ x: [520, 0], opacity: [0, 0.48, 0] }}
                            transition={{
                              duration: 10.5 + (index % 3) * 0.55,
                              ease: "easeOut",
                              delay: 0.8 + index * 0.24,
                            }}
                          />
                        )}

                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                      </div>

                      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7 sm:px-6">
                        <div className="absolute -top-[14px] left-5 flex flex-wrap gap-1.5 z-10">
                          {(event.categories ?? [event.label]).map((label) => (
                            <span
                              key={label}
                              className="rounded-[2px] border border-[#d8b55d] bg-gradient-to-b from-[#fae7b1] to-[#f3d683] px-2.5 py-[5px] font-montserrat text-[8px] font-black uppercase tracking-[0.14em] text-[#5c4008] shadow-[0_4px_10px_rgba(94,67,17,.2),inset_0_1px_0_rgba(255,255,255,.6)] sm:text-[9px]"
                            >
                              {label}
                            </span>
                          ))}
                        </div>

                        <h2 className={`mt-2 flex items-start font-cinzel text-[20px] font-bold leading-[1.2] text-[#123f55] transition-colors duration-300 group-hover:text-[#8f5915] sm:text-[22px]`}>
                          {event.title}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-montserrat text-[10px] font-bold text-[#627a85] sm:text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-[#b2976b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-[#b2976b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span className="truncate max-w-[150px]">{event.location}</span>
                          </div>
                        </div>

                        <p className="mt-4 line-clamp-3 min-h-[38px] font-montserrat text-[11px] leading-[1.65] text-[#5a6e76] sm:text-xs relative z-10">
                          {event.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-[#dfd0b7]/60 pt-4 group-hover:border-[#c9a75d]/40 transition-colors duration-400">
                          <span className="font-montserrat text-[9px] font-black uppercase tracking-[0.2em] text-[#a18f70] group-hover:text-[#8f5915] transition-colors duration-300">
                            Inspect Mission
                          </span>
                          <span className="inline-flex h-[34px] items-center justify-center gap-2 rounded-sm border-[1.5px] border-[#a18f70]/40 bg-transparent px-4 font-cinzel text-[10px] font-bold uppercase tracking-[0.12em] text-[#123f55] transition-all duration-300 group-hover:border-[#c9a75d] group-hover:bg-[#f6ebd4] group-hover:text-[#8f5915] shadow-[0_2px_8px_rgba(0,0,0,.04)] group-hover:shadow-[0_4px_12px_rgba(201,167,93,.2)]">
                            Details
                            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <path d="M5 12h14" strokeLinecap="round" />
                              <path d="m14 7 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="mt-4 rounded-[20px] border border-[#ddcfb7] bg-[#fffdf8]/95 px-6 py-12 text-center shadow-[0_10px_28px_rgba(45,61,58,.1)]">
              <p className="font-cinzel text-lg font-bold text-[#173f51]">
                No events found on this horizon.
              </p>
              <p className="mt-1 font-montserrat text-sm text-[#667d86]">
                Try another search or event category.
              </p>
            </div>
          )}

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-center justify-center gap-3 text-center sm:gap-5"
          >
            <span className="h-px w-12 bg-[#b88a47]/55 sm:w-28" />
            <span className="font-cinzel text-[9px] font-bold uppercase tracking-[0.28em] text-[#956329] sm:text-[10px]">
              Same Ocean
              <motion.span
                className="mx-1 inline-block text-base leading-none"
                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ⚓
              </motion.span>
              Higher Horizons
            </span>
            <span className="h-px w-12 bg-[#b88a47]/55 sm:w-28" />
          </motion.div>
        </section>

        <AnimatePresence>
          {selectedEventModal &&
            standaloneEvents.some((event) => event.id === selectedEventModal.id) && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#020b12]/80 p-3 sm:p-5"
                onClick={() => setSelectedEventModal(null)}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.16]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(237,202,116,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(237,202,116,.16) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                />

                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-[720px] overflow-hidden rounded-[18px] border border-[#d4ad58] bg-[#f4ead4] text-[#173f51] shadow-[0_28px_100px_rgba(0,0,0,.58),0_0_0_1px_rgba(255,255,255,.2)_inset]"
                  onClick={(event) => event.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${selectedEventModal.title} event notice`}
                >
                  {/* Game-style notice masthead */}
                  <div className="relative flex min-h-[58px] items-center justify-between border-b border-[#d5b15e]/65 bg-[linear-gradient(180deg,#0d4257_0%,#082f40_100%)] px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center border border-[#e5c26e]/60 bg-[#e1b957]/10 text-[#efca73]">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <circle cx="12" cy="12" r="8.5" />
                          <path d="m14.8 9.2-1.7 3.9-3.9 1.7 1.7-3.9 3.9-1.7Z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-montserrat text-[8px] font-bold uppercase tracking-[0.26em] text-[#d9b967]">
                          Renaissance // System Notice
                        </p>
                        <p className="mt-0.5 font-cinzel text-sm font-black uppercase tracking-[0.11em] text-white sm:text-base">
                          Event Notice
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEventModal(null)}
                      className="flex h-8 w-8 items-center justify-center border border-white/20 bg-white/5 font-montserrat text-base font-bold text-white/80 transition hover:border-[#e4c16f]/70 hover:bg-[#e4c16f]/10 hover:text-white"
                      aria-label="Close event notice"
                    >
                      ×
                    </button>
                  </div>

                  <div className={selectedEventModal.compactModal ? "" : "grid sm:grid-cols-[210px_minmax(0,1fr)]"}>
                    {!selectedEventModal.compactModal && (
                      <div
                        className="relative min-h-[185px] border-b border-[#d9c294] sm:min-h-full sm:border-b-0 sm:border-r"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, rgba(3,26,38,.05), rgba(3,26,38,.64)), url('/ship-map-hero.jpg')",
                          backgroundSize: "cover",
                          backgroundPosition: selectedEventModal.visualPosition,
                        }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(239,202,116,.12)_100%)]" />
                        <div className="absolute left-4 top-4 border border-white/25 bg-[#07384a]/80 px-2.5 py-1 font-montserrat text-[8px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                          {selectedEventModal.eyebrow}
                        </div>
                        <div className="absolute bottom-4 left-4 border border-[#d6ad4f] bg-[#f1d17d] px-3 py-1.5 font-montserrat text-[9px] font-black uppercase tracking-[0.14em] text-[#5d430e] shadow-[0_5px_14px_rgba(0,0,0,.16)]">
                          {selectedEventModal.label}
                        </div>
                      </div>
                    )}

                    <div className="relative p-5 sm:p-6">
                      <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-[#cba352]/35" />
                      <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#cba352]/25" />

                      <p className="font-montserrat text-[8px] font-extrabold uppercase tracking-[0.24em] text-[#9d7a36]">
                        Voyage briefing
                      </p>
                      <h2 className="mt-1 font-cinzel text-xl font-black leading-[1.16] text-[#123f55] sm:text-2xl">
                        {selectedEventModal.title}
                      </h2>

                      {!selectedEventModal.compactModal && (
                        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[#d6c7aa] bg-[#d6c7aa] font-montserrat text-[10px] sm:grid-cols-3">
                          <div className="bg-[#fbf6ea] px-3 py-2.5">
                            <span className="block text-[7px] font-black uppercase tracking-[0.17em] text-[#9b8a69]">Time</span>
                            <strong className="mt-1 block text-[#234d5d]">{selectedEventModal.time}</strong>
                          </div>
                          <div className="bg-[#fbf6ea] px-3 py-2.5">
                            <span className="block text-[7px] font-black uppercase tracking-[0.17em] text-[#9b8a69]">Location</span>
                            <strong className="mt-1 block truncate text-[#234d5d]">{selectedEventModal.location}</strong>
                          </div>
                          <div className="col-span-2 bg-[#fbf6ea] px-3 py-2.5 sm:col-span-1">
                            <span className="block text-[7px] font-black uppercase tracking-[0.17em] text-[#9b8a69]">Class</span>
                            <strong className="mt-1 block text-[#234d5d]">{selectedEventModal.category}</strong>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 space-y-3 border-l-2 border-[#d1a64e] pl-3 font-montserrat text-xs leading-relaxed text-[#63777e] sm:text-[13px]">
                        {(selectedEventModal.detailDescription ?? [selectedEventModal.description]).map((paragraph, index) => (
                          <p key={paragraph} className={index === 0 && selectedEventModal.detailDescription ? "font-bold text-[#234d5d]" : undefined}>
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {selectedEventModal.registrationUrl ? (
                          <a
                            href={selectedEventModal.registrationUrl}
                            className="flex-1 sm:flex-none rounded-sm border border-[#0c5870] bg-[#0c5870] px-6 py-2.5 text-center font-cinzel text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_12px_rgba(12,88,112,.2)] transition hover:bg-[#08485d]"
                          >
                            Enter Event
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEventModal(null);
                              navigate(`/events/${selectedEventModal.id}/register`);
                            }}
                            className="flex-1 sm:flex-none rounded-sm border border-[#0c5870] bg-[#0c5870] px-6 py-2.5 font-cinzel text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_12px_rgba(12,88,112,.2)] transition hover:bg-[#08485d]"
                          >
                            Enter Event
                          </button>
                        )}
                        <a
                          href="https://whatsapp.com/channel/0029VbDqDCA8V0tjtrkBsT46"
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-sm border border-[#1dad59] bg-[#25d366] px-5 py-2.5 text-center font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_12px_rgba(37,211,102,.2)] transition hover:bg-[#1ebe5d]"
                        >
                          <svg className="h-5 w-5 shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16 3.5a12.5 12.5 0 0 0-10.7 19l-1.45 5.15 5.25-1.4A12.5 12.5 0 1 0 16 3.5Z" />
                            <path d="M12.1 9.6c.25-.55.55-.6.9-.6h.62c.3 0 .55.16.67.45l.95 2.18c.13.3.08.65-.13.9l-.7.82c.78 1.62 2.08 2.92 3.7 3.7l.82-.7c.25-.21.6-.26.9-.13l2.18.95c.29.12.45.37.45.67V18.5c0 .35-.05.65-.6.9-.67.3-1.7.5-2.82.15-1.46-.45-3.15-1.48-4.74-3.07-1.59-1.59-2.62-3.28-3.07-4.74-.35-1.12-.15-2.15.15-2.82Z" />
                          </svg>
                          WhatsApp Community
                        </a>

                        <button
                          type="button"
                          onClick={() => setSelectedEventModal(null)}
                          className="w-full sm:w-auto sm:ml-auto rounded-sm border border-[#cfc1a5] bg-transparent px-4 py-2.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e756f] transition hover:border-[#bfa364] hover:bg-white hover:text-[#173f51]"
                        >
                          Dismiss
                        </button>
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
