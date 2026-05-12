import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const planPath = resolve('..', 'docs', 'smartcontractor-controlled-user-test-plan.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const plan = readFileSync(planPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Controlled user test plan validation failed: ${message}`);
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
  '## Test Roles',
  '## Test Scenario 1: Homeowner Job',
  '## Test Scenario 2: Contractor Bid And Starter Loan',
  '## Test Scenario 3: Milestone And Payment Intent',
  '## Test Scenario 4: Dispute And Peer Review',
  '## Test Scenario 5: Founder/Admin Review',
  '## Evidence To Record',
  '## Exit Criteria',
  '## Next Step After Passing',
]) {
  assertIncludes(plan, section, planPath);
}

for (const requiredSnippet of [
  'real contractor loans',
  'real escrow',
  'automatic payment release',
  'token collateral',
  'production payment provider mode',
  'Homeowner tester',
  'Contractor tester',
  'Peer reviewer tester',
  'Founder/admin',
  'simulated starter loan',
  'payment intent ownership fields',
  'peer review is advisory',
  'Admin / Risk Console',
  'Request ID if visible:',
  'no real money',
]) {
  assertIncludes(plan, requiredSnippet, planPath);
}

for (const forbiddenPattern of [
  /sk_live_[a-z0-9]/i,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /xox[baprs]-[0-9]/i,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
]) {
  assert(!forbiddenPattern.test(plan), 'Plan must not contain real secret-looking values');
}

assertIncludes(backlog, 'Controlled user test plan', backlogPath);
assertIncludes(context, 'Controlled user test plan', contextPath);

assert(
  [...plan].every((char) => char.charCodeAt(0) <= 127),
  'Plan must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  plan: planPath,
  safety_boundaries_checked: true,
}, null, 2));

