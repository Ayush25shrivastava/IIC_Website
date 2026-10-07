import { useState, useRef, useEffect } from "react";
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
  Sparkles,
  Tag,
  Flame,
  Info,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import PageTransitionShimmer from "../components/PageTransitionShimmer";

export const TICKET_OPTIONS = [
  // --- Event Passes (Without Accommodation) ---
  {
    id: "event-standard",
    category: "event",
    name: "Standard Pass",
    price: 499,
    originalPrice: 699,
    discount: 200,
    formattedPrice: "₹499",
    formattedOriginalPrice: "₹699",
    duration: "3-Day Summit Access",
    badge: "Essential Entry",
    benefits: [
      "Official Summit Diary & Pen",
      "Official Delegate ID Card",
      "Official Certificate of Participation",
      "Full 3-Day Event Access",
      "Event Participation Included",
    ],
    includesAccommodation: false,
    warning: "Accommodation is NOT included in this tier.",
  },
  {
    id: "event-premium",
    category: "event",
    name: "Premium Pass",
    price: 699,
    originalPrice: 899,
    discount: 200,
    formattedPrice: "₹699",
    formattedOriginalPrice: "₹899",
    duration: "3-Day Summit Access",
    badge: "Kit Upgrade",
    benefits: [
      "Exclusive Premium Event Kit",
      "All ₹499 Standard Pass Benefits Included",
      "Official Summit Diary & Pen",
      "Official Delegate ID Card",
      "Official Certificate of Participation",
      "Full 3-Day Event Access & Event Participation",
    ],
    includesAccommodation: false,
    warning: "Accommodation is NOT included in this tier.",
  },
  {
    id: "event-elite",
    category: "event",
    name: "Elite Pass",
    price: 1099,
    originalPrice: 1299,
    discount: 200,
    formattedPrice: "₹1,099",
    formattedOriginalPrice: "₹1,299",
    duration: "3-Day Summit Access",
    badge: "T-Shirt + Premium Kit",
    benefits: [
      "Official Renaissance 10.0 T-Shirt",
      "Exclusive Premium Event Kit",
      "All ₹699 Premium Pass Benefits Included",
      "Official Summit Diary & Pen",
      "Official Delegate ID Card",
      "Official Certificate of Participation",
      "Full 3-Day Event Access & Event Participation",
    ],
    includesAccommodation: false,
    warning: "Accommodation is NOT included in this tier.",
  },

  // --- Passes with Accommodation ---
  {
    id: "accom-standard",
    category: "accommodation",
    name: "Standard Pass + Stay",
    price: 899,
    originalPrice: 1099,
    discount: 200,
    formattedPrice: "₹899",
    formattedOriginalPrice: "₹1,099",
    duration: "3-Day Access + 1-Day Stay",
    badge: "Value Stay",
    benefits: [
      "All ₹499 Standard Pass Facilities Included",
      "1-Day Campus Accommodation Included",
      "3 Meals Each Day: Breakfast, Lunch & Dinner",
      "Lodging Kit: 1 Bed, Pillow, Blanket & Linen",
      "Full 3-Day Event Access & Event Participation",
      "+₹500 per additional day of stay",
    ],
    includesAccommodation: true,
  },
  {
    id: "accom-premium",
    category: "accommodation",
    name: "Premium Pass + Stay",
    price: 1099,
    originalPrice: 1299,
    discount: 200,
    formattedPrice: "₹1,099",
    formattedOriginalPrice: "₹1,299",
    duration: "3-Day Access + 1-Day Stay",
    badge: "Most Popular Stay",
    benefits: [
      "All ₹699 Premium Pass Facilities (Premium Kit Included)",
      "1-Day Campus Accommodation Included",
      "3 Meals Each Day: Breakfast, Lunch & Dinner",
      "Lodging Kit: 1 Bed, Pillow, Blanket & Linen",
      "Full 3-Day Event Access & Event Participation",
      "+₹500 per additional day of stay",
    ],
    includesAccommodation: true,
  },
  {
    id: "accom-elite",
    category: "accommodation",
    name: "Elite Pass + Stay",
    price: 1499,
    originalPrice: 1699,
    discount: 200,
    formattedPrice: "₹1,499",
    formattedOriginalPrice: "₹1,699",
    duration: "3-Day Access + 1-Day Stay",
    badge: "T-Shirt + Kit + Stay",
    benefits: [
      "All ₹1,099 Elite Pass Facilities (Summit T-Shirt + Premium Kit)",
      "1-Day Campus Accommodation Included",
      "3 Meals Each Day: Breakfast, Lunch & Dinner",
      "Lodging Kit: 1 Bed, Pillow, Blanket & Linen",
      "Full 3-Day Event Access & Event Participation",
      "+₹500 per additional day of stay",
    ],
    includesAccommodation: true,
  },
];

