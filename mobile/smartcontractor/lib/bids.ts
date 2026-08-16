// Bids: backend API (source of truth) + a legacy local store kept only so old
// installs don't lose their history view. New submissions go to POST /api/bids —
// a bid the homeowner can actually see and accept.

import { apiRequest } from './api';
import { safeStorage as AsyncStorage } from './storage';

// ---- Backend bids ----

export type BackendBidStatus = 'pending' | 'accepted' | 'rejected';

export interface BackendBid {
  id: number;
  project_id: number;
  contractor_id: number;
  amount: number;
  proposed_timeline_days: number;
  message: string;
  status: BackendBidStatus;
  created_at: string;
  updated_at: string;
}

export interface ContractorVerification {
  ready_for_bids?: boolean;
  [key: string]: unknown;
}

// Shape returned by GET /api/projects/:id — bids enriched with public contractor info.
export interface EnrichedBid extends BackendBid {
  contractor: { id: number; full_name?: string; email?: string } | null;
  contractor_verification: ContractorVerification | null;
}

export interface PlaceBidInput {
  project_id: number;
  amount: number;
  proposed_timeline_days: number;
  message: string;
}

export async function placeBackendBid(input: PlaceBidInput): Promise<BackendBid> {
  const res = await apiRequest<{ bid: BackendBid }>('/api/bids', {
    method: 'POST',
    body: input,
  });
  return res.bid;
}

export async function listMyBackendBids(): Promise<BackendBid[]> {
  const res = await apiRequest<{ bids?: BackendBid[] }>('/api/bids/my/bids');
  return res.bids ?? [];
}

export async function acceptBackendBid(bidId: number): Promise<{ escrow_id: number }> {
  return apiRequest<{ escrow_id: number }>(`/api/bids/${bidId}/accept`, { method: 'POST' });
}

// ---- Legacy local store (read-only history for old installs) ----

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
