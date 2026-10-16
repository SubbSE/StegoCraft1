import { useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { bitPlane } from '../../lib/analysis';
import { ensureFont, renderTextMask } from '../../lib/browser';
import { generateLandscape } from '../../lib/synth';
import ImageCanvas from '../media/ImageCanvas';

const W = 720;
const H = 450;
const FONT = '700 84px "Space Grotesk Variable", sans-serif';

/** A photo with a message written into the lowest bit of every colour value. */
async function build() {
  const photo = generateLandscape(W, H, 12);
  await ensureFont(FONT);
  const mask = renderTextMask(['You found', 'the secret!'], { width: W, height: H, font: FONT, lineHeight: 1.1 });
  for (let i = 0; i < W * H; i++) {
    const bit = mask.data[i] > 0.5 ? 1 : 0;
    for (let c = 0; c < 3; c++) photo.data[i * 4 + c] = (photo.data[i * 4 + c] & ~1) | bit;
  }
  return { photo, plane: bitPlane(photo, 'rgb', 0) };
}

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function HeroReveal() {
  const [images, setImages] = useState(null);
  const [pos, setPos] = useState(() => (reducedMotion() ? 55 : 100));
  const sweep = useRef(0);

  useEffect(() => {
    let alive = true;
    build().then((r) => alive && setImages(r));
    return () => {
      alive = false;
    };
  }, []);

  // One gentle sweep on load hints that the divider moves.
  useEffect(() => {
    if (!images || reducedMotion()) return undefined;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start - 400) / 1400);
      if (k > 0) setPos(100 - 45 * (1 - (1 - k) ** 3));
      if (k < 1) sweep.current = requestAnimationFrame(tick);
    };
    sweep.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(sweep.current);
  }, [images]);

  if (!images) {
    return <div className="aspect-[8/5] w-full animate-pulse rounded-2xl border border-line bg-surface-2" aria-hidden="true" />;
  }

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-black shadow-2xl shadow-black/20">
        <ImageCanvas image={images.plane} className="w-full" label="The lowest bit of every pixel, showing the words: You found the secret!" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <ImageCanvas image={images.photo} className="w-full" label="An ordinary-looking landscape photo" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
            <MoveHorizontal aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          What everyone sees
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          Bit 0 of every pixel
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => {
            cancelAnimationFrame(sweep.current);
            setPos(Number(e.target.value));
          }}
          aria-label="Slide to reveal the hidden layer"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="text-center text-sm text-muted">
        Drag across the picture. Changing the last bit of a colour value is invisible — until you look at that bit alone.
      </figcaption>
    </figure>
  );
}
