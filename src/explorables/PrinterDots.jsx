import { useState } from 'react';
import { Figure } from '../components/ui/display';
import { TextInput, Toggle } from '../components/ui/controls';

// A simplified tracking-dot grid: one column per value, 7 data bits per column,
// plus a top row of odd-parity bits so a reader can check each column.
const COLUMNS = ['Minute', 'Hour', 'Day', 'Month', 'Year', 'Serial', 'Serial', 'Serial'];

function encode(date, serial) {
  const digits = serial.replace(/\D/g, '').padStart(6, '0').slice(-6);
  return [
    date.getMinutes(),
    date.getHours(),
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear() % 100,
    Number(digits.slice(0, 2)),
    Number(digits.slice(2, 4)),
    Number(digits.slice(4, 6)),
  ];
}

const pad = (n) => String(n).padStart(2, '0');

export default function PrinterDots() {
  const [when, setWhen] = useState('2026-10-15T14:32');
  const [serial, setSerial] = useState('218 407');
  const [blue, setBlue] = useState(false);
  const date = new Date(when);
  const values = Number.isNaN(date.getTime()) ? Array(8).fill(0) : encode(date, serial);

  const grid = values.map((v) => {
    const bits = Array.from({ length: 7 }, (_, b) => (v >> (6 - b)) & 1);
    const parity = bits.reduce((a, b) => a + b, 0) % 2 === 0 ? 1 : 0;
    return [parity, ...bits];
  });

  return (
    <Figure
      title="The dots your printer adds"
      caption="A simplified model of the yellow tracking dots many colour laser printers add to every page — far too small and faint to notice under normal light. This version stores the date, time and serial number in a grid of 8 × 8 dots; real patterns differ by manufacturer."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dots-when" className="mb-1.5 block text-sm font-medium text-ink">
            Printed at
          </label>
          <TextInput id="dots-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div>
          <label htmlFor="dots-serial" className="mb-1.5 block text-sm font-medium text-ink">
            Printer serial number
          </label>
          <TextInput id="dots-serial" value={serial} maxLength={7} onChange={(e) => setSerial(e.target.value)} />
        </div>
      </div>

      <div className={`relative mt-5 overflow-hidden rounded-xl border border-line p-6 transition-colors ${blue ? 'bg-[#1b2a6b]' : 'bg-white'}`}>
        <div className={`space-y-2 ${blue ? 'opacity-15' : ''}`} aria-hidden="true">
          {[92, 100, 85, 97, 60].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-neutral-300" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid gap-[6px]" style={{ gridTemplateColumns: 'repeat(8, auto)' }} role="img" aria-label="Tracking dot pattern">
            {Array.from({ length: 8 }, (_, row) =>
              grid.map((col, c) => (
                <span
                  key={`${row}-${c}`}
                  className={`rounded-full transition-all ${col[row] ? (blue ? 'h-2.5 w-2.5 bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.9)]' : 'h-1 w-1 bg-yellow-300/50') : blue ? 'h-2.5 w-2.5 bg-white/5' : 'h-1 w-1 bg-transparent'}`}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Toggle checked={blue} onChange={setBlue} label="Shine a blue light on it" description="Yellow dots are nearly invisible on white paper, but stand out under blue light or a magnifier." />
      </div>

      {blue && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-center text-xs">
            <thead>
              <tr className="text-muted">
                {COLUMNS.map((c, i) => (
                  <th key={i} className="px-1 py-1 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="font-mono text-sm text-ink">
                {values.map((v, i) => (
                  <td key={i} className="px-1 py-1">
                    {pad(v)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm text-ink">
            Decoded: printed on 20{pad(values[4])}-{pad(values[3])}-{pad(values[2])} at {pad(values[1])}:{pad(values[0])} by printer{' '}
            {pad(values[5])}
            {pad(values[6])}
            {pad(values[7])}.
          </p>
        </div>
      )}
    </Figure>
  );
}
