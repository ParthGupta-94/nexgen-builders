import type { ReactNode } from "react";

/**
 * Reveal-on-scroll marker. Renders a `data-reveal` element that the global
 * Motion system (components/site/motion.tsx) animates on enter. No client JS
 * here — hiding is CSS (`.js [data-reveal]`) so there is no hydration cost.
 */
export function Reveal({
  children,
  variant = "up",
  as: Tag = "div",
  className = "",
  // `delay` is accepted for call-site compatibility; staggering is handled by
  // the Motion system (data-reveal-batch) rather than per-item delays.
  delay: _delay,
}: {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  as?: "div" | "li" | "span";
  className?: string;
  delay?: number;
}) {
  void _delay;
  const Comp = Tag as "div";
  return (
    <Comp data-reveal={variant} className={className}>
      {children}
    </Comp>
  );
}
