import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Compass,
  CalendarDays,
  MapPin,
  Clock,
  BedDouble,
  Coffee,
  CheckCircle2,
  Ticket,
  ChevronRight,
  X,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import PageTransitionShimmer from "../components/PageTransitionShimmer";

const TICKET_OPTIONS = [
  {
    id: "1-day",
    name: "1-Day Accommodation",
    price: "₹800",
    duration: "1 Night / 1 Day",
    benefits: [
      "Access to all day 1 events",
      "One night campus accommodation",
      "Breakfast and Lunch included",
      "Event kit & goodies",
    ],
    includesAccommodation: true,
  },
  {
    id: "2-day",
    name: "2-Day Accommodation",
    price: "₹1,500",
    duration: "2 Nights / 2 Days",
    benefits: [
      "Access to full summit (Both Days)",
      "Two nights campus accommodation",
      "All meals included (Breakfast, Lunch, Dinner)",
      "Premium event kit & networking access",
    ],
    includesAccommodation: true,
  },
  {
    id: "event-only",
    name: "Event Ticket (Both Days)",
    price: "₹500",
    duration: "2 Days (No Accommodation)",
    benefits: [
      "Access to full summit (Both Days)",
      "Lunch included (Both Days)",
      "Event kit & goodies",
      "Networking sessions access",
    ],
    includesAccommodation: false,
    warning: "Accommodation is NOT included in this tier.",
  },
];

export default function TicketsAccommodation() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  
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

  const handleContinue = () => {
    if (selectedTicket) {
      navigate(`/register?ticket=${selectedTicket}`);
    }
  };

  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#030911] text-[#F4EBD9]"
      aria-label="Tickets & Accommodation"
    >
      <PageTransitionShimmer />

      {/* Background Subtle Nautical Chart Grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Hero Section */}
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
                  x: heroParallaxX,
                  y: heroParallaxY,
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

        {/* Smooth Fade from Hero Art to Dark Oceanic Canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030911]/20 via-[#030911]/60 to-[#030911]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#030911]/85 to-[#030911]" />

        {/* Hero Typography */}
        <motion.div
          className="absolute left-5 top-[110px] max-w-[85vw] sm:left-14 sm:top-[140px] lg:left-[8.5vw] lg:top-[150px]"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -24, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <h1 className="font-cinzel text-4xl font-black leading-none tracking-[-0.015em] sm:text-6xl lg:text-[72px]">
            <span className="relative inline-block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#F4EBD9] via-[#E6CE94] to-[#D4AF37] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] after:absolute after:bottom-0 after:left-[4%] after:h-px after:w-[92%] after:bg-gradient-to-r after:from-transparent after:via-[#d4af37] after:to-transparent">
              Tickets & Boarding
            </span>
          </h1>
          <p className="mt-2 font-montserrat text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4af37] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-xs lg:mt-3 lg:text-sm">
            <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-[8%] after:h-px after:w-[84%] after:bg-gradient-to-r after:from-transparent after:via-[#c99535] after:to-transparent">
              Secure your passage to Renaissance 10.0
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content Section */}
      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-24 pt-[240px] sm:px-6 sm:pt-[290px] lg:px-8 lg:pt-[330px]">
        
        {/* Event & Accommodation Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          
          {/* Event Details Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#d4af37]/40 bg-[#070D15]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Compass className="w-6 h-6 text-[#d4af37]" />
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4EBD9] tracking-wider uppercase">
                Expedition Details
              </h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#c5a25f]/10 border border-[#c5a25f]/20">
                  <CalendarDays className="w-5 h-5 text-[#c5a25f]" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8E9CA8] mb-1">Date & Duration</h3>
                  <p className="font-montserrat text-sm sm:text-base font-semibold text-white">To Be Announced</p>
                  <p className="font-mono text-xs text-[#c5a25f] mt-0.5">2 Days of Summit</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#c5a25f]/10 border border-[#c5a25f]/20">
                  <MapPin className="w-5 h-5 text-[#c5a25f]" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8E9CA8] mb-1">Venue</h3>
                  <p className="font-montserrat text-sm sm:text-base font-semibold text-white">MNNIT Allahabad Campus</p>
                  <p className="font-mono text-xs text-white/60 mt-0.5">Prayagraj, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accommodation Benefits Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#d4af37]/40 bg-[#070D15]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <BedDouble className="w-6 h-6 text-[#d4af37]" />
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4EBD9] tracking-wider uppercase">
                Boarding Info
              </h2>
            </div>
            
            <div className="space-y-4 font-montserrat text-sm text-[#CBD5E1] leading-relaxed">
              <p>
                Experience the summit with full campus immersion. Our accommodation packages include comfortable lodging within the MNNIT campus boundaries.
              </p>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                  <span>Safe and secure campus lodging for all registered delegates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>Mess meals provided as per your selected tier.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                  <span>24/7 volunteer assistance and essential amenities.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Tickets Selection Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-[11px] sm:text-xs font-mono text-white uppercase tracking-[0.25em] font-extrabold flex items-center justify-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-3">
            <Ticket className="w-4 h-4 text-[#d4af37]" />
            <span>Select Your Passage</span>
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-whitegold-shine pb-2">
            Choose Your Option
          </h2>
        </div>

        {/* Purchase Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {TICKET_OPTIONS.map((option, idx) => {
            const isSelected = selectedTicket === option.id;
            
            return (
              <motion.div
                key={option.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => setSelectedTicket(option.id)}
                className={`relative flex flex-col p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected 
                    ? "bg-[#0C2B3D]/90 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.25)] transform scale-[1.02]" 
                    : "bg-[#070D15]/80 border-white/10 hover:border-[#d4af37]/50 hover:bg-[#0A1624]/90"
                }`}
              >
                {/* Active Glow Background */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
                )}

                {/* Selection Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "border-[#d4af37] bg-[#d4af37]" : "border-white/30"
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0C2B3D]" />}
                  </div>
                </div>

                <div className="mb-6 pr-8">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
                    {option.name}
                  </h3>
                  <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8E9CA8]">
                    {option.duration}
                  </div>
                </div>

                <div className="mb-8">
                  <span className="font-montserrat text-4xl sm:text-5xl font-black text-[#d4af37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                    {option.price}
                  </span>
                </div>

                <div className="flex-grow space-y-4 border-t border-white/10 pt-6">
                  {option.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#c5a25f] shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-[#CBD5E1] leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                  
                  {option.warning && (
                    <div className="flex items-start gap-3 mt-4 pt-4 border-t border-red-500/20">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-red-200/90 leading-snug font-medium">
                        {option.warning}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 flex justify-center max-w-6xl mx-auto border-t border-white/10 pt-10">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedTicket}
            className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto overflow-hidden ${
              selectedTicket 
                ? "bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#d4af37] text-[#0C2B3D] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
            }`}
          >
            {selectedTicket && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            )}
            <span className="relative z-10">Proceed to Registration</span>
            <ChevronRight className={`relative z-10 w-5 h-5 transition-transform ${selectedTicket ? "group-hover:translate-x-1" : ""}`} />
          </button>
        </div>

      </section>

      <ContactFooter />
    </main>
  );
}
