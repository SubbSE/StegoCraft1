import { useEffect, useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { TextArea } from '../components/ui/controls';
import { bytesToBits, utf8Encode } from '../lib/bytes';
import { encryptBytes } from '../lib/crypto';
import { useDebounced } from '../hooks/useDebounced';

const COLS = 64;

function BitGrid({ bits, label }) {
  const ones = bits.reduce((n, b) => n + b, 0);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted">{bits.length ? `${Math.round((ones / bits.length) * 100)}% ones` : ''}</span>
      </div>
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} role="img" aria-label={`${label}: ${bits.length} bits`}>
        {Array.from(bits).map((b, i) => (
          <span key={i} className={`aspect-square ${b ? 'bg-ink' : 'bg-surface'}`} />
        ))}
      </div>
    </div>
  );
}

export default function EncryptedBits() {
  const [text, setText] = useState('Meet me at the old library at seven. Bring the notebook and the spare key.');
  const debounced = useDebounced(text, 300);
  const plain = useMemo(() => bytesToBits(utf8Encode(debounced).slice(0, 64)), [debounced]);
  const [cipher, setCipher] = useState(new Uint8Array(0));

  useEffect(() => {
    let alive = true;
    encryptBytes(utf8Encode(debounced).slice(0, 64), 'demo-password').then((c) => alive && setCipher(bytesToBits(c.slice(28, 28 + 64))));
    return () => {
      alive = false;
    };
  }, [debounced]);

  return (
    <Figure
      title="Plain bits vs. encrypted bits"
      caption="Each row holds 8 characters, so every 8th column is the first bit of a byte. In plain English that bit is always 0 — see the stripes? After encryption, the stripes vanish and the bits look like coin flips."
    >
      <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={2} aria-label="Message" />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <BitGrid bits={Array.from(plain)} label="Your message" />
        <BitGrid bits={Array.from(cipher)} label="Encrypted (AES-256)" />
      </div>
    </Figure>
  );
}
