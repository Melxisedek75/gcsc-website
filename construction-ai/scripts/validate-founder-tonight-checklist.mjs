import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-founder-tonight-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

const checklist = readFileSync(checklistPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

function fail(message) {
  console.error(`Founder tonight checklist validation failed: ${message}`);
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
  '## Goal For Tonight',
  '## Do Not Do Tonight',
  '## Step 1: Start Local Backend',
  '## Step 2: Open SmartContractor MVP',
  '## Step 3: Send Magic Link',
  '## Step 4: Check Founder Auth Setup',
  '## Step 5: Report Back To Codex',
  '## Step 6: What Codex Can Do After That',
  '## Acceptance Check',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const requiredStep of [
  'cd C:\\gcsc\\construction-ai',
  'npm start',
  'http://localhost:3001/smartcontractor.html',
  'http://localhost:3002/smartcontractor.html',
  'Send Magic Link',
  'Check Founder Auth Setup',
  'Founder Auth Setup ready',
]) {
  assertIncludes(checklist, requiredStep, checklistPath);
}

for (const safetyBoundary of [
  'paste passwords',
  'service-role keys',
  'apply strict RLS yet',
  'approve real loans',
  'release real escrow or payments',
  'activate token collateral',
  'no real loan',
  'no real payment',
]) {
  assertIncludes(checklist, safetyBoundary, checklistPath);
}

assertIncludes(backlog, 'Founder tonight checklist', backlogPath);
assertIncludes(context, 'Founder evening checklist', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(checklist),
  'Founder tonight checklist must not contain real secret-looking values'
);

assert(
  [...checklist].every((char) => char.charCodeAt(0) <= 127),
  'Founder tonight checklist must stay ASCII-clean for Windows terminal readability'
);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
