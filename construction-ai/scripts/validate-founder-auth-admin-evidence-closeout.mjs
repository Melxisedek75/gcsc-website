import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const closeoutPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-evidence-closeout.md');
const prepPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const packetPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-decision-packet.md');
const draftPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-request-draft.md');
const evidencePath = resolve('..', 'docs', 'smartcontractor-founder-auth-evidence-template.md');
const tonightPath = resolve('..', 'docs', 'smartcontractor-founder-tonight-checklist.md');
const runbookPath = resolve('..', 'docs', 'smartcontractor-founder-admin-activation-runbook.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Founder Auth/Admin evidence closeout validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const closeout = readRequired(closeoutPath);
const prep = readRequired(prepPath);
const packet = readRequired(packetPath);
const draft = readRequired(draftPath);
const evidence = readRequired(evidencePath);
const tonight = readRequired(tonightPath);
const runbook = readRequired(runbookPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Founder Auth/Admin Evidence Closeout',
  'Status: INTERNAL_EVIDENCE_CLOSEOUT_ONLY',
  'Purpose',
  'What This Does Not Approve',
  'Source Documents',
  'Closeout States',
  'Required Evidence Before Live Approval Request',
  'Automatic HOLD Rules',
  'Founder Copy/Paste Closeout',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(closeout, section, closeoutPath);

for (const boundary of [
  'does not approve live Supabase changes',
  'admin membership insert',
  'strict RLS',
  'production deploy',
  'external accounts',
  'real payments',
  'real loans',
  'real escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'legal/provider decisions',
  'public launch',
  'destructive actions',
]) assertIncludes(closeout, boundary, closeoutPath);

for (const state of [
  'READY_TO_REQUEST_LIVE_APPROVAL',
  'NOT_READY',
  'HOLD_FOR_STALE_EVIDENCE',
  'HOLD_FOR_SELECTED_USER_MISMATCH',
  'HOLD_FOR_SECRET_REDACTION',
  'BLOCKED_FOR_LIVE_ACTION',
]) assertIncludes(closeout, state, closeoutPath);

for (const field of [
  'same_browser_magic_link_status',
  'founder_auth_setup_status',
  'selected_auth_user_confirmed',
  'selected_user_confirmed_at',
  'request_id_present',
  'evidence_age_minutes',
  'no_secret_values_recorded',
  'profile_link_status',
  'active_admin_role_visible',
  'live_approval_phrase_status',
]) assertIncludes(closeout, field, closeoutPath);

for (const holdRule of [
  'missing selected user confirmation',
  'missing fresh evidence',
  'missing request ID',
  'missing no-secret status',
  'evidence_age_minutes` more than 30',
  'old screenshot',
  'forwarded Magic Link tab',
  'copied session URL',
  'prior heartbeat evidence',
  'another browser profile/device',
  'selected Auth user not shown',
  'unclear',
  'unexpected',
  'not founder-controlled',
  'Magic Link URL/token',
  'access token',
  'service-role key',
  'database password',
  'raw `.env`',
]) assertIncludes(closeout, holdRule, closeoutPath);

for (const liveBlock of [
  'insert or update admin membership',
  'apply strict RLS',
  'change production deploy settings',
  'change external accounts',
  'enable or route real payments',
  'create real loans',
  'release real escrow',
  'configure repayment routing',
  'settle stablecoin activity',
  'lock token collateral',
  'make legal/provider commitments',
  'launch publicly',
  'perform destructive action',
]) assertIncludes(closeout, liveBlock, closeoutPath);

for (const check of [
  'npm run check:founder-auth-admin-evidence-closeout',
  'npm run check:founder-auth-admin-activation-prep',
  'npm run check:founder-auth-admin-live-decision-packet',
  'npm run check:founder-auth-admin-live-request-draft',
  'npm run check:founder-auth-evidence',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(closeout, check, closeoutPath);

for (const [content, snippet, file] of [
  [prep, 'SmartContractor Founder Auth/Admin Activation Prep', prepPath],
  [packet, 'SmartContractor Founder Auth/Admin Live Decision Packet', packetPath],
  [draft, 'SmartContractor Founder Auth/Admin Live Request Draft', draftPath],
  [evidence, 'SmartContractor Founder Auth Evidence Template', evidencePath],
  [tonight, 'SmartContractor Founder Tonight Checklist', tonightPath],
  [runbook, 'SmartContractor Founder Admin Activation Runbook', runbookPath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:founder-auth-admin-evidence-closeout';

assertIncludes(context, 'Founder Auth/Admin evidence closeout', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Founder Auth/Admin evidence closeout', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Founder Auth/Admin evidence closeout', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(closeout)) {
  fail('Founder Auth/Admin evidence closeout must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_auth_admin_evidence_closeout: closeoutPath,
  local_only: true,
  live_actions_blocked: true,
}, null, 2));
