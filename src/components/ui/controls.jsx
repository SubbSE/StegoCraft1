import { useId, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/** Accessible segmented control (radio group with arrow-key support). */
export function Segmented({ options, value, onChange, label, size = 'md', className = '' }) {
  const refs = useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));

  const onKeyDown = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    let next = idx;
    for (let i = 0; i < options.length; i++) {
      next = (next + dir + options.length) % options.length;
      if (!options[next].disabled) break;
    }
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1 ${className}`}
    >
      {options.map((o, i) => {
        const active = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={String(o.value)}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 ${pad} ${
              active ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-muted hover:text-ink'
            }`}
          >
            {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => v, hint, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm tabular-nums text-accent">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Field({ label, hint, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {hint && <div className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</div>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25';

export function TextArea({ className = '', mono = false, ...props }) {
  return <textarea className={`${inputCls} min-h-28 resize-y leading-relaxed ${mono ? 'font-mono text-sm' : ''} ${className}`} {...props} />;
}

export function TextInput({ className = '', ...props }) {
  return <input className={`${inputCls} ${className}`} {...props} />;
}

export function PasswordField({ id, value, onChange, placeholder = 'Optional password', autoComplete = 'new-password' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck={false}
        className={`${inputCls} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-surface-3'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <label htmlFor={id} className="text-sm">
        <span className="font-medium text-ink">{label}</span>
        {description && <span className="block text-muted">{description}</span>}
      </label>
    </div>
  );
}
