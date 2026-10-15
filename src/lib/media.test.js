import { describe, expect, it } from 'vitest';
import { buildPayload, openPayload } from './payload';
import { cloneImage, hideInImage, imageCapacity, psnr, revealFromImage } from './imageStego';
import { hideInAudio, revealFromAudio, snr } from './audioStego';
import { encodeWav, parseWav } from './wav';
import { generateLandscape, generateMelody } from './synth';
import { readRawBytes } from './carrier';
import { imageCarrier } from './imageStego';

const MESSAGE = 'নমস্কার! Meet at the old library — 7pm 🔐';

function noisyImage(w, h, seed = 1) {
  const data = new Uint8ClampedArray(w * h * 4);
  let x = seed;
  for (let i = 0; i < data.length; i++) {
    x = (x * 1103515245 + 12345) >>> 0;
    data[i] = (i & 3) === 3 ? 255 : x >>> 24;
  }
  return { width: w, height: h, data };
}

describe('image LSB', () => {
  it('round-trips at every depth, with and without a password', async () => {
    const cover = noisyImage(64, 48);
    for (const bitsPerCell of [1, 2, 3, 4]) {
      for (const password of ['', 'p@ss']) {
        const payload = await buildPayload({ text: MESSAGE, password });
        const { image } = await hideInImage(cover, payload, { bitsPerCell, password });
        const found = await revealFromImage(image, { password });
        expect(found.bitsPerCell).toBe(bitsPerCell);
        expect(await openPayload(found.header, found.body, password)).toEqual({ kind: 'text', text: MESSAGE });
      }
    }
  });

  it('does not modify the cover and keeps the change tiny', async () => {
    const cover = generateLandscape(160, 100, 5);
    const before = cloneImage(cover);
    const { image, cellsChanged, cellsUsed } = await hideInImage(cover, await buildPayload({ text: MESSAGE }));
    expect(cover.data).toEqual(before.data);
    expect(cellsChanged).toBeLessThanOrEqual(cellsUsed);
    expect(psnr(cover, image)).toBeGreaterThan(60);
    for (let i = 0; i < image.data.length; i++) expect(Math.abs(image.data[i] - cover.data[i])).toBeLessThanOrEqual(1);
  });

  it('cannot find a password-scattered message without the password', async () => {
    const cover = noisyImage(64, 64, 9);
    const payload = await buildPayload({ text: 'secret', password: 'k' });
    const { image } = await hideInImage(cover, payload, { password: 'k' });
    await expect(revealFromImage(image)).rejects.toMatchObject({ code: 'no-payload' });
    await expect(revealFromImage(image, { password: 'nope' })).rejects.toMatchObject({ code: 'no-payload' });
  });

  it('finds an unscattered message even when a password is typed', async () => {
    const cover = noisyImage(32, 32);
    const { image } = await hideInImage(cover, await buildPayload({ text: 'hi' }));
    const found = await revealFromImage(image, { password: 'anything' });
    expect(found.scattered).toBe(false);
  });

  it('reports when the message is too big', async () => {
    const cover = noisyImage(8, 8);
    expect(imageCapacity(cover, 1)).toBe(24);
    const payload = await buildPayload({ text: 'x'.repeat(40) });
    await expect(hideInImage(cover, payload)).rejects.toMatchObject({ code: 'too-large' });
  });

  it('skips transparent pixels', async () => {
    const cover = noisyImage(16, 16);
    for (let p = 0; p < 256; p += 2) cover.data[p * 4 + 3] = 128;
    expect(imageCarrier(cover).count).toBe(128 * 3);
    const { image } = await hideInImage(cover, await buildPayload({ text: 'ok' }));
    for (let p = 0; p < 256; p += 2) {
      for (let c = 0; c < 4; c++) expect(image.data[p * 4 + c]).toBe(cover.data[p * 4 + c]);
    }
    const found = await revealFromImage(image);
    expect((await openPayload(found.header, found.body)).text).toBe('ok');
  });

  it('reads raw bytes for visualisations', async () => {
    const cover = noisyImage(16, 16);
    const payload = await buildPayload({ text: 'raw' });
    const { image } = await hideInImage(cover, payload);
    expect(await readRawBytes(imageCarrier(image), payload.length)).toEqual(payload);
  });
});

describe('audio LSB and WAV', () => {
  it('round-trips through a real WAV file, including negative samples', async () => {
    const audio = generateMelody({ seconds: 1 });
    expect(audio.samples.some((s) => s < 0)).toBe(true);
    const payload = await buildPayload({ text: MESSAGE, password: 'tune' });
    const { audio: stego } = await hideInAudio(audio, payload, { password: 'tune', bitsPerCell: 2 });
    const parsed = parseWav(encodeWav(stego));
    expect(parsed.converted).toBe(false);
    expect(parsed.samples).toEqual(stego.samples);
    const found = await revealFromAudio(parsed, { password: 'tune' });
    expect((await openPayload(found.header, found.body, 'tune')).text).toBe(MESSAGE);
    expect(snr(audio, stego)).toBeGreaterThan(40);
  });

  it('changes each sample by at most the hidden bits', async () => {
    const audio = { sampleRate: 8000, channels: 2, samples: Int16Array.from([-32768, -5, -1, 0, 1, 5, 32767, -300, 300, -2]) };
    const { audio: out } = await hideInAudio(audio, Uint8Array.of(0b10101010), { bitsPerCell: 1 });
    out.samples.forEach((s, i) => expect(Math.abs(s - audio.samples[i])).toBeLessThanOrEqual(1));
    expect([...out.samples.slice(0, 8)].map((s) => s & 1)).toEqual([1, 0, 1, 0, 1, 0, 1, 0]);
  });

  it('parses 8-bit and 24-bit PCM', () => {
    const make = (bits, sampleBytes) => {
      const wav = encodeWav({ sampleRate: 8000, channels: 1, samples: new Int16Array(0) });
      const bytes = new Uint8Array(44 + sampleBytes.length);
      bytes.set(wav);
      const v = new DataView(bytes.buffer);
      v.setUint32(4, 36 + sampleBytes.length, true);
      v.setUint16(32, bits / 8, true);
      v.setUint16(34, bits, true);
      v.setUint32(40, sampleBytes.length, true);
      bytes.set(sampleBytes, 44);
      return bytes;
    };
    expect([...parseWav(make(8, [128, 255, 0])).samples]).toEqual([0, 127 << 8, -32768]);
    expect([...parseWav(make(24, [0x00, 0x00, 0x80, 0xff, 0xff, 0x7f])).samples]).toEqual([-32768, 32767]);
  });
});
