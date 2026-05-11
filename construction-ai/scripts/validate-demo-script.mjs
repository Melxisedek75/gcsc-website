import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const demoScriptPath = resolve('..', 'docs', 'smartcontractor-demo-script.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`SmartContractor demo script validation failed: ${message}`);
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

for (const file of [demoScriptPath, backlogPath, contextPath]) {
  assert(existsSync(file), `Missing required file: ${file}`);
}

const demoScript = readFileSync(demoScriptPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

for (const section of [
  '## Before The Demo',
  '## Demo Story',
  '## 5-Minute Walkthrough',
  '## Strong Closing',
  '## Demo Safety Notes',
]) {
  assertIncludes(demoScript, section, demoScriptPath);
}

for (const requiredStep of [
  'Homeowner Creates A Job',
  'Contractor Submits A Bid',
  'Contractor Requests Starter Loan',
  'Milestone Payment Repays The Loan',
  'Payment Router Shows Multiple Rails',
  'Homeowner Opens A Dispute',
  'Evidence And Peer Review',
]) {
  assertIncludes(demoScript, requiredStep, demoScriptPath);
}

for (const requiredSafetyBoundary of [
  'not a legal loan product yet',
  'legal review before production',
  'Payment provider keys must stay server-side only',
  'Supabase RLS must be tightened before public launch',
  'Never test with real personal documents',
]) {
  assertIncludes(demoScript, requiredSafetyBoundary, demoScriptPath);
}

for (const requiredProductSignal of [
  'unsafe upfront deposits',
  'platform-backed credit',
  'milestone payments',
  'verification',
  'dispute review',
  'multi-rail payments',
  'XPR/WebAuth',
  'Metal Pay',
]) {
  assertIncludes(demoScript, requiredProductSignal, demoScriptPath);
}

assertIncludes(backlog, 'Demo script validator', backlogPath);
assertIncludes(context, 'demo script validator', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role_[a-z0-9]/i.test(demoScript),
  'Demo script must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  demo_script: demoScriptPath,
  safety_boundaries_checked: true,
}, null, 2));
