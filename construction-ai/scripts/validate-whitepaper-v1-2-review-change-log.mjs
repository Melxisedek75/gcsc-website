import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const changeLogPath = resolve('..', 'docs', 'whitepaper-v1-2-review-change-log.md');
const requiredDocs = [
  'whitepaper-v1-2-founder-review-worksheet.md',
  'whitepaper-v1-2-founder-response-intake.md',
  'whitepaper-v1-2-approval-record-template.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 review change log validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const changeLog = readRequired(changeLogPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Review Change Log',
  'Purpose',
  'Change Log Rules',
  'Change Log',
  'Decision States',
  'Blocked Claims',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(changeLog, section, changeLogPath);
}

for (const required of [
  'internal review change log',
  'not approval to publish or edit',
  'non-secret',
  'whitepaper-v1-2-founder-response-intake.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper.html',
  'WP12-001',
  'WP12-010',
  'SmartContractor Marketplace',
  'Project contracts and milestones',
  'Contractor Reputation Layer',
  'AI-assisted workflows and AI boundaries',
  'Escrow-ready and credit-ready',
  'Stablecoin settlement roadmap',
  'Tokenized construction agreements',
  'Digital Asset Market Clarity Act policy context',
  'Real Estate DAO placement',
  'GCSC/GCST utility placement',
  'Accepted',
  'Revised',
  'Rejected',
  'Blocked',
  'Deferred',
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'npm run check:whitepaper-v1-2-review-change-log',
  'npm run check:whitepaper-v1-2-founder-response-intake',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(changeLog, required, changeLogPath);
}

for (const docPath of requiredDocs) {
  assertIncludes(changeLog, docPath, changeLogPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 review change log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-review-change-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 review change log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-review-change-log', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(changeLog)) {
  fail('Review change log must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', review_change_log: changeLogPath, public_edit_block_checked: true }, null, 2));
