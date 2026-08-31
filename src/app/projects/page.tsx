import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Building2 } from "lucide-react";
import { Container, Section, Button } from "@/components/ui/primitives";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { projectImages } from "@/data/images";
import { projects } from "@/data/projects";
import { partners, site, whatsappHref, isPlaceholder } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects — Flats, Villas & Homes in Zirakpur & Tricity",
  description:
    "Explore the residential projects NexGen Builders & Promoters is marketing across Zirakpur, Airport Road, Derabassi and the Tricity — Golden Era Homes, Vintage Greens, Belgravia, Vaneet Infra and Velora. Verified builders, honest pricing.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Live projects" title="Addresses we're proud to open doors to.">
        <p className="mt-6 max-w-xl text-lg leading-relaxed on-dark-muted">
          A selection of the residential projects we&apos;re marketing right now
          across Zirakpur, Airport Road, Derabassi and beyond. For every one, we
          verify the builder and negotiate hard on your behalf.
        </p>
      </PageHeader>

      <Section className="bg-ivory">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
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
                    <span className="absolute right-4 top-4 rounded-full bg-[var(--color-gold)]/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      {p.type}
                    </span>
                  </Photo>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold">
                      <MapPin size={12} /> {p.tagline}
                    </p>
                    <h2 className="mt-2 font-display text-xl text-ink">{p.name}</h2>
                    {!isPlaceholder(p.developer) && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                        <Building2 size={12} /> {p.developer}
                      </p>
                    )}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
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

      {/* Partners / developers strip */}
      <div className="border-y border-[var(--color-line)] bg-[var(--color-paper)] py-12">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Developers we&apos;ve worked with
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

      <Section className="section-dark">
        <Container className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-tight text-[var(--color-ivory)]">
            Looking for something not listed here?
          </h2>
          <p className="mx-auto mt-4 max-w-lg on-dark-muted">
            We have access to far more than we can put on one page. Tell us your
            budget and area, and we&apos;ll send you matches — usually within
            minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              href={whatsappHref("Hi NexGen, I'd like to see projects that fit my budget.")}
              variant="gold"
            >
              Tell us what you need
            </Button>
            <Button href="/locations" variant="outline">
              Browse by area <ArrowUpRight size={16} />
            </Button>
          </div>
          <p className="mt-6 text-sm on-dark-muted">
            Or call {site.contact.owner.split(" ")[0]} on{" "}
            <a href={`tel:${site.contact.phoneRaw}`} className="text-[var(--color-gold-soft)]">
              {site.contact.phone}
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
