import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-smart-contract-module-recheck-2026-06-06.md');
const implementationGatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityModelPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const actionRegisterPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const stateMachinePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const deploymentBlockersPath = resolve('..', 'docs', 'smartcontractor-smart-contract-deployment-blockers.md');
const localReplayPath = resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md');
const packageIndexPath = resolve('..', 'docs', 'smartcontractor-smart-contract-local-implementation-package-index.md');
const escrowStartPath = resolve('..', 'docs', 'smartcontractor-smart-contract-escrow-local-package-start-record.md');
const loanStartPath = resolve('..', 'docs', 'smartcontractor-smart-contract-loan-local-package-start-record.md');
const collateralStartPath = resolve('..', 'docs', 'smartcontractor-smart-contract-collateral-local-package-start-record.md');
const reviewStartPath = resolve('..', 'docs', 'smartcontractor-smart-contract-review-local-package-start-record.md');
const antiBackdoorPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const loanBlueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 smart contract module recheck validation failed: ${message}`);
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
const implementationGate = readRequired(implementationGatePath);
const authorityModel = readRequired(authorityModelPath);
const actionRegister = readRequired(actionRegisterPath);
const stateMachine = readRequired(stateMachinePath);
const auditMap = readRequired(auditMapPath);
const deploymentBlockers = readRequired(deploymentBlockersPath);
const localReplay = readRequired(localReplayPath);
const packageIndex = readRequired(packageIndexPath);
const escrowStart = readRequired(escrowStartPath);
const loanStart = readRequired(loanStartPath);
const collateralStart = readRequired(collateralStartPath);
const reviewStart = readRequired(reviewStartPath);
const antiBackdoor = readRequired(antiBackdoorPath);
const loanBlueprint = readRequired(loanBlueprintPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Smart Contract Module Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Purpose',
  'Source Documents And Surfaces',
  'Week 2 Smart Contract Module Recheck Sequence',
  'Current Module Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Authority Audit And Anti-Backdoor Boundary',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve XPR deployment',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-action-register.md',
  'docs/smartcontractor-smart-contract-state-machine.md',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'docs/smartcontractor-smart-contract-deployment-blockers.md',
  'docs/smartcontractor-smart-contract-local-replay-checklist.md',
  'docs/smartcontractor-smart-contract-local-implementation-package-index.md',
  'docs/smartcontractor-smart-contract-escrow-local-package-start-record.md',
  'docs/smartcontractor-smart-contract-loan-local-package-start-record.md',
  'docs/smartcontractor-smart-contract-collateral-local-package-start-record.md',
  'docs/smartcontractor-smart-contract-review-local-package-start-record.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/gcsc-contract-backed-loan-blueprint.md',
  'Confirm module split remains local-only',
  'Confirm project escrow/milestone module language is escrow-ready only',
  'Confirm loan ledger module language is working-capital readiness only',
  'Confirm repayment waterfall language is preview-only',
  'Confirm token collateral language remains future review only',
  'Confirm peer review/reputation language stays local-review only',
  'Confirm authority model, action register, state machine, and audit event map',
  'Confirm local replay evidence remains PASS_LOCAL_ONLY and BLOCKED_FOR_LIVE',
  'Confirm deployment blockers still stop XPR contract deployment',
  'HOLD_FOR_MODULE_SCOPE_REVIEW',
  'HOLD_FOR_FINANCE_PROVIDER_REVIEW',
  'HOLD_FOR_REPAYMENT_REVIEW',
  'HOLD_FOR_TOKEN_COLLATERAL_REVIEW',
  'HOLD_FOR_REVIEW_REWARD_REVIEW',
  'HOLD_FOR_AUTHORITY_MODEL_REVIEW',
  'HOLD_FOR_AUDIT_REPLAY_REVIEW',
  'Smart Contract Module Week 2 Recheck',
  'Scope: local prep only',
  'xpr_deployment_requested: no',
  'xpr_signature_requested: no',
  'contract_account_creation_requested: no',
  'real_payment_or_loan_or_escrow_action_taken: no',
  'repayment_or_stablecoin_or_token_collateral_action_taken: no',
  'legal_or_provider_or_security_conclusion_made: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_SMART_CONTRACT_MODULE_REVIEW',
  'READY_FOR_SECURITY_REVIEW_PACKET_DRAFT',
  'READY_FOR_REVISION',
  'BLOCKED_FOR_XPR_DEPLOYMENT',
  'BLOCKED_FOR_LIVE_OR_EXTERNAL_ACTION',
  'SMART_CONTRACT_MODULE_REVIEW_RECORDED',
  'internal scope-review marker only',
  'Every privileged action must have a named authority, request ID, audit event, precondition, postcondition, and blocked-live gate',
  'No module may use broad owner powers',
  'Any mismatch between module state, replay evidence, authority model, or audit event map must default to HOLD or BLOCKED',
  'Codex must stop before',
  'npm run check:week-two-smart-contract-module-recheck',
  'npm run check:smart-contract-implementation-gate',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-deployment-blockers',
  'npm run check:smart-contract-state-helpers-local',
  'npm run check:smart-contract-local-replay-packet',
  'npm run check:contract-backed-loan-blueprint',
  'npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor',
  'no-secret, no-private-key, no-XPR-signature, no-contract-account-creation, no-deploy, no-token-custody, no-real-money',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [implementationGate, 'SmartContractor Smart Contract Implementation Gate', implementationGatePath],
  [authorityModel, 'SmartContractor Smart Contract Authority Model', authorityModelPath],
  [actionRegister, 'SmartContractor Smart Contract Action Register', actionRegisterPath],
  [stateMachine, 'SmartContractor Smart Contract State Machine', stateMachinePath],
  [auditMap, 'SmartContractor Smart Contract Audit Event Map', auditMapPath],
  [deploymentBlockers, 'SmartContractor Smart Contract Deployment Blockers', deploymentBlockersPath],
  [localReplay, 'SmartContractor Smart Contract Local Replay Checklist', localReplayPath],
  [packageIndex, 'SmartContractor Smart Contract Local Implementation Package Index', packageIndexPath],
  [escrowStart, 'SmartContractor Smart Contract Escrow Local Package Start Record', escrowStartPath],
  [loanStart, 'SmartContractor Smart Contract Loan Local Package Start Record', loanStartPath],
  [collateralStart, 'SmartContractor Smart Contract Collateral Local Package Start Record', collateralStartPath],
  [reviewStart, 'SmartContractor Smart Contract Review Local Package Start Record', reviewStartPath],
  [antiBackdoor, 'GCSC Whitepaper v1.2 Smart Contract Module Split And Anti-Backdoor Review', antiBackdoorPath],
  [loanBlueprint, 'GCSC Contract-Backed Loan Blueprint', loanBlueprintPath],
]) assertIncludes(content, snippet, file);

for (const snippet of [
  'BLOCKED',
  'READY_FOR_LOCAL_ONLY',
  'APPROVED_FOR_LIVE',
  'XPR',
  'move real funds',
  'production payments',
  'real loans',
  'real escrow',
  'token collateral',
]) assertIncludes(deploymentBlockers, snippet, deploymentBlockersPath);

for (const snippet of [
  'PASS',
  'BLOCKED_FOR_LIVE',
]) assertIncludes(localReplay, snippet, localReplayPath);

assertIncludes(context, 'Week 2 smart contract module recheck', contextPath);
assertIncludes(context, 'check:week-two-smart-contract-module-recheck', contextPath);
assertIncludes(backlog, 'Week 2 smart contract module recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-smart-contract-module-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-smart-contract-module-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-smart-contract-module-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 smart contract module recheck must not contain real URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_smart_contract_module_recheck: recheckPath,
  linked_source_docs_checked: 14,
  live_stop_boundaries_checked: true,
}, null, 2));
