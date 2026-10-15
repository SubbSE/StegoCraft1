import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { baconEncode } from '../../lib/textStego';

const COVER = 'Knowledge is power, said Bacon.';
const SECRET = 'UVVJTEw=';

export async function make() {
  return { kind: 'bacon', text: COVER, code: baconEncode(unspoil(SECRET)) };
}

export default function Story() {
  return (
    <>
      <p>
        Around 1605, Francis Bacon described a way to hide a message inside <em>any</em> text: print it in two slightly
        different typefaces, and let the difference carry the message.
      </p>
      <p>
        In the sentence below, some letters are printed in a plain typeface and others in a serif typeface (the kind with
        little “feet”). Plain letters stand for <strong>a</strong>, serif letters for <strong>b</strong>.
      </p>
    </>
  );
}

export const hints = [
  <>
    Write <strong>a</strong> for every plain letter and <strong>b</strong> for every serif letter, then split the result
    into groups of five.
  </>,
  <>
    Each group is one letter. Read a as 0 and b as 1, and each group becomes a number in binary: aaaaa = 0 = A, aaaab = 1
    = B, aaaba = 2 = C, … up to bbaab = 25 = Z.
  </>,
  <>
    The first group, <em>Knowl</em>, reads baaaa: 10000 in binary, which is 16. Counting A as 0, letter 16 is Q.
  </>,
];

export function Walkthrough() {
  const code = baconEncode(unspoil(SECRET)).toLowerCase();
  const groups = code.match(/.{5}/g);
  return (
    <>
      <p>Reading the typefaces, five letters at a time, gives:</p>
      <p>
        <code>{groups.join(' ')}</code>
      </p>
      <p>
        As binary numbers that’s {groups.map((g) => parseInt(g.replace(/a/g, '0').replace(/b/g, '1'), 2)).join(', ')} —
        counting A as 0, the letters <strong>{unspoil(SECRET)}</strong>.
      </p>
    </>
  );
}

export function Debrief() {
  return (
    <p>
      Bacon’s biliteral cipher was a big step forward from null ciphers: the cover words can be anything at all, because
      the message lives in the shapes of the letters. Bacon’s own alphabet had 24 letters — I and J shared a code, as did
      U and V. The same idea, two versions of something that look almost alike, powers modern tricks like look-alike
      letters. See <Link to="/learn/text-tricks">Classic text tricks</Link>.
    </p>
  );
}
