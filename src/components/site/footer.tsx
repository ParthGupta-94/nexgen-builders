import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { nav, site, whatsappHref, isPlaceholder } from "@/data/site";
import { Container } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer className="section-dark">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-tight text-[var(--color-ivory)]">
                NEX<span className="text-[var(--color-gold-soft)]">GEN</span>
              </span>
              <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.28em] on-dark-muted">
                Builders &amp; Promoters
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed on-dark-muted">
              {site.ethos}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
              {site.foundedNote}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]">
              Explore
            </h4>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#efe7d7]/85 transition-colors hover:text-[var(--color-gold-soft)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]">
              Reach us
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-[#efe7d7]/90">
              <li className="flex gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]" />
                <span>
                  {site.address.line1}, {site.address.line2}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.pin}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]" />
                <a href={`tel:${site.contact.phoneRaw}`} className="hover:text-[var(--color-gold-soft)]">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-[var(--color-gold-soft)]">
                  {site.contact.email}
                </a>
              </li>
            </ul>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs on-dark-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            {site.contact.owner}, {site.contact.role}
            {!isPlaceholder(site.rera) && <> · RERA {site.rera}</>}
          </p>
        </div>
      </Container>
    </footer>
  );
}
