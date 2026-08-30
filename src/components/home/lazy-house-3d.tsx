"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Three.js (~200KB+) is only downloaded and mounted once the showcase nears the
// viewport, keeping the initial page load light.
const House3D = dynamic(() => import("./house-3d").then((m) => m.House3D), {
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

export function LazyHouse3D() {
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
      {show ? <House3D /> : <Poster label="Scroll down to build the villa" />}
    </div>
  );
}
