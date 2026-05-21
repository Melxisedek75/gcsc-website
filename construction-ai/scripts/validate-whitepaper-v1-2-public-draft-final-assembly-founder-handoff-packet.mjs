import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md');
const evidenceLogPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md');
const executionQueuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md');
const deltaLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md');
const localChangePacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md');
const decisionRecordPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md');
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

const handoff = readRequired(handoffPath);
const evidenceLog = readRequired(evidenceLogPath);
const executionQueue = readRequired(executionQueuePath);
const deltaLedger = readRequired(deltaLedgerPath);
const localChangePacket = readRequired(localChangePacketPath);
const decisionRecord = readRequired(decisionRecordPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Founder Handoff Packet',
  'Status: LOCAL_ONLY_FOUNDER_HANDOFF_PACKET',
  'Purpose',
  'Linked Inputs',
  'Handoff Fields',
  'Allowed Handoff States',
  'Founder Review Scope',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(handoff, heading, handoffPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FOUNDER_HANDOFF_PACKET',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'handoff_packet_id',
  'source_commit',
  'evidence_log_ids',
  'queue_item_ids',
  'delta_ledger_ids',
  'draft_sections_reviewed',
  'review_report_sections_reviewed',
  'claim_risk_summary',
  'redaction_summary',
  'blocked_action_summary',
  'latest_check_run',
  'founder_decision_needed',
  'READY_FOR_FOUNDER_REVIEW',
  'REVISE_LOCAL_ONLY',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_HANDOFF_ONLY',
  'most restrictive source state wins',
  'founder can approve only internal wording direction',
  'no new public claims',
  'redaction confirmed before sharing',
  'founder handoff cannot become publication approval',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(handoff, snippet, handoffPath);
}

for (const [content, snippet, label] of [
  [evidenceLog, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Evidence Log', evidenceLogPath],
  [executionQueue, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue', executionQueuePath],
  [deltaLedger, 'Whitepaper v1.2 Public Draft Final Assembly Review Report Delta Ledger', deltaLedgerPath],
  [localChangePacket, 'Whitepaper v1.2 Public Draft Final Assembly Local Change Packet', localChangePacketPath],
  [decisionRecord, 'Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record', decisionRecordPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder handoff packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder handoff packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder handoff packet', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(handoff)) {
  fail('Founder handoff packet must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_handoff_packet: handoffPath,
  handoff_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
