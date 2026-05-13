import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT } from './localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceCloseout.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS = Object.freeze([
  'approval_decision_external_owner_response_decision_evidence_archive_id',
  'approval_decision_external_owner_response_decision_evidence_closeout_id',
  'approval_decision_external_owner_response_decision_evidence_summary_id',
  'approval_decision_external_owner_response_decision_evidence_intake_id',
  'approval_decision_external_owner_response_decision_evidence_template_id',
  'approval_decision_external_owner_response_decision_register_closeout_id',
  'approval_decision_external_owner_response_decision_register_id',
  'approval_decision_external_owner_response_handoff_closeout_id',
  'approval_decision_external_owner_response_handoff_id',
  'approval_decision_external_owner_response_action_plan_id',
  'approval_decision_external_owner_response_summary_id',
  'approval_decision_external_owner_response_intake_id',
  'approval_decision_external_owner_response_template_id',
  'approval_decision_external_owner_packet_id',
  'approval_decision_closeout_id',
  'approval_decision_audit_trail_id',
  'approval_decision_routing_id',
  'approval_decision_intake_id',
  'approval_decision_draft_id',
  'approval_handoff_summary_id',
  'approval_evidence_template_id',
  'approval_checklist_id',
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'request_id',
  'digest_id',
  'decision_evidence_archive_status',
  'source_decision_evidence_closeout_status',
  'archived_local_evidence_items',
  'remaining_external_decision_slots',
  'accepted_decision_record_states',
  'blocked_live_actions',
  'blocked_response_states',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  decision_evidence_archive_status: 'RESPONSE_DECISION_EVIDENCE_ARCHIVE_PENDING_EXTERNAL_RECORDS',
});

export const LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS = Object.freeze([
  'local_closeout_snapshot_archived',
  'external_decision_slots_preserved',
  'manual_review_boundary_preserved',
  'live_authority_not_archived_as_approved',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner response decision evidence archive: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner response decision evidence archive input must be an object');
  }

  const evidenceCloseout = input.approval_decision_external_owner_response_decision_evidence_closeout;
  if (!evidenceCloseout?.local_only) {
    throw new Error('Local replay approval decision external owner response decision evidence archive requires a local_only approval_decision_external_owner_response_decision_evidence_closeout');
  }

  if (evidenceCloseout.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner response decision evidence archive closeout must be BLOCKED_FOR_LIVE');
  }

  if (evidenceCloseout.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner response decision evidence archive closeout must be PASS_LOCAL_ONLY');
  }

  if (evidenceCloseout.decision_evidence_closeout_status !== 'RESPONSE_DECISION_EVIDENCE_CLOSEOUT_PENDING_EXTERNAL_RECORDS') {
    throw new Error('Local replay approval decision external owner response decision evidence archive requires RESPONSE_DECISION_EVIDENCE_CLOSEOUT_PENDING_EXTERNAL_RECORDS status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_response_decision_evidence_archive');

  const archive = {
    approval_decision_external_owner_response_decision_evidence_archive_id: input.approval_decision_external_owner_response_decision_evidence_archive_id,
    approval_decision_external_owner_response_decision_evidence_closeout_id: evidenceCloseout.approval_decision_external_owner_response_decision_evidence_closeout_id,
    approval_decision_external_owner_response_decision_evidence_summary_id: evidenceCloseout.approval_decision_external_owner_response_decision_evidence_summary_id,
    approval_decision_external_owner_response_decision_evidence_intake_id: evidenceCloseout.approval_decision_external_owner_response_decision_evidence_intake_id,
    approval_decision_external_owner_response_decision_evidence_template_id: evidenceCloseout.approval_decision_external_owner_response_decision_evidence_template_id,
    approval_decision_external_owner_response_decision_register_closeout_id: evidenceCloseout.approval_decision_external_owner_response_decision_register_closeout_id,
    approval_decision_external_owner_response_decision_register_id: evidenceCloseout.approval_decision_external_owner_response_decision_register_id,
    approval_decision_external_owner_response_handoff_closeout_id: evidenceCloseout.approval_decision_external_owner_response_handoff_closeout_id,
    approval_decision_external_owner_response_handoff_id: evidenceCloseout.approval_decision_external_owner_response_handoff_id,
    approval_decision_external_owner_response_action_plan_id: evidenceCloseout.approval_decision_external_owner_response_action_plan_id,
    approval_decision_external_owner_response_summary_id: evidenceCloseout.approval_decision_external_owner_response_summary_id,
    approval_decision_external_owner_response_intake_id: evidenceCloseout.approval_decision_external_owner_response_intake_id,
    approval_decision_external_owner_response_template_id: evidenceCloseout.approval_decision_external_owner_response_template_id,
    approval_decision_external_owner_packet_id: evidenceCloseout.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: evidenceCloseout.approval_decision_closeout_id,
    approval_decision_audit_trail_id: evidenceCloseout.approval_decision_audit_trail_id,
    approval_decision_routing_id: evidenceCloseout.approval_decision_routing_id,
    approval_decision_intake_id: evidenceCloseout.approval_decision_intake_id,
    approval_decision_draft_id: evidenceCloseout.approval_decision_draft_id,
    approval_handoff_summary_id: evidenceCloseout.approval_handoff_summary_id,
    approval_evidence_template_id: evidenceCloseout.approval_evidence_template_id,
    approval_checklist_id: evidenceCloseout.approval_checklist_id,
    live_gate_id: evidenceCloseout.live_gate_id,
    founder_packet_id: evidenceCloseout.founder_packet_id,
    proof_id: evidenceCloseout.proof_id,
    request_id: evidenceCloseout.request_id,
    digest_id: evidenceCloseout.digest_id,
    digest: evidenceCloseout.digest,
    source_decision_evidence_closeout_status: evidenceCloseout.decision_evidence_closeout_status,
    archived_local_evidence_items: LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_ITEMS,
    remaining_external_decision_slots: evidenceCloseout.remaining_external_decision_slots,
    accepted_decision_record_states: evidenceCloseout.accepted_decision_record_states,
    blocked_live_actions: evidenceCloseout.blocked_live_actions,
    blocked_response_states: evidenceCloseout.blocked_response_states,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE_FIELDS) {
    if (archive[field] === undefined || archive[field] === null || archive[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner response decision evidence archive field: ${field}`);
    }
  }

  return Object.freeze(archive);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ARCHIVE = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceArchive({
  approval_decision_external_owner_response_decision_evidence_archive_id: 'local_replay_approval_decision_external_owner_response_decision_evidence_archive_demo_001',
  approval_decision_external_owner_response_decision_evidence_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_CLOSEOUT,
  created_at: '2026-05-13T00:00:00.000Z',
}));
