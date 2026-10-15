import { useId } from 'react';
import { FileText, Paperclip, Trash2, Type } from 'lucide-react';
import { formatBytes, utf8Encode } from '../../lib/bytes';
import { Segmented, TextArea } from '../ui/controls';
import { Dropzone } from '../ui/Dropzone';
import { Button } from '../ui/Button';

/** Secret message input: a text message (any language) or a small file. */
export default function MessageInput({ kind, onKindChange, text, onTextChange, file, onFileChange, allowFile = true }) {
  const id = useId();
  const bytes = utf8Encode(text).length;
  const chars = Array.from(text).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={kind === 'text' ? id : undefined} className="text-sm font-medium text-ink">
          Secret message
        </label>
        {allowFile && (
          <Segmented
            size="sm"
            label="What to hide"
            value={kind}
            onChange={onKindChange}
            options={[
              { value: 'text', label: 'Text', icon: Type },
              { value: 'file', label: 'File', icon: Paperclip },
            ]}
          />
        )}
      </div>

      {kind === 'text' ? (
        <>
          <TextArea
            id={id}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Type anything, in any language — नमस्ते, নমস্কার, 你好, hola… 🔐"
            rows={4}
          />
          <p className="text-xs text-muted">
            {chars} character{chars === 1 ? '' : 's'} · {bytes} byte{bytes === 1 ? '' : 's'} in UTF-8
            {bytes > chars && ' (some characters need more than one byte)'}
          </p>
        </>
      ) : file ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-3">
          <FileText aria-hidden="true" className="h-8 w-8 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onFileChange(null)}>
            <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove
          </Button>
        </div>
      ) : (
        <Dropzone onFile={onFileChange} title="Choose a file to hide" hint="Any type — a PDF, a photo, a zip… as long as it fits." />
      )}
    </div>
  );
}
