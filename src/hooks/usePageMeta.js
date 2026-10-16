import { useEffect } from 'react';
import { SITE_URL } from '../config/site';

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

    // Each page is its own canonical URL (the static HTML is shared by every route).
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = SITE_URL + window.location.pathname;
  }, [title, description]);
}
