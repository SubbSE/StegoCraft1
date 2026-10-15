// Signal processing helpers: FFT, spectrogram and the 8×8 DCT used by JPEG.

/** In-place iterative radix-2 FFT. re/im lengths must be a power of two. */
export function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k;
        const b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci;
        const ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = nr;
      }
    }
  }
}

/**
 * Short-time Fourier transform magnitudes in dB.
 * Returns { frames, bins, db: Float32Array(frames * bins), hop, size }, row-major by frame.
 */
export function spectrogram(signal, { size = 1024, hop = 256 } = {}) {
  const bins = size / 2;
  const frames = Math.max(1, Math.floor((signal.length - size) / hop) + 1);
  const db = new Float32Array(frames * bins);
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (size - 1));
  const re = new Float32Array(size);
  const im = new Float32Array(size);
  for (let f = 0; f < frames; f++) {
    const start = f * hop;
    for (let i = 0; i < size; i++) {
      re[i] = (signal[start + i] || 0) * window[i];
      im[i] = 0;
    }
    fft(re, im);
    for (let b = 0; b < bins; b++) {
      const mag = Math.hypot(re[b], im[b]) / bins;
      db[f * bins + b] = 20 * Math.log10(mag + 1e-9);
    }
  }
  return { frames, bins, db, hop, size };
}

/* ---------------- 8×8 DCT (JPEG) ---------------- */

const COS = new Float64Array(64);
for (let x = 0; x < 8; x++) for (let u = 0; u < 8; u++) COS[x * 8 + u] = Math.cos(((2 * x + 1) * u * Math.PI) / 16);
const alpha = (u) => (u === 0 ? Math.SQRT1_2 : 1);

/** Forward DCT of an 8×8 block (row-major, values centred around 0). */
export function dct8(block) {
  const out = new Float64Array(64);
  for (let v = 0; v < 8; v++) {
    for (let u = 0; u < 8; u++) {
      let sum = 0;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) sum += block[y * 8 + x] * COS[x * 8 + u] * COS[y * 8 + v];
      out[v * 8 + u] = 0.25 * alpha(u) * alpha(v) * sum;
    }
  }
  return out;
}

/** Inverse DCT of 8×8 coefficients. */
export function idct8(coeffs) {
  const out = new Float64Array(64);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let sum = 0;
      for (let v = 0; v < 8; v++) {
        for (let u = 0; u < 8; u++) sum += alpha(u) * alpha(v) * coeffs[v * 8 + u] * COS[x * 8 + u] * COS[y * 8 + v];
      }
      out[y * 8 + x] = 0.25 * sum;
    }
  }
  return out;
}

/** The standard JPEG luminance quantisation table (ITU-T T.81, Annex K). */
export const JPEG_LUMA_TABLE = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100,
  103, 99,
];

/** Quantisation table for a JPEG quality setting 1–100 (IJG scaling). */
export function quantTable(quality) {
  const q = Math.max(1, Math.min(100, quality));
  const scale = q < 50 ? 5000 / q : 200 - 2 * q;
  return JPEG_LUMA_TABLE.map((t) => Math.max(1, Math.min(255, Math.floor((t * scale + 50) / 100))));
}

/* ---------------- Echo hiding ---------------- */

/** y[n] = x[n] + gain · x[n − delay]: the sound plus one faint, very short echo. */
export function addEcho(signal, delay, gain = 0.5) {
  const out = new Float32Array(signal.length);
  for (let i = 0; i < signal.length; i++) out[i] = signal[i] + (i >= delay ? gain * signal[i - delay] : 0);
  return out;
}

/** Real cepstrum, IFFT(log |FFT(x)|), of a segment whose length is a power of two. */
export function realCepstrum(segment) {
  const n = segment.length;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = segment[i] * (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1)));
  fft(re, im);
  for (let i = 0; i < n; i++) {
    re[i] = Math.log(Math.hypot(re[i], im[i]) + 1e-12);
    im[i] = 0;
  }
  fft(re, im); // log-magnitude is real and even, so a forward FFT equals n × the inverse
  for (let i = 0; i < n; i++) re[i] /= n;
  return re;
}

/** Echo-hiding decoder: which of two delays left the stronger echo in this segment? */
export function detectEchoBit(segment, delay0, delay1) {
  const c = realCepstrum(segment);
  return { c0: c[delay0], c1: c[delay1], bit: c[delay1] > c[delay0] ? 1 : 0 };
}
