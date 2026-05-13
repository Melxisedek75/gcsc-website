import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const responsePath = resolve('..', 'docs', 'whitepaper-v1-2-publication-response-boundary.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-follow-up-queue.md',
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
  console.error(`Whitepaper v1.2 publication response boundary validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const response = readRequired(responsePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Response Boundary',
  'Purpose',
  'Response Classes',
  'Response Record Template',
  'Allowed Response Language',
  'Required Response Boundaries',
  'Automatic Block Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(response, section, responsePath);
}

for (const required of [
  'internal response boundary template',
  'not approval to publish, send, share, recall, supersede, replace, revise, or publicly answer',
  'whitepaper.html',
  'private recipient contact details',
  'raw legal advice',
  'provider credentials',
  'service-role keys',
  'database URLs',
  'seed phrases',
  'Safe Product Clarification',
  'Evidence Reference',
  'Technical Review',
  'Founder Decision',
  'Legal/Provider Review',
  'Correction/Recall Review',
  'Blocked',
  'Response ID',
  'Follow-up ID',
  'Distribution ID',
  'Version ID',
  'Safe draft summary',
  'Required approval',
  'Public-use state',
  'Current public/demo material is not a live escrow',
  'AI supports drafting, classification, scoring, routing, and review workflows',
  'does not make automatic legal, financial, escrow, lending, token collateral, or provider approval decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'attorney/provider/founder approval is optional',
  'Codex can approve legal, provider, lending, escrow, payment, token collateral, investor, grant, securities, or regulatory claims',
  'npm run check:whitepaper-v1-2-publication-response-boundary',
  'npm run check:whitepaper-v1-2-publication-follow-up-queue',
  'npm run check:whitepaper-v1-2-publication-distribution-log',
  'npm run check:whitepaper-v1-2-publication-version-history',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check',
]) {
  assertIncludes(response, required, responsePath);
}

for (const docPath of requiredDocs) {
  assertIncludes(response, docPath, responsePath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication response boundary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-response-boundary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication response boundary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-response-boundary', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(response)) {
  fail('Publication response boundary must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_response_boundary: responsePath, public_edit_block_checked: true }, null, 2));
