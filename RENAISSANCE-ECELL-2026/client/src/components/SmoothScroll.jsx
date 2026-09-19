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

        const lenis = new LenisClass({
          duration: 1.0,
          easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
          wheelMultiplier: 1.0,
          touchMultiplier: 1.0,
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
        gsap.ticker.lagSmoothing(0);
      })
      .catch((err) => {
        console.warn("Smooth scroll initialization skipped:", err);
      });

    return () => {
      isMounted = false;
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
