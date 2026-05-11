import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-vercel-env-matrix.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Vercel env matrix validation failed: ${message}`);
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
  '## Demo-Safe Variables',
  '## Founder-Only Secret Variables',
  '## Must Stay Disabled For First Beta',
  '## Safe Vercel Setup Order',
  '## Acceptance Criteria',
]) {
  assertIncludes(doc, section, docPath);
}

for (const variable of [
  'PUBLIC_SITE_URL',
  'ALLOWED_ORIGINS',
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SMARTCONTRACTOR_AUTH_MODE',
  'SMARTCONTRACTOR_ROUTE_PROTECTION',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE',
  'GCSC_XPR_RECEIVER_ACCOUNT',
  'METAL_PAY_CONNECT_ENV',
  'SUPABASE_SERVICE_ROLE_KEY',
  'METAL_PAY_CONNECT_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'PAYPAL_CLIENT_SECRET',
  'COINBASE_COMMERCE_API_KEY',
  'BTCPAY_API_KEY',
]) {
  assertIncludes(doc, variable, docPath);
}

for (const boundary of [
  'Do not paste',
  'Server-side only',
  'Never expose to browser code',
  'real contractor loans',
  'real escrow',
  'automatic payment release',
  'token collateral locking',
  'production payment capture',
  'USING true',
]) {
  assertIncludes(doc, boundary, docPath);
}

assertIncludes(backlog, 'Vercel environment matrix', backlogPath);
assertIncludes(context, 'Vercel environment matrix', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(doc),
  'Vercel env matrix must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  document: docPath,
  safety_boundaries_checked: true,
}, null, 2));
