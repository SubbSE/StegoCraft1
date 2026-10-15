import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { hideInImage } from '../../lib/imageStego';
import { buildPayload } from '../../lib/payload';
import { generateLandscape } from '../../lib/synth';

const SECRET = 'R3JlZXRpbmdzIGZyb20gdGhlIGNvYXN0ISBUaGUgc2VjcmV0IHdvcmQgaXMgTElHSFRIT1VTRS4=';

export async function make() {
  const payload = await buildPayload({ text: unspoil(SECRET) });
  const { image } = await hideInImage(generateLandscape(640, 400, 21), payload);
  return { kind: 'image', name: 'postcard.png', image };
}

export default function Story() {
  return (
    <>
      <p>
        A friend on holiday sent you this picture with a one-line note: <em>“Look closer than you think.”</em>
      </p>
      <p>
        It looks like an ordinary sunset. But a picture is just a grid of numbers — and the last bit of every number is
        free for anyone who wants to use it.
      </p>
    </>
  );
}

export const hints = [
  <>A message hidden in the least significant bits can’t be <em>seen</em>, but the right tool can <em>read</em> it.</>,
  <>
    Open the picture in the Reveal tool (<Link to="/lab/image">Lab → Image → Reveal</Link>). Your friend didn’t use a
    password.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Reveal tool</strong> under the picture (or download it and drop it into the Image lab’s
        Reveal tab).
      </li>
      <li>
        Leave the password empty and press <strong>Reveal hidden message</strong>.
      </li>
      <li>StegoCraft finds its signature in the lowest bits of the first pixels and reads the message. The secret word is at the end.</li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      This is least-significant-bit substitution, from <Link to="/learn/lsb-substitution">Your first hidden message</Link>:
      each bit of the message replaces the last bit of one colour value, so no value changes by more than 1. Without a
      password, the bits are written in reading order from the top-left corner — so anyone who suspects LSB data knows
      exactly where to look.
    </p>
  );
}
