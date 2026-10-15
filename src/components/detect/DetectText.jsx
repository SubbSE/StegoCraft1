import { useEffect, useMemo, useState } from 'react';
import { Badge, Card } from '../ui/display';
import { PasswordField, TextArea } from '../ui/controls';
import { Button } from '../ui/Button';
import TextXRay, { XRayLegend } from '../lab/TextXRay';
import RevealResult from '../lab/RevealResult';
import { buildPayload } from '../../lib/payload';
import { bitsToBytes } from '../../lib/bytes';
import { friendlyError, StegoError } from '../../lib/errors';
import {
  codePoint,
  hideHomoglyphs,
  hideTrailingWhitespace,
  hideZeroWidth,
  nthLetters,
  revealHomoglyphs,
  revealTrailingWhitespace,
  revealZeroWidth,
  scanText,
} from '../../lib/textStego';

const COVER = 'Thanks for the lovely afternoon. The tea was perfect and the garden looked wonderful in the sun. See you next week!';

const SAMPLES = [
  { label: 'Invisible characters', make: async () => hideZeroWidth(COVER, await buildPayload({ text: 'The meeting moved to Friday.' })) },
  {
    label: 'Look-alike letters',
    make: async () => hideHomoglyphs(COVER, Array.from('OK', (c) => c.charCodeAt(0)).flatMap((b) => Array.from({ length: 8 }, (_, i) => (b >> (7 - i)) & 1))),
  },
  { label: 'Trailing spaces', make: async () => hideTrailingWhitespace('Dear Sam,\nThe parcel arrived safely.\nSee you soon,\nAlex', await buildPayload({ text: 'Under the mat' })) },
  {
    label: 'Null cipher',
    make: async () => 'Apparently neutral’s protest is thoroughly discounted and ignored. Isman hard hit. Blockade issue affects pretext for embargo on by-products, ejecting suets and vegetable oils.',
  },
];

function summariseInvisible(list) {
  const counts = new Map();
  for (const { ch, name } of list) counts.set(ch, { name, n: (counts.get(ch)?.n || 0) + 1 });
  return [...counts.entries()];
}

export default function DetectText() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [found, setFound] = useState(null);
  const scan = useMemo(() => scanText(text), [text]);
  const homoglyphText = useMemo(() => {
    if (!scan.homoglyphs.length) return '';
    const bytes = bitsToBytes(revealHomoglyphs(text));
    let end = bytes.length;
    while (end > 0 && bytes[end - 1] === 0) end--; // letters left unchanged read as zero bytes
    return Array.from(bytes.slice(0, end), (b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '·')).join('');
  }, [text, scan.homoglyphs.length]);

  useEffect(() => setFound(null), [text]);

  const tryReveal = async () => {
    try {
      let result;
      try {
        result = await revealZeroWidth(text, password);
      } catch (e) {
        if (!(e instanceof StegoError) || e.code !== 'no-payload') throw e;
        result = await revealTrailingWhitespace(text, password);
      }
      setFound({ result });
    } catch (e) {
      setFound({ error: friendlyError(e) });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card className="space-y-4 lg:self-start">
        <label htmlFor="detect-text" className="block text-lg font-semibold">
          Paste text to analyse
        </label>
        <TextArea id="detect-text" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="An email, a chat message, a document…" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Samples:</span>
          {SAMPLES.map((s) => (
            <Button key={s.label} size="sm" variant="secondary" onClick={async () => setText(await s.make())}>
              {s.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {text ? (
          <>
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Findings</h2>
              <div className="flex flex-wrap gap-2">
                <Badge tone={scan.invisible.length ? 'danger' : 'secret'}>{scan.invisible.length} invisible characters</Badge>
                <Badge tone={scan.homoglyphs.length ? 'danger' : 'secret'}>{scan.homoglyphs.length} look-alike letters</Badge>
                <Badge tone={scan.trailingLines ? 'warn' : 'secret'}>{scan.trailingLines} lines with trailing whitespace</Badge>
                <Badge tone={scan.doubleSpaces ? 'warn' : 'secret'}>{scan.doubleSpaces} double spaces</Badge>
              </div>
              {scan.invisible.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {summariseInvisible(scan.invisible).map(([ch, { name, n }]) => (
                    <li key={ch} className="flex justify-between gap-3 rounded-lg bg-surface-2 px-3 py-1.5">
                      <span className="font-mono text-xs text-muted">
                        {codePoint(ch)} {name}
                      </span>
                      <span className="font-mono text-xs text-ink">×{n}</span>
                    </li>
                  ))}
                </ul>
              )}
              {homoglyphText && (
                <p className="text-sm text-ink">
                  Reading look-alikes as bits (Latin = 0, Cyrillic = 1) gives: <strong className="font-mono text-secret">{homoglyphText}</strong>
                </p>
              )}
              {(scan.invisible.length > 0 || scan.trailingLines > 0) && (
                <div className="space-y-2 border-t border-line pt-4">
                  <PasswordField value={password} onChange={setPassword} placeholder="Password, if any" autoComplete="off" />
                  <Button size="sm" onClick={tryReveal}>
                    Try to read a StegoCraft message
                  </Button>
                  {found?.result && <RevealResult result={found.result} />}
                  {found?.error && <p className="text-sm text-ink">{found.error}</p>}
                </div>
              )}
            </Card>
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">X-ray view</h2>
              <TextXRay text={text} />
              <XRayLegend />
            </Card>
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Null-cipher helper</h2>
              <p className="text-sm text-muted">The first few letters of every word, read in order — in case the words themselves spell something.</p>
              <div className="space-y-1.5 font-mono text-sm">
                {[1, 2, 3].map((n) => (
                  <p key={n} className="break-all">
                    <span className="text-subtle">letter {n}: </span>
                    <span className="text-ink">{nthLetters(text, n).toUpperCase()}</span>
                  </p>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex min-h-60 items-center justify-center text-center">
            <p className="max-w-sm text-muted">
              Paste anything to check it for invisible characters, look-alike letters, hidden whitespace and null ciphers.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
