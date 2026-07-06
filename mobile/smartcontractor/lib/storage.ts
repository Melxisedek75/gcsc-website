// Safe key/value storage wrapper around AsyncStorage.
//
// In Expo Go (and some New Architecture runtimes) the AsyncStorage native
// module can be unavailable and throws "Native module is null, cannot access
// legacy storage" on the first call. That would otherwise crash session
// bootstrap, login persistence, and the payment flow.
//
// This wrapper probes AsyncStorage once and transparently falls back to an
// in-memory store when the native module is missing, so the app degrades
// gracefully: state persists for the running session instead of crashing.
// In a real dev/production build the native module works and the fallback is
// never used.

import AsyncStorage from '@react-native-async-storage/async-storage';

const memory = new Map<string, string>();
let nativeAvailable: boolean | null = null;

async function probeNative(): Promise<boolean> {
  if (nativeAvailable !== null) return nativeAvailable;
  try {
    await AsyncStorage.getItem('@gcsc/storage/__probe__');
    nativeAvailable = true;
  } catch {
    nativeAvailable = false;
    if (typeof console !== 'undefined') {
      console.warn('[storage] AsyncStorage native module unavailable — using in-memory fallback (session-only).');
    }
  }
  return nativeAvailable;
}

export async function getItem(key: string): Promise<string | null> {
  if (await probeNative()) {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      nativeAvailable = false;
    }
  }
  return memory.has(key) ? memory.get(key)! : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (await probeNative()) {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch {
      nativeAvailable = false;
    }
  }
  memory.set(key, value);
}

export async function removeItem(key: string): Promise<void> {
  if (await probeNative()) {
    try {
      await AsyncStorage.removeItem(key);
      return;
    } catch {
      nativeAvailable = false;
    }
  }
  memory.delete(key);
}

export const safeStorage = { getItem, setItem, removeItem };
