import { useMemo } from 'react';
import { CircleCheck, Download, FileText, Lock, Shuffle } from 'lucide-react';
import { formatBytes, utf8Decode } from '../../lib/bytes';
import { downloadBytes } from '../../lib/browser';
import { CopyButton } from '../ui/CopyButton';
import { Badge } from '../ui/display';
import { Button } from '../ui/Button';
import { useObjectUrl } from '../../hooks/useObjectUrl';

function FilePreview({ file }) {
  const isImage = file.type.startsWith('image/');
  const isText = file.type.startsWith('text/') || /\.(txt|md|csv|json)$/i.test(file.name);
  const blob = useMemo(() => (isImage ? new Blob([file.bytes], { type: file.type }) : null), [file, isImage]);
  const url = useObjectUrl(blob);
  if (url) return <img src={url} alt={`Preview of ${file.name}`} className="mt-3 max-h-64 rounded-lg border border-line" />;
  if (isText) {
    return (
      <pre className="mt-3 max-h-48 overflow-auto rounded-lg border border-line bg-surface p-3 font-mono text-xs whitespace-pre-wrap">
        {utf8Decode(file.bytes.subarray(0, 4000))}
      </pre>
    );
  }
  return null;
}

/** Shows a revealed text message or file, plus how it was found. */
export default function RevealResult({ result, meta }) {
  if (!result) return null;
  return (
    <div className="animate-fade-up rounded-2xl border border-secret/40 bg-secret/5 p-4 sm:p-5" role="status">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CircleCheck aria-hidden="true" className="h-5 w-5 text-secret" />
        <h3 className="font-semibold text-ink">Hidden {result.kind === 'file' ? 'file' : 'message'} found</h3>
        {meta?.encrypted && (
          <Badge tone="secret">
            <Lock aria-hidden="true" className="h-3 w-3" /> Decrypted
          </Badge>
        )}
        {meta?.scattered && (
          <Badge tone="accent">
            <Shuffle aria-hidden="true" className="h-3 w-3" /> Password-scattered
          </Badge>
        )}
        {meta?.bitsPerCell && <Badge>{meta.bitsPerCell} bit{meta.bitsPerCell > 1 ? 's' : ''} per value</Badge>}
      </div>

      {result.kind === 'text' ? (
        <>
          <div className="max-h-80 overflow-auto rounded-xl border border-line bg-surface p-4 text-[1.05rem] leading-relaxed break-words whitespace-pre-wrap text-ink">
            {result.text || <span className="text-muted italic">(empty message)</span>}
          </div>
          <div className="mt-3">
            <CopyButton text={result.text} label="Copy message" />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center gap-3">
            <FileText aria-hidden="true" className="h-8 w-8 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{result.name}</p>
              <p className="text-xs text-muted">
                {formatBytes(result.bytes.length)} · {result.type}
              </p>
            </div>
            <Button size="sm" onClick={() => downloadBytes(result.bytes, result.name, result.type)}>
              <Download aria-hidden="true" className="h-4 w-4" /> Download
            </Button>
          </div>
          <FilePreview file={result} />
        </div>
      )}
    </div>
  );
}
