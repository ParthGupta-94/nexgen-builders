import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Check,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { locations, getLocation } from "@/data/locations";
import { site, whatsappHref } from "@/data/site";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    keywords: loc.keywords,
    alternates: { canonical: `/locations/${loc.slug}` },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      type: "website",
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const areaProjects = projects.filter((p) => p.locationSlug === loc.slug);
  const others = locations.filter((l) => l.slug !== loc.slug);

  // FAQPage + RealEstateAgent structured data for rich results in this area.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: `${site.name} — ${loc.name}`,
        description: loc.metaDescription,
        telephone: site.contact.phone,
        areaServed: loc.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.line1}, ${site.address.line2}`,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.pin,
          addressCountry: "IN",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: loc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero header */}
      <section className="section-dark relative overflow-hidden">
        <div
          aria-hidden
          data-parallax="0.22"
          className="pointer-events-none absolute -right-24 -top-40 h-[65vh] w-[65vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,74,0.16), rgba(201,162,74,0) 62%)",
          }}
        />
        <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] on-dark-muted">
            <Link href="/locations" className="hover:text-[var(--color-gold-soft)]">
              Areas
            </Link>
            <span>/</span>
            <span className="text-[var(--color-gold-soft)]">{loc.name}</span>
          </nav>

          <div className="mt-6 flex items-center gap-3">
            <span className="gold-rule" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
              {loc.tagline} · {loc.region}
            </span>
          </div>

          <h1
            data-split
            className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5.2vw,3.8rem)] leading-[1.04] text-[var(--color-ivory)]"
          >
            Property in {loc.name}, with an advisor who knows it street by street.
          </h1>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappHref(`Hi NexGen, I'm looking for property in ${loc.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              Enquire about {loc.shortName}
            </a>
            <a
              href={`tel:${site.contact.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
            >
              <Phone size={16} /> {site.contact.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* Intro + buyer's-own-words chips */}
      <Section className="bg-ivory">
        <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <Eyebrow>Why {loc.shortName}</Eyebrow>
              <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted">
                {loc.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                What buyers ask for here
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {loc.nearby.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-[var(--color-line)] bg-sand px-3.5 py-1.5 text-sm text-ink"
                  >
                    Near {n}
                  </span>
                ))}
              </div>

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                What&apos;s available
              </h3>
              <ul className="mt-4 space-y-2.5">
                {loc.configs.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Highlights */}
      <Section className="bg-sand">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {loc.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
                  <MapPin className="text-gold" size={22} />
                  <h3 className="mt-4 font-display text-lg text-ink">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Projects in this area */}
      {areaProjects.length > 0 && (
        <Section className="bg-ivory">
          <Container>
            <Eyebrow>Live in {loc.shortName}</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] text-ink">
              Projects we&apos;re opening doors to here.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areaProjects.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 80}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-gold-soft)]/60 hover:shadow-xl hover:shadow-black/5"
                  >
                    <div className="photo-well aspect-[4/3] w-full" />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold">
                        <MapPin size={12} /> {p.tagline}
                      </p>
                      <h3 className="mt-2 font-display text-xl text-ink">{p.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {p.intro[0].slice(0, 120)}…
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-gold">
                        View project <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      <Section className="bg-ivory">
        <Container className="max-w-3xl">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] text-ink">
            {loc.shortName} property questions, answered honestly.
          </h2>
          <div className="mt-10 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {loc.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
                  {f.q}
                  <span className="shrink-0 text-2xl leading-none text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Local CTA */}
      <Section className="section-dark">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#241d13] to-[var(--color-espresso)] px-8 py-14 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-tight text-[var(--color-ivory)]">
              Ready to look at {loc.name}?
            </h2>
            <p className="mx-auto mt-4 max-w-lg on-dark-muted">
              Send us your budget and what you need. We&apos;ll verify the
              builder, negotiate the price, and only show you what&apos;s worth
              your time.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={whatsappHref(`Hi NexGen, I'm interested in property in ${loc.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                <MessageCircle size={17} /> WhatsApp us about {loc.shortName}
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Internal links to other areas */}
      <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)] py-14">
        <Container>
          <h2 className="font-display text-xl text-ink">Other areas we cover</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((l) => (
              <Link
                key={l.slug}
                href={`/locations/${l.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-ivory)] px-5 py-4 transition-colors hover:border-[var(--color-gold-soft)]/60"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gold" />
                  <span className="font-medium text-ink">Property in {l.name}</span>
                </span>
                <ArrowRight
                  size={16}
                  className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
                />
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
