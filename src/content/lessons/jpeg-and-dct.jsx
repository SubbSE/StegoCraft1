import JpegSurvival from '../../explorables/JpegSurvival';
import DctExplorer from '../../explorables/DctExplorer';
import { Callout } from '../../components/ui/display';

export default function JpegAndDct() {
  return (
    <>
      <p>
        Most photos on the internet are JPEGs. Phones save them, websites serve them, and chat apps convert pictures to
        JPEG before sending them. So it matters a lot that, as we warned earlier, JPEG destroys least-significant-bit
        messages. Let’s see just how badly — and why.
      </p>

      <JpegSurvival />

      <p>
        Even at 100% quality, a large share of the hidden bits come out wrong, and the message is lost. To understand why,
        we need to look at how JPEG works.
      </p>

      <h2>How JPEG makes files small</h2>
      <p>JPEG (named after the Joint Photographic Experts Group, standardised in 1992) compresses a photo in four main steps:</p>
      <ol>
        <li>
          <strong>Separate brightness from colour.</strong> Our eyes notice brightness detail far more than colour detail, so
          the colour information is often stored at lower resolution.
        </li>
        <li>
          <strong>Cut the picture into 8×8 blocks.</strong> Each block is processed on its own.
        </li>
        <li>
          <strong>Describe each block as waves.</strong> The <em>discrete cosine transform</em> (DCT) rewrites the 64 pixels
          as 64 amounts of standard wave patterns — from flat (average brightness) to very fine stripes.
        </li>
        <li>
          <strong>Round off the fine detail.</strong> Each amount is divided by a number from a <em>quantisation table</em>{' '}
          and rounded. Fine-detail patterns get divided by large numbers, so most of them round to zero. Lower quality means
          bigger dividers.
        </li>
      </ol>
      <p>
        Step 4 is where information is thrown away. When the file is opened, the blocks are rebuilt from the rounded amounts,
        so every pixel comes back <em>close to</em> its original value — but rarely exactly. And “not exactly” is fatal for a
        message stored in the very last bit.
      </p>

      <DctExplorer />

      <h2>Hiding inside the JPEG itself</h2>
      <p>
        If pixels don’t survive JPEG, what does? The rounded frequency amounts — the <em>quantised coefficients</em>. They
        are the actual contents of a JPEG file, so a tool can hide bits <em>there</em> instead of in the pixels:
      </p>
      <ul>
        <li>
          <strong>JSteg</strong>, one of the first JPEG tools, replaced the least significant bit of each coefficient,
          skipping the values 0 and 1 (changing those would disturb the picture too much). It was later shown to be easy to
          detect with the chi-square test you’ll meet in the steganalysis lesson.
        </li>
        <li>
          <strong>F5</strong> (Andreas Westfeld, 2001) decreases coefficient values instead of overwriting bits, and uses a
          clever coding trick — <em>matrix encoding</em> — to hide the same message with fewer changes.
        </li>
        <li>
          <strong>Modern adaptive methods</strong> such as J-UNIWARD (2014) calculate how detectable each possible change would
          be, and hide bits mostly in busy, textured blocks where changes are hardest to notice.
        </li>
      </ul>

      <Callout type="warn" title="Robust vs. fragile">
        A message hidden in JPEG coefficients survives being copied as a file. It does <em>not</em> survive being
        re-compressed, resized or edited — which is exactly what most social networks and chat apps do to every photo you
        upload. Methods that survive that kind of processing exist (they are used for digital watermarks), but they carry far
        less data and rely on redundancy and error-correcting codes.
      </Callout>

      <p>
        The lesson for the image track: <strong>know your channel</strong>. If your picture will travel as an untouched
        file — an email attachment, a cloud link — lossless PNG with LSB hiding works well. If it will be re-compressed along
        the way, you need a robust method and a much smaller message.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'Which JPEG step actually throws information away?',
    options: ['Cutting into 8×8 blocks', 'The discrete cosine transform', 'Quantisation (dividing and rounding)', 'Opening the file'],
    answer: 2,
    explain: 'The DCT itself is reversible. Rounding the divided frequency amounts is what loses detail.',
  },
  {
    q: 'Why does a pixel-LSB message not survive being saved as JPEG?',
    options: [
      'JPEG files cannot contain text.',
      'Rebuilt pixels are only approximately equal to the originals, so their last bits change.',
      'JPEG removes the alpha channel.',
      'JPEG encrypts the picture.',
    ],
    answer: 1,
    explain: 'Even small rounding errors flip the least significant bits, scrambling the message.',
  },
  {
    q: 'Where do JPEG-aware tools such as JSteg and F5 hide their data?',
    options: ['In the file name', 'In the quantised DCT coefficients stored in the file', 'In the pixels after decoding', 'In the metadata only'],
    answer: 1,
    explain: 'The quantised coefficients are what a JPEG file actually stores, so changes there survive copying the file.',
  },
];
