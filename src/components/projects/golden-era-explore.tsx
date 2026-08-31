"use client";

import { Explore3D } from "@/components/site/explore-3d";

/** Poster + click-to-load launcher for the Golden Era 3D scene. */
export function GoldenEraExplore() {
  return (
    <Explore3D
      poster="/projects/golden-era/day-site-view.jpg"
      alt="Golden Era Homes — the towers by day"
      load={() => import("./golden-era-3d").then((m) => m.GoldenEra3D)}
    />
  );
}
