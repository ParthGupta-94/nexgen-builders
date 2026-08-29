import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  Quote,
  Check,
} from "lucide-react";
import { Container, Section, Eyebrow, Button } from "@/components/ui/primitives";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import {
  site,
  stats,
  pillars,
  journey,
  milestones,
  partners,
  testimonials,
  whatsappHref,
} from "@/data/site";

export const metadata: Metadata = {
  title: "About — Our Story, from Corporate to Builder",
  description:
    "The story of NexGen Builders & Promoters and founder Sanjeev Bhagta — from a corporate career and an IT company to 300+ real-estate deals and a builder shaping Zirakpur and the Tricity. Credibility, negotiation, promises kept.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <PageHeader eyebrow="Our story" title="Built on credibility, not billboards.">
        <p className="mt-6 max-w-2xl text-lg leading-relaxed on-dark-muted">
          {site.ethos}
        </p>
      </PageHeader>

      {/* Intro + name meaning */}
      <Section className="bg-ivory">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="photo-well aspect-4/5 w-full rounded-2xl" />
          </Reveal>
          <Reveal delay={120}>
            <div>
              <Eyebrow>Why &ldquo;NexGen&rdquo;</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink">
                A home is built for the next generation.
              </h2>
              <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-muted">
                <p>
                  Everyone builds property for the generations that come after
                  them. It&apos;s the most important, most difficult and most
                  crucial decision a family makes — so it should be taken
                  seriously, and knowledgeably. That belief is the whole reason
                  the name is <strong className="text-ink">NexGen</strong>.
                </p>
                <p>
                  It&apos;s also why we do the homework most buyers skip:
                  verifying the builder, reading the market honestly, and
                  negotiating hard — so your decision is a sound one, not a
                  gamble.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Stats */}
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

      {/* Journey timeline */}
      <Section className="bg-ivory">
        <Container>
          <div className="max-w-xl">
            <Eyebrow>The journey</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink">
              From boardrooms to building.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-0 md:grid-cols-[auto_1fr]">
            <ol className="relative md:col-start-2">
              {journey.map((j, i) => (
                <Reveal key={j.year} as="li" delay={i * 70}>
                  <div className="relative border-l-2 border-[var(--color-line)] pb-10 pl-8 last:pb-0">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-ivory)]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {j.year}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl text-ink">{j.title}</h3>
                    <p className="mt-2 max-w-xl text-[0.98rem] leading-relaxed text-muted">
                      {j.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* Milestones */}
      <Section className="bg-sand">
        <Container>
          <div className="max-w-xl">
            <Eyebrow>Proud moments</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink">
              Deals that show what we&apos;re about.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {milestones.map((m, i) => (
              <Reveal key={m.label} delay={i * 80}>
                <div className="h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
                  <Award className="text-gold" size={24} />
                  <p className="mt-4 font-display text-lg text-ink">{m.label}</p>
                  <p className="mt-1 text-sm text-muted">{m.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Principles (reuse pillars) */}
      <Section id="principles" className="section-dark scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>What we stand for</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-[var(--color-ivory)]">
              The four things we never compromise on.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="h-full bg-[var(--color-espresso)] p-8 sm:p-10">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-gold-soft)]/40 text-sm font-semibold text-[var(--color-gold-soft)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-5 font-display text-xl text-[var(--color-ivory)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed on-dark-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Founder + testimonial */}
      <Section className="bg-ivory">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8 sm:p-10">
              <div className="photo-well h-20 w-20 rounded-full" />
              <h3 className="mt-5 font-display text-2xl text-ink">
                {site.contact.owner}
              </h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-gold">
                {site.contact.role}
              </p>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
                &ldquo;When we commit to something, it happens. I&apos;d rather
                lose a deal than break a promise — that&apos;s how you build a
                name that lasts for the next generation.&rdquo;
              </p>
              <div className="mt-7">
                <Button href="/contact" variant="gold">
                  Talk to {site.contact.owner.split(" ")[0]} <ArrowUpRight size={16} />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-center">
              <Quote className="text-[var(--color-gold-soft)]" size={40} />
              <blockquote className="mt-5 font-display text-[clamp(1.4rem,3vw,2rem)] font-medium leading-snug text-ink">
                &ldquo;{testimonials[0].quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {testimonials[0].author} · {testimonials[0].detail}
              </p>

              <ul className="mt-8 space-y-2.5">
                {["10 years, 300+ deals", "Builders verified before you commit", "Best-price negotiation, every time"].map(
                  (x) => (
                    <li key={x} className="flex items-center gap-2.5 text-sm text-ink">
                      <Check size={16} className="text-gold" /> {x}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Partners */}
      <div className="border-y border-[var(--color-line)] bg-[var(--color-paper)] py-12">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Trusted alongside the region&apos;s leading developers
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {partners.map((name) => (
              <span key={name} className="font-display text-base text-ink/55 sm:text-lg">
                {name}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA */}
      <Section className="section-dark">
        <Container className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-tight text-[var(--color-ivory)]">
            Let&apos;s find your next address.
          </h2>
          <p className="mx-auto mt-4 max-w-lg on-dark-muted">
            Ten years of honest advice is one message away. Tell us what
            you&apos;re looking for.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={whatsappHref()} variant="gold">
              WhatsApp us
            </Button>
            <Button href="/projects" variant="outline">
              See our projects <ArrowUpRight size={16} />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
