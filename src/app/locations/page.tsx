import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container, Section, Button } from "@/components/ui/primitives";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Photo } from "@/components/ui/photo";
import { locationImages } from "@/data/images";
import { locations } from "@/data/locations";
import { site, whatsappHref } from "@/data/site";

export const metadata: Metadata = {
  title: "Areas We Cover — Zirakpur, Mohali, Panchkula & Himachal",
  description:
    "NexGen Builders & Promoters covers Zirakpur, PR-7 Airport Road, Greater Mohali, Panchkula, Derabassi and the Himachal hills. Find a trusted property dealer in your area.",
  alternates: { canonical: "/locations" },
};

export default function LocationsHub() {
  return (
    <>
      {/* Page header */}
      <PageHeader eyebrow="Areas we cover" title="Rooted in Zirakpur. Trusted across the region.">
        <p className="mt-6 max-w-xl text-lg leading-relaxed on-dark-muted">
          From the PR-7 Airport Road corridor to the Himachal hills, these are
          the markets we know street by street — pick your area to see what we
          do there.
        </p>
      </PageHeader>

      <Section className="bg-ivory">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l, i) => (
              <Reveal key={l.slug} delay={(i % 3) * 80}>
                <Link
                  href={`/locations/${l.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-gold-soft)]/60 hover:shadow-xl hover:shadow-black/5"
                >
                  <Photo
                    src={locationImages[l.slug]}
                    alt={l.name}
                    overlay
                    className="aspect-[16/10] w-full"
                  >
                    <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      <MapPin size={11} /> {l.region}
                    </span>
                  </Photo>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold">
                      {l.tagline}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-ink">{l.name}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {l.intro[0].slice(0, 130)}…
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-gold">
                      Explore {l.shortName} <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl bg-sand px-6 py-12 text-center">
            <h3 className="max-w-xl font-display text-2xl text-ink sm:text-3xl">
              Don&apos;t see your area? We probably still cover it.
            </h3>
            <p className="max-w-lg text-muted">
              Our network across the Tricity, Chandigarh and Himachal runs wider
              than this list. Tell us where you&apos;re looking — {site.contact.owner.split(" ")[0]} usually replies within minutes.
            </p>
            <Button href={whatsappHref("Hi NexGen, do you cover property in my area?")} variant="gold">
              Ask us on WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
