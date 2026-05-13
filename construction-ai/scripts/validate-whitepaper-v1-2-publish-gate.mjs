import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const gatePath = resolve('..', 'docs', 'whitepaper-v1-2-publish-gate.md');
const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const editPlanPath = resolve('..', 'docs', 'whitepaper-v1-2-edit-plan.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publish gate validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const gate = readRequired(gatePath);
const sourceMap = readRequired(sourceMapPath);
const editPlan = readRequired(editPlanPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publish Gate',
  'Purpose',
  'Required Approvals',
  'Content Gate',
  'Legal And Financial Gate',
  'Technical Gate',
  'Founder Final Check',
  'Blocked Outcomes',
]) {
  assertIncludes(gate, section, gatePath);
}

for (const required of [
  'do not publish',
  'founder approval required',
  'whitepaper-v1-2-source-map.md',
  'whitepaper-v1-2-edit-plan.md',
  'SmartContractor Marketplace',
  'contractor credit',
  'Digital Asset Market Clarity Act',
  'compliance-ready',
  'no legal conclusion',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'attorney/provider/founder approval',
  'npm run check:whitepaper-v1-2-publish-gate',
  'npm run check',
]) {
  assertIncludes(gate, required, gatePath);
}

assertIncludes(sourceMap, 'Section Mapping', sourceMapPath);
assertIncludes(editPlan, 'Verification Plan', editPlanPath);
assertIncludes(context, 'whitepaper v1.2 publish gate', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publish-gate', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publish gate', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publish-gate', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(gate)) {
  fail('Whitepaper publish gate must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publish_gate: gatePath, safety_boundaries_checked: true }, null, 2));
