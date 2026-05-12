import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const hookPath = resolve('..', 'docs', 'codex-nonstop-execution-hook.md');

const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const hook = readFileSync(hookPath, 'utf8');

function fail(message) {
  console.error(`Founder action boundary validation failed: ${message}`);
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

function extractSection(content, heading) {
  const start = content.indexOf(heading);
  assert(start !== -1, `${backlogPath} must include section: ${heading}`);

  const rest = content.slice(start);
  const nextHeading = rest.slice(heading.length).match(/\n## /);
  if (!nextHeading) return rest;

  return rest.slice(0, heading.length + nextHeading.index);
}

const founderQueue = extractSection(backlog, '## Founder Action Queue');
const founderItems = founderQueue
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => /^\d+\./.test(line));

assert(founderItems.length >= 6, 'Founder Action Queue must keep concrete founder-owned next steps');

for (const line of founderItems) {
  assert(!/\bDONE\b/i.test(line), `Founder-owned item must not be marked DONE: ${line}`);
}

for (const requiredStep of [
  'deploy platform timing',
  'Supabase Auth founder login test',
  'founder admin activation',
  'strict RLS replacement',
  'attorney and provider review',
  'Microsoft/Azure startup application packet',
]) {
  assertIncludes(founderQueue, requiredStep, `${backlogPath} Founder Action Queue`);
}

for (const boundary of [
  'live Supabase',
  'explicit founder approval',
  'real payment',
  'real loan',
  'legal',
  'service-role',
]) {
  assertIncludes(context, boundary, contextPath);
  assertIncludes(hook, boundary, hookPath);
}

assertIncludes(backlog, '`BLOCKED` - needs founder action', backlogPath);
assertIncludes(backlog, '`REVIEW` - prepared by Codex', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  founder_queue_items_checked: founderItems.length,
  boundary_files_checked: [backlogPath, contextPath, hookPath],
}, null, 2));
