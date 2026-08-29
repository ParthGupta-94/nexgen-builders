"use client";

import { useEffect, useRef, useState } from "react";

/** Counts a leading number up when scrolled into view. Non-numeric values render as-is. */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  // Parse an integer target if the value is a plain number (e.g. "300").
  const target = /^\d+$/.test(value) ? parseInt(value, 10) : null;

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    setDisplay("0");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(String(Math.round(eased * target)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="figure">
      {display}
      {suffix}
    </span>
  );
}
