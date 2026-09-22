import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Compass,
  CalendarDays,
  MapPin,
  BedDouble,
  Coffee,
  CheckCircle2,
  Ticket,
  ChevronRight,
  X,
  ArrowLeft,
  Shield,
  User,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import PageTransitionShimmer from "../components/PageTransitionShimmer";

const TICKET_OPTIONS = [
  {
    id: "1-day",
    name: "1-Day Accommodation",
    price: "₹1,750",
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
    price: "₹2,450",
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
    price: "₹900",
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
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    city: "",
    checkInDate: "",
    checkOutDate: "",
    accommodationPreferences: "",
  });
  const [errors, setErrors] = useState({});

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
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToSelection = () => {
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.college.trim()) newErrors.college = "College/Organization is required";
    if (!formData.city.trim()) newErrors.city = "City & State is required";
    
    const activeTicketData = TICKET_OPTIONS.find(t => t.id === selectedTicket);
    if (activeTicketData?.includesAccommodation) {
      if (!formData.checkInDate.trim()) newErrors.checkInDate = "Check-in Date is required";
      if (!formData.checkOutDate.trim()) newErrors.checkOutDate = "Check-out Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTicketData = TICKET_OPTIONS.find(t => t.id === selectedTicket);

  return (
    <main
      className="relative min-h-[100svh] w-full overflow-x-hidden bg-gradient-to-b from-[#DFECEE] via-[#D4E8EA] to-[#C8E1E5] text-[#0C2B3D] selection:bg-[#C5A25F] selection:text-white"
      aria-label="Tickets & Accommodation"
    >
      <PageTransitionShimmer />

      {/* Fine sand parchment grain texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(20,65,80,.18) 0 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(165,120,45,.15) 0 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px, 58px 58px",
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

        {/* Smooth Fade from Hero Art to Light Oceanic Canvas */}
        <div className="absolute inset-0 bg-[#062538]/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#D2E9ED]/30 via-[#DFECEE]/60 to-[#DFECEE]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#DFECEE] via-[#DFECEE]/85 to-transparent" />

        {/* Hero Typography */}
        <motion.div
          className="absolute left-5 top-[110px] max-w-[85vw] sm:left-14 sm:top-[140px] lg:left-[8.5vw] lg:top-[150px]"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -24, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <h1 className="font-cinzel text-4xl font-black leading-none tracking-[-0.015em] sm:text-6xl lg:text-[72px] text-[#0C2B3D]">
            <span className="relative inline-block pb-3 drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)] after:absolute after:bottom-0 after:left-[4%] after:h-px after:w-[92%] after:bg-gradient-to-r after:from-transparent after:via-[#1A6278] after:to-transparent">
              Tickets & Boarding
            </span>
          </h1>
          <p className="mt-2 font-montserrat text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#1A6278] drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)] sm:text-xs lg:mt-3 lg:text-sm">
            <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-[8%] after:h-px after:w-[84%] after:bg-gradient-to-r after:from-transparent after:via-[#1A6278] after:to-transparent">
              Secure your passage to Renaissance 10.0
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content Section */}
      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-24 pt-[240px] sm:px-6 sm:pt-[290px] lg:px-8 lg:pt-[330px]">
        
        <AnimatePresence mode="wait">
          {!showForm && !showPayment ? (
            <motion.div
              key="selection-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Event & Accommodation Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
                
                {/* Event Details Card */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border-2 border-[#C5A25F]/70 bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] shadow-[0_22px_70px_rgba(20,55,70,0.15)] transition-all duration-500 hover:border-[#B58B3E] overflow-hidden"
                >
                  {/* Inner navigation frame */}
                  <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border border-[#A87E35]/35 transition-colors duration-500 group-hover:border-[#9E6D1F]/50" />
                  <div className="pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t border-[#9E6D1F]/55" />
                  <div className="pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r border-[#9E6D1F]/55" />

                  <div className="relative z-10 flex items-center gap-3 mb-6 border-b border-[#0C2B3D]/15 pb-4">
                    <Compass className="w-6 h-6 text-[#9E6D1F]" />
                    <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#0C2B3D] tracking-wider uppercase drop-shadow-sm">
                      Expedition Details
                    </h2>
                  </div>
                  
                  <div className="relative z-10 space-y-6 mt-2">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c5a25f]/20 to-[#9e6d1f]/10 border border-[#c5a25f]/40 shadow-inner">
                        <CalendarDays className="w-5 h-5 text-[#8A5F1C]" />
                      </div>
                      <div>
                        <h3 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2C5263] mb-1.5">Date & Duration</h3>
                        <p className="font-montserrat text-sm sm:text-base font-black text-[#0C2B3D]">To Be Announced</p>
                        <p className="font-mono text-xs text-[#8A5F1C] mt-1 font-bold">2 Days of Summit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c5a25f]/20 to-[#9e6d1f]/10 border border-[#c5a25f]/40 shadow-inner">
                        <MapPin className="w-5 h-5 text-[#8A5F1C]" />
                      </div>
                      <div>
                        <h3 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2C5263] mb-1.5">Venue</h3>
                        <p className="font-montserrat text-sm sm:text-base font-black text-[#0C2B3D]">MNNIT Allahabad Campus</p>
                        <p className="font-mono text-xs text-[#2C5263] mt-1 font-bold">Prayagraj, Uttar Pradesh</p>
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
                  className="group relative flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border-2 border-[#C5A25F]/70 bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] shadow-[0_22px_70px_rgba(20,55,70,0.15)] transition-all duration-500 hover:border-[#B58B3E] overflow-hidden"
                >
                  {/* Inner navigation frame */}
                  <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border border-[#A87E35]/35 transition-colors duration-500 group-hover:border-[#9E6D1F]/50" />
                  <div className="pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t border-[#9E6D1F]/55" />
                  <div className="pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r border-[#9E6D1F]/55" />

                  <div className="relative z-10 flex items-center gap-3 mb-6 border-b border-[#0C2B3D]/15 pb-4">
                    <BedDouble className="w-6 h-6 text-[#9E6D1F]" />
                    <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#0C2B3D] tracking-wider uppercase drop-shadow-sm">
                      Boarding Info
                    </h2>
                  </div>
                  
                  <div className="relative z-10 space-y-5 font-montserrat text-sm text-[#1A3B4D] leading-relaxed font-semibold mt-2">
                    <p className="text-[#0C2B3D] font-bold">
                      Experience the summit with full campus immersion. Our accommodation packages include comfortable lodging within the MNNIT campus boundaries.
                    </p>
                    
                    <ul className="space-y-4 mt-5">
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/50 p-2.5 rounded-lg border border-[#BFA275]/30">
                        <CheckCircle2 className="w-5 h-5 text-[#219653] shrink-0 mt-0.5" />
                        <span>Safe and secure campus lodging for all registered delegates.</span>
                      </li>
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/50 p-2.5 rounded-lg border border-[#BFA275]/30">
                        <Coffee className="w-5 h-5 text-[#9E6D1F] shrink-0 mt-0.5" />
                        <span>Mess meals provided as per your selected tier.</span>
                      </li>
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/50 p-2.5 rounded-lg border border-[#BFA275]/30">
                        <CheckCircle2 className="w-5 h-5 text-[#219653] shrink-0 mt-0.5" />
                        <span>24/7 volunteer assistance and essential amenities.</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Tickets Selection Section */}
              <div className="flex flex-col items-center mb-10 text-center">
                <span className="text-[11px] sm:text-xs font-mono text-[#8A5F1C] uppercase tracking-[0.25em] font-extrabold flex items-center justify-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-[#8A5F1C]" />
                  <span>Select Your Passage</span>
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0C2B3D] pb-2">
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
                      className={`group relative flex flex-col p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
                        isSelected 
                          ? "bg-gradient-to-br from-[#E8D4B4] via-[#DECAA5] to-[#D5C29C] border-[#9E6D1F] shadow-[0_22px_55px_rgba(12,38,50,0.25)] transform scale-[1.02]" 
                          : "bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] border-[#C5A25F]/70 hover:border-[#B58B3E] shadow-[0_14px_38px_rgba(12,38,50,0.15)]"
                      }`}
                    >
                      {/* Active Inner Frame */}
                      <div
                        className={`pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border transition-colors duration-400 ${
                          isSelected ? "border-[#9E6D1F]/40" : "border-[#A87E35]/35 group-hover:border-[#9E6D1F]/50"
                        }`}
                      />
                      
                      <div className={`pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t transition-colors ${isSelected ? "border-[#9E6D1F]/70" : "border-[#9E6D1F]/55"}`} />
                      <div className={`pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r transition-colors ${isSelected ? "border-[#9E6D1F]/70" : "border-[#9E6D1F]/55"}`} />

                      {/* Selection Indicator */}
                      <div className="absolute top-7 right-7 z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-[#9E6D1F] bg-[#9E6D1F]" : "border-[#A87E35]/40"
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F2E5D4]" />}
                        </div>
                      </div>

                      <div className="mb-6 pr-8 relative z-10 pt-2 pl-2">
                        <h3 className="font-cinzel text-xl sm:text-2xl font-black text-[#0C2B3D] mb-2 drop-shadow-sm">
                          {option.name}
                        </h3>
                        <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8A5F1C]">
                          {option.duration}
                        </div>
                      </div>

                      <div className="mb-8 relative z-10 pl-2">
                        <span className="font-montserrat text-4xl sm:text-5xl font-black text-[#9E6D1F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                          {option.price}
                        </span>
                      </div>

                      <div className="flex-grow space-y-4 border-t border-[#0C2B3D]/15 pt-6 relative z-10 pl-2">
                        {option.benefits.map((benefit, i) => (
                          <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${isSelected ? "bg-[#EEDFCA]/60 border-[#BFA275]/40" : "bg-[#EEDFCA]/40 border-[#BFA275]/20"}`}>
                            <CheckCircle2 className="w-4 h-4 text-[#8A5F1C] shrink-0 mt-0.5" />
                            <span className="font-montserrat text-sm text-[#0C2B3D] leading-snug font-bold">
                              {benefit}
                            </span>
                          </div>
                        ))}
                        
                        {option.warning && (
                          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-red-500/20">
                            <X className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />
                            <span className="font-montserrat text-sm text-[#D9534F] leading-snug font-black">
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
              <div className="mt-16 flex justify-center max-w-6xl mx-auto border-t border-[#0C2B3D]/10 pt-10">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!selectedTicket}
                  className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto overflow-hidden ${
                    selectedTicket 
                      ? "bg-[#0C2B3D] text-[#F2E5D4] hover:shadow-[0_8px_30px_rgba(12,43,61,0.3)] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]" 
                      : "bg-[#0C2B3D]/10 text-[#0C2B3D]/40 border border-[#0C2B3D]/10 cursor-not-allowed"
                  }`}
                >
                  {selectedTicket && (
                    <div className="absolute inset-0 bg-[#16435E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  )}
                  <span className="relative z-10">Proceed to Registration</span>
                  <ChevronRight className={`relative z-10 w-5 h-5 transition-transform ${selectedTicket ? "group-hover:translate-x-1" : ""}`} />
                </button>
              </div>
            </motion.div>
          ) : showForm && !showPayment ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToSelection}
                className="flex items-center gap-2 text-[#2C5263] hover:text-[#9E6D1F] transition-colors mb-6 font-mono text-xs uppercase tracking-widest font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Selection
              </button>

              {/* Registration Form Card */}
              <div className="rounded-[28px] border-2 border-[#C5A25F]/70 bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] shadow-[0_22px_70px_rgba(20,55,70,0.15)] overflow-hidden relative group">
                {/* Inner navigation frame */}
                <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border border-[#A87E35]/35" />
                <div className="pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t border-[#9E6D1F]/55" />
                <div className="pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r border-[#9E6D1F]/55" />

                <div className="p-6 sm:p-10 relative z-10">
                  {/* Selected Option Summary */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#E8D4B4]/50 border border-[#BFA275]/30 mb-8 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A5F1C] font-bold block mb-1">
                        Selected Option
                      </span>
                      <h3 className="font-cinzel text-xl font-black text-[#0C2B3D]">
                        {activeTicketData?.name}
                      </h3>
                      <p className="font-mono text-xs text-[#2C5263] mt-1 font-bold">
                        {activeTicketData?.duration}
                      </p>
                    </div>
                    <div className="font-montserrat text-3xl font-black text-[#9E6D1F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                      {activeTicketData?.price}
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    {/* Common Details Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-[#0C2B3D]/15 pb-4">
                        <Shield className="w-5 h-5 text-[#9E6D1F]" />
                        <h4 className="font-cinzel text-lg font-black text-[#0C2B3D] uppercase tracking-wider">Participant Details</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 w-4 h-4 text-[#8A5F1C]" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              placeholder="John Doe"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.name ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                          </div>
                          {errors.name && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#8A5F1C]" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="john@example.com"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.email ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                          </div>
                          {errors.email && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#8A5F1C]" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              placeholder="+91 98765 43210"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.phone ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                          </div>
                          {errors.phone && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            College / Organization *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-[#8A5F1C]" />
                            <input
                              type="text"
                              name="college"
                              value={formData.college}
                              onChange={handleFormChange}
                              placeholder="MNNIT Allahabad"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.college ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                          </div>
                          {errors.college && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.college}</p>}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            City & State *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#8A5F1C]" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleFormChange}
                              placeholder="Prayagraj, UP"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.city ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                          </div>
                          {errors.city && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.city}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Accommodation Section */}
                    {activeTicketData?.includesAccommodation && (
                      <div className="space-y-5 pt-8 border-t border-[#0C2B3D]/15">
                        <div className="flex items-center gap-2 mb-4 border-b border-[#0C2B3D]/15 pb-4">
                          <BedDouble className="w-5 h-5 text-[#9E6D1F]" />
                          <h4 className="font-cinzel text-lg font-black text-[#0C2B3D] uppercase tracking-wider">Accommodation Info</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                              Check-in Date *
                            </label>
                            <input
                              type="date"
                              name="checkInDate"
                              value={formData.checkInDate}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.checkInDate ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                            {errors.checkInDate && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.checkInDate}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                              Check-out Date *
                            </label>
                            <input
                              type="date"
                              name="checkOutDate"
                              value={formData.checkOutDate}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 ${errors.checkOutDate ? 'border-[#D9534F]' : 'border-[#C5A25F]/40'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors`}
                            />
                            {errors.checkOutDate && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.checkOutDate}</p>}
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                              Accommodation / Food Preferences
                            </label>
                            <textarea
                              name="accommodationPreferences"
                              value={formData.accommodationPreferences}
                              onChange={handleFormChange}
                              rows="3"
                              placeholder="Any specific requests? (e.g. Vegetarian food only)"
                              className="w-full px-4 py-3 rounded-xl bg-[#F4EBD9]/80 border-2 border-[#C5A25F]/40 text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-[#F2E5D4] transition-colors resize-none"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Section */}
                    <div className="pt-8 flex justify-end">
                      <button
                        type="submit"
                        className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0C2B3D] text-[#F2E5D4] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(12,43,61,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer border border-[#0C2B3D] w-full sm:w-auto overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[#16435E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10">Confirm & Proceed</span>
                        <ChevronRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-view"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="flex items-center gap-2 text-[#2C5263] hover:text-[#9E6D1F] transition-colors mb-6 font-mono text-xs uppercase tracking-widest font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>

              <div className="rounded-[28px] border-2 border-[#C5A25F]/70 bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] shadow-[0_22px_70px_rgba(20,55,70,0.15)] overflow-hidden relative p-8 sm:p-12 text-center">
                <h3 className="font-cinzel text-2xl font-black text-[#0C2B3D] mb-4">Complete Your Payment</h3>
                <p className="font-montserrat text-[#1A3B4D] mb-8 font-semibold">
                  Scan the QR code below to pay <span className="text-[#9E6D1F] font-black">{activeTicketData?.price}</span> for your {activeTicketData?.name}.
                </p>
                
                <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-2 border-[#C5A25F]/40 mb-8">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=dummy@upi&pn=Renaissance&am=${activeTicketData?.price.replace('₹', '').replace(',', '')}&cu=INR`} 
                    alt="Payment QR Code"
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                  />
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="bg-[#F4EBD9]/80 border-2 border-[#C5A25F]/40 p-4 rounded-xl text-left">
                    <label className="block text-xs font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                      Transaction ID / UTR Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 12-digit UTR number"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#C5A25F]/30 text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/40 focus:outline-none focus:border-[#9E6D1F] transition-colors"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      alert("Payment Details Submitted Successfully!");
                      setShowPayment(false);
                      setShowForm(false);
                      setSelectedTicket(null);
                      setFormData({
                        name: "", email: "", phone: "", college: "", city: "", checkInDate: "", checkOutDate: "", accommodationPreferences: "",
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0C2B3D] text-[#F2E5D4] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(12,43,61,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer border border-[#0C2B3D] w-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[#16435E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10">Verify & Complete Registration</span>
                    <CheckCircle2 className="relative z-10 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <div className="relative z-10 bg-[#E2D2BC]">
        <ContactFooter />
      </div>
    </main>
  );
}
