// Deterministic pseudo-randomness, so the same seed or password always gives the same result.

/** sfc32: small, fast, good-quality 32-bit generator. Returns uint32 values. */
export function sfc32([a, b, c, d]) {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  const next = () => {
    const t = (((a + b) >>> 0) + d) >>> 0;
    d = (d + 1) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) >>> 0;
    return t;
  };
  for (let i = 0; i < 12; i++) next(); // warm up
  return next;
}

/** Seeded generator returning floats in [0, 1). */
export function seededRandom(seed) {
  const words = typeof seed === 'number' ? [seed, seed ^ 0x9e3779b9, Math.imul(seed, 31), 0xdeadbeef] : seed;
  const next = sfc32(words);
  return () => next() / 4294967296;
}

function mix32(x) {
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

/** Visits 0, 1, 2, … n-1 in order. */
export class Sequence {
  constructor(n) {
    this.n = n;
    this.i = 0;
  }

  next() {
    if (this.i >= this.n) throw new RangeError('Sequence exhausted');
    return this.i++;
  }
}

/**
 * Visits 0 … n-1 in a password-dependent scrambled order, using constant memory.
 * It is a keyed Feistel network (a reversible scrambling of the bits of i) plus
 * "cycle walking" to stay inside the range — so every position is visited exactly once.
 */
export class KeyedPermutation {
  constructor(n, seedWords, rounds = 6) {
    this.n = n;
    this.i = 0;
    let bits = Math.max(2, Math.ceil(Math.log2(Math.max(2, n))));
    if (bits % 2) bits++;
    this.half = bits / 2;
    this.mask = (1 << this.half) - 1;
    const rng = sfc32(seedWords);
    this.keys = Array.from({ length: rounds }, () => rng());
  }

  permute(x) {
    const { half, mask, keys } = this;
    do {
      let l = x >>> half;
      let r = x & mask;
      for (const k of keys) {
        const t = l ^ (mix32(r ^ k) & mask);
        l = r;
        r = t;
      }
      x = (l << half) | r;
    } while (x >= this.n);
    return x;
  }

  next() {
    if (this.i >= this.n) throw new RangeError('Permutation exhausted');
    return this.permute(this.i++);
  }
}
