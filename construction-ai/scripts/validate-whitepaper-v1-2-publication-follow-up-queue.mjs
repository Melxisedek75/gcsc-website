import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const followUpPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-follow-up-queue.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-distribution-log.md',
  'whitepaper-v1-2-publication-version-history.md',
  'whitepaper-v1-2-publication-correction-notice.md',
  'whitepaper-v1-2-publication-evidence-log.md',
  'whitepaper-v1-2-publication-rollback-plan.md',
  'whitepaper-v1-2-publication-go-no-go-checklist.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 publication follow-up queue validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const followUp = readRequired(followUpPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Follow-Up Queue',
  'Purpose',
  'Follow-Up States',
  'Follow-Up Record Template',
  'Required Follow-Up Boundaries',
  'Automatic Block Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(followUp, section, followUpPath);
}

for (const required of [
  'internal follow-up queue template',
  'not approval to publish, send, share, recall, supersede, replace, or revise',
  'whitepaper.html',
  'private recipient contact details',
  'raw legal advice',
  'provider credentials',
  'service-role keys',
  'database URLs',
  'seed phrases',
  'Waiting Legal/Provider',
  'Correction Needed',
  'Blocked',
  'Distribution ID',
  'Version ID',
  'Non-private summary',
  'Required evidence',
  'Safe next action',
  'founder and required professional review',
  'approved wording only',
  'correction notice',
  'version history',
  'evidence log',
  'rollback plan',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'Codex can approve legal, provider, lending, escrow, payment, token collateral, or investor claims',
  'npm run check:whitepaper-v1-2-publication-follow-up-queue',
  'npm run check:whitepaper-v1-2-publication-distribution-log',
  'npm run check:whitepaper-v1-2-publication-version-history',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check',
]) {
  assertIncludes(followUp, required, followUpPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(followUp, docPath, followUpPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication follow-up queue', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-follow-up-queue', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication follow-up queue', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-follow-up-queue', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(followUp)) {
  fail('Publication follow-up queue must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_follow_up_queue: followUpPath, public_edit_block_checked: true }, null, 2));
