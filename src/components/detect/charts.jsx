/** Probability-of-hidden-data curve from chiSquareCurve(). `shade` (0–1) marks a known message region. */
export function ChiCurve({ curve, shade = 0 }) {
  const w = 300;
  const h = 120;
  const pts = curve.map((c) => `${(c.fraction * w).toFixed(1)},${(h - 12 - c.p * (h - 24)).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Probability of hidden data across the image">
      {shade > 0 && <rect x="0" y="0" width={shade * w} height={h - 12} fill="var(--color-warn)" opacity="0.12" />}
      <line x1="0" y1="12" x2={w} y2="12" stroke="var(--color-line)" strokeDasharray="4 4" />
      <line x1="0" y1={h - 12} x2={w} y2={h - 12} stroke="var(--color-line-strong)" />
      <polyline points={pts} fill="none" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="4" y="10" fontSize="9" fill="var(--color-muted)">
        100%
      </text>
      <text x="4" y={h - 15} fontSize="9" fill="var(--color-muted)">
        0%
      </text>
      <text x={w} y={h - 1} fontSize="9" textAnchor="end" fill="var(--color-muted)">
        whole image →
      </text>
    </svg>
  );
}

const CHANNEL_COLOURS = ['#e5484d', '#30a46c', '#3e63dd'];

/** Line histogram of the red, green and blue channels. */
export function HistogramChart({ hists }) {
  const w = 512;
  const h = 140;
  const max = Math.max(1, ...hists.flatMap((hh) => Array.from(hh)));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Histogram of red, green and blue values">
      <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="var(--color-line-strong)" />
      {hists.map((hist, c) => (
        <polyline
          key={c}
          points={Array.from(hist, (v, i) => `${i * 2},${(h - 2 - (v / max) * (h - 8)).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={CHANNEL_COLOURS[c]}
          strokeWidth="1.3"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}
