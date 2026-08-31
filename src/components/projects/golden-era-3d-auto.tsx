"use client";

import dynamic from "next/dynamic";

// Auto-loads on the client as the page hydrates (no button). The scene reads its
// enclosing [data-scroll-track] and assembles the cluster as you scroll.
const GoldenEra3D = dynamic(
  () => import("./golden-era-3d").then((m) => m.GoldenEra3D),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1630] via-[#1b2b4d] to-[#3c3a5f]" />
    ),
  },
);

export function GoldenEra3DAuto() {
  return (
    <div className="absolute inset-0">
      <GoldenEra3D />
    </div>
  );
}
