// Text steganography: invisible Unicode characters, trailing whitespace, homoglyphs and classic tricks.

import { bitsToBytes, bytesToBits } from './bytes';
import { StegoError } from './errors';
import { HEADER_BYTES, openFramed } from './payload';

/* ------------------------------------------------------------------ */
/* Zero-width characters: each invisible character carries 2 bits.     */
/* ------------------------------------------------------------------ */

export const ZERO_WIDTH = ['\u200B', '\u200C', '\u200D', '\u2060']; // 00, 01, 10, 11
const ZW_STRIP = /[\u200B-\u200D\u2060\uFEFF]/g;

export function bytesToZeroWidth(bytes) {
  let s = '';
  for (const byte of bytes) for (let shift = 6; shift >= 0; shift -= 2) s += ZERO_WIDTH[(byte >> shift) & 3];
  return s;
}

export function zeroWidthToBytes(text) {
  const syms = [];
  for (const ch of text) {
    const i = ZERO_WIDTH.indexOf(ch);
    if (i >= 0) syms.push(i);
  }
  const out = new Uint8Array(Math.floor(syms.length / 4));
  for (let i = 0; i < out.length; i++) {
    out[i] = (syms[4 * i] << 6) | (syms[4 * i + 1] << 4) | (syms[4 * i + 2] << 2) | syms[4 * i + 3];
  }
  return out;
}

/**
 * Spreads the invisible characters over the gaps between words. They are only ever placed right
 * after whitespace, so they never sit inside a word — where joiners could change how scripts like
 * Bengali, Hindi or Arabic are drawn, or merge emoji together.
 */
export function hideZeroWidth(cover, payload) {
  const hidden = bytesToZeroWidth(payload);
  const chars = Array.from(cover.replace(ZW_STRIP, ''));
  const points = [];
  chars.forEach((ch, i) => /\s/.test(ch) && points.push(i + 1));
  if (points.length === 0) points.push(chars.length);

  const per = Math.ceil(hidden.length / points.length);
  const inserts = new Map();
  points.forEach((p, n) => {
    const piece = hidden.slice(n * per, (n + 1) * per);
    if (piece) inserts.set(p, piece);
  });

  let out = '';
  for (let i = 0; i <= chars.length; i++) {
    if (inserts.has(i)) out += inserts.get(i);
    if (i < chars.length) out += chars[i];
  }
  return out;
}

export async function revealZeroWidth(text, password) {
  const bytes = zeroWidthToBytes(text);
  if (bytes.length < HEADER_BYTES) throw new StegoError('no-payload');
  return openFramed(bytes, password);
}

/* ------------------------------------------------------------------ */
/* Trailing whitespace (like the classic SNOW tool): space = 0, tab = 1 */
/* ------------------------------------------------------------------ */

export function hideTrailingWhitespace(cover, payload) {
  const eol = cover.includes('\r\n') ? '\r\n' : '\n';
  const lines = cover.split(/\r?\n/).map((l) => l.replace(/[ \t]+$/, ''));
  const bits = bytesToBits(payload);
  const per = Math.ceil(bits.length / lines.length);
  let k = 0;
  return lines
    .map((line) => {
      let tail = '';
      for (let j = 0; j < per && k < bits.length; j++, k++) tail += bits[k] ? '\t' : ' ';
      return line + tail;
    })
    .join(eol);
}

export async function revealTrailingWhitespace(text, password) {
  const bits = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/[ \t]+$/);
    if (m) for (const ch of m[0]) bits.push(ch === '\t' ? 1 : 0);
  }
  const bytes = bitsToBytes(bits);
  if (bytes.length < HEADER_BYTES) throw new StegoError('no-payload');
  return openFramed(bytes, password);
}

/* ------------------------------------------------------------------ */
/* Homoglyphs: Latin letters swapped for identical-looking Cyrillic.   */
/* ------------------------------------------------------------------ */

export const HOMOGLYPHS = {
  a: '\u0430', c: '\u0441', e: '\u0435', o: '\u043E', p: '\u0440', x: '\u0445', y: '\u0443',
  i: '\u0456', s: '\u0455', j: '\u0458',
  A: '\u0410', B: '\u0412', C: '\u0421', E: '\u0415', H: '\u041D', K: '\u041A', M: '\u041C',
  O: '\u041E', P: '\u0420', T: '\u0422', X: '\u0425',
};
const LOOKALIKE_OF = Object.fromEntries(Object.entries(HOMOGLYPHS).map(([latin, cyr]) => [cyr, latin]));

export const homoglyphCapacity = (cover) => Array.from(cover).filter((ch) => ch in HOMOGLYPHS).length;

