import { useEffect, useMemo, useRef } from 'react';
import { drawImage } from '../../lib/browser';
import { spectrogramImage } from '../../lib/specImage';
import { channelToFloat } from '../../lib/wav';

export default function Spectrogram({ audio, maxFreq, size = 1024, hop, className = '', label = 'Spectrogram' }) {
  const canvas = useRef(null);
  const image = useMemo(() => {
    if (!audio) return null;
    const signal = channelToFloat(audio.samples, audio.channels, 0);
    const autoHop = hop ?? Math.max(64, Math.floor(signal.length / 900 / 64) * 64 || 64);
    return spectrogramImage(signal, audio.sampleRate, { size, hop: autoHop, maxFreq: maxFreq ?? audio.sampleRate / 2 });
  }, [audio, maxFreq, size, hop]);
  useEffect(() => {
    if (image) drawImage(canvas.current, image);
  }, [image]);
  if (!image) return null;
  const top = maxFreq ?? audio.sampleRate / 2;
  const seconds = audio.samples.length / audio.channels / audio.sampleRate;
  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-right font-mono text-[0.65rem] text-subtle">
          <span>{(top / 1000).toFixed(top >= 10000 ? 0 : 1)} kHz</span>
          <span>{(top / 2000).toFixed(1)}</span>
          <span>0</span>
        </div>
        <canvas ref={canvas} role="img" aria-label={label} className="block h-48 w-full min-w-0 rounded-lg border border-line sm:h-56" />
      </div>
      <div className="mt-1 flex justify-between pl-10 font-mono text-[0.65rem] text-subtle">
        <span>0 s</span>
        <span>time →</span>
        <span>{seconds.toFixed(1)} s</span>
      </div>
    </div>
  );
}
