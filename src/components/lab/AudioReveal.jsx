import { useState } from 'react';
import { Music, ScanSearch, X } from 'lucide-react';
import { openPayload } from '../../lib/payload';
import { revealFromAudio } from '../../lib/audioStego';
import { loadAudioFile } from '../../lib/browser';
import { friendlyError } from '../../lib/errors';
import { Button } from '../ui/Button';
import { Callout, Card, Spinner } from '../ui/display';
import { Field, PasswordField } from '../ui/controls';
import { Dropzone } from '../ui/Dropzone';
import Waveform from '../media/Waveform';
import RevealResult from './RevealResult';
import { AUDIO_ACCEPT, describeAudio } from './shared';

export default function AudioReveal({ initial, initialName = 'stego.wav' }) {
  const [stego, setStego] = useState(initial ? { audio: initial, name: initialName } : null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [found, setFound] = useState(null);

  const choose = (next) => {
    setStego(next);
    setFound(null);
    setError('');
  };

  const onFile = async (f) => {
    try {
      choose({ audio: await loadAudioFile(f), name: f.name });
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  const reveal = async () => {
    setBusy(true);
    setError('');
    setFound(null);
    try {
      const hit = await revealFromAudio(stego.audio, { password });
      const result = await openPayload(hit.header, hit.body, password);
      setFound({ result, meta: { ...hit, encrypted: hit.header.encrypted } });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card className="space-y-5 lg:self-start">
        <h2 className="text-lg font-semibold">Find a hidden message</h2>
        {stego ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Music aria-hidden="true" className="h-8 w-8 shrink-0 text-accent" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium text-ink">{stego.name}</p>
                <p className="text-muted">{describeAudio(stego.audio)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => choose(null)}>
                <X aria-hidden="true" className="h-4 w-4" /> Change
              </Button>
            </div>
            <Waveform audio={stego.audio} height={56} />
          </div>
        ) : (
          <Dropzone accept={AUDIO_ACCEPT} onFile={onFile} title="Drop or choose an audio file" hint="Use the WAV file made in the Hide tab." />
        )}
        {stego?.audio.decoded && (
          <Callout type="warn">
            This is a compressed format. Lossy codecs like MP3 rewrite every sample, so hidden bits almost never survive them.
          </Callout>
        )}
        <Field label="Password" hint="Only needed if the message was hidden with one.">
          <PasswordField value={password} onChange={setPassword} placeholder="Leave empty if none" autoComplete="off" />
        </Field>
        <Button size="lg" className="w-full" disabled={!stego || busy} onClick={reveal}>
          {busy ? <Spinner /> : <ScanSearch aria-hidden="true" className="h-5 w-5" />}
          {busy ? 'Searching…' : 'Reveal hidden message'}
        </Button>
      </Card>
      <div className="space-y-4">
        {found && <RevealResult result={found.result} meta={found.meta} />}
        {error && (
          <Callout type="warn" title="Nothing revealed">
            {error}
          </Callout>
        )}
        {!found && !error && (
          <Card className="flex min-h-60 items-center justify-center text-center">
            <p className="max-w-sm text-muted">StegoCraft reads the lowest bits of every sample and looks for its signature.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
