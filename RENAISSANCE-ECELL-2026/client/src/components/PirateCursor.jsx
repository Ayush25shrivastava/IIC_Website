import React, { useEffect, useRef } from "react";

const HOOK_HOTSPOT = {
  x: 10,
  y: 13,
};

export default function PirateCursor() {
  const cursorRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursorEl = cursorRef.current;
    const iconEl = iconRef.current;
    if (!cursorEl || !iconEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animFrameId = null;
    let isVisible = false;
    let isHovered = false;
    let isMouseDown = false;

    const updateIconTransform = () => {
      if (isMouseDown) {
        iconEl.style.transform = "scale(0.9)";
      } else if (isHovered) {
        iconEl.style.transform = "scale(1.2)";
      } else {
        iconEl.style.transform = "scale(1)";
      }
    };

    const renderLoop = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      // Snap once the cursor is effectively caught up, then stop the RAF loop.
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        currentX = mouseX;
        currentY = mouseY;
        cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        animFrameId = null;
        return;
      }

      currentX += dx * 0.85;
      currentY += dy * 0.85;
      cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animFrameId = requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (event) => {
      if (!isVisible) {
        isVisible = true;
        cursorEl.style.opacity = "1";
      }

      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      updateIconTransform();
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      updateIconTransform();
    };

    const handleMouseOver = (event) => {
      const target = event.target;
      if (!target || !target.tagName) return;

      const tag = target.tagName;
      const interactive =
        tag === "BUTTON" ||
        tag === "A" ||
        tag === "INPUT" ||
        tag === "SELECT" ||
        tag === "TEXTAREA" ||
        Boolean(target.closest?.("a, button, [role='button'], .cursor-pointer"));

      if (interactive !== isHovered) {
        isHovered = interactive;
        updateIconTransform();
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursorEl.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible = true;
      cursorEl.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] hidden md:block select-none opacity-0 transition-opacity duration-150"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        willChange: "transform",
      }}
    >
      <div
        className="relative"
        style={{
          transform: `translate(-${HOOK_HOTSPOT.x}px, -${HOOK_HOTSPOT.y}px)`,
        }}
      >
        <img
          ref={iconRef}
          src="/hook-cursor.png"
          alt=""
          draggable="false"
          className="block w-[34px] h-[34px] object-contain select-none pointer-events-none transition-transform duration-150 ease-out filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] drop-shadow-[0_0_3px_rgba(226,232,240,0.22)]"
          style={{
            transformOrigin: `${HOOK_HOTSPOT.x}px ${HOOK_HOTSPOT.y}px`,
          }}
        />
      </div>
    </div>
  );
}
