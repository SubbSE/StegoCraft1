import PixelZoom from '../../explorables/PixelZoom';
import ColorBitLab from '../../explorables/ColorBitLab';
import { Callout } from '../../components/ui/display';

export default function HowImagesWork() {
  return (
    <>
      <p>
        A digital picture looks smooth, but zoom in far enough and it breaks apart into a grid of tiny squares called{' '}
        <strong>pixels</strong> (short for “picture elements”). A phone photo has millions of them. Each one has a single,
        solid colour.
      </p>

      <PixelZoom />

      <h2>Three numbers per pixel</h2>
      <p>
        Every pixel’s colour is stored as three numbers: how much <strong>red</strong>, <strong>green</strong> and{' '}
        <strong>blue</strong> light to mix. Each number is one byte, from 0 (none) to 255 (full). Mix all three at full
        strength and you get white; turn them all off and you get black. With 256 levels per channel, there are 256 × 256 ×
        256 — about 16.7 million — possible colours.
      </p>
      <p>
        Some images have a fourth number, <strong>alpha</strong>, for transparency. We will leave alpha alone: browsers
        handle partly transparent pixels in ways that can quietly change the other numbers.
      </p>

      <h2>The bit your eyes can’t see</h2>
      <p>
        You already know that the bits in a byte are not equally important. Here is what that means for colour. Try
        flipping bits on the left side of a row, then on the right side.
      </p>

      <ColorBitLab />

      <p>
        Flipping a most significant bit changes a channel by 128 — a huge jump. Flipping the least significant bit changes
        it by just 1 out of 255, a difference of less than half a percent. No human can see that. Even the camera that took
        the photo adds more random variation than that, in the form of sensor noise.
      </p>
      <p>
        So the least significant bit of every colour value is free real estate. We can set it to anything we want — for
        example, to the bits of a secret message — and the picture will look exactly the same.
      </p>

      <h2>How much room is there?</h2>
      <p>
        If we use one bit from each of the three colour channels, every pixel can carry 3 bits. A full-HD picture of 1920 ×
        1080 pixels has about 2 million pixels, so:
      </p>
      <p className="rounded-xl bg-surface-2 px-4 py-3 text-center font-mono text-[0.95rem]">
        1920 × 1080 × 3 bits = 6,220,800 bits ≈ 760 KB
      </p>
      <p>
        That is enough for a long novel — hidden in a single photo that looks completely unchanged.
      </p>

      <h2>Lossless vs. lossy</h2>
      <p>
        There is one catch. Image files can be saved in two very different ways:
      </p>
      <ul>
        <li>
          <strong>Lossless</strong> formats like <strong>PNG</strong> store every number exactly. What you save is what you
          get back.
        </li>
        <li>
          <strong>Lossy</strong> formats like <strong>JPEG</strong> throw away details your eyes are unlikely to miss, to make
          files smaller. Unfortunately, the least significant bits are exactly the kind of detail they throw away.
        </li>
      </ul>

      <Callout type="key" title="Rule of thumb">
        Least-significant-bit hiding needs a lossless format such as PNG. A JPEG — or any app that re-compresses your
        picture — scrambles the hidden bits. We will see exactly why in the JPEG lesson.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'How many bits does a typical full-colour pixel use (8 bits each for red, green and blue)?',
    options: ['3', '8', '24', '256'],
    answer: 2,
    explain: 'Three channels × 8 bits = 24 bits per pixel, which gives about 16.7 million possible colours.',
  },
  {
    q: 'Which change to a pixel would you most likely notice?',
    options: ['Red goes from 200 to 201', 'Red goes from 200 to 72', 'Blue goes from 13 to 12', 'Green goes from 90 to 91'],
    answer: 1,
    explain: 'A change of 128 comes from flipping the most significant bit — a visible jump. Changes of 1 are invisible.',
  },
  {
    q: 'Why should you save a picture with a hidden least-significant-bit message as PNG instead of JPEG?',
    options: [
      'PNG files are always smaller.',
      'PNG is lossless, so every pixel value — including the hidden bits — is stored exactly.',
      'JPEG cannot store colour.',
      'PNG files are encrypted.',
    ],
    answer: 1,
    explain: 'JPEG approximates pixel values to save space, which destroys the least significant bits.',
  },
];
