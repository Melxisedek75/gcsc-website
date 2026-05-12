import { readFileSync } from 'node:fs';

const server = readFileSync('server.js', 'utf8');
const smoke = readFileSync('scripts/smoke-auth-ownership.mjs', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const context = readFileSync('../docs/gcsc-active-context.md', 'utf8');
const backlog = readFileSync('../docs/smartcontractor-backlog.md', 'utf8');

function fail(message) {
  console.error(`Beta readiness endpoint validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

for (const snippet of [
  "app.get('/api/admin/beta-readiness'",
  'controlled_beta_readiness',
  'smartcontractor-controlled-user-test-plan.md',
  'smartcontractor-beta-issue-log-template.md',
  'smartcontractor-beta-tester-invite.md',
  'smartcontractor-beta-feedback-synthesis.md',
  'smartcontractor-beta-session-runbook.md',
  'smartcontractor-beta-session-summary-template.md',
  'smartcontractor-beta-decision-log.md',
  'smartcontractor-beta-triage-rubric.md',
  'smartcontractor-beta-issue-lifecycle.md',
  'smartcontractor-beta-go-no-go-scorecard.md',
  'smartcontractor-founder-action-queue.md',
  'document_summary',
  'missing_docs',
  'validation_commands',
  'report_back_template',
  'safe_report_fields',
  'PASS/FAIL/SKIPPED',
  'go_no_go_rules',
  'Automatic NO-GO',
  'tester_day_checklist',
  'Open SmartContractor local demo',
  'issue_intake_fields',
  'safe_reproduction_steps',
  'evidence_retention_policy',
  'Redact screenshots',
  'tester_handoff_packet',
  'smartcontractor-beta-tester-invite.md',
  'session_stop_conditions',
  'Stop the session',
  'post_session_actions',
  'Update the beta decision log',
  'public_beta_exit_criteria',
  'Do not move to public beta',
  'pre_invite_checks',
  'Do not invite testers',
  'invite_message_checklist',
  'no real-money promises',
  'tester_consent_checklist',
  'Tester understands',
  'tester_role_briefing',
  'Homeowner tester',
  'tester_success_signals',
  'Tester can explain',
  'tester_failure_signals',
  'Tester cannot explain',
  'tester_redaction_reminders',
  'Redact names',
  'tester_artifact_naming',
  'YYYY-MM-DD_role_flow_severity_request-id',
  'tester_artifact_index',
  'Artifact index row',
  'tester_artifact_review_queue',
  'Review queue item',
  'tester_artifact_export_guard',
  'Export guard',
  'review_packet',
  'founder_present_tasks',
  'Magic Link founder login',
  'real_money_pilot',
  'blocked_until_founder',
  'Attorney/provider review before real loans',
  'controlled-beta-readiness',
]) {
  assertIncludes(server, snippet, 'server.js');
}

for (const snippet of [
  "app.get('/api/admin/beta-readiness'",
  '/api/admin/beta-readiness',
  'controlled_beta_readiness',
  'real_money_pilot',
  'beta_tester_invite',
  'beta_session_runbook',
  'beta_session_summary',
  'beta_decision_log',
  'beta_triage_rubric',
  'beta_issue_lifecycle',
  'beta_go_no_go_scorecard',
  'founder_action_queue',
  'document_summary',
  'missing_docs',
  'validation_commands',
  'report_back_template',
  'safe_report_fields',
  'PASS/FAIL/SKIPPED',
  'go_no_go_rules',
  'Automatic NO-GO',
  'tester_day_checklist',
  'Open SmartContractor local demo',
  'issue_intake_fields',
  'safe_reproduction_steps',
  'evidence_retention_policy',
  'Redact screenshots',
  'tester_handoff_packet',
  'smartcontractor-beta-tester-invite.md',
  'session_stop_conditions',
  'Stop the session',
  'post_session_actions',
  'Update the beta decision log',
  'public_beta_exit_criteria',
  'Do not move to public beta',
  'pre_invite_checks',
  'Do not invite testers',
  'invite_message_checklist',
  'no real-money promises',
  'tester_consent_checklist',
  'Tester understands',
  'tester_role_briefing',
  'Homeowner tester',
  'tester_success_signals',
  'Tester can explain',
  'tester_failure_signals',
  'Tester cannot explain',
  'tester_redaction_reminders',
  'Redact names',
  'tester_artifact_naming',
  'YYYY-MM-DD_role_flow_severity_request-id',
  'tester_artifact_index',
  'Artifact index row',
  'tester_artifact_review_queue',
  'Review queue item',
  'tester_artifact_export_guard',
  'Export guard',
  'review_packet',
  'founder_present_tasks',
  'Magic Link founder login',
  'smartcontractor-founder-action-queue.md',
  'controlled-beta-readiness',
  'beta_readiness',
]) {
  assertIncludes(smoke, snippet, 'scripts/smoke-auth-ownership.mjs');
}

assert(
  packageJson.scripts?.['check:beta-readiness'] === 'node scripts/validate-beta-readiness-endpoint.mjs',
  'package.json must define check:beta-readiness'
);
assert(
  packageJson.scripts?.check?.includes('npm run check:beta-readiness'),
  'npm run check must include check:beta-readiness'
);

assertIncludes(context, 'beta readiness endpoint', '../docs/gcsc-active-context.md');
assertIncludes(backlog, 'Beta readiness endpoint', '../docs/smartcontractor-backlog.md');

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(server),
  'server.js must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  endpoint: '/api/admin/beta-readiness',
  safety_boundaries_checked: true,
}, null, 2));
