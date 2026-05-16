import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageDocPath = resolve('..', 'docs', 'smartcontractor-investor-founder-package.md');
const onePagerPath = resolve('..', 'docs', 'smartcontractor-founder-one-pager.md');
const demoScriptPath = resolve('..', 'docs', 'smartcontractor-demo-script.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const architecturePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const loanBlueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const legalProviderPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const deploymentPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const betaPacketPath = resolve('..', 'docs', 'smartcontractor-public-beta-review-packet.md');
const actionQueuePath = resolve('..', 'docs', 'smartcontractor-founder-action-queue.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Investor/founder package validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const packageDoc = readRequired(packageDocPath);
const onePager = readRequired(onePagerPath);
const demoScript = readRequired(demoScriptPath);
const audit = readRequired(auditPath);
const architecture = readRequired(architecturePath);
const loanBlueprint = readRequired(loanBlueprintPath);
const legalProvider = readRequired(legalProviderPath);
const deployment = readRequired(deploymentPath);
const betaPacket = readRequired(betaPacketPath);
const actionQueue = readRequired(actionQueuePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packageJsonPath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Investor Founder Package',
  'Status: INTERNAL_PACKAGE_ONLY',
  'Positioning',
  'Audience Packets',
  'Core Story',
  'Evidence Index',
  'Evidence Freshness Boundary',
  'Investor/Founder External Share Approval Stamp',
  'Audience-Specific Packet Delta Boundary',
  'Safe Metrics Language',
  'Conservative Claim Rules',
  'One-Minute Founder Pitch',
  'Three-Minute Founder Pitch',
  'Founder Talking Points',
  'Red Flags During Conversations',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(packageDoc, section, packageDocPath);

for (const required of [
  'construction trust infrastructure',
  'not a securities offer',
  'not legal advice',
  'not a lender or escrow approval',
  'not approval to deploy production',
  'Investor / strategic partner',
  'Grant / startup program',
  'Payment / verification provider',
  'Attorney / finance provider',
  'Founder internal review',
  'Founder one-pager',
  'Demo script',
  'Real status audit',
  'Core architecture',
  'Contract-backed loan blueprint',
  'Technical requirements',
  'Legal/provider prep',
  'Deployment decision prep',
  'Public beta review packet',
  'Founder action queue',
  'Do not share this package externally until evidence dates, check counts, and status claims are refreshed against the latest local run',
  'if a metric is older than the latest full check run, label it historical or remove it',
  'latest full suite count must be copied from the current run-checks output before sharing',
  'External investor, grant, partner, provider, or founder-forwarded packet sharing requires an approval stamp with audience, packet_version, approved_by, approved_at, source_commit, latest_check_run, evidence_date, redaction_status, and blocked_claims_review.',
  'Missing packet_version, approved_by, approved_at, source_commit, latest_check_run, evidence_date, redaction_status, or blocked_claims_review keeps the packet INTERNAL_REVIEW_ONLY.',
  'An approval stamp does not approve investor outreach, grant submission, provider commitments, legal conclusions, token/yield promises, live finance, public launch, production deployment, payment provider setup, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.',
  'Old decks, old PDFs, screenshots, chat summaries, stale metrics, or copied approval text cannot replace a current packet_version approval stamp.',
  'Each audience packet must record audience, allowed_artifacts, removed_artifacts, claim_level, evidence_version, redaction_status, owner, approval_stamp_status, and blocked_next_actions before sharing leaves INTERNAL_REVIEW_ONLY.',
  'Investor, grant, partner, provider, attorney, and founder-internal packets must not be treated as interchangeable; a stamp for one audience cannot approve another audience or a broader channel.',
  'If a packet is reused, forwarded, clipped, translated, converted to slides/PDF/email/social copy, or merged with tester evidence, it defaults to HOLD_FOR_AUDIENCE_REVIEW until the audience-specific deltas and blocked claims are rechecked.',
  'Audience-specific packet review does not approve outreach, grant submission, provider commitments, legal conclusions, public claims, production deployment, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch.',
  'local MVP exists',
  '310 local checks passed',
  'demo-ready local MVP',
  'working toward no-real-money public beta',
  'contract-backed working-capital concept',
  'legal/provider review required before live money movement',
  'approved lender',
  'licensed escrow',
  'guaranteed contractor loan',
  'guaranteed token return',
  'SEC-approved',
  'production payments ready',
  'AI approves loans automatically',
  'token collateral live',
  'public launch complete',
  'provider partnership secured',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'production payments',
  'public launch',
  'npm run check:investor-founder-package',
  'npm run check:founder-one-pager',
  'npm run check:demo-script',
  'npm run check:real-status-audit',
  'npm run check:deployment-decision-prep',
  'npm run check:whitepaper-v1-2-legal-provider-review-prep',
  'npm run check',
]) assertIncludes(packageDoc, required, packageDocPath);

for (const [content, snippet, file] of [
  [onePager, 'SmartContractor Founder One-Pager', onePagerPath],
  [demoScript, 'SmartContractor MVP Demo Script', demoScriptPath],
  [audit, 'GCSC / SmartContractor Real Status Audit', auditPath],
  [architecture, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePath],
  [loanBlueprint, 'Contract-Backed Loan Blueprint', loanBlueprintPath],
  [legalProvider, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', legalProviderPath],
  [deployment, 'SmartContractor Deployment Decision Prep', deploymentPath],
  [betaPacket, 'SmartContractor Public Beta Review Packet', betaPacketPath],
  [actionQueue, 'SmartContractor Founder Action Queue', actionQueuePath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Investor/founder package', contextPath);
assertIncludes(context, 'Investor/founder package evidence freshness boundary', contextPath);
assertIncludes(context, 'Investor/founder package external share approval stamp boundary', contextPath);
assertIncludes(context, 'Investor/founder package audience-specific packet delta boundary', contextPath);
assertIncludes(context, 'check:investor-founder-package', contextPath);
assertIncludes(backlog, 'Investor/founder package', backlogPath);
assertIncludes(backlog, 'Investor/founder package evidence freshness boundary', backlogPath);
assertIncludes(backlog, 'Investor/founder package external share approval stamp boundary', backlogPath);
assertIncludes(backlog, 'Investor/founder package audience-specific packet delta boundary', backlogPath);
assertIncludes(backlog, 'check:investor-founder-package', backlogPath);
assertIncludes(audit, 'Investor/founder package', auditPath);
assertIncludes(audit, 'Investor/founder package evidence freshness boundary', auditPath);
assertIncludes(audit, 'Investor/founder package external share approval stamp boundary', auditPath);
assertIncludes(audit, 'Investor/founder package audience-specific packet delta boundary', auditPath);
assertIncludes(packageJson, '"check:investor-founder-package"', packageJsonPath);
assertIncludes(runner, '"check:investor-founder-package"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(packageDoc)) {
  fail('Investor/founder package must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  investor_founder_package: packageDocPath,
  evidence_sources_checked: 9,
  conservative_claim_rules_checked: true,
}, null, 2));
