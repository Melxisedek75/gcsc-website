// Safe key/value storage wrapper around AsyncStorage.
//
// Two failure modes are handled so the app never hangs or crashes on storage:
//  1. The AsyncStorage native module is unavailable and THROWS
//     ("Native module is null…") — e.g. Expo Go / some New Architecture runtimes.
//  2. The native call never settles (HANGS) — observed on standalone New Arch
//     builds, which would freeze app bootstrap on a black screen forever.
//
// Every operation races the native call against a short timeout and falls back
// to an in-memory store. In a healthy build the native call wins instantly and
// the fallback is never used; persistence is session-only when it falls back.

import AsyncStorage from '@react-native-async-storage/async-storage';

const memory = new Map<string, string>();
const OP_TIMEOUT_MS = 2500;
let nativeAvailable: boolean | null = null;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('storage_timeout')), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function tryNative<T>(op: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false }> {
  if (nativeAvailable === false) return { ok: false };
  try {
    const value = await withTimeout(op(), OP_TIMEOUT_MS);
    nativeAvailable = true;
    return { ok: true, value };
  } catch {
    if (nativeAvailable === null && typeof console !== 'undefined') {
      console.warn('[storage] AsyncStorage unavailable/slow — using in-memory fallback (session-only).');
    }
    nativeAvailable = false;
    return { ok: false };
  }
}

export async function getItem(key: string): Promise<string | null> {
  const res = await tryNative(() => AsyncStorage.getItem(key));
  if (res.ok) return res.value;
  return memory.has(key) ? memory.get(key)! : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  memory.set(key, value);
  await tryNative(() => AsyncStorage.setItem(key, value));
}

export async function removeItem(key: string): Promise<void> {
  memory.delete(key);
  await tryNative(() => AsyncStorage.removeItem(key));
}

export const safeStorage = { getItem, setItem, removeItem };
