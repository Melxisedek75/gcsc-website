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

assertIncludes(context, 'Codex Nonstop Execution Hook', contextPath);
assertIncludes(context, 'docs/codex-nonstop-execution-hook.md', contextPath);
assertIncludes(context, 'gcsc-nonstop-next-task-hook', contextPath);
assertIncludes(context, 'gcsc-hourly-autonomous-builder', contextPath);
assertIncludes(context, 'nonstop required-loop numbering guard', contextPath);
assertIncludes(backlog, 'Nonstop execution hook', backlogPath);
assertIncludes(backlog, 'gcsc-nonstop-next-task-hook', backlogPath);
assertIncludes(backlog, 'Overnight autonomous worker', backlogPath);
assertIncludes(backlog, 'Nonstop required-loop numbering guard', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  hook: hookPath,
  context_linked: true,
  backlog_linked: true,
  numbered_steps_checked: 10,
  stop_boundaries_checked: 6,
  forbidden_responses_checked: 6,
  safe_queue_steps_checked: 8,
}, null, 2));
