import { useEffect, useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented, Slider } from '../components/ui/controls';
import ImageCanvas from '../components/media/ImageCanvas';
import { generateLandscape } from '../lib/synth';
import { hideInImage, imageCapacity } from '../lib/imageStego';
import { bitPlane } from '../lib/analysis';
import { seededRandom } from '../lib/prng';

const CHANNELS = [
  { value: 0, label: 'Red' },
  { value: 1, label: 'Green' },
  { value: 2, label: 'Blue' },
  { value: 'rgb', label: 'All' },
];

const VARIANTS = [
  { value: 'clean', label: 'Clean' },
  { value: 'ordered', label: 'Message in order' },
  { value: 'scattered', label: 'Message scattered' },
];

export default function BitPlaneViewer({ initialBit = 0, showVariants = true }) {
  const cover = useMemo(() => generateLandscape(480, 300, 8, { grain: 0 }), []);
  const [variant, setVariant] = useState('clean');
  const [size, setSize] = useState(30);
  const [channel, setChannel] = useState('rgb');
  const [bit, setBit] = useState(initialBit);
  const [stego, setStego] = useState(null);

  useEffect(() => {
    if (variant === 'clean') {
      setStego(null);
      return undefined;
    }
    let alive = true;
    const rand = seededRandom(5);
    const payload = Uint8Array.from({ length: Math.floor((imageCapacity(cover) * size) / 100) }, () => Math.floor(rand() * 256));
    hideInImage(cover, payload, { password: variant === 'scattered' ? 'demo' : '' }).then(({ image }) => alive && setStego(image));
    return () => {
      alive = false;
    };
  }, [cover, variant, size]);

  const image = variant === 'clean' ? cover : stego || cover;
  const plane = useMemo(() => bitPlane(image, channel, bit), [image, channel, bit]);

  return (
    <Figure
      title="Bit-plane slicer"
      caption="Pick a bit to see only that bit of every pixel: white = 1, black = 0. The high bits draw the picture; the lowest bit should look like fine texture. Hide a message and watch what happens to bit 0."
    >
      <div className="flex flex-wrap items-center gap-3">
        {showVariants && <Segmented label="Picture" value={variant} onChange={setVariant} options={VARIANTS} size="sm" />}
        <Segmented label="Colour channel" value={channel} onChange={setChannel} options={CHANNELS} size="sm" />
      </div>

      <div className="mt-4">
        <p className="mb-1.5 text-sm font-medium text-ink">Bit plane</p>
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Bit plane">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={bit === b}
              onClick={() => setBit(b)}
              className={`h-9 min-w-11 rounded-lg border px-2 font-mono text-sm transition-colors ${
                bit === b ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface-2 text-muted hover:text-ink'
              }`}
            >
              {b}
              {b === 7 ? ' MSB' : b === 0 ? ' LSB' : ''}
            </button>
          ))}
        </div>
      </div>

      {showVariants && variant !== 'clean' && (
        <Slider className="mt-4" label="Message size" min={5} max={100} step={5} value={size} onChange={setSize} format={(v) => `${v}% of capacity`} />
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">The picture</p>
          <ImageCanvas image={image} className="w-full rounded-lg border border-line" label="Picture" />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">
            Bit {bit} {channel === 'rgb' ? 'of every channel' : `of ${CHANNELS[channel].label.toLowerCase()}`}
          </p>
          <ImageCanvas image={plane} pixelated className="w-full rounded-lg border border-line" label={`Bit plane ${bit}`} />
        </div>
      </div>
    </Figure>
  );
}
