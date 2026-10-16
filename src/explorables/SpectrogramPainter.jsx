import { useMemo, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented, Slider, TextInput } from '../components/ui/controls';
import Spectrogram from '../components/media/Spectrogram';
import AudioPlayer from '../components/media/AudioPlayer';
import { renderTextMask } from '../lib/browser';
import { generateMelody, synthesizeFromMask } from '../lib/synth';
import { useDebounced } from '../hooks/useDebounced';

const RATE = 22050;

export default function SpectrogramPainter() {
  const [text, setText] = useState('HELLO');
  const [mode, setMode] = useState('alone');
  const [level, setLevel] = useState(25);
  const word = useDebounced(text, 300);
  const melody = useMemo(() => generateMelody({ seconds: 4, sampleRate: RATE }), []);

  const painted = useMemo(() => {
    const label = word.toUpperCase() || ' ';
    const px = Math.min(34, Math.floor(150 / (Math.max(1, label.length) * 0.66)));
    const mask = renderTextMask(label, { width: 160, height: 44, font: `700 ${px}px "Space Grotesk Variable", sans-serif` });
    return synthesizeFromMask(mask, { sampleRate: RATE, seconds: 4, fMin: 4000, fMax: 9500 });
  }, [word]);

  const audio = useMemo(() => {
    if (mode === 'alone') return painted;
    const gain = level / 100;
    const samples = new Int16Array(melody.samples.length);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.max(-32768, Math.min(32767, Math.round(melody.samples[i] + painted.samples[i] * gain)));
    }
    return { ...melody, samples };
  }, [mode, painted, melody, level]);

  return (
    <Figure
      title="Paint with sound"
      caption="Every row of the picture becomes a pure tone, switched on wherever the letters have ink. To your ears it is just a whoosh; on a spectrogram, the word appears. Mix it into the melody and lower the level until you can barely hear it — it’s still visible."
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="paint-text" className="mb-1.5 block text-sm font-medium text-ink">
            Word to paint
          </label>
          <TextInput id="paint-text" value={text} maxLength={8} onChange={(e) => setText(e.target.value)} />
        </div>
        <Segmented
          label="Sound"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'alone', label: 'On its own' },
            { value: 'mixed', label: 'Hidden in music' },
          ]}
        />
      </div>
      {mode === 'mixed' && <Slider className="mt-4" label="Level of the painted sound" min={2} max={100} value={level} onChange={setLevel} format={(v) => `${v}%`} />}
      <Spectrogram audio={audio} maxFreq={11025} size={512} hop={128} className="mt-5" label={`Spectrogram showing the word ${word}`} />
      <AudioPlayer audio={audio} className="mt-4" />
    </Figure>
  );
}
