import { Link } from 'react-router-dom';
import InvisibleInspector from '../../explorables/InvisibleInspector';
import { Callout } from '../../components/ui/display';

export default function InvisibleUnicode() {
  return (
    <>
      <p>
        Unicode doesn’t only contain letters, digits and emoji. It also contains <strong>format characters</strong> — signals
        that tell software how to display the text around them, but which take up no space and show nothing at all. They
        exist for good reasons:
      </p>
      <ul>
        <li>
          The <strong>zero-width non-joiner</strong> (U+200C) and <strong>zero-width joiner</strong> (U+200D) control whether
          neighbouring letters connect, which matters in scripts such as Persian, Arabic, Hindi and Bengali. The joiner also
          glues emoji together: {'\u{1F468}\u200D\u{1F469}\u200D\u{1F467}'} is three emoji joined by two invisible joiners.
        </li>
        <li>
          The <strong>zero-width space</strong> (U+200B) marks where a long line may break, useful in languages written without
          spaces, such as Thai.
        </li>
        <li>
          The <strong>word joiner</strong> (U+2060) does the opposite: it forbids a line break.
        </li>
      </ul>
      <p>
        Because these characters are invisible but survive copy and paste, they make an excellent hiding place. Give each one
        a value — StegoCraft uses four of them, each worth two bits (00, 01, 10, 11) — and any message can be written in pure
        invisibility and slipped into ordinary text.
      </p>

      <InvisibleInspector />

      <h2>Placing them safely</h2>
      <p>
        Where you put the invisible characters matters. Dropped into the middle of a Bengali or Hindi word, a joiner can change
        how the letters are drawn; next to an emoji, it can merge two emoji into one. StegoCraft only places them right after a
        space, where they can’t affect shaping in any script.
      </p>

      <h2>Where this is used</h2>
      <ul>
        <li>
          <strong>Leak tracing.</strong> An organisation can send each person a copy of a document with a different invisible
          pattern. If the text leaks, the pattern reveals whose copy it was.
        </li>
        <li>
          <strong>Watermarking text</strong> that is published online, to show where a copied article came from.
        </li>
        <li>
          <strong>Attacks on AI tools.</strong> In 2024, security researchers showed that invisible Unicode “tag” characters
          could smuggle hidden instructions into text given to AI chatbots — instructions a human reviewer couldn’t see.
        </li>
      </ul>

      <h2>How to spot them</h2>
      <ul>
        <li>The cursor “sticks” when you move through the text with the arrow keys.</li>
        <li>A character counter shows more characters than you can see.</li>
        <li>
          Pasting into a tool that reveals hidden characters — like the X-ray view above, or the{' '}
          <Link to="/detect/text">Text tab of the Detect lab</Link>.
        </li>
      </ul>

      <Callout type="info" title="A cousin: Trojan Source">
        In 2021, researchers showed that invisible <em>bidirectional</em> control characters (used for mixing left-to-right and
        right-to-left scripts) could make program code look different to a human reviewer than to the compiler. Code hosts
        such as GitHub now warn when a file contains them. Invisible characters are a security topic, not just a curiosity.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'Why does Unicode include zero-width characters at all?',
    options: [
      'Only for steganography',
      'For real writing needs, such as controlling letter joining, emoji sequences and line breaks',
      'To make files bigger',
      'They were added by mistake',
    ],
    answer: 1,
    explain: 'They solve genuine text-layout problems in many scripts — steganography just borrows them.',
  },
  {
    q: 'How can you find out whether a chat app keeps zero-width characters?',
    options: [
      'Read the app’s icon',
      'Send yourself text with hidden characters, then check what arrives',
      'Restart your phone',
      'Use a larger font',
    ],
    answer: 1,
    explain: 'Every app handles them differently. Testing a round trip is the only reliable way to know.',
  },
  {
    q: 'Which is a sign that text contains invisible characters?',
    options: [
      'The text is in bold',
      'The character count is higher than the characters you can see',
      'The text has a spelling mistake',
      'The text is written in English',
    ],
    answer: 1,
    explain: 'Invisible characters still count — and the cursor often pauses on them.',
  },
];
