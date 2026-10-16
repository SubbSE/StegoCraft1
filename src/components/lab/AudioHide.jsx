import { useMemo, useState } from 'react';
import { Download, EyeOff, Music, ScanSearch, Sparkles, X } from 'lucide-react';
import { buildPayload, payloadSize } from '../../lib/payload';
import { differenceAudio, hideInAudio, snr } from '../../lib/audioStego';
import { audioToBlob, downloadBlob, loadAudioFile, stemName } from '../../lib/browser';
import { friendlyError } from '../../lib/errors';
import { generateMelody } from '../../lib/synth';
import { Button } from '../ui/Button';
import { Callout, Card, Spinner, Stat } from '../ui/display';
import { Field, PasswordField, Slider } from '../ui/controls';
import { Dropzone } from '../ui/Dropzone';
import Waveform from '../media/Waveform';
import AudioPlayer from '../media/AudioPlayer';
import MessageInput from './MessageInput';
import CapacityMeter from './CapacityMeter';
import { AUDIO_ACCEPT, describeAudio } from './shared';

export default function AudioHide({ onTestReveal }) {
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kind, setKind] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [bits, setBits] = useState(1);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const capacity = cover ? Math.floor((cover.audio.samples.length * bits) / 8) : 0;
  const used = payloadSize({ text: kind === 'text' ? text : '', file: kind === 'file' ? file : null, encrypted: Boolean(password) });
  const hasMessage = kind === 'text' ? text.length > 0 : Boolean(file);

  const setCoverAudio = (next) => {
    setCover(next);
    setResult(null);
    setError('');
  };

  const onFile = async (f) => {
    setLoading(true);
    setError('');
    try {
      setCoverAudio({ audio: await loadAudioFile(f), name: f.name });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const hide = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const fileArg = kind === 'file' ? { name: file.name, type: file.type, bytes: new Uint8Array(await file.arrayBuffer()) } : null;
      const payload = await buildPayload({ text: kind === 'text' ? text : undefined, file: fileArg, password });
      const res = await hideInAudio(cover.audio, payload, { bitsPerCell: bits, password });
      setResult({ ...res, bits, snr: snr(cover.audio, res.audio), payloadBytes: payload.length });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const noise = useMemo(
    () => (result ? differenceAudio(cover.audio, result.audio, Math.floor(8000 / (2 ** result.bits - 1))) : null),
    [result, cover],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">1. Choose a cover sound</h2>
          {cover ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Music aria-hidden="true" className="h-8 w-8 shrink-0 text-accent" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-medium text-ink">{cover.name}</p>
                  <p className="text-muted">{describeAudio(cover.audio)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCoverAudio(null)}>
                  <X aria-hidden="true" className="h-4 w-4" /> Change
                </Button>
              </div>
              <Waveform audio={cover.audio} height={64} />
              <AudioPlayer audio={cover.audio} />
              {cover.audio.converted && (
                <Callout type="info">
                  This file was converted to 16-bit PCM. The result will be saved as a WAV file, which is larger than
                  compressed formats like MP3 — that's the price of keeping every bit exact.
                </Callout>
              )}
            </div>
          ) : (
            <>
              <Dropzone accept={AUDIO_ACCEPT} onFile={onFile} title={loading ? 'Decoding…' : 'Drop or choose an audio file'} hint="WAV works best. MP3 and others are converted." />
              <Button variant="secondary" className="w-full" onClick={() => setCoverAudio({ audio: generateMelody({ seconds: 8, sampleRate: 44100 }), name: 'melody.wav' })}>
                <Sparkles aria-hidden="true" className="h-4 w-4" /> Use a generated melody
              </Button>
            </>
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">2. Write your secret</h2>
          <MessageInput kind={kind} onKindChange={setKind} text={text} onTextChange={setText} file={file} onFileChange={setFile} />
        </Card>

        <Card className="space-y-5">
          <h2 className="text-lg font-semibold">3. Settings</h2>
          <Slider
            label="Bits per sample"
            min={1}
            max={4}
            value={bits}
            onChange={setBits}
            hint={bits === 1 ? 'Changes each sample by at most 1 of 65,536 levels — inaudible.' : `More space, but a faint hiss may become audible in quiet parts.`}
          />
          <Field label="Password (optional)" hint="Encrypts the message and scatters its bits through the whole recording.">
            <PasswordField value={password} onChange={setPassword} />
          </Field>
          {cover && <CapacityMeter used={used} capacity={capacity} />}
          <Button size="lg" className="w-full" disabled={!cover || !hasMessage || used > capacity || busy} onClick={hide}>
            {busy ? <Spinner /> : <EyeOff aria-hidden="true" className="h-5 w-5" />}
            {busy ? 'Hiding…' : 'Hide message in audio'}
          </Button>
          {error && <Callout type="warn">{error}</Callout>}
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        {result ? (
          <Card className="animate-fade-up space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Done — listen closely</h2>
              <Button onClick={() => downloadBlob(audioToBlob(result.audio), `${stemName(cover.name)}-stego.wav`)}>
                <Download aria-hidden="true" className="h-4 w-4" /> Download WAV
              </Button>
            </div>
            <AudioPlayer audio={cover.audio} label="Original" />
            <AudioPlayer audio={result.audio} label="With your hidden message" />
            <div className="rounded-xl border border-line bg-surface-2/60 p-4">
              <AudioPlayer audio={noise} label="The hidden layer, amplified" />
              <p className="mt-2 text-sm text-muted">
                Only the samples we changed, made thousands of times louder. A short message is a brief crackle (or
                scattered clicks, with a password); a long one sounds like static, because hidden data looks like random bits.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Signal-to-noise" value={Number.isFinite(result.snr) ? `${result.snr.toFixed(1)} dB` : '∞'} hint="Higher is quieter" tone="secret" />
              <Stat label="Samples changed" value={result.cellsChanged.toLocaleString()} hint={`of ${cover.audio.samples.length.toLocaleString()}`} />
              <Stat label="Hidden" value={`${result.payloadBytes.toLocaleString()} B`} hint={`${result.bits} bit${result.bits > 1 ? 's' : ''} per sample`} />
            </div>
            <Callout type="warn" title="Keep it a WAV">
              Converting to MP3, AAC or OGG — or sending it as a voice message — re-encodes the sound and destroys the hidden bits.
            </Callout>
            <Button variant="secondary" className="w-full" onClick={() => onTestReveal(result.audio)}>
              <ScanSearch aria-hidden="true" className="h-4 w-4" /> Test it: reveal from this audio
            </Button>
          </Card>
        ) : (
          <Card className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
              <Music aria-hidden="true" className="h-7 w-7 text-subtle" />
            </span>
            <p className="max-w-xs text-muted">Your audio with the hidden message will appear here — with a way to hear exactly what changed.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
