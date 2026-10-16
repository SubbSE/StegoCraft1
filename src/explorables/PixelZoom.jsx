import { useMemo, useRef, useState } from 'react';
import { Figure } from '../components/ui/display';
import ImageCanvas from '../components/media/ImageCanvas';
import { generateLandscape } from '../lib/synth';

const COLS = 8;
const ROWS = 6;

export default function PixelZoom() {
  const image = useMemo(() => generateLandscape(320, 200, 21), []);
  const [pos, setPos] = useState({ x: 214, y: 96 });
  const wrap = useRef(null);
  const dragging = useRef(false);

  const clampPos = (x, y) => ({
    x: Math.max(0, Math.min(image.width - COLS, Math.round(x - COLS / 2))),
    y: Math.max(0, Math.min(image.height - ROWS, Math.round(y - ROWS / 2))),
  });

  const moveTo = (e) => {
    const r = wrap.current.getBoundingClientRect();
    setPos(clampPos(((e.clientX - r.left) / r.width) * image.width, ((e.clientY - r.top) / r.height) * image.height));
  };

  const onKey = (e) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    setPos((p) => clampPos(p.x + COLS / 2 + d[0] * 2, p.y + ROWS / 2 + d[1] * 2));
  };

  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = ((pos.y + y) * image.width + pos.x + x) * 4;
      cells.push([image.data[i], image.data[i + 1], image.data[i + 2]]);
    }
  }

  return (
    <Figure title="Zoom into the pixels" caption="Click or drag on the picture (or focus it and use the arrow keys) to move the magnifier. Every square is one pixel, made of three numbers: red, green and blue.">
      <div className="grid items-start gap-4 md:grid-cols-2">
        <div
          ref={wrap}
          role="slider"
          tabIndex={0}
          aria-label="Magnifier position"
          aria-valuetext={`x ${pos.x}, y ${pos.y}`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            moveTo(e);
          }}
          onPointerMove={(e) => dragging.current && moveTo(e)}
          onPointerUp={() => (dragging.current = false)}
          className="relative cursor-crosshair touch-none overflow-hidden rounded-xl border border-line"
        >
          <ImageCanvas image={image} className="w-full" label="Sample landscape" />
          <div
            className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
            style={{
              left: `${(pos.x / image.width) * 100}%`,
              top: `${(pos.y / image.height) * 100}%`,
              width: `${(COLS / image.width) * 100}%`,
              height: `${(ROWS / image.height) * 100}%`,
            }}
          />
        </div>
        <div className="grid gap-0.5 overflow-hidden rounded-xl border border-line" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {cells.map(([r, g, b], i) => {
            const light = 0.299 * r + 0.587 * g + 0.114 * b > 140;
            return (
              <div key={i} className="flex aspect-square flex-col items-center justify-center font-mono text-[0.55rem] leading-tight sm:text-[0.62rem]" style={{ background: `rgb(${r},${g},${b})`, color: light ? '#111' : '#fff' }}>
                <span>{r}</span>
                <span>{g}</span>
                <span>{b}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Figure>
  );
}
