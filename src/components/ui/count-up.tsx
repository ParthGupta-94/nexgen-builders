/**
 * Count-up number. For a plain integer it renders a `data-count` span that the
 * global Motion system animates from 0 on enter; the final value is rendered as
 * text so it's correct with no JS / for crawlers. Non-numeric values (e.g.
 * "₹1–10") render statically.
 */
export function CountUp({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const isNumeric = /^\d+$/.test(value);

  if (!isNumeric) {
    return (
      <span className="figure">
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span className="figure" data-count data-count-to={value} data-count-suffix={suffix}>
      {value}
      {suffix}
    </span>
  );
}
