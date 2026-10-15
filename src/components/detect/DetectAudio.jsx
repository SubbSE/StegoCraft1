import { useMemo, useRef, useState } from 'react';
import { Music, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Callout, Card, Stat } from '../ui/display';
import { Dropzone } from '../ui/Dropzone';
import Waveform from '../media/Waveform';
import Spectrogram from '../media/Spectrogram';
import AudioPlayer from '../media/AudioPlayer';
import StegoCraftCheck from './StegoCraftCheck';
import { AUDIO_ACCEPT, describeAudio } from '../lab/shared';
import { hideInAudio, revealFromAudio } from '../../lib/audioStego';
import { buildPayload } from '../../lib/payload';
import { generateMelody, synthesizeFromMask } from '../../lib/synth';
import { loadAudioFile, renderTextMask } from '../../lib/browser';
import { friendlyError } from '../../lib/errors';

const RATE = 22050;

/** The melody with 0.75 s of digital silence before and after, like many real recordings. */
function recording() {
  const melody = generateMelody({ seconds: 4, sampleRate: RATE });
  const pad = Math.floor(RATE * 0.75);
  const samples = new Int16Array(melody.samples.length + pad * 2);
  samples.set(melody.samples, pad);
  return { sampleRate: RATE, channels: 1, samples };
}

const SAMPLES = [
  {
    id: 'clean',
    label: 'Clean recording',
    note: 'A short tune with silence before and after. Nothing is hidden in it.',
    make: async () => recording(),
  },
  {
    id: 'lsb',
    label: 'Hidden message',
    note: 'A text message written into the lowest bit of every sample, in order — straight through the silence.',
    make: async () => {
      const payload = await buildPayload({ text: 'Meet at the old library at 7pm. Bring the red notebook. '.repeat(20) });
      return (await hideInAudio(recording(), payload)).audio;
    },
  },
  {
    id: 'picture',
    label: 'Picture in the sound',
    note: 'Something was mixed into this recording that you can barely hear. Can you see it?',
    make: async () => {
      const base = recording();
      const mask = renderTextMask('FOUND ME', { width: 200, height: 40, font: '700 26px "Space Grotesk Variable", sans-serif' });
      const art = synthesizeFromMask(mask, { sampleRate: RATE, seconds: base.samples.length / RATE, fMin: 6000, fMax: 10000 });
      const samples = base.samples.map((s, i) => Math.max(-32768, Math.min(32767, s + Math.round(art.samples[i] * 0.06))));
      return { ...base, samples };
    },
  },
];

const CLIP = 96;

/**
 * Looks at every near-silent stretch (no sample louder than ±3). Real digital silence is exactly 0;
 * silence that flickers in its lowest bits — while other silent parts don't — suggests hidden data.
 * Also returns a short, amplified clip of the first stretch worth looking at.
 */
function silenceReport(audio, size = 1024) {
  const { samples, channels } = audio;
  const frames = Math.floor(samples.length / channels);
  let silent = 0;
  let active = 0;
  let shown = -1;
  for (let start = 0; start + size <= frames; start += size) {
    let peak = 0;
    let nonZero = false;
    for (let i = 0; i < size; i++) {
      const v = samples[(start + i) * channels];
      peak = Math.max(peak, Math.abs(v));
      if (v !== 0) nonZero = true;
    }
    if (peak > 3) continue;
    silent++;
    if (nonZero) {
      active++;
      if (active === 1) shown = start;
    } else if (silent === 1) {
      shown = start;
    }
  }
  if (shown < 0) return { silent, active, clip: null };
  let peak = 0;
  for (let i = 0; i < CLIP; i++) peak = Math.max(peak, Math.abs(samples[(shown + i) * channels]));
  // A power of two that lifts the loudest sample to 50–100% of full scale.
  const gain = peak ? 2 ** Math.floor(Math.log2(32767 / peak)) : 1;
  const out = new Int16Array(CLIP);
  for (let i = 0; i < CLIP; i++) out[i] = Math.max(-32768, Math.min(32767, samples[(shown + i) * channels] * gain));
  return {
    silent,
    active,
    start: shown / audio.sampleRate,
    gain,
    clip: { sampleRate: audio.sampleRate, channels: 1, samples: out },
  };
}

