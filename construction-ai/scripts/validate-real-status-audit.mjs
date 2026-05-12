import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

const audit = readFileSync(auditPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');

function fail(message) {
  console.error(`Real status audit validation failed: ${message}`);
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
  '## Bottom Line',
  '## Backlog Count',
  '## Readiness By Launch Level',
  '## What Is Actually Done',
  '## What Is Prepared But Not Safe To Activate Yet',
  '## What Is Still Blocked',
  '## Real Timeline Estimate',
  '## Real Risk Assessment',
  '## Recommended Next 7 Days',
  '## Current Next Best Action',
]) {
  assertIncludes(audit, section, auditPath);
}

for (const readiness of [
  'Local clickable demo | 85-90%',
  'Public beta demo, no real money | 60-70%',
  'Small controlled pilot with real users, no real loan/escrow movement | 45-55%',
  'Real-money construction finance pilot | 25-35%',
  'Native Android/iOS store launch | 20-30%',
  'Mature full platform vision | 10-15%',
]) {
  assertIncludes(audit, readiness, auditPath);
}

for (const contextReadiness of [
  'local clickable demo: 85-90%',
  'public beta demo without real money: 60-70%',
  'small controlled pilot without real money movement: 45-55%',
  'real-money construction finance pilot: 25-35%',
  'native Android/iOS store launch: 20-30%',
  'mature full platform vision: 10-15%',
]) {
  assertIncludes(context, contextReadiness, contextPath);
}

for (const requiredReality of [
  'not yet a public real-money construction finance product',
  '| DONE | 79 |',
  '| REVIEW | 12 |',
  '| BLOCKED | 3 |',
  '| LATER | 2 |',
  '82% is not the same as 82% production-ready',
  'Founder/admin live activation',
  'Strict RLS replacement',
  'Service-role boundary',
  'Payment provider onboarding',
  'Attorney review',
  'Complete Founder Auth Setup',
]) {
  assertIncludes(audit, requiredReality, auditPath);
}

for (const timeline of [
  '3-7 focused days',
  '1-3 weeks',
  '2-4 months minimum',
  '9-18 months',
  '24-36 months',
]) {
  assertIncludes(audit, timeline, auditPath);
}

assertIncludes(context, 'Latest real-status audit', contextPath);
assertIncludes(context, 'Backlog count at latest audit', contextPath);
assertIncludes(backlog, 'Real status audit validator', backlogPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(audit),
  'Real status audit must not contain real secret-looking values'
);

assert(
  [...audit].every((char) => char.charCodeAt(0) <= 127),
  'Real status audit must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  audit: auditPath,
  readiness_levels_checked: 6,
  safety_boundaries_checked: true,
}, null, 2));
