import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checklistPath = resolve('..', 'docs', 'smartcontractor-public-beta-handoff-checklist.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');

function fail(message) {
  console.error(`Public beta handoff validation failed: ${message}`);
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

const checklist = readFileSync(checklistPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');

for (const section of [
  '## Safe Beta Demo Scope',
  '## Founder Review Packet',
  '## Local Release Checks',
  '## Founder Action Step',
  '## Acceptance Criteria',
]) {
  assertIncludes(checklist, section, checklistPath);
}

for (const demoScope of [
  'homeowner job intake',
  'contractor bid submission',
  'simulated starter loan request',
  'simulated milestone payment status',
  'dispute and evidence metadata flow',
  'peer review scoring',
  'admin/risk console review queue',
  'Founder Action Center readiness blockers',
]) {
  assertIncludes(checklist, demoScope, checklistPath);
}

for (const disabledRisk of [
  'real loan origination',
  'real escrow',
  'real token collateral lock',
  'production payment-provider capture',
  'automatic admin role assignment',
  'live Supabase RLS replacement',
  'without explicit founder approval',
]) {
  assertIncludes(checklist, disabledRisk, checklistPath);
}

for (const reviewDoc of [
  'docs/smartcontractor-public-launch-runbook.md',
  'docs/smartcontractor-deploy-platform-decision-brief.md',
  'docs/smartcontractor-vercel-preflight.md',
  'docs/smartcontractor-founder-admin-activation-runbook.md',
  'docs/smartcontractor-legal-financial-review-checklist.md',
  'docs/smartcontractor-demo-script.md',
]) {
  assertIncludes(checklist, reviewDoc, checklistPath);
}

assertIncludes(checklist, 'npm run check', checklistPath);
assertIncludes(checklist, 'connect the deploy account without sharing passwords or secret keys in chat', checklistPath);
assertIncludes(backlog, 'Public beta handoff checklist validator', backlogPath);
assertIncludes(context, 'Public beta handoff checklist validator', contextPath);

assert(
  !/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]/i.test(checklist),
  'Public beta handoff checklist must not contain real secret-looking values'
);

console.log(JSON.stringify({
  status: 'passed',
  checklist: checklistPath,
  safety_boundaries_checked: true,
}, null, 2));
