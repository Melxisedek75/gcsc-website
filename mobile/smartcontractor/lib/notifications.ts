// Local notification feed. Aggregates events from jobs, bids, leads, disputes
// into a unified activity log. Surfaces in the Notifications screen.

import { listBids } from './bids';
import { listDisputes } from './disputes';
import { listJobs } from './jobs';
import { listLeads } from './leads';

export type NotificationKind =
  | 'job_published'
  | 'bid_submitted'
  | 'bid_won'
  | 'bid_lost'
  | 'lead_purchased'
  | 'dispute_opened';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ts: number;
}

export async function buildFeed(): Promise<NotificationItem[]> {
  const [jobs, bids, leads, disputes] = await Promise.all([
    listJobs(),
    listBids(),
    listLeads(),
    listDisputes(),
  ]);

  const items: NotificationItem[] = [];

  for (const j of jobs) {
    items.push({
      id: `job-${j.id}`,
      kind: 'job_published',
      title: 'Job published',
      body: `${j.title} · ${j.budget || 'Budget TBD'}`,
      ts: j.publishedAt,
    });
  }

  for (const b of bids) {
    if (b.status === 'won') {
      items.push({
        id: `bid-won-${b.id}`,
        kind: 'bid_won',
        title: 'Bid accepted',
        body: `${b.amount} — ${b.jobTitle}`,
        ts: b.submittedAt,
      });
    } else if (b.status === 'lost') {
      items.push({
        id: `bid-lost-${b.id}`,
        kind: 'bid_lost',
        title: 'Bid not selected',
        body: b.jobTitle,
        ts: b.submittedAt,
      });
    } else {
      items.push({
        id: `bid-${b.id}`,
        kind: 'bid_submitted',
        title: 'Bid submitted',
        body: `${b.amount} — ${b.jobTitle}`,
        ts: b.submittedAt,
      });
    }
  }

  for (const l of leads) {
    items.push({
      id: `lead-${l.id}`,
      kind: 'lead_purchased',
      title: 'Lead Token purchased',
      body: `${l.amount} · tx ${l.txHash.slice(0, 10)}…`,
      ts: l.purchasedAt,
    });
  }

  for (const d of disputes) {
    items.push({
      id: `dispute-${d.id}`,
      kind: 'dispute_opened',
      title: 'Dispute opened',
      body: `${d.refLabel} · ${d.reason}`,
      ts: d.raisedAt,
    });
  }

  return items.sort((a, b) => b.ts - a.ts);
}
