import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";

/**
 * Dark page header with a parallaxing gold glow and a word-reveal (data-split)
 * heading. Used across the inner pages for a consistent, premium entrance.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="section-dark relative overflow-hidden">
      {/* parallaxing decorative glow */}
      <div
        aria-hidden
        data-parallax="0.22"
        className="pointer-events-none absolute -right-24 -top-40 h-[65vh] w-[65vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,74,0.16), rgba(201,162,74,0) 62%)",
        }}
      />
      <Container className="relative pt-36 pb-16 sm:pt-44 sm:pb-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          data-split
          className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-[var(--color-ivory)]"
        >
          {title}
        </h1>
        {children}
      </Container>
    </section>
  );
}
