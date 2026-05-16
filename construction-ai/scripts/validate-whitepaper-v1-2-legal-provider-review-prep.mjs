import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prepPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const coreArchitecturePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const blueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const antiBackdoorPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const legalHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const financeHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md');
const readinessMatrixPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md');
const blockerRegisterPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md');
const approvalEvidencePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const auditEventMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const implementationGatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 legal/provider review prep validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const prep = readRequired(prepPath);
const coreArchitecture = readRequired(coreArchitecturePath);
const blueprint = readRequired(blueprintPath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const antiBackdoor = readRequired(antiBackdoorPath);
const legalHandoff = readRequired(legalHandoffPath);
const financeHandoff = readRequired(financeHandoffPath);
const readinessMatrix = readRequired(readinessMatrixPath);
const blockerRegister = readRequired(blockerRegisterPath);
const approvalEvidence = readRequired(approvalEvidencePath);
const authority = readRequired(authorityPath);
const auditEventMap = readRequired(auditEventMapPath);
const implementationGate = readRequired(implementationGatePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Legal Provider Review Prep',
  'Purpose',
  'What GCSC SmartContractor Does Now',
  'Future Concepts Needing Review',
  'Disabled And Blocked Live Actions',
  'Legal And Provider Classification Questions',
  'Finance Provider Review Questions',
  'Escrow And Payment Provider Review Questions',
  'Stablecoin And Token Collateral Review Questions',
  'AI Review Questions',
  'Smart Contract Review Questions',
  'Reviewer Role Separation Matrix',
  'Informal Reviewer Response Non-Approval Boundary',
  'Reviewer Response Evidence Ledger',
  'Cross-Scope Response Triage Rules',
  'Evidence Packet Index',
  'Allowed Internal Next Steps',
  'Blocked Until Explicit External Approval',
  'Founder Handoff',
  'Required Checks',
]) assertIncludes(prep, section, prepPath);

