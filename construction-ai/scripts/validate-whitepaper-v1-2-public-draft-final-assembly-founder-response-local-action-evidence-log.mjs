import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const evidencePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log.md');
const queuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue.md');
const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md');
const responseIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md');
const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md');
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

const evidence = readRequired(evidencePath);
const queue = readRequired(queuePath);
const routing = readRequired(routingPath);
const responseIntake = readRequired(responseIntakePath);
const handoff = readRequired(handoffPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Evidence Log',
  'Status: LOCAL_ONLY_FOUNDER_RESPONSE_LOCAL_ACTION_EVIDENCE_LOG',
  'Purpose',
  'Linked Inputs',
  'Evidence Fields',
  'Evidence States',
  'Evidence Rules',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(evidence, heading, evidencePath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FOUNDER_RESPONSE_LOCAL_ACTION_EVIDENCE_LOG',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'evidence_log_id',
  'local_action_id',
  'routing_record_id',
  'response_intake_id',
  'source_commit',
  'evidence_state',
  'files_reviewed',
  'files_changed',
  'checks_run',
  'claim_risk_result',
  'redaction_result',
  'blocked_action_result',
  'next_local_action',
  'LOCAL_ACTION_RECORDED',
  'LOCAL_ACTION_REVISED',
  'CLAIM_RISK_HOLD_RECORDED',
  'REDACTION_HOLD_RECORDED',
  'LEGAL_PROVIDER_HOLD_RECORDED',
  'PUBLICATION_BLOCKED_RECORDED',
  'INTERNAL_CLOSEOUT_RECORDED',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'evidence log cannot become publication approval',
  'no new public claims',
  'redaction confirmed before sharing',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(evidence, snippet, evidencePath);
}

for (const [content, snippet, label] of [
  [queue, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Queue', queuePath],
  [routing, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Routing Checklist', routingPath],
  [responseIntake, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Intake Template', responseIntakePath],
  [handoff, 'Whitepaper v1.2 Public Draft Final Assembly Founder Handoff Packet', handoffPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder response local action evidence log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder response local action evidence log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder response local action evidence log', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(evidence)) {
  fail('Founder response local action evidence log must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_response_local_action_evidence_log: evidencePath,
  evidence_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
