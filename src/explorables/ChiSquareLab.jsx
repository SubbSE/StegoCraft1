import { useEffect, useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented, Slider } from '../components/ui/controls';
import { generateLandscape } from '../lib/synth';
import { hideInImage, imageCapacity } from '../lib/imageStego';
import { chiSquareCurve, chiSquareProbability, histogram, summarizeChiCurve } from '../lib/analysis';
import { ChiCurve } from '../components/detect/charts';
import { seededRandom } from '../lib/prng';

const RANGE_START = 96;
const RANGE = 32;

function PairsChart({ hist }) {
  const slice = Array.from(hist.slice(RANGE_START, RANGE_START + RANGE));
  const max = Math.max(1, ...slice);
  return (
    <svg viewBox={`0 0 ${RANGE * 10} 120`} className="w-full" role="img" aria-label="Histogram of colour values 96 to 127, shown in pairs">
      {slice.map((v, i) => {
        const h = (v / max) * 100;
        const pair = Math.floor(i / 2);
        return (
          <rect key={i} x={i * 10 + (i % 2 ? 0 : 1.5)} y={104 - h} width="7.5" height={h} rx="1.5" fill={pair % 2 ? 'var(--color-accent)' : 'var(--color-secret)'} opacity={i % 2 ? 0.55 : 1} />
        );
      })}
      <line x1="0" y1="104.5" x2={RANGE * 10} y2="104.5" stroke="var(--color-line-strong)" />
      <text x="0" y="118" fontSize="9" fill="var(--color-muted)">
        {RANGE_START}
      </text>
      <text x={RANGE * 10} y="118" fontSize="9" textAnchor="end" fill="var(--color-muted)">
        {RANGE_START + RANGE - 1}
      </text>
    </svg>
  );
}

export default function ChiSquareLab() {
  const cover = useMemo(() => generateLandscape(320, 200, 11), []);
  const [mode, setMode] = useState('ordered');
  const [size, setSize] = useState(40);
  const [stego, setStego] = useState(cover);

  useEffect(() => {
    if (mode === 'clean') {
      setStego(cover);
      return undefined;
    }
    let alive = true;
    const rand = seededRandom(23);
    const payload = Uint8Array.from({ length: Math.floor((imageCapacity(cover) * size) / 100) }, () => Math.floor(rand() * 256));
    hideInImage(cover, payload, { password: mode === 'scattered' ? 'demo' : '' }).then(({ image }) => alive && setStego(image));
    return () => {
      alive = false;
    };
  }, [cover, mode, size]);

  const hist = useMemo(() => histogram(stego), [stego]);
  const curve = useMemo(() => chiSquareCurve(stego, 60), [stego]);
  const p = useMemo(() => chiSquareProbability(hist) ?? 0, [hist]);
  const { peak, reach } = useMemo(() => summarizeChiCurve(curve), [curve]);
  const verdict =
    peak > 0.95
      ? reach >= 0.99
        ? 'Hidden data detected across the whole image'
        : `Hidden data detected in the first ~${Math.round(reach * 100)}% of the image`
      : peak > 0.5
        ? 'Suspicious'
        : 'Looks clean to this test';

  return (
    <Figure
      title="The chi-square attack"
      caption="Left: how often each colour value appears, in pairs (96 & 97, 98 & 99, …). Right: the test’s probability that LSB data is present, measured over a growing part of the image. The shaded area is where the message was actually written."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Picture"
          value={mode}
          onChange={setMode}
          size="sm"
          options={[
            { value: 'clean', label: 'Clean' },
            { value: 'ordered', label: 'Message in order' },
            { value: 'scattered', label: 'Message scattered' },
          ]}
        />
      </div>
      {mode !== 'clean' && <Slider className="mt-4" label="Message size" min={5} max={100} step={5} value={size} onChange={setSize} format={(v) => `${v}% of capacity`} />}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-ink">Pairs of values</p>
          <PairsChart hist={hist} />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-ink">Probability of hidden data</p>
          <ChiCurve curve={curve} shade={mode === 'ordered' ? size / 100 : mode === 'scattered' ? 1 : 0} />
        </div>
      </div>
      <div className={`mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-xl px-4 py-3 ${peak > 0.95 ? 'bg-danger/10' : peak > 0.5 ? 'bg-warn/10' : 'bg-secret/10'}`} role="status">
        <strong className={peak > 0.95 ? 'text-danger' : peak > 0.5 ? 'text-warn' : 'text-secret'}>{verdict}</strong>
        <span className="font-mono text-sm text-muted">whole image: p = {(p * 100).toFixed(1)}%</span>
      </div>
    </Figure>
  );
}
