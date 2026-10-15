import { Link } from 'react-router-dom';
import ChiSquareLab from '../../explorables/ChiSquareLab';
import { Callout } from '../../components/ui/display';

export default function Steganalysis() {
  return (
    <>
      <p>
        Time to switch sides for good. <strong>Steganalysis</strong> is the art of detecting hidden messages, and the
        steganalyst has one big advantage: they don’t need to <em>read</em> the message. Remember Wendy the warden — she wins
        the moment she can say “this picture is suspicious”. A hidden message that is detected has failed, even if it is
        encrypted.
      </p>

      <h2>Attack 1: look at it</h2>
      <p>
        You already know the first attack. In the <Link to="/learn/bit-planes">bit-plane lesson</Link>, a message written in
        order turned part of the lowest bit plane into static. This <strong>visual attack</strong> is fast and convincing, but
        it only works when the message is written in order and the cover has smooth areas. Scatter the bits, or use a noisy
        photo, and the eye sees nothing.
      </p>

      <h2>Attack 2: count it</h2>
      <p>
        Statistics can see what eyes cannot. LSB replacement has a fingerprint: it only ever moves a value within its{' '}
        <em>pair</em>. A value of 96 can become 97 and back again, but never 95 or 98. So the values 96 and 97 trade places
        with each other, 98 and 99 with each other, and so on.
      </p>
      <p>
        In a natural picture, the two values in a pair are usually <em>not</em> equally common. But the message bits are
        random — half zeros, half ones — so after embedding, each pair’s counts get pushed towards being equal. In 1999 Andreas
        Westfeld and Andreas Pfitzmann turned this into the <strong>chi-square attack</strong>: measure how equal the pairs are,
        and compute the probability that LSB data is present.
      </p>

      <ChiSquareLab />

      <p>Things to notice:</p>
      <ul>
        <li>
          On the <strong>clean</strong> picture, the pairs have clearly different heights, and the probability stays near 0.
        </li>
        <li>
          With a <strong>message in order</strong>, the pairs flatten out and the curve sits near 100% exactly as far as the
          message reaches, then falls. The attack finds not just the message, but its length.
        </li>
        <li>
          With a <strong>scattered</strong> message, the pairs only partly flatten. This basic test misses small scattered
          messages — but turn the size up to the maximum, and it catches them too.
        </li>
        <li>
          The test assumes the hidden bits look <em>random</em>, as encrypted or compressed data does. Plain, unencrypted text
          is slightly lopsided (for example, the first bit of every English character is 0), which can fool this simple
          test — though not the stronger ones below.
        </li>
      </ul>

      <h2>Stronger attacks</h2>
      <p>
        The chi-square attack was just the beginning. In 2001, Jessica Fridrich, Miroslav Goljan and Rui Du published{' '}
        <strong>RS analysis</strong>, which measures how the smoothness of small groups of pixels changes when their lowest bits
        are flipped. It can estimate the length of even a small, scattered LSB message. <strong>Sample pair analysis</strong>{' '}
        (2003) refined the idea further.
      </p>
      <p>
        Today the strongest detectors are <strong>machine-learning models</strong> — for example, deep neural networks trained
        on millions of clean and stego images, which learn subtle traces no human would think of.
      </p>

      <h2>The arms race</h2>
      <p>Every new detector inspires a better hiding method:</p>
      <ul>
        <li>
          <strong>LSB matching</strong> (also called ±1 embedding) doesn’t overwrite the last bit. When a value has the wrong
          last bit, it randomly adds or subtracts 1. That breaks the strict pairing and defeats the chi-square test.
        </li>
        <li>
          <strong>Matrix encoding</strong> hides the same message with fewer changes.
        </li>
        <li>
          <strong>Adaptive steganography</strong> (such as HUGO, WOW and S-UNIWARD, from 2010 onwards) computes how detectable a
          change would be at every position, and concentrates the message in busy, textured regions where changes are hardest
          to model.
        </li>
      </ul>
      <p>
        And so the cycle continues: hiders model what detectors look at; detectors learn what hiders miss.
      </p>

      <Callout type="key" title="The practical takeaway">
        The single best defence is a <strong>small payload</strong>. Detection gets dramatically harder as the share of
        changed values falls. Hiding a short message in a large, noisy photo beats any clever trick applied to a full one.
      </Callout>

      <p>
        Want to try steganalysis on your own files? The <Link to="/detect">Detect lab</Link> has the bit-plane viewer, a
        histogram, the chi-square test and a spectrogram, ready for any image or recording.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'What does the warden need to achieve to “win”?',
    options: [
      'Read the hidden message',
      'Only detect that a hidden message is present',
      'Delete the picture',
      'Find the sender’s password',
    ],
    answer: 1,
    explain: 'Steganography’s whole purpose is to hide the existence of the message. Detection alone defeats it.',
  },
  {
    q: 'Why does LSB replacement make the counts of values 2k and 2k+1 more equal?',
    options: [
      'Because it adds 2 to every value',
      'Because random message bits move values back and forth within each pair, evening out their counts',
      'Because it makes the image brighter',
      'Because PNG compression requires it',
    ],
    answer: 1,
    explain: 'Replacing the last bit only swaps values within a pair; random bits push each pair towards a 50/50 split.',
  },
  {
    q: 'Which change defeats the basic chi-square attack?',
    options: [
      'Hiding a bigger message',
      'Saving the image as JPEG',
      'LSB matching: randomly adding or subtracting 1 instead of overwriting the last bit',
      'Writing the message in order',
    ],
    answer: 2,
    explain: 'LSB matching moves values across pair boundaries, so the telltale pairing effect disappears.',
  },
];
