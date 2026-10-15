import { Link } from 'react-router-dom';
import BitPlaneViewer from '../../explorables/BitPlaneViewer';
import { Callout } from '../../components/ui/display';

export default function BitPlanes() {
  return (
    <>
      <p>
        So far we have looked at pictures one pixel at a time. Now let’s flip that around and look at them{' '}
        <em>one bit at a time</em>. Every colour value has 8 bits. If we keep only bit 7 of every value and throw the rest
        away, we get a black-and-white picture called a <strong>bit plane</strong>. Do the same for bit 6, bit 5, and so on,
        and the picture splits into 8 layers.
      </p>

      <BitPlaneViewer />

      <h2>What the planes tell you</h2>
      <ul>
        <li>
          <strong>The top planes (7, 6, 5)</strong> contain the picture’s shapes. You can clearly see the mountains and the
          sun.
        </li>
        <li>
          <strong>The middle planes</strong> look like contour lines — they flip every time the brightness crosses a
          threshold.
        </li>
        <li>
          <strong>The bottom plane (bit 0)</strong> in this picture shows thin stripes and bands, following the smooth colour
          gradients of the sky and hills.
        </li>
      </ul>

      <h2>The visual attack</h2>
      <p>
        Now switch the picture to <strong>Message in order</strong> and look at bit 0. The top part of the plane suddenly
        turns into static. That static is the hidden message — which, like any encrypted or compressed data, looks random.
        Move the size slider and watch the band grow: because the message was written pixel by pixel from the top-left, it
        fills the plane like water filling a glass.
      </p>
      <p>
        This is the <strong>visual attack</strong>, described by Andreas Westfeld and Andreas Pfitzmann in 1999. It needs no
        maths at all: just look at the least significant bit plane and see whether part of it looks different from the rest.
      </p>
      <p>
        Now try <strong>Message scattered</strong>. With a password, the bits are spread across the whole image, so there is
        no sharp edge to spot. But look closely: the stripes are still fainter everywhere than in the clean picture. Spreading
        the data out hides <em>where</em> the message is, not <em>that</em> something changed.
      </p>

      <Callout type="key" title="Lessons for choosing a cover">
        <ul className="ml-4 list-disc space-y-1">
          <li>Avoid covers with large flat or smooth areas: screenshots, cartoons, logos, clear blue skies.</li>
          <li>Prefer busy, natural photos with lots of texture — their lowest bits are already noisy.</li>
          <li>Hide a small message in a big picture rather than filling it up.</li>
        </ul>
      </Callout>

      <p>
        In real photographs taken with a camera, the lowest bit plane is usually noisy already, thanks to the sensor. That
        makes the visual attack much harder — but, as we’ll see in the{' '}
        <Link to="/learn/steganalysis">steganalysis lesson</Link>, statistics can still catch what the eye cannot.
      </p>
    </>
  );
}

export const quiz = [
  {
    q: 'What does the bit 7 (most significant bit) plane of a photo usually show?',
    options: ['Random noise', 'The main shapes of the picture', 'Nothing — it is always black', 'The hidden message'],
    answer: 1,
    explain: 'The top bits decide the overall brightness of each pixel, so they draw the picture’s outlines and large areas.',
  },
  {
    q: 'Why did the message “in order” show up as a band in bit plane 0?',
    options: [
      'Because hidden messages are always white',
      'Because it replaced the structured low bits of the top rows with random-looking data',
      'Because PNG files store messages at the top',
      'Because the picture got brighter',
    ],
    answer: 1,
    explain: 'Message bits look random. Where the original low bits had structure, the random region stands out.',
  },
  {
    q: 'Which cover image makes least-significant-bit hiding hardest to spot visually?',
    options: ['A screenshot of a text document', 'A logo with flat colours', 'A detailed, noisy photo of a forest', 'A clear blue sky'],
    answer: 2,
    explain: 'Busy, textured photos already have noisy low bits, so random message bits blend in.',
  },
];