export default function TicketsAccommodation() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [accommodationDays, setAccommodationDays] = useState(1);
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
    transactionId: "",
    amountPaid: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState("");

  const [searchTicketId, setSearchTicketId] = useState("");
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  const activeTicketData = TICKET_OPTIONS.find(t => t.id === selectedTicket);

  // Price calculations with extra accommodation days (+₹500/day after 1 day)
  const getTicketPrice = (ticket, days = accommodationDays) => {
    if (!ticket) return 0;
    if (ticket.includesAccommodation && days > 1) {
      return ticket.price + (days - 1) * 500;
    }
    return ticket.price;
  };

  const getOriginalTicketPrice = (ticket, days = accommodationDays) => {
    if (!ticket) return 0;
    if (ticket.includesAccommodation && days > 1) {
      return ticket.originalPrice + (days - 1) * 500;
    }
    return ticket.originalPrice;
  };

  const currentPayableAmount = activeTicketData
    ? getTicketPrice(activeTicketData, activeTicketData.includesAccommodation ? accommodationDays : 1)
    : 0;

  const handleSelectTicket = (id) => {
    if (selectedTicket === id) {
      setSelectedTicket(null);
      setFormData((prev) => ({ ...prev, amountPaid: "" }));
      return;
    }
    setSelectedTicket(id);
    const option = TICKET_OPTIONS.find((t) => t.id === id);
    if (option) {
      const days = option.includesAccommodation ? accommodationDays : 1;
      const total = getTicketPrice(option, days);
      setFormData((prev) => ({ ...prev, amountPaid: total.toString() }));
    }
  };

  // Deselect ticket when clicking outside of the selected ticket card
  useEffect(() => {
    if (!selectedTicket || showForm) return;

    const handleClickOutside = (e) => {
      // If clicking inside any ticket card, let the card handler take care of it
      if (e.target.closest("[data-ticket-card]")) {
        return;
      }
      // If clicking inside the CTA proceed button section, don't unselect
      if (e.target.closest("[data-cta-section]")) {
        return;
      }
      setSelectedTicket(null);
      setFormData((prev) => ({ ...prev, amountPaid: "" }));
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [selectedTicket, showForm]);

  const handleAccommodationDaysChange = (days) => {
    const validDays = Math.max(1, Number(days) || 1);
    setAccommodationDays(validDays);
    if (activeTicketData?.includesAccommodation) {
      const total = getTicketPrice(activeTicketData, validDays);
      setFormData((prev) => ({ ...prev, amountPaid: total.toString() }));
    }
  };

  const handleContinue = () => {
    if (selectedTicket) {
      const option = TICKET_OPTIONS.find((t) => t.id === selectedTicket);
      if (option) {
        const days = option.includesAccommodation ? accommodationDays : 1;
        const total = getTicketPrice(option, days);
        setFormData((prev) => ({ ...prev, amountPaid: total.toString() }));
      }
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.college.trim()) newErrors.college = "College/Organization is required";
    if (!formData.city.trim()) newErrors.city = "City & State is required";

    if (activeTicketData?.includesAccommodation) {
      if (!formData.checkInDate.trim()) newErrors.checkInDate = "Check-in Date is required";
      if (!formData.checkOutDate.trim()) newErrors.checkOutDate = "Check-out Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!formData.transactionId.trim()) {
      alert("Please enter the Transaction ID / UTR Number");
      return;
    }

    if (!formData.amountPaid.toString().trim()) {
      alert("Please enter the Amount Paid");
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/tickets/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          ticketType: selectedTicket,
          accommodationDays: activeTicketData?.includesAccommodation ? accommodationDays : 0,
          checkInDate: formData.checkInDate || null,
          checkOutDate: formData.checkOutDate || null,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit. Please try again.");
      }

      setSubmittedTicketId(data.ticket.ticketId);

      setShowForm(false);
      setSelectedTicket(null);
      setAccommodationDays(1);
      setFormData({
        name: "", email: "", phone: "", college: "", city: "", checkInDate: "", checkOutDate: "", accommodationPreferences: "", transactionId: "", amountPaid: "",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchTicket = async (e) => {
    e.preventDefault();
    if (!searchTicketId.trim()) {
      setSearchError("Please enter a Ticket ID");
      return;
    }
    setSearchError("");
    setIsSearching(true);
    setSearchedTicket(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/tickets/status/${searchTicketId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Ticket not found");
      }
      setSearchedTicket(data.ticket);
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredOptions = TICKET_OPTIONS.filter((opt) => {
    if (selectedCategory === "event") return !opt.includesAccommodation;
    if (selectedCategory === "accommodation") return opt.includesAccommodation;
    return true;
  });

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
          {!showForm ? (
            <motion.div
              key="selection-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Success Message / Ticket ID Display */}
              {submittedTicketId && (
                <div className="mb-10 p-6 bg-[#E8F5E9] border-2 border-[#4CAF50] rounded-2xl flex flex-col items-center text-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-[#4CAF50] mb-3" />
                  <h3 className="font-cinzel text-2xl font-black text-[#2E7D32] mb-2">Registration Submitted!</h3>
                  <p className="font-montserrat text-[#1B5E20] font-bold mb-4">
                    Please save this Ticket ID for verification and tracking.
                  </p>
                  <div className="px-6 py-3 bg-white border-2 border-[#4CAF50]/40 rounded-xl font-mono text-xl font-black text-[#2E7D32] tracking-widest shadow-inner">
                    {submittedTicketId}
                  </div>
                  <button 
                    onClick={() => setSubmittedTicketId("")}
                    className="mt-6 text-sm text-[#4CAF50] font-bold underline hover:text-[#2E7D32]"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Ticket Status Search Section */}
              <div className="mb-16 sm:mb-20">
                <div className="bg-gradient-to-br from-[#E8D4B4]/40 to-[#DCECEE]/40 border-2 border-[#C5A25F]/30 p-6 sm:p-8 rounded-[28px] max-w-4xl mx-auto shadow-sm">
                  <h3 className="font-cinzel text-2xl font-black text-[#0C2B3D] text-center mb-6">
                    Check Ticket Status
                  </h3>
                  <form onSubmit={handleSearchTicket} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
                    <div className="relative w-full">
                      <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-[#8A5F1C]" />
                      <input
                        type="text"
                        placeholder="Enter Ticket ID (e.g. REN-XXXXXX)"
                        value={searchTicketId}
                        onChange={(e) => setSearchTicketId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border-2 border-[#C5A25F]/40 text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/60 focus:outline-none focus:border-[#9E6D1F] focus:bg-white transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="whitespace-nowrap px-8 py-3 rounded-xl bg-[#0C2B3D] text-[#F2E5D4] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_4px_15px_rgba(12,43,61,0.2)] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </button>
                  </form>
                  {searchError && (
                    <p className="text-center text-[#D9534F] font-mono text-sm font-bold mt-4">{searchError}</p>
                  )}
                  {searchedTicket && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-white/80 rounded-2xl border border-[#C5A25F]/30 max-w-xl mx-auto shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-mono text-[#8A5F1C] uppercase font-bold tracking-widest mb-1">Participant Name</p>
                          <p className="font-cinzel text-xl font-black text-[#0C2B3D]">{searchedTicket.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-[#8A5F1C] uppercase font-bold tracking-widest mb-1">Amount Paid</p>
                          <p className="font-montserrat text-xl font-black text-[#9E6D1F]">₹{searchedTicket.amountPaid}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#0C2B3D]/10 flex items-center justify-between">
                        <p className="text-[11px] font-mono text-[#2C5263] uppercase font-bold tracking-widest">Status</p>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                          searchedTicket.status === 'Verified' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#4CAF50]/30' :
                          searchedTicket.status === 'Rejected' ? 'bg-[#FFEBEE] text-[#C62828] border border-[#E53935]/30' :
                          'bg-[#FFF8E1] text-[#F57F17] border border-[#FBC02D]/30'
                        }`}>
                          {searchedTicket.status}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

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
                        <p className="font-mono text-xs text-[#8A5F1C] mt-1 font-bold">3 Days of Summit (Full Access Included)</p>
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
                      Boarding Info & Amenities
                    </h2>
                  </div>

                  <div className="relative z-10 space-y-4 font-montserrat text-sm text-[#1A3B4D] leading-relaxed font-semibold mt-1">
                    <p className="text-[#0C2B3D] font-bold">
                      Campus immersion with complete lodging comfort within the prestigious MNNIT Allahabad campus.
                    </p>

                    <ul className="space-y-3.5 mt-4">
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/60 p-2.5 rounded-xl border border-[#BFA275]/35">
                        <Coffee className="w-5 h-5 text-[#9E6D1F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#0C2B3D] block font-extrabold text-xs sm:text-sm">3 Meals Every Day</strong>
                          <span className="text-[11px] sm:text-xs text-[#2C5263] leading-snug font-medium">Wholesome Breakfast, Lunch, and Dinner provided every day of your stay.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/60 p-2.5 rounded-xl border border-[#BFA275]/35">
                        <BedDouble className="w-5 h-5 text-[#219653] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#0C2B3D] block font-extrabold text-xs sm:text-sm">Complete Bedding (1 Bed, Pillow, Blanket)</strong>
                          <span className="text-[11px] sm:text-xs text-[#2C5263] leading-snug font-medium">Clean and comfortable hostel stay with mattress, pillow, blanket & fresh linen.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 bg-[#EEDFCA]/60 p-2.5 rounded-xl border border-[#BFA275]/35">
                        <Tag className="w-5 h-5 text-[#8A5F1C] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#0C2B3D] block font-extrabold text-xs sm:text-sm">Flexible Duration (+₹500 / Extra Day)</strong>
                          <span className="text-[11px] sm:text-xs text-[#2C5263] leading-snug font-medium">1 Day accommodation included in base stay packages. Extra days available at only ₹500/day.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Early Bird Special Banner */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-12 max-w-5xl mx-auto p-4 sm:p-6 rounded-[24px] bg-gradient-to-r from-[#E8D4B4] via-[#F4E6CC] to-[#DCECEE] border-2 border-[#9E6D1F]/60 shadow-[0_12px_40px_rgba(158,109,31,0.15)] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden"
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#0C2B3D] text-[#E5C378] flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-6 h-6 animate-pulse text-[#E5C378]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#0C2B3D] text-[#E5C378]">
                        ⚡ Early Bird Offer Live
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#4CAF50]/30">
                        Flat ₹200 OFF Applied
                      </span>
                    </div>
                    <h3 className="font-cinzel text-lg sm:text-xl font-black text-[#0C2B3D]">
                      Grab Your Early Bird Pass Now!
                    </h3>
                    <p className="text-xs text-[#2C5263] font-semibold">
                      Save ₹200 on every event pass and accommodation package. The early-bird price shown is what you pay — no code needed.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 bg-[#0C2B3D] text-[#F2E5D4] px-5 py-2.5 rounded-2xl font-mono text-xs font-black tracking-widest shadow-md">
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                  <span>SAVE ₹200 TODAY</span>
                </div>
              </motion.div>

              {/* Tickets Selection Section */}
              <div className="flex flex-col items-center mb-8 text-center">
                <span className="text-[11px] sm:text-xs font-mono text-[#8A5F1C] uppercase tracking-[0.25em] font-extrabold flex items-center justify-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-[#8A5F1C]" />
                  <span>Select Your Passage</span>
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0C2B3D] pb-3">
                  Choose Your Option
                </h2>
                <p className="font-montserrat text-xs sm:text-sm text-[#2C5263] font-bold max-w-xl">
                  Every pass includes 3-day event access and event participation. Stay packages also include 1 day of accommodation, 3 meals, a bed, pillow and blanket.
                </p>

                {/* Category Filter Switcher */}
                <div className="mt-8 inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl bg-[#0C2B3D]/10 border border-[#C5A25F]/40 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 ${selectedCategory === "all"
                        ? "bg-[#0C2B3D] text-[#F2E5D4] shadow-md"
                        : "text-[#0C2B3D] hover:text-[#9E6D1F]"
                      }`}
                  >
                    All Passes (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("event")}
                    className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 ${selectedCategory === "event"
                        ? "bg-[#0C2B3D] text-[#F2E5D4] shadow-md"
                        : "text-[#0C2B3D] hover:text-[#9E6D1F]"
                      }`}
                  >
                    Event Passes (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("accommodation")}
                    className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 ${selectedCategory === "accommodation"
                        ? "bg-[#0C2B3D] text-[#F2E5D4] shadow-md"
                        : "text-[#0C2B3D] hover:text-[#9E6D1F]"
                      }`}
                  >
                    With Accommodation (3)
                  </button>
                </div>
              </div>

              {/* Purchase Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                {filteredOptions.map((option, idx) => {
                  const isSelected = selectedTicket === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      data-ticket-card="true"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      onClick={() => handleSelectTicket(option.id)}
                      className={`group relative flex flex-col p-6 sm:p-7 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden ${isSelected
                          ? "bg-gradient-to-br from-[#E8D4B4] via-[#DECAA5] to-[#D5C29C] border-[#9E6D1F] shadow-[0_22px_55px_rgba(12,38,50,0.25)] transform scale-[1.02]"
                          : "bg-gradient-to-br from-[#EEDFCA] via-[#E6D6C0] to-[#DCECEE] border-[#C5A25F]/70 hover:border-[#B58B3E] shadow-[0_14px_38px_rgba(12,38,50,0.15)] hover:-translate-y-1"
                        }`}
                    >
                      {/* Active Inner Frame */}
                      <div
                        className={`pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border transition-colors duration-400 ${isSelected ? "border-[#9E6D1F]/50" : "border-[#A87E35]/35 group-hover:border-[#9E6D1F]/50"
                          }`}
                      />

                      <div className={`pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t transition-colors ${isSelected ? "border-[#9E6D1F]/80" : "border-[#9E6D1F]/55"}`} />
                      <div className={`pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r transition-colors ${isSelected ? "border-[#9E6D1F]/80" : "border-[#9E6D1F]/55"}`} />

                      {/* Header with Badges & Radio Indicator */}
                      <div className="flex items-start justify-between gap-2 mb-4 relative z-10 pl-1 pr-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[#0C2B3D] text-[#E5C378]">
                            {option.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[#9E6D1F]/20 text-[#8A5F1C] border border-[#9E6D1F]/30">
                            Early Bird · ₹{option.discount} OFF
                          </span>
                        </div>

                        {/* Selection Indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-[#9E6D1F] bg-[#9E6D1F]" : "border-[#A87E35]/40 bg-white/50"
                          }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F2E5D4]" />}
                        </div>
                      </div>

                      {/* Ticket Title & Duration */}
                      <div className="mb-4 relative z-10 pl-1">
                        <h3 className="font-cinzel text-xl sm:text-2xl font-black text-[#0C2B3D] mb-1 drop-shadow-sm">
                          {option.name}
                        </h3>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8A5F1C]">
                          {option.duration}
                        </div>
                      </div>

                      {/* Pricing Display */}
                      <div className="mb-6 relative z-10 pl-1">
                        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2C5263]">Early-bird price per person</p>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="font-montserrat text-4xl sm:text-5xl font-black text-[#9E6D1F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                            {option.formattedPrice}
                          </span>
                          <span className="font-montserrat text-xl sm:text-2xl font-bold text-[#8A5F1C]/45 line-through decoration-2">
                            <span className="sr-only">Regular price: </span>
                            {option.formattedOriginalPrice}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-md border border-[#4CAF50]/30">
                            <Tag className="w-3 h-3" /> Save ₹{option.discount} Early Bird
                          </span>
                          {option.includesAccommodation && (
                            <span className="text-[10px] font-mono font-bold text-[#8A5F1C] bg-[#E8D4B4] px-2 py-0.5 rounded-md border border-[#BFA275]/40">
                              +₹500 / extra day
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Benefits List */}
                      <div className="flex-grow space-y-3 border-t border-[#0C2B3D]/15 pt-5 relative z-10 pl-1">
                        {option.benefits.map((benefit, i) => (
                          <div key={i} className={`flex items-start gap-2.5 p-2 rounded-lg border transition-colors ${isSelected ? "bg-[#EEDFCA]/80 border-[#BFA275]/50" : "bg-[#EEDFCA]/45 border-[#BFA275]/25"}`}>
                            <CheckCircle2 className="w-4 h-4 text-[#8A5F1C] shrink-0 mt-0.5" />
                            <span className="font-montserrat text-xs sm:text-sm text-[#0C2B3D] leading-snug font-bold">
                              {benefit}
                            </span>
                          </div>
                        ))}

                        {option.warning && (
                          <div className="flex items-start gap-2.5 mt-3 pt-3 border-t border-red-500/20">
                            <X className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />
                            <span className="font-montserrat text-xs text-[#D9534F] leading-snug font-black">
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
              <div
                data-cta-section="true"
                className="mt-16 flex flex-col items-center justify-center max-w-6xl mx-auto border-t border-[#0C2B3D]/10 pt-10"
              >
                {selectedTicket && (
                  <p className="mb-4 font-mono text-xs text-[#8A5F1C] font-bold uppercase tracking-wider">
                    Selected: <span className="text-[#0C2B3D] font-black">{activeTicketData?.name}</span> (₹{currentPayableAmount.toLocaleString("en-IN")}{activeTicketData?.includesAccommodation ? ` · ${accommodationDays}-day stay` : ""})
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!selectedTicket}
                  className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto overflow-hidden ${selectedTicket
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
          ) : (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
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
                  <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-[#E8D4B4]/60 border border-[#BFA275]/40 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0C2B3D]/15 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A5F1C] font-extrabold">
                            Selected Option
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-[#0C2B3D] text-[#E5C378]">
                            {activeTicketData?.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32]">
                            ⚡ Early Bird Applied
                          </span>
                        </div>
                        <h3 className="font-cinzel text-xl sm:text-2xl font-black text-[#0C2B3D]">
                          {activeTicketData?.name}
                        </h3>
                        <p className="font-mono text-xs text-[#2C5263] mt-1 font-bold">
                          {activeTicketData?.includesAccommodation
                            ? `3-Day Event Access + ${accommodationDays}-Day Stay`
                            : activeTicketData?.duration}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C5263]">Total payable · Early bird</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-montserrat text-3xl sm:text-4xl font-black text-[#9E6D1F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                            ₹{currentPayableAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="font-montserrat text-lg font-bold text-[#8A5F1C]/50 line-through">
                            <span className="sr-only">Regular total: </span>
                            ₹{getOriginalTicketPrice(activeTicketData, activeTicketData?.includesAccommodation ? accommodationDays : 1).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#2E7D32]">
                          Saved ₹{activeTicketData?.discount || 200} with Early Bird
                        </span>
                      </div>
                    </div>

                    {/* Accommodation Duration Extension Selector */}
                    {activeTicketData?.includesAccommodation && (
                      <div className="pt-1">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                          <label className="text-xs font-mono uppercase tracking-wider text-[#0C2B3D] font-extrabold flex items-center gap-2">
                            <BedDouble className="w-4 h-4 text-[#9E6D1F]" />
                            <span>Select Stay Duration (+₹500 / Day After Day 1):</span>
                          </label>
                          <span className="text-[11px] font-mono text-[#8A5F1C] font-bold">
                            Current: {accommodationDays} Day{accommodationDays > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[1, 2, 3, 4].map((days) => {
                            const isDaysSelected = accommodationDays === days;
                            const extra = days > 1 ? (days - 1) * 500 : 0;
                            return (
                              <button
                                key={days}
                                type="button"
                                onClick={() => handleAccommodationDaysChange(days)}
                                className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                                  isDaysSelected
                                    ? "bg-[#0C2B3D] text-[#F2E5D4] border-[#0C2B3D] shadow-md"
                                    : "bg-white/80 hover:bg-white text-[#0C2B3D] border-[#C5A25F]/40"
                                }`}
                              >
                                <div className="font-montserrat text-xs font-black">
                                  {days} Day{days > 1 ? "s" : ""}
                                </div>
                                <div className={`text-[10px] font-mono font-bold ${isDaysSelected ? "text-[#E5C378]" : "text-[#8A5F1C]"}`}>
                                  {days === 1 ? "Included (₹0)" : `+₹${extra}`}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3 p-3 rounded-xl bg-white/70 border border-[#C5A25F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono font-bold text-[#2C5263] gap-2">
                          <span>
                            Early-bird package: ₹{activeTicketData.price.toLocaleString("en-IN")} + Extra stay: {accommodationDays > 1 ? `₹${((accommodationDays - 1) * 500).toLocaleString("en-IN")} (${accommodationDays - 1} extra day${accommodationDays > 2 ? "s" : ""})` : "₹0"}
                          </span>
                          <span className="text-[#9E6D1F] font-black text-sm">
                            Total: ₹{currentPayableAmount}
                          </span>
                        </div>
                        <p className="mt-3 font-montserrat text-xs font-semibold text-[#2C5263]">
                          Your first day is included. Each additional day costs ₹500 with 3 meals, a bed, pillow and blanket. The ₹200 early-bird discount applies once per package.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: QR Code & Payment Info */}
                    <div className="lg:col-span-5 flex flex-col items-center text-center bg-white/40 p-6 rounded-2xl border border-[#C5A25F]/30 h-fit">
                      <h4 className="font-cinzel text-xl font-black text-[#0C2B3D] mb-2">Make Payment</h4>
                      <p className="font-montserrat text-sm text-[#1A3B4D] mb-5 font-semibold">
                        Scan to pay <span className="text-[#9E6D1F] font-black">₹{currentPayableAmount}</span> for your {activeTicketData?.name}
                        {activeTicketData?.includesAccommodation ? ` (${accommodationDays} Day Stay)` : ""}.
                      </p>
                      
                      <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-[#C5A25F]/40 mb-4 w-full max-w-[220px] aspect-square flex items-center justify-center">
                        <img 
                          src={`/cropped-qr.jpg`} 
                          alt="Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-full bg-white/75 border border-[#C5A25F]/40 p-3.5 rounded-xl text-left mb-4 shadow-sm">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5F1C] mb-2">
                          Bank Transfer Details (NEFT / IMPS)
                        </p>
                        <div className="space-y-1 text-xs font-montserrat text-[#0C2B3D]">
                          <p><span className="font-bold text-[#2C5263]">A/C Name:</span> Institution’s Innovation Council</p>
                          <p><span className="font-bold text-[#2C5263]">Bank:</span> SBI (MLNREC, Allahabad)</p>
                          <p className="font-mono"><span className="font-sans font-bold text-[#2C5263]">A/C No:</span> 45558684605</p>
                          <p className="font-mono"><span className="font-sans font-bold text-[#2C5263]">IFSC:</span> SBIN0002580</p>
                        </div>
                      </div>

                      <div className="w-full bg-[#F4EBD9]/80 border-2 border-[#C5A25F]/40 p-4 rounded-xl text-left">
                        <div className="mb-4">
                          <label className="block text-[11px] font-mono text-[#8A5F1C] uppercase tracking-wider mb-2 font-bold">
                            Transaction ID / UTR *
                          </label>
                          <input
                            type="text"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleFormChange}
                            placeholder="Enter 12-digit UTR"
                            className={`w-full px-4 py-3 rounded-xl bg-white border-2 ${errors.transactionId ? 'border-[#D9534F]' : 'border-[#C5A25F]/30'} text-sm text-[#0C2B3D] font-semibold placeholder-[#2C5263]/40 focus:outline-none focus:border-[#9E6D1F] transition-colors`}
                          />
                          {errors.transactionId && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.transactionId}</p>}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#8A5F1C] uppercase tracking-wider mb-1 font-bold">
                            Amount Paid (₹) *
                          </label>
                          <p className="text-[10px] text-[#2C5263] font-mono mb-2">
                            Auto-calculated: ₹{currentPayableAmount}
                          </p>
                          <input
                            type="number"
                            name="amountPaid"
                            value={formData.amountPaid}
                            onChange={handleFormChange}
                            placeholder={`e.g. ${currentPayableAmount}`}
                            className={`w-full px-4 py-3 rounded-xl bg-white border-2 ${errors.amountPaid ? 'border-[#D9534F]' : 'border-[#C5A25F]/30'} text-sm text-[#0C2B3D] font-bold placeholder-[#2C5263]/40 focus:outline-none focus:border-[#9E6D1F] transition-colors`}
                          />
                          {errors.amountPaid && <p className="mt-1.5 text-xs text-[#D9534F] font-mono font-bold">{errors.amountPaid}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Participant Details Form */}
                    <div className="lg:col-span-7">
                      <form onSubmit={handleFormSubmit} className="space-y-8">
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
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 border-b border-[#0C2B3D]/15 pb-4">
                          <div className="flex items-center gap-2">
                            <BedDouble className="w-5 h-5 text-[#9E6D1F]" />
                            <h4 className="font-cinzel text-lg font-black text-[#0C2B3D] uppercase tracking-wider">Accommodation Info</h4>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#E8D4B4] text-[#8A5F1C] border border-[#BFA275]/40">
                            {accommodationDays} Day Stay Selected
                          </span>
                        </div>

                        {/* Accommodation inclusions banner */}
                        <div className="p-3.5 rounded-xl bg-white/70 border border-[#C5A25F]/30 text-xs font-montserrat text-[#1A3B4D] space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-[#0C2B3D]">
                            <CheckCircle2 className="w-4 h-4 text-[#219653]" />
                            <span>Included with your pass: 3-time meals daily + 1 bed, pillow, blanket & linen.</span>
                          </p>
                          <p className="text-[11px] text-[#2C5263] font-mono">
                            Base package covers 1 day. Extra days are charged at ₹500/day.
                          </p>
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
                        disabled={isSubmitting}
                        className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0C2B3D] text-[#F2E5D4] font-extrabold text-xs uppercase tracking-widest hover:shadow-[0_8px_30px_rgba(12,43,61,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer border border-[#0C2B3D] w-full sm:w-auto overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-[#16435E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10">{isSubmitting ? "Submitting..." : "Verify & Complete Registration"}</span>
                        <ChevronRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
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
