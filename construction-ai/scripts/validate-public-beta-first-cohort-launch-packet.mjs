import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const commandBoardPath = resolve('..', 'docs', 'smartcontractor-founder-evening-command-board.md');
const executionPlanPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-execution-plan.md');
const launchDecisionPath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-decision-record.md');
const cohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-cohort.md');
const inviteBatchesPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-batches.md');
const launchMessagePath = resolve('..', 'docs', 'smartcontractor-public-beta-launch-message.md');
const testerFaqPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-faq.md');
const consentPath = resolve('..', 'docs', 'smartcontractor-public-beta-consent-acknowledgement.md');
const privacyPath = resolve('..', 'docs', 'smartcontractor-public-beta-privacy-notice.md');
const quickstartPath = resolve('..', 'docs', 'smartcontractor-public-beta-tester-quickstart.md');
const supportPath = resolve('..', 'docs', 'smartcontractor-public-beta-support-queue.md');
const knownIssuesPath = resolve('..', 'docs', 'smartcontractor-public-beta-known-issues.md');
const dailyStatusPath = resolve('..', 'docs', 'smartcontractor-public-beta-daily-status-template.md');
const weeklyCloseoutPath = resolve('..', 'docs', 'smartcontractor-public-beta-weekly-closeout.md');
const metricsPath = resolve('..', 'docs', 'smartcontractor-public-beta-metrics-snapshot.md');
const goNoGoPath = resolve('..', 'docs', 'smartcontractor-beta-go-no-go-scorecard.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta first cohort launch packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const packet = readRequired(packetPath);
const commandBoard = readRequired(commandBoardPath);
const executionPlan = readRequired(executionPlanPath);
const launchDecision = readRequired(launchDecisionPath);
const cohort = readRequired(cohortPath);
const inviteBatches = readRequired(inviteBatchesPath);
const launchMessage = readRequired(launchMessagePath);
const testerFaq = readRequired(testerFaqPath);
const consent = readRequired(consentPath);
const privacy = readRequired(privacyPath);
const quickstart = readRequired(quickstartPath);
const support = readRequired(supportPath);
const knownIssues = readRequired(knownIssuesPath);
const dailyStatus = readRequired(dailyStatusPath);
const weeklyCloseout = readRequired(weeklyCloseoutPath);
const metrics = readRequired(metricsPath);
const goNoGo = readRequired(goNoGoPath);
const audit = readRequired(auditPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packageJsonPath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta First Cohort Launch Packet',
  'Status: INTERNAL_FIRST_COHORT_PACKET_ONLY',
  'Purpose',
  'Launch Readiness Rule',
  'First Cohort Shape',
  'Invite Sequence',
  'Role Prompts',
  'Safe Support Intake',
  'Tester Identity Mapping Boundary',
  'Hosted URL Share Stop',
  'Automatic Stop Conditions',
  'Existing Documents To Use',
  'Founder Summary Template',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(packet, section, packetPath);

for (const required of [
  '3-5 SmartContractor public beta testers',
  'demo-only scope',
  'tester code',
  'PB-HO-001',
  'PB-CO-001',
  'PB-PR-001',
  'PB-AD-001',
  'homeowner',
  'contractor',
  'peer reviewer',
  'founder/admin observer',
  'support owner',
  'known issues',
  'tester FAQ',
  'consent acknowledgement',
  'privacy notice',
  'tester quickstart',
  'X-Request-Id',
  'issue ID',
  'redacted screenshots',
  'no SQL',
  'no secrets',
  'passwords',
  'private keys',
  'bank data',
  'card data',
  'personal IDs',
  'private contact details',
  'emails',
  'phone numbers',
  'real customer addresses',
  'Supabase tokens',
  'database URLs',
  'API keys',
  'service-role keys',
  'Magic Link tokens',
  'payment data',
  'wallet data',
  'Tester identity mapping must stay outside repo docs and use founder-controlled storage only',
  'The repo may track tester_code, role, flow, consent_status, privacy_notice_status, support_issue_id, safe_request_id, and redacted_artifact_id only',
  'Do not commit or paste tester names, personal emails, phone numbers, addresses, wallet IDs, account IDs, private job details, Magic Link URLs, or consent signatures into repo docs, support notes, screenshots, recordings, prompts, Kimi packets, Claude packets, or Codex reports',
  'If a tester identity, contact detail, private job detail, consent signature, or unredacted artifact enters a repo file or chat transcript, stop the cohort workflow, mark the batch HOLD_FOR_REDACTION, and create a redacted replacement before any invite, support reply, or external packet continues',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'repayment routing disabled',
  'stablecoin settlement disabled',
  'token collateral disabled',
  'Do not send a public beta URL to testers until post-deploy smoke checks have passed',
  'hosted URL must be founder-approved and demo-only',
  'record safe health, auth/readiness, beta readiness, and no-real-money checks with request IDs',
  'if the URL is unstable, points to the wrong environment, exposes secrets or private data, or appears to enable a live-risk flow, keep the invite batch planned or review and stop sharing',
  'tester messages may refer to the app link only after founder-controlled deployment and smoke evidence',
  'public launch approval',
  'production deploy approval',
  'legal advice',
  'provider approval',
  'payment approval',
  'loan approval',
  'escrow approval',
  'token-collateral approval',
  'Live-risk actions taken: none',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:public-beta-founder-execution-plan',
  'npm run check:public-beta-launch-decision-record',
  'npm run check:public-beta-tester-cohort',
  'npm run check:public-beta-invite-batches',
  'npm run check:public-beta-launch-message',
  'npm run check:public-beta-tester-faq',
  'npm run check:public-beta-consent-ack',
  'npm run check:public-beta-privacy-notice',
  'npm run check:public-beta-support-queue',
  'npm run check:public-beta-known-issues',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(packet, required, packetPath);

for (const linkedDoc of [
  'docs/smartcontractor-founder-evening-command-board.md',
  'docs/smartcontractor-public-beta-founder-execution-plan.md',
  'docs/smartcontractor-public-beta-launch-decision-record.md',
  'docs/smartcontractor-public-beta-tester-cohort.md',
  'docs/smartcontractor-public-beta-invite-batches.md',
  'docs/smartcontractor-public-beta-launch-message.md',
  'docs/smartcontractor-public-beta-tester-faq.md',
  'docs/smartcontractor-public-beta-consent-acknowledgement.md',
  'docs/smartcontractor-public-beta-privacy-notice.md',
  'docs/smartcontractor-public-beta-tester-quickstart.md',
  'docs/smartcontractor-public-beta-support-queue.md',
  'docs/smartcontractor-public-beta-known-issues.md',
  'docs/smartcontractor-public-beta-daily-status-template.md',
  'docs/smartcontractor-public-beta-weekly-closeout.md',
  'docs/smartcontractor-public-beta-metrics-snapshot.md',
  'docs/smartcontractor-beta-go-no-go-scorecard.md',
]) assertIncludes(packet, linkedDoc, packetPath);

for (const [content, snippet, file] of [
  [commandBoard, 'SmartContractor Founder Evening Command Board', commandBoardPath],
  [executionPlan, 'SmartContractor Public Beta Founder Execution Plan', executionPlanPath],
  [launchDecision, 'SmartContractor Public Beta Launch Decision Record', launchDecisionPath],
  [cohort, 'SmartContractor Public Beta Tester Cohort Tracker', cohortPath],
  [inviteBatches, 'SmartContractor Public Beta Invite Batch Tracker', inviteBatchesPath],
  [launchMessage, 'SmartContractor Public Beta Launch Message', launchMessagePath],
  [testerFaq, 'SmartContractor Public Beta Tester FAQ', testerFaqPath],
  [consent, 'SmartContractor Public Beta Consent Acknowledgement', consentPath],
  [privacy, 'SmartContractor Public Beta Privacy Notice', privacyPath],
  [quickstart, 'SmartContractor Public Beta Tester Quickstart', quickstartPath],
  [support, 'SmartContractor Public Beta Support Queue', supportPath],
  [knownIssues, 'SmartContractor Public Beta Known Issues', knownIssuesPath],
  [dailyStatus, 'SmartContractor Public Beta Daily Status', dailyStatusPath],
  [weeklyCloseout, 'SmartContractor Public Beta Weekly Closeout', weeklyCloseoutPath],
  [metrics, 'SmartContractor Public Beta Metrics Snapshot', metricsPath],
  [goNoGo, 'SmartContractor Beta Go/No-Go Scorecard', goNoGoPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'public beta first cohort launch packet', contextPath);
assertIncludes(context, 'Public beta hosted URL share stop', contextPath);
assertIncludes(context, 'Public beta tester identity mapping boundary', contextPath);
assertIncludes(context, 'check:public-beta-first-cohort-launch-packet', contextPath);
assertIncludes(backlog, 'Public beta first cohort launch packet', backlogPath);
assertIncludes(backlog, 'Public beta hosted URL share stop', backlogPath);
assertIncludes(backlog, 'Public beta tester identity mapping boundary', backlogPath);
assertIncludes(backlog, 'check:public-beta-first-cohort-launch-packet', backlogPath);
assertIncludes(audit, 'Public beta first cohort launch packet', auditPath);
assertIncludes(audit, 'Public beta hosted URL share stop', auditPath);
assertIncludes(audit, 'Public beta tester identity mapping boundary', auditPath);
assertIncludes(packageJson, '"check:public-beta-first-cohort-launch-packet"', packageJsonPath);
assertIncludes(runner, '"check:public-beta-first-cohort-launch-packet"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('First cohort launch packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_first_cohort_launch_packet: packetPath,
  linked_public_beta_docs_checked: 16,
  first_cohort_size_checked: '3-5',
  live_risk_boundaries_checked: true,
}, null, 2));
