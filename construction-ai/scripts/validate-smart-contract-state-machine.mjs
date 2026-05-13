import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const statePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const fixturePath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const actionPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract state machine validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const state = readRequired(statePath);
const gate = readRequired(gatePath);
const authority = readRequired(authorityPath);
const fixtures = readRequired(fixturePath);
const actions = readRequired(actionPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'SmartContractor Smart Contract State Machine',
  'Purpose',
  'Project Escrow States',
  'Loan Ledger States',
  'Token Collateral States',
  'Peer Review Reward States',
  'Global Pause Rules',
  'Required Links',
  'Not Allowed',
  'Required Checks',
]) assertIncludes(state, section, statePath);

for (const required of [
  'internal state-machine draft only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'local-only state transitions',
  'project escrow',
  'contractor credit',
  'repayment waterfall',
  'token collateral',
  'peer review reward',
  'dispute pause',
  'emergency pause',
  'authority flows',
  'draft',
  'pending_review',
  'active',
  'milestone_submitted',
  'under_review',
  'release_recommended',
  'disputed',
  'paused',
  'completed',
  'cancelled',
  'archived',
  'requested',
  'scoring',
  'provider_review',
  'offer_recorded',
  'repayment_plan_recorded',
  'repayment_event_recorded',
  'default_label',
  'repaid_label',
  'declined',
  'demo_locked',
  'price_snapshot_recorded',
  'ltv_checked',
  'liquidation_blocked',
  'release_label_recorded',
  'submitted',
  'scored',
  'reward_label_recorded',
  'abuse_flagged',
  'admin_review',
  'Emergency pause may move any non-terminal module fixture to `paused`',
  'must not move real funds',
  'approve real loans',
  'release real escrow',
  'route real repayments',
  'lock real token collateral',
  'settle stablecoins',
  'issue real rewards',
  'liquidate collateral',
  'Unpause requires stronger authority than pause',
  'Terminal states cannot be reopened',
  'Every state transition must create an audit event',
  'docs/smartcontractor-smart-contract-design.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-test-fixtures.md',
  'docs/smartcontractor-smart-contract-action-register.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'Real payment movement',
  'Real loan approval or origination',
  'Real escrow holding or release',
  'Real token collateral locking',
  'Real repayment routing',
  'Real stablecoin settlement',
  'Real token rewards',
  'Auto-liquidation',
  'AI-only approval',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(state, required, statePath);

assertIncludes(gate, 'audit event mapping', gatePath);
assertIncludes(authority, 'pause controls', authorityPath);
assertIncludes(fixtures, 'state transitions', fixturePath);
assertIncludes(actions, 'audit event names', actionPath);
assertIncludes(context, 'Smart contract state machine', contextPath);
assertIncludes(context, 'check:smart-contract-state-machine', contextPath);
assertIncludes(backlog, 'Smart contract state machine', backlogPath);
assertIncludes(backlog, 'check:smart-contract-state-machine', backlogPath);
assertIncludes(audit, 'Smart contract state machine', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(state)) {
  fail('Smart contract state machine must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_state_machine: statePath,
  no_real_money_state_transitions_checked: true,
}, null, 2));
