import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import { useDebounced } from '../../hooks/useDebounced';
import { handOff } from '../../lib/handoff';
import { buildPayload } from '../../lib/payload';
import { hideZeroWidth } from '../../lib/textStego';
import { Card } from '../ui/display';
import { TextInput, Toggle } from '../ui/controls';
import { Button } from '../ui/Button';
import { CopyButton } from '../ui/CopyButton';
import TextXRay, { XRayLegend } from '../lab/TextXRay';

const COVER = 'See you at the station at six. Don’t forget your umbrella!';

/** Hide a short secret inside an ordinary sentence with invisible characters. */
export default function TrySentence() {
  const [secret, setSecret] = useState('Meet me under the big clock.');
  const [xray, setXray] = useState(false);
  const [text, setText] = useState(COVER);
  const debounced = useDebounced(secret, 250);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    if (!debounced.trim()) {
      setText(COVER);
      return undefined;
    }
    buildPayload({ text: debounced }).then((payload) => alive && setText(hideZeroWidth(COVER, payload)));
    return () => {
      alive = false;
    };
  }, [debounced]);

  const hidden = Array.from(text).length - Array.from(COVER).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-3">
        <label htmlFor="try-secret" className="block font-semibold text-ink">
          Your secret
        </label>
        <TextInput id="try-secret" value={secret} maxLength={140} onChange={(e) => setSecret(e.target.value)} placeholder="Type anything, in any language" />
        <p className="text-sm text-muted">
          It gets turned into bits, and every two bits become one of four invisible Unicode characters, tucked in after the
          spaces of the sentence.
        </p>
      </div>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-ink">Your sentence</span>
          <span className="font-mono text-xs text-muted">{hidden} characters you can’t see</span>
        </div>
        <div className="min-h-16 rounded-xl bg-surface-2 px-4 py-3 text-lg leading-relaxed text-ink" aria-live="polite">
          {xray ? <TextXRay text={text} /> : text}
        </div>
        {xray && <XRayLegend />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Toggle checked={xray} onChange={setXray} label="X-ray" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate('/detect/text', { state: { handoff: handOff({ kind: 'text', text }) } })}>
              <Microscope aria-hidden="true" className="h-4 w-4" /> What a detector sees
            </Button>
            <CopyButton text={text} label="Copy sentence" variant="primary" />
          </div>
        </div>
        <p className="text-sm text-muted">
          Paste it into a chat or an email: it looks completely normal. To read the secret back, paste it into the Reveal side of the{' '}
          <Link to="/lab/text" className="font-medium text-accent hover:underline">
            Text lab
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
