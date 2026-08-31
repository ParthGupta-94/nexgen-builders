"use client";

import dynamic from "next/dynamic";

// Auto-loads on the client as the page hydrates (no button). Exterior-only —
// the interior "Step inside" is disabled on the homepage.
const House3D = dynamic(() => import("./house-3d").then((m) => m.House3D), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#aab6c4] to-[#e8e0cf]" />
  ),
});

export function Villa3DAuto() {
  return (
    <div className="absolute inset-0">
      <House3D exteriorOnly />
    </div>
  );
}
