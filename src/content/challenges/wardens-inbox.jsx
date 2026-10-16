import { Link } from 'react-router-dom';
import { unspoil } from '../../lib/flags';
import { hideInImage, imageCapacity } from '../../lib/imageStego';
import { seededRandom } from '../../lib/prng';
import { generateLandscape } from '../../lib/synth';

const GUILTY = 'Mg==';
const SEEDS = [101, 102, 103, 104];
const LETTERS = 'ABCD';

export async function make() {
  const guilty = Number(unspoil(GUILTY));
  const items = [];
  for (const [i, seed] of SEEDS.entries()) {
    let image = generateLandscape(480, 300, seed);
    if (i === guilty) {
      // An encrypted file looks like random bytes. It is written in reading order with no StegoCraft
      // signature, so the Reveal tool can't find it — only steganalysis can.
      const rand = seededRandom(seed * 7);
      const file = Uint8Array.from({ length: Math.floor(imageCapacity(image) * 0.45) }, () => Math.floor(rand() * 256));
      image = (await hideInImage(image, file)).image;
    }
    items.push({ label: `Photo ${LETTERS[i]}`, name: `photo-${LETTERS[i].toLowerCase()}.png`, image });
  }
  return { kind: 'gallery', items };
}

export default function Story() {
  return (
    <>
      <p>You’re the warden now. Four photos left the building today. Three are innocent holiday snaps.</p>
      <p>
        One carries an encrypted file, written straight into the lowest bits in reading order. It has no StegoCraft
        signature, so the Reveal tool won’t find anything — and even if you found the bits, you couldn’t decrypt them.
      </p>
      <p>You can’t read the file. Can you prove which photo is carrying it?</p>
    </>
  );
}

export const hints = [
  <>
    Encrypted data looks like perfectly random bits — and random bits leave a statistical fingerprint when they replace
    the lowest bits of a picture.
  </>,
  <>
    Open each photo in the <Link to="/detect/image">Detect lab</Link> and compare their chi-square tests.
  </>,
  <>Three of the photos score close to 0% all the way along. One scores close to 100% for the first part of the image.</>,
];

export function Walkthrough() {
  const guilty = LETTERS[Number(unspoil(GUILTY))];
  return (
    <ol>
      <li>
        Press <strong>Analyse</strong> under each photo to open it in the Detect lab.
      </li>
      <li>The bit planes look like static in all four, so the visual attack doesn’t help here.</li>
      <li>
        The chi-square curves of three photos stay near 0%. Photo <strong>{guilty}</strong>’s curve sits near 100% for
        the first ~45% of the image, then drops — the classic signature of LSB data written in order.
      </li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      This is the Westfeld–Pfitzmann chi-square attack from <Link to="/learn/steganalysis">Catching hidden messages</Link>.
      Replacing the lowest bits with random data evens out every pair of values (2k and 2k+1), and the test measures
      exactly that. Notice what the attack gave you: not the message, but proof that one exists — and roughly how long it
      is. For a warden, that’s enough.
    </p>
  );
}
