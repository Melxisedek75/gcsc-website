import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const queuePath = resolve('..', 'docs', 'smartcontractor-founder-action-queue.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Founder action queue validation failed: ${message}`);
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

assert(existsSync(queuePath), `${queuePath} must exist`);

const queue = readFileSync(queuePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Use This Queue When',
  '## Current Founder Actions',
  '## What Codex Can Still Do Without Founder Approval',
  '## Stop Conditions',
  '## Safe Report-Back Format',
]) {
  assertIncludes(queue, section, queuePath);
}

for (const requiredAction of [
  'Decide deploy platform timing',
  'Complete Supabase Auth founder login test',
  'Approve founder admin activation',
  'Review strict RLS replacement',
  'Start legal and provider review',
  'Submit Microsoft/Azure startup application packet',
]) {
  assertIncludes(queue, requiredAction, queuePath);
}

for (const safetyBoundary of [
  'Do not paste service-role keys',
  'database passwords',
  'raw tokens',
  'Keep real payments, real loans, escrow, and token collateral disabled',
  'explicit founder approval',
  'Do not claim guaranteed token price',
  'Do not paste secrets into chat',
]) {
  assertIncludes(queue, safetyBoundary, queuePath);
}

for (const localSafeWork of [
  'validators',
  'CI',
  'local smoke tests',
  'runbooks',
  'draft SQL',
  'smart-contract design docs',
]) {
  assertIncludes(queue, localSafeWork, queuePath);
}

assertIncludes(backlog, 'Founder action queue', backlogPath);
assertIncludes(context, 'Founder action queue', contextPath);
assertIncludes(packageJson, 'check:founder-action-queue', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]/i.test(queue),
  'Founder action queue must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  queue: queuePath,
  safety_boundaries_checked: true,
}, null, 2));
