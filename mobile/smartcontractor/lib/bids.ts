// Local bids store — persists contractor's submitted bids in AsyncStorage
// until backend has /api/bids. Real submission would POST to backend + lock
// a Lead Token; for now bids are local-only records.

import AsyncStorage from '@react-native-async-storage/async-storage';

const BIDS_KEY = '@gcsc/bids/local';

export interface LocalBid {
  id: string;
  jobId: string;
  jobTitle: string;
  amount: string;
  timeline: string;
  message: string;
  submittedAt: number;
  status: 'submitted' | 'shortlisted' | 'won' | 'lost';
}

export async function listBids(): Promise<LocalBid[]> {
  const raw = await AsyncStorage.getItem(BIDS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalBid[]) : [];
  } catch {
    return [];
  }
}

export async function getBidForJob(jobId: string): Promise<LocalBid | null> {
  const all = await listBids();
  return all.find((b) => b.jobId === jobId) ?? null;
}

export async function addBid(bid: Omit<LocalBid, 'id' | 'submittedAt' | 'status'>): Promise<LocalBid> {
  const created: LocalBid = {
    ...bid,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: Date.now(),
    status: 'submitted',
  };
  const existing = await listBids();
  const next = [created, ...existing.filter((b) => b.jobId !== bid.jobId)];
  await AsyncStorage.setItem(BIDS_KEY, JSON.stringify(next));
  return created;
}

export async function clearBids(): Promise<void> {
  await AsyncStorage.removeItem(BIDS_KEY);
}
