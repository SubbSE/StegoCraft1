import { Link } from 'react-router-dom';
import { ensureFont, renderTextMask } from '../../lib/browser';
import { unspoil } from '../../lib/flags';
import { generateLandscape } from '../../lib/synth';

const SECRET = 'T1JJT04=';
const FONT = '700 150px "Space Grotesk Variable", sans-serif';

export async function make() {
  const image = generateLandscape(640, 400, 33);
  await ensureFont(FONT);
  const mask = renderTextMask(unspoil(SECRET), { width: image.width, height: image.height, font: FONT });
  // Draw the word into bit 1 of the red channel: a change of at most 2, far too small to see.
  for (let i = 0; i < mask.data.length; i++) {
    image.data[i * 4] = (image.data[i * 4] & ~2) | (mask.data[i] > 0.5 ? 2 : 0);
  }
  return { kind: 'image', name: 'evening.png', image };
}

export default function Story() {
  return (
    <>
      <p>This time the sender didn’t hide bytes. They hid a picture inside the picture.</p>
      <p>
        Every colour value has eight bits, and each bit position forms its own black-and-white image: a{' '}
        <strong>bit plane</strong>. Most planes look like a blurry copy of the photo, or like static. One of these
        doesn’t.
      </p>
    </>
  );
}

export const hints = [
  <>Look at the picture one bit plane at a time.</>,
  <>
    Open it in the <Link to="/detect/image">Detect lab</Link> and step through the bit-plane viewer: every colour, every
    bit.
  </>,
  <>
    Look at <strong>bit 1</strong> of the <strong>red</strong> channel.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Detect lab</strong>.
      </li>
      <li>
        In the bit-plane viewer, choose <strong>Red</strong>, then bit <strong>1</strong>. (The “All” view shows it too, in
        colour.)
      </li>
      <li>The secret word appears in large white letters on a black background.</li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      Writing a picture into one bit plane changes each value by at most 2 here — far too little to see in the photo —
      but isolate that plane and the shape jumps out. It’s a favourite trick in capture-the-flag competitions, and the
      reason every steganalyst’s toolkit has a bit-plane viewer. See{' '}
      <Link to="/learn/bit-planes">Slicing a picture into bit planes</Link>.
    </p>
  );
}
