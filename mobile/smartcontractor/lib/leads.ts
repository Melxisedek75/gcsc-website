// Local lead-token store — persists contractor's purchased leads in AsyncStorage
// until backend has /api/leads.

import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADS_KEY = '@gcsc/leads/local';

export interface LocalLead {
  id: string;
  amount: string;
  txHash: string;
  purchasedAt: number;
}

export async function listLeads(): Promise<LocalLead[]> {
  const raw = await AsyncStorage.getItem(LEADS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalLead[]) : [];
  } catch {
    return [];
  }
}

export async function addLead(lead: Omit<LocalLead, 'id' | 'purchasedAt'>): Promise<LocalLead> {
  const created: LocalLead = {
    ...lead,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    purchasedAt: Date.now(),
  };
  const existing = await listLeads();
  const next = [created, ...existing];
  await AsyncStorage.setItem(LEADS_KEY, JSON.stringify(next));
  return created;
}

export async function clearLeads(): Promise<void> {
  await AsyncStorage.removeItem(LEADS_KEY);
}
