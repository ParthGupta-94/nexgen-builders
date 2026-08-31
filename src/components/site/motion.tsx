"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global motion system for NexGen — NATIVE scrolling (no scroll hijacking).
 * - Reveals: a scroll/resize listener + MutationObserver toggle `.in` on
 *   [data-reveal]/[data-split] (CSS does the transition). Queries the DOM live,
 *   so client-side route swaps are handled and content can never stay hidden.
 * - GSAP enhancements (decorative, never gate content):
 *     data-parallax="0.2"  drift as it passes through the viewport (ScrollTrigger)
 *     data-count / -to      count a number up when it enters
 *     .btn-magnetic         magnetic pull toward the cursor (fine pointers)
 *   plus a scroll-progress bar and a soft gold cursor glow.
 * All gated behind prefers-reduced-motion (content shows immediately).
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.documentElement.classList.remove("js");
      return;
    }
    // desktop = fine pointer + wide screen; heavy scroll-linked effects (parallax)
    // and the cursor flourishes are gated to this to keep touch devices smooth.
    const desktop =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth >= 900;

    gsap.registerPlugin(ScrollTrigger);

    const cleanups: Array<() => void> = [];
    const alreadyShown = (el: Element) =>
      el.getBoundingClientRect().top < window.innerHeight * 0.92;

    // ---- reveals (native scroll; live DOM query; route-swap aware) ----
    const revealCheck = () => {
      const line = window.innerHeight * 0.9;
      document
        .querySelectorAll<HTMLElement>(
          "[data-reveal]:not(.in), [data-split]:not(.in), .reveal:not(.in)",
        )
        .forEach((el) => {
          if (el.getBoundingClientRect().top < line) el.classList.add("in");
        });
    };
    revealCheck();
    window.addEventListener("scroll", revealCheck, { passive: true });
    window.addEventListener("resize", revealCheck);
    let moTimer: number | undefined;
    const mo = new MutationObserver(() => {
      window.clearTimeout(moTimer);
      moTimer = window.setTimeout(revealCheck, 60);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", revealCheck);
      window.removeEventListener("resize", revealCheck);
      window.clearTimeout(moTimer);
      mo.disconnect();
    });

    // ---- GSAP enhancements (decorative) ----
    const ctx = gsap.context(() => {
      // scrub parallax is desktop-only — it drives transforms on every scroll
      // tick and is a common source of jank on phones.
      if (desktop) gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
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

    // ---- scroll-progress bar (native) ----
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const onProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onProgress();
    window.addEventListener("scroll", onProgress, { passive: true });
    window.addEventListener("resize", onProgress);
    cleanups.push(() => {
      window.removeEventListener("scroll", onProgress);
      window.removeEventListener("resize", onProgress);
      bar.remove();
    });

    // ---- reveal on tab-visible ----
    const onVisible = () => {
      if (document.hidden) return;
      ScrollTrigger.refresh();
      revealCheck();
    };
    document.addEventListener("visibilitychange", onVisible);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisible));

    // ---- soft gold cursor glow + magnetic CTAs (fine pointer only) ----
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

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(refreshTimer);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
