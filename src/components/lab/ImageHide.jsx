import { useMemo, useState } from 'react';
import { Download, EyeOff, ImagePlus, ScanSearch, Sparkles, X } from 'lucide-react';
import { buildPayload, payloadSize } from '../../lib/payload';
import { changeMap, hideInImage, imageCarrier, psnr } from '../../lib/imageStego';
import { downloadBlob, imageToBlob, loadImageFile, stemName } from '../../lib/browser';
import { friendlyError } from '../../lib/errors';
import { generateLandscape } from '../../lib/synth';
import { Button } from '../ui/Button';
import { Callout, Card, Spinner, Stat } from '../ui/display';
import { Field, PasswordField, Slider, Toggle } from '../ui/controls';
import { Dropzone } from '../ui/Dropzone';
import ImageCanvas from '../media/ImageCanvas';
import CompareView from '../media/CompareView';
import MessageInput from './MessageInput';
import CapacityMeter from './CapacityMeter';

export default function ImageHide({ onTestReveal }) {
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kind, setKind] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [bits, setBits] = useState(1);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  const cells = useMemo(() => (cover ? imageCarrier(cover.image).count : 0), [cover]);
  const capacity = Math.floor((cells * bits) / 8);
  const used = payloadSize({ text: kind === 'text' ? text : '', file: kind === 'file' ? file : null, encrypted: Boolean(password) });
  const hasMessage = kind === 'text' ? text.length > 0 : Boolean(file);
  const canHide = cover && hasMessage && used <= capacity && !busy;

  const setCoverImage = (next) => {
    setCover(next);
    setResult(null);
    setError('');
  };

  const onFile = async (f) => {
    setLoading(true);
    setError('');
    try {
      setCoverImage({ image: await loadImageFile(f), name: f.name });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => setCoverImage({ image: generateLandscape(960, 600, 1 + Math.floor(Math.random() * 1000)), name: 'sunset.png' });

  const hide = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const fileArg = kind === 'file' ? { name: file.name, type: file.type, bytes: new Uint8Array(await file.arrayBuffer()) } : null;
      const payload = await buildPayload({ text: kind === 'text' ? text : undefined, file: fileArg, password });
      const res = await hideInImage(cover.image, payload, { bitsPerCell: bits, password });
      setResult({ ...res, bits, psnr: psnr(cover.image, res.image), payloadBytes: payload.length });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const download = async () => downloadBlob(await imageToBlob(result.image), `${stemName(cover.name)}-stego.png`);
  const diff = useMemo(
    () => (result && showDiff ? changeMap(cover.image, result.image, Math.max(0, Math.round(cover.image.width / 450))) : null),
    [result, showDiff, cover],
  );
  const totalValues = cover ? cover.image.width * cover.image.height * 3 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">1. Choose a cover image</h2>
          {cover ? (
            <div className="flex items-center gap-4">
              <ImageCanvas image={cover.image} className="max-h-24 w-auto rounded-lg border border-line" label="Cover image" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium text-ink">{cover.name}</p>
                <p className="text-muted">
                  {cover.image.width} × {cover.image.height} px
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCoverImage(null)}>
                <X aria-hidden="true" className="h-4 w-4" /> Change
              </Button>
            </div>
          ) : (
            <>
              <Dropzone accept="image/*" allowPaste onFile={onFile} title={loading ? 'Opening…' : 'Drop, paste or choose an image'} hint="PNG or JPEG. The result is always saved as PNG." />
              <Button variant="secondary" onClick={loadSample} className="w-full">
                <Sparkles aria-hidden="true" className="h-4 w-4" /> Use a generated sample image
              </Button>
            </>
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">2. Write your secret</h2>
          <MessageInput kind={kind} onKindChange={setKind} text={text} onTextChange={setText} file={file} onFileChange={setFile} />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-lg font-semibold">3. Settings</h2>
          <Slider
            label="Bits per colour value"
            min={1}
            max={4}
            value={bits}
            onChange={setBits}
            hint={bits === 1 ? 'Changes each value by at most 1 — impossible to see.' : `Up to ${2 ** bits - 1} levels per value: ${bits}× the space, but noisier.`}
          />
          <Field label="Password (optional)" hint="Encrypts the message (AES-256) and scatters its bits across the image. Without it, nobody can even find them.">
            <PasswordField value={password} onChange={setPassword} />
          </Field>
          {cover && <CapacityMeter used={used} capacity={capacity} />}
          <Button size="lg" className="w-full" disabled={!canHide} onClick={hide}>
            {busy ? <Spinner /> : <EyeOff aria-hidden="true" className="h-5 w-5" />}
            {busy ? 'Hiding…' : 'Hide message in image'}
          </Button>
          {error && <Callout type="warn">{error}</Callout>}
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        {result ? (
          <Card className="animate-fade-up space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Done — your secret is inside</h2>
              <Button onClick={download}>
                <Download aria-hidden="true" className="h-4 w-4" /> Download PNG
              </Button>
            </div>
            {diff ? (
              <div className="space-y-2">
                <ImageCanvas image={diff} className="w-full rounded-xl border border-line" label="Map of changed pixels" />
                <p className="text-center text-xs text-muted">Each green dot marks a changed pixel (drawn larger so you can see it). Everything dark is untouched.</p>
              </div>
            ) : (
              <CompareView before={cover.image} after={result.image} />
            )}
            <Toggle checked={showDiff} onChange={setShowDiff} label="Show what changed" description="Marks every pixel that was touched." />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="PSNR" value={Number.isFinite(result.psnr) ? `${result.psnr.toFixed(1)} dB` : '∞'} hint="Above ~45 dB looks identical" tone="secret" />
              <Stat label="Values changed" value={result.cellsChanged.toLocaleString()} hint={`${((result.cellsChanged / totalValues) * 100).toFixed(3)}% of all`} />
              <Stat label="Hidden" value={`${result.payloadBytes.toLocaleString()} B`} hint={result.bits > 1 ? `${result.bits} bits per value` : '1 bit per value'} />
            </div>
            <Callout type="warn" title="Share the file, not a screenshot">
              Send the PNG as a file (email attachment, cloud link). Chat apps and social networks usually re-compress images, which wipes out the hidden bits.
            </Callout>
            <Button variant="secondary" onClick={() => onTestReveal(result.image)} className="w-full">
              <ScanSearch aria-hidden="true" className="h-4 w-4" /> Test it: reveal from this image
            </Button>
          </Card>
        ) : (
          <Card className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
              <ImagePlus aria-hidden="true" className="h-7 w-7 text-subtle" />
            </span>
            <p className="max-w-xs text-muted">Your image with the hidden message will appear here, side by side with the original.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
