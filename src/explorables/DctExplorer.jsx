import { useMemo, useRef, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Slider } from '../components/ui/controls';
import ImageCanvas from '../components/media/ImageCanvas';
import { generateLandscape } from '../lib/synth';
import { dct8, idct8, quantTable } from '../lib/dsp';

const BW = 20; // blocks across
const BH = 12; // blocks down

function toLuma(image) {
  const out = new Float64Array(image.width * image.height);
  for (let i = 0; i < out.length; i++) {
    out[i] = 0.299 * image.data[i * 4] + 0.587 * image.data[i * 4 + 1] + 0.114 * image.data[i * 4 + 2];
  }
  return out;
}

function Grid({ values, render, title, note }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold text-ink">{title}</p>
        {note && <p className="text-[0.7rem] text-muted">{note}</p>}
      </div>
      <div className="grid grid-cols-8 gap-px overflow-hidden rounded-lg border border-line bg-line">{Array.from(values, render)}</div>
    </div>
  );
}

const gray = (v) => {
  const g = Math.max(0, Math.min(255, Math.round(v)));
  return { background: `rgb(${g},${g},${g})`, color: g > 140 ? '#111' : '#eee' };
};

const heat = (v, scale) => {
  const t = Math.min(1, Math.abs(v) / scale);
  return v === 0 ? {} : { background: v > 0 ? `rgba(245, 158, 11, ${0.15 + t * 0.75})` : `rgba(99, 102, 241, ${0.15 + t * 0.75})` };
};

export default function DctExplorer() {
  const image = useMemo(() => generateLandscape(BW * 8, BH * 8, 13), []);
  const luma = useMemo(() => toLuma(image), [image]);
  const [block, setBlock] = useState({ x: 8, y: 4 });
  const [quality, setQuality] = useState(50);
  const [coef, setCoef] = useState(1);
  const wrap = useRef(null);

  const pixels = useMemo(() => {
    const out = new Float64Array(64);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) out[r * 8 + c] = luma[(block.y * 8 + r) * image.width + block.x * 8 + c];
    return out;
  }, [luma, block, image.width]);

  const coeffs = useMemo(() => dct8(pixels.map((v) => v - 128)), [pixels]);
  const table = useMemo(() => quantTable(quality), [quality]);
  const quantised = useMemo(() => coeffs.map((v, i) => Math.round(v / table[i])), [coeffs, table]);
  const rebuilt = useMemo(() => idct8(quantised.map((q, i) => q * table[i])).map((v) => Math.max(0, Math.min(255, Math.round(v + 128)))), [quantised, table]);
  const zeros = quantised.filter((q) => q === 0).length;
  const maxErr = Math.max(...rebuilt.map((v, i) => Math.abs(v - Math.round(pixels[i]))));
  const basis = useMemo(() => {
    const unit = new Float64Array(64);
    unit[coef] = 400;
    return idct8(unit).map((v) => v + 128);
  }, [coef]);

  const pick = (e) => {
    const r = wrap.current.getBoundingClientRect();
    setBlock({
      x: Math.max(0, Math.min(BW - 1, Math.floor(((e.clientX - r.left) / r.width) * BW))),
      y: Math.max(0, Math.min(BH - 1, Math.floor(((e.clientY - r.top) / r.height) * BH))),
    });
  };

  return (
    <Figure
      title="Inside a JPEG block"
      caption="JPEG splits the picture into 8×8 blocks and rewrites each one as a mix of 64 wave patterns (top-left = average brightness, bottom-right = finest detail). Quantisation divides each amount and rounds it — most of the fine detail becomes 0. Click any frequency to see its wave pattern."
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Click a block to inspect it</p>
          <div ref={wrap} onClick={pick} className="relative cursor-crosshair overflow-hidden rounded-lg border border-line">
            <ImageCanvas image={image} pixelated className="w-full" label="Picture divided into 8 by 8 blocks" />
            <div
              className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"
              style={{ left: `${(block.x / BW) * 100}%`, top: `${(block.y / BH) * 100}%`, width: `${100 / BW}%`, height: `${100 / BH}%` }}
            />
          </div>
          <Slider className="mt-4" label="JPEG quality" min={5} max={100} value={quality} onChange={setQuality} format={(v) => `${v}%`} />
          <p className="mt-3 text-sm text-muted">
            <strong className="text-ink">{zeros}</strong> of 64 frequencies rounded to zero · biggest pixel error after rebuilding:{' '}
            <strong className="text-ink">±{maxErr}</strong>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Grid title="Pixels" values={pixels} render={(v, i) => <span key={i} className="aspect-square" style={gray(v)} title={`${Math.round(v)}`} />} />
          <Grid
            title="Rebuilt"
            note={`q ${quality}`}
            values={rebuilt}
            render={(v, i) => <span key={i} className="aspect-square" style={gray(v)} title={`${v}`} />}
          />
          <Grid
            title="Frequencies"
            values={coeffs}
            render={(v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoef(i)}
                aria-label={`Frequency ${i % 8}, ${Math.floor(i / 8)}: ${Math.round(v)}`}
                className={`flex aspect-square items-center justify-center bg-surface font-mono text-[0.5rem] text-ink sm:text-[0.58rem] ${coef === i ? 'outline-2 -outline-offset-2 outline-accent' : ''}`}
                style={heat(v, 120)}
              >
                {Math.round(v)}
              </button>
            )}
          />
          <Grid
            title="Quantised"
            values={quantised}
            render={(v, i) => (
              <span key={i} className={`flex aspect-square items-center justify-center bg-surface font-mono text-[0.55rem] sm:text-[0.62rem] ${v === 0 ? 'text-subtle/50' : 'font-semibold text-ink'}`} style={heat(v, 8)}>
                {v}
              </span>
            )}
          />
          <div className="col-span-2 flex items-center gap-3">
            <div className="w-1/2">
              <Grid title="Wave pattern" values={basis} render={(v, i) => <span key={i} className="aspect-square" style={gray(v)} />} />
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Frequency ({coef % 8}, {Math.floor(coef / 8)}): {coef === 0 ? 'the block’s average brightness.' : 'one of the patterns that are added together to rebuild the block.'}
            </p>
          </div>
        </div>
      </div>
    </Figure>
  );
}
