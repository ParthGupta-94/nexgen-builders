"use client";

import { useEffect, useState } from "react";
import { site, whatsappHref } from "@/data/site";

/** Floating WhatsApp button — the owner's #1 channel, replies within 2 minutes. */
export function WhatsappFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${site.contact.owner}`}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3.5 pr-5 text-white shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl ${
        show ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1A7.9 7.9 0 0 0 12 20a7.94 7.94 0 0 0 5.6-13.6ZM12 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25A6.59 6.59 0 1 1 12 18.5Zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.51.64-.62.77-.23.15-.42.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.32.58-1.08a.37.37 0 0 0-.02-.35c-.05-.1-.44-1.07-.6-1.46s-.32-.34-.44-.34h-.38a.72.72 0 0 0-.52.24 2.2 2.2 0 0 0-.69 1.64 3.82 3.82 0 0 0 .8 2.03 8.75 8.75 0 0 0 3.35 2.96c1.25.54 1.74.58 2.36.49a2 2 0 0 0 1.32-.93 1.64 1.64 0 0 0 .11-.93c-.05-.09-.18-.14-.38-.24Z" />
      </svg>
      <span className="text-sm font-semibold">Chat with us</span>
    </a>
  );
}
