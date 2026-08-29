import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  className = "",
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="gold-rule" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

type ButtonProps = {
  variant?: "gold" | "outline" | "ghost" | "dark";
  className?: string;
} & ComponentProps<typeof Link>;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 [--tw-ease:var(--ease-out-soft)]";

const variants: Record<string, string> = {
  gold: "btn-magnetic bg-[var(--color-gold)] text-white hover:bg-[var(--color-ink)] hover:shadow-lg hover:shadow-black/10",
  dark: "btn-magnetic bg-[var(--color-ink)] text-[var(--color-ivory)] hover:bg-[var(--color-gold)]",
  outline:
    "border border-[var(--color-ink)]/25 text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]",
  ghost:
    "text-[var(--color-ink)] hover:text-[var(--color-gold)] px-2 py-1 rounded-none",
};

export function Button({
  variant = "gold",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
