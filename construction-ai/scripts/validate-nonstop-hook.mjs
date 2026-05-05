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

for (const phrase of [
  'After every completed safe task',
  'immediately choose the next safe task',
  'Required Loop',
  'git status --short',
  'Commit and push',
  'Forbidden Behavior',
  'What next?',
  'I understand',
  'safe follow-up tasks remain',
  'interval: every 1 minute',
]) {
  assertIncludes(hook, phrase, hookPath);
}

for (const stopBoundary of [
  'password',
  'secret',
  'live Supabase',
  'real payment',
  'legal',
]) {
  assertIncludes(hook, stopBoundary, hookPath);
}

assertIncludes(context, 'Codex Nonstop Execution Hook', contextPath);
assertIncludes(context, 'docs/codex-nonstop-execution-hook.md', contextPath);
assertIncludes(backlog, 'Nonstop execution hook', backlogPath);
assertIncludes(backlog, 'heartbeat updated to 1 minute', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  hook: hookPath,
  context_linked: true,
  backlog_linked: true,
}, null, 2));
