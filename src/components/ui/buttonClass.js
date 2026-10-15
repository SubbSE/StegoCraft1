const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none';

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong shadow-sm',
  secondary: 'bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2',
  ghost: 'text-muted hover:text-ink hover:bg-surface-2',
  secret: 'bg-secret text-white dark:text-bg hover:opacity-90 shadow-sm',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-9 w-9',
};

export function buttonClass({ variant = 'primary', size = 'md', className = '' } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}
