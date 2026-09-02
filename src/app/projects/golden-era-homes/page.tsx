import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Building2, MessageCircle, Phone, Check, ArrowRight, ShieldCheck,
} from "lucide-react";
import { Container, Section, Eyebrow, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { Gallery } from "@/components/site/gallery";
import { GoldenEra3DAuto } from "@/components/projects/golden-era-3d-auto";
import { getProject } from "@/data/projects";
import { getLocation } from "@/data/locations";
import { goldenEraGallery } from "@/data/images";
import { site, whatsappHref, isPlaceholder } from "@/data/site";

const NO_3D = process.env.NEXT_PUBLIC_NO_3D === "1";

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
  { label: "Location", value: "Nagla Road, Zirakpur (PR-7)" },
  { label: "Developer", value: "Goyal Infra" },
  { label: "Type", value: "3 BHK apartments & floors" },
  { label: "Configurations", value: "1750 & 2100 sq.ft towers · 225 sq.yd floors" },
  { label: "Development", value: "6-acre gated society · S+14 & S+4" },
  { label: "Status", value: "Under construction" },
  { label: "RERA", value: "PBRERA-SAS79-PR0996" },
  { label: "Possession", value: "August 2027" },
];

// Amenities — drawn from Goyal Infra's own project brochure & renders.
const amenities = [
  "Swimming pool",
  "Indoor & open-air gym",
  "Cricket pitch",
  "Badminton court",
  "Family movie theatre",
  "Snooker & indoor games",
  "Kids' play area & sandpits",
  "Party hall & conference room",
  "3 landscaped parks (~32,000 sq.ft green)",
  "Jogging track, zen & pet gardens",
];

// Floor plans — from Goyal Infra's brochure. Dimensions are printed on each plan.
const floorPlans = [
  { src: "/projects/golden-era/plans/plan-tower-1750.jpg", label: "S+14 Tower · 3 BHK", size: "1750 sq.ft", alt: "Golden Era Homes S+14 tower floor plan, 3 BHK, 1750 sq.ft" },
  { src: "/projects/golden-era/plans/plan-tower-2100.jpg", label: "S+14 Tower · 3 BHK", size: "2100 sq.ft", alt: "Golden Era Homes S+14 tower floor plan, 3 BHK, 2100 sq.ft" },
  { src: "/projects/golden-era/plans/plan-floor-225.jpg", label: "S+4 Floor · 3 BHK", size: "225 sq.yd", alt: "Golden Era Homes S+4 low-rise floor plan, 3 BHK, 225 sq.yd" },
];

// Specifications — the fittings & materials named in the developer's brochure.
const brands = [
  { name: "UltraTech", use: "Cement" },
  { name: "Kamdhenu", use: "TMT steel" },
  { name: "Jaquar", use: "Bath fittings" },
  { name: "Johnson", use: "Tiles" },
  { name: "Johnson Lifts", use: "Elevators" },
  { name: "Hettich", use: "Kitchen fittings" },
  { name: "Legrand", use: "Modular switches" },
  { name: "KEI", use: "Wires & cables" },
];

