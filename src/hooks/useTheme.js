import { useCallback, useSyncExternalStore } from 'react';

// The theme lives on <html data-theme>. index.html sets it before first paint.

function current() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

const listeners = new Set();

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'light');

  const setTheme = useCallback((t) => {
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem('sc-theme', t);
    } catch {
      // Storage may be blocked; the choice still applies for this visit.
    }
    listeners.forEach((fn) => fn());
  }, []);

  const toggle = useCallback(() => setTheme(current() === 'dark' ? 'light' : 'dark'), [setTheme]);

  return { theme, setTheme, toggle };
}
