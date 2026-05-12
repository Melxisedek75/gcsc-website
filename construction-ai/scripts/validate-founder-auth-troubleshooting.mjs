import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-founder-auth-troubleshooting.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const doc = readFileSync(docPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Founder auth troubleshooting validation failed: ${message}`);
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
  '## Safety Rules',
  '## Symptom: Browser Cannot Open SmartContractor',
  '## Symptom: Port Already In Use',
  '## Symptom: Magic Link Email Does Not Arrive',
  '## Symptom: Magic Link Opens Wrong Browser Or Wrong Page',
  '## Symptom: Session Is Invalid Or Expired',
  '## Symptom: Authenticated Yes, Profile Linked No',
  '## Symptom: Admin Roles None',
  '## Symptom: Supabase Not Configured',
  '## Symptom: Founder Auth Setup Button Does Nothing',
  '## Success Message',
]) {
  assertIncludes(doc, section, docPath);
}

for (const requiredStep of [
  'cd C:\\gcsc\\construction-ai',
  'npm start',
  'http://localhost:3001/smartcontractor.html',
  'http://localhost:3002/smartcontractor.html',
  'EADDRINUSE',
  '429',
  'Invalid or expired session',
  'authenticated: yes',
  'profile linked: no',
  'admin roles: none',
  'Founder Auth Setup ready',
]) {
  assertIncludes(doc, requiredStep, docPath);
}

for (const safetyBoundary of [
  'Do not paste',
  'Supabase access tokens',
  'service-role keys',
  'Never paste the Magic Link into chat',
  'Do not activate tonight',
  'strict RLS',
  'real loans',
  'real escrow',
  'real payment release',
  'token collateral',
]) {
  assertIncludes(doc, safetyBoundary, docPath);
}

assertIncludes(backlog, 'Founder Auth troubleshooting', backlogPath);
assertIncludes(context, 'Founder Auth troubleshooting', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(doc),
  'Troubleshooting doc must not contain real secret-looking values'
);

assert(
  [...doc].every((char) => char.charCodeAt(0) <= 127),
  'Troubleshooting doc must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  troubleshooting: docPath,
  safety_boundaries_checked: true,
}, null, 2));
