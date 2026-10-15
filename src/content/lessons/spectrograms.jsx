import { Link } from 'react-router-dom';
import SpectrogramPainter from '../../explorables/SpectrogramPainter';
import EchoDemo from '../../explorables/EchoDemo';
import { Callout } from '../../components/ui/display';

export default function Spectrograms() {
  return (
    <>
      <p>
        A waveform shows how loud a sound is from moment to moment, but not <em>what</em> it sounds like. For that, audio
        engineers use a <strong>spectrogram</strong>: a picture with time running left to right, pitch (frequency) running
        bottom to top, and brightness showing how strong each frequency is at each moment.
      </p>
      <p>
        It is built by cutting the sound into short, overlapping slices and running each through a{' '}
        <em>Fourier transform</em>, which measures how much of every frequency the slice contains. Spectrograms make
        whistles look like lines, drums look like vertical stripes, and voices look like stacks of curved bands.
      </p>

      <h2>Drawing pictures with sound</h2>
      <p>
        If a spectrogram turns sound into a picture, we can run it backwards: choose a picture, and build the sound that
        would draw it. Each row of the image becomes a pure tone at one pitch, switched on wherever the image has ink.
      </p>

      <SpectrogramPainter />

      <p>
        Musicians have used this trick for decades. The most famous example is a track on Aphex Twin’s 1999{' '}
        <em>Windowlicker</em> single, which hides an image of a grinning face in its spectrogram. Puzzle makers love it too:
        “look at the spectrogram” is one of the first things players try in capture-the-flag competitions.
      </p>
      <p>
        That popularity is exactly why it is weak <em>as a secret</em>. To the ear the picture is hidden, but anyone who opens
        the file in an audio editor and switches to spectrogram view will see it immediately. You can try that yourself in the{' '}
        <Link to="/detect/audio">Detect lab</Link>.
      </p>

      <h2>Smarter tricks: echoes and phase</h2>
      <p>
        In 1996, Walter Bender, Daniel Gruhl, Norishige Morimoto and Anthony Lu (of the MIT Media Lab and IBM) described
        several ways to hide data in audio that work with how human hearing behaves. Two of them are still taught today.
      </p>
      <p>
        <strong>Echo hiding</strong> adds a very faint echo to each short segment of sound. The delay of the echo encodes the
        bit: one delay means 0, another means 1. Echoes of a millisecond or two are far too short to hear as echoes — they just
        change the sound’s colour very slightly, the way a room does.
      </p>

      <EchoDemo />

      <p>
        <strong>Phase coding</strong> exploits the fact that our ears are almost deaf to the absolute <em>phase</em> of a sound
        — where each wave is in its cycle. The method rewrites the phases of the first segment of audio to carry the message,
        and adjusts the following segments to keep their relative phases, so the sound is essentially unchanged.
      </p>

      <Callout type="info" title="Spread spectrum">
        A third family, <strong>spread spectrum</strong>, spreads each bit across a wide range of frequencies as very low-level
        noise, using a pseudo-random sequence known only to the sender and receiver. Because the information is smeared so
        widely, it survives a surprising amount of processing. This is the basis of many audio <em>watermarking</em> systems,
        which you’ll meet in the last lesson.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'In a spectrogram, what does the vertical axis show?',
    options: ['Time', 'Loudness', 'Frequency (pitch)', 'File size'],
    answer: 2,
    explain: 'Time runs left to right, frequency bottom to top, and brightness shows strength.',
  },
  {
    q: 'Why is an image hidden in a spectrogram weak as a secret?',
    options: [
      'Because it makes the file much larger.',
      'Because viewing a spectrogram is one of the first things any audio analyst does.',
      'Because spectrograms only work on MP3 files.',
      'Because the image is always upside down.',
    ],
    answer: 1,
    explain: 'Hidden from the ear is not hidden from the eye — a spectrogram view shows it immediately.',
  },
  {
    q: 'How does echo hiding store a bit?',
    options: [
      'By adding a loud echo at the end of the song',
      'By adding a faint, very short echo whose delay means 0 or 1',
      'By deleting every other sample',
      'By changing the file name',
    ],
    answer: 1,
    explain: 'Two different echo delays (around a millisecond) stand for 0 and 1; the decoder measures the delay.',
  },
];
