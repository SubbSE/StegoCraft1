import { useState } from 'react';
import { ScanSearch } from 'lucide-react';
import { openPayload } from '../../lib/payload';
import { friendlyError } from '../../lib/errors';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/display';
import { PasswordField } from '../ui/controls';
import RevealResult from '../lab/RevealResult';

/** Looks for a StegoCraft payload using `find(password)`, which returns { header, body, ... }. */
export default function StegoCraftCheck({ find }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState(null);

  const run = async () => {
    setBusy(true);
    setState(null);
    try {
      const hit = await find(password);
      const result = await openPayload(hit.header, hit.body, password);
      setState({ result, meta: { ...hit, encrypted: hit.header.encrypted } });
    } catch (e) {
      setState({ error: friendlyError(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Statistics can only say “suspicious”. If the data was hidden with StegoCraft, we can try to actually read it.
      </p>
      <div className="flex flex-wrap gap-2">
        <div className="min-w-0 flex-1">
          <PasswordField value={password} onChange={setPassword} placeholder="Password, if you know one" autoComplete="off" />
        </div>
        <Button onClick={run} disabled={busy}>
          {busy ? <Spinner /> : <ScanSearch aria-hidden="true" className="h-4 w-4" />} Try to read it
        </Button>
      </div>
      {state?.result && <RevealResult result={state.result} meta={state.meta} />}
      {state?.error && <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink">{state.error}</p>}
    </div>
  );
}
