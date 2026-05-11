import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-legal-financial-review-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const checklist = readFileSync(checklistPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Legal/financial review validation failed: ${message}`);
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
  '## Review Area 1: Contractor Starter Loans',
  '## Review Area 2: Escrow And Milestone Payments',
  '## Review Area 3: Token Collateral',
  '## Review Area 6: AI Risk Scoring',
  '## Review Area 7: Payment Providers',
  '## Founder Review Packet',
  '## Current Recommendation',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const safetyGate of [
  'This is not legal advice',
  'keep loans as `requested`/simulated until legal model is approved',
  'do not claim regulated escrow unless a licensed partner supports it',
  'token collateral remains proposed/manual until reviewed',
  'no automatic liquidation in MVP',
  'AI should recommend, not approve',
  'do not enable production payments until provider terms are reviewed',
  'keep real loans disabled',
  'keep real escrow disabled',
  'keep token collateral disabled',
]) {
  assertIncludes(checklist, safetyGate, checklistPath);
}

for (const riskArea of [
  'lender, broker, marketplace, servicer, or software provider',
  'money transmission',
  'stored value',
  'securities-related',
  'attorney/payment partners',
  'public beta scope with real-money features disabled',
]) {
  assertIncludes(checklist, riskArea, checklistPath);
}

assertIncludes(backlog, 'Legal/financial review checklist', backlogPath);
assertIncludes(backlog, 'Attorney/payment/lending questions are organized', backlogPath);
assertIncludes(context, 'legal review for loans', contextPath);
assertIncludes(context, 'real loans disabled', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role_[a-z0-9]/i.test(checklist),
  'Checklist must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_gates_checked: true,
}, null, 2));
