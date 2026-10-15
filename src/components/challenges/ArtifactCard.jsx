import { useNavigate } from 'react-router-dom';
import { Download, Mail, MessageCircle, Microscope, ScanSearch, StickyNote } from 'lucide-react';
import { audioToBlob, downloadBlob, imageToBlob } from '../../lib/browser';
import { handOff } from '../../lib/handoff';
import { describeAudio } from '../lab/shared';
import AudioPlayer from '../media/AudioPlayer';
import ImageCanvas from '../media/ImageCanvas';
import Waveform from '../media/Waveform';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import { Card } from '../ui/display';

/** Opens a tool page with this file already loaded. */
function useOpenIn() {
  const navigate = useNavigate();
  return (to, item) => navigate(to, { state: { handoff: handOff(item) } });
}

function FileHeader({ name, detail }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-lg font-semibold">Your file</h2>
      <span className="font-mono text-xs text-muted">
        {name}
        {detail && ` · ${detail}`}
      </span>
    </div>
  );
}

function ImageArtifact({ name, image }) {
  const openIn = useOpenIn();
  const item = { kind: 'image', name, image };
  return (
    <Card className="space-y-4">
      <FileHeader name={name} detail={`${image.width} × ${image.height} px`} />
      <ImageCanvas image={image} className="w-full rounded-xl border border-line" label={`The challenge picture, ${name}`} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={async () => downloadBlob(await imageToBlob(image), name)}>
          <Download aria-hidden="true" className="h-4 w-4" /> Download PNG
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openIn('/lab/image', item)}>
          <ScanSearch aria-hidden="true" className="h-4 w-4" /> Open in Reveal tool
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openIn('/detect/image', item)}>
          <Microscope aria-hidden="true" className="h-4 w-4" /> Open in Detect lab
        </Button>
      </div>
    </Card>
  );
}

function AudioArtifact({ name, audio }) {
  const openIn = useOpenIn();
  const item = { kind: 'audio', name, audio };
  return (
    <Card className="space-y-4">
      <FileHeader name={name} detail={describeAudio(audio)} />
      <Waveform audio={audio} height={80} label={`Waveform of ${name}`} />
      <AudioPlayer audio={audio} label="Listen" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => downloadBlob(audioToBlob(audio), name)}>
          <Download aria-hidden="true" className="h-4 w-4" /> Download WAV
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openIn('/lab/audio', item)}>
          <ScanSearch aria-hidden="true" className="h-4 w-4" /> Open in Reveal tool
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openIn('/detect/audio', item)}>
          <Microscope aria-hidden="true" className="h-4 w-4" /> Open in Detect lab
        </Button>
      </div>
    </Card>
  );
}

const TEXT_STYLES = {
  chat: {
    icon: MessageCircle,
    title: 'Message from Sam · 18:42',
    body: 'max-w-md rounded-2xl rounded-bl-md bg-accent/10 px-4 py-3 text-[1.05rem] leading-relaxed text-ink',
  },
  note: {
    icon: StickyNote,
    title: 'A note, passed by the censor',
    body: 'rounded-xl border border-line bg-surface-2 px-5 py-4 font-serif text-lg leading-relaxed text-ink',
  },
  email: {
    icon: Mail,
    title: 'From: orders@example.com · Subject: Delivery update',
    body: 'rounded-xl border border-line bg-surface-2 px-5 py-4 leading-relaxed text-ink',
  },
};

function TextArtifact({ name, text, style = 'note' }) {
  const openIn = useOpenIn();
  const { icon: Icon, title, body } = TEXT_STYLES[style];
  return (
    <Card className="space-y-4">
      <FileHeader name={name} />
      <p className="flex items-center gap-2 text-sm text-muted">
        <Icon aria-hidden="true" className="h-4 w-4" /> {title}
      </p>
      <p className={`whitespace-pre-wrap break-words ${body}`}>{text}</p>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={text} label="Copy text" variant="primary" />
        <Button size="sm" variant="secondary" onClick={() => openIn('/detect/text', { kind: 'text', name, text })}>
          <Microscope aria-hidden="true" className="h-4 w-4" /> Open in Detect lab
        </Button>
        <Button size="sm" variant="ghost" onClick={() => downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), name)}>
          <Download aria-hidden="true" className="h-4 w-4" /> Download .txt
        </Button>
      </div>
    </Card>
  );
}

/** A sentence printed in two typefaces: plain letters are "a", serif letters are "b". */
function BaconArtifact({ text, code }) {
  let k = 0;
  const marked = Array.from(text).map((ch) => {
    if (!/[a-z]/i.test(ch)) return { ch, serif: false };
    return { ch, serif: code[k++] === 'B' };
  });
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">The sentence</h2>
      <p className="rounded-xl border border-line bg-surface-2 px-5 py-6 text-center text-3xl leading-relaxed text-ink sm:text-4xl">
        {marked.map(({ ch, serif }, i) => (
          <span key={i} className={serif ? 'font-serif' : 'font-sans'}>
            {ch}
          </span>
        ))}
      </p>
      <details className="text-sm text-muted">
        <summary className="cursor-pointer font-medium text-ink">Text-only version</summary>
        <p className="mt-2">
          The same sentence, with plain letters in lowercase and serif letters in UPPERCASE:{' '}
          <span className="font-mono text-ink">{marked.map(({ ch, serif }) => (serif ? ch.toUpperCase() : ch.toLowerCase())).join('')}</span>
        </p>
      </details>
    </Card>
  );
}

function GalleryArtifact({ items }) {
  const openIn = useOpenIn();
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">Today’s photos</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ label, name, image }) => (
          <figure key={name} className="space-y-2 rounded-xl border border-line bg-surface-2/60 p-3">
            <ImageCanvas image={image} className="w-full rounded-lg" label={label} />
            <figcaption className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-ink">{label}</span>
              <span className="flex gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => openIn('/detect/image', { kind: 'image', name, image })}>
                  <Microscope aria-hidden="true" className="h-4 w-4" /> Analyse
                </Button>
                <Button size="sm" variant="ghost" aria-label={`Download ${label}`} onClick={async () => downloadBlob(await imageToBlob(image), name)}>
                  <Download aria-hidden="true" className="h-4 w-4" />
                </Button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Card>
  );
}

const VIEWS = { image: ImageArtifact, audio: AudioArtifact, text: TextArtifact, bacon: BaconArtifact, gallery: GalleryArtifact };

export default function ArtifactCard({ artifact }) {
  const View = VIEWS[artifact.kind];
  return <View {...artifact} />;
}
