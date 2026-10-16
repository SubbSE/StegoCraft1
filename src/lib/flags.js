// Challenge answers are stored only as hashes, and the secrets inside challenge files are stored
// base64-encoded, so that reading the source code doesn't spoil a puzzle by accident.
// This is not security: everything needed to solve the challenges ships with the site.
import { utf8Decode, utf8Encode } from './bytes';
import { sha256Hex } from './crypto';

/** "Hidden in plain sight!" and "hiddeninplainsight" count as the same answer. */
export const normalizeAnswer = (text) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');

export const answerHash = (id, answer) => sha256Hex(`stegocraft/challenge/${id}:${normalizeAnswer(answer)}`);

export const spoil = (text) => btoa(Array.from(utf8Encode(text), (b) => String.fromCharCode(b)).join(''));

export const unspoil = (encoded) => utf8Decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
