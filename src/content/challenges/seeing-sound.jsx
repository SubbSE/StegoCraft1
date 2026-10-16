import { Link } from 'react-router-dom';
import { ensureFont, renderTextMask } from '../../lib/browser';
import { unspoil } from '../../lib/flags';
import { generateMelody, synthesizeFromMask } from '../../lib/synth';

const SECRET = 'Q09NRVQ=';
const FONT = '700 30px "Space Grotesk Variable", sans-serif';
const SECONDS = 6;

export async function make() {
  const base = generateMelody({ seconds: SECONDS, seed: 9 });
  await ensureFont(FONT);
  const mask = renderTextMask(unspoil(SECRET), { width: 220, height: 44, font: FONT });
  const art = synthesizeFromMask(mask, { sampleRate: base.sampleRate, seconds: SECONDS, fMin: 5000, fMax: 9000 });
  const samples = base.samples.map((s, i) => Math.max(-32768, Math.min(32767, s + Math.round(art.samples[i] * 0.05))));
  return { kind: 'audio', name: 'hiss.wav', audio: { ...base, samples } };
}

export default function Story() {
  return (
    <>
      <p>This recording sounds like a simple tune with a faint hiss behind it.</p>
      <p>But some messages are meant to be seen, not heard.</p>
    </>
  );
}

export const hints = [
  <>A spectrogram draws sound as a picture: time runs from left to right, pitch from bottom to top.</>,
  <>
    Open the recording in the <Link to="/detect/audio">Detect lab’s Audio tab</Link> and look at its spectrogram.
  </>,
];

export function Walkthrough() {
  return (
    <ol>
      <li>
        Press <strong>Open in Detect lab</strong>.
      </li>
      <li>
        Look at the spectrogram. Above the notes of the tune, between about 5 and 9 kHz — where the “hiss” is — the secret
        word is written in sound.
      </li>
    </ol>
  );
}

export function Debrief() {
  return (
    <p>
      Every row of the hidden picture became a quiet sine tone, switched on wherever that row has ink. Your ears hear a
      hiss; a spectrogram shows the shape. Musicians have played with this for decades — the best-known example is on
      Aphex Twin’s 1999 <em>Windowlicker</em> single. See <Link to="/learn/spectrograms">Pictures made of sound</Link>.
    </p>
  );
}
