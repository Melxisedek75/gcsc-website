// Contractor's saved/bookmarked jobs. Stored as a list of mock job IDs
// for now (since contractor sees mockJobs feed until backend exists).

import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_KEY = '@gcsc/saved-jobs';

export async function listSavedJobIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SAVED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export async function isSaved(jobId: string): Promise<boolean> {
  const ids = await listSavedJobIds();
  return ids.includes(jobId);
}

export async function toggleSaved(jobId: string): Promise<boolean> {
  const ids = await listSavedJobIds();
  const has = ids.includes(jobId);
  const next = has ? ids.filter((id) => id !== jobId) : [jobId, ...ids];
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return !has;
}

export async function clearSaved(): Promise<void> {
  await AsyncStorage.removeItem(SAVED_KEY);
}
