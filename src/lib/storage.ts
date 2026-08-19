/**
 * Local persistence.
 *
 * Everything this prototype remembers lives in `localStorage` on this device.
 * There is no backend, no analytics endpoint and no network call anywhere in
 * the codebase - the privacy dashboard makes that claim to participants, so it
 * has to stay true.
 *
 * Keys are namespaced and version-suffixed so a schema change cannot resurrect
 * incompatible data from an earlier test session.
 */

const PREFIX = 'contextlens.v1';

export const STORAGE_KEYS = {
  settings: `${PREFIX}.settings`,
  history: `${PREFIX}.history`,
  reactions: `${PREFIX}.reactions`,
  research: `${PREFIX}.research`,
  feedback: `${PREFIX}.feedback`,
  onboardingDone: `${PREFIX}.onboardingDone`,
  /** Which research scenario is in progress, so it survives navigation. */
  activeScenario: `${PREFIX}.activeScenario`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** All keys, for the "delete everything" button and the export. */
export const ALL_STORAGE_KEYS: StorageKey[] = Object.values(STORAGE_KEYS);

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    // Some privacy modes throw on property access alone.
    return false;
  }
}

/**
 * Reads and parses a value, falling back to `fallback` on anything unexpected.
 *
 * Corrupt or hand-edited data must never break a live test session, so a parse
 * failure is treated as "no data" rather than thrown.
 */
export function readJson<T>(key: StorageKey, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: StorageKey, value: unknown): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failure. The app keeps working in memory only.
  }
}

export function removeKey(key: StorageKey): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Wipes every key this app owns. Leaves unrelated keys untouched. */
export function clearAll(): void {
  ALL_STORAGE_KEYS.forEach(removeKey);
}

/** Raw snapshot of everything stored, for the privacy dashboard export. */
export function snapshotAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  ALL_STORAGE_KEYS.forEach((key) => {
    const value = readJson<unknown>(key, null);
    if (value !== null) out[key.replace(`${PREFIX}.`, '')] = value;
  });
  return out;
}

/**
 * Triggers a client-side file download.
 *
 * Uses an object URL so the data never leaves the browser.
 */
export function downloadFile(
  filename: string,
  contents: string,
  mimeType: string,
): void {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** `YYYY-MM-DD-HHmm`, for export filenames. */
export function timestampSlug(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')
    .concat('-')
    .concat(`${pad(date.getHours())}${pad(date.getMinutes())}`);
}
