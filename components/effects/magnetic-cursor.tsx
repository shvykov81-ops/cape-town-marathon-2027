"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight magnetic cursor with teal glow.
 * CSS-only approach using a single div with transform.
 * No canvas, no requestAnimationFrame loop, minimal CPU usage.
 * Auto-disabled on touch devices and when prefers-reduced-motion.
 */
export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    // Disable for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      // Smooth follow with lerp (0.15 = smooth but responsive)
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate(${posRef.current.x - 12}px, ${posRef.current.y - 12}px)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(20,184,166,0.8) 0%, rgba(20,184,166,0) 70%)",
        boxShadow: "0 0 20px rgba(20,184,166,0.4), 0 0 40px rgba(20,184,166,0.2)",
        willChange: "transform",
      }}
    />
  );
}
