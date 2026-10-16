import { useEffect, useMemo, useRef, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Slider } from '../components/ui/controls';
import AudioPlayer from '../components/media/AudioPlayer';
import { generateMelody } from '../lib/synth';
import { useTheme } from '../hooks/useTheme';

function requantise(audio, bits) {
  const shift = 16 - bits;
  const samples = audio.samples.map((s) => {
    if (!shift) return s;
    const step = 1 << shift;
    return Math.max(-32768, Math.min(32767, Math.round(s / step) * step));
  });
  return { ...audio, samples };
}

export default function BitDepthAudio() {
  const audio = useMemo(() => generateMelody({ seconds: 4, sampleRate: 22050 }), []);
  const [bits, setBits] = useState(4);
  const quantised = useMemo(() => requantise(audio, bits), [audio, bits]);
  const canvas = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const el = canvas.current;
    const w = el.clientWidth || 600;
    const h = 140;
    const dpr = window.devicePixelRatio || 1;
    el.width = w * dpr;
    el.height = h * dpr;
    const ctx = el.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, w, h);
    const from = 1400;
    const n = 160;
    const y = (s) => h / 2 - (s / 32768) * (h / 2 - 6) * 1.3;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = css.getPropertyValue('--color-line-strong');
    ctx.beginPath();
    for (let i = 0; i < n; i++) ctx[i ? 'lineTo' : 'moveTo']((i / (n - 1)) * w, y(audio.samples[from + i]));
    ctx.stroke();
    ctx.strokeStyle = css.getPropertyValue('--color-warn');
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x0 = (i / (n - 1)) * w;
      const x1 = ((i + 1) / (n - 1)) * w;
      const yy = y(quantised.samples[from + i]);
      if (i === 0) ctx.moveTo(x0, yy);
      else ctx.lineTo(x0, yy);
      ctx.lineTo(Math.min(w, x1), yy);
    }
    ctx.stroke();
  }, [audio, quantised, theme]);

  return (
    <Figure title="How many bits does sound need?" caption="The grey line is the original sound; the orange staircase is what survives with fewer bits per sample. Listen at 2–4 bits for harsh distortion, then slide to 16 — CD quality — where the steps are far too small to hear.">
      <Slider label="Bits per sample" min={1} max={16} value={bits} onChange={setBits} format={(v) => `${v} bits = ${(2 ** v).toLocaleString()} levels`} />
      <canvas ref={canvas} className="mt-4 block h-[140px] w-full rounded-xl border border-line bg-surface-2/50" role="img" aria-label="Original and quantised waveform" />
      <AudioPlayer audio={quantised} label={`Melody at ${bits} bits per sample`} className="mt-4" />
    </Figure>
  );
}
