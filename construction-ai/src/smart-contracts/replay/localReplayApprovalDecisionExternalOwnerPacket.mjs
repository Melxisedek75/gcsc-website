import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT } from './localReplayApprovalDecisionCloseout.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS = Object.freeze([
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
  'packet_status',
  'packet_sections',
  'external_owner_actions',
  'remaining_external_decision_records',
  'blocked_autonomous_actions',
  'blocked_live_actions',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  packet_status: 'OWNER_PACKET_ONLY_PENDING_EXTERNAL_REVIEW',
});

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS = Object.freeze([
  'local_replay_closeout_summary',
  'decision_routing_summary',
  'audit_trail_summary',
  'remaining_external_decision_records',
  'blocked_live_action_summary',
]);

export const LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS = Object.freeze([
  'review_local_replay_evidence',
  'collect_founder_written_decision',
  'collect_legal_provider_written_decision',
  'collect_finance_provider_written_decision',
  'collect_security_written_decision',
  'collect_xpr_authority_written_decision',
  'collect_no_real_money_test_written_decision',
]);

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay approval decision external owner packet: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayApprovalDecisionExternalOwnerPacket(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay approval decision external owner packet input must be an object');
  }

  const closeout = input.approval_decision_closeout;
  if (!closeout?.local_only) {
    throw new Error('Local replay approval decision external owner packet requires a local_only approval_decision_closeout');
  }

  if (closeout.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay approval decision external owner packet approval_decision_closeout must be BLOCKED_FOR_LIVE');
  }

  if (closeout.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay approval decision external owner packet approval_decision_closeout must be PASS_LOCAL_ONLY');
  }

  if (closeout.closeout_status !== 'LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW') {
    throw new Error('Local replay approval decision external owner packet requires LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW status');
  }

  assertNoSecretLookingValue(input, 'local_replay_approval_decision_external_owner_packet');

  const packet = {
    approval_decision_external_owner_packet_id: input.approval_decision_external_owner_packet_id,
    approval_decision_closeout_id: closeout.approval_decision_closeout_id,
    approval_decision_audit_trail_id: closeout.approval_decision_audit_trail_id,
    approval_decision_routing_id: closeout.approval_decision_routing_id,
    approval_decision_intake_id: closeout.approval_decision_intake_id,
    approval_decision_draft_id: closeout.approval_decision_draft_id,
    approval_handoff_summary_id: closeout.approval_handoff_summary_id,
    approval_evidence_template_id: closeout.approval_evidence_template_id,
    approval_checklist_id: closeout.approval_checklist_id,
    live_gate_id: closeout.live_gate_id,
    founder_packet_id: closeout.founder_packet_id,
    proof_id: closeout.proof_id,
    request_id: closeout.request_id,
    digest_id: closeout.digest_id,
    digest: closeout.digest,
    packet_sections: LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS,
    external_owner_actions: LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS,
    remaining_external_decision_records: closeout.remaining_external_decision_records,
    blocked_autonomous_actions: closeout.blocked_autonomous_actions,
    blocked_live_actions: closeout.blocked_live_actions,
    created_at: input.created_at,
    ...LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS) {
    if (packet[field] === undefined || packet[field] === null || packet[field] === '') {
      throw new Error(`Missing required local replay approval decision external owner packet field: ${field}`);
    }
  }

  return Object.freeze(packet);
}

export const DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET = Object.freeze(createLocalReplayApprovalDecisionExternalOwnerPacket({
  approval_decision_external_owner_packet_id: 'local_replay_approval_decision_external_owner_packet_demo_001',
  approval_decision_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT,
  created_at: '2026-05-13T00:00:00.000Z',
}));
