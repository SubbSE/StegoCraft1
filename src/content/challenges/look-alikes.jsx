import { Link } from 'react-router-dom';
import { bytesToBits, utf8Encode } from '../../lib/bytes';
import { unspoil } from '../../lib/flags';
import { hideHomoglyphs } from '../../lib/textStego';

const COVER =
  'Please accept our apologies: the shipment of copper pipes is delayed by a day or so because of a strike at the port. We expect delivery on Thursday, and we will send a new invoice once it arrives.';
const SECRET = 'TUlSUk9S';

export async function make() {
  const text = hideHomoglyphs(COVER, bytesToBits(utf8Encode(unspoil(SECRET))));
  return { kind: 'text', style: 'email', name: 'email.txt', text };
}

export default function Story() {
  return (
    <>
      <p>This email from a supplier is dull — deliberately so. Nobody would read it twice.</p>
      <p>
        But some of its letters are not what they seem. The Latin letter “a” and the Cyrillic letter “а” look identical on
        screen, yet your computer stores them as completely different characters.
      </p>
    </>
  );
}

export const hints = [
  <>Every letter that has a Cyrillic twin can carry one bit: Latin = 0, Cyrillic = 1.</>,
  <>
    Open the email in the <Link to="/detect/text">Detect lab’s Text tab</Link>. It highlights look-alike letters and
    reads their bits for you.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Detect lab</strong>.
      </li>
      <li>The findings report look-alike letters, and the X-ray view marks each one.</li>
      <li>
        Reading every swappable letter as a bit (Latin = 0, Cyrillic = 1) and grouping the bits in eights gives ASCII
        text: <strong>{unspoil(SECRET)}</strong>.
      </li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      Look-alike letters are better known from phishing — a web address with a Cyrillic “а” can look exactly like the
      real one — but the same trick can carry hidden bits. Unlike invisible characters, they don’t make the text any
      longer, though any tool that checks which alphabet each letter belongs to will spot them. See{' '}
      <Link to="/learn/text-tricks">Classic text tricks</Link>.
    </p>
  );
}
