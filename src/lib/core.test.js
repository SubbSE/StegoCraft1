import { describe, expect, it } from 'vitest';
import { bitsToBytes, bytesToBits, crc32, utf8Decode, utf8Encode } from './bytes';
import { buildPayload, HEADER_BYTES, openFramed, parseHeader, payloadSize } from './payload';
import { KeyedPermutation, Sequence } from './prng';
import { StegoError } from './errors';

const MULTILINGUAL = 'Hello · নমস্কার · नमस्ते · 你好 · مرحبا · Привет · 👋🏽🔐';

describe('bytes', () => {
  it('round-trips text in any script through UTF-8', () => {
    expect(utf8Decode(utf8Encode(MULTILINGUAL))).toBe(MULTILINGUAL);
  });

  it('round-trips bits', () => {
    const bytes = Uint8Array.from([0, 1, 127, 128, 255, 0x5a]);
    expect(bitsToBytes(bytesToBits(bytes))).toEqual(bytes);
    expect([...bytesToBits(Uint8Array.of(0b10110001))]).toEqual([1, 0, 1, 1, 0, 0, 0, 1]);
  });

  it('computes the standard CRC-32 check value', () => {
    expect(crc32(utf8Encode('123456789'))).toBe(0xcbf43926);
  });
});

describe('payload', () => {
  it('frames and opens a text message', async () => {
    const framed = await buildPayload({ text: MULTILINGUAL });
    expect(framed.length).toBe(payloadSize({ text: MULTILINGUAL }));
    expect(parseHeader(framed.subarray(0, HEADER_BYTES))).toMatchObject({ encrypted: false, isFile: false });
    expect(await openFramed(framed)).toEqual({ kind: 'text', text: MULTILINGUAL });
  });

  it('encrypts with a password and rejects a wrong one', async () => {
    const framed = await buildPayload({ text: 'meet at dawn', password: 'correct horse' });
    expect(framed.length).toBe(payloadSize({ text: 'meet at dawn', encrypted: true }));
    expect(await openFramed(framed, 'correct horse')).toEqual({ kind: 'text', text: 'meet at dawn' });
    await expect(openFramed(framed)).rejects.toMatchObject({ code: 'needs-password' });
    await expect(openFramed(framed, 'wrong')).rejects.toMatchObject({ code: 'wrong-password' });
  });

  it('frames files with their name and type', async () => {
    const bytes = Uint8Array.from({ length: 300 }, (_, i) => (i * 7) & 255);
    const file = { name: 'plan-নকশা.pdf', type: 'application/pdf', bytes, size: bytes.length };
    const framed = await buildPayload({ file });
    expect(framed.length).toBe(payloadSize({ file }));
    const opened = await openFramed(framed);
    expect(opened).toMatchObject({ kind: 'file', name: 'plan-নকশা.pdf', type: 'application/pdf' });
    expect(opened.bytes).toEqual(bytes);
  });

  it('detects corruption and noise', async () => {
    const framed = await buildPayload({ text: 'abc' });
    framed[framed.length - 1] ^= 1;
    await expect(openFramed(framed)).rejects.toMatchObject({ code: 'corrupted' });
    expect(parseHeader(Uint8Array.from({ length: 12 }, () => 0x41))).toBeNull();
    await expect(openFramed(new Uint8Array(40))).rejects.toBeInstanceOf(StegoError);
  });
});

describe('prng', () => {
  it('KeyedPermutation visits every index exactly once', () => {
    for (const n of [1, 2, 3, 7, 100, 1000, 4097]) {
      const perm = new KeyedPermutation(n, [1, 2, 3, 4]);
      const seen = new Set(Array.from({ length: n }, () => perm.next()));
      expect(seen.size).toBe(n);
      expect(Math.max(...seen)).toBe(n - 1);
    }
  });

  it('is deterministic for a seed and differs between seeds', () => {
    const a = new KeyedPermutation(10000, [9, 9, 9, 9]);
    const b = new KeyedPermutation(10000, [9, 9, 9, 9]);
    const c = new KeyedPermutation(10000, [1, 9, 9, 9]);
    const first = (p) => Array.from({ length: 20 }, () => p.next());
    const fa = first(a);
    expect(first(b)).toEqual(fa);
    expect(first(c)).not.toEqual(fa);
  });

  it('scatters positions across the whole range', () => {
    const perm = new KeyedPermutation(100000, [5, 6, 7, 8]);
    const quarters = [0, 0, 0, 0];
    for (let i = 0; i < 2000; i++) quarters[Math.floor(perm.next() / 25000)]++;
    quarters.forEach((q) => expect(q).toBeGreaterThan(400));
  });

  it('Sequence counts up', () => {
    const s = new Sequence(3);
    expect([s.next(), s.next(), s.next()]).toEqual([0, 1, 2]);
    expect(() => s.next()).toThrow();
  });
});
