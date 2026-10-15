import { useEffect, useMemo, useState } from 'react';
import { Figure, Stat, Spinner } from '../components/ui/display';
import { Slider } from '../components/ui/controls';
import ImageCanvas from '../components/media/ImageCanvas';
import { generateLandscape } from '../lib/synth';
import { buildPayload, openPayload } from '../lib/payload';
import { hideInImage, imageCarrier, revealFromImage } from '../lib/imageStego';
import { readRawBytes } from '../lib/carrier';
import { imageToBlob, jpegRoundTrip } from '../lib/browser';
import { formatBytes } from '../lib/bytes';
import { useDebounced } from '../hooks/useDebounced';

const MESSAGE = 'The treasure is buried under the old oak tree, three steps north of the well.';

function bitErrors(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    let x = a[i] ^ b[i];
    while (x) {
      n += x & 1;
      x >>= 1;
    }
  }
  return n;
}

export default function JpegSurvival() {
  const cover = useMemo(() => generateLandscape(320, 200, 3), []);
  const [quality, setQuality] = useState(90);
  const q = useDebounced(quality, 150);
  const [stego, setStego] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let alive = true;
    buildPayload({ text: MESSAGE }).then(async (payload) => {
      const { image } = await hideInImage(cover, payload);
      const png = await imageToBlob(image);
      if (alive) setStego({ image, payload, pngSize: png.size });
    });
    return () => {
      alive = false;
    };
  }, [cover]);

  useEffect(() => {
    if (!stego) return undefined;
    let alive = true;
    setResult(null);
    (async () => {
      const { image, size } = await jpegRoundTrip(stego.image, q / 100);
      const read = await readRawBytes(imageCarrier(image), stego.payload.length);
      let extracted = null;
      try {
        const hit = await revealFromImage(image);
        extracted = (await openPayload(hit.header, hit.body)).text;
      } catch (e) {
        extracted = e.code === 'corrupted' ? 'Found the header, but the message is damaged.' : 'No message found — the header was destroyed.';
      }
      if (alive) setResult({ image, size, errors: bitErrors(read, stego.payload), extracted });
    })();
    return () => {
      alive = false;
    };
  }, [stego, q]);

  const totalBits = stego ? stego.payload.length * 8 : 0;

  return (
    <Figure
      title="Does the message survive JPEG?"
      caption="A message is hidden with LSB substitution, then the picture is saved as a JPEG at the quality you choose and opened again — exactly what happens when you “Save as JPEG” or upload to most apps."
    >
      <Slider label="JPEG quality" min={10} max={100} value={quality} onChange={setQuality} format={(v) => `${v}%`} />
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">After saving as JPEG</p>
          {result ? (
            <ImageCanvas image={result.image} className="w-full rounded-lg border border-line" label="Image after JPEG compression" />
          ) : (
            <div className="flex aspect-[8/5] items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
              <Spinner />
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="Bits flipped"
              value={result ? `${((result.errors / totalBits) * 100).toFixed(0)}%` : '…'}
              hint={result ? `${result.errors} of ${totalBits}` : ''}
              tone={result && result.errors === 0 ? 'secret' : 'danger'}
            />
            <Stat label="JPEG size" value={result ? formatBytes(result.size) : '…'} hint={stego ? `vs. ${formatBytes(stego.pngSize)} as PNG` : ''} />
          </div>
          <div className={`rounded-xl border p-3 text-sm ${result && result.extracted === MESSAGE ? 'border-secret/40 bg-secret/5' : 'border-danger/30 bg-danger/5'}`}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Trying to reveal</p>
            <p className="text-ink">{result ? result.extracted : 'Compressing…'}</p>
          </div>
          <p className="text-xs text-muted">If the bits were pure luck, about 50% would be wrong. That is what you see at almost every quality.</p>
        </div>
      </div>
    </Figure>
  );
}
