import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanSearch, X } from 'lucide-react';
import { openPayload } from '../../lib/payload';
import { revealFromImage } from '../../lib/imageStego';
import { loadImageFile } from '../../lib/browser';
import { friendlyError, StegoError } from '../../lib/errors';
import { Button } from '../ui/Button';
import { Callout, Card, Spinner } from '../ui/display';
import { Field, PasswordField } from '../ui/controls';
import { Dropzone } from '../ui/Dropzone';
import ImageCanvas from '../media/ImageCanvas';
import RevealResult from './RevealResult';

export default function ImageReveal({ initial, initialName = 'stego.png' }) {
  const [stego, setStego] = useState(initial ? { image: initial, name: initialName, type: 'image/png' } : null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [found, setFound] = useState(null);

  const choose = (next) => {
    setStego(next);
    setFound(null);
    setError(null);
  };

  const onFile = async (f) => {
    try {
      choose({ image: await loadImageFile(f, { raw: true }), name: f.name, type: f.type });
    } catch (e) {
      setError({ message: friendlyError(e) });
    }
  };

  const reveal = async () => {
    setBusy(true);
    setError(null);
    setFound(null);
    try {
      const hit = await revealFromImage(stego.image, { password });
      const result = await openPayload(hit.header, hit.body, password);
      setFound({ result, meta: { ...hit, encrypted: hit.header.encrypted } });
    } catch (e) {
      setError({ message: friendlyError(e), code: e instanceof StegoError ? e.code : 'error' });
    } finally {
      setBusy(false);
    }
  };

  const isJpeg = stego && /jpe?g/i.test(stego.type || stego.name);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card className="space-y-5 lg:self-start">
        <h2 className="text-lg font-semibold">Find a hidden message</h2>
        {stego ? (
          <div className="flex items-center gap-4">
            <ImageCanvas image={stego.image} className="max-h-24 w-auto rounded-lg border border-line" label="Image to inspect" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium text-ink">{stego.name}</p>
              <p className="text-muted">
                {stego.image.width} × {stego.image.height} px
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => choose(null)}>
              <X aria-hidden="true" className="h-4 w-4" /> Change
            </Button>
          </div>
        ) : (
          <Dropzone accept="image/*" allowPaste onFile={onFile} title="Drop, paste or choose an image" hint="Use the PNG file made in the Hide tab." />
        )}
        {isJpeg && (
          <Callout type="warn">
            This is a JPEG. JPEG compression rewrites pixel values, so least-significant-bit messages almost never survive in JPEG files.
          </Callout>
        )}
        <Field label="Password" hint="Only needed if the message was hidden with one.">
          <PasswordField value={password} onChange={setPassword} placeholder="Leave empty if none" autoComplete="off" />
        </Field>
        <Button size="lg" className="w-full" disabled={!stego || busy} onClick={reveal}>
          {busy ? <Spinner /> : <ScanSearch aria-hidden="true" className="h-5 w-5" />}
          {busy ? 'Searching…' : 'Reveal hidden message'}
        </Button>
      </Card>

      <div className="space-y-4">
        {found && <RevealResult result={found.result} meta={found.meta} />}
        {error && (
          <Callout type="warn" title="Nothing revealed">
            <p>{error.message}</p>
            {error.code === 'no-payload' && (
              <p className="mt-2">
                It may have been hidden with a different tool. Try the{' '}
                <Link to="/detect/image" className="font-medium text-accent underline">
                  Detect lab
                </Link>{' '}
                to look for statistical traces of hidden data.
              </p>
            )}
          </Callout>
        )}
        {!found && !error && (
          <Card className="flex min-h-60 flex-col items-center justify-center gap-2 text-center">
            <p className="max-w-sm text-muted">
              StegoCraft looks for its own signature in the image's lowest bits, trying 1–4 bits per value automatically.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
