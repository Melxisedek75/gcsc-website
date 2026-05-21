import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const queuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue.md');
const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md');
const responseIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md');
const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md');
const evidenceLogPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md');
const executionQueuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md');
const deltaLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md');
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
const routing = readRequired(routingPath);
const responseIntake = readRequired(responseIntakePath);
const handoff = readRequired(handoffPath);
const evidenceLog = readRequired(evidenceLogPath);
const executionQueue = readRequired(executionQueuePath);
const deltaLedger = readRequired(deltaLedgerPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Queue',
  'Status: LOCAL_ONLY_FOUNDER_RESPONSE_LOCAL_ACTION_QUEUE',
  'Purpose',
  'Linked Inputs',
  'Queue Fields',
  'Allowed Local Action States',
  'Queue Rules',
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
  'LOCAL_ONLY_FOUNDER_RESPONSE_LOCAL_ACTION_QUEUE',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'local_action_id',
  'routing_record_id',
  'response_intake_id',
  'source_commit',
  'local_action_state',
  'target_document',
  'target_section',
  'action_summary',
  'claim_risk_gate',
  'redaction_gate',
  'blocked_action_acknowledgement',
  'required_check',
  'latest_check_run',
  'next_local_action',
  'QUEUE_INTERNAL_DRAFT_WORDING_UPDATE',
  'QUEUE_REVIEW_REPORT_NOTE_UPDATE',
  'QUEUE_LOCAL_REVISION',
  'QUEUE_CLAIM_RISK_HOLD',
  'QUEUE_REDACTION_HOLD',
  'QUEUE_LEGAL_PROVIDER_HOLD',
  'QUEUE_INTERNAL_CLOSEOUT_ONLY',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'local action queue cannot become publication approval',
  'queued action does not execute automatically',
  'no new public claims',
  'redaction confirmed before sharing',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(queue, snippet, queuePath);
}

for (const [content, snippet, label] of [
  [routing, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Routing Checklist', routingPath],
  [responseIntake, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Intake Template', responseIntakePath],
  [handoff, 'Whitepaper v1.2 Public Draft Final Assembly Founder Handoff Packet', handoffPath],
  [evidenceLog, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Evidence Log', evidenceLogPath],
  [executionQueue, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue', executionQueuePath],
  [deltaLedger, 'Whitepaper v1.2 Public Draft Final Assembly Review Report Delta Ledger', deltaLedgerPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder response local action queue', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder response local action queue', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder response local action queue', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(queue)) {
  fail('Founder response local action queue must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_response_local_action_queue: queuePath,
  local_action_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
