import { useEffect, useMemo, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { Badge, Figure } from '../components/ui/display';
import { Segmented, TextArea, TextInput } from '../components/ui/controls';
import { CopyButton } from '../components/ui/CopyButton';
import TextXRay, { XRayLegend } from '../components/lab/TextXRay';
import { buildPayload } from '../lib/payload';
import { hideZeroWidth, revealZeroWidth, scanText } from '../lib/textStego';
import { useDebounced } from '../hooks/useDebounced';

const COVER = 'See you at the café tomorrow — I will bring the books.';

function Encode() {
  const [secret, setSecret] = useState('meet at 6, not 5');
  const debounced = useDebounced(secret, 250);
  const [stego, setStego] = useState('');
  const [xray, setXray] = useState('normal');

  useEffect(() => {
    let alive = true;
    buildPayload({ text: debounced }).then((p) => alive && setStego(hideZeroWidth(COVER, p)));
    return () => {
      alive = false;
    };
  }, [debounced]);

  const visible = Array.from(COVER).length;
  const total = Array.from(stego).length;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="inv-secret" className="mb-1.5 block text-sm font-medium text-ink">
          Secret
        </label>
        <TextInput id="inv-secret" value={secret} maxLength={60} onChange={(e) => setSecret(e.target.value)} />
      </div>
      <Segmented
        label="View"
        value={xray}
        onChange={setXray}
        size="sm"
        options={[
          { value: 'normal', label: 'What people see' },
          { value: 'xray', label: 'X-ray' },
        ]}
      />
      {xray === 'xray' ? (
        <>
          <TextXRay text={stego} />
          <XRayLegend />
        </>
      ) : (
        <p className="rounded-xl border border-line bg-surface-2/50 p-4 text-lg text-ink">{stego}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={stego} label="Copy this text" />
        <span className="text-sm text-muted">
          {visible} visible characters, but <strong className="text-ink">{total}</strong> in total.
        </span>
      </div>
    </div>
  );
}

function Check() {
  const [text, setText] = useState('');
  const scan = useMemo(() => scanText(text), [text]);
  const [found, setFound] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!text) {
      setFound(null);
      return undefined;
    }
    revealZeroWidth(text)
      .then((r) => alive && setFound({ ok: true, text: r.text }))
      .catch((e) => alive && setFound({ ok: false, code: e.code }));
    return () => {
      alive = false;
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Paste text here — for example, the text you copied, after sending it to yourself in a chat app." aria-label="Text to check" />
      {text && (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge tone={scan.invisible.length ? 'secret' : 'neutral'}>{scan.invisible.length} invisible characters</Badge>
            <Badge tone={scan.homoglyphs.length ? 'warn' : 'neutral'}>{scan.homoglyphs.length} look-alike letters</Badge>
          </div>
          {found?.ok && (
            <p className="flex items-center gap-2 rounded-xl bg-secret/10 px-4 py-3 text-sm text-ink" role="status">
              <CircleCheck aria-hidden="true" className="h-4 w-4 text-secret" /> The secret survived: <strong>{found.text}</strong>
            </p>
          )}
          {found && !found.ok && (
            <p className="flex items-center gap-2 rounded-xl bg-danger/5 px-4 py-3 text-sm text-ink" role="status">
              <CircleX aria-hidden="true" className="h-4 w-4 text-danger" />
              {found.code === 'corrupted' ? 'Some invisible characters were lost or changed on the way — the secret is damaged.' : 'No hidden StegoCraft message here. If you pasted the copied text, the app removed the invisible characters.'}
            </p>
          )}
          <TextXRay text={text} />
        </>
      )}
    </div>
  );
}

export default function InvisibleInspector() {
  const [tab, setTab] = useState('encode');
  return (
    <Figure
      title="Invisible ink for the internet"
      caption="Step 1: hide a secret and copy the text. Step 2: send it to yourself through any app — email, a chat, a document — then paste what arrives into “Check pasted text”. Did your app keep the invisible characters?"
    >
      <Segmented
        label="Mode"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'encode', label: '1. Hide and copy' },
          { value: 'check', label: '2. Check pasted text' },
        ]}
      />
      <div className="mt-5">{tab === 'encode' ? <Encode /> : <Check />}</div>
    </Figure>
  );
}
