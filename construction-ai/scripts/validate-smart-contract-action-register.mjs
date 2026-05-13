import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const registerPath = resolve('..', 'docs', 'smartcontractor-smart-contract-action-register.md');
const gatePath = resolve('..', 'docs', 'smartcontractor-smart-contract-implementation-gate.md');
const authorityPath = resolve('..', 'docs', 'smartcontractor-smart-contract-authority-model.md');
const fixturePath = resolve('..', 'docs', 'smartcontractor-smart-contract-test-fixtures.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Smart contract action register validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const register = readRequired(registerPath);
const gate = readRequired(gatePath);
const authority = readRequired(authorityPath);
const fixtures = readRequired(fixturePath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

for (const section of [
  'SmartContractor Smart Contract Action Register',
  'Purpose',
  'Project Escrow Actions',
  'Loan Ledger Actions',
  'Token Collateral Actions',
  'Peer Review Reward Actions',
  'Authority And Safety Actions',
  'Naming Rules',
  'Required Before Coding',
  'Required Checks',
]) assertIncludes(register, section, registerPath);

for (const required of [
  'internal action naming draft only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve live XPR contract deployment',
  'draft action names',
  'table names',
  'audit event names',
  'project contracts',
  'milestones',
  'contractor credit',
  'repayment waterfalls',
  'disputes',
  'token collateral labels',
  'peer review',
  'authority controls',
  'no-real-money test fixtures',
  'createproj',
  'addmile',
  'submitev',
  'markreview',
  'pauseproj',
  'resolveproj',
  'reqloan',
  'scoreloan',
  'offerloan',
  'repayplan',
  'repayevt',
  'defaultln',
  'lockdemo',
  'snapprice',
  'ltvcheck',
  'releasecol',
  'blockliq',
  'submitrev',
  'scorerev',
  'rewardrev',
  'flagabuse',
  'pauserev',
  'pausemod',
  'unpausemod',
  'setauth',
  'setmsig',
  'emergstop',
  'contract.project.created',
  'loan.repayment_event.recorded',
  'collateral.liquidation_blocked',
  'peer.review.reward_label.recorded',
  'authority.emergency_pause.recorded',
  'without moving real funds',
  'not a real loan approval',
  'without issuing real tokens',
  'Action names must stay short enough',
  'Table names must map back to backend table names',
  'Audit events must use dotted names',
  'Every action must map to a caller role',
  'Every local fixture action must map to a no-real-money scenario',
  'No action may imply real loan approval',
  'real escrow release',
  'real repayment routing',
  'real token collateral lock',
  'real stablecoin settlement',
  'auto-liquidation',
  'Backend-to-chain mapping is reviewed',
  'Authority model is reviewed',
  'Local no-real-money fixtures are reviewed',
  'Audit event mapping is reviewed',
  'Founder approves exact module scope',
  'Legal/provider review confirms public wording',
  'Security review confirms action permissions',
  'npm run check:smart-contract-action-register',
  'npm run check:smart-contract-test-fixtures',
  'npm run check:smart-contract-authority-model',
  'npm run check:smart-contract-implementation-gate',
  'npm run check',
]) assertIncludes(register, required, registerPath);

assertIncludes(gate, 'action names and table names', gatePath);
assertIncludes(authority, 'action permissions', authorityPath);
assertIncludes(fixtures, 'action shape', fixturePath);
assertIncludes(context, 'Smart contract action register', contextPath);
assertIncludes(context, 'check:smart-contract-action-register', contextPath);
assertIncludes(backlog, 'Smart contract action register', backlogPath);
assertIncludes(backlog, 'check:smart-contract-action-register', backlogPath);
assertIncludes(audit, 'Smart contract action register', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(register)) {
  fail('Smart contract action register must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_action_register: registerPath,
  action_names_checked: true,
}, null, 2));
