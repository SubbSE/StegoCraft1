import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { nthLetters } from '../../lib/textStego';

const NOTE =
  'Hello! I’ve decided Dad’s eightieth needs Italian nibbles. Perhaps lasagne, artichokes, insalata, nougat. Should I get him tiramisu?';
const ANSWER = 'SElEREVOIElOIFBMQUlOIFNJR0hU';

export async function make() {
  return { kind: 'text', style: 'note', name: 'note.txt', text: NOTE };
}

export default function Story() {
  return (
    <>
      <p>
        In wartime, censors read every letter that crossed the border, looking for anything suspicious. This cheerful
        note about a birthday party passed without a second glance.
      </p>
      <p>The censor read every word. Read it the way its writer meant it to be read.</p>
    </>
  );
}

export const hints = [
  <>In a null cipher, most of the words are filler. Only a few letters matter.</>,
  <>Try taking a single letter from every word, in order.</>,
  <>
    Take the <strong>first</strong> letter of every word — then add spaces where they belong.
  </>,
];

export function Walkthrough() {
  return (
    <>
      <p>Write down the first letter of each word:</p>
      <p>
        <code>{Array.from(nthLetters(NOTE, 1).toUpperCase()).join(' ')}</code>
      </p>
      <p>
        Then split it into words: <strong>{unspoil(ANSWER)}</strong>. The Detect lab’s{' '}
        <Link to="/detect/text">Text tab</Link> does the first step for you, in its null-cipher helper.
      </p>
    </>
  );
}

export function Debrief() {
  return (
    <>
      <p>
        This is a <strong>null cipher</strong>: the message is spread across innocent words, one letter at a time. Wartime
        censors knew the trick, and some reworded telegrams before sending them on — which scrambles any letters hidden
        this way.
      </p>
      <p>
        You can also hear the weakness: the note sounds a little odd, because its words were chosen for their first
        letters. Bacon’s two-typeface method, from <Link to="/learn/text-tricks">Classic text tricks</Link>, avoids that
        problem — it works with any text at all.
      </p>
    </>
  );
}
