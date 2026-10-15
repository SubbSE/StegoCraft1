import { codePoint, HOMOGLYPHS, INVISIBLE_NAMES, ZERO_WIDTH } from '../../lib/textStego';

const ZW_STYLE = ['bg-accent', 'bg-secret', 'bg-warn', 'bg-danger'];
const ZW_BITS = ['00', '01', '10', '11'];
const CYRILLIC_LOOKALIKES = new Set(Object.values(HOMOGLYPHS));

export function XRayLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
      {ZW_BITS.map((b, i) => (
        <span key={b} className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-3.5 w-1.5 rounded-sm ${ZW_STYLE[i]}`} /> {b}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded bg-warn/25 px-1 text-ink">a</span> look-alike letter
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded bg-accent/15 px-1 font-mono text-accent">·→</span> trailing space / tab
      </span>
    </div>
  );
}

/** Renders text with every hidden character made visible. */
export default function TextXRay({ text, limit = 3000 }) {
  const out = [];
  let budget = limit;
  const lines = text.split(/(\r?\n)/);
  lines.forEach((line, li) => {
    if (budget <= 0) return;
    if (line === '\n' || line === '\r\n') {
      out.push(<br key={`br${li}`} />);
      return;
    }
    const m = line.match(/^(.*?)([ \t]*)$/s);
    const body = m[1];
    const trail = m[2];
    let ci = 0;
    for (const ch of body) {
      if (budget-- <= 0) break;
      const key = `${li}-${ci++}`;
      const zw = ZERO_WIDTH.indexOf(ch);
      if (zw >= 0) {
        out.push(<span key={key} title={`${codePoint(ch)} ${INVISIBLE_NAMES[ch]} = ${ZW_BITS[zw]}`} className={`mx-px inline-block h-[1.1em] w-1 translate-y-[0.15em] rounded-sm ${ZW_STYLE[zw]}`} />);
      } else if (ch in INVISIBLE_NAMES) {
        out.push(
          <span key={key} title={`${codePoint(ch)} ${INVISIBLE_NAMES[ch]}`} className="mx-px rounded bg-danger/15 px-0.5 font-mono text-[0.7em] text-danger">
            {codePoint(ch)}
          </span>,
        );
      } else if (CYRILLIC_LOOKALIKES.has(ch)) {
        out.push(
          <mark key={key} title={`${codePoint(ch)} (Cyrillic look-alike)`} className="rounded bg-warn/25 text-ink">
            {ch}
          </mark>,
        );
      } else {
        out.push(ch);
      }
    }
    if (trail) {
      out.push(
        <span key={`t${li}`} className="rounded bg-accent/15 font-mono text-accent" title={`${trail.length} trailing whitespace characters`}>
          {[...trail].map((c) => (c === '\t' ? '→' : '·')).join('')}
        </span>,
      );
    }
  });
  return (
    <div className="max-h-80 overflow-auto rounded-xl border border-line bg-surface-2/50 p-4 text-[0.95rem] leading-relaxed break-words whitespace-pre-wrap text-ink">
      {out}
      {budget <= 0 && <span className="text-muted"> …(truncated)</span>}
    </div>
  );
}
