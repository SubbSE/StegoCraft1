// Procedurally generated sample media, so lessons and challenges work without downloading anything.

import { seededRandom } from './prng';
import { floatToInt16Sample } from './wav';

const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
const mix = (a, b, t) => a + (b - a) * t;
const mixRgb = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

function ridge(rand, octaves = 5, base = 3) {
  const layers = Array.from({ length: octaves }, (_, o) => {
    const n = base * 2 ** o + 2;
    return Float32Array.from({ length: n }, () => rand());
  });
  return (x) => {
    let v = 0;
    let amp = 0.5;
    let norm = 0;
    layers.forEach((vals, o) => {
      const p = x * (base * 2 ** o);
      const i = Math.floor(p);
      const t = p - i;
      const s = t * t * (3 - 2 * t);
      v += amp * mix(vals[i], vals[i + 1], s);
      norm += amp;
      amp *= 0.5;
    });
    return v / norm;
  };
}

/**
 * A sunset mountain landscape. Includes sensor-like grain and a final contrast stretch — like real
 * camera pipelines, which leave small gaps in the histogram (useful for the chi-square lesson).
 * grain = 0 gives a perfectly smooth picture, whose low bit planes still show structure.
 */
export function generateLandscape(width = 640, height = 400, seed = 42, { grain = 5 } = {}) {
  const rand = seededRandom(seed);
  const data = new Uint8ClampedArray(width * height * 4);
  const sun = { x: width * 0.7, y: height * 0.5, r: height * 0.075 };
  const layers = [
    { base: 0.5, amp: 0.16, color: [132, 96, 156], fn: ridge(rand, 5, 2) },
    { base: 0.6, amp: 0.15, color: [86, 62, 126], fn: ridge(rand, 5, 3) },
    { base: 0.71, amp: 0.13, color: [46, 38, 86], fn: ridge(rand, 5, 3) },
    { base: 0.84, amp: 0.07, color: [22, 24, 52], fn: ridge(rand, 4, 2) },
  ];
  const skyStops = [
    [0, [22, 28, 70]],
    [0.35, [78, 62, 138]],
    [0.62, [226, 122, 104]],
    [0.78, [255, 190, 122]],
  ];
  const sky = (t) => {
    for (let i = 1; i < skyStops.length; i++) {
      if (t <= skyStops[i][0]) {
        const [t0, c0] = skyStops[i - 1];
        const [t1, c1] = skyStops[i];
        return mixRgb(c0, c1, (t - t0) / (t1 - t0));
      }
    }
    return skyStops[skyStops.length - 1][1];
  };

  for (let x = 0; x < width; x++) {
    const tops = layers.map((l) => (l.base - l.amp * l.fn(x / width)) * height);
    for (let y = 0; y < height; y++) {
      let c = sky(y / height);
      const d = Math.hypot(x - sun.x, y - sun.y);
      if (d < sun.r) c = [255, 238, 200];
      else c = mixRgb(c, [255, 214, 160], 0.55 * Math.exp(-(d - sun.r) / (height * 0.12)));
      layers.forEach((l, i) => {
        if (y >= tops[i]) {
          const depth = Math.min(1, (y - tops[i]) / (height * 0.35));
          c = mixRgb(l.color, [l.color[0] * 0.55, l.color[1] * 0.55, l.color[2] * 0.6], depth);
          if (i < 2) c = mixRgb(c, [255, 180, 140], 0.12 * (1 - i * 0.5));
        }
      });
      const o = (y * width + x) * 4;
      for (let k = 0; k < 3; k++) {
        const noise = grain ? (rand() + rand() + rand() - 1.5) * grain : 0;
        const v = Math.round(clamp255(c[k] + noise));
        data[o + k] = clamp255(Math.round((v - 6) * 1.06));
      }
      data[o + 3] = 255;
    }
  }
  return { width, height, data };
}

/** A short, gentle melody (mono, 16-bit) with a faint noise floor like a real recording. */
export function generateMelody({ sampleRate = 22050, seconds = 4, seed = 7 } = {}) {
  const rand = seededRandom(seed);
  const n = Math.floor(sampleRate * seconds);
  const out = new Float32Array(n);
  const semis = [0, 4, 7, 12, 9, 7, 4, 2, 0, 4, 7, 11, 12, 7, 4, 0];
  const noteLen = n / semis.length;
  semis.forEach((s, k) => {
    const f = 261.63 * 2 ** (s / 12);
    const start = Math.floor(k * noteLen);
    const len = Math.floor(noteLen * 1.6);
    for (let i = 0; i < len && start + i < n; i++) {
      const t = i / sampleRate;
      const env = Math.min(1, t / 0.012) * Math.exp(-3.2 * t);
      const w = 2 * Math.PI * f * t;
      out[start + i] += 0.32 * env * (Math.sin(w) + 0.3 * Math.sin(2 * w) + 0.1 * Math.sin(3 * w));
    }
    if (k % 4 === 0) {
      const fb = f / 2;
      for (let i = 0; i < noteLen * 4 && start + i < n; i++) {
        const t = i / sampleRate;
        out[start + i] += 0.18 * Math.min(1, t / 0.02) * Math.exp(-1.2 * t) * Math.sin(2 * Math.PI * fb * t);
      }
    }
  });
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const samples = new Int16Array(n);
  for (let i = 0; i < n; i++) samples[i] = floatToInt16Sample((out[i] / peak) * 0.7 + (rand() - 0.5) * 0.0015);
  return { sampleRate, channels: 1, samples };
}

/**
 * Turns a bitmap into sound whose spectrogram shows the bitmap: every row is a sine tone
 * (top row = highest pitch) that is switched on wherever the row has ink.
 * mask: { width, height, data } with data[y * width + x] in 0…1.
 */
export function synthesizeFromMask(mask, { sampleRate = 22050, seconds = 4, fMin = 1200, fMax = 7500, seed = 3 } = {}) {
  const rand = seededRandom(seed);
  const n = Math.floor(sampleRate * seconds);
  const out = new Float32Array(n);
  const rows = mask.height;
  const freqs = Float64Array.from({ length: rows }, (_, r) => fMax - ((fMax - fMin) * r) / Math.max(1, rows - 1));
  const phases = Float64Array.from({ length: rows }, () => rand() * 2 * Math.PI);
  const colLen = n / mask.width;
  for (let i = 0; i < n; i++) {
    const p = i / colLen;
    const c = Math.min(mask.width - 1, Math.floor(p));
    const c2 = Math.min(mask.width - 1, c + 1);
    const frac = p - c;
    let s = 0;
    for (let r = 0; r < rows; r++) {
      const a = mask.data[r * mask.width + c] * (1 - frac) + mask.data[r * mask.width + c2] * frac;
      phases[r] += (2 * Math.PI * freqs[r]) / sampleRate;
      if (a > 0) s += a * Math.sin(phases[r]);
    }
    out[i] = s;
  }
  let peak = 1e-9;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const samples = new Int16Array(n);
  for (let i = 0; i < n; i++) samples[i] = floatToInt16Sample((out[i] / peak) * 0.6 + (rand() - 0.5) * 0.004);
  return { sampleRate, channels: 1, samples };
}
