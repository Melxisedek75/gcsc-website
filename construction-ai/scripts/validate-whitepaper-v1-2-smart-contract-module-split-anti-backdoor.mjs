import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const architecturePackagePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const smartContractDraftPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-architecture-draft.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const auditEventMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const implementationGatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const technicalRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Whitepaper v1.2 smart contract module split anti-backdoor validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const review = readRequired(reviewPath);
const architecturePackage = readRequired(architecturePackagePath);
const smartContractDraft = readRequired(smartContractDraftPath);
const authority = readRequired(authorityPath);
const auditEventMap = readRequired(auditEventMapPath);
const implementationGate = readRequired(implementationGatePath);
const technicalRequirements = readRequired(technicalRequirementsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review',
  'Purpose',
  'Module Split Decision',
  'Authority Model Requirements',
  'Anti-Backdoor Rules',
  'Emergency Pause Settlement Boundary',
  'State Transition Guards',
  'Audit Trail Requirements',
  'Deployment And Live-Use Gates',
  'Required Review Fixtures',
  'Required Checks',
]) assertIncludes(review, section, reviewPath);

for (const required of [
  'internal smart contract architecture review only',
  'not approval to deploy live XPR contracts',
  'not approval to launch real escrow',
  'not approval to launch real loans',
  'not approval to launch real repayment routing',
  'not approval to launch stablecoin settlement',
  'not approval to launch token collateral',
  'not approval to publish public wording',
  'not one monolith',
  'Authority And Role Module',
  'Project Contract Registry',
  'Milestone And Escrow-Ready State Machine',
  'Contract-Backed Loan Ledger',
  'Repayment Waterfall Router',
  'Collateral And Risk Module',
  'Reputation And Review Ledger',
  'Dispute And Human Override Module',
  'Audit And Compliance Registry',
  'hidden owner-only drain',
  'frontend-controlled authority',
  'single-key production deployment',
  'repayment above outstanding balance',
  'negative contractor payout',
  'auto-liquidation of real token collateral',
  'arbitrary oracle trust',
  'mutable audit history',
  'service-role key in browser code',
  'Unpause must require stronger approval than pause',
  'Emergency pause may stop new actions',
  'must not move funds',
  'Emergency pause is not a settlement primitive',
  'pause cannot approve loans, release escrow, route repayments, liquidate collateral, mutate balances, upgrade contracts, or rewrite audit history',
  'paused modules may record append-only audit events and blocked-live evidence only',
  'unpause requires founder multisig, provider review where money flows are involved, security review, and an audit event',
  'project registry cannot create a live legal collateral claim',
  'milestone state cannot move from evidence submitted to release eligible',
  'loan ledger cannot move from requested to funded',
  'repayment router cannot compute live routing',
  'collateral module cannot enable token collateral',
  'audit registry must record actor, role, request ID, previous state, next state, safety gate, and approval status',
  'append-only and non-secret',
  'founder scope approval',
  'legal/provider review',
  'finance-provider review',
  'escrow/payment provider review',
  'stablecoin/provider/compliance review',
  'token collateral legal/custody/oracle/LTV/liquidation review',
  'security review',
  'no-real-money local tests',
  'XPR account creation and authority setup by the founder',
  'LOCAL_ONLY',
  'PASS_LOCAL_ONLY',
  'BLOCKED_FOR_LIVE',
  'APPROVED_FOR_LIVE',
  'A single-key deploy path is rejected',
  'Hidden owner-only drain is rejected',
  'Arbitrary balance mutation is rejected',
  'Hidden upgrade path is rejected',
  'Contractor self-approval is rejected',
  'AI-only final approval is rejected',
  'Dispute-to-release bypass is rejected',
  'Token collateral live enablement is rejected',
  'Authority change without audit event is rejected',
  'npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check',
]) assertIncludes(review, required, reviewPath);

for (const [content, snippet, file] of [
  [architecturePackage, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePackagePath],
  [smartContractDraft, 'GCSC Whitepaper v1.2 Smart Contract Architecture Draft', smartContractDraftPath],
  [authority, 'SmartContractor Smart Contract Authority Model', authorityPath],
  [auditEventMap, 'SmartContractor Smart Contract Audit Event Map', auditEventMapPath],
  [implementationGate, 'SmartContractor Smart Contract Implementation Gate', implementationGatePath],
  [technicalRequirements, 'GCSC Whitepaper v1.2 Contract-Backed Loan Technical Requirements', technicalRequirementsPath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor', contextPath);
assertIncludes(context, 'Whitepaper v1.2 emergency pause settlement boundary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor', backlogPath);
assertIncludes(backlog, 'Whitepaper v1.2 emergency pause settlement boundary', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 smart contract module split and anti-backdoor review', auditPath);
assertIncludes(audit, 'Whitepaper v1.2 emergency pause settlement boundary', auditPath);
assertIncludes(packageJson, '"check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor"', packagePath);
assertIncludes(runner, '"check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(review)) {
  fail('Smart contract module split anti-backdoor review must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_module_split_anti_backdoor_review: reviewPath,
  modules_checked: 9,
  anti_backdoor_rules_checked: true,
  live_deployment_block_checked: true,
}, null, 2));
