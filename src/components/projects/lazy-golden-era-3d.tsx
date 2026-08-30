"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Three.js (~200KB+) loads only once the showcase nears the viewport.
const GoldenEra3D = dynamic(() => import("./golden-era-3d").then((m) => m.GoldenEra3D), {
  ssr: false,
  loading: () => <Poster label="Loading 3D…" />,
});

function Poster({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-[#aab6c4] to-[#e8e0cf]">
      <span className="mb-6 rounded-full border border-white/30 bg-black/25 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function LazyGoldenEra3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {show ? <GoldenEra3D /> : <Poster label="Watch it assemble in 3D" />}
    </div>
  );
}
