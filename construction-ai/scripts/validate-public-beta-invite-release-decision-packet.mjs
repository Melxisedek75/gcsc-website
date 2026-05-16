import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-release-decision-packet.md');
const firstCohortPath = resolve('..', 'docs', 'smartcontractor-public-beta-first-cohort-launch-packet.md');
const inviteBatchesPath = resolve('..', 'docs', 'smartcontractor-public-beta-invite-batches.md');
const testerInvitePath = resolve('..', 'docs', 'smartcontractor-beta-tester-invite.md');
const publicBetaReviewPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const deployPrepPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const envMapPath = resolve('..', 'docs', 'smartcontractor-deployment-founder-env-map.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Public beta invite release decision packet validation failed: ${message}`);
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
const firstCohort = readRequired(firstCohortPath);
const inviteBatches = readRequired(inviteBatchesPath);
const testerInvite = readRequired(testerInvitePath);
const publicBetaReview = readRequired(publicBetaReviewPath);
const deployPrep = readRequired(deployPrepPath);
const envMap = readRequired(envMapPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packageJsonPath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Public Beta Invite Release Decision Packet',
  'Status: INTERNAL_PUBLIC_BETA_INVITE_RELEASE_DECISION_ONLY',
  'Decision Goal',
  'Source Documents',
  'What This Does Not Approve',
  'Ready State',
  'Not Ready States',
  'Blocked For Live Action',
  'Founder Evidence Record',
  'Invite Release Approval Phrase',
  'Invite Batch Rules',
  'Safe Send/Hold Sequence',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(packet, section, packetPath);

for (const required of [
  'not approval to send tester invites',
  'not approval to share a public beta URL',
  'not approval to change Vercel, GitHub Pages, Namecheap, Supabase, DNS, Auth redirects, payment providers, app stores, or external account settings',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch',
  'READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE',
  'NOT_READY',
  'BLOCKED_FOR_LIVE_ACTION',
  'founder-controlled deployed URL smoke evidence exists',
  'public beta URL smoke evidence records app shell, /api/health, security headers, request ID, Auth redirect status, no-real-money banner, disabled payment/loan actions, result, and rollback_or_hold_decision',
  'first tester wave remains 3-5 people',
  'tester identities and private contact details stay outside tracked repo docs',
  'tester codes are used instead of names, emails, phones, addresses, or account IDs',
  'support intake and issue logs use redacted request IDs or tester codes only',
  'no-real-money scope is visible in the invite',
  'invite_release_recorded_at',
  'source_commit',
  'public_beta_url_label',
  'smoke_evidence_id',
  'tester_batch_id',
  'tester_count',
  'redaction_status',
  'support_owner',
  'rollback_or_hold_owner',
  'decision: HOLD, REVIEW, or READY_TO_REQUEST_PUBLIC_BETA_INVITE_RELEASE',
  'I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.',
  'This phrase is not approval for production launch, public announcement, DNS changes, Supabase Auth redirect changes, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, app store release, legal/provider commitments, or adding unreviewed testers.',
  'Batch 1 is limited to 3-5 testers',
  'Any tester outside the reviewed tester-code list defaults to HOLD_FOR_TESTER_REVIEW',
  'If the URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, the batch returns to HOLD_FOR_RESMOKE',
  'Do not paste tester private identity/contact maps into tracked docs, chat, screenshots, or issue logs',
  'npm run check:public-beta-invite-release-decision-packet',
  'npm run check:public-beta-first-cohort-launch-packet',
  'npm run check:public-beta-invite-batches',
  'npm run check:beta-tester-invite',
  'npm run check:deployment-decision-prep',
  'npm run check:deployment-founder-env-map',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(packet, required, packetPath);

for (const linkedDoc of [
  'docs/smartcontractor-public-beta-first-cohort-launch-packet.md',
  'docs/smartcontractor-public-beta-invite-batches.md',
  'docs/smartcontractor-beta-tester-invite.md',
  'docs/smartcontractor-public-beta-review-packet.md',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-deployment-founder-env-map.md',
]) assertIncludes(packet, linkedDoc, packetPath);

for (const [content, snippet, file] of [
  [firstCohort, 'SmartContractor Public Beta First Cohort Launch Packet', firstCohortPath],
  [inviteBatches, 'SmartContractor Public Beta Invite Batch Tracker', inviteBatchesPath],
  [testerInvite, 'SmartContractor Beta Tester Invite', testerInvitePath],
  [publicBetaReview, 'SmartContractor Public Beta Review Packet', publicBetaReviewPath],
  [deployPrep, 'SmartContractor Deployment Decision Prep', deployPrepPath],
  [envMap, 'SmartContractor Deployment Founder Environment Map', envMapPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Public beta invite release decision packet', contextPath);
assertIncludes(context, 'check:public-beta-invite-release-decision-packet', contextPath);
assertIncludes(backlog, 'Public beta invite release decision packet', backlogPath);
assertIncludes(backlog, 'check:public-beta-invite-release-decision-packet', backlogPath);
assertIncludes(audit, 'Public beta invite release decision packet', auditPath);
assertIncludes(packageJson, '"check:public-beta-invite-release-decision-packet"', packageJsonPath);
assertIncludes(runner, '"check:public-beta-invite-release-decision-packet"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Invite release decision packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_beta_invite_release_decision_packet: packetPath,
  linked_docs_checked: 6,
  first_batch_size_checked: '3-5',
  live_risk_boundaries_checked: true,
}, null, 2));
