// Escrow + milestone API. An escrow is created by the backend when a homeowner
// accepts a bid; milestones are then added by the homeowner and walked through
// submit (contractor) → approve → release (homeowner), with dispute available
// to both sides. Statuses mirror the backend state machine.

import { apiRequest } from './api';

export type MilestoneStatus = 'pending' | 'submitted' | 'approved' | 'released' | 'disputed';

export interface BackendEscrow {
  id: number;
  project_id: number;
  homeowner_id: number;
  contractor_id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface BackendMilestone {
  id: number;
  escrow_id: number;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  verified_by: string | null;
}

export async function listMyEscrows(): Promise<BackendEscrow[]> {
  const res = await apiRequest<{ escrows?: BackendEscrow[] }>('/api/escrow/my/escrows');
  return res.escrows ?? [];
}

export async function getEscrowDetail(
  escrowId: number,
): Promise<{ escrow: BackendEscrow; milestones: BackendMilestone[] }> {
  return apiRequest<{ escrow: BackendEscrow; milestones: BackendMilestone[] }>(
    `/api/escrow/${escrowId}`,
  );
}

export interface AddMilestoneInput {
  title: string;
  description?: string;
  amount: number;
}

export async function addMilestone(
  escrowId: number,
  input: AddMilestoneInput,
): Promise<BackendMilestone> {
  const res = await apiRequest<{ milestone: BackendMilestone }>(
    `/api/escrow/${escrowId}/milestones`,
    { method: 'POST', body: input },
  );
  return res.milestone;
}

async function milestoneAction(
  milestoneId: number,
  action: 'submit' | 'approve' | 'release' | 'dispute',
): Promise<BackendMilestone> {
  const res = await apiRequest<{ milestone: BackendMilestone }>(
    `/api/milestones/${milestoneId}/${action}`,
    { method: 'POST' },
  );
  return res.milestone;
}

export const submitMilestone = (id: number) => milestoneAction(id, 'submit');
export const approveMilestone = (id: number) => milestoneAction(id, 'approve');
export const releaseMilestone = (id: number) => milestoneAction(id, 'release');
export const disputeMilestone = (id: number) => milestoneAction(id, 'dispute');
