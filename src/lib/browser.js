// Browser-only helpers: loading and saving images and audio, drawing to canvases.

import { StegoError } from './errors';
import { MAX_PIXELS } from './imageStego';
import { encodeWav, interleaveFloat, isWav, parseWav } from './wav';

const MAX_AUDIO_SAMPLES = 60 * 48000 * 2 * 10; // ~10 minutes of stereo audio

function context2d(canvas) {
  return canvas.getContext('2d', { willReadFrequently: true });
}

/**
 * Decode an image file into RGBA pixels.
 * raw = true skips colour-profile conversion so we see the exact stored values (for analysis).
 */
export async function loadImageFile(file, { raw = false } = {}) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, {
      colorSpaceConversion: raw ? 'none' : 'default',
      premultiplyAlpha: 'none',
    });
  } catch {
    throw new StegoError('unsupported-file', "This image couldn't be opened. Try a PNG or JPEG file.");
  }
  const { width, height } = bitmap;
  if (width * height > MAX_PIXELS) {
    bitmap.close?.();
    throw new StegoError(
      'unsupported-file',
      `This image is ${((width * height) / 1e6).toFixed(0)} megapixels — please use one under ${MAX_PIXELS / 1e6} megapixels.`,
    );
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = context2d(canvas);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  const { data } = ctx.getImageData(0, 0, width, height);
  return { width, height, data };
}

export function toImageData(image) {
  return image instanceof ImageData ? image : new ImageData(image.data, image.width, image.height);
}

/** Draw an image object onto a canvas, resizing the canvas to fit. */
export function drawImage(canvas, image) {
  if (!canvas || !image) return;
  if (canvas.width !== image.width) canvas.width = image.width;
  if (canvas.height !== image.height) canvas.height = image.height;
  context2d(canvas).putImageData(toImageData(image), 0, 0);
}

export function imageToBlob(image, type = 'image/png', quality) {
  const canvas = document.createElement('canvas');
  drawImage(canvas, image);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode image'))), type, quality),
  );
}

/** Re-encode through JPEG at a given quality and decode again (to show what compression does). */
export async function jpegRoundTrip(image, quality) {
  const blob = await imageToBlob(image, 'image/jpeg', quality);
  return { image: await loadImageFile(blob, { raw: true }), size: blob.size };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const downloadBytes = (bytes, filename, type = 'application/octet-stream') =>
  downloadBlob(new Blob([bytes], { type }), filename);

export const stemName = (name = 'file') => name.replace(/\.[^./\\]+$/, '') || 'file';

/** Load audio. WAV files are read exactly; other formats are decoded by the browser. */
export async function loadAudioFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let audio;
  if (isWav(bytes)) {
    audio = { ...parseWav(bytes), decoded: false };
  } else {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    try {
      const buffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
      const channels = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c));
      audio = {
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        samples: interleaveFloat(channels),
        converted: true,
        decoded: true,
      };
    } catch {
      throw new StegoError('unsupported-file', "This audio file couldn't be decoded. Try a WAV or MP3 file.");
    } finally {
      ctx.close?.();
    }
  }
  if (audio.samples.length > MAX_AUDIO_SAMPLES) {
    throw new StegoError('unsupported-file', 'This recording is too long. Please use a clip under 10 minutes.');
  }
  return audio;
}

export const audioToBlob = (audio) => new Blob([encodeWav(audio)], { type: 'audio/wav' });

/** Render text into a 0–1 bitmap mask (used to draw messages into bit planes and spectrograms). */
export function renderTextMask(lines, { width, height, font = '700 48px "Space Grotesk Variable", sans-serif', lineHeight = 1.15 }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = context2d(canvas);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const list = Array.isArray(lines) ? lines : [lines];
  const size = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)?.[1] || '48');
  const step = size * lineHeight;
  list.forEach((line, i) => ctx.fillText(line, width / 2, height / 2 + (i - (list.length - 1) / 2) * step));
  const { data } = ctx.getImageData(0, 0, width, height);
  const mask = new Float32Array(width * height);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4] / 255;
  return { width, height, data: mask };
}
