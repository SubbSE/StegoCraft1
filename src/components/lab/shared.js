import { EyeOff, ScanSearch } from 'lucide-react';

export const MODE_OPTIONS = [
  { value: 'hide', label: 'Hide', icon: EyeOff },
  { value: 'reveal', label: 'Reveal', icon: ScanSearch },
];

export const AUDIO_ACCEPT = 'audio/*,.wav,.mp3,.ogg,.flac,.m4a,.aac';

export function describeAudio(audio) {
  const seconds = audio.samples.length / audio.channels / audio.sampleRate;
  const layout = audio.channels === 1 ? 'mono' : audio.channels === 2 ? 'stereo' : `${audio.channels} channels`;
  return `${seconds.toFixed(1)} s · ${(audio.sampleRate / 1000).toFixed(1)} kHz · ${layout}`;
}
