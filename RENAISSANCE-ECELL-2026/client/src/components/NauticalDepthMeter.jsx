import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NauticalDepthMeter() {
  const depthRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal only after scrolling past 80vh (hero)
    gsap.to(containerRef.current, {
      opacity: 1,
      scrollTrigger: {
        trigger: document.body,
        start: "80vh top",
        end: "100vh top",
        scrub: true,
      }
    });

    // Update depth without React state jitter
    const updateDepth = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      if (depthRef.current) {
        depthRef.current.textContent = `DEPTH: ${Math.round(progress * 3000)} m`;
      }
    };
    
    // Use GSAP ticker for ultra smooth, non-React updates
    gsap.ticker.add(updateDepth);
    return () => gsap.ticker.remove(updateDepth);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-4 opacity-0 transition-opacity duration-300"
    >
      <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent"></div>
      <div 
        ref={depthRef}
        className="text-[#d4af37] font-mono text-sm tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold"
        style={{ 
          writingMode: 'vertical-rl', 
          transform: 'rotate(180deg)',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        DEPTH: 0 m
      </div>
      <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent"></div>
    </div>
  );
}
