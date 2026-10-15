import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Callout, Card, Stat } from '../ui/display';
import { Dropzone } from '../ui/Dropzone';
import ImageCanvas from '../media/ImageCanvas';
import BitPlanePanel from './BitPlanePanel';
import StegoCraftCheck from './StegoCraftCheck';
import { ChiCurve, HistogramChart } from './charts';
import { chiSquareCurve, histogram, lsbBalance, summarizeChiCurve } from '../../lib/analysis';
import { hideInImage, revealFromImage } from '../../lib/imageStego';
import { buildPayload } from '../../lib/payload';
import { generateLandscape } from '../../lib/synth';
import { imageToBlob, loadImageFile } from '../../lib/browser';
import { friendlyError } from '../../lib/errors';

const SAMPLES = [
  {
    id: 'clean',
    label: 'Clean photo',
    note: 'Nothing is hidden in this one. Compare its results with the other samples.',
    make: async () => generateLandscape(640, 400, 77),
  },
  {
    id: 'ordered',
    label: 'Photo hidden in order',
    note: 'An encrypted photo, written into the lowest bits in reading order — the way many simple tools work. Password: warden',
    make: async () => {
      // Encrypted data looks perfectly random, which is what the chi-square test expects.
      // (An unencrypted PNG is slightly lopsided — about 49.5% ones — and that alone can hide it from this test.)
      const secret = await imageToBlob(generateLandscape(200, 125, 404));
      const bytes = new Uint8Array(await secret.arrayBuffer());
      const payload = await buildPayload({ file: { name: 'secret-photo.png', type: 'image/png', bytes }, password: 'warden' });
      return (await hideInImage(generateLandscape(640, 400, 77), payload)).image;
    },
  },
  {
    id: 'scattered',
    label: 'Message scattered with a password',
    note: 'A short encrypted message, scattered across the picture by its password. Password: warden',
    make: async () => {
      const payload = await buildPayload({
        text: 'You found it! The chi-square test missed this message because it is short and scattered.',
        password: 'warden',
      });
      return (await hideInImage(generateLandscape(640, 400, 77), payload, { password: 'warden' })).image;
    },
  },
];

function Analysis({ image }) {
  const curve = useMemo(() => chiSquareCurve(image, 80), [image]);
  const { peak, reach } = useMemo(() => summarizeChiCurve(curve), [curve]);
  const hists = useMemo(() => [0, 1, 2].map((c) => histogram(image, c)), [image]);
  const balance = useMemo(() => lsbBalance(image), [image]);
  const verdict =
    peak > 0.95
      ? reach >= 0.99
        ? 'LSB data likely across the whole image'
        : `LSB data likely in the first ~${Math.max(1, Math.round(reach * 100))}% of the image`
      : peak > 0.5
        ? 'Somewhat suspicious'
        : 'No sign of sequential LSB data';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-lg font-semibold">Bit planes</h2>
        <BitPlanePanel image={image} />
      </Card>
      <div className="space-y-6">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Chi-square test</h2>
          <ChiCurve curve={curve} />
          <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${peak > 0.95 ? 'bg-danger/10 text-danger' : peak > 0.5 ? 'bg-warn/10 text-warn' : 'bg-secret/10 text-secret'}`} role="status">
            {verdict}
          </p>
          <p className="text-xs text-muted">
            Detects least-significant-bit replacement written in reading order. Small scattered messages, LSB matching and
            JPEG-domain methods can pass this test — a clean result is not proof of innocence.
          </p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Histogram</h2>
          <HistogramChart hists={hists} />
          <div className="grid grid-cols-3 gap-2">
            {['Red', 'Green', 'Blue'].map((c, i) => (
              <Stat key={c} label={`${c} LSB = 1`} value={`${(balance[i] * 100).toFixed(1)}%`} />
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">StegoCraft message?</h2>
          <StegoCraftCheck find={(password) => revealFromImage(image, { password })} />
        </Card>
      </div>
    </div>
  );
}

export default function DetectImage() {
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loads = useRef(0);

  const load = async (fn, name, note = '') => {
    setLoading(true);
    setError('');
    try {
      setSubject({ image: await fn(), name, note, id: ++loads.current });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {subject ? (
        <Card className="flex flex-wrap items-center gap-4">
          <ImageCanvas image={subject.image} className="max-h-20 w-auto rounded-lg border border-line" label="Image under analysis" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium text-ink">{subject.name}</p>
            <p className="text-muted">
              {subject.image.width} × {subject.image.height} px
            </p>
            {subject.note && <p className="mt-1 text-ink">{subject.note}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSubject(null)}>
            <X aria-hidden="true" className="h-4 w-4" /> Analyse another
          </Button>
        </Card>
      ) : (
        <Card className="space-y-4">
          <Dropzone accept="image/*" allowPaste onFile={(f) => load(() => loadImageFile(f, { raw: true }), f.name)} title={loading ? 'Opening…' : 'Drop, paste or choose an image to analyse'} hint="PNG works best. Everything stays on your device." />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Or try a sample:</span>
            {SAMPLES.map((s) => (
              <Button key={s.id} size="sm" variant="secondary" disabled={loading} onClick={() => load(s.make, `${s.label} (sample)`, s.note)}>
                {s.label}
              </Button>
            ))}
          </div>
          {error && <Callout type="warn">{error}</Callout>}
        </Card>
      )}
      {subject && <Analysis key={subject.id} image={subject.image} />}
    </div>
  );
}
