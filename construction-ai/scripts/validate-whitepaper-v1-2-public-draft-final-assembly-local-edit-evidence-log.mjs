import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const evidenceLogPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md');
const executionQueuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md');
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

const evidenceLog = readRequired(evidenceLogPath);
const executionQueue = readRequired(executionQueuePath);
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
  'Whitepaper v1.2 Public Draft Final Assembly Local Edit Evidence Log',
  'Status: LOCAL_ONLY_EDIT_EVIDENCE_LOG',
  'Purpose',
  'Linked Inputs',
  'Evidence Entry Fields',
  'Allowed Evidence States',
  'Evidence Rules',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(evidenceLog, heading, evidenceLogPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_EDIT_EVIDENCE_LOG',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'evidence_log_id',
  'queue_item_id',
  'change_packet_id',
  'delta_ledger_id',
  'draft_section',
  'review_report_section',
  'files_touched',
  'checks_run',
  'claim_risk_result',
  'redaction_result',
  'blocked_action_result',
  'source_commit',
  'result_commit',
  'owner',
  'READY_FOR_LOCAL_EVIDENCE',
  'RECORD_LOCAL_EDIT_EVIDENCE',
  'REVISE_EVIDENCE_LOCAL_ONLY',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_EVIDENCE_ONLY',
  'most restrictive source state wins',
  'evidence must name exact files touched',
  'checks_run must include the targeted validator and npm run check',
  'no new public claims',
  'redaction confirmed before sharing',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log',
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
  assertIncludes(evidenceLog, snippet, evidenceLogPath);
}

for (const [content, snippet, label] of [
  [executionQueue, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue', executionQueuePath],
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

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly local edit evidence log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly local edit evidence log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly local edit evidence log', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(evidenceLog)) {
  fail('Local edit evidence log must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  local_edit_evidence_log: evidenceLogPath,
  evidence_states_checked: 9,
  safety_boundaries_checked: true,
}, null, 2));
