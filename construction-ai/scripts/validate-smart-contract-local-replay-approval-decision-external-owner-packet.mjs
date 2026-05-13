import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT } from '../src/smart-contracts/replay/localReplayApprovalDecisionCloseout.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerPacket,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerPacket.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerPacket.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const helper = readRequired(helperPath);
const index = readRequired(indexPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const required of [
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS',
  'createLocalReplayApprovalDecisionExternalOwnerPacket',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET',
  'OWNER_PACKET_ONLY_PENDING_EXTERNAL_REVIEW',
  'local_replay_closeout_summary',
  'decision_routing_summary',
  'audit_trail_summary',
  'blocked_live_action_summary',
  'collect_founder_written_decision',
  'collect_legal_provider_written_decision',
  'collect_finance_provider_written_decision',
  'collect_security_written_decision',
  'collect_xpr_authority_written_decision',
  'collect_no_real_money_test_written_decision',
  'LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerPacket',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS.length < 24) {
  fail('Required approval decision external owner packet fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET, field)) {
    fail(`Demo approval decision external owner packet is missing ${field}`);
  }
}

for (const section of [
  'local_replay_closeout_summary',
  'decision_routing_summary',
  'audit_trail_summary',
  'remaining_external_decision_records',
  'blocked_live_action_summary',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_SECTIONS.includes(section)) {
    fail(`External owner packet sections must include ${section}`);
  }
}

for (const action of [
  'review_local_replay_evidence',
  'collect_founder_written_decision',
  'collect_legal_provider_written_decision',
  'collect_finance_provider_written_decision',
  'collect_security_written_decision',
  'collect_xpr_authority_written_decision',
  'collect_no_real_money_test_written_decision',
]) {
  if (!LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_ACTIONS.includes(action)) {
    fail(`External owner actions must include ${action}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.approval_decision_closeout_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.approval_decision_closeout_id) {
  fail('Demo approval decision external owner packet approval_decision_closeout_id must match decision closeout');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.digest !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT.digest) {
  fail('Demo approval decision external owner packet digest must match decision closeout digest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET[field] !== value) {
    fail(`Approval decision external owner packet status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerPacket({
    approval_decision_external_owner_packet_id: 'bad_approval_decision_external_owner_packet',
    approval_decision_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision external owner packet must reject non-local decision closeout');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision closeout error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerPacket({
    approval_decision_external_owner_packet_id: 'bad_approval_decision_external_owner_packet',
    approval_decision_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT, closeout_status: 'APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision external owner packet must reject approved closeout status');
} catch (error) {
  if (!String(error.message).includes('LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW')) {
    fail('Bad closeout status error must name LOCAL_CLOSEOUT_READY_FOR_EXTERNAL_OWNER_REVIEW');
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerPacket({
    approval_decision_external_owner_packet_id: 'sk_live_bad_secret_value',
    approval_decision_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_CLOSEOUT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval decision external owner packet must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner packet validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-packet', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner packet', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-decision-external-owner-packet', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner packet', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-packet';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_packet: helperPath,
  packet_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_PACKET.packet_status,
}, null, 2));
