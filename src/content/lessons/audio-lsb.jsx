import { Link } from 'react-router-dom';
import AudioLsbLab from '../../explorables/AudioLsbLab';
import { Callout } from '../../components/ui/display';

export default function AudioLsb() {
  return (
    <>
      <p>
        You already know this technique. Audio LSB hiding is exactly the same idea as image LSB hiding: walk through the
        samples one by one and replace the least significant bit of each with the next bit of your message. Only the
        container has changed.
      </p>
      <p>
        In a 16-bit recording, the least significant bit is worth 1 out of 65,536 levels — about 96 dB below the loudest
        possible sound. Real recordings already contain far more noise than that: microphone hiss, room noise, electrical
        hum. A change of one level disappears inside it.
      </p>

      <AudioLsbLab />

      <h2>What you just heard</h2>
      <ul>
        <li>
          With <strong>1–2 bits</strong> per sample, the two players sound identical. The hidden layer is only audible when
          amplified thousands of times.
        </li>
        <li>
          Around <strong>4–6 bits</strong>, a soft hiss creeps in, most noticeable as the notes fade out.
        </li>
        <li>
          At <strong>8 bits</strong>, half of every sample is message, and the noise is impossible to miss.
        </li>
      </ul>
      <p>
        Notice that the amplified hidden layer sounds like static. That is the same lesson as with pictures: well-hidden data,
        especially encrypted data, is indistinguishable from random noise.
      </p>

      <h2>A lot of room</h2>
      <p>
        One second of CD-quality stereo has 88,200 samples, so with one bit per sample you can hide 88,200 bits — about 11
        kilobytes — every second. A three-minute song could carry around 2 MB while sounding exactly the same.
      </p>

      <h2>Where audio LSB goes wrong</h2>
      <ul>
        <li>
          <strong>Lossy re-encoding.</strong> Converting to MP3 or AAC, sending a voice message or uploading to a streaming
          service re-encodes the samples and wipes out the lowest bits.
        </li>
        <li>
          <strong>Digital silence.</strong> Many files contain stretches where every sample is exactly 0. Writing message
          bits there turns perfect silence into faint noise — easy for an analyst to spot, and even audible with headphones
          turned up. Careful tools skip silent passages. StegoCraft keeps things simple and doesn’t, so choose a cover
          without long silences.
        </li>
        <li>
          <strong>Statistics.</strong> Just like with images, filling the lowest bits with message data evens out patterns
          that natural recordings have. Detectors look for exactly that.
        </li>
      </ul>

      <Callout type="tip" title="Try it with your own sound">
        The <Link to="/lab/audio">Audio Lab</Link> lets you hide text or a whole file in any recording, play the amplified
        hidden layer, and download the result as a WAV file.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'Why is changing the least significant bit of 16-bit audio inaudible?',
    options: [
      'Because speakers cannot play the last bit.',
      'Because the change is about 1/65,536 of the range — far below the noise already in the recording.',
      'Because the human ear ignores odd numbers.',
      'Because WAV files skip the last bit.',
    ],
    answer: 1,
    explain: 'A one-level change is around 96 dB below full scale, buried in the recording’s own noise.',
  },
  {
    q: 'Roughly how much data can 1-bit LSB hide in one second of CD-quality stereo audio?',
    options: ['11 bytes', 'About 11 kilobytes', 'About 1 megabyte', '44 megabytes'],
    answer: 1,
    explain: '44,100 samples × 2 channels × 1 bit = 88,200 bits ≈ 11 KB per second.',
  },
  {
    q: 'Why is a stretch of digital silence a poor place to hide bits?',
    options: [
      'Silence cannot be saved in WAV files.',
      'Changing perfect zeros into tiny non-zero values creates noise where there should be none.',
      'Silence is always encrypted.',
      'Silent parts are deleted by MP3.',
    ],
    answer: 1,
    explain: 'Natural silence in a digital file is often exactly 0. Any hidden bits there stand out clearly.',
  },
];
