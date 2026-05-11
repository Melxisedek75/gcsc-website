import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-mobile-release-evidence.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Mobile release evidence validation failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const doc = read(docPath);
const backlog = read(backlogPath);
const context = read(contextPath);

for (const section of [
  '## Scope',
  '## Evidence Folder',
  '## Summary Template',
  '## Pass Criteria',
  '## Founder Action Step',
]) {
  assertIncludes(doc, section, docPath);
}

for (const required of [
  'npm run check',
  'PWA installability notes',
  'mobile viewport screenshots',
  'offline fallback',
  'Founder Action Center',
  'docs/autonomous-status/mobile-release-evidence-YYYYMMDD-HHMMSS/',
  'Do not commit bulky screenshots by default',
  'No live system changes are made',
]) {
  assertIncludes(doc, required, docPath);
}

for (const blockedRisk of [
  'Google Play Console',
  'App Store Connect',
  'production signing keys',
  'live Supabase migrations',
  'RLS replacement',
  'admin role assignment',
  'real payment capture',
  'real loan origination',
  'escrow release',
  'automatic repayment',
  'token collateral lock',
  'liquidation',
]) {
  assertIncludes(doc, blockedRisk, docPath);
}

for (const secretBoundary of [
  'tokens',
  'cookies',
  'API keys',
  'passwords',
  'seed phrases',
  'service-role keys',
  'private keys',
  'raw payment credentials',
]) {
  assertIncludes(doc, secretBoundary, docPath);
}

const forbiddenPatterns = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^<\s]/,
  /STRIPE_SECRET_KEY\s*=\s*[^<\s]/,
  /METAL_PAY_CONNECT_API_KEY\s*=\s*[^<\s]/,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /sk_live_[a-z0-9]/i,
  /xox[baprs]-[0-9]/i,
  /seed phrase\s*:/i,
  /password\s*:/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) {
    fail(`Evidence doc contains forbidden secret-like value: ${pattern}`);
  }
}

assertIncludes(backlog, 'Mobile release evidence bundle', backlogPath);
assertIncludes(backlog, 'Mobile release evidence validator', backlogPath);
assertIncludes(context, 'mobile release evidence', contextPath);

console.log(JSON.stringify({
  status: 'passed',
  document: docPath,
  safety_boundaries_checked: true,
}, null, 2));
