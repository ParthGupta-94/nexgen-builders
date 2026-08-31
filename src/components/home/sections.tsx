import Link from "next/link";
import { ArrowUpRight, MapPin, Quote, Check } from "lucide-react";
import { Container, Section, Eyebrow, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { Photo } from "@/components/ui/photo";
import { aboutImage, projectImages } from "@/data/images";
import {
  stats,
  pillars,
  testimonials,
  partners,
  site,
  whatsappHref,
} from "@/data/site";
import { locations } from "@/data/locations";
import { projects } from "@/data/projects";
import { VillaExplore } from "@/components/home/villa-explore";

/* ---------------- Stats strip ---------------- */
export function StatsStrip() {
  return (
    <div className="border-y border-[var(--color-line)] bg-[var(--color-paper)]">
      <Container>
        <dl className="grid grid-cols-2 divide-x divide-[var(--color-line)] md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-8 text-center ${i >= 2 ? "border-t border-[var(--color-line)] md:border-t-0" : ""}`}
            >
              <dd className="font-display text-4xl text-ink sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}

/* ---------------- About teaser ---------------- */
export function AboutTeaser() {
  return (
    <Section className="bg-ivory">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left">
          <Photo
            src={aboutImage}
            alt="A NexGen home"
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="aspect-4/5 w-full rounded-2xl"
          />
        </Reveal>
        <Reveal delay={120}>
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-ink">
              From boardrooms to building the region&apos;s future.
            </h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted">
              <p>
                Sanjeev Bhagta spent years inside companies like ICICI
                Prudential, TATA and IBM before founding an IT firm and running
                government skill-development programs. In 2016 he brought that
                same discipline into real estate.
              </p>
              <p>
                Ten years and 300+ deals later — from a 40-acre land bank to
                150 bighas in Himachal — NexGen is growing from trusted advisor
                into a builder shaping the Tricity&apos;s next chapter.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/about" variant="outline">
                Read the full story <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------------- Why NexGen (pillars) ---------------- */
export function WhyNexgen() {
  return (
    <Section className="section-dark">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Why NexGen</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-[var(--color-ivory)]">
            Two dealers can show you the same flat. Only one fights for you.
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="h-full bg-[var(--color-espresso)] p-8 sm:p-10">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-gold-soft)]/40 text-sm font-semibold text-[var(--color-gold-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-display text-xl text-[var(--color-ivory)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed on-dark-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- 3D villa showcase (opt-in) ---------------- */
export function Showcase3D() {
  return (
    <Section id="showcase" className="bg-sand">
      <Container>
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <div className="flex justify-center">
            <Eyebrow>Built to last</Eyebrow>
          </div>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-ink">
            Homes designed for the next generation.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            A NexGen home in 3D — tap to explore it and step inside. The way we
            judge a home: the build, the location, the long-term value.
          </p>
        </div>

        <div
          data-reveal
          className="relative mx-auto mt-8 h-[58vh] min-h-[380px] w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--color-line)] shadow-xl shadow-black/5"
        >
          <VillaExplore />
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- Featured projects ---------------- */
export function FeaturedProjects() {
  return (
    <Section className="bg-ivory">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>Live projects</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-ink">
              Addresses we&apos;re proud to open doors to.
            </h2>
          </div>
          <Button href="/projects" variant="ghost">
            All projects <ArrowUpRight size={16} />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-gold-soft)]/60 hover:shadow-xl hover:shadow-black/5"
              >
                <Photo
                  src={projectImages[p.slug]}
                  alt={p.name}
                  overlay
                  className="aspect-[4/3] w-full"
                >
                  <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    {p.status}
                  </span>
                </Photo>
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

          {/* CTA card */}
          <Reveal delay={180}>
            <a
              href={whatsappHref("Hi NexGen, I'd like to see what's available in my budget.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-56 flex-col justify-between rounded-2xl bg-[var(--color-ink)] p-7 text-[var(--color-ivory)] transition-transform duration-500 hover:-translate-y-1"
            >
              <p className="font-display text-2xl leading-snug">
                Looking for something specific?
              </p>
              <p className="text-sm on-dark-muted">
                Tell us your budget and area on WhatsApp — we&apos;ll send you
                matches, usually within minutes.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-gold-soft)]">
                Message us <ArrowUpRight size={15} />
              </span>
            </a>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- Locations ---------------- */
export function Locations() {
  return (
    <Section className="bg-sand">
      <Container>
        <div className="max-w-xl">
          <Eyebrow>Areas we cover</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-ink">
            Rooted in Zirakpur. Trusted across the region.
          </h2>
          <p className="mt-4 text-muted">
            From the PR-7 Airport Road corridor to the Himachal hills — the
            markets we know street by street.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l, i) => (
            <Reveal key={l.slug} delay={(i % 3) * 80}>
              <Link
                href={`/locations/${l.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold-soft)]/60"
              >
                <MapPin className="mt-0.5 shrink-0 text-gold" size={20} />
                <div className="flex-1">
                  <h3 className="font-display text-lg text-ink">{l.name}</h3>
                  <p className="mt-1 text-sm text-muted">{l.tagline}</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="mt-1 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
                />
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/locations" variant="outline">
            See all areas we cover <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- Testimonial ---------------- */
export function Testimonial() {
  const t = testimonials[0];
  return (
    <Section className="bg-ivory">
      <Container className="max-w-4xl text-center">
        <Reveal>
          <Quote className="mx-auto text-[var(--color-gold-soft)]" size={40} />
          <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2.3rem)] font-medium leading-snug text-ink">
            “{t.quote}”
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="gold-rule" />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {t.author} · {t.detail}
            </p>
            <span className="gold-rule rotate-180" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------------- Partners strip ---------------- */
export function Partners() {
  return (
    <div className="border-y border-[var(--color-line)] bg-[var(--color-paper)] py-10">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Trusted alongside the region&apos;s leading developers
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {partners.map((name) => (
            <span
              key={name}
              className="font-display text-base text-ink/55 sm:text-lg"
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* ---------------- Final CTA ---------------- */
export function FinalCta() {
  return (
    <Section className="section-dark">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#241d13] to-[var(--color-espresso)] px-8 py-16 text-center sm:px-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-[var(--color-ivory)]">
              Your next address starts with a message.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.02rem] on-dark-muted">
              Tell us what you&apos;re looking for. No pressure, no jargon —
              just honest advice from someone who knows the market, and usually
              replies within minutes.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${site.contact.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
              >
                Call {site.contact.phone}
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm on-dark-muted">
              {["Builder credibility checked", "Best-price negotiation", "Promises kept"].map(
                (x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Check size={15} className="text-[var(--color-gold-soft)]" /> {x}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
