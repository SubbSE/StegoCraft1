import { useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { TextInput } from '../components/ui/controls';
import { toBinary, toHex, utf8Encode } from '../lib/bytes';
import { codePoint } from '../lib/textStego';

const PRESETS = ['Hi!', 'নমস্কার', 'नमस्ते', '你好', 'مرحبا', 'Ñandú', '👋🏽'];
const BYTE_TONE = { 1: 'text-accent', 2: 'text-secret', 3: 'text-warn', 4: 'text-danger' };

function graphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map((s) => s.segment);
  }
  return Array.from(text);
}

export default function TextToBits() {
  const [text, setText] = useState('Hi! নমস্কার');
  const groups = useMemo(() => graphemes(text).slice(0, 24), [text]);
  const total = utf8Encode(text).length;

  return (
    <Figure
      title="Text to bits"
      caption="Each box is one character as you see it. Inside: its Unicode code points and the UTF-8 bytes that store them. English letters need one byte; many other scripts need two or three; emoji need four."
    >
      <TextInput value={text} onChange={(e) => setText(e.target.value)} aria-label="Text to convert" maxLength={60} />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button key={p} type="button" onClick={() => setText(p)} className="rounded-lg border border-line bg-surface-2 px-2 py-0.5 text-sm text-muted hover:text-ink">
            {p}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {groups.map((g, i) => {
          const points = Array.from(g);
          return (
            <div key={i} className="min-w-[5.5rem] rounded-xl border border-line bg-surface-2/60 p-2.5">
              <div className="text-center text-2xl leading-tight text-ink">{g === ' ' ? '␣' : g}</div>
              <div className="mt-2 space-y-1.5">
                {points.map((cp, j) => {
                  const bytes = utf8Encode(cp);
                  return (
                    <div key={j} className="rounded-lg bg-surface px-2 py-1">
                      <div className="flex items-center justify-between gap-2 font-mono text-[0.68rem] text-muted">
                        <span>{codePoint(cp)}</span>
                        <span className={`font-semibold ${BYTE_TONE[bytes.length]}`}>{bytes.length}B</span>
                      </div>
                      {[...bytes].map((b, k) => (
                        <div key={k} className="font-mono text-[0.72rem] leading-snug text-ink">
                          <span className="text-subtle">{toHex(b)} </span>
                          {toBinary(b)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl bg-surface-2 px-4 py-3 text-sm">
        <span>
          <strong className="text-ink">{Array.from(text).length}</strong> <span className="text-muted">code points</span>
        </span>
        <span>
          <strong className="text-ink">{total}</strong> <span className="text-muted">bytes</span>
        </span>
        <span>
          <strong className="text-secret">{total * 8}</strong> <span className="text-muted">bits to hide</span>
        </span>
      </div>
    </Figure>
  );
}
