import { useMemo, useState } from 'react';
import { Figure, Stat } from '../components/ui/display';
import { Slider } from '../components/ui/controls';
import ImageCanvas from '../components/media/ImageCanvas';
import { generateLandscape } from '../lib/synth';
import { cloneImage, psnr } from '../lib/imageStego';
import { formatBytes } from '../lib/bytes';
import { seededRandom } from '../lib/prng';

/** Fills the lowest `bits` bits of every colour value with random "message" data. */
function fillWithNoise(image, bits) {
  const out = cloneImage(image);
  const mask = (1 << bits) - 1;
  const rand = seededRandom(99);
  for (let i = 0; i < out.data.length; i += 4) {
    for (let c = 0; c < 3; c++) out.data[i + c] = (out.data[i + c] & ~mask) | Math.floor(rand() * (mask + 1));
  }
  return out;
}

export default function BitDepthDemo() {
  const image = useMemo(() => generateLandscape(480, 300, 5), []);
  const [bits, setBits] = useState(1);
  const stego = useMemo(() => fillWithNoise(image, bits), [image, bits]);
  const score = useMemo(() => psnr(image, stego), [image, stego]);
  const capacity = (image.width * image.height * 3 * bits) / 8;

  return (
    <Figure title="How many bits can you take?" caption="Here the hiding space is completely full of random data (which is what an encrypted message looks like). Up to about 3 bits per value the picture survives; beyond that, the secret starts to show.">
      <Slider label="Bits used per colour value" min={1} max={8} value={bits} onChange={setBits} format={(v) => `${v} of 8`} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Original</p>
          <ImageCanvas image={image} className="w-full rounded-lg border border-line" label="Original" />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Full of hidden data</p>
          <ImageCanvas image={stego} className="w-full rounded-lg border border-line" label={`Image with ${bits} bits per value replaced`} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Capacity" value={formatBytes(capacity)} hint={`in a ${image.width}×${image.height} image`} />
        <Stat label="PSNR" value={`${score.toFixed(1)} dB`} hint={score > 40 ? 'Looks identical' : score > 30 ? 'Subtle grain' : 'Clearly damaged'} tone={score > 40 ? 'secret' : score > 30 ? 'warn' : 'danger'} />
        <Stat label="Max change" value={`±${(1 << bits) - 1}`} hint="per colour value" />
      </div>
    </Figure>
  );
}