function Analysis({ audio }) {
  const silence = useMemo(() => silenceReport(audio), [audio]);
  const zeros = useMemo(() => audio.samples.reduce((n, s) => n + (s === 0), 0) / audio.samples.length, [audio]);
  const ones = useMemo(() => audio.samples.reduce((n, s) => n + (s & 1), 0) / audio.samples.length, [audio]);
  const mixed = silence.active > 0 && silence.active < silence.silent;
  const message = !silence.silent
    ? 'There are no near-silent stretches to check in this recording.'
    : mixed
      ? `Suspicious: ${silence.silent - silence.active} silent stretches are perfectly silent, but ${silence.active} contain faint low-bit activity (first at ${silence.start.toFixed(2)} s). Data written into silence looks exactly like this.`
      : silence.active
        ? 'Every quiet stretch has faint low-bit activity. That is normal for recordings with background noise or dither.'
        : 'All silent stretches are perfect digital silence — no low-bit activity.';

  const clipCaption = !silence.clip
    ? ''
    : silence.active
      ? `${CLIP} samples from the first near-silent stretch with activity (at ${silence.start.toFixed(2)} s), amplified ×${silence.gain.toLocaleString()}.`
      : `${CLIP} samples from a silent stretch (at ${silence.start.toFixed(2)} s): perfectly flat, however much you amplify it.`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Spectrogram</h2>
          <Spectrogram audio={audio} label="Spectrogram of the recording" />
          <p className="text-xs text-muted">Look for shapes, letters or patterns that don’t belong to the music.</p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Waveform</h2>
          <Waveform audio={audio} height={90} />
          <AudioPlayer audio={audio} />
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Silence check</h2>
          {silence.clip && (
            <>
              <Waveform audio={silence.clip} height={90} color={mixed ? '--color-warn' : '--color-accent'} label={clipCaption} />
              <p className="text-xs text-muted">{clipCaption}</p>
            </>
          )}
          <p className={`rounded-xl px-4 py-3 text-sm text-ink ${mixed ? 'bg-warn/10' : 'bg-secret/10'}`} role="status">
            {message}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Exact zeros" value={`${(zeros * 100).toFixed(1)}%`} hint="digital silence" />
            <Stat label="LSB = 1" value={`${(ones * 100).toFixed(1)}%`} hint="of all samples" />
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">StegoCraft message?</h2>
          <StegoCraftCheck find={(password) => revealFromAudio(audio, { password })} />
        </Card>
      </div>
    </div>
  );
}

export default function DetectAudio() {
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loads = useRef(0);

  const load = async (fn, name, note = '') => {
    setLoading(true);
    setError('');
    try {
      setSubject({ audio: await fn(), name, note, id: ++loads.current });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {subject ? (
        <Card className="flex flex-wrap items-center gap-4">
          <Music aria-hidden="true" className="h-8 w-8 text-accent" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium text-ink">{subject.name}</p>
            <p className="text-muted">{describeAudio(subject.audio)}</p>
            {subject.note && <p className="mt-1 text-ink">{subject.note}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSubject(null)}>
            <X aria-hidden="true" className="h-4 w-4" /> Analyse another
          </Button>
        </Card>
      ) : (
        <Card className="space-y-4">
          <Dropzone accept={AUDIO_ACCEPT} onFile={(f) => load(() => loadAudioFile(f), f.name)} title={loading ? 'Decoding…' : 'Drop or choose a recording to analyse'} hint="WAV gives exact results. Other formats are decoded first." />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Or try a sample:</span>
            {SAMPLES.map((s) => (
              <Button key={s.id} size="sm" variant="secondary" disabled={loading} onClick={() => load(s.make, `${s.label} (sample)`, s.note)}>
                {s.label}
              </Button>
            ))}
          </div>
          {error && <Callout type="warn">{error}</Callout>}
        </Card>
      )}
      {subject && <Analysis key={subject.id} audio={subject.audio} />}
    </div>
  );
}
