import { useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented } from '../components/ui/controls';
import AudioPlayer from '../components/media/AudioPlayer';
import { generateMelody } from '../lib/synth';
import { addEcho, detectEchoBit } from '../lib/dsp';
import { channelToFloat, floatToInt16Sample } from '../lib/wav';

const RATE = 22050;
const DELAY = { 0: 22, 1: 44 }; // samples: about 1.0 ms and 2.0 ms
const GAIN = 0.5;

function Kernel({ delay }) {
  const x = (d) => 20 + (d / 60) * 260;
  return (
    <svg viewBox="0 0 300 110" className="w-full" role="img" aria-label={`Echo of ${((delay / RATE) * 1000).toFixed(1)} milliseconds`}>
      <line x1="20" y1="90" x2="290" y2="90" stroke="var(--color-line-strong)" />
      <line x1={x(0)} y1="90" x2={x(0)} y2="18" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
      <line x1={x(delay)} y1="90" x2={x(delay)} y2={90 - 72 * GAIN} stroke="var(--color-secret)" strokeWidth="4" strokeLinecap="round" />
      <text x={x(0)} y="106" textAnchor="middle" fontSize="11" fill="var(--color-muted)">
        sound
      </text>
      <text x={x(delay)} y="106" textAnchor="middle" fontSize="11" fill="var(--color-muted)">
        echo +{((delay / RATE) * 1000).toFixed(1)} ms
      </text>
    </svg>
  );
}

export default function EchoDemo() {
  const melody = useMemo(() => generateMelody({ seconds: 4, sampleRate: RATE }), []);
  const signal = useMemo(() => channelToFloat(melody.samples, 1), [melody]);
  const [bit, setBit] = useState(0);

  const { audio, decoded } = useMemo(() => {
    const echoed = addEcho(signal, DELAY[bit], GAIN);
    let peak = 1e-9;
    for (const v of echoed) peak = Math.max(peak, Math.abs(v));
    const samples = Int16Array.from(echoed, (v) => floatToInt16Sample((v / peak) * 0.7));
    return { audio: { sampleRate: RATE, channels: 1, samples }, decoded: detectEchoBit(echoed.subarray(20000, 20000 + 4096), DELAY[0], DELAY[1]) };
  }, [signal, bit]);

  return (
    <Figure
      title="Hide a bit in an echo"
      caption="A bit is hidden by adding a faint echo after one of two tiny delays. Echoes this short don’t sound like echoes — they just colour the sound slightly. The decoder looks for the delay using the cepstrum (a “spectrum of the spectrum”)."
    >
      <Segmented
        label="Bit to hide"
        value={bit}
        onChange={setBit}
        options={[
          { value: 0, label: 'Hide a 0' },
          { value: 1, label: 'Hide a 1' },
        ]}
      />
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
        <Kernel delay={DELAY[bit]} />
        <div className="space-y-3">
          <AudioPlayer audio={melody} label="Original" />
          <AudioPlayer audio={audio} label={`With the echo for ${bit}`} />
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm">
        <span className="text-muted">Decoder: echo strength at 1.0 ms = </span>
        <strong className="font-mono text-ink">{decoded.c0.toFixed(3)}</strong>
        <span className="text-muted">, at 2.0 ms = </span>
        <strong className="font-mono text-ink">{decoded.c1.toFixed(3)}</strong>
        <span className="text-muted"> → it reads a </span>
        <strong className="font-mono text-secret">{decoded.bit}</strong>
      </div>
    </Figure>
  );
}
