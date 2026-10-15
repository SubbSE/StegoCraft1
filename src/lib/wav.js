// Minimal WAV reader/writer. Hidden bits live in exact 16-bit sample values, so we read and write
// WAV ourselves instead of trusting the browser's decoder (which may resample and destroy them).

import { StegoError } from './errors';

const str = (bytes, offset, len) => String.fromCharCode(...bytes.subarray(offset, offset + len));

export function isWav(bytes) {
  return bytes.length >= 12 && str(bytes, 0, 4) === 'RIFF' && str(bytes, 8, 4) === 'WAVE';
}

/** Parse a WAV file to { sampleRate, channels, samples: Int16Array (interleaved), converted }. */
export function parseWav(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (!isWav(bytes)) throw new StegoError('unsupported-file', 'This is not a WAV file.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  let fmt = null;
  let data = null;
  for (let off = 12; off + 8 <= bytes.length; ) {
    const id = str(bytes, off, 4);
    const size = view.getUint32(off + 4, true);
    const start = off + 8;
    if (id === 'fmt ') {
      fmt = {
        format: view.getUint16(start, true),
        channels: view.getUint16(start + 2, true),
        sampleRate: view.getUint32(start + 4, true),
        bits: view.getUint16(start + 14, true),
      };
      if (fmt.format === 0xfffe && size >= 26) fmt.format = view.getUint16(start + 24, true); // WAVE_FORMAT_EXTENSIBLE
    } else if (id === 'data') {
      data = { start, size: Math.min(size, bytes.length - start) };
    }
    off = start + size + (size & 1);
  }
  if (!fmt || !data || !fmt.channels) throw new StegoError('unsupported-file', 'This WAV file is missing audio data.');

  const { format, channels, bits, sampleRate } = fmt;
  const width = bits / 8;
  const n = Math.floor(data.size / (width * channels)) * channels;
  const samples = new Int16Array(n);
  const s0 = data.start;

  if (format === 1 && bits === 16) {
    for (let i = 0; i < n; i++) samples[i] = view.getInt16(s0 + i * 2, true);
  } else if (format === 1 && bits === 8) {
    for (let i = 0; i < n; i++) samples[i] = (bytes[s0 + i] - 128) << 8;
  } else if (format === 1 && bits === 24) {
    for (let i = 0; i < n; i++) {
      const o = s0 + i * 3;
      samples[i] = ((bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16)) << 8) >> 16;
    }
  } else if (format === 1 && bits === 32) {
    for (let i = 0; i < n; i++) samples[i] = view.getInt32(s0 + i * 4, true) >> 16;
  } else if (format === 3 && (bits === 32 || bits === 64)) {
    for (let i = 0; i < n; i++) {
      const f = bits === 32 ? view.getFloat32(s0 + i * 4, true) : view.getFloat64(s0 + i * 8, true);
      samples[i] = floatToInt16Sample(f);
    }
  } else {
    throw new StegoError('unsupported-file', 'This WAV encoding is not supported. Try a 16-bit PCM WAV file.');
  }
  return { sampleRate, channels, samples, converted: !(format === 1 && bits === 16) };
}

/** Encode interleaved 16-bit samples as a PCM WAV file. */
export function encodeWav({ sampleRate, channels, samples }) {
  const dataBytes = samples.length * 2;
  const bytes = new Uint8Array(44 + dataBytes);
  const view = new DataView(bytes.buffer);
  const put = (off, s) => [...s].forEach((ch, i) => (bytes[off + i] = ch.charCodeAt(0)));
  put(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  put(8, 'WAVE');
  put(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  put(36, 'data');
  view.setUint32(40, dataBytes, true);
  for (let i = 0; i < samples.length; i++) view.setInt16(44 + i * 2, samples[i], true);
  return bytes;
}

export function floatToInt16Sample(f) {
  const x = Math.max(-1, Math.min(1, f));
  return x < 0 ? Math.round(x * 32768) : Math.round(x * 32767);
}

/** Interleave per-channel float data (e.g. from a decoded AudioBuffer) into 16-bit samples. */
export function interleaveFloat(channelData) {
  const channels = channelData.length;
  const frames = channelData[0].length;
  const out = new Int16Array(frames * channels);
  for (let f = 0; f < frames; f++) {
    for (let c = 0; c < channels; c++) out[f * channels + c] = floatToInt16Sample(channelData[c][f]);
  }
  return out;
}

/** One channel of interleaved 16-bit samples as floats in [-1, 1]. */
export function channelToFloat(samples, channels, channel = 0) {
  const frames = Math.floor(samples.length / channels);
  const out = new Float32Array(frames);
  for (let f = 0; f < frames; f++) out[f] = samples[f * channels + channel] / 32768;
  return out;
}
