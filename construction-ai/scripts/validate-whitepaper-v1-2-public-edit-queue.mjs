import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const queuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-edit-queue.md');
const requiredDocPaths = [
  'whitepaper-v1-2-restructure-draft.md',
  'whitepaper-v1-2-founder-review-checklist.md',
  'whitepaper-v1-2-edit-plan.md',
  'whitepaper-v1-2-source-map.md',
  'whitepaper-v1-2-publish-gate.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper-v1-2-founder-decision-packet.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-claim-review-matrix.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 public edit queue validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const queue = readRequired(queuePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Public Edit Queue',
  'Purpose',
  'Edit Order',
  'Files To Check First',
  'Blocked Until Approval',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(queue, section, queuePath);
}

for (const required of [
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI-assisted',
  'AI boundaries',
  'escrow-ready',
  'credit-ready',
  'stablecoin settlement roadmap',
  'tokenized construction agreements',
  'Digital Asset Market Clarity Act',
  'policy context',
  'not a legal conclusion',
  'Real Estate DAO',
  'token economics',
  'GCSC/GCST utility',
  'legal review',
  'provider review',
  'strict RLS/admin readiness',
  'security review',
  'founder approval',
  'whitepaper.html',
  'founder approval recorded',
  'attorney/provider/founder approval',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'no guaranteed yield',
  'no automatic AI legal or financial decision',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-terms-glossary',
  'npm run check',
]) {
  assertIncludes(queue, required, queuePath);
}

for (const docPath of requiredDocPaths) {
  assertIncludes(queue, docPath, queuePath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 public edit queue', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-edit-queue', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public edit queue', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-edit-queue', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(queue)) {
  fail('Public edit queue must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', public_edit_queue: queuePath, publication_block_checked: true }, null, 2));
