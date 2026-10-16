import { useMemo, useState } from 'react';
import { Figure, Stat } from '../components/ui/display';
import { Slider, Toggle } from '../components/ui/controls';
import AudioPlayer from '../components/media/AudioPlayer';
import Waveform from '../components/media/Waveform';
import { generateMelody } from '../lib/synth';
import { differenceAudio, snr } from '../lib/audioStego';
import { seededRandom } from '../lib/prng';
import { formatBytes } from '../lib/bytes';

function fillLowBits(audio, bits) {
  const rand = seededRandom(17);
  const mask = (1 << bits) - 1;
  const samples = new Int16Array(audio.samples.length);
  for (let i = 0; i < samples.length; i++) samples[i] = (audio.samples[i] & ~mask) | Math.floor(rand() * (mask + 1));
  return { ...audio, samples };
}

export default function AudioLsbLab() {
  const audio = useMemo(() => generateMelody({ seconds: 4, sampleRate: 22050 }), []);
  const [bits, setBits] = useState(1);
  const [amplify, setAmplify] = useState(true);
  const stego = useMemo(() => fillLowBits(audio, bits), [audio, bits]);
  const noise = useMemo(() => differenceAudio(audio, stego, amplify ? Math.floor(6000 / ((1 << bits) - 1)) : 1), [audio, stego, bits, amplify]);
  const ratio = useMemo(() => snr(audio, stego), [audio, stego]);
  const perSecond = (audio.sampleRate * bits) / 8;

  return (
    <Figure
      title="Listen to the hidden layer"
      caption="Every sample’s lowest bits are filled with random data — a full-capacity hidden message. Compare the two players, then listen to the hidden layer on its own. Turn amplification off to hear how quiet it really is."
    >
      <Slider label="Bits replaced per sample" min={1} max={8} value={bits} onChange={setBits} format={(v) => `${v} of 16`} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <AudioPlayer audio={audio} label="Original" />
        <AudioPlayer audio={stego} label="Full of hidden data" />
      </div>
      <div className="mt-4 rounded-xl border border-line bg-surface-2/50 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">Only the hidden layer</p>
          <Toggle checked={amplify} onChange={setAmplify} label="Amplify" />
        </div>
        <Waveform audio={noise} height={64} color="--color-warn" label="Waveform of the hidden layer" />
        <AudioPlayer audio={noise} className="mt-3" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Signal-to-noise" value={`${ratio.toFixed(1)} dB`} hint={ratio > 60 ? 'Inaudible' : ratio > 40 ? 'Faint hiss' : 'Audible noise'} tone={ratio > 60 ? 'secret' : ratio > 40 ? 'warn' : 'danger'} />
        <Stat label="Capacity" value={`${formatBytes(perSecond)}/s`} hint="for this mono 22 kHz clip" />
        <Stat label="Max change" value={`±${(1 << bits) - 1}`} hint="of 65,536 levels" />
      </div>
    </Figure>
  );
}
