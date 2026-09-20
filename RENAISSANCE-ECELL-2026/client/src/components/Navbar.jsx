import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  Compass,
  Anchor,
  Calendar,
  Users,
  Image,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: Compass,
    },
    {
      name: "Sponsors",
      path: "/sponsors",
      icon: Anchor,
    },
    {
      name: "Events",
      path: "/events",
      icon: Calendar,
    },
    {
      name: "Our Team",
      path: "/teams",
      icon: Users,
    },
    {
      name: "Gallery",
      path: "/gallery",
      icon: Image,
    },
  ];

  // Lock page scrolling while the mobile navigation is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Automatically close mobile navigation after route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") {
      return (
        location.pathname === "/" ||
        location.pathname === "/udbhav"
      );
    }

    return (
      location.pathname.startsWith(path) ||
      location.pathname.startsWith(`/udbhav${path}`)
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-white/10 px-4 py-4 sm:px-6">
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          {/* Renaissance Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-white/85 via-white/70 to-white/50 border border-white/80 backdrop-blur-lg shadow-[0_4px_25px_rgba(255,255,255,0.35)] transition-all hover:from-white/95 hover:to-white/65"
            aria-label="Renaissance Home"
          >
            <img
              src="/renaissance-logo-clean.png"
              alt="Renaissance Logo"
              onError={(event) => {
                event.currentTarget.src =
                  "/renaissance-logo-transparent.png";
              }}
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-4 rounded-full border border-white/80 bg-[#ECF6F5]/88 px-5 py-2 font-light text-xs tracking-widest shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl md:flex">
            {navLinks.map((link) => {
              const current = isActive(link.path);
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex cursor-pointer items-center gap-1.5 transition-all duration-300 ${
                    current
                      ? "rounded-full border border-[#C5A25F]/70 bg-[#F4EBD9]/95 px-3.5 py-1 font-extrabold text-[#0C2B3D] shadow-[0_4px_14px_rgba(197,162,95,0.24)]"
                      : "px-2 py-1 font-semibold text-[#416678] hover:text-[#0C2B3D]"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      current
                        ? "text-[#9E6D1F]"
                        : "text-[#527486] opacity-90"
                    }`}
                    strokeWidth={1.8}
                  />

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Sign In */}
          <div className="hidden items-center md:flex">
          </div>

          {/* Portal Menu */}
          <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsOpen((previous) => !previous)
            }
            aria-label={
              isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isOpen}
            className="relative z-50 rounded-xl border border-white/80 bg-[#ECF6F5]/90 p-2.5 text-[#0C2B3D] shadow-[0_6px_20px_rgba(12,43,61,0.18)] backdrop-blur-xl transition-all hover:text-[#9E6D1F] active:scale-95"
          >
            {isOpen ? (
              <FiX
                size={22}
                className="text-[#9E6D1F]"
              />
            ) : (
              <FiMenu size={22} />
            )}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-14 z-50 hidden w-64 rounded-2xl border border-[#C5A25F]/35 bg-[#ECF6F5]/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:block"
              >
                <Link
                  to="/campus-ambassador"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#0C2B3D] transition-colors hover:bg-[#F4EBD9]/90"
                >
                  <GraduationCap className="h-5 w-5 text-[#9E6D1F]" />
                  Campus Ambassador
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#0C2B3D] transition-colors hover:bg-[#F4EBD9]/90"
                >
                  <LogIn className="h-5 w-5 text-[#9E6D1F]" />
                  Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Animated Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex min-h-[100dvh] flex-col justify-between overflow-y-auto overscroll-contain bg-[#E7F2F2]/96 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,env(safe-area-inset-top))] backdrop-blur-2xl sm:px-6 md:hidden"
          >
            {/* Gold Ambient Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-[#38BDF8]/12 blur-[90px]" />

            <div className="relative z-10 my-auto w-full max-w-sm mx-auto space-y-6">
              {/* Mobile Menu Heading */}
              <div className="mb-6 text-center">
                <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#9E6D1F]">
                  Renaissance X Edition
                </span>

                <h2 className="text-xl font-bold tracking-tight text-[#0C2B3D]">
                  Expedition Navigation
                </h2>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-2.5">
                {navLinks.map((link, index) => {
                  const current = isActive(link.path);
                  const Icon = link.icon;

                  return (
                    <motion.div
                      key={link.path}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05 + 0.1,
                        duration: 0.2,
                      }}
                    >
                      <Link
                        to={link.path}
                        onClick={() =>
                          setIsOpen(false)
                        }
                        className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                          current
                            ? "border-[#C5A25F]/70 bg-[#F4EBD9]/92 font-bold text-[#0C2B3D] shadow-[0_8px_22px_rgba(197,162,95,0.16)]"
                            : "border-[#7FB6C7]/30 bg-white/45 text-[#416678] hover:border-[#7FB6C7]/55 hover:bg-white/65 hover:text-[#0C2B3D]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-1.5 ${
                              current
                                ? "bg-[#C5A25F] text-[#0C2B3D]"
                                : "bg-[#D7EBEE] text-[#527486]"
                            }`}
                          >
                            <Icon
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          </div>

                          <span className="text-sm font-semibold">
                            {link.name}
                          </span>
                        </div>

                        {current && (
                          <span className="h-2 w-2 rounded-full bg-[#C5A25F] shadow-[0_0_8px_rgba(197,162,95,0.8)]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Sign In CTA */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.2,
                }}
                className="pt-4"
              >
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    to="/campus-ambassador"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#C5A25F]/45 bg-[#F4EBD9]/80 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#0C2B3D]"
                  >
                    <GraduationCap className="h-4 w-4 text-[#9E6D1F]" />
                    Campus Ambassador
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#7FB6C7]/30 bg-white/45 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#416678]"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Mobile Footer */}
            <div className="relative z-10 mx-auto w-full max-w-sm border-t border-[#0C2B3D]/10 pt-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#527486]">
                E-CELL MNNIT • ALL RIGHTS RESERVED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}