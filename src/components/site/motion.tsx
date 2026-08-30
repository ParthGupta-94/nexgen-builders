"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global motion system for NexGen (adapted from the Azure build).
 * - Lenis smooth scrolling, driven by the GSAP ticker.
 * - Reveals: an IntersectionObserver toggles `.in` on [data-reveal]/[data-split]
 *   (CSS handles the transition) — reliable, never leaves content hidden.
 * - GSAP enhancements (decorative, never gate content):
 *     data-parallax="0.2"    drift the element as it passes through the viewport
 *     data-count / -to       count a number up when it enters
 *     data-skew              scroll-velocity skew
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

    gsap.registerPlugin(ScrollTrigger);

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

    // ---- reveals: a plain scroll listener toggles the `.in` class as elements
    //      enter (CSS does the transition). Native scroll events fire reliably
    //      regardless of Lenis / GSAP / rAF, so content can never stay hidden. ----
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-split], .reveal"),
    );
    const revealCheck = () => {
      const line = window.innerHeight * 0.9;
      for (let i = revealEls.length - 1; i >= 0; i--) {
        if (revealEls[i].getBoundingClientRect().top < line) {
          revealEls[i].classList.add("in");
          revealEls.splice(i, 1);
        }
      }
      if (!revealEls.length) {
        window.removeEventListener("scroll", revealCheck);
        window.removeEventListener("resize", revealCheck);
      }
    };
    revealCheck();
    window.addEventListener("scroll", revealCheck, { passive: true });
    window.addEventListener("resize", revealCheck);

    // ---- GSAP enhancements (parallax + count-up) — decorative only, they
    //      never control whether content is visible. ----
    const ctx = gsap.context(() => {
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

    // When the tab becomes visible, recalc parallax and reveal any in-view items.
    const onVisible = () => {
      if (document.hidden) return;
      ScrollTrigger.refresh();
      revealCheck();
    };
    document.addEventListener("visibilitychange", onVisible);
    cleanups.push(() => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("scroll", revealCheck);
      window.removeEventListener("resize", revealCheck);
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
