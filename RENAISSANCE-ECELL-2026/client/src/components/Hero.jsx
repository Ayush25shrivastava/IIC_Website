import React from "react";
import WaterButton from "./WaterButton";
import { getAssetUrl } from "../utils/assetUrl";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-16">
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Prominent 10th Edition Logo */}
        <div className="w-full max-w-[580px] sm:max-w-[720px] md:max-w-[820px] mb-8">
          <img
            src={getAssetUrl("/renaissance-logo-clean.png")}
            alt="Renaissance 10th Edition Emblem"
            onError={(e) => {
              e.currentTarget.src = getAssetUrl("/renaissance-logo-transparent.png");
            }}
            className="w-full h-auto object-contain filter drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] drop-shadow-[0_0_30px_rgba(56,189,248,0.28)] transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>

        {/* Primary Heading for SEO and Accessibility */}
        <h1 className="sr-only">
          Renaissance'26 — 10th Edition Annual Entrepreneurship Summit | E-Cell MNNIT Allahabad
        </h1>

        {/* Balanced Summit Description Text */}
        <p className="font-montserrat text-lg sm:text-xl text-[#CBD5E1] max-w-xl font-light mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed">
          The Annual Entrepreneurship Summit of{" "}
          <span className="text-[#38BDF8] font-semibold tracking-wide">MNNIT Allahabad</span>.
        </p>

        {/* Physics-Based Water Filling Interactive Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          <WaterButton to="/events" variant="primary">
            Explore Events
          </WaterButton>
          <WaterButton to="/register" variant="secondary">
            Register Now
          </WaterButton>
        </div>
      </div>
    </section>
  );
}
