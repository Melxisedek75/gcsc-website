import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const templatePath = resolve('..', 'docs', 'smartcontractor-founder-auth-evidence-template.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const template = readFileSync(templatePath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Founder auth evidence template validation failed: ${message}`);
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
  '## Session Evidence',
  '## Expected Ready State Before Admin Activation',
  '## If Profile Is Not Linked',
  '## If Admin Role Already Exists',
  '## Codex Read-Only Verification Notes',
  '## Acceptance Check',
]) {
  assertIncludes(template, section, templatePath);
}

for (const requiredField of [
  'Founder Auth Setup date:',
  'Local URL used:',
  'Backend port:',
  'Magic Link email received:',
  'Magic Link opened in same browser:',
  'Authenticated:',
  'Profile linked:',
  'Admin roles shown:',
  'Visible non-secret error text:',
  'Founder Auth Setup ready',
]) {
  assertIncludes(template, requiredField, templatePath);
}

for (const safetyBoundary of [
  'Do not record',
  'Supabase access token',
  'Magic Link URL',
  'service-role key',
  'database password',
  'strict RLS',
  'real loans',
  'real escrow',
  'real payment release',
  'token collateral',
  'read-only verification',
]) {
  assertIncludes(template, safetyBoundary, templatePath);
}

assertIncludes(backlog, 'Founder Auth evidence template', backlogPath);
assertIncludes(context, 'Founder Auth evidence template', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(template),
  'Founder auth evidence template must not contain real secret-looking values'
);

assert(
  [...template].every((char) => char.charCodeAt(0) <= 127),
  'Founder auth evidence template must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  template: templatePath,
  safety_boundaries_checked: true,
}, null, 2));
