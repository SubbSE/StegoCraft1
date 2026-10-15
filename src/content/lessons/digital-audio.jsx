import SampleZoom from '../../explorables/SampleZoom';
import BitDepthAudio from '../../explorables/BitDepthAudio';
import { Callout } from '../../components/ui/display';

export default function DigitalAudio() {
  return (
    <>
      <p>
        Sound is a wave of air pressure. When you speak, your voice pushes the air in tiny, fast ripples; a microphone turns
        those ripples into an electrical signal that rises and falls in the same pattern. To store that signal, a computer
        measures it many thousands of times per second and writes each measurement down as a number. Each measurement is
        called a <strong>sample</strong>.
      </p>

      <SampleZoom />

      <h2>Two numbers describe digital audio</h2>
      <p>
        <strong>Sample rate</strong> is how many measurements are taken per second. CDs use 44,100 per second (44.1 kHz). A
        rule called the <em>Nyquist–Shannon sampling theorem</em> says a sample rate can capture frequencies up to half its
        value — so 44.1 kHz covers sounds up to about 22 kHz, just above the limit of human hearing (around 20 kHz).
      </p>
      <p>
        <strong>Bit depth</strong> is how precisely each measurement is stored. With 16 bits — the CD standard — each sample is
        a whole number from −32,768 to 32,767: 65,536 possible levels. Fewer bits means coarser steps, and the rounding errors
        are heard as distortion and hiss:
      </p>

      <BitDepthAudio />

      <p>
        At 16 bits, the gap between two neighbouring levels is tiny: about 96 decibels quieter than the loudest possible
        sound. For comparison, the quiet hum of a room is usually far louder than that.
      </p>

      <h2>How much data is that?</h2>
      <p>
        One second of CD-quality stereo is 44,100 samples × 16 bits × 2 channels = 1,411,200 bits — about 176 kilobytes.
        A minute is roughly 10 MB. That is a lot of numbers in which to hide a few bits.
      </p>

      <h2>File formats matter (again)</h2>
      <ul>
        <li>
          <strong>WAV</strong> files usually store the samples exactly as they are, uncompressed (“PCM”).
        </li>
        <li>
          <strong>FLAC</strong> compresses losslessly — files are smaller, but every sample comes back exactly.
        </li>
        <li>
          <strong>MP3, AAC and Opus</strong> are lossy. Like JPEG for pictures, they use a model of human hearing to throw away
          what you are unlikely to notice. The decoded samples are close to the originals, but not identical.
        </li>
      </ul>

      <Callout type="key" title="The same rule as pictures">
        Bit-level hiding needs lossless audio. A voice message, a streaming upload or an MP3 conversion will re-encode the
        samples and destroy anything hidden in their lowest bits.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'What does a sample rate of 44,100 Hz mean?',
    options: [
      'The sound is 44,100 seconds long.',
      'The sound’s pressure is measured 44,100 times per second.',
      'Each sample has 44,100 levels.',
      'The loudest sound is 44,100 decibels.',
    ],
    answer: 1,
    explain: 'Sample rate is the number of measurements per second.',
  },
  {
    q: 'How many different levels can a 16-bit sample have?',
    options: ['16', '256', '44,100', '65,536'],
    answer: 3,
    explain: '2¹⁶ = 65,536 levels, from −32,768 to 32,767.',
  },
  {
    q: 'Which format keeps every sample exactly as it was?',
    options: ['MP3', 'AAC', 'Uncompressed WAV', 'Opus'],
    answer: 2,
    explain: 'WAV (PCM) stores samples as-is. FLAC is lossless too. MP3, AAC and Opus are lossy.',
  },
];
