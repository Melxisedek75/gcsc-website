import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const draftPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-request-draft.md');
const packetPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-live-decision-packet.md');
const prepPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const runbookPath = resolve('..', 'docs', 'smartcontractor-founder-admin-activation-runbook.md');
const evidencePath = resolve('..', 'docs', 'smartcontractor-founder-auth-evidence-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Founder Auth/Admin live request draft validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const draft = readRequired(draftPath);
const packet = readRequired(packetPath);
const prep = readRequired(prepPath);
const runbook = readRequired(runbookPath);
const evidence = readRequired(evidencePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Founder Auth/Admin Live Request Draft',
  'Purpose',
  'Required Current Evidence',
  'Request Draft Template',
  'Allowed Codex Scope After Approval',
  'Blocked Scope',
  'Recheck Before Use',
  'Required Checks',
]) assertIncludes(draft, section, draftPath);

for (const required of [
  'INTERNAL_REQUEST_DRAFT_ONLY',
  'not approval to run live SQL',
  'not approval to assign a founder/admin role',
  'not approval to apply strict RLS',
  'not approval to change Supabase settings',
  'not approval to deploy production',
  'not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral',
  'READY_TO_REQUEST_LIVE_APPROVAL',
  'report_back_recorded_at',
  'local_check_time',
  'selected_user_confirmed_at',
  'request_id_present',
  'evidence_age_minutes',
  'Authenticated: yes',
  'Profile linked: yes',
  'Admin roles shown: none',
  'Selected Auth user confirmed on founder screen: yes',
  'I approve live founder admin activation for the verified founder Auth user.',
  'This approval is only for preparing and executing the founder admin membership activation request for the verified founder Auth user.',
  'This approval is not approval for strict RLS, production deploy, payment/provider setup, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public launch, or destructive action.',
  'Codex may prepare the final SQL/request draft from docs/smartcontractor-founder-admin-activation-runbook.md',
  'Codex may run local validators and read-only checks',
  'Codex must stop before asking for or handling service-role keys, tokens, passwords, Magic Link URLs, raw .env values, or direct Supabase dashboard access in chat',
  'Strict RLS stays separate',
  'Production deploy stays separate',
  'Payment/provider setup stays separate',
  'Real loan, escrow, repayment routing, stablecoin settlement, and token collateral stay separate',
  'Legal/provider commitments stay separate',
  'Public launch stays separate',
  'If evidence_age_minutes is more than 30, the request draft returns to NOT_READY',
  'npm run check:founder-auth-admin-live-request-draft',
  'npm run check:founder-auth-admin-live-decision-packet',
  'npm run check:founder-auth-admin-activation-prep',
  'npm run check:founder-admin-runbook',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(draft, required, draftPath);

for (const [content, snippet, file] of [
  [packet, 'SmartContractor Founder Auth/Admin Live Decision Packet', packetPath],
  [prep, 'SmartContractor Founder Auth/Admin Activation Prep', prepPath],
  [runbook, 'SmartContractor Founder Admin Activation Runbook', runbookPath],
  [evidence, 'SmartContractor Founder Auth Evidence Template', evidencePath],
]) assertIncludes(content, snippet, file);

const scriptName = 'check:founder-auth-admin-live-request-draft';

assertIncludes(context, 'Founder Auth/Admin live request draft', contextPath);
assertIncludes(context, scriptName, contextPath);
assertIncludes(backlog, 'Founder Auth/Admin live request draft', backlogPath);
assertIncludes(backlog, scriptName, backlogPath);
assertIncludes(audit, 'Founder Auth/Admin live request draft', auditPath);
assertIncludes(packageJson, `"${scriptName}"`, packagePath);
assertIncludes(runner, `"${scriptName}"`, runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(draft)) {
  fail('Founder Auth/Admin live request draft must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_auth_admin_live_request_draft: draftPath,
  approval_phrase_checked: true,
  separate_scope_boundaries_checked: true,
}, null, 2));
