// Local jobs store — persists user's posted jobs in AsyncStorage until backend
// has a real /api/jobs feed. Each job carries the txHash of the publish payment.

import AsyncStorage from '@react-native-async-storage/async-storage';

const JOBS_KEY = '@gcsc/jobs/local';

export interface LocalJob {
  id: string;
  title: string;
  category: string;
  zip: string;
  budget: string;
  description: string;
  publishTxHash: string;
  publishedAt: number;
  status: 'published' | 'bidding' | 'in_progress' | 'completed';
}

export async function getJob(id: string): Promise<LocalJob | null> {
  const all = await listJobs();
  return all.find((j) => j.id === id) ?? null;
}

export async function listJobs(): Promise<LocalJob[]> {
  const raw = await AsyncStorage.getItem(JOBS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalJob[]) : [];
  } catch {
    return [];
  }
}

export async function addJob(job: Omit<LocalJob, 'id' | 'publishedAt' | 'status'>): Promise<LocalJob> {
  const created: LocalJob = {
    ...job,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    publishedAt: Date.now(),
    status: 'published',
  };
  const existing = await listJobs();
  const next = [created, ...existing];
  await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(next));
  return created;
}

export async function clearJobs(): Promise<void> {
  await AsyncStorage.removeItem(JOBS_KEY);
}
