import { useCallback, useSyncExternalStore } from 'react';

// A tiny localStorage-backed store shared by every component in the tab (and synced across tabs).
// Falls back to memory when storage is unavailable (private mode, blocked cookies, ...).

const memory = new Map();
const cache = new Map();
const listeners = new Map();

function readRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.has(key) ? memory.get(key) : null;
  }
}

function writeRaw(key, raw) {
  try {
    if (raw === null) localStorage.removeItem(key);
    else localStorage.setItem(key, raw);
  } catch {
    memory.set(key, raw);
  }
}

function snapshot(key, fallback) {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function notify(key) {
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  const onStorage = (e) => {
    if (e.key === key) fn();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.get(key)?.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

export function setStoredState(key, valueOrUpdater, fallback) {
  const prev = snapshot(key, fallback);
  const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
  writeRaw(key, next === undefined ? null : JSON.stringify(next));
  notify(key);
}

export function useStoredState(key, fallback) {
  const value = useSyncExternalStore(
    useCallback((fn) => subscribe(key, fn), [key]),
    () => snapshot(key, fallback),
    () => fallback,
  );
  const set = useCallback((v) => setStoredState(key, v, fallback), [key, fallback]);
  return [value, set];
}
