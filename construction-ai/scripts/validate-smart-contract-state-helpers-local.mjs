import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLOCKED_AUTHORITY_FLAGS,
  DEMO_AUTHORITY_PAUSE_FIXTURE,
} from '../src/smart-contracts/state/authorityControlState.mjs';
import {
  BLOCKED_COLLATERAL_FLAGS,
  DEMO_COLLATERAL_LTV_FIXTURE,
} from '../src/smart-contracts/state/collateralEstimateState.mjs';
import {
  BLOCKED_ESCROW_FLAGS,
  DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE,
} from '../src/smart-contracts/state/escrowMilestoneState.mjs';
import {
  BLOCKED_LOAN_FLAGS,
  DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE,
} from '../src/smart-contracts/state/loanLedgerState.mjs';
import {
  BLOCKED_PEER_REVIEW_REWARD_FLAGS,
  DEMO_PEER_REVIEW_REWARD_FIXTURE,
} from '../src/smart-contracts/state/peerReviewRewardState.mjs';

const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

const helperSpecs = [
  {
    name: 'authority',
    fixture: DEMO_AUTHORITY_PAUSE_FIXTURE,
    flags: BLOCKED_AUTHORITY_FLAGS,
  },
  {
    name: 'escrow',
    fixture: DEMO_ESCROW_RELEASE_RECOMMENDATION_FIXTURE,
    flags: BLOCKED_ESCROW_FLAGS,
  },
  {
    name: 'loan',
    fixture: DEMO_LOAN_REPAYMENT_WATERFALL_FIXTURE,
    flags: BLOCKED_LOAN_FLAGS,
  },
  {
    name: 'collateral',
    fixture: DEMO_COLLATERAL_LTV_FIXTURE,
    flags: BLOCKED_COLLATERAL_FLAGS,
  },
  {
    name: 'review',
    fixture: DEMO_PEER_REVIEW_REWARD_FIXTURE,
    flags: BLOCKED_PEER_REVIEW_REWARD_FLAGS,
  },
];

function fail(message) {
  console.error(`Smart contract state helpers local validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const spec of helperSpecs) {
  if (!spec.fixture.local_only) fail(`${spec.name} fixture must be local_only`);
  if (spec.fixture.deployment_status !== 'BLOCKED_FOR_LIVE') fail(`${spec.name} fixture must be BLOCKED_FOR_LIVE`);

  for (const [flag, value] of Object.entries(spec.flags)) {
    if (value !== false) fail(`${spec.name}.${flag} must be false`);
    if (spec.fixture[flag] !== false) fail(`${spec.name} fixture ${flag} must be false`);
  }
}

for (const scriptName of [
  'check:smart-contract-authority-state-local',
  'check:smart-contract-escrow-state-local',
  'check:smart-contract-loan-state-local',
  'check:smart-contract-collateral-state-local',
  'check:smart-contract-review-state-local',
  'check:smart-contract-state-helpers-local',
]) {
  if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
  assertIncludes(runner, scriptName, runnerPath);
  assertIncludes(ciValidator, scriptName, ciValidatorPath);
}

assertIncludes(context, 'Smart contract state helpers local aggregate validator', contextPath);
assertIncludes(context, 'check:smart-contract-state-helpers-local', contextPath);
assertIncludes(backlog, 'Smart contract state helpers local aggregate validator', backlogPath);
assertIncludes(backlog, 'check:smart-contract-state-helpers-local', backlogPath);
assertIncludes(realAudit, 'Smart contract state helpers local aggregate validator', realAuditPath);

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_state_helpers_local_aggregate: true,
  modules_checked: helperSpecs.map((spec) => spec.name),
  blocked_flag_sets_checked: helperSpecs.reduce((total, spec) => total + Object.keys(spec.flags).length, 0),
}, null, 2));
