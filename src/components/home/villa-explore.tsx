"use client";

import { Explore3D } from "@/components/site/explore-3d";
import { aboutImage } from "@/data/images";

/** Poster + click-to-load launcher for the homepage villa 3D scene. */
export function VillaExplore() {
  return (
    <Explore3D
      poster={aboutImage}
      alt="A modern NexGen home"
      load={() => import("./house-3d").then((m) => m.House3D)}
    />
  );
}
