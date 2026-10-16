import { useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { TextInput, Toggle } from '../components/ui/controls';
import { bitsToBytes, bytesToBits } from '../lib/bytes';
import { codePoint, hideHomoglyphs, HOMOGLYPHS, homoglyphCapacity, revealHomoglyphs } from '../lib/textStego';

// In the caption below, the second letter of each pair (а, е, о, р) is the Cyrillic look-alike.
const COVER = 'Peace and coffee are the secret to a happy morning, especially when the sky is grey and the rain keeps tapping on the window.';
const CYRILLIC = new Set(Object.values(HOMOGLYPHS));

export default function HomoglyphDemo() {
  const [secret, setSecret] = useState('Hi!');
  const [xray, setXray] = useState(false);

  const bytes = useMemo(() => Uint8Array.from(secret, (c) => c.charCodeAt(0) & 0x7f), [secret]);
  const bits = useMemo(() => Array.from(bytesToBits(bytes)), [bytes]);
  const capacity = homoglyphCapacity(COVER);
  const stego = useMemo(() => hideHomoglyphs(COVER, bits), [bits]);
  const decoded = useMemo(() => {
    const read = revealHomoglyphs(stego).slice(0, bits.length);
    return String.fromCharCode(...bitsToBytes(read));
  }, [stego, bits]);

  return (
    <Figure
      title="Letters that aren’t what they seem"
      caption="Some Latin letters have identical twins in the Cyrillic alphabet (a/а, e/е, o/о, p/р…). Using the original letter means 0 and its twin means 1. The text looks untouched, but a computer sees different characters."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-44">
          <label htmlFor="homo-secret" className="mb-1.5 block text-sm font-medium text-ink">
            Secret (English letters)
          </label>
          <TextInput id="homo-secret" value={secret} maxLength={Math.floor(capacity / 8)} onChange={(e) => setSecret(e.target.value.replace(/[^\x20-\x7e]/g, ''))} />
        </div>
        <Toggle checked={xray} onChange={setXray} label="X-ray" description="Highlight the twins" />
      </div>
      <p className="mt-5 rounded-xl bg-surface-2/60 p-4 text-lg leading-relaxed text-ink">
        {Array.from(stego).map((ch, i) =>
          xray && CYRILLIC.has(ch) ? (
            <mark key={i} title={`${codePoint(ch)} Cyrillic`} className="rounded bg-warn/30 text-ink">
              {ch}
            </mark>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
      </p>
      <p className="mt-3 text-sm text-muted">
        Uses {bits.length} of {capacity} swappable letters · decoded: <strong className="font-mono text-secret">{decoded}</strong>
      </p>
    </Figure>
  );
}
