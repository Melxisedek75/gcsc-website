import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const hookPath = resolve('..', 'docs', 'codex-nonstop-execution-hook.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

const hook = readFileSync(hookPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');

function fail(message) {
  console.error(`Nonstop hook validation failed: ${message}`);
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

function assertOrdered(content, snippets, file) {
  let cursor = -1;
  for (const snippet of snippets) {
    const next = content.toLowerCase().indexOf(snippet.toLowerCase(), cursor + 1);
    assert(next > cursor, `${file} must keep required loop order: ${snippet}`);
    cursor = next;
  }
}

for (const phrase of [
  'After every completed safe task',
  'immediately choose the next safe task',
  'Required Loop',
  'Read `docs/codex-nonstop-execution-hook.md`',
  'Overnight Worker Automation',
  'gcsc-hourly-autonomous-builder',
  'every 1 hour',
  'git status --short',
  'Commit and push',
  'Forbidden Behavior',
  'Silent Background Mode',
  'Do not narrate routine file reads',
  'Use tool calls directly',
  'Keep mandatory heartbeat XML/final status concise',
  'Founder-Present Evening Mode',
  'After 17:00 founder local time',
  'stop the old monotone micro-validator loop',
  'Wait for the founder',
  'silent worker mode',
  'do not write progress chatter',
  'status notes only for blocked',
  'keep commits scoped',
  'What next?',
  'I understand',
  'safe follow-up tasks remain',
  'interval: every 1 minute',
]) {
  assertIncludes(hook, phrase, hookPath);
}

assertOrdered(hook, [
  'Read `docs/gcsc-active-context.md`',
  'Read `docs/codex-nonstop-execution-hook.md`',
  'Read `docs/smartcontractor-backlog.md`',
  'Run `git status --short`',
  'Pick the next unblocked item',
  'Implement a small scoped change',
  'Run relevant checks',
  'Update docs/backlog/context',
  'Commit and push only the scoped files',
  'Immediately repeat from step 1',
], hookPath);

for (const step of [
  '1. Read `docs/gcsc-active-context.md`.',
  '2. Read `docs/codex-nonstop-execution-hook.md`.',
  '3. Read `docs/smartcontractor-backlog.md`.',
  '4. Run `git status --short`.',
  '5. Pick the next unblocked item that can be done locally and safely.',
  '6. Implement a small scoped change.',
  '7. Run relevant checks.',
  '8. Update docs/backlog/context.',
  '9. Commit and push only the scoped files.',
  '10. Immediately repeat from step 1 if another safe item exists.',
]) {
  assertIncludes(hook, step, hookPath);
}

for (const stopBoundary of [
  'password, API key, seed phrase, private key, database password, service-role key, or other secret',
  'external account login or external account setting change',
  'live Supabase migration or live production database change without explicit founder approval',
  'real payment, real loan, real escrow, real token collateral, or money movement',
  'legal/attorney decision',
  'founder business decision that cannot be inferred safely',
]) {
  assertIncludes(hook, stopBoundary, hookPath);
}

for (const forbiddenResponse of [
  '"I understand"',
  '"I will continue"',
  '"What next?"',
  '"Tell me what to do"',
  'a final report when safe follow-up tasks remain',
  'If Codex writes "I will do X", Codex must immediately perform a tool action for X.',
]) {
  assertIncludes(hook, forbiddenResponse, hookPath);
}

for (const safeQueueStep of [
  '1. tests and validators;',
  '2. CI/build safety;',
  '3. local backend/frontend improvements;',
  '4. documentation/runbooks;',
  '5. architecture drafts;',
  '6. mobile/PWA readiness;',
  '7. smart contract design drafts;',
  '8. deployment preparation that does not touch external accounts.',
]) {
  assertIncludes(hook, safeQueueStep, hookPath);
}

assertOrdered(hook, [
  '1. Magic Link founder login.',
  '2. Create or link founder SmartContractor profile.',
  '3. Explicitly approve adding founder `auth_user_id` to live `admin_memberships`.',
  '4. Only after that, strict admin smoke tests with local ENV token.',
  'Until then, Codex should continue local safe prep and validation work.',
], hookPath);

assertOrdered(hook, [
  '## Founder-Present Evening Mode',
  'After 17:00 founder local time',
  'Do not continue small repetitive CI/backlog/audit evidence work after 17:00',
  'Notify briefly that founder-present evening mode is active.',
  'Wait for the founder',
  'Preferred evening focus',
], hookPath);

assertOrdered(hook, [
  '## Current App Automation',
  'id: `gcsc-nonstop-next-task-hook`',
  'name: `GCSC nonstop next task hook`',
  'interval: every 1 minute',
  'purpose: wake this thread and force the next safe roadmap action',
  'target thread must be the current GCSC/SmartContractor work thread',
  'automation prompt must remain readable UTF-8, not mojibake/corrupted text',
  'health check: `npm run check:automation-health`',
], hookPath);

assertOrdered(hook, [
  'Important limitation: the Codex app heartbeat supports minute-based wakeups',
  'heartbeat wakes the thread every 1 minute;',
  'once awake, Codex must continue the safe-task loop inside the same run',
  'after a scoped task is finished, Codex should immediately repeat the loop when feasible.',
], hookPath);

assertOrdered(hook, [
  '## Overnight Worker Automation',
  'id: `gcsc-hourly-autonomous-builder`',
  'name: `GCSC hourly autonomous builder`',
  'interval: every 1 hour',
  'workspace: `C:\\gcsc`',
  'purpose: run as a standalone local workspace job',
], hookPath);

assertOrdered(hook, [
  'This cron worker must obey the same safety boundaries:',
  'no secrets;',
  'no external account changes;',
  'no live Supabase changes without explicit approval;',
  'no real payments, loans, escrow, or token collateral actions;',
  'no legal decisions.',
], hookPath);

assertOrdered(hook, [
  'This cron worker must also use silent worker mode:',
  'do not write progress chatter;',
  'create status notes only for blocked/review/live-risk states or requested reports;',
  'keep commits scoped.',
  'If it finds only blocked/review/live-risk work, it should write a short status note under `docs/autonomous-status/` and commit/push that note.',
], hookPath);

assertIncludes(context, 'Codex Nonstop Execution Hook', contextPath);
assertIncludes(context, 'docs/codex-nonstop-execution-hook.md', contextPath);
assertIncludes(context, 'gcsc-nonstop-next-task-hook', contextPath);
assertIncludes(context, 'gcsc-hourly-autonomous-builder', contextPath);
assertIncludes(context, 'nonstop required-loop numbering guard', contextPath);
assertIncludes(context, 'nonstop blocked-boundary exact wording guard', contextPath);
assertIncludes(context, 'nonstop current-app automation exact wording guard', contextPath);
assertIncludes(context, 'nonstop current-app automation prompt encoding guard', contextPath);
assertIncludes(context, 'nonstop heartbeat limitation exact wording guard', contextPath);
assertIncludes(context, 'nonstop overnight worker exact wording guard', contextPath);
assertIncludes(context, 'nonstop overnight worker safety exact wording guard', contextPath);
assertIncludes(context, 'nonstop overnight worker silent-mode exact wording guard', contextPath);
assertIncludes(context, 'nonstop automation-health doc-link guard', contextPath);
assertIncludes(context, 'nonstop automation-health JSON output guard', contextPath);
assertIncludes(context, 'automation health target-thread doc-link guard', contextPath);
assertIncludes(backlog, 'Nonstop execution hook', backlogPath);
assertIncludes(backlog, 'gcsc-nonstop-next-task-hook', backlogPath);
assertIncludes(backlog, 'Overnight autonomous worker', backlogPath);
assertIncludes(backlog, 'Nonstop required-loop numbering guard', backlogPath);
assertIncludes(backlog, 'Nonstop blocked-boundary exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop current-app automation exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop current-app automation prompt encoding guard', backlogPath);
assertIncludes(backlog, 'Nonstop heartbeat limitation exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop overnight worker exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop overnight worker safety exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop overnight worker silent-mode exact wording guard', backlogPath);
assertIncludes(backlog, 'Nonstop automation-health doc-link guard', backlogPath);
assertIncludes(backlog, 'Nonstop automation-health JSON output guard', backlogPath);
assertIncludes(backlog, 'Automation health target-thread doc-link guard', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  hook: hookPath,
  context_linked: true,
  backlog_linked: true,
  numbered_steps_checked: 10,
  stop_boundaries_checked: 6,
  forbidden_responses_checked: 6,
  safe_queue_steps_checked: 8,
  blocked_boundary_steps_checked: 4,
  blocked_boundary_hold_checked: true,
  current_app_automation_fields_checked: 7,
  heartbeat_limitation_steps_checked: 3,
  overnight_worker_fields_checked: 5,
  overnight_worker_safety_boundaries_checked: 5,
  overnight_worker_silent_mode_steps_checked: 5,
  automation_health_doc_links_checked: true,
  automation_health_json_output_checked: true,
}, null, 2));
