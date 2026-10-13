import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAssetUrl } from "../utils/assetUrl";

export const INTRO_TIMING = {
  total: 1.8,
  outStart: 1.4,
  outDur: 0.4,
};

const titleLetters = "RENAISSANCE".split("");

export default function RenaissanceIntro({ onComplete, onSkip }) {
  const onCompleteRef = useRef(onComplete);
  const onSkipRef = useRef(onSkip);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onSkipRef.current = onSkip;
  });

  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current?.(), INTRO_TIMING.total * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSkipRef.current ? onSkipRef.current() : onCompleteRef.current?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020610] text-[#F4EBD9] pointer-events-auto cursor-pointer select-none backdrop-blur-2xl"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: INTRO_TIMING.outStart, duration: INTRO_TIMING.outDur, ease: "easeInOut" }}
      onClick={() => (onSkipRef.current ? onSkipRef.current() : onCompleteRef.current?.())}
    >
      {/* Ambient Ocean Cyan Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#38BDF8]/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        {/* NetraAI-style Emblem */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: "blur(6px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-56 sm:w-80 md:w-[400px] mb-4 flex items-center justify-center"
        >
          <img
            src={getAssetUrl("/renaissance-logo-clean.png")}
            alt="Renaissance 10th Edition"
            className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(56,189,248,0.6)]"
          />
        </motion.div>

        {/* Laser Hairline Accent */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-48 sm:w-72 h-[1.5px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent my-3 shadow-[0_0_12px_#38BDF8]"
        />

        {/* Sub-caption */}
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#38BDF8]/90 uppercase"
        >
          10TH EDITION • THE GREAT VOYAGE
        </motion.p>
      </div>
    </motion.div>
  );
}
