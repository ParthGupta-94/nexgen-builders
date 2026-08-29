"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Global motion system for NexGen (adapted from the Azure build).
 * - Lenis smooth scrolling, driven by the GSAP ticker.
 * - Declarative, attribute-driven scroll animations so markup stays clean:
 *     data-reveal            fade + rise on enter (variants: up|left|right|scale)
 *     data-reveal-batch      stagger the direct children (or [data-reveal-item])
 *     data-parallax="0.2"    drift the element as it passes through the viewport
 *     data-count / -to       count a number up when it enters
 *     data-split             mask-reveal a heading word by word
 *     data-clip              editorial clip-path wipe
 *     data-skew              scroll-velocity skew (the "flowy" hallmark)
 *     .btn-magnetic          magnetic pull toward the cursor (fine pointers)
 * All gated behind prefers-reduced-motion (content shows immediately).
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.documentElement.classList.remove("js");
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const alreadyShown = (el: Element) =>
      el.getBoundingClientRect().top < window.innerHeight * 0.92;

    const ctx = gsap.context(() => {
      /* ---- reveals ---- */
      gsap.utils.toArray<HTMLElement>("[data-reveal], .reveal").forEach((el) => {
        const batch = el.closest("[data-reveal-batch]");
        if (batch && batch !== el) return;
        if (alreadyShown(el)) {
          gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
          return;
        }
        const v = el.dataset.reveal || "up";
        const start: gsap.TweenVars = { opacity: 0 };
        if (v === "left") start.x = -48;
        else if (v === "right") start.x = 48;
        else if (v === "scale") {
          start.scale = 1.06;
          start.y = 24;
        } else start.y = 44;
        gsap.set(el, start);
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.15,
              ease: "power4.out",
            }),
        });
      });

      /* ---- clip-path image reveals ---- */
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        if (alreadyShown(el)) {
          gsap.set(el, { clipPath: "inset(0 0 0% 0)" });
          return;
        }
        gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
        ScrollTrigger.create({
          trigger: el,
          start: "top 84%",
          once: true,
          onEnter: () =>
            gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.out" }),
        });
      });

      /* ---- staggered batches ---- */
      gsap.utils.toArray<HTMLElement>("[data-reveal-batch]").forEach((parent) => {
        const sel = parent.dataset.revealItemSelector || "[data-reveal-item]";
        let targets = parent.querySelectorAll<HTMLElement>(sel);
        if (!targets.length) targets = parent.querySelectorAll<HTMLElement>(":scope > *");
        if (alreadyShown(parent)) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }
        gsap.set(targets, { opacity: 0, y: 46 });
        ScrollTrigger.create({
          trigger: parent,
          start: "top 82%",
          once: true,
          onEnter: () =>
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.09,
            }),
        });
      });

      /* ---- parallax ---- */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const strength = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -strength * 100 },
          {
            yPercent: strength * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      /* ---- count up ---- */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.countTo || "0");
        const decimals = (el.dataset.countTo || "").includes(".") ? 1 : 0;
        const prefix = el.dataset.countPrefix || "";
        const suffix = el.dataset.countSuffix || "";
        const render = (n: number) =>
          (el.textContent = prefix + n.toFixed(decimals) + suffix);
        const run = () => {
          const obj = { n: 0 };
          gsap.to(obj, {
            n: to,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => render(obj.n),
          });
        };
        if (alreadyShown(el)) run();
        else ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: run });
      });

      /* ---- split-title word reveal ----
         type "words" only (never "lines") so the browser wraps natively and we
         avoid SplitText freezing stale line breaks before the font loads. */
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const split = new SplitText(el, { type: "words" });
        gsap.set(el, { opacity: 1 });
        const play = () =>
          gsap.to(split.words, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.045,
          });
        if (alreadyShown(el)) {
          gsap.set(split.words, { y: 0, opacity: 1 });
          return;
        }
        gsap.set(split.words, { y: 24, opacity: 0 });
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: play });
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    /* ================= Global flow effects ================= */
    const cleanups: Array<() => void> = [];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Scroll progress bar
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const onProgress = ({ progress }: { progress: number }) => {
      bar.style.transform = `scaleX(${progress || 0})`;
    };
    lenis.on("scroll", onProgress);
    cleanups.push(() => {
      lenis.off("scroll", onProgress);
      bar.remove();
    });

    // Scroll-velocity skew on flagged imagery
    const skewEls = gsap.utils.toArray<HTMLElement>("[data-skew]");
    if (skewEls.length) {
      const setters = skewEls.map((el) => ({
        skew: gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }),
        scale: gsap.quickTo(el, "scaleY", { duration: 0.5, ease: "power3" }),
      }));
      let idle: number | undefined;
      const onVel = ({ velocity }: { velocity: number }) => {
        const s = gsap.utils.clamp(-4, 4, (velocity || 0) * 0.16);
        const sc = 1 + Math.min(0.06, Math.abs(velocity || 0) * 0.0004);
        setters.forEach((fn) => {
          fn.skew(s);
          fn.scale(sc);
        });
        window.clearTimeout(idle);
        idle = window.setTimeout(
          () => setters.forEach((fn) => { fn.skew(0); fn.scale(1); }),
          140,
        );
      };
      lenis.on("scroll", onVel);
      cleanups.push(() => {
        lenis.off("scroll", onVel);
        window.clearTimeout(idle);
      });
    }

    // Soft gold cursor glow + magnetic CTAs (fine pointer only)
    if (finePointer) {
      const glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
      const gx = gsap.quickTo(glow, "x", { duration: 0.55, ease: "power3" });
      const gy = gsap.quickTo(glow, "y", { duration: 0.55, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        glow.style.opacity = "1";
        gx(e.clientX);
        gy(e.clientY);
      };
      const onOut = () => {
        glow.style.opacity = "0";
      };
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onOut);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onOut);
        glow.remove();
      });

      gsap.utils.toArray<HTMLElement>(".btn-magnetic, [data-magnetic]").forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.45);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Anchor links → smooth scroll via Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash;
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(refreshTimer);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
