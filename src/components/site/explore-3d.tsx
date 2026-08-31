"use client";

import Image from "next/image";
import { useState, type ComponentType } from "react";

/**
 * A still render by default; the heavy Three.js scene is imported and mounted
 * ONLY when the visitor taps "Explore in 3D". Keeps every page feather-light
 * (nothing 3D loads on scroll) and works the same on mobile and desktop.
 */
export function Explore3D({
  poster,
  alt,
  label = "Explore in 3D",
  load,
}: {
  poster: string;
  alt: string;
  label?: string;
  load: () => Promise<ComponentType>;
}) {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  const start = () => {
    if (Comp || loading) return;
    setLoading(true);
    load()
      .then((C) => setComp(() => C))
      .catch(() => setLoading(false));
  };

  if (Comp) return <Comp />;

  return (
    <div className="absolute inset-0">
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
        <button
          type="button"
          onClick={start}
          disabled={loading}
          aria-label={label}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-transform duration-300 will-change-transform hover:-translate-y-0.5 hover:bg-white hover:text-ink disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Loading 3D…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
              {label}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
