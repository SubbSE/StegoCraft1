// Password protection with the browser's built-in Web Crypto API.
// AES-256-GCM authenticated encryption; the key is stretched from the password with PBKDF2-SHA-256.

import { concatBytes, utf8Encode } from './bytes';
import { StegoError } from './errors';

export const PBKDF2_ITERATIONS = 250_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
export const ENCRYPTION_OVERHEAD = SALT_BYTES + IV_BYTES + 16; // + 16-byte GCM auth tag

const subtle = () => globalThis.crypto.subtle;

async function deriveKey(password, salt) {
  const base = await subtle().importKey('raw', utf8Encode(password), 'PBKDF2', false, ['deriveKey']);
  return subtle().deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Returns salt ‖ iv ‖ ciphertext+tag. */
export async function encryptBytes(plain, password) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt);
  const cipher = new Uint8Array(await subtle().encrypt({ name: 'AES-GCM', iv }, key, plain));
  return concatBytes(salt, iv, cipher);
}

export async function decryptBytes(blob, password) {
  if (blob.length < ENCRYPTION_OVERHEAD) throw new StegoError('corrupted');
  const salt = blob.subarray(0, SALT_BYTES);
  const iv = blob.subarray(SALT_BYTES, SALT_BYTES + IV_BYTES);
  const key = await deriveKey(password, salt);
  try {
    return new Uint8Array(await subtle().decrypt({ name: 'AES-GCM', iv }, key, blob.subarray(SALT_BYTES + IV_BYTES)));
  } catch {
    throw new StegoError('wrong-password');
  }
}

export async function sha256(bytes) {
  return new Uint8Array(await subtle().digest('SHA-256', bytes));
}

export async function sha256Hex(text) {
  const hash = await sha256(utf8Encode(text));
  return [...hash].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** 128-bit seed for scattering bits, derived from the password (independent of the encryption key). */
export async function seedFromPassword(password) {
  const hash = await sha256(utf8Encode(`stegocraft/scatter/v1:${password}`));
  const view = new DataView(hash.buffer);
  return [view.getUint32(0), view.getUint32(4), view.getUint32(8), view.getUint32(12)];
}
