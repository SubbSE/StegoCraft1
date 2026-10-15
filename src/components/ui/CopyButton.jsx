import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './Button';

export function CopyButton({ text, label = 'Copy', variant = 'secondary', size = 'sm', className = '' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without async clipboard permission.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
  };

  return (
    <Button variant={variant} size={size} onClick={copy} className={className} disabled={!text}>
      {copied ? <Check aria-hidden="true" className="h-4 w-4 text-secret" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </Button>
  );
}
