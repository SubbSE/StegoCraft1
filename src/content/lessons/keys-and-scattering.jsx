import ScatterMap from '../../explorables/ScatterMap';
import EncryptedBits from '../../explorables/EncryptedBits';
import { Callout } from '../../components/ui/display';

export default function KeysAndScattering() {
  return (
    <>
      <p>
        The LSB method from the last two lessons has two big weaknesses. First, anyone who knows the method can read the
        message: just collect the last bits in order. Second, as the bit-plane slicer showed, writing bits in order leaves a
        visible trail. A <strong>key</strong> — in practice, a password — can fix both.
      </p>

      <h2>Assume the enemy knows your method</h2>
      <p>
        In 1883 the Dutch cryptographer Auguste Kerckhoffs argued that a secret system should stay secure even if the enemy
        knows <em>everything about it except the key</em>. Methods leak: tools get published, devices get captured, people
        talk. A key is small, easy to change and easy to keep secret.
      </p>
      <p>
        This idea, now called <strong>Kerckhoffs’s principle</strong>, applies to steganography too. Assume Wendy the warden
        knows exactly how LSB hiding works. Our job is to make that knowledge useless without the password.
      </p>

      <h2>Step one: scatter the bits</h2>
      <p>
        Instead of visiting the colour values in order, we can let the password decide the order. The password is turned
        into a <strong>seed</strong> for a pseudo-random number generator — a formula that produces numbers which look random
        but are completely determined by the seed. Same password, same sequence of positions. Different password, a totally
        different one.
      </p>

      <ScatterMap />

      <p>
        Without the password, Wendy doesn’t know which values carry the message, or in what order to read them. The data is
        spread thinly over the whole picture, so there is no sharp band for the visual attack to find.
      </p>
      <p>
        One detail matters: every position must be used <em>at most once</em>, or later bits would overwrite earlier ones.
        StegoCraft uses a password-keyed <em>shuffle</em> — a reversible scrambling of the position numbers — which visits
        every position exactly once.
      </p>

      <h2>Step two: encrypt before you hide</h2>
      <p>
        Scattering hides <em>where</em> the bits are. But if someone does find them, the message itself is still readable,
        and its patterns can give it away. Ordinary text is far from random:
      </p>

      <EncryptedBits />

      <p>
        Encryption fixes both problems at once. A strong cipher such as <strong>AES-256</strong> turns the message into bytes
        that cannot be read without the key and are statistically indistinguishable from random noise — just like the
        natural noise in the lowest bits of a photo.
      </p>
      <p>When you give StegoCraft a password, it does both steps:</p>
      <ol>
        <li>
          It stretches your password into a 256-bit key (using PBKDF2 with 250,000 rounds, which makes password guessing
          slow) and encrypts the message with AES-256-GCM. GCM also detects tampering and wrong passwords.
        </li>
        <li>It derives a separate seed from the password and uses it to scatter the encrypted bits across the cover.</li>
      </ol>

      <Callout type="warn" title="Scattering is not invisibility">
        Spreading bits out defeats the visual attack, but it does not remove the changes. A large hidden message still
        nudges the picture’s statistics, and statistical tests can notice. Encryption keeps your secret <em>safe</em>; only
        a small payload keeps it <em>hidden</em>. You’ll see why in the steganalysis lesson.
      </Callout>

      <p>
        A good password is long and unpredictable. Several random words (“velvet anchor pepper moonlight”) are both strong
        and easy to remember.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'What does Kerckhoffs’s principle say?',
    options: [
      'Never write your method down.',
      'A system should stay secure even if the enemy knows everything about it except the key.',
      'Always use the longest possible message.',
      'Steganography is stronger than cryptography.',
    ],
    answer: 1,
    explain: 'Methods leak. Security should rest on a small secret that is easy to change: the key.',
  },
  {
    q: 'What does password-based scattering protect against?',
    options: [
      'Image compression',
      'Someone who knows the method reading the bits in order — and the visual attack’s telltale band',
      'Statistical detection of any size of message',
      'Losing the picture',
    ],
    answer: 1,
    explain: 'Without the password, nobody knows which values to read or in what order, and there is no band to spot.',
  },
  {
    q: 'Why should you encrypt a message before hiding it?',
    options: [
      'Encrypted messages are shorter.',
      'So it stays unreadable if found, and looks like random noise instead of patterned text.',
      'Because PNG requires encryption.',
      'Encryption makes the picture brighter.',
    ],
    answer: 1,
    explain: 'Encryption gives you secrecy even if the hiding fails, and random-looking bits blend in better.',
  },
];
