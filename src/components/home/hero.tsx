"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { Container } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/data/site";
import { heroImage } from "@/data/images";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // content is visible by default; skip the intro

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const bits = q(".hero-eyebrow, .hero-line, .hero-desc, .hero-cta, .hero-trust");
      gsap.set(bits, { opacity: 0, y: 26 });
      gsap.set(q(".hero-bg"), { scale: 1.25 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.to(".intro-curtain", { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, 0)
        .to(".hero-bg", { scale: 1.06, duration: 2.4, ease: "power2.out" }, 0)
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.8 }, 0.5)
        .to(".hero-line", { opacity: 1, y: 0, duration: 1.0, stagger: 0.14 }, 0.6)
        .to(".hero-desc", { opacity: 1, y: 0, duration: 0.9 }, 1.2)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.35)
        .to(".hero-trust", { opacity: 1, y: 0, duration: 0.9 }, 1.6);

      // Failsafe: guarantee the hero is visible even if the intro can't run
      // (background tab / throttled rAF). setTimeout fires regardless; gsap.set
      // is synchronous and needs no ticker.
      const failsafe = window.setTimeout(() => {
        gsap.set(bits, { opacity: 1, y: 0 });
        gsap.set(q(".hero-bg"), { scale: 1.06 });
      }, 2600);
      tl.eventCallback("onComplete", () => window.clearTimeout(failsafe));

      // gentle parallax drift of the background on scroll
      gsap.to(".hero-bg", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden">
      {/* Intro curtain (lifts on load) */}
      <div className="intro-curtain">
        <span className="font-display text-3xl tracking-[0.4em] text-[var(--color-gold-soft)]">
          NEX<span className="text-white/80">GEN</span>
        </span>
      </div>

      {/* Background photograph (temporary stock — swap for a NexGen project) */}
      <div className="hero-bg absolute inset-0 -z-10 scale-110 overflow-hidden bg-[var(--color-espresso)]">
        <Image
          src={heroImage}
          alt="Premium modern home at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-[var(--color-espresso)]" />

      <Container className="flex min-h-[100svh] flex-col justify-center pb-20 pt-36 sm:pt-40">
        <div className="max-w-4xl">
          <div className="hero-eyebrow flex items-center gap-3">
            <span className="gold-rule" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
              PR-7 Airport Road · Zirakpur · Tricity
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-medium leading-[1.08] text-white">
            <span className="hero-line block">Property, chosen the way</span>
            <span className="hero-line block">
              you&apos;d choose it for{" "}
              <span className="text-[var(--color-gold-soft)]">family.</span>
            </span>
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
