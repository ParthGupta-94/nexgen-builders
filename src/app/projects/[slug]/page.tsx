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
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { projectImages, galleryImages, projectGallery } from "@/data/images";
import { Gallery } from "@/components/site/gallery";
import { projects, getProject } from "@/data/projects";
import { getLocation } from "@/data/locations";
import { site, whatsappHref, isPlaceholder } from "@/data/site";

export function generateStaticParams() {
  // golden-era-homes has its own bespoke page at /projects/golden-era-homes
  return projects.filter((p) => p.slug !== "golden-era-homes").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    keywords: p.keywords,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      type: "website",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const loc = getLocation(p.locationSlug);
  const others = projects.filter((x) => x.slug !== p.slug);
  const enquiry = `Hi NexGen, I'd like details, pricing and availability for ${p.name} (${p.tagline}).`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Residence",
        name: p.name,
        description: p.metaDescription,
        address: {
          "@type": "PostalAddress",
          addressLocality: p.locationName,
          addressRegion: site.address.state,
          addressCountry: "IN",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faqs.map((f) => ({
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

      {/* Hero */}
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
            <Link href="/projects" className="hover:text-[var(--color-gold-soft)]">
              Projects
            </Link>
            <span>/</span>
            <span className="text-[var(--color-gold-soft)]">{p.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-gold)]/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white">
              {p.status}
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-[#efe7d7]">
              {p.type}
            </span>
          </div>

          <h1
            data-split
            className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5.2vw,3.8rem)] leading-[1.04] text-[var(--color-ivory)]"
          >
            {p.name}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm on-dark-muted">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-[var(--color-gold-soft)]" /> {p.tagline}
            </span>
            {!isPlaceholder(p.developer) && (
              <span className="flex items-center gap-1.5">
                <Building2 size={15} className="text-[var(--color-gold-soft)]" /> {p.developer}
              </span>
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappHref(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              Get pricing &amp; availability
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

      {/* Gallery */}
      <div className="bg-ivory">
        <Container className="py-8">
          {projectGallery[p.slug]?.length ? (
            <>
              <Gallery images={projectGallery[p.slug]} />
              <p className="mt-3 text-center text-xs text-muted">
                Developer&apos;s renders. Tap any image to view it full-screen.
              </p>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Photo
                  src={projectImages[p.slug] ?? galleryImages[0]}
                  alt={`${p.name} — exterior`}
                  priority
                  sizes="(max-width: 640px) 100vw, 66vw"
                  className="aspect-[4/3] rounded-2xl sm:col-span-2 sm:aspect-[16/9]"
                />
                <div className="grid grid-rows-2 gap-4">
                  <Photo src={galleryImages[0]} alt={`${p.name} — interior`} className="rounded-2xl" />
                  <Photo src={galleryImages[1]} alt={`${p.name} — interior`} className="rounded-2xl" />
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted">
                Project photography coming soon — ask us for the latest images and
                walkthrough on WhatsApp.
              </p>
            </>
          )}
        </Container>
      </div>

      {/* Intro + sidebar */}
      <Section className="bg-ivory">
        <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <Eyebrow>About {p.name}</Eyebrow>
              <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted">
                {p.intro.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--color-gold-soft)]/40 bg-[var(--color-gold-tint)] p-5">
                <ShieldCheck className="mt-0.5 shrink-0 text-gold" size={20} />
                <p className="text-sm leading-relaxed text-ink">
                  Before you commit, we verify the builder&apos;s credibility and
                  track record — the single biggest mistake we save buyers from.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                At a glance
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
                  <dt className="text-muted">Location</dt>
                  <dd className="text-right font-medium text-ink">{p.tagline}</dd>
                </div>
                {!isPlaceholder(p.developer) && (
                  <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
                    <dt className="text-muted">Developer</dt>
                    <dd className="text-right font-medium text-ink">{p.developer}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
                  <dt className="text-muted">Type</dt>
                  <dd className="text-right font-medium text-ink">{p.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Status</dt>
                  <dd className="text-right font-medium text-ink">{p.status}</dd>
                </div>
              </dl>

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Configurations
              </h3>
              <ul className="mt-4 space-y-2.5">
                {p.configs.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    {c}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappHref(enquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-gold)]"
              >
                <MessageCircle size={16} /> Ask about {p.name}
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Highlights */}
      <Section className="bg-sand">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {p.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
                  <MapPin className="text-gold" size={22} />
                  <h3 className="mt-4 font-display text-lg text-ink">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Link to the area page */}
          {loc && (
            <Reveal>
              <Link
                href={`/locations/${loc.slug}`}
                className="group mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7 transition-colors hover:border-[var(--color-gold-soft)]/60"
              >
                <div className="flex items-center gap-4">
                  <MapPin className="text-gold" size={24} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      The area
                    </p>
                    <p className="mt-1 font-display text-lg text-ink">
                      Everything about buying in {loc.name}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-gold">
                  Read the area guide
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-ivory">
        <Container className="max-w-3xl">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.5rem)] text-ink">
            {p.name} — your questions, answered.
          </h2>
          <div className="mt-10 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {p.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
                  {f.q}
                  <span className="shrink-0 text-2xl leading-none text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Other projects */}
      <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)] py-14">
        <Container>
          <h2 className="font-display text-xl text-ink">More projects</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => (
              <Link
                key={x.slug}
                href={`/projects/${x.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-ivory)] px-5 py-4 transition-colors hover:border-[var(--color-gold-soft)]/60"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gold" />
                  <span>
                    <span className="block font-medium text-ink">{x.name}</span>
                    <span className="block text-xs text-muted">{x.tagline}</span>
                  </span>
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
