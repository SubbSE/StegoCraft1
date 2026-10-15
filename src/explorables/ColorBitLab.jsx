import { useState } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';
import { Figure } from '../components/ui/display';
import { Button } from '../components/ui/Button';

const CHANNELS = [
  { key: 0, name: 'Red', tone: 'text-[#e5484d]' },
  { key: 1, name: 'Green', tone: 'text-[#30a46c]' },
  { key: 2, name: 'Blue', tone: 'text-[#3e63dd]' },
];

const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

export default function ColorBitLab() {
  const [base, setBase] = useState([76, 140, 214]);
  const [flips, setFlips] = useState([0, 0, 0]);
  const changed = base.map((v, i) => v ^ flips[i]);

  const flipBit = (ch, bit) => setFlips((f) => f.map((m, i) => (i === ch ? m ^ (1 << bit) : m)));
  const setAll = (mask) => setFlips([mask, mask, mask]);

  return (
    <Figure title="Flip the bits of a colour" caption="Each colour is three bytes. Flip a most significant bit and the colour jumps; flip a least significant bit and your eyes can’t tell — that invisible bit is where data can hide.">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['Original', base],
          ['Changed', changed],
        ].map(([label, c]) => (
          <div key={label} className="overflow-hidden rounded-xl border border-line">
            <div className="h-24 sm:h-28" style={{ background: rgb(c) }} />
            <div className="flex justify-between bg-surface-2 px-3 py-2 text-sm">
              <span className="font-medium text-ink">{label}</span>
              <span className="font-mono text-muted">{c.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {CHANNELS.map(({ key, name, tone }) => (
          <div key={key} className="flex flex-wrap items-center gap-3">
            <span className={`w-12 text-sm font-semibold ${tone}`}>{name}</span>
            <div className="flex gap-1">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bit) => {
                const on = (changed[key] >> bit) & 1;
                const flipped = (flips[key] >> bit) & 1;
                return (
                  <button
                    key={bit}
                    type="button"
                    onClick={() => flipBit(key, bit)}
                    aria-label={`${name} bit worth ${1 << bit}${flipped ? ', flipped' : ''}`}
                    aria-pressed={Boolean(flipped)}
                    className={`h-9 w-7 rounded-md border font-mono text-sm font-semibold transition-colors sm:w-8 ${
                      flipped ? 'border-warn bg-warn/20 text-warn' : on ? 'border-line-strong bg-surface-3 text-ink' : 'border-line bg-surface-2 text-subtle'
                    } ${bit === 0 ? 'ring-1 ring-accent/50 ring-offset-1 ring-offset-surface' : ''}`}
                  >
                    {on}
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-sm text-muted">
              {base[key]} → <span className="text-ink">{changed[key]}</span>
              {changed[key] !== base[key] && <span className={Math.abs(changed[key] - base[key]) > 8 ? 'text-danger' : 'text-secret'}> ({changed[key] > base[key] ? '+' : ''}{changed[key] - base[key]})</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setAll(1)}>
          Flip all three LSBs
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setAll(128)}>
          Flip all three MSBs
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setFlips([0, 0, 0])}>
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setBase([0, 0, 0].map(() => Math.floor(Math.random() * 256)));
            setFlips([0, 0, 0]);
          }}
        >
          <Shuffle aria-hidden="true" className="h-3.5 w-3.5" /> Random colour
        </Button>
      </div>
    </Figure>
  );
}
