import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-legal-provider-recheck-2026-06-06.md');
const legalProviderPacketPath = resolve('..', 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md');
const providerQuestionRegisterPath = resolve('..', 'docs', 'whitepaper-v1-3-provider-question-register.md');
const providerQuestionStatusPath = resolve('..', 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md');
const providerHandoffMapPath = resolve('..', 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md');
const providerShortlistPath = resolve('..', 'docs', 'whitepaper-v1-3-provider-shortlist.md');
const reviewerRedactionPath = resolve('..', 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md');
const reviewerQuestionMappingPath = resolve('..', 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md');
const legalFinancialChecklistPath = resolve('..', 'docs', 'smartcontractor-legal-financial-review-checklist.md');
const loanLegalRiskModelPath = resolve('..', 'docs', 'smartcontractor-loan-legal-risk-model.md');
const v12LegalProviderHandoffPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md');
const v12AdverseActionPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 legal/provider recheck validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const recheck = readRequired(recheckPath);
const legalProviderPacket = readRequired(legalProviderPacketPath);
const providerQuestionRegister = readRequired(providerQuestionRegisterPath);
const providerQuestionStatus = readRequired(providerQuestionStatusPath);
const providerHandoffMap = readRequired(providerHandoffMapPath);
const providerShortlist = readRequired(providerShortlistPath);
const reviewerRedaction = readRequired(reviewerRedactionPath);
const reviewerQuestionMapping = readRequired(reviewerQuestionMappingPath);
const legalFinancialChecklist = readRequired(legalFinancialChecklistPath);
const loanLegalRiskModel = readRequired(loanLegalRiskModelPath);
const v12LegalProviderHandoff = readRequired(v12LegalProviderHandoffPath);
const v12AdverseAction = readRequired(v12AdverseActionPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Legal/Provider Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Source Documents And Surfaces',
  'Week 2 Legal/Provider Recheck Sequence',
  'Current Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Public Wording Boundary',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve attorney/provider outreach',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-provider-handoff-packet-map.md',
  'docs/whitepaper-v1-3-provider-shortlist.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/smartcontractor-legal-financial-review-checklist.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  '/api/admin/legal-provider-next-step-readiness',
  '/api/admin/week-two-legal-provider-readiness',
  '/api/admin/week-two-legal-provider-execution-checklist',
  'Confirm working-capital questions are grouped',
  'Confirm escrow/payment questions are grouped',
  'Confirm ClaimBridge/advance questions are grouped',
  'Confirm token collateral questions are grouped',
  'Confirm public claim wording is separated',
  'Confirm redaction and data minimization are ready',
  'Confirm response intake can record only sanitized summaries',
  'HOLD_FOR_ATTORNEY_PROVIDER_REVIEW',
  'HOLD_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW',
  'HOLD_FOR_CLAIMBRIDGE_ADVANCE_REVIEW',
  'HOLD_FOR_TOKEN_COLLATERAL_REVIEW',
  'HOLD_FOR_PUBLIC_CLAIM_LEGAL_REVIEW',
  'HOLD_FOR_FOUNDER_CONTROLLED_RESPONSE_REVIEW',
  'BLOCKED_FOR_LIVE_ACTION',
  'Legal/Provider Week 2 Recheck',
  'external_send_requested: no',
  'provider_submission_attempted: no',
  'raw_legal_or_provider_response_stored: no',
  'legal_conclusion_made: no',
  'provider_commitment_made: no',
  'real_payment_or_loan_or_escrow_action_taken: no',
  'token_or_xpr_action_taken: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_REVIEW_PACKET',
  'READY_FOR_EXTERNAL_REVIEW_REQUEST_DRAFT',
  'NOT_READY_FOR_REVIEW',
  'BLOCKED_FOR_LEGAL_PROVIDER_DECISION',
  'Keep Web3, token, loan, escrow, ClaimBridge, advance, repayment routing',
  'This recheck cannot approve public wording',
  'Codex must stop before attorney/provider outreach',
  'npm run check:week-two-legal-provider-recheck',
  'npm run check:legal-review',
  'npm run check:whitepaper-v1-3-provider-question-status-matrix',
  'npm run check:whitepaper-v1-3-provider-handoff-packet-map',
  'npm run check:whitepaper-v1-3-reviewer-packet-redaction',
  'npm run check:whitepaper-v1-3-reviewer-question-mapping',
  'no-outreach, no-external-send, no-provider-submission, no-legal-conclusion, no-provider-commitment',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [legalProviderPacket, 'GCSC Whitepaper v1.3 Legal And Provider Review Packet', legalProviderPacketPath],
  [providerQuestionRegister, 'GCSC Whitepaper v1.3 Provider Question Register', providerQuestionRegisterPath],
  [providerQuestionStatus, 'GCSC Whitepaper v1.3 Provider Question Status Matrix', providerQuestionStatusPath],
  [providerHandoffMap, 'GCSC Whitepaper v1.3 Provider Handoff Packet Map', providerHandoffMapPath],
  [providerShortlist, 'GCSC Whitepaper v1.3 Provider Shortlist', providerShortlistPath],
  [reviewerRedaction, 'Redaction Required Before Reviewer Packet Leaves Local Repo', reviewerRedactionPath],
  [reviewerQuestionMapping, 'Reviewer Question Mapping Matrix', reviewerQuestionMappingPath],
  [legalFinancialChecklist, 'SmartContractor Legal And Financial Review Checklist', legalFinancialChecklistPath],
  [loanLegalRiskModel, 'SmartContractor Loan Legal Risk Model', loanLegalRiskModelPath],
  [v12LegalProviderHandoff, 'Contract-Backed Loan Legal/Provider Handoff', v12LegalProviderHandoffPath],
  [v12AdverseAction, 'Contract-Backed Loan Adverse-Action Legal/Provider Review', v12AdverseActionPath],
]) assertIncludes(content, snippet, file);

for (const snippet of [
  'Escrow Custody',
  'Lending And Working Capital',
  'Payment Processing And Stablecoin Settlement',
  'FIO Protocol',
  'XPR, WebAuth, Metal, And Metallicus',
  'Data Privacy And Audit Logs',
]) assertIncludes(providerQuestionRegister, snippet, providerQuestionRegisterPath);

for (const snippet of [
  'READY_FOR_FOUNDER_ROUTING',
  'NO_RESPONSE',
  'Safe Routing Rule',
  'Stop Boundary',
]) assertIncludes(providerQuestionStatus, snippet, providerQuestionStatusPath);

for (const snippet of [
  'BLOCKED_NO_OUTREACH',
  'BLOCKED_LIVE_ACTIONS',
  'Data Minimization Rules',
  'Required Before Any Send',
]) assertIncludes(providerHandoffMap, snippet, providerHandoffMapPath);

assertIncludes(context, 'Week 2 legal/provider recheck', contextPath);
assertIncludes(context, 'check:week-two-legal-provider-recheck', contextPath);
assertIncludes(backlog, 'Week 2 legal/provider recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-legal-provider-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-legal-provider-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-legal-provider-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 legal/provider recheck must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_legal_provider_recheck: recheckPath,
  linked_source_docs_checked: 11,
  live_stop_boundaries_checked: true,
}, null, 2));
