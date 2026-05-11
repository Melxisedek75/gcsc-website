import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-vercel-preflight.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Vercel preflight validation failed: ${message}`);
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

const doc = readFileSync(docPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

for (const section of [
  '## Scope',
  '## Recommended First Beta Target',
  '## Founder-Controlled Actions',
  '## Local Checks Before Import',
  '## Vercel Project Settings Draft',
  '## Environment Variables Draft',
  '## Disabled For First Public Beta',
  '## Acceptance Criteria',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'construction-ai',
  'npm run check',
  'server-only environment variables',
  'Supabase Auth redirect',
  'Do not paste',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMARTCONTRACTOR_ROUTE_PROTECTION',
  'real contractor loans',
  'real escrow',
  'token collateral locking',
  'production payment capture',
  'USING true',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(backlog, 'Vercel preflight runbook', backlogPath);
assertIncludes(context, 'Vercel preflight runbook', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(doc),
  'Vercel preflight must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  document: docPath,
  safety_boundaries_checked: true,
}, null, 2));
