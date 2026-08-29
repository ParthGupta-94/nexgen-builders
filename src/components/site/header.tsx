"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { nav, site, whatsappHref } from "@/data/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-ivory)]/85 backdrop-blur-md border-b border-[var(--color-line)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight text-ink">
            NEX<span className="text-gold">GEN</span>
          </span>
          <span className="mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-muted">
            Builders &amp; Promoters
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-ink)]"
          >
            <MessageCircle size={16} strokeWidth={2.2} />
            WhatsApp us
          </a>
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-ivory)] lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-[var(--color-sand)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} /> WhatsApp {site.contact.owner.split(" ")[0]}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
