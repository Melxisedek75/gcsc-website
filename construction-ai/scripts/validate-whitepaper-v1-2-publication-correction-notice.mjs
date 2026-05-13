import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const noticePath = resolve('..', 'docs', 'whitepaper-v1-2-publication-correction-notice.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-go-no-go-checklist.md',
  'whitepaper-v1-2-publication-evidence-log.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication correction notice validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const notice = readRequired(noticePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Correction Notice',
  'Purpose',
  'Correction Rules',
  'Correction Notice Template',
  'Public-Safe Notice Wording',
  'Automatic Escalation',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(notice, section, noticePath);
}

for (const required of [
  'internal correction notice template',
  'not approval to publish, edit, recall, or replace',
  'whitepaper.html',
  'non-secret correction metadata',
  'private legal advice',
  'provider credentials',
  'service-role keys',
  'database URLs',
  'wallet seed phrases',
  'raw recipient contact details',
  'Corrected, superseded, recalled',
  'No real escrow, lending, token collateral, investment return, legal approval, provider approval, or AI automated financial/legal decision is implied',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-rollback-plan',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check',
]) {
  assertIncludes(notice, required, noticePath);
}

for (const docPath of requiredDocs) {
  assertIncludes(notice, docPath, noticePath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication correction notice', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-correction-notice', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication correction notice', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-correction-notice', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(notice)) {
  fail('Publication correction notice must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_correction_notice: noticePath, public_edit_block_checked: true }, null, 2));
