import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-public-beta-scope-recheck-2026-06-06.md');
const reviewPacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const quickstartPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-quickstart.md');
const faqPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-faq.md');
const consentPath = resolve('..', 'docs', 'smartcontractor-public-beta-consent-acknowledgement.md');
const privacyPath = resolve('..', 'docs', 'smartcontractor-public-beta-privacy-notice.md');
const supportPath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const launchReadinessPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-readiness.md');
const launchDecisionPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-decision-record.md');
const inviteDecisionPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const deploymentRecheckPath = resolve('..', 'docs', 'smartcontractor-week-two-deployment-public-beta-recheck-2026-06-06.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 public beta scope recheck validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const recheck = readRequired(recheckPath);
const reviewPacket = readRequired(reviewPacketPath);
const quickstart = readRequired(quickstartPath);
const faq = readRequired(faqPath);
const consent = readRequired(consentPath);
const privacy = readRequired(privacyPath);
const support = readRequired(supportPath);
const knownIssues = readRequired(knownIssuesPath);
const launchReadiness = readRequired(launchReadinessPath);
const launchDecision = readRequired(launchDecisionPath);
const inviteDecision = readRequired(inviteDecisionPath);
const firstCohort = readRequired(firstCohortPath);
const deploymentRecheck = readRequired(deploymentRecheckPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Public Beta Scope Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Purpose',
  'Source Documents And Surfaces',
  'Week 2 Public Beta Scope Recheck Sequence',
  'Current Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Public URL And Invite Boundary',
  'Consent Privacy And Support Boundary',
  'Finance Contract Safety Boundary',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve public beta launch',
  'docs/smartcontractor-public-beta-review-packet.md',
  'docs/smartcontractor-public-beta-tester-quickstart.md',
  'docs/smartcontractor-public-beta-tester-faq.md',
  'docs/smartcontractor-public-beta-consent-acknowledgement.md',
  'docs/smartcontractor-public-beta-privacy-notice.md',
  'docs/smartcontractor-public-beta-support-queue.md',
  'docs/smartcontractor-public-beta-known-issues.md',
  'docs/smartcontractor-public-beta-launch-readiness.md',
  'docs/smartcontractor-public-beta-launch-decision-record.md',
  'docs/smartcontractor-public-beta-invite-release-decision-packet.md',
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'docs/smartcontractor-week-two-deployment-public-beta-recheck-2026-06-06.md',
  '/api/admin/public-beta-next-step-readiness',
  '/api/admin/public-beta-next-step-execution-checklist',
  '/api/admin/week-two-deployment-public-beta-readiness',
  '/api/admin/week-two-deployment-public-beta-execution-checklist',
  'Confirm the beta scope is demo-only and no-real-money',
  'Confirm the first tester cohort uses tester codes only',
  'Confirm the invite batch remains HOLD',
  'Confirm the public URL remains label-only',
  'Confirm consent acknowledgement, privacy notice, terms summary, withdrawal, export, correction, deletion, use restriction, and offboarding paths',
  'Confirm support queue, support SLA, known issues, incident response, rollback drill, and first-response triage',
  'Confirm finance/contract walkthrough language stays demo-only',
  'HOLD_FOR_TESTER_SCOPE_REVIEW',
  'HOLD_FOR_PUBLIC_URL_SMOKE_REVIEW',
  'HOLD_FOR_CONSENT_PRIVACY_REVIEW',
  'HOLD_FOR_SUPPORT_KNOWN_ISSUES_REVIEW',
  'HOLD_FOR_FINANCE_CONTRACT_BOUNDARY_REVIEW',
  'HOLD_FOR_LAUNCH_DECISION_REVIEW',
  'Public Beta Scope Week 2 Recheck',
  'Scope: local prep only',
  'public_beta_flip_requested: no',
  'tester_invite_requested: no',
  'public_url_share_requested: no',
  'deploy_or_redirect_change_requested: no',
  'external_send_requested: no',
  'real_payment_or_loan_or_escrow_action_taken: no',
  'repayment_or_stablecoin_or_token_collateral_action_taken: no',
  'token_or_xpr_or_fio_action_taken: no',
  'legal_or_provider_conclusion_made: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_BETA_SCOPE_REVIEW',
  'READY_FOR_REVISION',
  'BLOCKED_FOR_PUBLIC_BETA_FLIP',
  'BLOCKED_FOR_LIVE_OR_EXTERNAL_ACTION',
  'PUBLIC_BETA_SCOPE_DECISION_RECORDED',
  'internal scope-review marker only',
  'Tracked docs may use only `public_beta_url_label`, `url_id`, `smoke_evidence_id`, `tester_batch_id`, and tester codes',
  'Do not store real public beta URLs in tracked docs',
  'Do not store invite recipient names, contact data, private tester identity maps',
  'Consent acknowledgement, privacy notice, terms summary, data deletion, data export, data correction, use restriction, consent withdrawal, and tester offboarding',
  'Support queue, support SLA, known issues, first-response triage, issue escalation, incident response, rollback drill',
  'payment charges, loan decisions, escrow release, repayment routing, stablecoin settlement, token collateral, token custody, XPR signatures, FIO registration',
  'Codex must stop before',
  'npm run check:week-two-public-beta-scope-recheck',
  'npm run check:public-beta-review-packet',
  'npm run check:public-beta-tester-quickstart',
  'npm run check:public-beta-tester-faq',
  'npm run check:public-beta-consent-ack',
  'npm run check:public-beta-privacy-notice',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:public-beta-launch-readiness',
  'npm run check:public-beta-launch-decision-record',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:week-two-deployment-public-beta-recheck',
  'no-secret, no-public-URL-share, no-tester-invite, no-sensitive-tester-data, no-live-Supabase, no-deploy, no-public-file-replacement, no-real-money',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [reviewPacket, 'SmartContractor Public Beta Review Packet', reviewPacketPath],
  [quickstart, 'SmartContractor Public Beta Tester Quickstart', quickstartPath],
  [faq, 'SmartContractor Public Beta Tester FAQ', faqPath],
  [consent, 'SmartContractor Public Beta Consent Acknowledgement', consentPath],
  [privacy, 'SmartContractor Public Beta Privacy Notice', privacyPath],
  [support, 'SmartContractor Public Beta Support Queue', supportPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [launchReadiness, 'SmartContractor Public Beta Launch Readiness', launchReadinessPath],
  [launchDecision, 'SmartContractor Public Beta Launch Decision Record', launchDecisionPath],
  [inviteDecision, 'SmartContractor Public Beta Invite Release Decision Packet', inviteDecisionPath],
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
  [deploymentRecheck, 'SmartContractor Week 2 Deployment/Public Beta Recheck', deploymentRecheckPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Week 2 public beta scope recheck', contextPath);
assertIncludes(context, 'check:week-two-public-beta-scope-recheck', contextPath);
assertIncludes(backlog, 'Week 2 public beta scope recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-public-beta-scope-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-public-beta-scope-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-public-beta-scope-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 public beta scope recheck must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_public_beta_scope_recheck: recheckPath,
  linked_source_docs_checked: 12,
  beta_scope_stop_boundaries_checked: true,
}, null, 2));
