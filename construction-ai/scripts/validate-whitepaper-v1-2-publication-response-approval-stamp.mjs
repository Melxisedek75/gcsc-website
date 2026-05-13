import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const approvalPath = resolve('..', 'docs', 'whitepaper-v1-2-publication-response-approval-stamp.md');
const requiredDocs = [
  'whitepaper-v1-2-publication-response-boundary.md',
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
  console.error(`Whitepaper v1.2 publication response approval stamp validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const approval = readRequired(approvalPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Publication Response Approval Stamp',
  'Purpose',
  'Approval Stamp States',
  'Approval Stamp Template',
  'Required Approval Boundaries',
  'Automatic Block Triggers',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(approval, section, approvalPath);
}

for (const required of [
  'internal response approval stamp template',
  'not approval to publish, send, share, recall, supersede, replace, revise, or publicly answer',
  'whitepaper.html',
  'private recipient contact details',
  'raw legal advice',
  'provider credentials',
  'service-role keys',
  'database URLs',
  'seed phrases',
  'Draft Only',
  'Founder Approved',
  'Technical Approved',
  'Legal/Provider Approved',
  'Correction Approved',
  'Sent',
  'Blocked',
  'Approval Stamp ID',
  'Response ID',
  'Follow-up ID',
  'Distribution ID',
  'Version ID',
  'Approved-by role',
  'Public-use decision',
  'Founder approval is required',
  'Technical approval is required',
  'Legal/Provider approval is required',
  'Correction approval is required',
  'No approval stamp may override',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'Codex can approve legal, provider, lending, escrow, payment, token collateral, investor, grant, securities, stablecoin, or regulatory claims',
  'npm run check:whitepaper-v1-2-publication-response-approval-stamp',
  'npm run check:whitepaper-v1-2-publication-response-boundary',
  'npm run check:whitepaper-v1-2-publication-follow-up-queue',
  'npm run check:whitepaper-v1-2-publication-distribution-log',
  'npm run check:whitepaper-v1-2-publication-version-history',
  'npm run check:whitepaper-v1-2-publication-correction-notice',
  'npm run check:whitepaper-v1-2-publication-evidence-log',
  'npm run check:whitepaper-v1-2-publication-go-no-go',
  'npm run check',
]) {
  assertIncludes(approval, required, approvalPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(approval, docPath, approvalPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 publication response approval stamp', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-publication-response-approval-stamp', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 publication response approval stamp', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-publication-response-approval-stamp', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(approval)) {
  fail('Publication response approval stamp must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', publication_response_approval_stamp: approvalPath, public_edit_block_checked: true }, null, 2));
