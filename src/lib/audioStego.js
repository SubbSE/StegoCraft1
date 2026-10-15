// Hiding bytes in the least significant bits of 16-bit audio samples.
// Audio is a plain { sampleRate, channels, samples: Int16Array (interleaved) } object.

import { embedBytes, extractBytes, maxPayloadBytes } from './carrier';

export const audioCarrier = (audio) => ({ values: audio.samples, count: audio.samples.length, indexAt: (k) => k });

export const cloneAudio = (audio) => ({ ...audio, samples: new Int16Array(audio.samples) });

export const audioCapacity = (audio, bitsPerCell = 1) => maxPayloadBytes(audioCarrier(audio), bitsPerCell);

export async function hideInAudio(audio, payload, options = {}) {
  const out = cloneAudio(audio);
  const stats = await embedBytes(audioCarrier(out), payload, options);
  return { audio: out, ...stats };
}

export const revealFromAudio = (audio, options = {}) => extractBytes(audioCarrier(audio), options);

/** Signal-to-noise ratio of `b` relative to `a`, in dB (higher = quieter change). */
export function snr(a, b) {
  let signal = 0;
  let noise = 0;
  for (let i = 0; i < a.samples.length; i++) {
    const s = a.samples[i];
    const d = b.samples[i] - s;
    signal += s * s;
    noise += d * d;
  }
  return noise === 0 ? Infinity : 10 * Math.log10(signal / noise);
}

/** The difference between two clips, amplified so it becomes audible. */
export function differenceAudio(a, b, gain = 256) {
  const out = new Int16Array(a.samples.length);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(-32768, Math.min(32767, (b.samples[i] - a.samples[i]) * gain));
  return { ...a, samples: out };
}
