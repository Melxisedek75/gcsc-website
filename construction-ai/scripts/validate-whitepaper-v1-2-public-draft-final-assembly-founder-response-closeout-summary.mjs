import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary.md');
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

const closeout = readRequired(closeoutPath);
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
  'Whitepaper v1.2 Public Draft Final Assembly Founder Response Closeout Summary',
  'Status: LOCAL_ONLY_FOUNDER_RESPONSE_CLOSEOUT_SUMMARY',
  'Purpose',
  'Linked Inputs',
  'Closeout Fields',
  'Closeout States',
  'Closeout Rules',
  'Claim And Redaction Closeout Gates',
  'Founder Next Decisions',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(closeout, heading, closeoutPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FOUNDER_RESPONSE_CLOSEOUT_SUMMARY',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'closeout_id',
  'response_intake_ids',
  'routing_record_ids',
  'local_action_ids',
  'evidence_log_ids',
  'source_commit',
  'final_closeout_state',
  'accepted_internal_wording_direction',
  'unresolved_claim_risk_items',
  'unresolved_redaction_items',
  'legal_provider_holds',
  'checks_run',
  'blocked_action_summary',
  'founder_next_decision',
  'READY_FOR_INTERNAL_WORDING_REVIEW',
  'LOCAL_ACTION_CLOSEOUT_RECORDED',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_ONLY_ARCHIVED',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'closeout summary cannot become publication approval',
  'no new public claims',
  'redaction confirmed before sharing',
  'founder may choose accept internal wording direction',
  'founder may choose revise internal wording direction',
  'founder may choose hold for claim-risk review',
  'founder may choose hold for legal/provider review',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-evidence-log',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(closeout, snippet, closeoutPath);
}

for (const [content, snippet, label] of [
  [evidence, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Evidence Log', evidencePath],
  [queue, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Queue', queuePath],
  [routing, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Routing Checklist', routingPath],
  [responseIntake, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Intake Template', responseIntakePath],
  [handoff, 'Whitepaper v1.2 Public Draft Final Assembly Founder Handoff Packet', handoffPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder response closeout summary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder response closeout summary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-closeout-summary', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder response closeout summary', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Founder response closeout summary must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_response_closeout_summary: closeoutPath,
  closeout_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
