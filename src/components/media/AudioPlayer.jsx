import { useMemo } from 'react';
import { audioToBlob } from '../../lib/browser';
import { useObjectUrl } from '../../hooks/useObjectUrl';

/** Native audio player for an in-memory { sampleRate, channels, samples } clip. */
export default function AudioPlayer({ audio, label, className = '' }) {
  const blob = useMemo(() => (audio ? audioToBlob(audio) : null), [audio]);
  const url = useObjectUrl(blob);
  if (!url) return null;
  return (
    <div className={className}>
      {label && <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>}
      <audio controls src={url} className="h-10 w-full" aria-label={label || 'Audio player'} />
    </div>
  );
}
