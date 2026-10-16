import { useState } from 'react';
import ImageCanvas from './ImageCanvas';

/** Before/after image comparison with a draggable divider (also keyboard-accessible). */
export default function CompareView({ before, after, beforeLabel = 'Original', afterLabel = 'With hidden message', pixelated = false }) {
  const [pos, setPos] = useState(50);
  if (!before || !after) return null;
  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-2">
        <ImageCanvas image={after} pixelated={pixelated} className="w-full" label={afterLabel} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <ImageCanvas image={before} pixelated={pixelated} className="w-full" label={beforeLabel} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" style={{ left: `${pos}%` }} />
        <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {afterLabel}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Move the comparison divider"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="text-center text-xs text-muted">Drag across the picture to compare. Can you see any difference?</p>
    </div>
  );
}
