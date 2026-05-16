import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const requirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const blueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const architecturePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const technicalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-handoff.md');
const readinessMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const approvalEvidencePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 contract-backed loan technical requirements validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

function assertLineCount(content, snippet, expectedCount, file) {
  const matches = content
    .split(/\r?\n/)
    .filter((line) => line.toLowerCase().includes(snippet.toLowerCase()));
  if (matches.length !== expectedCount) {
    fail(`${file} must include "${snippet}" exactly ${expectedCount} time(s), found ${matches.length}`);
  }
}

const requirements = readRequired(requirementsPath);
const blueprint = readRequired(blueprintPath);
const architecture = readRequired(architecturePath);
const technicalHandoff = readRequired(technicalHandoffPath);
const readinessMatrix = readRequired(readinessMatrixPath);
const blockerRegister = readRequired(blockerRegisterPath);
const approvalEvidence = readRequired(approvalEvidencePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements',
  'Purpose',
  'Required Data Entities',
  'Eligibility Requirements',
  'Underwriting Inputs',
  'Repayment Waterfall Requirements',
  'Blocked-Live Gates',
  'Local API Requirements',
  'Smart Contract Requirements',
  'Required Test Fixtures',
  'Stop Conditions',
  'Required Checks',
]) assertIncludes(requirements, section, requirementsPath);

for (const required of [
  'internal technical requirements and blocked-live gates only',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real repayment routing',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to publish public wording',
  'signed-project-contract working-capital eligibility',
  'receivables-based underwriting inputs',
  'repayment-first waterfall math',
  'project_contract',
  'milestone',
  'contractor_profile',
  'verification_status',
  'loan_request',
  'loan_ledger',
  'repayment_schedule',
  'payment_intent',
  'repayment_allocation',
  'dispute_case',
  'audit_event',
  'approval_record',
  'INELIGIBLE_DRAFT',
  'MORE_INFO_NEEDED',
  'APPROVED_FOR_LIVE',
  'contract value',
  'milestone gross amount',
  'expected receivables',
  'requested working-capital amount',
  'outstanding exposure',
  'AI cannot approve loans',
  'milestone_gross - approved_platform_fees - approved_loan_repayment = contractor_net_payout',
  '`approved_loan_repayment` must never exceed outstanding balance',
  '`contractor_net_payout` must never be negative',
  'no repayment routing while disputed',
  'no release before milestone approval',
  'DRAFT_REPAYMENT_ALLOCATION',
  'LIVE_LOAN_ORIGINATION_BLOCKED',
  'LIVE_ESCROW_CUSTODY_BLOCKED',
  'LIVE_REPAYMENT_ROUTING_BLOCKED',
  'LIVE_STABLECOIN_SETTLEMENT_BLOCKED',
  'LIVE_TOKEN_COLLATERAL_BLOCKED',
  'AI_FINAL_APPROVAL_BLOCKED',
  'PUBLIC_CLAIM_BLOCKED',
  'BLOCKED_FOR_LIVE',
  'real loan origination',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'provider API calls',
  'borrower underwriting decisions',
  'AI final approval',
  'AI payment release',
  'production money movement',
  'no owner-only drain',
  'no hidden upgrade path',
  'no arbitrary balance mutation',
  'no arbitrary oracle trust',
  'no dispute-to-release bypass',
  'no contractor self-approval',
  'no AI-only approval',
  'no service-role key in browser code',
  'deterministic replay tests',
  'Happy path draft eligibility',
  'Missing contractor verification',
  'Active dispute blocks release and repayment routing',
  'Overpayment is capped at outstanding balance',
  'Negative contractor payout is blocked',
  'AI-only approval is rejected',
  'Token collateral request remains blocked',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix',
  'npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register',
  'npm run check:whitepaper-v1-2-contract-backed-loan-approval-evidence-template',
  'npm run check:contract-backed-loan-blueprint',
  'npm run check:gcsc-v1-2-core-architecture-package',
  'npm run check',
]) assertIncludes(requirements, required, requirementsPath);

for (const [content, snippet, file] of [
  [blueprint, 'GCSC Contract-Backed Loan Blueprint', blueprintPath],
  [architecture, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePath],
  [technicalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Handoff', technicalHandoffPath],
  [readinessMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', readinessMatrixPath],
  [blockerRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerRegisterPath],
  [approvalEvidence, 'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template', approvalEvidencePath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 contract-backed loan technical requirements', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-contract-backed-loan-technical-requirements', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan technical requirements', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-contract-backed-loan-technical-requirements', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan technical requirements', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-contract-backed-loan-technical-requirements"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-contract-backed-loan-technical-requirements"', runnerPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan waterfall duplicate guard', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan waterfall duplicate guard', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan waterfall duplicate guard', auditPath);

assertLineCount(requirements, '`approved_loan_repayment` must never exceed outstanding balance', 1, requirementsPath);
assertLineCount(requirements, '`contractor_net_payout` must never be negative', 1, requirementsPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(requirements)) {
  fail('Contract-backed loan technical requirements must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_technical_requirements: requirementsPath,
  blocked_live_gates_checked: 7,
  local_only_requirements_checked: true,
}, null, 2));
