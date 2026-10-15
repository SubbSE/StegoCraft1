import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react';
import { Figure } from '../components/ui/display';
import { Button, IconButton } from '../components/ui/Button';
import { TextInput } from '../components/ui/controls';
import { bytesToBits, utf8Encode } from '../lib/bytes';
import { generateLandscape } from '../lib/synth';

const PIXELS = 16;
const CH = ['R', 'G', 'B'];

export default function LsbStepper() {
  const image = useMemo(() => generateLandscape(320, 200, 42), []);
  const [message, setMessage] = useState('Hi!');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const bytes = useMemo(() => utf8Encode(message).slice(0, (PIXELS * 3) / 8), [message]);
  const bits = useMemo(() => bytesToBits(bytes), [bytes]);
  const total = bits.length;
  const k = Math.min(step, total);

  useEffect(() => {
    if (!playing) return undefined;
    if (k >= total) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 220);
    return () => clearTimeout(t);
  }, [playing, k, total]);

  const original = useMemo(() => {
    const vals = [];
    const y = 97;
    for (let p = 0; p < PIXELS; p++) {
      const i = (y * image.width + 196 + p) * 4;
      vals.push(image.data[i], image.data[i + 1], image.data[i + 2]);
    }
    return vals;
  }, [image]);

  const after = original.map((v, j) => (j < k ? (v & ~1) | bits[j] : v));
  const changed = after.filter((v, j) => v !== original[j]).length;
  const matched = k - changed;

  return (
    <Figure title="Hide a message, one bit at a time" caption="Each message bit replaces the last bit of the next colour value: red, green, blue of the first pixel, then the next pixel, and so on. Orange values had to change by 1; green ones already had the right last bit.">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="lsb-msg" className="mb-1.5 block text-sm font-medium text-ink">
            Message (first {(PIXELS * 3) / 8} bytes are shown)
          </label>
          <TextInput
            id="lsb-msg"
            value={message}
            maxLength={12}
            onChange={(e) => {
              setMessage(e.target.value);
              setStep(0);
              setPlaying(false);
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Previous bit" onClick={() => setStep(Math.max(0, k - 1))} disabled={k === 0}>
            <StepBack className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <Button size="md" onClick={() => (k >= total ? (setStep(0), setPlaying(true)) : setPlaying((p) => !p))} disabled={!total}>
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {playing ? 'Pause' : k >= total && total ? 'Replay' : 'Play'}
          </Button>
          <IconButton label="Next bit" onClick={() => setStep(Math.min(total, k + 1))} disabled={k >= total}>
            <StepForward className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton label="Reset" onClick={() => (setStep(0), setPlaying(false))}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2" aria-label="Message bits">
        {Array.from(bytes).map((byte, bi) => (
          <div key={bi} className="text-center">
            <div className="mb-0.5 font-mono text-[0.65rem] text-subtle">byte {bi + 1}</div>
            <div className="flex gap-px">
              {Array.from({ length: 8 }, (_, b) => {
                const j = bi * 8 + b;
                const state = j < k ? (j === k - 1 ? 'current' : 'done') : 'todo';
                return (
                  <span
                    key={b}
                    className={`flex h-6 w-4 items-center justify-center rounded-sm font-mono text-xs font-semibold sm:w-5 ${
                      state === 'current' ? 'bg-accent text-on-accent' : state === 'done' ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-muted'
                    }`}
                  >
                    {bits[j]}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: PIXELS }, (_, p) => {
          const before = original.slice(p * 3, p * 3 + 3);
          const now = after.slice(p * 3, p * 3 + 3);
          return (
            <div key={p} className="overflow-hidden rounded-lg border border-line bg-surface-2/50">
              <div className="flex h-7">
                <div className="flex-1" style={{ background: `rgb(${before.join(',')})` }} title="Before" />
                <div className="flex-1" style={{ background: `rgb(${now.join(',')})` }} title="After" />
              </div>
              <div className="space-y-0.5 px-2 py-1.5 font-mono text-[0.68rem]">
                {CH.map((c, ci) => {
                  const j = p * 3 + ci;
                  const written = j < k;
                  const diff = now[ci] !== before[ci];
                  return (
                    <div key={c} className={`flex justify-between ${j === k - 1 ? 'rounded bg-accent/15' : ''}`}>
                      <span className="text-subtle">{c}</span>
                      <span className={written ? (diff ? 'text-warn' : 'text-secret') : 'text-muted'}>
                        {before[ci]}
                        {written && <> → {now[ci]}</>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-muted">
          Bits written: <strong className="text-ink">{k}</strong> / {total}
        </span>
        <span className="text-muted">
          Values changed by 1: <strong className="text-warn">{changed}</strong>
        </span>
        <span className="text-muted">
          Already matched: <strong className="text-secret">{matched}</strong>
        </span>
      </div>
    </Figure>
  );
}
