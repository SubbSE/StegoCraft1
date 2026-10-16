import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { hideInImage } from '../../lib/imageStego';
import { buildPayload } from '../../lib/payload';
import { generateLandscape } from '../../lib/synth';

const SECRET = 'V2VsbCBkb25lLCBjb2RlYnJlYWtlci4gVGhlIHNlY3JldCB3b3JkIGlzIFNBRkZST04u';
const KEY = 'aGVyb2RvdHVz';

export async function make() {
  const password = unspoil(KEY);
  const payload = await buildPayload({ text: unspoil(SECRET), password });
  const { image } = await hideInImage(generateLandscape(640, 400, 55), payload, { password });
  return { kind: 'image', name: 'locked.png', image };
}

export default function Story() {
  return (
    <>
      <p>
        This picture hides a message that is both <strong>encrypted</strong> and <strong>scattered</strong> with a
        password — the strongest protection StegoCraft offers.
      </p>
      <p>The sender left a riddle for the password:</p>
      <blockquote>
        The key is the name of the Greek historian who told of a message tattooed on a messenger’s scalp. All lowercase.
      </blockquote>
    </>
  );
}

export const hints = [
  <>
    The story of the tattooed messenger opens the very first lesson,{' '}
    <Link to="/learn/what-is-steganography">What is steganography?</Link>
  </>,
  <>Open the picture in the Reveal tool and type the historian’s name, in lowercase, as the password.</>,
  <>
    The password is <strong>{unspoil(KEY)}</strong>.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        The historian is Herodotus, so the password is <code>{unspoil(KEY)}</code>.
      </li>
      <li>
        Press <strong>Open in Reveal tool</strong>, type the password and press <strong>Reveal hidden message</strong>.
      </li>
      <li>StegoCraft rebuilds the scattered order from the password, decrypts the message and shows the secret word.</li>
    </ol>
  );
}

export function Debrief() {
  return (
    <>
      <p>
        With a password, StegoCraft does two things: it encrypts the message with AES-256-GCM, and it scatters the bits
        across the picture in an order only that password recreates. Without the key, a detector can’t read a thing — it
        doesn’t even know which pixels to look at. See <Link to="/learn/keys-and-scattering">Keys, encryption and scattering</Link>.
      </p>
      <p>
        One real-world warning: a password that answers a riddle about a famous story is a weak password. Anyone who knows
        the story can guess it — and attackers try famous names first.
      </p>
    </>
  );
}
