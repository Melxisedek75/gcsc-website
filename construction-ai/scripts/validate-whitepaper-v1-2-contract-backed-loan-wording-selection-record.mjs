import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recordPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-wording-selection-record.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan wording selection record validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const record = readRequired(recordPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Wording Selection Record',
  'Purpose',
  'Selection Fields',
  'Allowed Placement',
  'Review Evidence',
  'Blocked Terms',
  'Required Checks Before Public Use',
]) {
  assertIncludes(record, section, recordPath);
}

for (const required of [
  'internal selection record only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'public whitepaper remains unchanged',
  'Safest Option',
  'Moderate Option',
  'Provider-Review Option',
  'Reject for now',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'repayment-first waterfall',
  'provider-reviewed funding',
  'SmartContractor Platform',
  'Trust Infrastructure',
  'Settlement & Tokenized Construction Network',
  'contract collateral',
  'assignment of receivables',
  'lien',
  'security interest',
  'loans are guaranteed',
  'real escrow is live',
  'AI approves loans or releases payments automatically',
  'founder approval',
  'legal/provider review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check',
]) {
  assertIncludes(record, required, recordPath);
}

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan wording selection record', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-wording-selection-record', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan wording selection record', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-wording-selection-record', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan wording selection record', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(record)) {
  fail('Contract-backed loan wording selection record must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_wording_selection_record: recordPath,
  public_file_change_block_checked: true,
}, null, 2));
