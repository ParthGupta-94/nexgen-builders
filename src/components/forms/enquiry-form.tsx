"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { locations } from "@/data/locations";

const budgets = ["Under ₹1 Cr", "₹1–2 Cr", "₹2–5 Cr", "₹5–10 Cr", "₹10 Cr+"];
const types = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK / Villa",
  "Plot",
  "Commercial",
  "Not sure yet",
];

/**
 * No backend needed: the form composes a WhatsApp message from the fields and
 * opens it in WhatsApp — matching the owner's preferred channel (replies in ~2 min).
 */
export function EnquiryForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    const area = data.get("area") as string;
    const type = data.get("type") as string;
    const budget = data.get("budget") as string;
    const message = (data.get("message") as string)?.trim();

    const lines = [
      `Hi NexGen, I'd like to enquire about a property.`,
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      area && `Area: ${area}`,
      type && `Looking for: ${type}`,
      budget && `Budget: ${budget}`,
      message && `Details: ${message}`,
    ].filter(Boolean);

    const href = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    window.open(href, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-ivory)] px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-[var(--color-gold)] placeholder:text-muted";
  const label = "text-xs font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input id="name" name="name" required placeholder="Full name" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            inputMode="tel"
            placeholder="Optional"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="area" className={label}>
            Area
          </label>
          <select id="area" name="area" defaultValue="" className={field}>
            <option value="" disabled>
              Select area
            </option>
            {locations.map((l) => (
              <option key={l.slug} value={l.name}>
                {l.name}
              </option>
            ))}
            <option value="Other / not sure">Other / not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className={label}>
            Looking for
          </label>
          <select id="type" name="type" defaultValue="" className={field}>
            <option value="" disabled>
              Select type
            </option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className={label}>
            Budget
          </label>
          <select id="budget" name="budget" defaultValue="" className={field}>
            <option value="" disabled>
              Select budget
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Anything else?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Tell us what you're looking for…"
          className={field}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-ink)]"
      >
        <MessageCircle size={17} strokeWidth={2.2} />
        Send enquiry on WhatsApp
      </button>

      {sent && (
        <p className="text-sm text-muted" role="status">
          Opening WhatsApp with your details… if nothing happened, you can
          message us directly at{" "}
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold"
          >
            {site.contact.phone}
          </a>
          .
        </p>
      )}
      <p className="text-xs text-muted">
        Your enquiry opens in WhatsApp so {site.contact.owner.split(" ")[0]} can
        reply straight away — usually within minutes.
      </p>
    </form>
  );
}
