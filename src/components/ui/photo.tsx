import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Image well: renders a cover image (with the dark `.photo-well` as the
 * loading/empty state) plus optional overlay children (badges, captions).
 * `src` empty → just the placeholder well.
 */
export function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  overlay = false,
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  overlay?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden ${src ? "bg-[var(--color-espresso)]" : "photo-well"} ${className}`}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
      )}
      {children}
    </div>
  );
}
