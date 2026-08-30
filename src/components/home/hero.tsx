"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/data/site";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.registerPlugin(SplitText);

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // Split only after web fonts settle, or SplitText freezes the wrong line
    // breaks (measured with fallback-font metrics).
    const build = () => {
      if (cancelled) return;
      ctx = gsap.context((self) => {
        const q = self.selector!;
        const title = q(".hero-title")[0] as HTMLElement;
        // words+chars (no "lines") so the browser wraps natively and responsively
        // — avoids SplitText freezing stale line breaks.
        const split = new SplitText(title, { type: "words,chars" });

      gsap.set(q(".hero-eyebrow, .hero-desc, .hero-cta, .hero-trust"), { opacity: 0, y: 26 });
      gsap.set(title, { opacity: 1, perspective: 700 });
      gsap.set(split.chars, { yPercent: 120, opacity: 0, rotateX: -80, transformOrigin: "50% 100%" });
      gsap.set(q(".hero-bg"), { scale: 1.28 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.to(".intro-curtain", { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, 0)
        .to(".hero-bg", { scale: 1.08, duration: 2.6, ease: "power2.out" }, 0)
        .to(
          split.chars,
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.03, ease: "expo.out" },
          0.5,
        )
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.9 }, 0.5)
        .to(".hero-desc", { opacity: 1, y: 0, duration: 0.9 }, 1.2)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.35)
        .to(".hero-trust", { opacity: 1, y: 0, duration: 0.9 }, 1.6);

        // Failsafe: if the intro can't run (e.g. tab opened in the background,
        // where rAF is throttled), force the hero content visible so it's never
        // stuck hidden. setTimeout fires in background tabs; gsap.set is
        // synchronous and needs no ticker. Cleared once the intro completes.
        const failsafe = window.setTimeout(() => {
          gsap.set(q(".hero-eyebrow, .hero-desc, .hero-cta, .hero-trust"), { opacity: 1, y: 0 });
          gsap.set(split.chars, { yPercent: 0, opacity: 1, rotateX: 0 });
          gsap.set(q(".hero-bg"), { scale: 1.08 });
        }, 2800);
        tl.eventCallback("onComplete", () => window.clearTimeout(failsafe));

        // gentle parallax drift of the background on scroll
        gsap.to(".hero-bg", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }, root);
    };

    if (document.fonts?.status === "loaded") build();
    else (document.fonts?.ready ?? Promise.resolve()).then(build);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden">
      {/* Intro curtain (lifts on load) */}
      <div className="intro-curtain">
        <span className="font-display text-3xl tracking-[0.4em] text-[var(--color-gold-soft)]">
          NEX<span className="text-white/80">GEN</span>
        </span>
      </div>

      {/* Background placeholder well — swap for a hero photograph */}
      <div className="hero-bg photo-well absolute inset-0 -z-10 scale-110" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-[var(--color-espresso)]" />

      <Container className="flex min-h-[100svh] flex-col justify-center pb-20 pt-36 sm:pt-40">
        <div className="max-w-4xl">
          <div className="hero-eyebrow flex items-center gap-3">
            <span className="gold-rule" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
              PR-7 Airport Road · Zirakpur · Tricity
            </span>
          </div>

          <h1 className="hero-title mt-6 max-w-4xl font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-medium leading-[1.06] text-white">
            Property, chosen the way
            <br />
            you&apos;d choose it for{" "}
            <span className="text-[var(--color-gold-soft)]">family.</span>
          </h1>

          <p className="hero-desc mt-7 max-w-xl text-lg leading-relaxed text-white/80">
            A home is built for the generations that come after us — the most
            crucial decision a family makes. For 10 years and 300+ deals,
            NexGen has helped buyers make it knowledgeably, and honestly.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta btn-magnetic inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              Talk to {site.contact.owner.split(" ")[0]} on WhatsApp
            </a>
            <a
              href="/projects"
              className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
            >
              View live projects
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="hero-trust mt-10 flex items-center gap-2.5 text-sm text-white/70">
            <ShieldCheck size={18} className="text-[var(--color-gold-soft)]" />
            We verify every builder&apos;s credibility before you commit.
          </div>
        </div>
      </Container>
    </section>
  );
}
