import { Info, Lightbulb, TriangleAlert, KeyRound, MousePointerClick } from 'lucide-react';

export function Card({ as: Tag = 'div', className = '', padded = true, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    />
  );
}

const calloutStyles = {
  info: { icon: Info, cls: 'border-accent/30 bg-accent/5', iconCls: 'text-accent' },
  tip: { icon: Lightbulb, cls: 'border-secret/30 bg-secret/5', iconCls: 'text-secret' },
  warn: { icon: TriangleAlert, cls: 'border-warn/40 bg-warn/5', iconCls: 'text-warn' },
  key: { icon: KeyRound, cls: 'border-line-strong bg-surface-2', iconCls: 'text-ink' },
};

export function Callout({ type = 'info', title, children, className = '' }) {
  const { icon: Icon, cls, iconCls } = calloutStyles[type];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-[0.95rem] leading-relaxed ${cls} ${className}`}>
      <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${iconCls}`} />
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold text-ink">{title}</p>}
        <div className="text-ink/90">{children}</div>
      </div>
    </div>
  );
}

const badgeTones = {
  neutral: 'bg-surface-2 text-muted border-line',
  accent: 'bg-accent/10 text-accent border-accent/25',
  secret: 'bg-secret/10 text-secret border-secret/25',
  warn: 'bg-warn/10 text-warn border-warn/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
};

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, hint, tone = 'ink' }) {
  const toneCls = { ink: 'text-ink', secret: 'text-secret', warn: 'text-warn', danger: 'text-danger', accent: 'text-accent' }[tone];
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2.5">
      <div className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</div>
      <div className={`mt-0.5 truncate font-mono text-lg font-semibold tabular-nums ${toneCls}`}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}

/** Frame for an interactive explorable embedded in a lesson. */
export function Figure({ title, caption, children, className = '' }) {
  return (
    <figure className={`not-prose my-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-surface-2/70 px-4 py-2.5">
        <MousePointerClick aria-hidden="true" className="h-4 w-4 text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Try it</span>
        {title && <span className="truncate text-sm font-medium text-ink">· {title}</span>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {caption && (
        <figcaption className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

export function PageHeader({ eyebrow, title, children, className = '' }) {
  return (
    <header className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
      <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">{title}</h1>
      {children && <div className="mt-4 text-lg leading-relaxed text-muted">{children}</div>}
    </header>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
