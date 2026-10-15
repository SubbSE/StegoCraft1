// Hiding bytes in the least significant bits of an image's red, green and blue values.
// Images are plain { width, height, data } objects (data = RGBA bytes), like the browser's ImageData.

import { embedBytes, extractBytes, maxPayloadBytes } from './carrier';

export const MAX_PIXELS = 24_000_000;

/**
 * Usable cells are the R, G and B values of every fully opaque pixel. Semi-transparent pixels are
 * skipped: browsers store them "premultiplied", which would silently destroy the hidden bits.
 */
export function imageCarrier(image) {
  const { data, width, height } = image;
  const pixels = width * height;
  let transparent = 0;
  for (let p = 0; p < pixels; p++) if (data[p * 4 + 3] !== 255) transparent++;

  if (transparent === 0) {
    return { values: data, count: pixels * 3, indexAt: (k) => ((k / 3) | 0) * 4 + (k % 3), skipped: 0 };
  }
  const opaque = new Uint32Array(pixels - transparent);
  for (let p = 0, n = 0; p < pixels; p++) if (data[p * 4 + 3] === 255) opaque[n++] = p;
  return {
    values: data,
    count: opaque.length * 3,
    indexAt: (k) => opaque[(k / 3) | 0] * 4 + (k % 3),
    skipped: transparent,
  };
}

export const cloneImage = (image) => ({ width: image.width, height: image.height, data: new Uint8ClampedArray(image.data) });

export const imageCapacity = (image, bitsPerCell = 1) => maxPayloadBytes(imageCarrier(image), bitsPerCell);

/** Returns a new image with the payload hidden in it (the input is not modified). */
export async function hideInImage(image, payload, options = {}) {
  const out = cloneImage(image);
  const stats = await embedBytes(imageCarrier(out), payload, options);
  return { image: out, ...stats };
}

export const revealFromImage = (image, options = {}) => extractBytes(imageCarrier(image), options);

/** Peak signal-to-noise ratio over the RGB channels, in dB (higher = more similar; ∞ = identical). */
export function psnr(a, b) {
  let se = 0;
  let n = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const d = a.data[i + c] - b.data[i + c];
      se += d * d;
      n++;
    }
  }
  return se === 0 ? Infinity : 10 * Math.log10((255 * 255) / (se / n));
}

/** Image highlighting changed pixels: unchanged → dark, changed → bright (amplified difference). */
export function diffImage(a, b, gain = 64) {
  const out = new Uint8ClampedArray(a.data.length);
  for (let i = 0; i < a.data.length; i += 4) {
    for (let c = 0; c < 3; c++) out[i + c] = Math.min(255, Math.abs(a.data[i + c] - b.data[i + c]) * gain);
    out[i + 3] = 255;
  }
  return { width: a.width, height: a.height, data: out };
}
