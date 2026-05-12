import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'smartcontractor-beta-issue-log-template.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const template = readFileSync(templatePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Beta issue log template validation failed: ${message}`);
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
  '## Issue Entry Template',
  '## Severity Guide',
  '## Live-Risk Triage',
  '## Retest Checklist',
  '## Exit Criteria',
]) {
  assertIncludes(template, section, templatePath);
}

for (const field of [
  'Issue ID:',
  'Tester role:',
  'Environment:',
  'Steps to reproduce:',
  'Expected result:',
  'Actual result:',
  'Visible non-secret error:',
  'Request ID if visible:',
  'Severity: P0/P1/P2/P3',
  'Live-risk category:',
  'Contains secrets or private data: no',
  'Real money involved: no',
]) {
  assertIncludes(template, field, templatePath);
}

for (const safetyBoundary of [
  'Supabase access tokens',
  'Magic Link URLs',
  'service-role keys',
  'database passwords',
  'private keys or seed phrases',
  'real loans',
  'real escrow',
  'real payment release',
  'token collateral',
  'strict RLS apply',
  'production payment mode',
]) {
  assertIncludes(template, safetyBoundary, templatePath);
}

assertIncludes(backlog, 'Beta issue log template', backlogPath);
assertIncludes(context, 'Beta issue log template', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(template),
  'Template must not contain real secret-looking values'
);

assert(
  [...template].every((char) => char.charCodeAt(0) <= 127),
  'Template must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  template: templatePath,
  safety_boundaries_checked: true,
}, null, 2));

