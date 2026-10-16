import ByteToggle from '../../explorables/ByteToggle';
import TextToBits from '../../explorables/TextToBits';
import { Callout } from '../../components/ui/display';

export default function BitsAndBytes() {
  return (
    <>
      <p>
        Before we can hide a message inside a picture or a song, we need to know what a message <em>is</em> to a computer.
        The answer is surprisingly simple: a long row of switches, each one either off or on. We write them as{' '}
        <code>0</code> and <code>1</code>, and call each one a <strong>bit</strong> — short for “binary digit”.
      </p>

      <h2>Eight bits make a byte</h2>
      <p>
        One bit can only say yes or no. Group eight of them together and you get a <strong>byte</strong>, which can count
        from 0 to 255. Each position is worth twice the one to its right — 1, 2, 4, 8 and so on — so you add up the
        positions that are switched on.
      </p>

      <ByteToggle />

      <p>
        Look at what happens when you flip different switches. Flipping the leftmost bit changes the value by 128. Flipping
        the rightmost bit changes it by just 1. That rightmost bit is called the <strong>least significant bit</strong>, or{' '}
        <strong>LSB</strong>. The leftmost one is the <strong>most significant bit</strong> (MSB). This difference is the
        whole foundation of the next few lessons.
      </p>

      <h2>From letters to numbers</h2>
      <p>
        To store text, computers give every character a number. Early systems such as ASCII (from 1963) had room for only
        128 characters — enough for English, but not for নমস্কার, नमस्ते or 你好.
      </p>
      <p>
        <strong>Unicode</strong> fixed this. It gives every character in every writing system its own number, called a{' '}
        <strong>code point</strong> — today more than 150,000 of them, from Latin and Bengali to emoji. Code points are
        written like <code>U+0985</code> (that is অ, the first letter of the Bengali alphabet).
      </p>
      <p>
        Code points still have to become bytes. The most common way is <strong>UTF-8</strong>, which almost every website
        uses. It stores English letters in one byte each, and other characters in two, three or four bytes. Try it:
      </p>

      <TextToBits />

      <p>
        Some characters you see as a single letter are actually several code points working together. In নমস্কার, the
        conjunct স্ক is built from three code points: স, a joining mark, and ক. The emoji 👋🏽 is a waving hand plus a
        skin-tone modifier.
      </p>

      <h2>Why this matters for hiding</h2>
      <p>
        Every steganography technique in this course hides <em>bits</em>, not letters. So the size of your secret is
        measured in bits: a message of 10 English letters needs 80 bits, while 10 Bengali or Hindi letters need roughly 240.
      </p>

      <Callout type="warn" title="A classic bug">
        Many simple steganography tools assume every character fits in one byte. They work fine in English and silently
        break for Hindi, Bengali, Chinese, Arabic or emoji. Every tool on StegoCraft encodes messages as UTF-8, so your
        secrets survive in any language.
      </Callout>

      <p>
        Your message is now a row of bits. In the next lesson, we’ll look inside a picture to find places where bits can
        hide without anyone noticing.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'How many different values can a single byte (8 bits) represent?',
    options: ['8', '128', '255', '256'],
    answer: 3,
    explain: '2⁸ = 256 values, counting from 0 to 255.',
  },
  {
    q: 'You flip only the least significant bit of a byte. How much can its value change?',
    options: ['By 1', 'By 8', 'By 128', 'By 255'],
    answer: 0,
    explain: 'The LSB is worth 1, so flipping it changes the value by exactly one — the smallest possible change.',
  },
  {
    q: 'Why do some simple tools fail when you hide a message written in Hindi or with emoji?',
    options: [
      'Those characters cannot be stored by computers.',
      'Those characters need more than one byte each in UTF-8, but the tool assumes one byte per character.',
      'Hindi text is always encrypted.',
      'Emoji are images, not text.',
    ],
    answer: 1,
    explain: 'UTF-8 uses 2–4 bytes for many characters. A tool that cuts every character to 8 bits loses information.',
  },
];
