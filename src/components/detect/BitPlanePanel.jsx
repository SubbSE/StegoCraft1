import { useMemo, useState } from 'react';
import { Segmented } from '../ui/controls';
import ImageCanvas from '../media/ImageCanvas';
import { bitPlane } from '../../lib/analysis';

const CHANNELS = [
  { value: 'rgb', label: 'All' },
  { value: 0, label: 'Red' },
  { value: 1, label: 'Green' },
  { value: 2, label: 'Blue' },
];

/** Bit-plane viewer for any image. */
export default function BitPlanePanel({ image }) {
  const [channel, setChannel] = useState('rgb');
  const [bit, setBit] = useState(0);
  const plane = useMemo(() => bitPlane(image, channel, bit), [image, channel, bit]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented label="Colour channel" value={channel} onChange={setChannel} options={CHANNELS} size="sm" />
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Bit plane">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={bit === b}
              aria-label={`Bit ${b}`}
              onClick={() => setBit(b)}
              className={`h-8 w-8 rounded-lg border font-mono text-xs transition-colors ${
                bit === b ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface-2 text-muted hover:text-ink'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <ImageCanvas image={plane} pixelated className="w-full rounded-lg border border-line" label={`Bit plane ${bit}`} />
      <p className="text-xs text-muted">
        Bit 0 (LSB) of a camera photo usually looks like even static. Bands, blocks or a region that looks different from the
        rest suggest something was written there.
      </p>
    </div>
  );
}
