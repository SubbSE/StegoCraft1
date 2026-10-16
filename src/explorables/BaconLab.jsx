import { useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented, TextInput } from '../components/ui/controls';
import { baconDecode, baconEncode } from '../lib/textStego';

const COVER = 'Meet me by the river after the market closes, and bring the old map with you tonight.';

export default function BaconLab() {
  const [secret, setSecret] = useState('FLEE');
  const [view, setView] = useState('printed');
  const code = baconEncode(secret);
  const letters = Array.from(COVER).filter((ch) => /[a-z]/i.test(ch)).length;
  const short = code.length > letters;

  let k = 0;
  const rendered = Array.from(COVER).map((ch, i) => {
    if (!/[a-z]/i.test(ch) || k >= code.length) return <span key={i}>{ch}</span>;
    const sym = code[k++];
    if (view === 'printed') {
      return (
        <span key={i} className={sym === 'B' ? 'font-serif' : 'font-sans'}>
          {ch}
        </span>
      );
    }
    return (
      <span key={i} className={`relative inline-block rounded px-px ${sym === 'B' ? 'bg-warn/25 font-serif' : 'bg-accent/15'}`}>
        {ch}
        <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] text-muted">{sym}</span>
      </span>
    );
  });

  const groups = code.match(/.{1,5}/g) || [];

  return (
    <Figure
      title="Bacon’s two typefaces"
      caption="Each secret letter becomes five symbols, A or B. Every letter of the cover sentence then gets printed in one of two typefaces: plain for A, serif for B. The words say nothing; the letter shapes say everything."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40">
          <label htmlFor="bacon-secret" className="mb-1.5 block text-sm font-medium text-ink">
            Secret word
          </label>
          <TextInput id="bacon-secret" value={secret} maxLength={8} onChange={(e) => setSecret(e.target.value.replace(/[^a-z]/gi, '').toUpperCase())} />
        </div>
        <Segmented
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: 'printed', label: 'As printed' },
            { value: 'code', label: 'Show the code' },
          ]}
        />
      </div>

      <p className={`mt-5 rounded-xl bg-surface-2/60 p-4 text-xl ${view === 'code' ? 'leading-[2.6]' : 'leading-relaxed'} text-ink`}>{rendered}</p>

      {short ? (
        <p className="mt-3 text-sm text-danger">The cover sentence has only {letters} letters — too short for {code.length} symbols. Use a shorter secret.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-sm">
          {groups.map((g, i) => (
            <span key={i} className="rounded-lg border border-line bg-surface px-2 py-1">
              {g} → <strong className="text-secret">{baconDecode(g)}</strong>
            </span>
          ))}
        </div>
      )}
    </Figure>
  );
}
