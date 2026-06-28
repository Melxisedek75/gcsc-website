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

export async function listBidsForJob(jobId: string): Promise<LocalBid[]> {
  const all = await listBids();
  return all.filter((b) => b.jobId === jobId);
}

export async function acceptBid(bidId: string): Promise<LocalBid | null> {
  const all = await listBids();
  const target = all.find((b) => b.id === bidId);
  if (!target) return null;
  const next = all.map((b) => {
    if (b.jobId !== target.jobId) return b;
    if (b.id === target.id) return { ...b, status: 'won' as const };
    return { ...b, status: 'lost' as const };
  });
  await AsyncStorage.setItem(BIDS_KEY, JSON.stringify(next));
  return next.find((b) => b.id === bidId) ?? null;
}

export async function clearBids(): Promise<void> {
  await AsyncStorage.removeItem(BIDS_KEY);
}
