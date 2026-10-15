import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

function matchesAccept(file, accept) {
  if (!accept) return true;
  return accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.endsWith('/*')) return file.type.toLowerCase().startsWith(r.slice(0, -1));
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    return file.type.toLowerCase() === r;
  });
}

/**
 * File picker that supports click, keyboard, drag-and-drop and (optionally) pasting from the clipboard.
 */
export function Dropzone({ accept, onFile, title = 'Drop a file here', hint, allowPaste = false, children, className = '' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const take = (file) => {
    if (!file) return;
    if (!matchesAccept(file, accept)) {
      setError(`That file type (${file.type || 'unknown'}) isn't supported here.`);
      return;
    }
    setError('');
    onFile(file);
  };

  useEffect(() => {
    if (!allowPaste) return;
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) => i.kind === 'file');
      if (item) take(item.getAsFile());
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label={title}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          take(e.dataTransfer.files?.[0]);
        }}
        className={`group flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
          dragging ? 'border-accent bg-accent/5' : 'border-line-strong/70 bg-surface-2/40 hover:border-accent/60 hover:bg-surface-2'
        }`}
      >
        {children ?? (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface ring-1 ring-line transition-transform group-hover:-translate-y-0.5">
              <Upload aria-hidden="true" className="h-5 w-5 text-accent" />
            </span>
            <span className="font-medium text-ink">{title}</span>
            {hint && <span className="text-sm text-muted">{hint}</span>}
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
