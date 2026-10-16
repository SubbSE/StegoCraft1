import NullCipherDecoder from '../../explorables/NullCipherDecoder';
import BaconLab from '../../explorables/BaconLab';
import HomoglyphDemo from '../../explorables/HomoglyphDemo';
import { Callout } from '../../components/ui/display';

export default function TextTricks() {
  return (
    <>
      <p>
        Text is the hardest place to hide anything. A photo has millions of noisy values to tuck bits into; a sentence has a
        few dozen characters, and every one of them is meant to be read. Yet people have hidden messages in text for
        centuries — by choosing words, letters and even typefaces very carefully.
      </p>

      <h2>Null ciphers</h2>
      <p>
        In a <strong>null cipher</strong>, most of the text is filler (“nulls”), and the real message is spelled out by
        certain letters: the first letter of each word, the second, the last word of each line, and so on. You played Wendy
        the warden against one in the first lesson. Here is a famous wartime example:
      </p>

      <NullCipherDecoder />

      <p>
        A close relative is the <strong>acrostic</strong>, a poem whose lines start with the letters of a hidden word. Lewis
        Carroll ended <em>Through the Looking-Glass</em> with a poem whose first letters spell the name of the real Alice:
        Alice Pleasance Liddell.
      </p>
      <p>
        The weakness of null ciphers is that the cover text must be built around the message, which often makes it sound
        strange — “Isman hard hit” is not how people normally write. Wartime censors knew this, and rephrased or delayed
        messages that read oddly.
      </p>

      <h2>Bacon’s two typefaces</h2>
      <p>
        Around 1605, the English philosopher Francis Bacon designed a cleverer system, published in 1623. First, write every
        letter of the secret as a group of five symbols, each A or B — a code that is really just 5-bit binary, more than
        three centuries before computers. Then print any innocent text using two slightly different typefaces, one for A and
        one for B.
      </p>

      <BaconLab />

      <p>
        Unlike a null cipher, Bacon’s method works with <em>any</em> cover text, so the words can be completely natural. The
        secret lives in the letter shapes. (Bacon’s original alphabet had 24 letters, treating I/J and U/V as the same; the
        demo uses the modern 26-letter version.)
      </p>

      <h2>Formatting tricks</h2>
      <p>
        Digital text offers new places to hide bits: one space or two between words, or spaces and tabs at the ends of
        lines. A 1990s tool called <strong>SNOW</strong> hid messages in trailing whitespace, which most editors don’t show.
        These tricks are fragile — web pages collapse double spaces, and many apps trim trailing whitespace — but they are
        easy to try in the <em>Trailing spaces &amp; tabs</em> mode of the Text Lab.
      </p>

      <h2>Homoglyphs</h2>
      <p>
        Unicode contains many characters that look identical but are different to a computer. The Latin “a” (U+0061) and the
        Cyrillic “а” (U+0430) are pixel-for-pixel twins in most fonts. Swap some letters for their twins, and each swap point
        becomes a bit.
      </p>

      <HomoglyphDemo />

      <Callout type="warn" title="Same trick, different crime">
        Attackers use homoglyphs too. A web address that looks like a well-known bank, but contains a Cyrillic letter, can
        lead somewhere else entirely. This is called a <strong>homograph attack</strong>, and it is why browsers sometimes
        show unusual addresses in a special encoded form. To detect homoglyph hiding, look for words that mix characters from
        different alphabets.
      </Callout>

      <h2>Hiding in word choice</h2>
      <p>
        The most natural-looking text methods hide bits in <em>which</em> words are used. Choose “big” for 0 and “large” for 1,
        and a whole essay can carry a message. Modern research takes this further: a language model generates fluent text,
        and at each step the secret bits decide which of the likely next words to pick. The result reads like ordinary
        writing — but it still carries far less data than a single photo.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'In a null cipher, where is the real message?',
    options: [
      'In the file’s metadata',
      'In selected letters or words of an innocent-looking text',
      'In invisible characters',
      'In the paper’s watermark',
    ],
    answer: 1,
    explain: 'The message is spelled by chosen positions — such as the first or second letter of each word — and the rest is filler.',
  },
  {
    q: 'In Bacon’s cipher, how is each secret letter encoded?',
    options: ['As one number', 'As five symbols, each A or B', 'As a colour', 'As a word from a codebook'],
    answer: 1,
    explain: 'Five A/B symbols — effectively five bits — are then hidden by printing cover letters in two typefaces.',
  },
  {
    q: 'What is a good way to detect homoglyph hiding?',
    options: [
      'Count the words',
      'Look for letters from a different alphabet mixed into the text',
      'Check the font size',
      'Read the text backwards',
    ],
    answer: 1,
    explain: 'Hidden twins are usually letters from another script, such as Cyrillic, inside Latin words.',
  },
];