// Connectivity — indicative drive times from the developer's brochure.
const connectivity = [
  { place: "Chandigarh", time: "7 min" },
  { place: "Panchkula", time: "10 min" },
  { place: "Mohali", time: "15 min" },
  { place: "Int'l Airport", time: "10 min" },
  { place: "Railway Station", time: "12 min" },
  { place: "IISER", time: "12 min" },
  { place: "Manav Mangal School", time: "2 min" },
  { place: "Hospital (Mehar/AMCare)", time: "5 min" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nexgenestates.in/" },
        { "@type": "ListItem", position: 2, name: "Projects", item: "https://nexgenestates.in/projects" },
        { "@type": "ListItem", position: 3, name: "Golden Era Homes", item: "https://nexgenestates.in/projects/golden-era-homes" },
      ],
    },
  ],
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
                {specs.filter((s) => !isPlaceholder(s.value)).map((s, i, arr) => (
                  <div key={s.label} className={`flex justify-between gap-4 ${i < arr.length - 1 ? "border-b border-[var(--color-line)] pb-3" : ""}`}>
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

      {NO_3D ? (
        /* Photos-only build: the marquee render instead of the interactive 3D */
        <Section className="section-dark">
          <Container>
            <div className="max-w-2xl" data-reveal>
              <Eyebrow>The vision</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] text-[var(--color-ivory)]">
                Twin balcony towers on a landscaped boulevard.
              </h2>
              <p className="mt-3 max-w-xl text-[#cbc3b2]">
                The Golden Era Homes cluster — architect&apos;s renders. Indicative, not a
                final elevation.
              </p>
            </div>
            <div className="relative mt-6 h-[62vh] min-h-[360px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-black/30" data-reveal>
              <Photo src="/projects/golden-era/front-elevation-night.jpg" alt="Golden Era Homes — front elevation at night" priority sizes="100vw" className="h-full w-full" />
            </div>
          </Container>
        </Section>
      ) : (
        /* 3D — auto-loads; pinned scroll-track assembles the cluster as you scroll */
        <section className="section-dark">
          <div data-scroll-track className="relative h-[260vh]">
            <div className="sticky top-0 flex h-screen flex-col justify-center py-14">
              <Container>
                <div className="max-w-2xl">
                  <Eyebrow>In 3D</Eyebrow>
                  <h2 className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] text-[var(--color-ivory)]">
                    Explore the towers — from the sky, the street, and inside a home.
                  </h2>
                  <p className="mt-3 max-w-xl text-[#cbc3b2]">
                    Scroll to watch the Golden Era Homes cluster come together — then switch to an
                    aerial view, drop to the boulevard, or step inside a furnished home. Indicative
                    concept, not a final elevation.
                  </p>
                </div>
                <div className="relative mt-6 h-[56vh] min-h-[360px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-black/30">
                  <GoldenEra3DAuto />
                </div>
              </Container>
            </div>
          </div>
        </section>
      )}

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

      {/* Floor plans */}
      <Section className="bg-sand">
        <Container>
          <Reveal>
            <Eyebrow>Floor plans</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] text-ink">
              3 BHK layouts, laid out honestly.
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Every home is a 3 BHK — both-side-open for cross ventilation, with 6-ft balconies on all
              bedrooms. Room dimensions are printed on each plan. Indicative; subject to change.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {floorPlans.map((fp, i) => (
              <Reveal key={fp.src} delay={i * 90}>
                <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
                  <div className="relative aspect-[3/4] w-full bg-white">
                    <Image
                      src={fp.src}
                      alt={fp.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-3"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3 border-t border-[var(--color-line)] px-5 py-4">
                    <span className="text-sm font-semibold text-ink">{fp.label}</span>
                    <span className="figure text-sm font-semibold text-gold">{fp.size}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Want the full floor-plan PDF for a specific tower or floor?{" "}
            <a href={whatsappHref(enquiry)} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold underline-offset-4 hover:underline">
              Ask us on WhatsApp.
            </a>
          </p>
        </Container>
      </Section>

      {/* Specifications / trusted brands */}
      <Section className="bg-ivory">
        <Container>
          <Reveal>
            <Eyebrow>Specifications</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] text-ink">
              Built with names you already trust.
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              The materials and fittings behind Golden Era Homes — the parts you don&apos;t see on a
              render, but live with every day.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((b, i) => (
              <Reveal key={b.name} delay={i * 60}>
                <div className="h-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
                  <p className="font-display text-lg leading-tight text-ink">{b.name}</p>
                  <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold">{b.use}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Connectivity */}
      <Section className="section-dark">
        <Container>
          <Reveal>
            <Eyebrow>Connectivity</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] text-[var(--color-ivory)]">
              A genuinely seamless address.
            </h2>
            <p className="mt-3 max-w-2xl on-dark-muted">
              On the 200-ft-wide PR-7 Airport Road — the Tricity&apos;s core is minutes away, with the
              airport and railway a short drive out.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {connectivity.map((c, i) => (
              <Reveal key={c.place} delay={i * 50}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                  <p className="figure font-display text-[1.7rem] leading-none text-[var(--color-gold-soft)]">{c.time}</p>
                  <p className="mt-2 text-sm text-[#efe7d7]">{c.place}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs on-dark-muted">Drive times are indicative, per the developer&apos;s brochure.</p>
        </Container>
      </Section>

      {/* Location */}
      {loc && (
        <Section className="section-dark">
          <Container>
            <Link href={`/${loc.slug}`}
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
