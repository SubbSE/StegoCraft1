import { useState } from 'react';
import { Figure } from '../components/ui/display';
import { Segmented } from '../components/ui/controls';
import { nthLetters } from '../lib/textStego';

const MESSAGE =
  'Apparently neutral’s protest is thoroughly discounted and ignored. Isman hard hit. Blockade issue affects pretext for embargo on by-products, ejecting suets and vegetable oils.';

export default function NullCipherDecoder() {
  const [n, setN] = useState(1);
  const extracted = nthLetters(MESSAGE, n);
  const solved = n === 2;

  return (
    <Figure
      title="Crack a wartime null cipher"
      caption="Textbooks often say a German spy sent this during the Second World War — but General Pershing sailed from New York for France in 1917, so the First World War fits better. Try taking a different letter from each word."
    >
      <blockquote className="rounded-xl border-l-4 border-accent bg-surface-2/60 p-4 font-serif text-[1.05rem] leading-relaxed text-ink">
        {MESSAGE.split(' ').map((word, wi) => {
          let count = 0;
          return (
            <span key={wi}>
              {wi > 0 && ' '}
              {Array.from(word).map((ch, ci) => {
                const isLetter = /[\p{L}\p{N}]/u.test(ch);
                if (isLetter) count++;
                const hit = isLetter && count === n;
                return (
                  <span key={ci} className={hit ? `rounded px-px font-bold ${solved ? 'bg-secret/25 text-secret' : 'bg-accent/20 text-accent'}` : ''}>
                    {ch}
                  </span>
                );
              })}
            </span>
          );
        })}
      </blockquote>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-ink">Take letter number</span>
        <Segmented
          label="Letter position"
          value={n}
          onChange={setN}
          size="sm"
          options={[1, 2, 3, 4].map((v) => ({ value: v, label: String(v) }))}
        />
      </div>
      <p className={`mt-4 rounded-xl px-4 py-3 font-mono text-sm break-all ${solved ? 'bg-secret/10 text-secret' : 'bg-surface-2 text-muted'}`}>
        {extracted.toUpperCase()}
      </p>
      {solved && (
        <p className="mt-2 text-sm text-ink" role="status">
          <strong>PERSHING SAILS FROM NY JUNE I</strong> — “Pershing sails from New York June 1”, with I standing for 1.
        </p>
      )}
    </Figure>
  );
}
