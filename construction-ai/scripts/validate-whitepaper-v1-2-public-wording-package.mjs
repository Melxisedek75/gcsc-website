import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const wordingPath = resolve('..', 'docs', 'whitepaper-v1-2-public-wording-package.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');

const referencedDocs = [
  'gcsc-v1-2-core-architecture-package.md',
  'whitepaper-v1-2-restructure-draft.md',
  'whitepaper-v1-2-section-replacement-preview.md',
  'whitepaper-v1-2-claim-review-matrix.md',
  'whitepaper-v1-2-terms-glossary.md',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-publish-gate.md',
];

function fail(message) {
  console.error(`Whitepaper v1.2 public wording package validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const wording = readRequired(wordingPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = JSON.parse(readRequired(packageJsonPath));

for (const section of [
  'GCSC Whitepaper v1.2 Public Wording Package',
  'Public Positioning Rule',
  'Executive Summary Wording',
  'Problem Wording',
  'Solution Wording',
  'Contract-Backed Working Capital Wording',
  'Smart Escrow And Settlement Wording',
  'AI Wording',
  'GCSC And GCST Wording',
  'Public Section Order',
  'Exact Safe Sentences',
  'Blocked Public Claims',
  'Review Gates Before Public Use',
  'Public Source Freshness Boundary',
  'Public Audience Scope Boundary',
  'Public Claim Evidence Traceability Boundary',
  'Public Reviewer Signoff Boundary',
  'Founder Evening Public Wording Decision Record',
  'Founder Evening Public Wording Channel Readiness Record',
  'Founder Evening Public Wording Reviewer Handoff Matrix',
  'Required Commands',
  'Safe Default',
]) {
  assertIncludes(wording, section, wordingPath);
}

for (const required of [
  'internal public-wording package',
  'not publication approval',
  'construction trust infrastructure',
  'SmartContractor',
  'project contracts',
  'milestones',
  'evidence',
  'reputation',
  'payment-readiness records',
  'dispute workflows',
  'audit trails',
  'Do not position GCSC as a token sale',
  'live lender',
  'live escrow company',
  'automatic AI finance engine',
  'guaranteed-yield product',
  'regulator-approved financial institution',
  'escrow-ready',
  'credit-ready',
  'settlement-ready',
  'real escrow, lending, stablecoin settlement, repayment routing, and token collateral require attorney review',
  'finance-provider terms',
  'attorney-approved documents',
  'founder approval',
  'technical/security readiness',
  'contract-backed working-capital workflows',
  'a signed project contract is automatically legal collateral',
  'AI approves or denies loans automatically',
  'Early SmartContractor versions can organize project contracts, milestones, payment intents, disputes, and audit records',
  'AI is an assistance layer',
  'not a final authority',
  'GCSC and GCST are planned utility and settlement components',
  'Neither token language should be read as a guarantee of price, liquidity, yield, legal status, or availability',
  'Contract-backed working capital is a proposed readiness workflow, not a live lending product',
  'Escrow-ready records do not mean GCSC currently holds homeowner funds',
  'Stablecoin settlement and tokenized construction agreements remain future regulated roadmap items',
  'Public token language must avoid price promises',
  'real repayment routing is live',
  'Digital Asset Market Clarity Act, SEC, CFTC, bank, government, provider, or attorney approval already covers GCSC',
  'publication go/no-go record',
  'Every public wording packet must record source_version, source_commit, source_file_set, review_date, reviewer_role, supersedes_version, and blocked_publication_status before it can support website, PDF, deck, partner, grant, investor, email, social, or announcement language.',
  'Stale v1.0 wording, copied launch claims, missing source commit, unknown reviewer role, superseded packet, or mismatched source file set defaults to HOLD_FOR_SOURCE_FRESHNESS_REVIEW and PUBLICATION_BLOCKED.',
  'Source freshness review can only create LOCAL_DRAFT_PUBLIC_WORDING_CLEARANCE and must not edit public files, publish website copy, send packets, launch real loans, activate escrow, route repayments, settle stablecoins, lock token collateral, or create provider obligations.',
  'Every public wording use must record audience_scope, channel_type, approved_sentence_ids, required_disclaimer, prohibited_claims_checked, private_recipient_data_excluded, reviewer_role, and blocked_publication_status before website, PDF, deck, partner, grant, investor, email, social, or announcement copy can move beyond local draft review.',
  'Audience mismatch, missing disclaimer, reused investor language in public channels, reused legal/provider language in marketing channels, copied social copy, private recipient data, or missing prohibited-claim review defaults to HOLD_FOR_AUDIENCE_SCOPE_REVIEW and PUBLICATION_BLOCKED.',
  'Audience scope review can only create LOCAL_DRAFT_AUDIENCE_SCOPED_WORDING and must not edit public files, publish website copy, send packets, launch real loans, activate escrow, route repayments, settle stablecoins, lock token collateral, create provider obligations, or create fundraising terms.',
  'Every public claim must record claim_id, exact_sentence_id, source_document, source_section, evidence_level, reviewer_role, stale_by_date, and blocked_publication_status before it can support website, PDF, deck, partner, grant, investor, email, social, or announcement wording.',
  'Missing claim IDs, uncited source sections, stale evidence, unsupported traction/security/AI/payment/loan/escrow/token claims, or reviewer-role mismatch defaults to HOLD_FOR_CLAIM_EVIDENCE_REVIEW and PUBLICATION_BLOCKED.',
  'Claim evidence review can only create LOCAL_DRAFT_CLAIM_EVIDENCE_TRACE and must not edit public files, publish website copy, send packets, create legal/provider assurances, create investor terms, launch real loans, activate escrow, route repayments, settle stablecoins, or lock token collateral.',
  'Every public wording approval path must record reviewer_signoff_id, reviewer_role, reviewer_scope, signed_sentence_ids, unresolved_hold_count, signoff_timestamp, signoff_expiration, and blocked_publication_status before website, PDF, deck, partner, grant, investor, email, social, or announcement wording can leave local draft review.',
  'Missing signoff ID, expired signoff, out-of-scope reviewer, unresolved HOLD, unsigned sentence IDs, or channel/audience mismatch defaults to HOLD_FOR_REVIEWER_SIGNOFF_REVALIDATION and PUBLICATION_BLOCKED.',
  'Reviewer signoff review can only create LOCAL_DRAFT_REVIEWER_SIGNOFF_TRACE and must not edit public files, publish website copy, send packets, create legal/provider assurances, create finance-provider commitments, create investor terms, launch real loans, activate escrow, route repayments, settle stablecoins, or lock token collateral.',
  'evening_public_wording_state',
  'READY_FOR_FOUNDER_WORDING_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, or NO_GO',
  'evening_public_wording_evidence',
  'evening_public_wording_blocked_action',
  'Do not edit public files, publish website copy, send packets, or use this record as legal/provider approval',
  'evening_public_channel_state',
  'READY_FOR_CHANNEL_REVIEW, REVIEW_CHANNEL_SCOPE, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, HOLD_FOR_SOURCE_FRESHNESS, or NO_GO',
  'evening_public_channel_evidence',
  'evening_public_channel_owner',
  'evening_public_channel_blocked_action',
  'Do not edit whitepaper.html, PDF, website copy, deck, email, social, announcement, partner packet, grant packet, investor packet, or any public channel from this record',
  'evening_public_wording_reviewer_handoff_state',
  'READY_FOR_FOUNDER_REVIEW, NEEDS_SOURCE_REFRESH, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_SECURITY_REVIEW, HOLD_FOR_CHANNEL_REVIEW, or NO_GO',
  'evening_public_wording_reviewer_handoff_evidence',
  'evening_public_wording_reviewer_handoff_owner',
  'evening_public_wording_reviewer_handoff_blocked_action',
  'Do not treat this handoff as approval to edit public files, publish website copy, send packets, approve public claims, approve legal/provider language, approve security claims, enable real loans, activate escrow, route repayments, settle stablecoins, lock token collateral, or launch publicly',
  'npm run check:whitepaper-v1-2-public-wording-package',
  'npm run check:whitepaper-v1-2-claim-review',
  'npm run check:whitepaper-v1-2-public-excerpt-guard',
  'npm run check:whitepaper-v1-2-publish-gate',
  'npm run check',
]) {
  assertIncludes(wording, required, wordingPath);
}

for (const docPath of referencedDocs) {
  assertIncludes(wording, docPath, wordingPath);
  if (!existsSync(resolve('..', 'docs', docPath))) fail(`Referenced document must exist: ${docPath}`);
}

assertIncludes(context, 'whitepaper v1.2 public wording package', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-wording-package', contextPath);
assertIncludes(context, 'Whitepaper v1.2 public source freshness boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 public audience scope boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 public claim evidence traceability boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 public reviewer signoff boundary', contextPath);
assertIncludes(context, 'Whitepaper v1.2 founder evening public wording channel readiness record', contextPath);
assertIncludes(context, 'Whitepaper v1.2 founder evening public wording reviewer handoff matrix', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public wording package', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-wording-package', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 public source freshness boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 public audience scope boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 public claim evidence traceability boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 public reviewer signoff boundary', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder evening public wording channel readiness record', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 founder evening public wording reviewer handoff matrix', backlogPath);
assertIncludes(packageJson.scripts?.['check:whitepaper-v1-2-public-wording-package'] || '', 'scripts/validate-whitepaper-v1-2-public-wording-package.mjs', packageJsonPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(wording)) {
  fail('Public wording package must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  public_wording_package: wordingPath,
  construction_trust_positioning_checked: true,
  blocked_live_finance_claims_checked: true,
  ai_boundary_checked: true,
  token_claim_boundary_checked: true,
}, null, 2));
