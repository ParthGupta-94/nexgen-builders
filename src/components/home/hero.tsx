import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/data/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background placeholder well — swap for a hero photograph of a signature project */}
      <div className="photo-well absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-[var(--color-espresso)]" />

      <Container className="flex min-h-[92vh] flex-col justify-center pb-20 pt-36 sm:pt-40">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="gold-rule" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
              PR-7 Airport Road · Zirakpur · Tricity
            </span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[1.03] text-white">
            Property, chosen the way
            <br />
            you&apos;d choose it for
            <span className="text-[var(--color-gold-soft)]"> family.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
            A home is built for the generations that come after us — the most
            crucial decision a family makes. For 10 years and 300+ deals,
            NexGen has helped buyers make it knowledgeably, and honestly.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              Talk to {site.contact.owner.split(" ")[0]} on WhatsApp
            </a>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
            >
              View live projects
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-2.5 text-sm text-white/70">
            <ShieldCheck size={18} className="text-[var(--color-gold-soft)]" />
            We verify every builder&apos;s credibility before you commit.
          </div>
        </div>
      </Container>
    </section>
  );
}
