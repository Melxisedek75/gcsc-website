import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-vercel-postdeploy-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Vercel post-deploy checklist validation failed: ${message}`);
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
  '## Required Local Baseline',
  '## Safe Deployed URL Checks',
  '## Readiness Endpoints',
  '## Supabase Auth Redirect Review',
  '## Stop Conditions',
  '## Founder Next Step',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'npm run check',
  '/api/health',
  '/smartcontractor.html',
  'X-Request-Id',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'SUPABASE_SERVICE_ROLE_KEY',
  'real loans remain disabled',
  'real escrow remains disabled',
  'token collateral settlement remains disabled',
  'production payment capture remains disabled',
  'admin assignment remains founder-controlled',
  'Supabase Auth redirect',
  'admin_memberships',
]) {
  assertIncludes(doc, required, docPath);
}

assertIncludes(backlog, 'Vercel post-deploy checklist', backlogPath);
assertIncludes(context, 'Vercel post-deploy checklist', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(doc),
  'Vercel post-deploy checklist must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  document: docPath,
  safety_boundaries_checked: true,
}, null, 2));
