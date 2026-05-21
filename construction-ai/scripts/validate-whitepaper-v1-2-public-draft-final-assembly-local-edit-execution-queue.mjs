import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const queuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md');
const deltaLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md');
const localChangePacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md');
const decisionRecordPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md');
const reviewPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-packet.md');
const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-checklist.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-plan.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciWorkflowValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail('Missing required file', { path });
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, label) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

const queue = readRequired(queuePath);
const deltaLedger = readRequired(deltaLedgerPath);
const localChangePacket = readRequired(localChangePacketPath);
const decisionRecord = readRequired(decisionRecordPath);
const reviewPacket = readRequired(reviewPacketPath);
const checklist = readRequired(checklistPath);
const plan = readRequired(planPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue',
  'Status: LOCAL_ONLY_EDIT_EXECUTION_QUEUE',
  'Purpose',
  'Linked Inputs',
  'Queue Entry Fields',
  'Allowed Queue States',
  'Execution Rules',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(queue, heading, queuePath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_EDIT_EXECUTION_QUEUE',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'queue_item_id',
  'change_packet_id',
  'delta_ledger_id',
  'draft_section',
  'review_report_section',
  'edit_type',
  'source_before_summary',
  'local_after_summary',
  'claim_risk_delta',
  'redaction_delta',
  'blocked_action_delta',
  'latest_check_run',
  'owner',
  'READY_FOR_LOCAL_EDIT',
  'APPLY_LOCAL_DRAFT_EDIT',
  'APPLY_REVIEW_REPORT_DELTA_LOCAL_ONLY',
  'REVISE_QUEUE_ITEM_LOCAL_ONLY',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_QUEUE_ONLY',
  'most restrictive source state wins',
  'draft edit and review report delta must be paired',
  'no new public claims',
  'redaction confirmed before sharing',
  'local edit queue cannot touch website files',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(queue, snippet, queuePath);
}

for (const [content, snippet, label] of [
  [deltaLedger, 'Whitepaper v1.2 Public Draft Final Assembly Review Report Delta Ledger', deltaLedgerPath],
  [localChangePacket, 'Whitepaper v1.2 Public Draft Final Assembly Local Change Packet', localChangePacketPath],
  [decisionRecord, 'Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record', decisionRecordPath],
  [reviewPacket, 'Whitepaper v1.2 Public Draft Final Assembly Review Packet', reviewPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Final Assembly Checklist', checklistPath],
  [plan, 'Whitepaper v1.2 Public Draft Final Assembly Plan', planPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly local edit execution queue', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly local edit execution queue', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly local edit execution queue', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(queue)) {
  fail('Local edit execution queue must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  local_edit_execution_queue: queuePath,
  queue_states_checked: 10,
  safety_boundaries_checked: true,
}, null, 2));
