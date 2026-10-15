import { Link } from 'react-router-dom';
import LsbStepper from '../../explorables/LsbStepper';
import BitDepthDemo from '../../explorables/BitDepthDemo';
import { Callout } from '../../components/ui/display';

export default function LsbSubstitution() {
  return (
    <>
      <p>
        You now have everything you need for the most famous steganography technique of all:{' '}
        <strong>least significant bit (LSB) substitution</strong>. The recipe has four steps:
      </p>
      <ol>
        <li>Turn the secret message into bits (UTF-8).</li>
        <li>Walk through the picture’s colour values in a fixed order: red, green and blue of the first pixel, then the next pixel, and so on.</li>
        <li>Replace the last bit of each value with the next bit of the message.</li>
        <li>Save the result as a lossless PNG.</li>
      </ol>
      <p>Press play and watch it happen to the first 16 pixels of a real picture.</p>

      <LsbStepper />

      <h2>What just happened?</h2>
      <p>Look at the counters under the pixels. Two things stand out:</p>
      <ul>
        <li>
          <strong>No value ever changes by more than 1.</strong> The colour swatches on the left and right of each pixel are
          identical to your eye.
        </li>
        <li>
          <strong>About half of the values don’t change at all.</strong> Each value’s last bit is already 0 or 1, so there is
          roughly a 50% chance it already matches the message bit. Hiding 1,000 bits changes only about 500 values.
        </li>
      </ul>

      <h2>Reading it back</h2>
      <p>
        To reveal the message, the receiver walks through the same values in the same order, collects their last bits,
        groups them into bytes, and decodes the bytes as UTF-8. There is just one problem: how do they know where the
        message ends? The last bits of the rest of the picture are random noise that would decode into gibberish.
      </p>
      <p>There are two common answers:</p>
      <ul>
        <li>
          <strong>An end marker</strong>: a special pattern of bits that means “stop here”. Simple, but risky — if that
          pattern happens to appear inside your message, it gets cut short.
        </li>
        <li>
          <strong>A header</strong>: a few bytes at the start that say how long the message is. This is what StegoCraft does.
          Its 12-byte header contains a signature (“SC”), a version number, a few flags (is it encrypted? is it a file?), the
          length, and a checksum that detects damage.
        </li>
      </ul>

      <Callout type="info" title="Why a signature and a checksum?">
        Without them, a tool that reads any picture would “find” a garbled message in every image. The signature says
        “there really is something here”, and the checksum proves the message arrived intact.
      </Callout>

      <h2>More bits, more room — and more risk</h2>
      <p>
        Nothing forces us to use only the last bit. Using the last two bits of every value doubles the capacity; using
        four quadruples it. But each extra bit also doubles how far a value can move. Drag the slider to find the point
        where the secret starts to show.
      </p>

      <BitDepthDemo />

      <p>
        The score shown here is <strong>PSNR</strong> (peak signal-to-noise ratio), a common way to measure how similar two
        pictures are. It is measured in decibels: higher means more similar. As a rough guide, above 40 dB the difference is
        practically invisible, and below 30 dB most people can see it.
      </p>

      <h2>Your turn</h2>
      <p>
        You now understand exactly what the <Link to="/lab/image">Image Lab</Link> does. Try hiding a message in one of your
        own photos, download the PNG, and reveal it again. Then come back: in the next lesson we will look at the picture
        the way a detective would.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'When you hide a long message with 1-bit LSB substitution, roughly what share of the colour values you use actually change?',
    options: ['All of them', 'About half', 'About one in eight', 'None'],
    answer: 1,
    explain: 'Each value’s last bit already matches the message bit about half the time, so only about half need to change — and only by 1.',
  },
  {
    q: 'Why does StegoCraft start every hidden message with a header that includes its length?',
    options: [
      'To make the picture brighter',
      'So the receiver knows how many bits to read and where the message ends',
      'Because PNG files require it',
      'To encrypt the message',
    ],
    answer: 1,
    explain: 'Without a length (or an end marker), the reader cannot tell the message from the random last bits that follow it.',
  },
  {
    q: 'Using 4 bits per colour value instead of 1 lets you hide…',
    options: ['the same amount, more safely', 'about twice as much', 'about four times as much, but with visible grain risk', '256 times as much'],
    answer: 2,
    explain: 'Capacity grows with each bit used, but so does the size of each change — up to ±15 with 4 bits.',
  },
];
