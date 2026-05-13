import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const triageLogPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-triage-log.md');
const responseTemplatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-founder-response-template.md');
const exactSentenceRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md');
const publicUseGatePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-public-use-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan founder response triage log validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const triageLog = readRequired(triageLogPath);
const responseTemplate = readRequired(responseTemplatePath);
const exactSentenceRegister = readRequired(exactSentenceRegisterPath);
const publicUseGate = readRequired(publicUseGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Triage Log',
  'Purpose',
  'Triage States',
  'Response Routing Table',
  'Required Safe Fields',
  'Do Not Capture',
  'Blocked Shortcuts',
  'Required Checks',
]) {
  assertIncludes(triageLog, section, triageLogPath);
}

for (const required of [
  'internal founder response triage log only',
  'not legal advice',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to launch repayment routing',
  'not approval to publish public wording',
  'public whitepaper remains unchanged',
  'Accept, Revise, Reject, and Hold',
  'legal approval',
  'provider approval',
  'live payment setup',
  'public publication approval',
  'Approved source map',
  'claim review',
  'public-use gate',
  'approval record',
  'Exact sentence register',
  'public wording options',
  'adjacent disclaimer',
  'selected sentence ID',
  'Technical review',
  'finance-provider review',
  'no real repayment routing',
  'no provider promise',
  'no automatic release claim',
  'Placement map',
  'public excerpt review packet',
  'Allowed audience',
  'Allowed section',
  'Sentence ID',
  'version',
  'approval state',
  'rollback path',
  'founder decision state',
  'safe revision note',
  'review owner',
  'required check command',
  'blocked live-risk reminder',
  'passwords',
  'private keys',
  'service-role keys',
  'provider API keys',
  'lender contracts',
  'private borrower data',
  'raw payment data',
  'attorney-client privileged notes',
  'live Supabase SQL changes',
  'real-money loan, escrow, token collateral, stablecoin settlement, or repayment-routing instructions',
  'live loans',
  'real escrow',
  'token collateral',
  'repayment routing',
  'public lending claims',
  'guaranteed funding',
  'instant approval',
  'AI loan approval',
  'AI automatic payment release',
  'GCSC acting as a lender, bank, broker, licensed finance provider, or escrow agent',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate',
  'npm run check',
]) {
  assertIncludes(triageLog, required, triageLogPath);
}

assertIncludes(triageLog, 'docs/whitepaper-v1-2-contract-backed-loan-founder-response-template.md', triageLogPath);
assertIncludes(responseTemplate, 'Founder Response Table', responseTemplatePath);
assertIncludes(exactSentenceRegister, 'CBL-SAFE-01', exactSentenceRegisterPath);
assertIncludes(publicUseGate, 'Public Use Gate', publicUseGatePath);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan founder response triage log', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan founder response triage log', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan founder response triage log', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(triageLog)) {
  fail('Contract-backed loan founder response triage log must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_founder_response_triage_log: triageLogPath,
  public_file_change_block_checked: true,
}, null, 2));
