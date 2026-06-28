// Local disputes store. Until backend has /api/disputes, raised disputes
// live in AsyncStorage and surface in a Disputes screen.

import AsyncStorage from '@react-native-async-storage/async-storage';

const DISPUTES_KEY = '@gcsc/disputes/local';

export type DisputeReason =
  | 'quality'
  | 'incomplete'
  | 'not_started'
  | 'overcharge'
  | 'communication'
  | 'other';

export interface LocalDispute {
  id: string;
  scope: 'job' | 'milestone' | 'bid';
  refId: string;
  refLabel: string;
  reason: DisputeReason;
  description: string;
  raisedBy: 'homeowner' | 'contractor';
  raisedAt: number;
  status: 'open' | 'mediating' | 'resolved' | 'closed';
}

export async function listDisputes(): Promise<LocalDispute[]> {
  const raw = await AsyncStorage.getItem(DISPUTES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalDispute[]) : [];
  } catch {
    return [];
  }
}

export async function raiseDispute(
  input: Omit<LocalDispute, 'id' | 'raisedAt' | 'status'>,
): Promise<LocalDispute> {
  const created: LocalDispute = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    raisedAt: Date.now(),
    status: 'open',
  };
  const existing = await listDisputes();
  const next = [created, ...existing];
  await AsyncStorage.setItem(DISPUTES_KEY, JSON.stringify(next));
  return created;
}

export async function clearDisputes(): Promise<void> {
  await AsyncStorage.removeItem(DISPUTES_KEY);
}
