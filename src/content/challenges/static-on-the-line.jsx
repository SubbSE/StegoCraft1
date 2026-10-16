import { Link } from 'react-router-dom';
import { hideInAudio } from '../../lib/audioStego';
import { unspoil } from '../../lib/flags';
import { buildPayload } from '../../lib/payload';
import { generateMelody } from '../../lib/synth';

const SECRET = 'RXZlcnkgc2FtcGxlIGNhcnJpZXMgb25lIGJpdCBvZiB0aGlzIG1lc3NhZ2UuIFRoZSBzZWNyZXQgd29yZCBpcyBIQVJNT05ZLg==';

export async function make() {
  const payload = await buildPayload({ text: unspoil(SECRET) });
  const { audio } = await hideInAudio(generateMelody({ seconds: 5, seed: 5 }), payload);
  return { kind: 'audio', name: 'tune.wav', audio };
}

export default function Story() {
  return (
    <>
      <p>Someone sent you this little tune as a WAV file. Play it: it sounds perfectly normal. That’s the point.</p>
      <p>
        A 16-bit recording stores every moment of sound as a whole number between −32,768 and 32,767. Nobody can hear a
        change of 1.
      </p>
    </>
  );
}

export const hints = [
  <>Lossless WAV files keep every bit exactly as it was written.</>,
  <>
    Open the recording in the Reveal tool (<Link to="/lab/audio">Lab → Audio → Reveal</Link>). No password was used.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Reveal tool</strong> (or download tune.wav and drop it into the Audio lab’s Reveal tab).
      </li>
      <li>
        Leave the password empty and press <strong>Reveal hidden message</strong>.
      </li>
      <li>StegoCraft reads the lowest bit of every sample, finds its signature and shows the message.</li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      Changing the lowest bit of a 16-bit sample changes it by at most 1/32,768 of full scale — about 90 dB quieter than
      the loudest possible sound. But the message only survives because WAV is lossless: converting the file to MP3 or
      AAC would destroy it, because lossy codecs rewrite every sample. See{' '}
      <Link to="/learn/audio-lsb">Whispering in the noise</Link>.
    </p>
  );
}
