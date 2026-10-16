import { useMemo, useState } from 'react';
import { CircleCheck, EyeOff, ScanSearch } from 'lucide-react';
import { buildPayload } from '../../lib/payload';
import { hideTrailingWhitespace, hideZeroWidth, revealTrailingWhitespace, revealZeroWidth, scanText } from '../../lib/textStego';
import { friendlyError, StegoError } from '../../lib/errors';
import { utf8Encode } from '../../lib/bytes';
import { Button } from '../ui/Button';
import { Badge, Callout, Card, Spinner, Stat } from '../ui/display';
import { Field, PasswordField, Segmented, TextArea, Toggle } from '../ui/controls';
import { CopyButton } from '../ui/CopyButton';
import RevealResult from './RevealResult';
import TextXRay, { XRayLegend } from './TextXRay';
import { MODE_OPTIONS } from './shared';
import { COVER_SAMPLES } from './samples';

const METHODS = [
  { value: 'zero-width', label: 'Invisible characters' },
  { value: 'whitespace', label: 'Trailing spaces & tabs' },
];

const METHOD_INFO = {
  'zero-width':
    'Each invisible Unicode character (zero-width space, joiners, word joiner) carries 2 bits. They are tucked in right after spaces, so the visible text — in any script — does not change at all.',
  whitespace:
    'Spaces (0) and tabs (1) are added at the ends of lines, like the classic SNOW tool. Invisible in most editors, but web pages and some apps strip them.',
};

