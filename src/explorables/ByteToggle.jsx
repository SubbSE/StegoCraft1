import { useState } from 'react';
import { Figure } from '../components/ui/display';
import { toBinary, toHex } from '../lib/bytes';

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];

export default function ByteToggle() {
  const [value, setValue] = useState(72);
  const flip = (place) => setValue((v) => v ^ place);
  const printable = value >= 32 && value < 127;

  return (
    <Figure title="Build a byte" caption="Each switch is one bit. Its place value doubles from right to left, so 8 bits can count from 0 to 255 — 256 different values. Try making 65, the code for the letter A.">
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {PLACES.map((place, i) => {
          const on = (value & place) !== 0;
          return (
            <div key={place} className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                aria-pressed={on}
                aria-label={`Bit worth ${place}`}
                onClick={() => flip(place)}
                className={`flex h-14 w-9 items-center justify-center rounded-xl border-2 font-mono text-xl font-bold transition-colors sm:h-16 sm:w-12 ${
                  on ? 'border-secret bg-secret/15 text-secret' : 'border-line-strong bg-surface-2 text-subtle hover:border-accent'
                }`}
              >
                {on ? 1 : 0}
              </button>
              <span className={`font-mono text-[0.7rem] ${i === 7 ? 'text-accent font-semibold' : 'text-muted'}`}>{place}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {[
          ['Binary', toBinary(value)],
          ['Decimal', value],
          ['Hex', `0x${toHex(value)}`],
          ['As text', printable ? `“${String.fromCharCode(value)}”` : '—'],
        ].map(([label, v]) => (
          <div key={label} className="rounded-xl bg-surface-2 px-3 py-2">
            <div className="text-xs text-muted">{label}</div>
            <div className="font-mono text-lg font-semibold text-ink">{v}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        The rightmost bit (worth just <strong className="text-accent">1</strong>) is the <em>least significant bit</em>. Remember it — it is the star of this course.
      </p>
    </Figure>
  );
}
