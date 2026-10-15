import { formatBytes } from '../../lib/bytes';

/** How much of the cover's hiding space the message will use. */
export default function CapacityMeter({ used, capacity }) {
  if (!capacity) return null;
  const ratio = used / capacity;
  const pct = Math.min(100, ratio * 100);
  const over = ratio > 1;
  const tone = over ? 'bg-danger' : ratio > 0.7 ? 'bg-warn' : 'bg-secret';
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink">Space used</span>
        <span className={`font-mono tabular-nums ${over ? 'text-danger' : 'text-muted'}`}>
          {formatBytes(used)} / {formatBytes(capacity)}
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-surface-3"
        role="meter"
        aria-label="Space used"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={Math.min(used, capacity)}
      >
        <div className={`h-full rounded-full transition-[width] duration-300 ${tone}`} style={{ width: `${Math.max(pct, used ? 1.5 : 0)}%` }} />
      </div>
      <p className={`mt-1.5 text-xs ${over ? 'text-danger' : 'text-muted'}`}>
        {over
          ? `Too big by ${formatBytes(used - capacity)}. Try a larger cover, more bits, or a shorter message.`
          : `${pct < 0.01 && used ? '<0.01' : pct.toFixed(pct < 1 ? 2 : 1)}% of the available hiding space (includes a 12-byte header).`}
      </p>
    </div>
  );
}
