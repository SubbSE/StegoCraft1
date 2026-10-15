import { describe, expect, it } from 'vitest';
import { buildPayload } from './payload';
import {
  baconDecode,
  baconEncode,
  hideDoubleSpace,
  hideHomoglyphs,
  hideTrailingWhitespace,
  hideZeroWidth,
  nthLetters,
  revealDoubleSpace,
  revealHomoglyphs,
  revealTrailingWhitespace,
  revealZeroWidth,
  scanText,
  ZERO_WIDTH,
} from './textStego';
import { bitPlane, chiSquareCurve, chiSquareProbability, gammaP, histogram } from './analysis';
import { hideInImage, imageCapacity } from './imageStego';
import { generateLandscape } from './synth';
import { dct8, fft, idct8, JPEG_LUMA_TABLE, quantTable } from './dsp';

const COVER = 'আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। The quick brown fox 🦊 jumps over the lazy dog.';

describe('zero-width text', () => {
  it('round-trips multilingual payloads without changing the visible text', async () => {
    const payload = await buildPayload({ text: 'গোপন বার্তা 🤫 秘密' });
    const stego = hideZeroWidth(COVER, payload);
    expect(stego.replace(/[​-‍⁠]/g, '')).toBe(COVER);
    expect(await revealZeroWidth(stego)).toEqual({ kind: 'text', text: 'গোপন বার্তা 🤫 秘密' });
  });

  it('only places invisible characters right after whitespace', async () => {
    const stego = hideZeroWidth(COVER, await buildPayload({ text: 'hi' }));
    const chars = Array.from(stego);
    chars.forEach((ch, i) => {
      if (ZERO_WIDTH.includes(ch)) {
        let j = i - 1;
        while (j >= 0 && ZERO_WIDTH.includes(chars[j])) j--;
        expect(j < 0 || /\s/.test(chars[j])).toBe(true);
      }
    });
  });

  it('works on text without spaces and with a password', async () => {
    const stego = hideZeroWidth('你好世界', await buildPayload({ text: 'x', password: 'pw' }));
    expect(await revealZeroWidth(stego, 'pw')).toEqual({ kind: 'text', text: 'x' });
    await expect(revealZeroWidth('no secrets here')).rejects.toMatchObject({ code: 'no-payload' });
  });
});

describe('other text techniques', () => {
  it('trailing whitespace round-trips and keeps line endings', async () => {
    const cover = 'line one  \r\nline two\r\nline three';
    const stego = hideTrailingWhitespace(cover, await buildPayload({ text: 'snow' }));
    expect(stego.split('\r\n').map((l) => l.trimEnd())).toEqual(['line one', 'line two', 'line three']);
    expect(await revealTrailingWhitespace(stego)).toEqual({ kind: 'text', text: 'snow' });
  });

  it('homoglyphs carry bits and are detectable', () => {
    const bits = [1, 0, 1, 1, 0, 1];
    const stego = hideHomoglyphs('peace and coffee', bits);
    expect(stego).not.toBe('peace and coffee');
    expect(revealHomoglyphs(stego).slice(0, bits.length)).toEqual(bits);
    expect(scanText(stego).homoglyphs.length).toBe(4);
  });

  it('double spaces, null ciphers and Bacon', () => {
    expect(revealDoubleSpace(hideDoubleSpace('a b c d', [1, 0, 1]))).toEqual([1, 0, 1]);
    expect(nthLetters('Hidden Events Lurk Low, Ordinarily.')).toBe('HELLO');
    expect(nthLetters('Apparently neutral', 2)).toBe('pe');
    expect(baconEncode('Hi')).toBe('AABBBABAAA');
    expect(baconDecode(baconEncode('STEGO'))).toBe('STEGO');
  });

  it('scans for invisible characters', () => {
    const report = scanText('a​b﻿c  d \ne');
    expect(report.invisible.map((i) => i.name)).toEqual(['ZERO WIDTH SPACE', 'ZERO WIDTH NO-BREAK SPACE']);
    expect(report.trailingLines).toBe(1);
    expect(report.doubleSpaces).toBe(1);
  });
});

describe('steganalysis', () => {
  it('gammaP matches closed forms', () => {
    expect(gammaP(1, 2)).toBeCloseTo(1 - Math.exp(-2), 10);
    expect(gammaP(0.5, 0.5)).toBeCloseTo(0.6826894921, 8);
  });

  it('chi-square tells a clean image from a fully embedded one', async () => {
    const clean = generateLandscape(320, 200, 11);
    const pClean = chiSquareProbability(histogram(clean));
    const random = Uint8Array.from({ length: imageCapacity(clean) }, (_, i) => (i * 2654435761) >>> 24);
    const { image: stego } = await hideInImage(clean, random);
    const pStego = chiSquareProbability(histogram(stego));
    expect(pClean).toBeLessThan(0.05);
    expect(pStego).toBeGreaterThan(0.9);
  });

  it('the chi-square curve finds where a sequential message ends', async () => {
    const clean = generateLandscape(320, 200, 12);
    const third = Math.floor(imageCapacity(clean) / 3);
    const random = Uint8Array.from({ length: third }, (_, i) => (i * 2246822519) >>> 24);
    const { image } = await hideInImage(clean, random);
    const curve = chiSquareCurve(image, 20);
    expect(curve[3].p).toBeGreaterThan(0.9);
    expect(curve[19].p).toBeLessThan(0.05);
  });

  it('bit planes are black and white', () => {
    const plane = bitPlane(generateLandscape(40, 20, 1), 1, 0);
    for (let i = 0; i < plane.data.length; i += 4) expect([0, 255]).toContain(plane.data[i]);
  });
});

describe('dsp', () => {
  it('fft finds a pure tone', () => {
    const n = 256;
    const re = Float64Array.from({ length: n }, (_, i) => Math.sin((2 * Math.PI * 10 * i) / n));
    const im = new Float64Array(n);
    fft(re, im);
    const mags = Array.from({ length: n / 2 }, (_, k) => Math.hypot(re[k], im[k]));
    expect(mags.indexOf(Math.max(...mags))).toBe(10);
  });

  it('dct8 and idct8 are inverses', () => {
    const block = Float64Array.from({ length: 64 }, (_, i) => ((i * 37) % 255) - 128);
    const back = idct8(dct8(block));
    back.forEach((v, i) => expect(v).toBeCloseTo(block[i], 8));
  });

  it('quality 50 uses the standard table', () => {
    expect(quantTable(50)).toEqual(JPEG_LUMA_TABLE);
    expect(quantTable(100).every((q) => q === 1)).toBe(true);
  });
});
