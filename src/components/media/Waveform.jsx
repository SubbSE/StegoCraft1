import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Min/max waveform of the first channel of interleaved 16-bit samples.
 * `start`/`end` (in frames) zoom into part of the clip.
 */
export default function Waveform({ audio, start = 0, end, height = 96, color = '--color-accent', className = '', label = 'Waveform' }) {
  const ref = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !audio) return;
    const width = canvas.clientWidth || 600;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const { samples, channels } = audio;
    const frames = Math.floor(samples.length / channels);
    const from = Math.max(0, start);
    const to = Math.min(frames, end ?? frames);
    const span = Math.max(1, to - from);
    const mid = height / 2;

    ctx.strokeStyle = cssVar('--color-line');
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.stroke();

    ctx.fillStyle = cssVar(color);
    ctx.strokeStyle = cssVar(color);
    if (span <= width * 2) {
      // Few samples: draw them individually as a line with dots.
      ctx.beginPath();
      for (let i = 0; i < span; i++) {
        const x = (i / Math.max(1, span - 1)) * width;
        const y = mid - (samples[(from + i) * channels] / 32768) * (mid - 4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (span <= 120) {
        for (let i = 0; i < span; i++) {
          const x = (i / Math.max(1, span - 1)) * width;
          const y = mid - (samples[(from + i) * channels] / 32768) * (mid - 4);
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      for (let x = 0; x < width; x++) {
        const a = from + Math.floor((x / width) * span);
        const b = from + Math.floor(((x + 1) / width) * span);
        let lo = 32767;
        let hi = -32768;
        for (let f = a; f < Math.max(b, a + 1); f++) {
          const s = samples[f * channels];
          if (s < lo) lo = s;
          if (s > hi) hi = s;
        }
        const y1 = mid - (hi / 32768) * (mid - 2);
        const y2 = mid - (lo / 32768) * (mid - 2);
        ctx.fillRect(x, y1, 1, Math.max(1, y2 - y1));
      }
    }
  }, [audio, start, end, height, color, theme]);

  return <canvas ref={ref} role="img" aria-label={label} className={`block w-full ${className}`} style={{ height }} />;
}