for (const required of [
  'INTERNAL_REVIEW_PREP_ONLY',
  'not legal advice',
  'not provider approval',
  'not lender approval',
  'not escrow approval',
  'not payment-provider approval',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'production payments',
  'public launch',
  'local/demo construction marketplace workflow',
  'signed project contracts as workflow records',
  'milestone records and evidence review states',
  'dispute center and peer/admin review',
  'provider/payment/Auth scaffolds',
  'does not move real money',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'repayment-first milestone waterfall',
  'escrow-ready payment coordination',
  'AI-assisted verification for recommendations only',
  'live loan origination',
  'live escrow custody',
  'real repayment routing',
  'production provider API calls',
  'AI final approval',
  'AI payment release',
  'AI dispute decision',
  'BLOCKED_FOR_LIVE',
  'lending, escrow, payment handling, money transmission',
  'UCC filings',
  'assignment of receivables',
  'security interests',
  'consumer protection',
  'adverse-action',
  'Who is the lender of record',
  'repayment-first waterfall',
  'Who holds funds',
  'release authority',
  'stablecoin or XPR/Metal Pay flows',
  'oracle, LTV, valuation, liquidation',
  'AI must stay recommendation-only',
  'human-review records',
  'no hidden owner drain',
  'no hidden upgrade path',
  'no arbitrary balance mutation',
  'no dispute bypass',
  'no AI-only final approval',
  'no contractor self-approval',
  'append-only and non-secret',
  'No reviewer role can approve another reviewer role by implication',
  'attorney review may classify legal, lending, escrow, payment, consumer-protection, privacy, disclosure, and public-claim risks',
  'finance-provider review may define lender-of-record, underwriting, borrower terms, servicing, repayment, adverse-action, and collection requirements',
  'escrow/payment-provider review may define custody, payment rail, chargeback, refund, release, callback, and provider dispute requirements',
  'security/smart-contract review may approve code safety, authority separation, auditability, pause, upgrade, rollback, and anti-backdoor controls',
  'founder approval may approve product scope, business priority, reviewer routing, and external owner actions, but it does not replace legal, finance-provider, payment-provider, or security approval',
  'Informal emails, calls, chat replies, verbal notes, calendar discussions, sales demos, or provider marketing statements are not approval',
  'only written reviewer responses mapped to reviewer role, reviewed files, decision, required changes, blocked public claims, blocked live actions, follow-up evidence requested, date, and owner can support APPROVE_FOR_NEXT_INTERNAL_STEP',
  'ambiguous, partial, outdated, sales-only, non-reviewer, or wrong-role responses default to HOLD or REVISE',
  'informal reviewer response must never enable live loan origination, live escrow custody, real repayment routing, stablecoin settlement, token collateral, production provider API calls, public launch, legal conclusions, provider commitments, or compliance claims',
  'Each reviewer response evidence ledger entry must capture response_id, reviewer_role, reviewer_org_or_source, reviewed_file_versions, decision, required_changes, blocked_claims, blocked_live_actions, follow_up_evidence_requested, received_at, owner, and status',
  'Screenshots, forwarded messages, call notes, meeting transcripts, and sales decks are intake evidence only until a written reviewer response is mapped into the ledger',
  'Missing reviewer role, missing file version, missing decision, or missing blocked-live-action fields default the ledger entry to HOLD',
  'A ledger entry must not approve public wording, provider commitments, compliance claims, live loans, escrow, repayment routing, stablecoin settlement, token collateral, production API calls, or public launch unless the matching external approval scope is explicit',
  'If a reviewer response contains conclusions outside reviewer_role, split those items into cross_scope_follow_up_required and keep the original ledger entry in HOLD or REVISE',
  'Legal-only responses cannot approve lender-of-record terms, escrow custody, payment processor setup, production API calls, smart contract deployment, or public launch timing',
  'Provider-only responses cannot approve legal classification, compliance claims, securities or lending conclusions, token collateral policy, or public whitepaper wording beyond the provider-approved scope',
  'Security-only responses cannot approve legal compliance, lender terms, payment custody, provider commitments, production launch, or real-money enablement',
  'Founder-only responses cannot approve legal conclusions, provider commitments, compliance claims, live money movement, token collateral activation, or production payment rails without matching external reviewer records',
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/gcsc-contract-backed-loan-blueprint.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md',
  'docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md',
  'docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'prepare local checklists',
  'redacted reviewer packets',
  'no-real-money tests',
  'live Supabase changes',
  'production deploy settings',
  'public launch',
  'legal conclusions or compliance claims',
  'Do not send passwords',
  'service-role keys',
  'private keys',
  'reviewer role',
  'HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP',
  'blocked public claims',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check:legal-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff',
  'npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(prep, required, prepPath);

for (const [content, snippet, file] of [
  [coreArchitecture, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', coreArchitecturePath],
  [blueprint, 'GCSC Contract-Backed Loan Blueprint', blueprintPath],
  [technicalRequirements, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements', technicalRequirementsPath],
  [antiBackdoor, 'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review', antiBackdoorPath],
  [legalHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff', legalHandoffPath],
  [financeHandoff, 'GCSC Whitepaper v1.2 Contract-Backed Loan Finance-Provider Handoff', financeHandoffPath],
  [readinessMatrix, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Readiness Matrix', readinessMatrixPath],
  [blockerRegister, 'GCSC Whitepaper v1.2 Contract-Backed Loan Implementation Blocker Register', blockerRegisterPath],
  [approvalEvidence, 'GCSC Whitepaper v1.2 Contract-Backed Loan Approval Evidence Template', approvalEvidencePath],
  [authority, 'SmartContractor Smart Contract Authority Model', authorityPath],
  [auditEventMap, 'SmartContractor Smart Contract Audit Event Map', auditEventMapPath],
  [implementationGate, 'SmartContractor Smart Contract Implementation Gate', implementationGatePath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 legal/provider review prep', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-legal-provider-review-prep', contextPath);
assertIncludes(context, 'Whitepaper v1.2 reviewer role separation matrix', contextPath);
assertIncludes(context, 'Whitepaper v1.2 informal reviewer response non-approval boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 reviewer response evidence ledger', contextPath);
assertIncludes(context, 'Whitepaper v1.2 cross-scope response triage rules', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider review prep', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-legal-provider-review-prep', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 reviewer role separation matrix', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 informal reviewer response non-approval boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 reviewer response evidence ledger', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 cross-scope response triage rules', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider review prep', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 reviewer role separation matrix', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 informal reviewer response non-approval boundary', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 reviewer response evidence ledger', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 cross-scope response triage rules', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-legal-provider-review-prep"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-legal-provider-review-prep"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(prep)) {
  fail('Legal/provider review prep must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  legal_provider_review_prep: prepPath,
  evidence_packet_sources_checked: 12,
  blocked_live_actions_checked: true,
}, null, 2));
