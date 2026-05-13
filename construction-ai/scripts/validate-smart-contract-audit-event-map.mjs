import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const fixturePath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const actionPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const statePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract audit event map validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const auditMap = readRequired(auditMapPath);
const gate = readRequired(gatePath);
const authority = readRequired(authorityPath);
const fixtures = readRequired(fixturePath);
const actions = readRequired(actionPath);
const state = readRequired(statePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);

for (const section of [
  'SmartContractor Smart Contract Audit Event Map',
  'Purpose',
  'Event Naming Rules',
  'Required Audit Fields',
  'Project Escrow Events',
  'Loan Ledger Events',
  'Token Collateral Events',
  'Peer Review Reward Events',
  'Authority And Safety Events',
  'Required Links',
  'Not Allowed',
  'Required Checks',
]) assertIncludes(auditMap, section, auditMapPath);

for (const required of [
  'internal audit-event mapping draft only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'project escrow',
  'contractor credit',
  'repayment waterfall',
  'token collateral',
  'peer review reward',
  'dispute pause',
  'emergency pause',
  'authority flows',
  'Every state transition must create an audit event',
  'Every authority change must create an audit event',
  'event_id',
  'request_id',
  'module',
  'actor_account',
  'actor_role',
  'action_name',
  'previous_state',
  'next_state',
  'project_contract_id',
  'milestone_id',
  'loan_id',
  'collateral_id',
  'review_id',
  'evidence_id',
  'safety_gate',
  'provider_review_status',
  'founder_approval_status',
  'legal_provider_status',
  'created_at',
  'contract.project.created',
  'contract.milestone.added',
  'contract.milestone.evidence_submitted',
  'contract.milestone.review_recorded',
  'contract.project.paused',
  'contract.project.dispute_resolved',
  'loan.request.recorded',
  'loan.score.recorded',
  'loan.provider_review.recorded',
  'loan.offer.recorded',
  'loan.repayment_plan.recorded',
  'loan.repayment_event.recorded',
  'loan.default_label.recorded',
  'loan.repaid_label.recorded',
  'collateral.demo_lock.recorded',
  'collateral.price_snapshot.recorded',
  'collateral.ltv_check.recorded',
  'collateral.release_label.recorded',
  'collateral.liquidation_blocked',
  'peer.review.submitted',
  'peer.review.score_recorded',
  'peer.review.reward_label.recorded',
  'peer.review.abuse_flagged',
  'peer.review.paused',
  'authority.module.paused',
  'authority.module.unpaused',
  'authority.changed',
  'authority.multisig.recorded',
  'authority.emergency_pause.recorded',
  'must not move funds',
  'approve real loans',
  'release real escrow',
  'route real repayments',
  'lock real token collateral',
  'settle stablecoins',
  'issue real rewards',
  'liquidate collateral',
  'AI make final approval',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'docs/smartcontractor-smart-contract-design.md',
  'docs/smartcontractor-smart-contract-implementation-gate.md',
  'docs/smartcontractor-smart-contract-authority-model.md',
  'docs/smartcontractor-smart-contract-test-fixtures.md',
  'docs/smartcontractor-smart-contract-action-register.md',
  'docs/smartcontractor-smart-contract-state-machine.md',
  'docs/smartcontractor-loan-legal-risk-model.md',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(auditMap, required, auditMapPath);

assertIncludes(gate, 'audit event mapping', gatePath);
assertIncludes(authority, 'Authority changes must be recorded', authorityPath);
assertIncludes(fixtures, 'audit fixture', fixturePath);
assertIncludes(actions, 'audit event names', actionPath);
assertIncludes(state, 'Every state transition must create an audit event', statePath);
assertIncludes(context, 'Smart contract audit event map', contextPath);
assertIncludes(context, 'check:smart-contract-audit-event-map', contextPath);
assertIncludes(backlog, 'Smart contract audit event map', backlogPath);
assertIncludes(backlog, 'check:smart-contract-audit-event-map', backlogPath);
assertIncludes(realAudit, 'Smart contract audit event map', realAuditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(auditMap)) {
  fail('Smart contract audit event map must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_audit_event_map: auditMapPath,
  audit_events_checked: true,
}, null, 2));
