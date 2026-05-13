import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distributionPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-distribution-log.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-version-history.md',
  'whitepaper-v1-2-publication-go-no-go-checklist.md',
  'whitepaper-v1-2-publication-correction-notice.md',
  'whitepaper-v1-2-publication-evidence-log.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication distribution log validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const distribution = readRequired(distributionPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Distribution Log',
  'Purpose',
  'Distribution Rules',
  'Distribution Record Template',
  'Required Distribution Boundaries',
  'Automatic Block Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(distribution, section, distributionPath);
}

for (const required of [
  'internal distribution log template',
  'not approval to publish, send, share, recall, supersede, or replace',
  'whitepaper.html',
  'non-secret distribution metadata',
  'private recipient names',
  'wallet addresses',
  'service-role keys',
  'raw legal advice',
  'provider credentials',
  'Draft, Review, Recalled, or Archived',
  'Approved or Published version',
  'completed approval record',
  'non-secret evidence log',
  'audience-specific packet',
  'approved public-safe wording',
  'correction notice',
  'version history state',
  'rollback record',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-publication-distribution-log',
  'npm run check:whitepaper-v1-2-publication-version-history',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check',
]) {
  assertIncludes(distribution, required, distributionPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(distribution, docPath, distributionPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication distribution log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-distribution-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication distribution log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-distribution-log', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(distribution)) {
  fail('Publication distribution log must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_distribution_log: distributionPath, public_edit_block_checked: true }, null, 2));
