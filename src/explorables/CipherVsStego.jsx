import { useEffect, useMemo, useState } from 'react';
import { Ban, CheckCheck, Eye, Lock } from 'lucide-react';
import { encryptBytes } from '../lib/crypto';
import { utf8Encode } from '../lib/bytes';
import { buildPayload, openPayload } from '../lib/payload';
import { hideInImage, revealFromImage } from '../lib/imageStego';
import { generateLandscape } from '../lib/synth';
import { useDebounced } from '../hooks/useDebounced';
import { Figure } from '../components/ui/display';
import { TextInput } from '../components/ui/controls';
import ImageCanvas from '../components/media/ImageCanvas';

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));

function Bubble({ children }) {
  return <div className="max-w-full rounded-2xl rounded-tl-sm border border-line bg-surface-2 p-3 text-sm">{children}</div>;
}

export default function CipherVsStego() {
  const [message, setMessage] = useState('Escape at midnight. Bring the map.');
  const msg = useDebounced(message, 300);
  const cover = useMemo(() => generateLandscape(320, 200, 7), []);
  const [cipher, setCipher] = useState('');
  const [stego, setStego] = useState(null);
  const [bobSees, setBobSees] = useState(null);

  useEffect(() => {
    let alive = true;
    setBobSees(null);
    (async () => {
      const enc = await encryptBytes(utf8Encode(msg || ' '), 'only-bob-knows');
      const { image } = await hideInImage(cover, await buildPayload({ text: msg }));
      if (alive) {
        setCipher(toBase64(enc));
        setStego(image);
      }
    })();
    return () => {
      alive = false;
    };
  }, [msg, cover]);

  const reveal = async () => {
    const hit = await revealFromImage(stego);
    setBobSees((await openPayload(hit.header, hit.body)).text);
  };

  return (
    <Figure
      title="Encryption vs. steganography"
      caption="Both methods keep the warden from reading the message. Only steganography keeps her from knowing it exists. (Both panels are real: the left is AES-256 encryption, the right is your message hidden in the picture's pixels.)"
    >
      <label htmlFor="cvs-msg" className="mb-1.5 block text-sm font-medium text-ink">
        Your secret message
      </label>
      <TextInput id="cvs-msg" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={120} />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Lock aria-hidden="true" className="h-4 w-4" /> Encrypted
          </p>
          <p className="mb-3 text-xs text-muted">What the warden intercepts:</p>
          <Bubble>
            <span className="font-mono text-xs break-all text-ink/80">{cipher}</span>
          </Bubble>
          <p className="mt-auto flex items-start gap-2 pt-4 text-sm text-danger">
            <Ban aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            Unreadable — but obviously a secret. The warden blocks it and watches you closely.
          </p>
        </div>

        <div className="flex flex-col rounded-xl border border-secret/30 bg-secret/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Eye aria-hidden="true" className="h-4 w-4" /> Hidden
          </p>
          <p className="mb-3 text-xs text-muted">What the warden intercepts:</p>
          <Bubble>
            <p className="mb-2">The sunset from my window tonight 🌄</p>
            {stego && <ImageCanvas image={stego} className="w-full rounded-lg" label="Holiday photo with a hidden message" />}
          </Bubble>
          <p className="mt-3 flex items-start gap-2 text-sm text-secret">
            <CheckCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            Just a pretty photo. Delivered.
          </p>
          <button type="button" onClick={reveal} className="mt-3 self-start text-sm font-medium text-accent underline underline-offset-4">
            See what Bob sees
          </button>
          {bobSees !== null && (
            <p className="mt-2 rounded-lg border border-secret/40 bg-surface px-3 py-2 text-sm text-ink">
              Bob extracts: <strong>{bobSees || '(empty)'}</strong>
            </p>
          )}
        </div>
      </div>
    </Figure>
  );
}
