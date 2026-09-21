import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { Mail, MapPin, Compass } from "lucide-react";

export default function ContactFooter() {
  const socialLinkClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#8ED8EC]/30 bg-white/10 text-[#DDF6FB] shadow-[0_6px_18px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F4EBD9]/60 hover:bg-[#F4EBD9] hover:text-[#0C2B3D] hover:shadow-[0_8px_22px_rgba(244,235,217,0.16)]";

  const footerLinkClass =
    "text-[#C6E2EA] transition-colors duration-200 hover:text-[#F4EBD9]";

  return (
    <footer className="relative z-30 overflow-hidden border-t border-[#8ED8EC]/20 bg-gradient-to-b from-[#0B5271] via-[#0A4562] to-[#07344C] px-4 pb-8 pt-12 text-[#C6E2EA] shadow-[0_-16px_45px_rgba(3,24,38,0.22)] select-none sm:px-6 sm:pb-12 sm:pt-16">
      {/* Subtle ocean atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#38BDF8]/10 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#7DD3FC]/8 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A5E4F2]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-10 text-xs sm:mb-12 md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* Brand */}
        <div className="flex flex-col items-start gap-4 md:col-span-5">
          <Link 
            to="/" 
            className="group flex w-fit items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-white/85 via-white/70 to-white/50 border border-white/80 backdrop-blur-lg shadow-[0_4px_25px_rgba(255,255,255,0.2)] transition-all hover:from-white/95 hover:to-white/65"
          >
            <img
              src="/renaissance-logo-clean.png"
              alt="Renaissance 10th Edition Logo"
              onError={(e) => {
                e.currentTarget.src = "/renaissance-logo-transparent.png";
              }}
              className="h-11 w-auto object-contain brightness-110 drop-shadow-[0_5px_14px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <p className="max-w-md text-xs font-medium leading-6 text-[#C6E2EA] sm:text-[13px]">
            Renaissance is the annual flagship entrepreneurship summit of
            MNNIT Allahabad, charting new horizons in deep tech, venture
            creation, and innovation.
          </p>

          {/* Socials */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://whatsapp.com/channel/0029VaPJh9gBA1f6VCR1I31y"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={socialLinkClass}
            >
              <FaWhatsapp className="h-4 w-4" />
            </a>

            <a
              href="https://www.instagram.com/ecellmnnit?stkn=MWxlaWVoMDZxb3FhZA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={socialLinkClass}
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/company/e-cell-mnnit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialLinkClass}
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>

            <a
              href="https://www.facebook.com/ecellmnnit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={socialLinkClass}
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 md:col-span-3">
          <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#F4EBD9]">
            <Compass className="h-4 w-4 text-[#7DD3FC]" />
            <span>Navigation</span>
          </h4>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold">
            <Link to="/" className={footerLinkClass}>
              Home
            </Link>

            <Link to="/events" className={footerLinkClass}>
              Events
            </Link>

            <Link to="/sponsors" className={footerLinkClass}>
              Sponsors
            </Link>

            <Link to="/teams" className={footerLinkClass}>
              Teams
            </Link>

            <Link to="/gallery" className={footerLinkClass}>
              Gallery
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="flex min-w-0 flex-col gap-4 md:col-span-4">
          <div className="flex items-start gap-3 text-xs leading-6 text-[#C6E2EA] sm:text-[13px]">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#7DD3FC]" />

            <p className="min-w-0">
              E-Cell, Motilal Nehru National Institute of Technology (MNNIT)
              Allahabad, Prayagraj, UP - 211004
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2 font-mono text-xs font-semibold text-[#A5E4F2]">
            <Mail className="h-4 w-4 shrink-0" />

            <a
              href="mailto:renaissance@mnnit.ac.in"
              className="min-w-0 break-all transition-colors hover:text-[#F4EBD9] hover:underline"
            >
              renaissance@mnnit.ac.in
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#A5E4F2]/15 pt-6 text-center font-mono text-[10px] sm:flex-row sm:text-left sm:text-[11px]">
        <p className="text-[#94C9D7]">
          © 2026 Renaissance (10th Edition) • E-Cell MNNIT Allahabad. All
          rights reserved.
        </p>

        <span className="font-semibold uppercase tracking-[0.15em] text-[#F4EBD9]/80">
          10th Edition • Venture Beyond Known
        </span>
      </div>
    </footer>
  );
}