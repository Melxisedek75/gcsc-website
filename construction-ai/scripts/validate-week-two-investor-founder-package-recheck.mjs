import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-investor-founder-package-recheck-2026-06-06.md');
const investorPackagePath = resolve('..', 'docs', 'smartcontractor-investor-founder-package.md');
const onePagerPath = resolve('..', 'docs', 'smartcontractor-founder-one-pager.md');
const demoScriptPath = resolve('..', 'docs', 'smartcontractor-demo-script.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const architecturePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const loanBlueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const claimReviewPath = resolve('..', 'docs', 'whitepaper-v1-2-claim-review-matrix.md');
const legalProviderPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const betaPacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const deploymentPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const legalProviderRecheckPath = resolve('..', 'docs', 'smartcontractor-week-two-legal-provider-recheck-2026-06-06.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 investor/founder package recheck validation failed: ${message}`);
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
const investorPackage = readRequired(investorPackagePath);
const onePager = readRequired(onePagerPath);
const demoScript = readRequired(demoScriptPath);
const audit = readRequired(auditPath);
const architecture = readRequired(architecturePath);
const loanBlueprint = readRequired(loanBlueprintPath);
const claimReview = readRequired(claimReviewPath);
const legalProvider = readRequired(legalProviderPath);
const betaPacket = readRequired(betaPacketPath);
const deployment = readRequired(deploymentPath);
const legalProviderRecheck = readRequired(legalProviderRecheckPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Investor/Founder Package Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Source Documents And Surfaces',
  'Week 2 Investor/Founder Recheck Sequence',
  'Current Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Claim Safety Boundary',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve investor outreach',
  'docs/smartcontractor-investor-founder-package.md',
  'docs/smartcontractor-founder-one-pager.md',
  'docs/smartcontractor-demo-script.md',
  'docs/gcsc-real-status-audit-2026-05-11.md',
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/gcsc-contract-backed-loan-blueprint.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/smartcontractor-public-beta-review-packet.md',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-week-two-legal-provider-recheck-2026-06-06.md',
  '/api/admin/investor-founder-package-readiness',
  '/api/admin/week-two-investor-founder-package-alignment',
  '/api/admin/week-two-investor-founder-package-execution-checklist',
  'Confirm the target audience',
  'Confirm the package is still `INTERNAL_PACKAGE_ONLY`',
  'Confirm evidence freshness',
  'Confirm claim-source binding',
  'Confirm live-finance claims are absent or clearly blocked',
  'Confirm Web3/token claims are absent or clearly future/review-required',
  'Confirm AI authority claims are absent or clearly bounded',
  'Confirm recipient context stays private',
  'Confirm response readiness is founder-drafting only',
  'INVESTOR_PACKET_SEND_ACTION_RECORDED',
  'HOLD_FOR_AUDIENCE_REVIEW',
  'HOLD_FOR_EVIDENCE_REFRESH',
  'HOLD_FOR_CURRENT_CLAIM_SOURCE_BINDING',
  'HOLD_FOR_REDACTION_REVIEW',
  'HOLD_FOR_LIVE_FINANCE_CLAIM_REVIEW',
  'HOLD_FOR_WEB3_TOKEN_CLAIM_REVIEW',
  'HOLD_FOR_AI_AUTHORITY_CLAIM_REVIEW',
  'BLOCKED_FOR_EXTERNAL_SEND',
  'Investor/Founder Week 2 Recheck',
  'recipient_private_data_in_tracked_docs: no',
  'external_send_requested: no',
  'deck_pdf_email_social_publication_requested: no',
  'public_url_share_requested: no',
  'legal_or_provider_conclusion_made: no',
  'provider_commitment_made: no',
  'real_payment_or_loan_or_escrow_action_taken: no',
  'token_or_xpr_or_fio_action_taken: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_PACKET_DRAFT',
  'READY_FOR_REVISION',
  'HOLD_FOR_CLAIM_REVIEW',
  'BLOCKED_FOR_EXTERNAL_SEND',
  'BLOCKED_FOR_LIVE_OR_LEGAL_ACTION',
  'Allowed current claims',
  'demo-ready local MVP',
  'working toward no-real-money public beta',
  'contract-backed working-capital concept',
  'future provider-reviewed lending, escrow, payment, and verification integrations',
  'legal/provider review required before live money movement',
  'Blocked unless separately reviewed and approved',
  'active users, revenue, loan volume, escrow volume',
  'token yield',
  'provider partnership secured',
  'AI automatic loan approval',
  'Codex must stop before investor outreach',
  'npm run check:week-two-investor-founder-package-recheck',
  'npm run check:investor-founder-package',
  'npm run check:whitepaper-v1-2-claim-review',
  'no-investor-outreach, no-grant-submission, no-provider-outreach, no-attorney-outreach',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [investorPackage, 'SmartContractor Investor Founder Package', investorPackagePath],
  [onePager, 'SmartContractor Founder One-Pager', onePagerPath],
  [demoScript, 'SmartContractor MVP Demo Script', demoScriptPath],
  [audit, 'GCSC / SmartContractor Real Status Audit', auditPath],
  [architecture, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePath],
  [loanBlueprint, 'Contract-Backed Loan Blueprint', loanBlueprintPath],
  [claimReview, 'Whitepaper v1.2 Claim Review Matrix', claimReviewPath],
  [legalProvider, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', legalProviderPath],
  [betaPacket, 'SmartContractor Public Beta Review Packet', betaPacketPath],
  [deployment, 'SmartContractor Deployment Decision Prep', deploymentPath],
  [legalProviderRecheck, 'SmartContractor Week 2 Legal/Provider Recheck', legalProviderRecheckPath],
]) assertIncludes(content, snippet, file);

for (const snippet of [
  'INTERNAL_PACKAGE_ONLY',
  'Evidence Freshness Boundary',
  'Investor/Founder External Share Approval Stamp',
  'Audience-Specific Packet Delta Boundary',
  'Recipient Context And Follow-Up Boundary',
  'Current Claim Source Binding Boundary',
  'Founder Evening Share Decision Gate',
  'Founder Evening Investor Response Readiness Record',
  'Founder Evening Investor Package Final Handoff Matrix',
  'Founder Investor Package External Send Approval Phrase Boundary',
  'Conservative Claim Rules',
]) assertIncludes(investorPackage, snippet, investorPackagePath);

for (const snippet of [
  'real loans',
  'real escrow',
  'repayment routing',
  'stablecoin settlement',
  'token collateral',
  'public launch',
  'AI approves loans automatically',
  'provider partnership secured',
]) assertIncludes(investorPackage, snippet, investorPackagePath);

assertIncludes(context, 'Week 2 investor/founder package recheck', contextPath);
assertIncludes(context, 'check:week-two-investor-founder-package-recheck', contextPath);
assertIncludes(backlog, 'Week 2 investor/founder package recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-investor-founder-package-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-investor-founder-package-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-investor-founder-package-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 investor/founder package recheck must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_investor_founder_package_recheck: recheckPath,
  linked_source_docs_checked: 11,
  external_send_stop_boundaries_checked: true,
}, null, 2));
