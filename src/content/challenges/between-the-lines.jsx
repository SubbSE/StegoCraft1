import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { buildPayload } from '../../lib/payload';
import { hideZeroWidth } from '../../lib/textStego';

const COVER = 'Hi! Running a bit late, sorry. Save me a seat and order me a coffee? See you in ten minutes.';
const SECRET = 'TWVldCBtZSBieSB0aGUgZm91bnRhaW4gYXQgbmluZS4gVGhlIHNlY3JldCB3b3JkIGlzIE1PT05MSUdIVC4=';

export async function make() {
  const text = hideZeroWidth(COVER, await buildPayload({ text: unspoil(SECRET) }));
  return { kind: 'text', style: 'chat', name: 'message.txt', text };
}

export default function Story() {
  return (
    <>
      <p>
        A message pops up in your chat app. It reads like a quick note from a friend who’s running late — but it is far
        longer than it looks.
      </p>
      <p>Your eyes can only count the characters they can see. Your computer counts all of them.</p>
    </>
  );
}

export const hints = [
  <>Some Unicode characters take up no space at all: zero-width spaces and joiners.</>,
  <>
    Copy the message into the <Link to="/detect/text">Detect lab’s Text tab</Link> — or use the{' '}
    <strong>Open in Detect lab</strong> button.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Detect lab</strong> (or copy the message and paste it into the Text tab).
      </li>
      <li>The findings list hundreds of invisible characters: zero-width spaces, non-joiners, joiners and word joiners.</li>
      <li>
        Press <strong>Try to read a StegoCraft message</strong> — no password is needed. The secret word is at the end.
      </li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      Each of the four invisible characters stands for two bits (00, 01, 10 and 11), and they sit right after spaces, so
      the visible text stays exactly the same — in any language. They usually survive copy and paste, but some apps strip
      them, and anything that counts characters will notice. See <Link to="/learn/invisible-unicode">Invisible characters</Link>.
    </p>
  );
}
