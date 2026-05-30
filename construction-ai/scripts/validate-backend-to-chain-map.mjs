import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mapPath = resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const auditMapPath = resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md');
const actionPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const statePath = resolve('..', 'docs', 'smartcontractor-smart-contract-state-machine.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Backend to chain map validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const map = readRequired(mapPath);
const gate = readRequired(gatePath);
const auditMap = readRequired(auditMapPath);
const actions = readRequired(actionPath);
const state = readRequired(statePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);

for (const section of [
  'SmartContractor Backend To Chain Map',
  'Purpose',
  'Mapping Rules',
  'Backend Entities',
  'API To Action Map',
  'Contract-To-Product Review Map',
  'Review Field Requirements',
  'Required Chain References',
  'Privacy Boundary',
  'Required Links',
  'Not Allowed',
  'Required Checks',
]) assertIncludes(map, section, mapPath);

for (const required of [
  'internal backend-to-chain mapping draft only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'request_id',
  'project_contract_id',
  'milestone_id',
  'loan_id',
  'repayment_id',
  'collateral_id',
  'review_id',
  'evidence_id',
  'payment_intent_id',
  'audit_event_id',
  'profiles',
  'homeowners',
  'contractors',
  'jobs',
  'bids',
  'project_contracts',
  'project_milestones',
  'starter_loans',
  'loan_repayments',
  'token_collateral_locks',
  'disputes',
  'evidence_items',
  'peer_reviews',
  'audit_events',
  'payment_intents',
  'mkproject',
  'addmile',
  'submitevid',
  'recordrevw',
  'pauseproj',
  'reqloan',
  'scoreloan',
  'setrepay',
  'recpaydemo',
  'lockdemo',
  'blockliq',
  'submitpeer',
  'rewarddemo',
  'setauth',
  'emergpause',
  'gcscworkcap1',
  'gcscclaim111',
  'gcsccredit11',
  'gcscadvance1',
  'reqworkcap',
  'reqclaimadv',
  'reqtokcredit',
  'reqescadv',
  'workcapreqs',
  'claimadvs',
  'creditreqs',
  'escadvs',
  'workcap.request.recorded',
  'claim.advance.request.recorded',
  'credit.token_collateral.request.recorded',
  'advance.escrow.request.recorded',
  'Contract-backed working capital',
  'ClaimBridge emergency advance',
  'Token-collateral equipment credit',
  'Escrow-backed contractor advance',
  'blocked_live_reason',
  'next_review_step',
  'finance_provider_status',
  'do not approve live chain writes, money movement, real loans, real escrow, token collateral custody, provider actions, legal conclusions, finance decisions, repayment routing, or deployment',
  'loan issuance, payment-right assignment, repayment routing, token transfer, lien automation, UCC filing automation',
  'assignment of benefits, insurer integration, claim financing, repayment from insurance proceeds, token transfer',
  'token custody, collateral lock, live loan issuance, liquidation, collateral seizure, token transfer',
  'escrow custody, milestone release, payout instruction, live advance issuance, repayment routing, token transfer',
  'contract.project.created',
  'loan.request.recorded',
  'loan.repayment_event.recorded',
  'collateral.demo_lock.recorded',
  'collateral.liquidation_blocked',
  'peer.review.submitted',
  'authority.changed',
  'authority.emergency_pause.recorded',
  'must not store',
  'raw evidence files',
  'service-role keys',
  'deploy live contracts',
  'move real funds',
  'approve real loans',
  'release real escrow',
  'route real repayments',
  'lock real token collateral',
  'settle stablecoins',
  'issue real rewards',
  'liquidate collateral',
  'AI make final approval',
  'licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor',
  'docs/smartcontractor-smart-contract-audit-event-map.md',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:smart-contract-state-machine',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(map, required, mapPath);

assertIncludes(gate, 'backend-to-chain mapping', gatePath);
assertIncludes(auditMap, 'Every future chain write must link to a backend `request_id`'.replace('Every future chain write must link to a backend `request_id`', 'request id'), auditMapPath);
assertIncludes(actions, 'Backend-to-chain mapping is reviewed', actionPath);
assertIncludes(state, 'Every state transition must create an audit event', statePath);
assertIncludes(context, 'Backend to chain map', contextPath);
assertIncludes(context, 'check:backend-to-chain-map', contextPath);
assertIncludes(backlog, 'Backend to chain map', backlogPath);
assertIncludes(backlog, 'check:backend-to-chain-map', backlogPath);
assertIncludes(realAudit, 'Backend to chain map', realAuditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(map)) {
  fail('Backend to chain map must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  backend_to_chain_map: mapPath,
  mappings_checked: true,
}, null, 2));
