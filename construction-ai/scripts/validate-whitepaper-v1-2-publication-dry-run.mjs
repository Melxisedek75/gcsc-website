import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dryRunPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-dry-run.md');
const requiredDocs = [
  'whitepaper-v1-2-founder-review-worksheet.md',
  'whitepaper-v1-2-founder-response-intake.md',
  'whitepaper-v1-2-review-change-log.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper-v1-2-public-edit-queue.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-section-replacement-preview.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication dry run validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const dryRun = readRequired(dryRunPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Dry Run',
  'Purpose',
  'Dry Run Scope',
  'Inputs',
  'Dry Run Checklist',
  'Must Stay Blocked',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(dryRun, section, dryRunPath);
}

for (const required of [
  'internal publication dry run',
  'not approval to publish or edit',
  'whitepaper.html',
  'future PDF export',
  'must not modify',
  'Accept/Revise/Reject',
  'Change log',
  'approval record',
  'Founder, attorney/provider, and technical approvals',
  'blocked claim',
  'Section replacement preview',
  'Public edit queue',
  'rollback path',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-publication-dry-run',
  'npm run check:whitepaper-v1-2-review-change-log',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check:whitepaper-v1-2-public-edit-queue',
  'npm run check',
]) {
  assertIncludes(dryRun, required, dryRunPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(dryRun, docPath, dryRunPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication dry run', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-dry-run', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication dry run', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-dry-run', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(dryRun)) {
  fail('Publication dry run must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_dry_run: dryRunPath, public_edit_block_checked: true }, null, 2));
