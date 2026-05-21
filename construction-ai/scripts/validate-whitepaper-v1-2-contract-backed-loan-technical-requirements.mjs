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
  'Partial Milestone And Dispute Hold Boundary',
  'Change Order And Budget Drift Boundary',
  'Retainage And Lien Waiver Boundary',
  'Provider Term Expiration And Revalidation Boundary',
  'Requirement-To-Claim Traceability Boundary',
  'Founder Evening Technical Readiness Decision Record',
  'Founder Evening Contract-Backed Loan Reviewer Handoff Matrix',
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
  'Partial milestone approval must record approved_work_amount, disputed_work_amount, holdback_amount, owner_confirmation_status, contractor_acknowledgement_status, dispute_status, calculation_owner, and blocked_live_gate_status before any draft repayment allocation is calculated.',
  'If any part of a milestone is disputed, unverified, over budget, missing evidence, missing owner confirmation, or subject to change order review, the disputed_work_amount and holdback_amount stay excluded from DRAFT_REPAYMENT_ALLOCATION.',
  'A partial approval can only create LOCAL_DRAFT_ALLOCABLE_AMOUNT and must not release escrow, route repayments, settle stablecoins, reduce live outstanding balance, charge fees, lock collateral, or create provider obligations.',
  'Missing partial-approval evidence, unresolved dispute evidence, contradictory owner/contractor records, or stale milestone evidence defaults to HOLD_FOR_PARTIAL_MILESTONE_REVIEW and BLOCKED_FOR_LIVE.',
  'Change-order review must record original_contract_amount, approved_change_order_amount, pending_change_order_amount, revised_contract_amount, budget_delta_reason, owner_approval_status, contractor_acknowledgement_status, and blocked_live_gate_status before revised repayment math can be drafted.',
  'Pending, disputed, verbal, stale, unsigned, or over-budget change orders must not increase eligible_receivables, milestone_gross, repayment_cap, contractor_net_payout, collateral value, or loan principal in local calculations.',
  'Any change-order adjustment can only produce LOCAL_DRAFT_REVISED_WATERFALL and must not amend a live contract, increase a live loan balance, route repayments, release escrow, settle stablecoins, lock token collateral, or create provider obligations.',
  'Missing change-order evidence, conflicting owner/contractor approval, stale budget evidence, or provider/legal uncertainty defaults to HOLD_FOR_CHANGE_ORDER_REVIEW and BLOCKED_FOR_LIVE.',
  'Retainage review must record retainage_percent, retainage_amount, lien_waiver_status, release_condition, owner_acceptance_status, provider_review_status, jurisdiction_review_status, and blocked_live_gate_status before retainage can affect draft waterfall math.',
  'Missing lien waiver evidence, unsigned waiver evidence, unclear retainage terms, owner acceptance mismatch, provider uncertainty, or jurisdiction uncertainty defaults to HOLD_FOR_RETAINAGE_LIEN_REVIEW and BLOCKED_FOR_LIVE.',
  'Retainage and lien waiver handling can only produce LOCAL_DRAFT_RETAINAGE_HOLD or LOCAL_DRAFT_RETAINAGE_RELEASE_CANDIDATE and must not waive legal rights, file liens, release escrow, route repayments, settle stablecoins, lock collateral, or create provider obligations.',
  'Provider term records must include term_version, provider_role, issued_at, expires_at, source_commit, reviewed_files, APR_or_fee_range, repayment_priority, waterfall_version, reviewer_role, and blocked_live_gate_status before they can support eligibility, repayment math, public wording, or implementation planning.',
  'Expired, superseded, missing-expiration, copied, unknown-source, unreviewed, or mismatched provider terms default to HOLD_FOR_PROVIDER_TERM_REVALIDATION and BLOCKED_FOR_LIVE.',
  'Provider term revalidation can only create LOCAL_DRAFT_PROVIDER_TERM_CLEARANCE and must not approve credit, fund contractors, route repayments, release escrow, settle stablecoins, lock token collateral, change live balances, charge fees, publish public lending claims, or create provider obligations.',
  'Requirement-to-claim records must include requirement_id, claim_id, source_file, source_commit, evidence_id, reviewer_role, claim_level, public_use_status, implementation_status, owner, latest_check_run, and blocked_live_actions before technical requirements can support public wording, provider packets, investor/founder packets, or local implementation planning.',
  'Missing requirement IDs, mismatched claim IDs, stale evidence, unknown reviewer role, copied public wording, superseded source commits, or missing blocked-live actions default to HOLD_FOR_REQUIREMENT_CLAIM_TRACEABILITY and BLOCKED_FOR_LIVE.',
  'Requirement-to-claim traceability can only create LOCAL_DRAFT_TRACEABILITY_RECORD and must not approve public wording, implementation, provider commitments, legal conclusions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, production deploys, or public launch.',
  'evening_technical_readiness_state',
  'READY_FOR_LOCAL_IMPLEMENTATION_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, or NO_GO',
  'evening_technical_readiness_evidence',
  'evening_technical_readiness_blocked_action',
  'Do not start live loans, escrow, repayment routing, provider setup, public wording, smart contract deployment, or production money movement from this record',
  'reviewer_handoff_state',
  'READY_FOR_FOUNDER_REVIEW, NEEDS_REQUIREMENT_CLARIFICATION, HOLD_FOR_LEGAL_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, or NO_GO',
  'reviewer_handoff_evidence',
  'reviewer_handoff_owner',
  'reviewer_handoff_blocked_action',
  'Do not treat this matrix as legal advice, finance-provider approval, lender commitment, underwriting approval, live loan approval, escrow approval, repayment routing approval, stablecoin settlement approval, token collateral approval, public wording approval, production deploy approval, or smart contract deployment approval',
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
assertIncludes(context, 'Whitepaper v1.2 partial milestone and dispute hold boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 change order and budget drift boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 retainage and lien waiver boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 provider term expiration and revalidation boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan requirement-to-claim traceability boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan reviewer handoff matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan waterfall duplicate guard', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 partial milestone and dispute hold boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 change order and budget drift boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 retainage and lien waiver boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 provider term expiration and revalidation boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan requirement-to-claim traceability boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan reviewer handoff matrix', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan waterfall duplicate guard', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 partial milestone and dispute hold boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 change order and budget drift boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 retainage and lien waiver boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 provider term expiration and revalidation boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan requirement-to-claim traceability boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan reviewer handoff matrix', auditPath);

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
