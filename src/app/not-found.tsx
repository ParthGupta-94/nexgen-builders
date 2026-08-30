import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { whatsappHref } from "@/data/site";

export default function NotFound() {
  return (
    <section className="section-dark flex min-h-[80vh] items-center">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
          Page not found
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-tight text-[var(--color-ivory)]">
          This address doesn&apos;t exist — but your next one might.
        </h1>
        <p className="mx-auto mt-5 max-w-md on-dark-muted">
          The page you were looking for has moved or was never here. Let&apos;s
          get you back on track.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
          >
            Back to home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
          >
            View projects
          </Link>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold-soft)]"
          >
            WhatsApp us
          </a>
        </div>
      </Container>
    </section>
  );
}
