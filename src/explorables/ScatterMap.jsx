import { useEffect, useRef, useState } from 'react';
import { Figure } from '../components/ui/display';
import { Slider, TextInput } from '../components/ui/controls';
import { KeyedPermutation, Sequence } from '../lib/prng';
import { seedFromPassword } from '../lib/crypto';
import { useDebounced } from '../hooks/useDebounced';
import { useTheme } from '../hooks/useTheme';

const W = 64;
const H = 36;

const hexToRgb = (hex) => {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

export default function ScatterMap() {
  const [bits, setBits] = useState(300);
  const [password, setPassword] = useState('');
  const pw = useDebounced(password, 200);
  const canvas = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let alive = true;
    (async () => {
      const n = W * H;
      const order = pw ? new KeyedPermutation(n, await seedFromPassword(pw)) : new Sequence(n);
      if (!alive) return;
      const el = canvas.current;
      const ctx = el.getContext('2d');
      const css = getComputedStyle(document.documentElement);
      const cell = 10;
      el.width = W * cell;
      el.height = H * cell;
      ctx.fillStyle = css.getPropertyValue('--color-surface-2');
      ctx.fillRect(0, 0, el.width, el.height);
      ctx.fillStyle = css.getPropertyValue('--color-line');
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) ctx.fillRect(x * cell + 4, y * cell + 4, 2, 2);
      const from = hexToRgb(css.getPropertyValue('--color-accent'));
      const to = hexToRgb(css.getPropertyValue('--color-secret'));
      for (let i = 0; i < bits; i++) {
        const p = order.next();
        const t = i / Math.max(1, bits - 1);
        ctx.fillStyle = `rgb(${from.map((c, k) => Math.round(c + (to[k] - c) * t)).join(',')})`;
        ctx.fillRect((p % W) * cell + 1, Math.floor(p / W) * cell + 1, cell - 2, cell - 2);
      }
    })();
    return () => {
      alive = false;
    };
  }, [bits, pw, theme]);

  return (
    <Figure
      title="Where do the bits go?"
      caption={`Each square is a colour value in a tiny ${W}×${H} picture; coloured squares carry message bits (early bits darker, later bits greener). Without a password they fill up in order. Type any password to scatter them — every password gives a different pattern, and only someone with the same password can follow it.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Message bits" min={16} max={W * H} step={16} value={bits} onChange={setBits} format={(v) => `${v} (${Math.round((v / (W * H)) * 100)}%)`} />
        <div>
          <label htmlFor="scatter-pw" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <TextInput id="scatter-pw" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type to scatter…" autoComplete="off" spellCheck={false} />
        </div>
      </div>
      <canvas ref={canvas} className="pixelated mt-4 w-full rounded-lg border border-line" role="img" aria-label="Map of message bit positions" />
    </Figure>
  );
}
