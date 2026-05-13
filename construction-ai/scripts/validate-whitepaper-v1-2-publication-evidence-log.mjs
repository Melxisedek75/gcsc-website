import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const evidencePath = resolve('..', 'docs', 'whitepaper-v1-2-publication-evidence-log.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-dry-run.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-public-edit-queue.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication evidence log validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const evidence = readRequired(evidencePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Evidence Log',
  'Purpose',
  'Evidence Rules',
  'Required Evidence',
  'Blocked Evidence Claims',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(evidence, section, evidencePath);
}

for (const required of [
  'internal publication evidence log',
  'not approval to publish or edit',
  'non-secret evidence',
  'whitepaper.html',
  'Founder approval',
  'Attorney/provider approval',
  'Technical approval',
  'strict RLS/admin readiness',
  'disabled real-money gates',
  'Claim review',
  'Public edit queue',
  'Dry run',
  'Rollback readiness',
  'Verification commands',
  'Published artifact review',
  'Post-publication monitoring',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-dry-run',
  'npm run check:whitepaper-v1-2-publication-rollback-plan',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(evidence, required, evidencePath);
}

for (const docPath of requiredDocs) {
  assertIncludes(evidence, docPath, evidencePath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication evidence log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-evidence-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication evidence log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-evidence-log', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(evidence)) {
  fail('Publication evidence log must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_evidence_log: evidencePath, public_edit_block_checked: true }, null, 2));
