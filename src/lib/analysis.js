// Steganalysis: tools for spotting hidden data in images.

const makeImage = (width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) });

/**
 * One bit plane of an image. channel: 0 = red, 1 = green, 2 = blue, 'rgb' = all three in colour.
 * bit 0 is the least significant bit, bit 7 the most significant.
 */
export function bitPlane(image, channel, bit) {
  const out = makeImage(image.width, image.height);
  const src = image.data;
  const dst = out.data;
  for (let i = 0; i < src.length; i += 4) {
    if (channel === 'rgb') {
      dst[i] = ((src[i] >> bit) & 1) * 255;
      dst[i + 1] = ((src[i + 1] >> bit) & 1) * 255;
      dst[i + 2] = ((src[i + 2] >> bit) & 1) * 255;
    } else {
      const v = ((src[i + channel] >> bit) & 1) * 255;
      dst[i] = dst[i + 1] = dst[i + 2] = v;
    }
    dst[i + 3] = 255;
  }
  return out;
}

/** Keep only the chosen bits of every channel, rescaled to full brightness. */
export function keepBits(image, bits) {
  const out = makeImage(image.width, image.height);
  const mask = (1 << bits) - 1;
  const scale = 255 / mask;
  for (let i = 0; i < image.data.length; i += 4) {
    for (let c = 0; c < 3; c++) out.data[i + c] = Math.round((image.data[i + c] & mask) * scale);
    out.data[i + 3] = 255;
  }
  return out;
}

/** 256-bin histogram. channel 0/1/2, or 'all' for every RGB value. */
export function histogram(image, channel = 'all') {
  const h = new Uint32Array(256);
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    if (channel === 'all') {
      h[d[i]]++;
      h[d[i + 1]]++;
      h[d[i + 2]]++;
    } else h[d[i + channel]]++;
  }
  return h;
}

/* ---------------- Chi-square attack (Westfeld & Pfitzmann, 1999) ---------------- */

function logGamma(x) {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Regularised lower incomplete gamma function P(a, x). */
export function gammaP(a, x) {
  if (x <= 0) return 0;
  const front = Math.exp(-x + a * Math.log(x) - logGamma(a));
  if (x < a + 1) {
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 0; n < 1000; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-14) break;
    }
    return Math.min(1, sum * front);
  }
  const tiny = 1e-300;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.max(0, 1 - front * h);
}

/**
 * Probability that LSB embedding is present, from the "pairs of values" in a histogram.
 * Full LSB replacement makes the counts of 2k and 2k+1 nearly equal; clean images rarely look like that.
 * Returns null when there is too little data.
 */
export function chiSquareProbability(hist) {
  let chi = 0;
  let pairs = 0;
  for (let k = 0; k < 128; k++) {
    const even = hist[2 * k];
    const expected = (even + hist[2 * k + 1]) / 2;
    if (expected <= 4) continue; // too few samples for a reliable comparison
    chi += ((even - expected) * (even - expected)) / expected;
    pairs++;
  }
  if (pairs < 2) return null;
  return 1 - gammaP((pairs - 1) / 2, chi / 2);
}

/**
 * Sweeps through the image in reading order and reports the embedding probability for growing
 * portions of it, like the plots in Westfeld & Pfitzmann's paper.
 */
export function chiSquareCurve(image, steps = 100) {
  const d = image.data;
  const pixels = image.width * image.height;
  const hist = new Uint32Array(256);
  const curve = [];
  let p = 0;
  for (let s = 1; s <= steps; s++) {
    const end = Math.round((pixels * s) / steps);
    for (; p < end; p++) {
      hist[d[p * 4]]++;
      hist[d[p * 4 + 1]]++;
      hist[d[p * 4 + 2]]++;
    }
    curve.push({ fraction: s / steps, p: chiSquareProbability(hist) ?? 0 });
  }
  return curve;
}

/** Fraction of LSBs equal to 1 per channel — about 0.5 for both noise and hidden data. */
export function lsbBalance(image) {
  const ones = [0, 0, 0];
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) ones[c] += d[i + c] & 1;
  const n = d.length / 4;
  return ones.map((o) => o / n);
}
