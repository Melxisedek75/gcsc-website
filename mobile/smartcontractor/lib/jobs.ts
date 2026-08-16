// Local jobs store — persists user's posted jobs in AsyncStorage until backend
// has a real /api/jobs feed. Each job carries the txHash of the publish payment.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

const JOBS_KEY = '@gcsc/jobs/local';

// P0-2: the backend job-posting payment requires an existing project_id owned
// by the caller. Create the backend project before charging so the retry can
// send { project_id } in its body.
export interface CreateProjectInput {
  title: string;
  description: string;
  category?: string;
  location?: string;
}

export async function createBackendProject(input: CreateProjectInput): Promise<number> {
  const res = await apiRequest<{ project?: { id: number } }>('/api/projects', {
    method: 'POST',
    body: {
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
    },
  });
  const id = res.project?.id;
  if (typeof id !== 'number') {
    throw new Error('Backend did not return a project id');
  }
  return id;
}

// ---- Backend project feed (the contractor's job board) ----

export interface BackendProject {
  id: number;
  homeowner_id: number;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  location: string;
  timeline_days: number;
  status: string;
  escrow_id: number | null;
  created_at: string;
  updated_at: string;
}

export async function listBackendProjects(status?: string): Promise<BackendProject[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await apiRequest<{ projects?: BackendProject[] }>(`/api/projects${query}`);
  return res.projects ?? [];
}

export async function getBackendProject(
  id: number | string,
): Promise<{ project: BackendProject; bids: unknown[] } | null> {
  try {
    return await apiRequest<{ project: BackendProject; bids: unknown[] }>(`/api/projects/${id}`);
  } catch (err) {
    if ((err as { status?: number }).status === 404) return null;
    throw err;
  }
}

export async function listMyBackendProjects(): Promise<BackendProject[]> {
  const res = await apiRequest<{ projects?: BackendProject[] }>('/api/projects/my/projects');
  return res.projects ?? [];
}

export function formatBudget(project: Pick<BackendProject, 'budget_min' | 'budget_max'>): string {
  const { budget_min: min, budget_max: max } = project;
  if (!min && !max) return 'Budget not set';
  if (min && max && min !== max) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  return `$${(max || min).toLocaleString()}`;
}

export function timeAgoIso(iso: string): string {
  const sec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
}

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