/** Each swappable letter carries one bit: original Latin = 0, Cyrillic look-alike = 1. */
export function hideHomoglyphs(cover, bits) {
  let k = 0;
  return Array.from(cover)
    .map((ch) => (ch in HOMOGLYPHS && k < bits.length ? (bits[k++] ? HOMOGLYPHS[ch] : ch) : ch))
    .join('');
}

export function revealHomoglyphs(text) {
  const bits = [];
  for (const ch of text) {
    if (ch in HOMOGLYPHS) bits.push(0);
    else if (ch in LOOKALIKE_OF) bits.push(1);
  }
  return bits;
}

/* ------------------------------------------------------------------ */
/* Classic tricks used in the lessons                                   */
/* ------------------------------------------------------------------ */

/** One space between words = 0, two spaces = 1. Fragile: many apps collapse double spaces. */
export function hideDoubleSpace(cover, bits) {
  const words = cover.trim().split(/\s+/);
  return words.reduce((out, w, i) => (i === 0 ? w : out + (bits[i - 1] ? '  ' : ' ') + w), '');
}

export function revealDoubleSpace(text) {
  return (text.match(/ +/g) || []).map((gap) => (gap.length >= 2 ? 1 : 0));
}

/** Null cipher: the n-th letter (1-based) of every word. */
export function nthLetters(text, n = 1) {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .map((w) => Array.from(w)[n - 1] || '')
    .join('');
}

/** Bacon's biliteral cipher (modern 26-letter variant): each letter becomes 5 symbols of A/B. */
export function baconEncode(word) {
  return Array.from(word.toUpperCase())
    .filter((ch) => ch >= 'A' && ch <= 'Z')
    .map((ch) => (ch.charCodeAt(0) - 65).toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B'))
    .join('');
}

export function baconDecode(ab) {
  const clean = ab.toUpperCase().replace(/[^AB]/g, '');
  let out = '';
  for (let i = 0; i + 5 <= clean.length; i += 5) {
    const v = parseInt(clean.slice(i, i + 5).replace(/A/g, '0').replace(/B/g, '1'), 2);
    out += v < 26 ? String.fromCharCode(65 + v) : '?';
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Inspection: find things that hide in text                           */
/* ------------------------------------------------------------------ */

export const INVISIBLE_NAMES = {
  '\u00AD': 'SOFT HYPHEN',
  '\u180E': 'MONGOLIAN VOWEL SEPARATOR',
  '\u200B': 'ZERO WIDTH SPACE',
  '\u200C': 'ZERO WIDTH NON-JOINER',
  '\u200D': 'ZERO WIDTH JOINER',
  '\u200E': 'LEFT-TO-RIGHT MARK',
  '\u200F': 'RIGHT-TO-LEFT MARK',
  '\u202A': 'LEFT-TO-RIGHT EMBEDDING',
  '\u202B': 'RIGHT-TO-LEFT EMBEDDING',
  '\u202C': 'POP DIRECTIONAL FORMATTING',
  '\u202D': 'LEFT-TO-RIGHT OVERRIDE',
  '\u202E': 'RIGHT-TO-LEFT OVERRIDE',
  '\u2060': 'WORD JOINER',
  '\u2061': 'FUNCTION APPLICATION',
  '\u2062': 'INVISIBLE TIMES',
  '\u2063': 'INVISIBLE SEPARATOR',
  '\u2064': 'INVISIBLE PLUS',
  '\u2066': 'LEFT-TO-RIGHT ISOLATE',
  '\u2067': 'RIGHT-TO-LEFT ISOLATE',
  '\u2068': 'FIRST STRONG ISOLATE',
  '\u2069': 'POP DIRECTIONAL ISOLATE',
  '\uFEFF': 'ZERO WIDTH NO-BREAK SPACE',
};

export const codePoint = (ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;

/** Summarise anything suspicious in a piece of text. */
export function scanText(text) {
  const invisible = [];
  const homoglyphs = [];
  let index = 0;
  for (const ch of text) {
    if (ch in INVISIBLE_NAMES) invisible.push({ index, ch, name: INVISIBLE_NAMES[ch] });
    else if (ch in LOOKALIKE_OF) homoglyphs.push({ index, ch, looksLike: LOOKALIKE_OF[ch] });
    index++;
  }
  const lines = text.split(/\r?\n/);
  const trailingLines = lines.filter((l) => /[ \t]+$/.test(l)).length;
  const doubleSpaces = (text.match(/\S {2,}\S/g) || []).length;
  return { invisible, homoglyphs, trailingLines, doubleSpaces, length: index };
}
