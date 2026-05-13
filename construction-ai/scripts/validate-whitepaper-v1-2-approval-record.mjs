import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recordPath = resolve('..', 'docs', 'whitepaper-v1-2-approval-record-template.md');
const publishGatePath = resolve('..', 'docs', 'whitepaper-v1-2-publish-gate.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 approval record validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const record = readRequired(recordPath);
const publishGate = readRequired(publishGatePath);
const audit = readRequired(auditPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Approval Record Template',
  'Purpose',
  'Approval Record',
  'Required Confirmation',
  'Technical Verification',
  'Release Decision',
  'Safety Notes',
]) {
  assertIncludes(record, section, recordPath);
}

for (const required of [
  'internal record template',
  'founder approval required',
  'attorney/provider/founder approval',
  'Digital Asset Market Clarity Act',
  'no legal conclusion',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI boundaries',
  'gcsc-real-status-audit-2026-05-11.md',
  'do not edit `whitepaper.html`',
  'do not publish a PDF',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(record, required, recordPath);
}

assertIncludes(publishGate, 'Founder Final Check', publishGatePath);
assertIncludes(audit, 'Real-money construction finance pilot', auditPath);
assertIncludes(audit, '25-35%', auditPath);
assertIncludes(context, 'whitepaper v1.2 approval record', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-approval-record', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 approval record template', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-approval-record', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(record)) {
  fail('Approval record template must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', approval_record: recordPath, safety_boundaries_checked: true }, null, 2));
