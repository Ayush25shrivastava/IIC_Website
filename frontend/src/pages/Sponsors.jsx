import React from "react";
import {
  Compass,
  Anchor,
  Sparkles,
  Star,
  Navigation,
  Ship,
} from "lucide-react";

import ContactFooter from "../components/ContactFooter";
import SocialSideRail from "../components/SocialSideRail";
import { SPONSOR_TIERS } from "../data/sponsorsData";

/* ================================================================
   SPONSORS PAGE — RENAISSANCE OCEANIC EXPEDITION
   Theme: Consistent Warm Caribbean Oceanic Sea
   Hero: Previous bg image kept with smooth drift animation
   Boat: Boat thing completely removed!
================================================================ */

export default function Sponsors({ embedded = false }) {
  const presentingSponsor = {
    name: "To Be Revealed Soon",
    category: "Our Journey Partners",
    image: "/sponsors/to-be-revealed.png",
    description: "The sponsors of our expedition will be revealed soon. Stay tuned for the grand announcement as we chart new territories together.",
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-gradient-to-b
        from-[#DFECEE]
        via-[#D4E8EA]
        to-[#C8E1E5]
        text-[#0C2B3D]
        selection:bg-[#C5A25F]
        selection:text-white
      "
    >
      {/* ============================================================
          GLOBAL SANDY + PARCHMENT ATMOSPHERE (Consistent Theme)
      ============================================================ */}
      <SandyOceanAtmosphere />
      <FloatingStickers />

      {!embedded && <SocialSideRail />}

      {/* ============================================================
          HERO: Previous bg image + background drift animation KEPT
                Boat thing REMOVED
      ============================================================ */}
      {!embedded && (
        <section className="relative z-10 min-h-[82vh] overflow-hidden">
          {/* Previous Ocean Background Image with animation kept */}
          <div className="absolute inset-0">
            <img
              src="/bg_images/events.png"
              alt="Renaissance Ocean Voyage"
              aria-hidden="true"
              className="sponsor-hero-raster h-full w-full object-cover object-top select-none pointer-events-none"
              draggable="false"
            />

            {/* Subtle marine depth tint */}
            <div className="absolute inset-0 bg-[#062538]/20 mix-blend-multiply" />            {/* Bright oceanic sea wash */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D2E9ED]/30 via-transparent to-[#DFECEE]/95" />

            {/* Soft oceanic morning wash */}
            <div className="absolute left-0 top-0 h-full w-[72%] bg-gradient-to-r from-[#DFECEE]/92 via-[#DFECEE]/50 to-transparent" />

            {/* Bottom oceanic blend into the page */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#DFECEE] via-[#DFECEE]/85 to-transparent" />
          </div>

          {/* Decorative horizon line */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[17%] z-[2]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#5FA5B5]/45 to-transparent" />
          </div>

          {/* NOTE: Boat thing (<AnimatedVoyageShip />) is REMOVED completely */}

          {/* Hero text */}
          <div
            className="
              relative
              z-10
              mx-auto
              flex
              min-h-[82vh]
              max-w-[1500px]
              items-center
              px-6
              pb-20
              pt-32
              sm:px-10
              lg:px-16
            "
          >
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-12 bg-[#125D73]" />
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.35em]
                    text-[#125D73]
                    sm:text-[10px]
                  "
                >
                  Our Voyage Partners
                </span>
                <Compass
                  className="h-5 w-5 text-[#125D73]"
                  strokeWidth={1.3}
                />
              </div>

              {/* Heading */}
              <h1
                className="
                  font-cinzel
                  text-5xl
                  font-extrabold
                  leading-[1.1]
                  tracking-wider
                  text-[#0C2B3D]
                  sm:text-6xl
                  lg:text-7xl
                  xl:text-[80px]
                "
              >
                THE ALLIES
                <br />
                <span className="text-[#104252]">BEHIND THE</span>
                <br />
                <span className="text-[#1A6278]">EXPEDITION</span>
              </h1>

              <p
                className="
                  mt-8
                  max-w-xl
                  font-montserrat
                  text-sm
                  leading-relaxed
                  text-[#1D4A5E]
                  sm:text-base
                "
              >
                Great journeys are never sailed alone. Meet the organizations,
                visionaries and partners helping Renaissance venture beyond the
                known.
              </p>

              {/* Aesthetic secondary line */}
              <div className="mt-12 flex items-center gap-5 opacity-70">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#125D73]" />
                <span
                  className="
                    font-mono
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.4em]
                    text-[#1A6278]
                  "
                >
                  Different Minds · Same Destination
                </span>
              </div>
            </div>
          </div>

          {/* Large decorative compass watermark */}
          <div
            className="
              sponsor-compass-slow
              pointer-events-none
              absolute
              bottom-[13%]
              right-[7%]
              z-[3]
              hidden
              opacity-25
              lg:block
            "
          >
            <Compass
              className="h-48 w-48 text-[#144F63]"
              strokeWidth={0.7}
            />
          </div>

          {/* Navigation coordinate */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-[8%]
              right-[8%]
              z-[5]
              hidden
              font-mono
              text-[8px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#3D6B7C]
              lg:block
            "
          >
            25° 12′ N · 71° 04′ W
          </div>
        </section>
      )}


      {/* ============================================================
          PRESENTING PARTNER (Sandy-Oceanic Sovereign Vault)
      ============================================================ */}
      {presentingSponsor && (
        <section
          id="presenting-partner"
          className="relative z-10 mx-auto max-w-[1280px] px-5 pb-20 pt-24 sm:px-8 lg:pt-28"
          style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }}
        >
          <SectionHeading
            icon={<Star className="h-5 w-5" />}
            eyebrow="The Flagship"
            title="Presenting Partner"
            subtitle="The principal ally helping lead the expedition across uncharted horizons."
          />

          <div
            className="
              sponsor-feature-card
              group
              relative
              mx-auto
              mt-12
              max-w-5xl
              overflow-hidden
              rounded-[28px]
              border-2
              border-[#C5A25F]/70
              bg-gradient-to-br
              from-[#EEDFCA]
              via-[#E6D6C0]
              to-[#DCECEE]
              shadow-[0_22px_70px_rgba(20,55,70,0.15)]
              transition-all
              duration-500
              hover:border-[#B58B3E]
            "
          >
            {/* Gold edge */}
            <div
              className="
                absolute
                inset-x-0
                top-0
                z-20
                h-[3px]
                bg-gradient-to-r
                from-transparent
                via-[#C7A052]
                to-transparent
              "
            />

            {/* Nautical chart background */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
              <NauticalChart />
            </div>

            {/* Decorative compass watermark */}
            <div className="pointer-events-none absolute -right-24 -top-24 opacity-[0.06]">
              <Compass
                className="h-80 w-80 text-[#0F4356]"
                strokeWidth={0.6}
              />
            </div>

            {/* Vintage Stamp Accent on the Presenting Sponsor Card */}
            <img src="/card-decor-stamp.png" alt="" className="absolute -top-6 -left-6 w-24 sm:w-32 opacity-80 mix-blend-multiply drop-shadow-lg z-30 pointer-events-none -rotate-12" />

            <div className="relative grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[1fr_1.05fr] md:p-14">
              {/* Logo plaque in sandy parchment tone */}
              <div
                className="
                  relative
                  flex
                  min-h-[235px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#BFA275]/60
                  bg-[#F2E5D4]
                  p-8
                  shadow-inner
                  sm:min-h-[285px]
                "
              >
                {/* Inner navigation frame */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-4
                    rounded-xl
                    border
                    border-[#A87E35]/35
                  "
                />

                <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t border-[#9E6D1F]/55" />
                <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r border-[#9E6D1F]/55" />

                <img
                  src={presentingSponsor.image}
                  alt={presentingSponsor.name}
                  className="
                    relative
                    z-10
                    max-h-44
                    max-w-[82%]
                    scale-[1.35]
                    object-contain
                    mix-blend-multiply
                    drop-shadow-[0_4px_10px_rgba(20,55,70,0.15)]
                    transition-transform
                    duration-500
                    group-hover:scale-[1.45]
                  "
                />
                
                {/* Vintage Globe Sticker Accent */}
                <img src="/card-decor-globe.png" alt="" className="absolute -bottom-8 -right-6 w-28 sm:w-36 opacity-[0.75] mix-blend-multiply drop-shadow-xl z-20 pointer-events-none group-hover:rotate-6 transition-transform duration-500" />
              </div>

              {/* Information - Centre aligned */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-[#B58B3E]" />
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-[#8A5F1C]
                    "
                  >
                    Presenting Partner
                  </span>
                  <span className="h-px w-8 bg-[#B58B3E]" />
                </div>

                <h3
                  className="
                    font-cinzel
                    text-3xl
                    font-bold
                    uppercase
                    tracking-wide
                    text-[#0C2B3D]
                    sm:text-4xl
                  "
                >
                  {presentingSponsor.name}
                </h3>

                <span className="mt-2 inline-block rounded-full border border-[#C5A25F]/50 bg-[#E8D7C2] px-4 py-1 font-mono text-[10px] font-bold text-[#14556C]">
                  {presentingSponsor.category}
                </span>

                <p
                  className="
                    mt-5
                    max-w-xl
                    font-montserrat
                    text-sm
                    leading-7
                    text-[#2C5263]
                    font-medium
                    mx-auto
                  "
                >
                  {presentingSponsor.description ||
                    "Our flagship partner in this journey of ideas, collaboration, innovation and maritime discovery. Archiving uncharted archipelagos and powering Renaissance 2026."}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-[#C5A25F]/60 bg-[#E8D7C2]/70 px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A5418] shadow-sm">
                    <Ship
                      className="h-4 w-4 text-[#9E6D1F]"
                      strokeWidth={1.3}
                    />
                    <span>Flagship Ally · Sailing With Renaissance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ============================================================
          FOOTER (Matching Warm Beach Sand Tone)
      ============================================================ */}
      {!embedded && (
        <div className="relative z-10 bg-[#E2D2BC]">
          <ContactFooter />
        </div>
      )}


      {/* ============================================================
          PAGE ANIMATIONS (Hero Drift & Compass Kept, Boat Removed)
      ============================================================ */}
      <style>{`
        @keyframes renaissanceCompass {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes renaissanceHeroDrift {
          0%, 100% {
            transform: scale(1.05) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.09) translate3d(-1.2%, -0.6%, 0);
          }
        }

        .sponsor-hero-raster {
          animation: renaissanceHeroDrift 20s ease-in-out infinite;
          will-change: transform;
        }

        .sponsor-compass-slow {
          animation: renaissanceCompass 55s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .sponsor-hero-raster,
          .sponsor-compass-slow {
            animation: none !important;
            transform: scale(1.05);
          }
        }
      `}</style>
    </main>
  );
}

/* =================================================================
   PARTNER STRIP ITEM
================================================================= */

function PartnerStripItem({ icon, text }) {
  return (
    <div className="group flex items-center gap-2.5 transition-colors hover:text-[#8E6422]">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#BFA275]/50 bg-[#E2CEB3] transition-colors group-hover:border-[#9E6D1F] group-hover:bg-[#DAC4A5]">
        {icon}
      </span>
      <span className="font-cinzel text-xs font-bold uppercase tracking-[0.14em] text-[#0C2B3D] group-hover:text-[#8E6422]">
        {text}
      </span>
    </div>
  );
}

/* =================================================================
   SECTION HEADING
================================================================= */

function SectionHeading({ icon, eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-[#B58B3E]/60" />
        <span className="text-[#8E6422]">{icon}</span>
        <span className="h-px w-12 bg-[#B58B3E]/60" />
      </div>

      <p
        className="
          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-[0.32em]
          text-[#8E6422]
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-3
          font-cinzel
          text-3xl
          font-bold
          uppercase
          tracking-wide
          text-[#0C2B3D]
          sm:text-4xl
        "
      >
        {title}
      </h2>

      <p
        className="
          mx-auto
          mt-4
          max-w-xl
          font-montserrat
          text-sm
          leading-6
          text-[#2C5263]
          font-medium
        "
      >
        {subtitle}
      </p>

    </div>
  );
}

/* =================================================================
   SPONSOR SECTION (Sandy + Oceanic Variants, Zero Stark White)
================================================================= */

function SponsorSection({
  id,
  eyebrow,
  title,
  subtitle,
  sponsors,
  size,
}) {
  return (
    <section
      id={id}
      className="
        relative
        z-10
      "
      style={{ contentVisibility: "auto", containIntrinsicSize: "400px" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-28">
        <SectionHeading
          icon={<Compass className="h-5 w-5" />}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />

        <div
          className="
            mx-auto
            mt-14
            flex
            flex-wrap
            items-stretch
            justify-center
            gap-7
            sm:gap-8
            max-w-6xl
          "
        >
          {sponsors.map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className={`
                flex
                justify-center
                w-full
                ${
                  size === "large"
                    ? "sm:w-[calc(50%-1.25rem)] max-w-[440px]"
                    : size === "medium"
                    ? "sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[390px]"
                    : "w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[340px]"
                }
              `}
            >
              <SponsorCard
                sponsor={sponsor}
                size={size}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   SPONSOR CARD (Authentic Pirate Parchment Frame & Maritime Assets)
================================================================= */

function SponsorCard({ sponsor, size = "medium" }) {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <div className="flex flex-col items-center group w-full">
      <article
        className="
          sponsor-card
          relative
          flex
          w-full
          min-h-[200px]
          sm:min-h-[250px]
          items-center
          justify-center
          overflow-hidden
          rounded-[18px]
          border
          border-[#BFA275]/60
          bg-[#F2E5D4]
          p-8
          shadow-[0_14px_38px_rgba(12,38,50,0.10)]
          transition-all
          duration-400
          hover:-translate-y-1.5
          hover:shadow-[0_22px_55px_rgba(12,38,50,0.18)]
          hover:border-[#B58B3E]/80
        "
      >
        {/* Inner navigation frame */}
        <div
          className="
            pointer-events-none
            absolute
            inset-3
            sm:inset-4
            rounded-xl
            border
            border-[#A87E35]/35
            transition-colors
            duration-400
            group-hover:border-[#9E6D1F]/50
          "
        />

        <div className="pointer-events-none absolute left-3 sm:left-4 top-3 sm:top-4 h-5 w-5 sm:h-6 sm:w-6 border-l border-t border-[#9E6D1F]/55" />
        <div className="pointer-events-none absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-5 w-5 sm:h-6 sm:w-6 border-b border-r border-[#9E6D1F]/55" />

        {/* Central Content Area */}
        <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-[1.05] z-10">
          <img
            src={sponsor.image}
            alt={sponsor.name}
            loading="lazy"
            className="max-h-full max-w-[85%] scale-[1.35] object-contain mix-blend-multiply drop-shadow-[0_4px_10px_rgba(20,55,70,0.15)]"
          />

          {/* Vintage Watch Accent for Sponsor Cards */}
          <img src="/card-decor-watch.png" alt="" className="absolute -bottom-5 -right-5 w-20 sm:w-28 opacity-[0.65] mix-blend-multiply drop-shadow-lg z-20 pointer-events-none group-hover:-rotate-12 transition-transform duration-500" />
        </div>
      </article>

      {/* Sponsor Name Below Card */}
      <h3 className="mt-6 font-cinzel text-xl sm:text-2xl font-bold text-[#0C2B3D] tracking-wider text-center transition-colors duration-300 group-hover:text-[#9E6D1F]">
        {sponsor.name}
      </h3>
    </div>
  );
}

/* =================================================================
   GLOBAL SANDY + PARCHMENT ATMOSPHERE (Consistent Theme)
================================================================= */

function SandyOceanAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Warm sunlight sand glow */}
      <div className="absolute right-[-10%] top-[16%] h-[600px] w-[600px] rounded-full bg-[#E8C87A]/10 blur-[120px]" />
      <div className="absolute left-[-10%] top-[50%] h-[550px] w-[550px] rounded-full bg-[#E2B766]/8 blur-[120px]" />
      <div className="absolute left-[28%] top-[-5%] h-[500px] w-[500px] rounded-full bg-[#E8C87A]/12 blur-[120px]" />

      {/* Fine sand parchment grain texture */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(20,65,80,.18) 0 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(165,120,45,.15) 0 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px, 58px 58px",
        }}
      />
    </div>
  );
}

/* =================================================================
   DECORATIVE STICKERS
================================================================= */
function FloatingStickers() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <img src="/sticker-compass.png" alt="compass" className="absolute top-[8%] left-[-2%] w-48 opacity-60 drop-shadow-xl" />
      <img src="/sticker-anchor.png" alt="anchor" className="absolute top-[25%] right-[2%] w-56 opacity-60 drop-shadow-xl -rotate-12" />
      <img src="/sticker-ship.png" alt="ship" className="absolute top-[70%] left-[-4%] w-72 opacity-60 drop-shadow-2xl" />
      <img src="/sticker-wheel.png" alt="wheel" className="absolute top-[50%] right-[3%] w-44 opacity-60 drop-shadow-xl rotate-12" />
      <img src="/sticker-watch.png" alt="watch" className="absolute top-[18%] right-[20%] w-32 opacity-40 drop-shadow-xl rotate-12" />
      <img src="/sticker-bottle.png" alt="bottle" className="absolute top-[85%] left-[12%] w-64 opacity-60 drop-shadow-xl -rotate-6" />
      <img src="/sticker-skull.png" alt="skull" className="absolute top-[35%] left-[45%] w-40 opacity-20 drop-shadow-lg" />
      
      {/* New Vintage Exploration Components from inspiration */}
      <img src="/sticker-lighthouse.png" alt="lighthouse" className="absolute top-[75%] right-[15%] w-60 opacity-[0.65] drop-shadow-2xl mix-blend-multiply" />
      <img src="/sticker-balloon.png" alt="balloon" className="absolute top-[10%] left-[10%] w-56 opacity-60 drop-shadow-xl rotate-6 mix-blend-multiply" />
      <img src="/sticker-camera.png" alt="camera" className="absolute top-[35%] right-[8%] w-48 opacity-[0.55] drop-shadow-xl -rotate-6 mix-blend-multiply" />
      <img src="/sticker-book.png" alt="book" className="absolute top-[55%] left-[8%] w-52 opacity-[0.55] drop-shadow-lg rotate-12 mix-blend-multiply" />
    </div>
  );
}

/* =================================================================
   NAUTICAL CHART (Static Vector Background Graphic)
================================================================= */

function NauticalChart() {
  return (
    <svg
      viewBox="0 0 900 500"
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <path
        d="
          M0 380
          C120 300 180 440 320 330
          C450 230 540 360 690 250
          C770 195 840 245 900 180
        "
        fill="none"
        stroke="#124A5E"
        strokeWidth="1.1"
        strokeDasharray="8 10"
      />
      <path
        d="
          M0 150
          C150 200 210 100 360 180
          C500 255 620 125 900 310
        "
        fill="none"
        stroke="#8A5F1C"
        strokeWidth="1.1"
        strokeDasharray="5 8"
      />
      <circle
        cx="680"
        cy="150"
        r="80"
        fill="none"
        stroke="#124A5E"
        strokeWidth="1"
      />
      <circle
        cx="680"
        cy="150"
        r="50"
        fill="none"
        stroke="#124A5E"
        strokeWidth="0.8"
      />
      <path
        d="M680 65 L680 235 M595 150 L765 150"
        stroke="#124A5E"
        strokeWidth="0.7"
      />
      <path
        d="M180 390 L280 280 L360 350 L440 250"
        fill="none"
        stroke="#124A5E"
        strokeWidth="0.8"
      />
      <circle cx="180" cy="390" r="4" fill="#8A5F1C" />
      <circle cx="440" cy="250" r="4" fill="#8A5F1C" />
    </svg>
  );
}
