// The hidden payload format. Every technique hides the same framed bytes:
//
//   "S" "C" | version | flags | body length (u32) | CRC-32 of body (u32) | body…
//
// The magic bytes and checksum let us tell a real message from random noise, and spot damage.
// Flags: bit 0 = encrypted with a password, bit 1 = body is a file (not text).

import { concatBytes, crc32, readU32, utf8Decode, utf8Encode, writeU32 } from './bytes';
import { decryptBytes, encryptBytes, ENCRYPTION_OVERHEAD } from './crypto';
import { StegoError } from './errors';

export const MAGIC = [0x53, 0x43];
export const VERSION = 1;
export const HEADER_BYTES = 12;
const FLAG_ENCRYPTED = 1;
const FLAG_FILE = 2;

function truncateUtf8(text, maxBytes) {
  let s = text;
  while (utf8Encode(s).length > maxBytes) s = Array.from(s).slice(0, -1).join('');
  return utf8Encode(s);
}

function packFile({ name, type, bytes }) {
  const nameBytes = truncateUtf8(name || 'file', 255);
  const typeBytes = truncateUtf8(type || 'application/octet-stream', 255);
  return concatBytes(Uint8Array.of(nameBytes.length), nameBytes, Uint8Array.of(typeBytes.length), typeBytes, bytes);
}

function unpackFile(inner) {
  const nameLen = inner[0];
  const name = utf8Decode(inner.subarray(1, 1 + nameLen));
  const typeLen = inner[1 + nameLen];
  const typeStart = 2 + nameLen;
  const type = utf8Decode(inner.subarray(typeStart, typeStart + typeLen));
  return { name, type, bytes: inner.slice(typeStart + typeLen) };
}

/** Size in bytes of the framed payload, before it is built (for capacity meters). */
export function payloadSize({ text = '', file = null, encrypted = false }) {
  const inner = file
    ? 2 + Math.min(255, utf8Encode(file.name || 'file').length) + Math.min(255, utf8Encode(file.type || 'application/octet-stream').length) + file.size
    : utf8Encode(text).length;
  return HEADER_BYTES + inner + (encrypted ? ENCRYPTION_OVERHEAD : 0);
}

/** Frame (and optionally encrypt) a text message or a file. */
export async function buildPayload({ text, file, password }) {
  const isFile = Boolean(file);
  const inner = isFile ? packFile(file) : utf8Encode(text ?? '');
  const encrypted = Boolean(password);
  const body = encrypted ? await encryptBytes(inner, password) : inner;
  const header = new Uint8Array(HEADER_BYTES);
  header[0] = MAGIC[0];
  header[1] = MAGIC[1];
  header[2] = VERSION;
  header[3] = (encrypted ? FLAG_ENCRYPTED : 0) | (isFile ? FLAG_FILE : 0);
  writeU32(header, 4, body.length);
  writeU32(header, 8, crc32(body));
  return concatBytes(header, body);
}

/** Returns header info, or null when these bytes are not a StegoCraft header. */
export function parseHeader(h) {
  if (!h || h.length < HEADER_BYTES || h[0] !== MAGIC[0] || h[1] !== MAGIC[1] || h[2] !== VERSION) return null;
  const flags = h[3];
  if (flags & ~(FLAG_ENCRYPTED | FLAG_FILE)) return null;
  return {
    encrypted: Boolean(flags & FLAG_ENCRYPTED),
    isFile: Boolean(flags & FLAG_FILE),
    length: readU32(h, 4),
    crc: readU32(h, 8),
  };
}

/** Verify, decrypt and unpack a payload body. */
export async function openPayload(header, body, password) {
  if (crc32(body) !== header.crc) throw new StegoError('corrupted');
  let inner = body;
  if (header.encrypted) {
    if (!password) throw new StegoError('needs-password');
    inner = await decryptBytes(body, password);
  }
  if (!header.isFile) return { kind: 'text', text: utf8Decode(inner) };
  return { kind: 'file', ...unpackFile(inner) };
}

/** Parse a complete framed payload held in one byte array (used by the text techniques). */
export async function openFramed(bytes, password) {
  const header = parseHeader(bytes.subarray(0, HEADER_BYTES));
  if (!header) throw new StegoError('no-payload');
  const body = bytes.subarray(HEADER_BYTES, HEADER_BYTES + header.length);
  if (body.length < header.length) throw new StegoError('corrupted');
  return openPayload(header, body, password);
}
