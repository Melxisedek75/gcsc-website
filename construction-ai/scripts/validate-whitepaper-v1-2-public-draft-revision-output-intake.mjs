import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const intakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-output-intake.md');
const workerPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-worker-packet.md');
const checklistPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-checklist.md');
const planPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-revision-plan.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

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

const intake = readRequired(intakePath);
const workerPacket = readRequired(workerPacketPath);
const checklist = readRequired(checklistPath);
const plan = readRequired(planPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Revision Output Intake',
  'Status: INTERNAL_OUTPUT_INTAKE_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Allowed Intake Sources',
  'Required Intake Record',
  'Decision States',
  'Acceptance Rules',
  'Automatic HOLD Rules',
  'Codex Integration Steps',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(intake, heading, intakePath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve investor outreach',
  'does not approve legal/provider decisions',
  'does not approve live Supabase changes',
  'does not approve deployment',
  'does not approve real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement',
  'docs/whitepaper-v1-2-public-draft-revision-worker-packet.md',
  'docs/whitepaper-v1-2-public-draft-revision-checklist.md',
  'docs/whitepaper-v1-2-public-draft-revision-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
  'source_worker',
  'source_files_read',
  'sections_reviewed',
  'proposed_local_change_id',
  'affected_sections',
  'claim_risk_class',
  'decision',
  'required_validator',
  'owner',
  'publication_status',
  'redaction_status',
  'ACCEPT_LOCAL_ONLY',
  'REVISE_LOCAL_ONLY',
  'REJECT',
  'HOLD_FOR_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_FOUNDER_REVIEW',
  'INTERNAL_DRAFT_ONLY',
  'REVIEW_REPORT_ONLY',
  'PUBLICATION_BLOCKED',
  'Any missing source_worker, source_files_read, claim_risk_class, required_validator, owner, publication_status, or redaction_status defaults to HOLD_FOR_REVIEW',
  'Any private customer data, tester identities, Magic Link URLs, screenshots, recordings, raw logs, secrets, provider credentials, API keys, database URLs, wallet data, or payment data defaults to HOLD_FOR_REDACTION',
  'Any request to publish, deploy, edit public surfaces, contact providers, send investor material, make legal/provider commitments, move money, enable loans, release escrow, route repayment, settle stablecoins, lock token collateral, sign XPR actions, or change live Supabase defaults to HOLD_FOR_FOUNDER_REVIEW',
  'Kimi and Claude output is advisory only',
  'Codex may integrate only local wording or review-report updates after validator evidence is recorded',
  'npm run check:whitepaper-v1-2-public-draft-revision-output-intake',
  'npm run check:whitepaper-v1-2-public-draft-revision-worker-packet',
  'npm run check:whitepaper-v1-2-public-draft-revision-checklist',
  'npm run check:whitepaper-v1-2-public-draft',
]) {
  assertIncludes(intake, snippet, intakePath);
}

for (const [content, snippet, label] of [
  [workerPacket, 'Whitepaper v1.2 Public Draft Revision Worker Packet', workerPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Revision Checklist', checklistPath],
  [plan, 'Whitepaper v1.2 Public Draft Revision Plan', planPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-revision-output-intake'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-revision-output-intake.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-revision-output-intake`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-revision-output-intake"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 public draft revision output intake', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-revision-output-intake', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft revision output intake', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-revision-output-intake', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft revision output intake', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('Output intake must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_draft_revision_output_intake: intakePath,
  decision_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
