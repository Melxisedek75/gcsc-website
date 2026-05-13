import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence intake validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE',
  'RESPONSE_DECISION_EVIDENCE_INTAKE_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_EVIDENCE_TEMPLATE_ONLY_PENDING_EXTERNAL_RECORDS',
  'captured_evidence_fields',
  'accepted_decision_record_states',
  'PENDING_EXTERNAL_REVIEW',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS.length < 30) {
  fail('Required approval decision external owner response decision evidence intake fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE, field)) {
    fail(`Demo approval decision external owner response decision evidence intake is missing ${field}`);
  }
}

for (const state of ['PENDING_EXTERNAL_REVIEW', 'HOLD', 'REVISE', 'NO_GO']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_ACCEPTED_STATES.includes(state)) {
    fail(`Decision evidence intake accepted states must include ${state}`);
  }
}

for (const blockedState of ['GO_FOR_LIVE', 'LIVE_APPROVED', 'AUTO_APPROVED']) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE.accepted_decision_record_states.includes(blockedState)) {
    fail(`Decision evidence intake must not accept ${blockedState}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE.approval_decision_external_owner_response_decision_evidence_template_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.approval_decision_external_owner_response_decision_evidence_template_id) {
  fail('Demo approval decision external owner response decision evidence intake template id must match decision evidence template');
}

for (const field of DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.required_evidence_fields) {
  if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE.captured_evidence_fields.includes(field)) {
    fail(`Decision evidence intake captured fields must include ${field}`);
  }
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE[field] !== value) {
    fail(`Approval decision external owner response decision evidence intake status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake({
    approval_decision_external_owner_response_decision_evidence_intake_id: 'bad_response_decision_evidence_intake',
    approval_decision_external_owner_response_decision_evidence_template: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence intake must reject non-local decision evidence template');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision evidence template error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake({
    approval_decision_external_owner_response_decision_evidence_intake_id: 'bad_response_decision_evidence_intake',
    approval_decision_external_owner_response_decision_evidence_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE,
    accepted_decision_record_states: ['GO_FOR_LIVE'],
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence intake must reject live GO states');
} catch (error) {
  if (!String(error.message).includes('cannot accept')) fail('Live decision state error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceIntake({
    approval_decision_external_owner_response_decision_evidence_intake_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_evidence_template: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence intake must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence intake validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-intake', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence intake', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence intake', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-intake';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_intake: helperPath,
  decision_evidence_intake_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_INTAKE.decision_evidence_intake_status,
}, null, 2));
