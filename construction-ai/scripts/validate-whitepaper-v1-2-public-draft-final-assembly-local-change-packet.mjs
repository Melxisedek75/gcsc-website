import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const changePacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md');
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

const changePacket = readRequired(changePacketPath);
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
  'Whitepaper v1.2 Public Draft Final Assembly Local Change Packet',
  'Status: LOCAL_ONLY_FINAL_ASSEMBLY_CHANGE_PACKET',
  'Purpose',
  'Change Inputs',
  'Change Packet Fields',
  'Allowed Change States',
  'Local Change Scope',
  'Claim And Redaction Gates',
  'Review Report Update Rules',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(changePacket, heading, changePacketPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FINAL_ASSEMBLY_CHANGE_PACKET',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-plan.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'change_packet_id',
  'decision_record_id',
  'review_packet_id',
  'assembly_id',
  'source_commit',
  'target_draft_version',
  'sections_to_change',
  'sections_not_to_change',
  'before_summary',
  'after_summary',
  'claim_risk_summary',
  'redaction_summary',
  'review_report_delta',
  'latest_check_run',
  'blocked_next_actions',
  'READY_FOR_LOCAL_CHANGE',
  'APPLY_LOCAL_ONLY',
  'REVISE_LOCAL_ONLY',
  'HOLD_FOR_FOUNDER_REVIEW',
  'HOLD_FOR_CLAIM_RISK_REVIEW',
  'HOLD_FOR_REDACTION',
  'HOLD_FOR_LEGAL_PROVIDER_REVIEW',
  'PUBLICATION_BLOCKED',
  'INTERNAL_DRAFT_ONLY',
  'REVIEW_REPORT_ONLY',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'no new public claims',
  'redaction confirmed before sharing',
  'review report updated with every local wording change',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-plan',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(changePacket, snippet, changePacketPath);
}

for (const [content, snippet, label] of [
  [decisionRecord, 'Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record', decisionRecordPath],
  [reviewPacket, 'Whitepaper v1.2 Public Draft Final Assembly Review Packet', reviewPacketPath],
  [checklist, 'Whitepaper v1.2 Public Draft Final Assembly Checklist', checklistPath],
  [plan, 'Whitepaper v1.2 Public Draft Final Assembly Plan', planPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-local-change-packet.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly local change packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly local change packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly local change packet', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(changePacket)) {
  fail('Final assembly local change packet must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  local_change_packet: changePacketPath,
  change_states_checked: 10,
  safety_boundaries_checked: true,
}, null, 2));
