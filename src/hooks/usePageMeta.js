import { useEffect } from 'react';

const SITE = 'StegoCraft';
const DEFAULT_DESCRIPTION =
  'A free, interactive course on steganography: hide messages in images, audio and text, then learn how they get caught. Everything runs in your browser.';

export function usePageMeta(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — Learn steganography by doing`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}
