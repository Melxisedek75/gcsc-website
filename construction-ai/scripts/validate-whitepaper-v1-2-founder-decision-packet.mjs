import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'whitepaper-v1-2-founder-decision-packet.md');
const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const approvalRecordPath = resolve('..', 'docs', 'whitepaper-v1-2-approval-record-template.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 founder decision packet validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const packet = readRequired(packetPath);
const sourceMap = readRequired(sourceMapPath);
const approvalRecord = readRequired(approvalRecordPath);
const audit = readRequired(auditPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Founder Decision Packet',
  'Purpose',
  'Decision 1: Public Structure',
  'Decision 2: First Product Narrative',
  'Decision 3: Legal And Provider Boundaries',
  'Decision 4: Publish Path',
  'Founder Notes',
  'Current Safe Recommendation',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const required of [
  'founder-review packet',
  'do not publish',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'stablecoin settlement',
  'tokenized construction agreements',
  'Digital Asset Market Clarity Act',
  'not a legal conclusion',
  'attorney/provider/founder approval',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'AI legal',
  'whitepaper-v1-2-approval-record-template.md',
  'gcsc-real-status-audit-2026-05-11.md',
  'npm run check:whitepaper-v1-2-founder-decision-packet',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(packet, required, packetPath);
}

assertIncludes(sourceMap, 'Contractor Reputation Layer', sourceMapPath);
assertIncludes(approvalRecord, 'Release Decision', approvalRecordPath);
assertIncludes(audit, 'Real-money construction finance pilot', auditPath);
assertIncludes(context, 'whitepaper v1.2 founder decision packet', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-founder-decision-packet', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder decision packet', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-founder-decision-packet', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packet)) {
  fail('Founder decision packet must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', founder_decision_packet: packetPath, safety_boundaries_checked: true }, null, 2));
