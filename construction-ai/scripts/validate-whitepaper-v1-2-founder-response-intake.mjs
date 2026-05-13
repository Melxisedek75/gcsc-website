import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const intakePath = resolve('..', 'docs', 'whitepaper-v1-2-founder-response-intake.md');
const requiredDocs = [
  'whitepaper-v1-2-founder-review-worksheet.md',
  'whitepaper-v1-2-approval-record-template.md',
  'whitepaper-v1-2-section-replacement-preview.md',
  'whitepaper-v1-2-redline-preview.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 founder response intake validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const intake = readRequired(intakePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Founder Response Intake',
  'Purpose',
  'Intake Rules',
  'Founder Decision Summary',
  'Required Revision Notes',
  'Blocked Claim Confirmation',
  'Approval Routing',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(intake, section, intakePath);
}

for (const required of [
  'internal founder response intake',
  'not approval to publish or edit',
  'non-secret',
  'Do not treat incomplete responses as approval',
  'whitepaper-v1-2-founder-review-worksheet.md',
  'whitepaper-v1-2-approval-record-template.md',
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
  'real escrow is live',
  'real lending is live',
  'real token collateral is live',
  'contractor credit is guaranteed',
  'token price is promised',
  'yield is guaranteed',
  'AI makes automatic legal or financial decisions',
  'Digital Asset Market Clarity Act creates legal approval for GCSC',
  'attorney/provider/founder approval is optional',
  'Founder approval recorded',
  'Attorney review',
  'Provider review',
  'Technical review',
  'strict RLS/admin readiness',
  'disabled real-money gates',
  'whitepaper.html',
  'npm run check:whitepaper-v1-2-founder-response-intake',
  'npm run check:whitepaper-v1-2-founder-review-worksheet',
  'npm run check:whitepaper-v1-2-approval-record',
  'npm run check',
]) {
  assertIncludes(intake, required, intakePath);
}

for (const docPath of requiredDocs) {
  assertIncludes(intake, docPath, intakePath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 founder response intake', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-founder-response-intake', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder response intake', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-founder-response-intake', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(intake)) {
  fail('Founder response intake must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', founder_response_intake: intakePath, public_edit_block_checked: true }, null, 2));
