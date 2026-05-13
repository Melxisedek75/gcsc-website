import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const guardPath = resolve('..', 'docs', 'whitepaper-v1-2-public-excerpt-guard.md');
const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const publishGatePath = resolve('..', 'docs', 'whitepaper-v1-2-publish-gate.md');
const founderPacketPath = resolve('..', 'docs', 'whitepaper-v1-2-founder-decision-packet.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 public excerpt guard validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const guard = readRequired(guardPath);
const sourceMap = readRequired(sourceMapPath);
const publishGate = readRequired(publishGatePath);
const founderPacket = readRequired(founderPacketPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Public Excerpt Guard',
  'Purpose',
  'Allowed Excerpt Themes',
  'Blocked Excerpt Claims',
  'Required Excerpt Review',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(guard, section, guardPath);
}

for (const required of [
  'internal guard',
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'escrow-ready',
  'not live escrow',
  'credit-ready',
  'not automatic lending',
  'stablecoin settlement roadmap',
  'tokenized construction agreements',
  'Digital Asset Market Clarity Act',
  'not a legal conclusion',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'guaranteed price',
  'founder/legal/provider review',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-founder-decision-packet',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(guard, required, guardPath);
}

assertIncludes(sourceMap, 'Section Mapping', sourceMapPath);
assertIncludes(publishGate, 'public excerpt', publishGatePath);
assertIncludes(founderPacket, 'Publish Path', founderPacketPath);
assertIncludes(context, 'whitepaper v1.2 public excerpt guard', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-excerpt-guard', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public excerpt guard', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-excerpt-guard', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(guard)) {
  fail('Public excerpt guard must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', public_excerpt_guard: guardPath, safety_boundaries_checked: true }, null, 2));
