import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollContext } from "../lib/smoothScroll";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  const scrollTo = useCallback((target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
      return;
    }

    if (typeof target === "number") {
      window.scrollTo({
        top: target,
        behavior: options.immediate ? "auto" : "smooth",
      });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({
        behavior: options.immediate ? "auto" : "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let lenisInstance = null;
    let isMounted = true;
    let tickerCallback = null;

    import("lenis")
      .then((mod) => {
        if (!isMounted) return;
        const LenisClass = mod.default || mod.Lenis || mod;
        if (!LenisClass) return;

        // On touch screens (phones/tablets), do NOT hijack touch events.
        // Hijacking touch with JS smooth scroll causes high touch-to-render latency and stutter.
        const lenis = new LenisClass({
          duration: 1.0,
          easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
          wheelMultiplier: 1.0,
          touchMultiplier: 0,
          syncTouch: false,
          smoothTouch: false,
          autoResize: true,
        });
        lenisInstance = lenis;
        lenisRef.current = lenis;
        window.__lenis = lenis;

        lenis.on("scroll", () => ScrollTrigger.update());

        tickerCallback = (time) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        // Use standard lag smoothing so frame drops don't cause massive animation jumps
        gsap.ticker.lagSmoothing(500, 33);
      })
      .catch((err) => {
        console.warn("Smooth scroll initialization skipped:", err);
      });

    // Ensure native mobile touch scrolling also triggers ScrollTrigger updates
    const onScroll = () => {
      ScrollTrigger.update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", onScroll);
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