function TextHide({ onTestReveal }) {
  const [method, setMethod] = useState('zero-width');
  const [cover, setCover] = useState(COVER_SAMPLES[0].text);
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [xray, setXray] = useState(true);

  const hide = async () => {
    setBusy(true);
    setError('');
    try {
      const payload = await buildPayload({ text: secret, password });
      const text = method === 'zero-width' ? hideZeroWidth(cover, payload) : hideTrailingWhitespace(cover, payload);
      setResult({ text, method, added: Array.from(text).length - Array.from(cover).length, payloadBytes: payload.length });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card className="space-y-5 lg:self-start">
        <Field label="Method" hint={METHOD_INFO[method]}>
          <Segmented label="Method" value={method} onChange={setMethod} options={METHODS} />
        </Field>
        <Field label="Cover text — what everyone will see" htmlFor="cover-text">
          <TextArea id="cover-text" value={cover} onChange={(e) => setCover(e.target.value)} rows={5} />
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted">Samples:</span>
            {COVER_SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setCover(s.text)}
                className="rounded-lg border border-line bg-surface-2 px-2 py-0.5 text-xs text-muted hover:border-line-strong hover:text-ink"
              >
                {s.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Secret message" htmlFor="secret-text" hint={`${utf8Encode(secret).length} bytes in UTF-8`}>
          <TextArea id="secret-text" value={secret} onChange={(e) => setSecret(e.target.value)} rows={3} placeholder="Any language works — try নমস্কার or 🔐" />
        </Field>
        <Field label="Password (optional)" hint="Encrypts the message with AES-256 before hiding it.">
          <PasswordField value={password} onChange={setPassword} />
        </Field>
        <Button size="lg" className="w-full" disabled={!cover.trim() || !secret || busy} onClick={hide}>
          {busy ? <Spinner /> : <EyeOff aria-hidden="true" className="h-5 w-5" />} Hide message in text
        </Button>
        {error && <Callout type="warn">{error}</Callout>}
      </Card>

      <div className="space-y-4">
        {result ? (
          <Card className="animate-fade-up space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Your text, with a secret inside</h2>
              <CopyButton text={result.text} label="Copy text" variant="primary" size="md" />
            </div>
            <Toggle checked={xray} onChange={setXray} label="X-ray view" description="Make the hidden characters visible." />
            {xray ? (
              <>
                <TextXRay text={result.text} />
                <XRayLegend />
              </>
            ) : (
              <div className="rounded-xl border border-line bg-surface-2/50 p-4 leading-relaxed break-words whitespace-pre-wrap text-ink">{result.text}</div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Characters added" value={result.added.toLocaleString()} hint="All of them invisible" tone="secret" />
              <Stat label="Hidden" value={`${result.payloadBytes} B`} hint="Message + 12-byte header" />
            </div>
            <p className="flex items-center gap-2 text-sm text-secret">
              <CircleCheck aria-hidden="true" className="h-4 w-4" /> The visible text is exactly the same as your cover text.
            </p>
            <Callout type="info" title="Where does it survive?">
              {result.method === 'zero-width'
                ? 'Copy-paste in most chat apps, email and documents keeps invisible characters. Some websites and security filters strip or flag them — so test before you rely on it.'
                : 'Plain-text email and files keep trailing whitespace. Web pages, many chat apps and code editors that "trim" lines remove it.'}
            </Callout>
            <Button variant="secondary" className="w-full" onClick={() => onTestReveal(result.text)}>
              <ScanSearch aria-hidden="true" className="h-4 w-4" /> Test it: reveal from this text
            </Button>
          </Card>
        ) : (
          <Card className="flex min-h-80 items-center justify-center text-center">
            <p className="max-w-xs text-muted">Your text with the hidden message will appear here, with an X-ray view of what was added.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function TextReveal({ initial = '' }) {
  const [text, setText] = useState(initial);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [found, setFound] = useState(null);
  const scan = useMemo(() => scanText(text), [text]);

  const reveal = async () => {
    setBusy(true);
    setError('');
    setFound(null);
    try {
      let result;
      let method = 'zero-width';
      try {
        result = await revealZeroWidth(text, password);
      } catch (e) {
        if (!(e instanceof StegoError) || e.code !== 'no-payload') throw e;
        method = 'whitespace';
        result = await revealTrailingWhitespace(text, password);
      }
      setFound({ result, method });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card className="space-y-5 lg:self-start">
        <Field label="Paste the text to inspect" htmlFor="reveal-text">
          <TextArea id="reveal-text" value={text} onChange={(e) => setText(e.target.value)} rows={7} placeholder="Paste text that might hide something…" />
        </Field>
        {text && (
          <div className="flex flex-wrap gap-2">
            <Badge tone={scan.invisible.length ? 'secret' : 'neutral'}>{scan.invisible.length} invisible characters</Badge>
            <Badge tone={scan.homoglyphs.length ? 'warn' : 'neutral'}>{scan.homoglyphs.length} look-alike letters</Badge>
            <Badge tone={scan.trailingLines ? 'accent' : 'neutral'}>{scan.trailingLines} lines with trailing whitespace</Badge>
          </div>
        )}
        <Field label="Password" hint="Only needed if the message was hidden with one.">
          <PasswordField value={password} onChange={setPassword} placeholder="Leave empty if none" autoComplete="off" />
        </Field>
        <Button size="lg" className="w-full" disabled={!text || busy} onClick={reveal}>
          {busy ? <Spinner /> : <ScanSearch aria-hidden="true" className="h-5 w-5" />} Reveal hidden message
        </Button>
      </Card>
      <div className="space-y-4">
        {found && <RevealResult result={found.result} meta={{ encrypted: Boolean(password) }} />}
        {error && (
          <Callout type="warn" title="Nothing revealed">
            {error}
          </Callout>
        )}
        {text && (
          <Card className="space-y-3">
            <h3 className="font-semibold">X-ray view</h3>
            <TextXRay text={text} />
            <XRayLegend />
          </Card>
        )}
      </div>
    </div>
  );
}

export default function TextLab() {
  const [mode, setMode] = useState('hide');
  const [test, setTest] = useState({ key: 0, text: '' });
  return (
    <div className="space-y-6">
      <Segmented label="Mode" value={mode} onChange={setMode} options={MODE_OPTIONS} />
      <div hidden={mode !== 'hide'}>
        <TextHide
          onTestReveal={(text) => {
            setTest((t) => ({ key: t.key + 1, text }));
            setMode('reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
      <div hidden={mode !== 'reveal'}>
        <TextReveal key={test.key} initial={test.text} />
      </div>
    </div>
  );
}
