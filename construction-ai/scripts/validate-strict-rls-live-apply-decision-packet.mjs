import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-strict-rls-live-apply-decision-packet.md');
const rlsDraftPath = resolve('..', 'docs', 'smartcontractor-strict-rls-replacement-draft.sql');
const strictReviewPath = resolve('..', 'docs', 'smartcontractor-strict-rls-review.md');
const strictSmokePath = resolve('..', 'docs', 'smartcontractor-strict-admin-smoke-checklist.md');
const authRlsPath = resolve('..', 'docs', 'smartcontractor-auth-rls-plan.md');
const founderLivePacketPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-decision-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Strict RLS live apply decision packet validation failed: ${message}`);
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
const rlsDraft = readRequired(rlsDraftPath);
const strictReview = readRequired(strictReviewPath);
const strictSmoke = readRequired(strictSmokePath);
const authRls = readRequired(authRlsPath);
const founderLivePacket = readRequired(founderLivePacketPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Strict RLS Live Apply Decision Packet',
  'Status: INTERNAL_STRICT_RLS_LIVE_APPLY_DECISION_ONLY',
  'Decision Goal',
  'Source Documents',
  'What This Does Not Approve',
  'Ready State',
  'Not Ready States',
  'Blocked For Live Action',
  'Founder Evidence Record',
  'Live Apply Approval Phrase',
  'Post-Apply Smoke Order',
  'Rollback/Hold Plan',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(packet, section, packetPath);

for (const required of [
  'not approval to run live SQL',
  'not approval to apply strict RLS',
  'not approval to change Supabase settings',
  'not approval to assign admin roles',
  'not approval to deploy production',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'docs/smartcontractor-strict-rls-replacement-draft.sql',
  'docs/smartcontractor-strict-rls-review.md',
  'docs/smartcontractor-strict-admin-smoke-checklist.md',
  'docs/smartcontractor-auth-rls-plan.md',
  'docs/smartcontractor-founder-auth-admin-live-decision-packet.md',
  'READY_TO_REQUEST_STRICT_RLS_LIVE_APPROVAL',
  'NOT_READY',
  'BLOCKED_FOR_LIVE_ACTION',
  'Founder Auth/Admin live activation is complete',
  'founder/admin user can pass strict admin smoke checks',
  'RLS draft checksum/source commit is current',
  'Supabase backups/rollback owner are confirmed by the founder',
  'payment/provider/loan/escrow/token flows remain disabled',
  'selected Supabase project is confirmed',
  'approval is current-thread, standalone, and exact',
  'strict_rls_recorded_at',
  'source_commit',
  'supabase_project_label',
  'founder_admin_smoke_result',
  'rls_draft_reviewed',
  'rollback_owner',
  'no_real_money_flags_confirmed',
  'decision: HOLD, REVIEW, or READY_TO_REQUEST_STRICT_RLS_LIVE_APPROVAL',
  'I approve live strict RLS apply for the reviewed SmartContractor SQL draft only.',
  'This phrase is not approval for admin role assignment, production deploy, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public launch, or destructive data changes.',
  'Run Founder Auth/Admin verification first',
  'Apply the reviewed SQL only in the founder-controlled Supabase SQL editor',
  'Run strict admin smoke checks immediately after apply',
  'Run browser-denied checks for unauthenticated protected routes',
  'Record request IDs and non-secret results',
  'If any protected owner/participant flow fails, classify as HOLD_FOR_RLS_REVIEW',
  'If backend-only tables expose browser policies, classify as BLOCKED_FOR_LIVE_ACTION',
  'Rollback must be founder-controlled and reviewed before live apply',
  'npm run check:strict-rls-live-apply-decision-packet',
  'npm run check:rls-draft',
  'npm run check:strict-admin-smoke',
  'npm run check:founder-auth-admin-live-decision-packet',
  'npm run check:auth',
  'npm run check:strict-gates',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(packet, required, packetPath);

for (const [content, snippet, file] of [
  [rlsDraft, 'SmartContractor strict RLS replacement draft', rlsDraftPath],
  [strictReview, 'admin_memberships', strictReviewPath],
  [strictSmoke, 'SmartContractor Strict Admin Smoke Checklist', strictSmokePath],
  [authRls, 'profiles.auth_user_id', authRlsPath],
  [founderLivePacket, 'SmartContractor Founder Auth/Admin Live Decision Packet', founderLivePacketPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:strict-rls-live-apply-decision-packet';
assertIncludes(context, 'Strict RLS live apply decision packet', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(backlog, 'Strict RLS live apply decision packet', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Strict RLS live apply decision packet', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Strict RLS live apply decision packet must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  strict_rls_live_apply_decision_packet: packetPath,
  live_apply_boundary_checked: true,
  exact_approval_phrase_checked: true,
}, null, 2));
