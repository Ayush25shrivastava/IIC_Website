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
  const [showForm, setShowForm] = useState(false);
  
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

    alert(`Registration Details Submitted!\n\nTicket: ${activeTicketData.name}\nName: ${formData.name}\n\n(This is a UI demonstration. Backend integration is pending.)`);
  };

  const activeTicketData = TICKET_OPTIONS.find(t => t.id === selectedTicket);

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
        
        <AnimatePresence mode="wait">
          {!showForm ? (
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
            </motion.div>
          ) : (
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
                className="flex items-center gap-2 text-[#8E9CA8] hover:text-[#d4af37] transition-colors mb-6 font-mono text-xs uppercase tracking-widest font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Selection
              </button>

              {/* Registration Form Card */}
              <div className="rounded-3xl border border-[#d4af37]/40 bg-[#040f21]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] shadow-[0_0_35px_rgba(212,175,55,0.15)] overflow-hidden">
                {/* Header Accent Line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                
                <div className="p-6 sm:p-10">
                  {/* Selected Option Summary */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#020713]/80 border border-white/10 mb-8 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block mb-1">
                        Selected Option
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-white">
                        {activeTicketData?.name}
                      </h3>
                      <p className="font-mono text-xs text-[#8E9CA8] mt-1">
                        {activeTicketData?.duration}
                      </p>
                    </div>
                    <div className="font-montserrat text-3xl font-black text-[#d4af37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
                      {activeTicketData?.price}
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    {/* Common Details Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                        <Shield className="w-5 h-5 text-[#d4af37]" />
                        <h4 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">Participant Details</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 w-4 h-4 text-[#64748B]" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              placeholder="John Doe"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#020713] border ${errors.name ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                          </div>
                          {errors.name && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#64748B]" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="john@example.com"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#020713] border ${errors.email ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                          </div>
                          {errors.email && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#64748B]" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              placeholder="+91 98765 43210"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#020713] border ${errors.phone ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                          </div>
                          {errors.phone && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                            College / Organization *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-[#64748B]" />
                            <input
                              type="text"
                              name="college"
                              value={formData.college}
                              onChange={handleFormChange}
                              placeholder="MNNIT Allahabad"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#020713] border ${errors.college ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                          </div>
                          {errors.college && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.college}</p>}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                            City & State *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#64748B]" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleFormChange}
                              placeholder="Prayagraj, UP"
                              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#020713] border ${errors.city ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                          </div>
                          {errors.city && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.city}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Accommodation Section */}
                    {activeTicketData?.includesAccommodation && (
                      <div className="space-y-5 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                          <BedDouble className="w-5 h-5 text-[#d4af37]" />
                          <h4 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">Accommodation Info</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                              Check-in Date *
                            </label>
                            <input
                              type="date"
                              name="checkInDate"
                              value={formData.checkInDate}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#020713] border ${errors.checkInDate ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                            {errors.checkInDate && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.checkInDate}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                              Check-out Date *
                            </label>
                            <input
                              type="date"
                              name="checkOutDate"
                              value={formData.checkOutDate}
                              onChange={handleFormChange}
                              className={`w-full px-4 py-3 rounded-xl bg-[#020713] border ${errors.checkOutDate ? 'border-red-500' : 'border-white/15'} text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors`}
                            />
                            {errors.checkOutDate && <p className="mt-1.5 text-xs text-red-400 font-mono">{errors.checkOutDate}</p>}
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2 font-bold">
                              Accommodation / Food Preferences
                            </label>
                            <textarea
                              name="accommodationPreferences"
                              value={formData.accommodationPreferences}
                              onChange={handleFormChange}
                              rows="3"
                              placeholder="Any specific requests? (e.g. Vegetarian food only)"
                              className="w-full px-4 py-3 rounded-xl bg-[#020713] border border-white/15 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Section */}
                    <div className="pt-8 flex justify-end">
                      <button
                        type="submit"
                        className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F4EBD9] via-[#EBDDC8] to-[#C5A25F] text-[#0C2B3D] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(197,162,95,0.6)] transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer border border-[#C5A25F]/60 w-full sm:w-auto"
                      >
                        <span>Confirm & Proceed</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <ContactFooter />
    </main>
  );
}
