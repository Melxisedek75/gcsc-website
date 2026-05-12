import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-strict-admin-smoke-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const checklist = readFileSync(checklistPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Strict admin smoke checklist validation failed: ${message}`);
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
  '## Safety Boundary',
  '## Preconditions',
  '## Local Backend Preflight',
  '## Optional Real Founder Token Smoke',
  '## Failure Response',
  '## Acceptance Check',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const requiredSnippet of [
  'docs/smartcontractor-founder-auth-evidence-template.md',
  'docs/smartcontractor-founder-admin-activation-runbook.md',
  'npm run check:auth',
  'npm run check:strict-gates',
  'SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN',
  'SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER',
  'Remove-Item Env:\\SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN',
  'Remove-Item Env:\\SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER',
  '/api/admin/me',
  'Request ID if visible:',
]) {
  assertIncludes(checklist, requiredSnippet, checklistPath);
}

for (const safetyBoundary of [
  'Do not paste or record',
  'Supabase access token',
  'Magic Link URL',
  'service-role key',
  'database password',
  'strict RLS apply',
  'real contractor loans',
  'real escrow',
  'real payment release',
  'token collateral',
  'legal or financial launch decisions',
]) {
  assertIncludes(checklist, safetyBoundary, checklistPath);
}

assertIncludes(backlog, 'Strict admin smoke checklist', backlogPath);
assertIncludes(context, 'Strict admin smoke checklist', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(checklist),
  'Checklist must not contain real secret-looking values'
);

assert(
  !/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/.test(checklist),
  'Checklist must not contain JWT-looking token values'
);

assert(
  [...checklist].every((char) => char.charCodeAt(0) <= 127),
  'Checklist must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));

