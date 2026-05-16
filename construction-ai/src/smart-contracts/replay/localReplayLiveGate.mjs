import { DEMO_LOCAL_REPLAY_FOUNDER_PACKET } from './localReplayFounderPacket.mjs';

const SECRET_PATTERN = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i;

export const REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS = Object.freeze([
  'live_gate_id',
  'founder_packet_id',
  'proof_id',
  'replay_id',
  'request_id',
  'digest_id',
  'module_order',
  'live_gate_status',
  'required_before_live',
  'local_only',
  'deployment_status',
  'pass_fail_status',
  'created_at',
]);

export const LOCAL_REPLAY_LIVE_GATE_STATUS = Object.freeze({
  local_only: true,
  deployment_status: 'BLOCKED_FOR_LIVE',
  pass_fail_status: 'PASS_LOCAL_ONLY',
  live_gate_status: 'HOLD_FOR_FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW',
  required_before_live: Object.freeze([
    'founder approval',
    'legal/provider review',
    'finance provider review',
    'security review',
    'XPR account and authority setup',
    'no-real-money test evidence',
  ]),
});

function assertNoSecretLookingValue(value, path) {
  if (typeof value === 'string' && SECRET_PATTERN.test(value)) {
    throw new Error(`Secret-looking value is not allowed in local replay live gate: ${path}`);
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assertNoSecretLookingValue(nested, `${path}.${key}`);
    }
  }
}

export function createLocalReplayLiveGate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Local replay live gate input must be an object');
  }

  const founderPacket = input.founder_packet;
  if (!founderPacket?.local_only) {
    throw new Error('Local replay live gate requires a local_only founder_packet');
  }

  if (founderPacket.deployment_status !== 'BLOCKED_FOR_LIVE') {
    throw new Error('Local replay live gate founder_packet must be BLOCKED_FOR_LIVE');
  }

  if (founderPacket.pass_fail_status !== 'PASS_LOCAL_ONLY') {
    throw new Error('Local replay live gate founder_packet must be PASS_LOCAL_ONLY');
  }
  if (!founderPacket.module_order?.includes('repayment_failure')) {
    throw new Error('Local replay live gate founder_packet module_order must include repayment_failure');
  }

  assertNoSecretLookingValue(input, 'local_replay_live_gate');

  const gate = {
    live_gate_id: input.live_gate_id,
    founder_packet_id: founderPacket.founder_packet_id,
    proof_id: founderPacket.proof_id,
    evidence_bundle_id: founderPacket.evidence_bundle_id,
    replay_id: founderPacket.replay_id,
    request_id: founderPacket.request_id,
    digest_id: founderPacket.digest_id,
    digest: founderPacket.digest,
    module_order: Object.freeze([...founderPacket.module_order]),
    created_at: input.created_at,
    ...LOCAL_REPLAY_LIVE_GATE_STATUS,
  };

  for (const field of REQUIRED_LOCAL_REPLAY_LIVE_GATE_FIELDS) {
    if (gate[field] === undefined || gate[field] === null || gate[field] === '') {
      throw new Error(`Missing required local replay live gate field: ${field}`);
    }
  }

  return Object.freeze(gate);
}

export const DEMO_LOCAL_REPLAY_LIVE_GATE = Object.freeze(createLocalReplayLiveGate({
  live_gate_id: 'local_replay_live_gate_demo_001',
  founder_packet: DEMO_LOCAL_REPLAY_FOUNDER_PACKET,
  created_at: '2026-05-13T00:00:00.000Z',
}));
