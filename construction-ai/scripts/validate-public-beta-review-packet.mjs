import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packetPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Public beta review packet validation failed: ${message}`);
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

assert(existsSync(packetPath), `${packetPath} must exist`);

const packet = readFileSync(packetPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');

for (const section of [
  '## Purpose',
  '## Founder Must Review First',
  '## Demo-Safe Launch Scope',
  '## Blocked Until Founder Approval',
  '## Local Verification Commands',
  '## Evidence To Capture',
  '## Go / No-Go Checklist',
]) {
  assertIncludes(packet, section, packetPath);
}

for (const requiredDoc of [
  'docs/smartcontractor-public-beta-handoff-checklist.md',
  'docs/smartcontractor-public-launch-runbook.md',
  'docs/smartcontractor-demo-script.md',
  'docs/smartcontractor-controlled-user-test-plan.md',
  'docs/smartcontractor-beta-session-runbook.md',
  'docs/smartcontractor-beta-session-summary-template.md',
  'docs/smartcontractor-beta-decision-log.md',
  'docs/smartcontractor-founder-auth-evidence-template.md',
  'docs/smartcontractor-legal-financial-review-checklist.md',
]) {
  assertIncludes(packet, requiredDoc, packetPath);
}

for (const safeScope of [
  'homeowner job intake',
  'contractor bid submission',
  'simulated starter loan request',
  'simulated milestone payment status',
  'dispute evidence metadata',
  'peer review scoring',
  'admin/risk console review',
]) {
  assertIncludes(packet, safeScope, packetPath);
}

for (const blockedRisk of [
  'real loan origination',
  'real escrow',
  'real token collateral',
  'production payment capture',
  'live Supabase RLS replacement',
  'admin membership activation',
  'attorney/provider review',
]) {
  assertIncludes(packet, blockedRisk, packetPath);
}

for (const command of [
  'npm run check',
  'npm run check:beta-readiness',
  'npm run check:public-beta-review-packet',
]) {
  assertIncludes(packet, command, packetPath);
}

assertIncludes(backlog, 'Public beta review packet', backlogPath);
assertIncludes(context, 'Public beta review packet', contextPath);
assertIncludes(packageJson, 'check:public-beta-review-packet', packagePath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(packet),
  'Public beta review packet must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  packet: packetPath,
  safety_boundaries_checked: true,
}, null, 2));
