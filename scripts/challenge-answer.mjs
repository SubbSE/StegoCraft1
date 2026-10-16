// Prints the answer hash for a challenge, and optionally the encoded form of a secret text,
// ready to paste into src/content/challenges.
//
// Usage: npx vite-node --root . scripts/challenge-answer.mjs <challenge-id> "<answer>" ["secret text"]

import { answerHash, normalizeAnswer, spoil } from '../src/lib/flags.js';

const [id, answer, secret] = process.argv.slice(2);
if (!id || !answer) {
  console.error('Usage: npx vite-node --root . scripts/challenge-answer.mjs <challenge-id> "<answer>" ["secret text"]');
  process.exit(1);
}

console.log(`normalised answer: ${normalizeAnswer(answer)}`);
console.log(`answer hash:       ${await answerHash(id, answer)}`);
if (secret) console.log(`encoded secret:    ${spoil(secret)}`);
