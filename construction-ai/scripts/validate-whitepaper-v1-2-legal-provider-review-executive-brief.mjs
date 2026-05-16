import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const briefPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-executive-brief.md');
const prepPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const antiBackdoorPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 legal/provider review executive brief validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const brief = readRequired(briefPath);
const prep = readRequired(prepPath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const antiBackdoor = readRequired(antiBackdoorPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Legal/Provider Review Executive Brief',
  'Purpose',
  'Reviewer-Safe Project Snapshot',
  'Current Demo-Only Scope',
  'Future Concepts Requiring External Review',
  'Decisions Requested From Reviewers',
  'Evidence Packet To Review',
  'Blocked Live Actions',
  'Required Written Response',
  'Founder Send Boundary',
  'Required Checks',
]) assertIncludes(brief, section, briefPath);

for (const required of [
  'INTERNAL_REVIEW_BRIEF_ONLY',
  'not legal advice',
  'not provider approval',
  'not lender approval',
  'not escrow approval',
  'not payment-provider approval',
  'SmartContractor is a local/demo construction marketplace workflow',
  'jobs, bids, project-contract records, milestones, evidence metadata, disputes, peer/admin review, audit logs, request IDs, and PWA/mobile readiness runbooks',
  'does not originate loans, hold escrow, route repayment, settle stablecoins, lock token collateral, execute production payment-provider calls, or make AI final approvals',
  'contract-backed working-capital eligibility',
  'repayment-first milestone waterfall',
  'escrow-ready coordination without autonomous custody',
  'stablecoin settlement roadmap',
  'token collateral roadmap',
  'AI recommendation-only boundaries',
  'modular smart contract authority, audit, pause, and anti-backdoor controls',
  'classify whether the proposed flows touch lending, escrow, payment handling, money transmission, credit brokering, servicing, collections, consumer protection, privacy, adverse action, contractor finance, securities, custody, or tax concerns',
  'define lender-of-record, borrower-term, underwriting, servicing, repayment, dispute-hold, refund, chargeback, custody, payment-rail, release-authority, and provider-callback requirements',
  'identify public whitepaper, website, deck, email, grant, investor, partner, provider, and social claims that must stay blocked or be revised before use',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/gcsc-v1-2-core-architecture-package.md',
  'live loan origination',
  'live escrow custody',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'production provider API calls',
  'public launch',
  'legal conclusions or compliance claims',
  'reviewer_role',
  'reviewed_files',
  'decision: HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP',
  'required_changes',
  'blocked_public_claims',
  'blocked_live_actions',
  'follow_up_evidence_requested',
  'Reviewer packet distribution is founder-controlled',
  'must not include the whole repository, `.env`, credentials, raw logs, screenshots, recordings, private customer data, provider credentials, Magic Link URLs, tokens, service-role keys, private keys, wallet keys, or database connection strings',
  'npm run check:whitepaper-v1-2-legal-provider-review-executive-brief',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check:real-status-audit',
  'npm run check',
]) assertIncludes(brief, required, briefPath);

for (const [content, snippet, file] of [
  [prep, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', prepPath],
  [technicalRequirements, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements', technicalRequirementsPath],
  [antiBackdoor, 'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review', antiBackdoorPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 legal/provider review executive brief', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-legal-provider-review-executive-brief', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 legal/provider review executive brief', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-legal-provider-review-executive-brief', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 legal/provider review executive brief', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-legal-provider-review-executive-brief"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-legal-provider-review-executive-brief"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(brief)) {
  fail('Legal/provider review executive brief must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  legal_provider_review_executive_brief: briefPath,
  blocked_live_actions_checked: true,
  reviewer_response_fields_checked: true,
}, null, 2));
