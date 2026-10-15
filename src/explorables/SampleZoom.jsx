import { useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Slider } from '../components/ui/controls';
import Waveform from '../components/media/Waveform';
import AudioPlayer from '../components/media/AudioPlayer';
import { generateMelody } from '../lib/synth';

export default function SampleZoom() {
  const audio = useMemo(() => generateMelody({ seconds: 4, sampleRate: 22050 }), []);
  const total = audio.samples.length;
  const [zoom, setZoom] = useState(0); // 0 = whole clip, 100 = ~40 samples
  const [center, setCenter] = useState(50);

  const span = Math.max(40, Math.round(total * Math.pow(40 / total, zoom / 100)));
  const mid = Math.round((center / 100) * total);
  const start = Math.max(0, Math.min(total - span, mid - Math.floor(span / 2)));
  const ms = (span / audio.sampleRate) * 1000;
  const shown = Array.from(audio.samples.slice(start, start + Math.min(span, 12)));

  return (
    <Figure title="Zoom into a sound" caption="Sound is stored as a list of numbers: the air pressure, measured 22,050 times per second in this clip. Zoom all the way in and every dot is one sample.">
      <AudioPlayer audio={audio} />
      <div className="mt-4 rounded-xl border border-line bg-surface-2/50 p-3">
        <Waveform audio={audio} start={start} end={start + span} height={140} label="Zoomable waveform" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Zoom" min={0} max={100} value={zoom} onChange={setZoom} format={() => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(ms < 10 ? 2 : 0)} ms`)} />
        <Slider label="Position" min={0} max={100} value={center} onChange={setCenter} format={(v) => `${((v / 100) * 4).toFixed(2)} s`} />
      </div>
      <p className="mt-3 font-mono text-xs leading-relaxed break-all text-muted">
        <span className="text-ink">Showing {span.toLocaleString()} samples.</span> First values: {shown.join(', ')}…
      </p>
    </Figure>
  );
}
