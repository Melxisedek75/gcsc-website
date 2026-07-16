// Chat threads derived from real backend relationships (bids and projects).
// There is no chat backend yet, so the counterparty is real but message
// history is device-local (lib/chat.ts). A thread id is `p<projectId>` so both
// roles land in the same conversation for the same project.

import { listMyBackendBids } from './bids';
import { listBackendProjects, listMyBackendProjects, timeAgoIso } from './jobs';

export interface DerivedThread {
  id: string;
  projectId: number;
  counterparty: string;
  jobTitle: string;
  subtitle: string;
  lastAgo: string;
}

export function threadIdForProject(projectId: number): string {
  return `p${projectId}`;
}

export function projectIdFromThread(threadId: string): number | null {
  const match = /^p(\d+)$/.exec(threadId);
  return match ? parseInt(match[1], 10) : null;
}

// Contractor: one thread per project they have bid on — the homeowner is real.
export async function deriveContractorThreads(): Promise<DerivedThread[]> {
  const [bids, projects] = await Promise.all([listMyBackendBids(), listBackendProjects()]);
  const titles = new Map(projects.map((p) => [p.id, p.title]));
  const seen = new Set<number>();
  const threads: DerivedThread[] = [];
  for (const bid of bids) {
    if (seen.has(bid.project_id)) continue;
    seen.add(bid.project_id);
    threads.push({
      id: threadIdForProject(bid.project_id),
      projectId: bid.project_id,
      counterparty: 'Homeowner',
      jobTitle: titles.get(bid.project_id) ?? `Project #${bid.project_id}`,
      subtitle:
        bid.status === 'accepted'
          ? 'Bid accepted — project active'
          : bid.status === 'rejected'
            ? 'Bid not selected'
            : 'Bid in review',
      lastAgo: timeAgoIso(bid.updated_at || bid.created_at),
    });
  }
  return threads;
}

// Homeowner: one thread per project that has an accepted contractor.
export async function deriveHomeownerThreads(): Promise<DerivedThread[]> {
  const projects = await listMyBackendProjects();
  return projects
    .filter((p) => p.status === 'in_progress' || p.status === 'completed')
    .map((p) => ({
      id: threadIdForProject(p.id),
      projectId: p.id,
      counterparty: 'Contractor',
      jobTitle: p.title,
      subtitle: p.status === 'completed' ? 'Project completed' : 'Project in progress',
      lastAgo: timeAgoIso(p.updated_at || p.created_at),
    }));
}
