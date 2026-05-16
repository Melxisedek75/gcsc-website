import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT } from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionRegisterCloseout.mjs';
import {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate,
  DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE,
  LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS,
  LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval decision external owner response decision evidence template validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate',
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE',
  'RESPONSE_DECISION_EVIDENCE_TEMPLATE_ONLY_PENDING_EXTERNAL_RECORDS',
  'RESPONSE_DECISION_REGISTER_CLOSEOUT_PENDING_EXTERNAL_DECISIONS',
  'no_secret_confirmation',
  'no_live_action_confirmation',
  'redacted_evidence_reference',
  'module_order',
  'repayment_failure',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE',
  'LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS',
  'createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS.length < 31) {
  fail('Required approval decision external owner response decision evidence template fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE, field)) {
    fail(`Demo approval decision external owner response decision evidence template is missing ${field}`);
  }
}

for (const field of ['review_owner_role', 'review_decision_state', 'review_decision_date', 'redacted_evidence_reference', 'no_secret_confirmation', 'no_live_action_confirmation']) {
  if (!LOCAL_REPLAY_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_REQUIRED_FIELDS.includes(field)) {
    fail(`Decision evidence template required fields must include ${field}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.approval_decision_external_owner_response_decision_register_closeout_id !== DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.approval_decision_external_owner_response_decision_register_closeout_id) {
  fail('Demo approval decision external owner response decision evidence template closeout id must match response decision register closeout');
}

if (!DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.module_order?.includes('repayment_failure')) {
  fail('Demo approval decision external owner response decision evidence template module order must include repayment_failure');
}

if (JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.module_order) !== JSON.stringify(DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.module_order)) {
  fail('Demo approval decision external owner response decision evidence template module order must match response decision register closeout');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE[field] !== value) {
    fail(`Approval decision external owner response decision evidence template status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate({
    approval_decision_external_owner_response_decision_evidence_template_id: 'bad_response_decision_evidence_template',
    approval_decision_external_owner_response_decision_register_closeout: { ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence template must reject non-local decision register closeout');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local decision register closeout error must name local_only');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate({
    approval_decision_external_owner_response_decision_evidence_template_id: 'bad_response_decision_evidence_template_missing_repayment_failure',
    approval_decision_external_owner_response_decision_register_closeout: {
      ...DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT,
      module_order: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT.module_order.filter((moduleName) => moduleName !== 'repayment_failure'),
    },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence template must reject decision register closeout missing repayment_failure module coverage');
} catch (error) {
  if (!String(error.message).includes('repayment_failure')) fail('Missing repayment_failure error must be explicit');
}

try {
  createLocalReplayApprovalDecisionExternalOwnerResponseDecisionEvidenceTemplate({
    approval_decision_external_owner_response_decision_evidence_template_id: 'sk_live_bad_secret_value',
    approval_decision_external_owner_response_decision_register_closeout: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_REGISTER_CLOSEOUT,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('External owner response decision evidence template must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval decision external owner response decision evidence template validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-template', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval decision external owner response decision evidence template', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval decision external owner response decision evidence template', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-decision-external-owner-response-decision-evidence-template';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_decision_external_owner_response_decision_evidence_template: helperPath,
  decision_evidence_template_status: DEMO_LOCAL_REPLAY_APPROVAL_DECISION_EXTERNAL_OWNER_RESPONSE_DECISION_EVIDENCE_TEMPLATE.decision_evidence_template_status,
}, null, 2));
