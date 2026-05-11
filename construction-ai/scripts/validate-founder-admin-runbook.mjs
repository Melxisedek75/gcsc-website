import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const runbookPath = resolve('..', 'docs', 'smartcontractor-founder-admin-activation-runbook.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const runbook = readFileSync(runbookPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Founder admin runbook validation failed: ${message}`);
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

for (const section of [
  '## Current State',
  '## What Must Be True First',
  '## Founder Steps In The Browser',
  '## Codex Read-Only Verification',
  '## Live Activation SQL Template',
  '## Post-Activation Checks',
  '## Rollback',
  '## Safety Boundaries',
  '## Acceptance Check',
]) {
  assertIncludes(runbook, section, runbookPath);
}

for (const requiredSnippet of [
  'founder approval',
  'Magic Link',
  'admin_memberships',
  'Do not paste the access token into chat',
  'SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN',
  'role = \'founder\'',
  'status = \'active\'',
]) {
  assertIncludes(runbook, requiredSnippet, runbookPath);
}

for (const blockedRisk of [
  'does not approve real loans',
  'does not release escrow or payments',
  'does not enable strict RLS by itself',
  'does not expose service-role keys',
]) {
  assertIncludes(runbook, blockedRisk, runbookPath);
}

assertIncludes(backlog, 'Founder admin activation runbook', backlogPath);
assertIncludes(context, 'Founder admin activation runbook', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(runbook),
  'Runbook must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  runbook: runbookPath,
  checks: ['structure', 'safety-boundaries', 'cross-doc-links'],
}, null, 2));
