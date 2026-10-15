// Spectrogram images with a perceptually ordered dark-to-bright colour map (close to "magma").

import { spectrogram } from './dsp';

const STOPS = [
  [0, [0, 0, 4]],
  [0.25, [59, 15, 112]],
  [0.5, [140, 41, 129]],
  [0.75, [222, 73, 104]],
  [0.9, [254, 159, 109]],
  [1, [252, 253, 191]],
];

function colour(t) {
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, a] = STOPS[i - 1];
      const [t1, b] = STOPS[i];
      const f = (t - t0) / (t1 - t0);
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** Render a spectrogram image: time → x, frequency → y (high pitches at the top). */
export function spectrogramImage(signal, sampleRate, { size = 1024, hop = 256, maxFreq = sampleRate / 2, floorDb = -110, ceilDb = -25 } = {}) {
  const spec = spectrogram(signal, { size, hop });
  const bins = Math.min(spec.bins, Math.ceil((maxFreq / (sampleRate / 2)) * spec.bins));
  const data = new Uint8ClampedArray(spec.frames * bins * 4);
  for (let f = 0; f < spec.frames; f++) {
    for (let b = 0; b < bins; b++) {
      const t = Math.max(0, Math.min(1, (spec.db[f * spec.bins + b] - floorDb) / (ceilDb - floorDb)));
      const [r, g, bl] = colour(t);
      const o = ((bins - 1 - b) * spec.frames + f) * 4;
      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = bl;
      data[o + 3] = 255;
    }
  }
  return { width: spec.frames, height: bins, data };
}
