import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/reveal";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Photo } from "@/components/ui/photo";
import { contactImage } from "@/data/images";
import { site, whatsappHref, isPlaceholder, businessJsonLd } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact NexGen Builders & Promoters — Zirakpur, PR-7 Airport Road",
  description:
    "Talk to NexGen Builders & Promoters about property in Zirakpur, Mohali, Panchkula or Himachal — WhatsApp, call or visit our PR-7 Airport Road office.",
  alternates: { canonical: "/contact" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    businessJsonLd,
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nexgenestates.in/" },
        { "@type": "ListItem", position: 2, name: "Contact", item: "https://nexgenestates.in/contact" },
      ],
    },
  ],
};

export default function ContactPage() {
  const methods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: site.contact.phone,
      note: "Fastest — replies in ~2 minutes",
      href: whatsappHref(),
      primary: true,
    },
    {
      icon: Phone,
      label: "Call",
      value: site.contact.phone,
      note: "Prefer to talk? Give us a ring",
      href: `tel:${site.contact.phoneRaw}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: site.contact.email,
      note: "For documents & detailed queries",
      href: `mailto:${site.contact.email}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <PageHeader eyebrow="Get in touch" title="Your next address starts with a message.">
        <p className="mt-6 max-w-xl text-lg leading-relaxed on-dark-muted">
          No pressure, no jargon — just honest advice from someone who knows the
          market. Reach out however suits you; {site.contact.owner.split(" ")[0]}{" "}
          usually replies within minutes.
        </p>
      </PageHeader>

      {/* Contact methods */}
      <Section className="bg-ivory">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {methods.map((m, i) => (
              <Reveal key={m.label} delay={i * 80}>
                <a
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                    m.primary
                      ? "border-[var(--color-gold-soft)]/60 bg-[var(--color-gold-tint)]"
                      : "border-[var(--color-line)] bg-[var(--color-paper)] hover:border-[var(--color-gold-soft)]/60"
                  }`}
                >
                  <m.icon className="text-gold" size={24} />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-display text-lg text-ink">{m.value}</p>
                  <p className="mt-1 text-sm text-muted">{m.note}</p>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Form + details */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <Reveal>
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7 sm:p-9">
                <h2 className="font-display text-2xl text-ink">
                  Tell us what you&apos;re looking for
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Fill this in and it opens in WhatsApp with your details ready
                  to send.
                </p>
                <div className="mt-7">
                  <EnquiryForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-6">
                <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Visit the office
                  </h3>
                  <ul className="mt-5 space-y-4 text-sm text-ink">
                    <li className="flex gap-3">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                      <span>
                        {site.address.line1}
                        <br />
                        {site.address.line2}
                        <br />
                        {site.address.city}, {site.address.state} {site.address.pin}
                      </span>
                    </li>
                    {!isPlaceholder(site.address.hours) && (
                      <li className="flex gap-3">
                        <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
                        <span>{site.address.hours}</span>
                      </li>
                    )}
                    <li className="flex gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0 text-gold"
                        aria-hidden
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                      </svg>
                      <a
                        href={site.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold"
                      >
                        @nexgen_estates_
                      </a>
                    </li>
                    {!isPlaceholder(site.social.facebook) && (
                      <li className="flex gap-3">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="mt-0.5 shrink-0 text-gold"
                          aria-hidden
                        >
                          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7A9.98 9.98 0 0 0 22 12.06Z" />
                        </svg>
                        <a
                          href={site.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gold"
                        >
                          facebook.com/nexgenestates
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Location visual (temporary stock — swap for a map/photo) */}
                <Photo
                  src={contactImage}
                  alt="NexGen office locality, Zirakpur"
                  overlay
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="flex aspect-4/3 items-end rounded-2xl p-5"
                >
                  <span className="relative z-10 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    <MapPin size={13} /> PR-7 Airport Road, Zirakpur
                  </span>
                </Photo>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
