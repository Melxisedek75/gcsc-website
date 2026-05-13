import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST } from '../src/smart-contracts/replay/localReplayApprovalChecklist.mjs';
import {
  createLocalReplayApprovalEvidenceTemplate,
  DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE,
  LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS,
  LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS,
  REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS,
} from '../src/smart-contracts/replay/localReplayApprovalEvidenceTemplate.mjs';

const helperPath = resolve('src', 'smart-contracts', 'replay', 'localReplayApprovalEvidenceTemplate.mjs');
const indexPath = resolve('src', 'smart-contracts', 'index.mjs');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract local replay approval evidence template validation failed: ${message}`);
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
  'REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS',
  'LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS',
  'createLocalReplayApprovalEvidenceTemplate',
  'DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE',
  'TEMPLATE_ONLY_PENDING_EXTERNAL_EVIDENCE',
  'founder_approval_evidence_placeholder',
  'legal_provider_review_evidence_placeholder',
  'finance_provider_review_evidence_placeholder',
  'security_review_evidence_placeholder',
  'xpr_authority_setup_evidence_placeholder',
  'no_real_money_test_evidence_placeholder',
  'BLOCKED_FOR_LIVE',
  'PASS_LOCAL_ONLY',
]) assertIncludes(helper, required, helperPath);

for (const exportName of [
  'DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE',
  'LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS',
  'LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS',
  'REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS',
  'createLocalReplayApprovalEvidenceTemplate',
]) assertIncludes(index, exportName, indexPath);

if (REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS.length < 14) {
  fail('Required approval evidence template fields are unexpectedly short');
}

for (const field of REQUIRED_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_FIELDS) {
  if (!Object.hasOwn(DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE, field)) {
    fail(`Demo approval evidence template is missing ${field}`);
  }
}

for (const evidenceSlot of [
  'founder_approval_evidence_placeholder',
  'legal_provider_review_evidence_placeholder',
  'finance_provider_review_evidence_placeholder',
  'security_review_evidence_placeholder',
  'xpr_authority_setup_evidence_placeholder',
  'no_real_money_test_evidence_placeholder',
]) {
  if (!LOCAL_REPLAY_APPROVAL_EVIDENCE_SLOTS.includes(evidenceSlot)) {
    fail(`Evidence slots must include ${evidenceSlot}`);
  }
}

if (DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.approval_checklist_id !== DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.approval_checklist_id) {
  fail('Demo approval evidence template approval_checklist_id must match approval checklist');
}
if (DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.digest !== DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST.digest) {
  fail('Demo approval evidence template digest must match approval checklist digest');
}

for (const [field, value] of Object.entries(LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE_STATUS)) {
  if (DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE[field] !== value) {
    fail(`Approval evidence template status ${field} must stay ${value}`);
  }
}

try {
  createLocalReplayApprovalEvidenceTemplate({
    approval_evidence_template_id: 'bad_approval_evidence_template',
    approval_checklist: { ...DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST, local_only: false },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval evidence template must reject non-local approval checklist');
} catch (error) {
  if (!String(error.message).includes('local_only')) fail('Non-local approval checklist error must name local_only');
}

try {
  createLocalReplayApprovalEvidenceTemplate({
    approval_evidence_template_id: 'bad_approval_evidence_template',
    approval_checklist: { ...DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST, approval_status: 'APPROVED_FOR_LIVE' },
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval evidence template must reject approved checklist');
} catch (error) {
  if (!String(error.message).includes('PENDING_EXTERNAL_APPROVALS')) fail('Bad approval status error must name PENDING_EXTERNAL_APPROVALS');
}

try {
  createLocalReplayApprovalEvidenceTemplate({
    approval_evidence_template_id: 'sk_live_bad_secret_value',
    approval_checklist: DEMO_LOCAL_REPLAY_APPROVAL_CHECKLIST,
    created_at: '2026-05-13T00:00:00.000Z',
  });
  fail('Approval evidence template must reject secret-looking values');
} catch (error) {
  if (!String(error.message).includes('Secret-looking')) fail('Secret-looking error must be explicit');
}

assertIncludes(context, 'Smart contract local replay approval evidence template validator', contextPath);
assertIncludes(context, 'check:smart-contract-local-replay-approval-evidence-template', contextPath);
assertIncludes(backlog, 'Smart contract local replay approval evidence template', backlogPath);
assertIncludes(backlog, 'check:smart-contract-local-replay-approval-evidence-template', backlogPath);
assertIncludes(realAudit, 'Smart contract local replay approval evidence template', realAuditPath);

const scriptName = 'check:smart-contract-local-replay-approval-evidence-template';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_local_replay_approval_evidence_template: helperPath,
  evidence_status: DEMO_LOCAL_REPLAY_APPROVAL_EVIDENCE_TEMPLATE.evidence_status,
}, null, 2));
