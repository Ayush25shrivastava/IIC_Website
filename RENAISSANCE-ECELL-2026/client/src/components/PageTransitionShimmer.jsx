import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "../utils/assetUrl";

/**
 * Custom hook to trigger seamless page transitions imperatively
 */
export function useSeamlessNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (to, options = {}) => {
      window.dispatchEvent(
        new CustomEvent("seamless-navigate", { detail: { to, options } })
      );
    },
    []
  );
}

export default function PageTransitionShimmer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [curtainState, setCurtainState] = useState("idle"); // "idle" | "veiling" | "holding" | "unveiling"
  const isTransitioningRef = useRef(false);
  const prevPathRef = useRef(location.pathname);

  // Rapid NetraAI-style transition controller (~400ms total)
  const startTransition = useCallback(
    (targetPath) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      setCurtainState("veiling");

      setTimeout(() => {
        if (targetPath && targetPath !== location.pathname) {
          navigate(targetPath);
        }
        window.dispatchEvent(new CustomEvent("reset-artifacts"));
        setCurtainState("holding");

        setTimeout(() => {
          setCurtainState("unveiling");

          setTimeout(() => {
            setCurtainState("idle");
            isTransitioningRef.current = false;
          }, 150);
        }, 150);
      }, 90);
    },
    [location.pathname, navigate]
  );

  // Intercept internal Link / <a> clicks at capture phase
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // <BrowserRouter basename="/renaissance"> renders Link hrefs with the
      // basename included. Strip it before passing the path back to navigate(),
      // otherwise React Router applies the basename a second time.
      const renaissanceBase = "/renaissance";
      const routerTarget =
        href === renaissanceBase
          ? "/"
          : href.startsWith(`${renaissanceBase}/`)
            ? href.slice(renaissanceBase.length)
            : href;

      startTransition(routerTarget);
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, [startTransition]);

  // Trigger transition when route changes (if not already triggered by click)
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      if (!isTransitioningRef.current) {
        isTransitioningRef.current = true;
        setCurtainState("veiling");
        setTimeout(() => {
          setCurtainState("holding");
          setTimeout(() => {
            setCurtainState("unveiling");
            setTimeout(() => {
              setCurtainState("idle");
              isTransitioningRef.current = false;
            }, 150);
          }, 150);
        }, 90);
      }
    }
  }, [location.pathname]);

  // Listen for programmatic transition events
  useEffect(() => {
    const handleProgrammaticNav = (e) => {
      const { to } = e.detail || {};
      if (to) {
        startTransition(to);
      }
    };

    window.addEventListener("seamless-navigate", handleProgrammaticNav);
    return () => window.removeEventListener("seamless-navigate", handleProgrammaticNav);
  }, [startTransition]);

  const isVisible = curtainState !== "idle";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="transition-curtain"
          initial={{ opacity: 0 }}
          animate={{
            opacity: curtainState === "unveiling" ? 0 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: curtainState === "unveiling" ? 0.15 : 0.08,
            ease: "easeInOut",
          }}
          className="fixed inset-0 z-[999999] pointer-events-auto flex flex-col items-center justify-center bg-[#020610]/95 backdrop-blur-2xl"
        >
          {/* Ambient Ocean Cyan Glow Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[240px] bg-[#38BDF8]/25 rounded-full blur-[80px] pointer-events-none" />

          {/* NetraAI-style Oceanic Transition Emblem */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, filter: "blur(3px)" }}
            animate={{
              scale: curtainState === "unveiling" ? 1.03 : 1,
              opacity: curtainState === "unveiling" ? 0 : 1,
              filter: curtainState === "unveiling" ? "blur(5px)" : "blur(0px)",
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex flex-col items-center px-4 text-center select-none"
          >
            {/* Transparent Emblem Logo - Perfectly Sized */}
            <div className="w-48 sm:w-64 md:w-[320px] mb-3 flex items-center justify-center">
              <img
                src={getAssetUrl("/renaissance-logo-clean.png")}
                alt="Renaissance 10th Edition"
                className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]"
              />
            </div>

            {/* Expanding Laser Hairline */}
            <div className="w-44 sm:w-64 md:w-[280px] h-[1.5px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent my-2 shadow-[0_0_12px_#38BDF8]" />

            {/* Sub-caption */}
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.35em] text-[#38BDF8]/90 drop-shadow-md">
              10TH EDITION • THE GREAT VOYAGE
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
