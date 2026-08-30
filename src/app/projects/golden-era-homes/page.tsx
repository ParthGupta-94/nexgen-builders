import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Building2, MessageCircle, Phone, Check, ArrowRight, ShieldCheck,
} from "lucide-react";
import { Container, Section, Eyebrow, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { Gallery } from "@/components/site/gallery";
import { getProject } from "@/data/projects";
import { getLocation } from "@/data/locations";
import { goldenEraGallery } from "@/data/images";
import { site, whatsappHref } from "@/data/site";

const p = getProject("golden-era-homes")!;
const loc = getLocation(p.locationSlug);
const enquiry = `Hi NexGen, I'd like details, pricing and availability for Golden Era Homes (${p.tagline}).`;

export const metadata: Metadata = {
  title: p.metaTitle,
  description: p.metaDescription,
  keywords: p.keywords,
  alternates: { canonical: "/projects/golden-era-homes" },
  openGraph: { title: p.metaTitle, description: p.metaDescription, type: "website" },
};

// Specs — developer is known; the rest stay [PLACEHOLDER] until confirmed.
const specs: { label: string; value: string }[] = [
  { label: "Location", value: "Nagla Road, Zirakpur" },
  { label: "Developer", value: "Goyal Infra" },
  { label: "Type", value: "Residential apartments" },
  { label: "Configurations", value: "1, 2 & 3 BHK" },
  { label: "Status", value: "Available — ready & under-construction" },
  { label: "RERA", value: "[PLACEHOLDER — RERA no.]" },
  { label: "Possession", value: "[PLACEHOLDER]" },
];

// Amenities — placeholders to confirm with the owner.
const amenities = [
  "[PLACEHOLDER — e.g. Clubhouse]",
  "[PLACEHOLDER — e.g. Gymnasium]",
  "[PLACEHOLDER — e.g. Landscaped greens]",
  "[PLACEHOLDER — e.g. Kids' play area]",
  "[PLACEHOLDER — e.g. 24×7 security]",
  "[PLACEHOLDER — e.g. Power backup]",
  "[PLACEHOLDER — e.g. Covered parking]",
  "[PLACEHOLDER — e.g. Lift]",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "Golden Era Homes",
  description: p.metaDescription,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nagla Road",
    addressLocality: "Zirakpur",
    addressRegion: site.address.state,
    addressCountry: "IN",
  },
};

export default function GoldenEraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="section-dark relative overflow-hidden">
        <div
          aria-hidden
          data-parallax="0.22"
          className="pointer-events-none absolute -right-24 -top-40 h-[65vh] w-[65vh] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,162,74,0.16), rgba(201,162,74,0) 62%)" }}
        />
        <Container className="relative grid gap-10 pt-32 pb-16 sm:pt-40 sm:pb-20 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] on-dark-muted">
              <Link href="/projects" className="hover:text-[var(--color-gold-soft)]">Projects</Link>
              <span>/</span>
              <span className="text-[var(--color-gold-soft)]">Golden Era Homes</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--color-gold)]/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white">
                {p.status}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-[#efe7d7]">
                {p.type}
              </span>
            </div>
            <h1 data-split className="mt-5 font-display text-[clamp(2.2rem,5.4vw,3.8rem)] leading-[1.04] text-[var(--color-ivory)]">
              Golden Era Homes
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm on-dark-muted">
              <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[var(--color-gold-soft)]" /> Nagla Road, Zirakpur</span>
              <span className="flex items-center gap-1.5"><Building2 size={15} className="text-[var(--color-gold-soft)]" /> Goyal Infra</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={whatsappHref(enquiry)} target="_blank" rel="noopener noreferrer"
                className="btn-magnetic inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-ink">
                <MessageCircle size={17} strokeWidth={2.2} /> Get pricing &amp; availability
              </a>
              <a href={`tel:${site.contact.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]">
                <Phone size={16} /> {site.contact.phone}
              </a>
            </div>
          </div>
          <Reveal variant="right">
            <Photo src={goldenEraGallery[0].src} alt={goldenEraGallery[0].alt} priority
              sizes="(max-width: 1024px) 100vw, 45vw" className="aspect-[4/3] w-full rounded-2xl" />
          </Reveal>
        </Container>
      </section>

      {/* Overview + at-a-glance */}
      <Section className="bg-ivory">
        <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <Eyebrow>About Golden Era Homes</Eyebrow>
              <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted">
                {p.intro.map((t, i) => <p key={i}>{t}</p>)}
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--color-gold-soft)]/40 bg-[var(--color-gold-tint)] p-5">
                <ShieldCheck className="mt-0.5 shrink-0 text-gold" size={20} />
                <p className="text-sm leading-relaxed text-ink">
                  We verify Goyal Infra&apos;s credibility and track record before you commit — and negotiate the best price, floor and payment terms on your behalf.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">At a glance</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {specs.map((s, i) => (
                  <div key={s.label} className={`flex justify-between gap-4 ${i < specs.length - 1 ? "border-b border-[var(--color-line)] pb-3" : ""}`}>
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-right font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <a href={whatsappHref(enquiry)} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-gold)]">
                <MessageCircle size={16} /> Ask about Golden Era Homes
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Gallery */}
      <Section className="bg-sand">
        <Container>
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] text-ink">
            Inside &amp; around Golden Era Homes.
          </h2>
          <p className="mt-3 max-w-xl text-muted">Tap any photo to view it full-screen.</p>
          <div className="mt-8">
            <Gallery images={goldenEraGallery} />
          </div>
        </Container>
      </Section>

      {/* Amenities & specs */}
      <Section className="bg-ivory">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <Eyebrow>Amenities</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] text-ink">Everyday comfort, built in.</h2>
              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <Eyebrow>Configurations</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] text-ink">Homes for every family.</h2>
              <ul className="mt-6 space-y-2.5">
                {p.configs.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" /> {c}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted">
                Pricing moves by tower, floor and possession stage — message us for current, real numbers.
              </p>
              <div className="mt-5">
                <Button href={whatsappHref(enquiry)} variant="gold">Get the price list</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Location */}
      {loc && (
        <Section className="section-dark">
          <Container>
            <Link href={`/locations/${loc.slug}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-[var(--color-gold-soft)]/50">
              <div className="flex items-center gap-4">
                <MapPin className="text-[var(--color-gold-soft)]" size={24} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">The area</p>
                  <p className="mt-1 font-display text-lg text-[var(--color-ivory)]">Everything about buying in {loc.name}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ivory)] transition-colors group-hover:text-[var(--color-gold-soft)]">
                Read the area guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section className="bg-sand">
        <Container className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink">
            Book a visit to Golden Era Homes.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Send your budget and preferred configuration — {site.contact.owner.split(" ")[0]} usually replies within minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href={whatsappHref(enquiry)} variant="gold">
              <MessageCircle size={17} /> Enquire on WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
