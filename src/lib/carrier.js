// Generic least-significant-bit engine shared by images and audio.
//
// A *carrier* describes where bits may go:
//   values   – a typed array of integers (pixel channels or audio samples)
//   count    – how many usable cells there are
//   indexAt  – maps the k-th usable cell to its index in `values`
//
// Each cell stores `bitsPerCell` bits in its lowest bits. Without a password the cells are used
// in order; with a password they are visited in a password-dependent scrambled order.

import { seedFromPassword } from './crypto';
import { StegoError } from './errors';
import { HEADER_BYTES, parseHeader } from './payload';
import { KeyedPermutation, Sequence } from './prng';

export const maxPayloadBytes = (carrier, bitsPerCell) => Math.floor((carrier.count * bitsPerCell) / 8);

async function makeOrder(count, password) {
  return password ? new KeyedPermutation(count, await seedFromPassword(password)) : new Sequence(count);
}

/**
 * Writes `payload` into the carrier's values (mutates them).
 * Returns stats, plus the touched array indices when `track` is true (for visualisations).
 */
export async function embedBytes(carrier, payload, { bitsPerCell = 1, password = '', track = false } = {}) {
  const bpc = bitsPerCell;
  const totalBits = payload.length * 8;
  const cellsNeeded = Math.ceil(totalBits / bpc);
  if (cellsNeeded > carrier.count) throw new StegoError('too-large');

  const order = await makeOrder(carrier.count, password);
  const { values, indexAt } = carrier;
  const mask = (1 << bpc) - 1;
  const positions = track ? new Uint32Array(cellsNeeded) : null;
  let bit = 0;
  let changed = 0;

  for (let c = 0; c < cellsNeeded; c++) {
    let chunk = 0;
    for (let b = 0; b < bpc; b++) {
      const v = bit < totalBits ? (payload[bit >> 3] >> (7 - (bit & 7))) & 1 : 0;
      chunk = (chunk << 1) | v;
      bit++;
    }
    const idx = indexAt(order.next());
    const old = values[idx];
    const next = (old & ~mask) | chunk;
    if (next !== old) {
      values[idx] = next;
      changed++;
    }
    if (positions) positions[c] = idx;
  }

  return { cellsUsed: cellsNeeded, cellsChanged: changed, positions };
}

class CellReader {
  constructor(carrier, order, bpc) {
    this.carrier = carrier;
    this.order = order;
    this.bpc = bpc;
    this.mask = (1 << bpc) - 1;
    this.buf = 0;
    this.bufBits = 0;
  }

  readBytes(n) {
    const out = new Uint8Array(n);
    const { values, indexAt } = this.carrier;
    for (let i = 0; i < n; i++) {
      let byte = 0;
      for (let b = 0; b < 8; b++) {
        if (this.bufBits === 0) {
          this.buf = values[indexAt(this.order.next())] & this.mask;
          this.bufBits = this.bpc;
        }
        this.bufBits--;
        byte = (byte << 1) | ((this.buf >> this.bufBits) & 1);
      }
      out[i] = byte;
    }
    return out;
  }
}

/** Reads raw bytes from the start of the carrier (used by visualisations). */
export async function readRawBytes(carrier, byteCount, { bitsPerCell = 1, password = '' } = {}) {
  const n = Math.min(byteCount, maxPayloadBytes(carrier, bitsPerCell));
  return new CellReader(carrier, await makeOrder(carrier.count, password), bitsPerCell).readBytes(n);
}

/**
 * Finds and reads a StegoCraft payload. Tries 1–4 bits per cell automatically.
 * If a password is given it is tried first, then no password (in case none was used).
 */
export async function extractBytes(carrier, { password = '', bitsPerCell } = {}) {
  const depths = bitsPerCell ? [bitsPerCell] : [1, 2, 3, 4];
  const passwords = password ? [password, ''] : [''];
  for (const pw of passwords) {
    const seed = pw ? await seedFromPassword(pw) : null;
    for (const bpc of depths) {
      const capacity = maxPayloadBytes(carrier, bpc);
      if (capacity < HEADER_BYTES) continue;
      const order = seed ? new KeyedPermutation(carrier.count, seed) : new Sequence(carrier.count);
      const reader = new CellReader(carrier, order, bpc);
      const header = parseHeader(reader.readBytes(HEADER_BYTES));
      if (!header || header.length > capacity - HEADER_BYTES) continue;
      const body = reader.readBytes(header.length);
      return { header, body, bitsPerCell: bpc, scattered: Boolean(pw) };
    }
  }
  throw new StegoError('no-payload');
}
