import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const manifestPath = resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-file-manifest.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-code-ownership-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-handoff-template.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-coding-readiness-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md'),
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract scaffold file manifest validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const manifest = readRequired(manifestPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const realAudit = readRequired(realAuditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const docPath of requiredDocPaths) {
  readRequired(docPath);
}

for (const section of [
  'SmartContractor Smart Contract Scaffold File Manifest',
  'Purpose',
  'Manifest Rules',
  'Planned Directories',
  'Planned Files',
  'Blocked File Names',
  'Required Links',
  'Required Checks',
]) assertIncludes(manifest, section, manifestPath);

for (const required of [
  'internal scaffold file manifest only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'local code scaffolding',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'backend-to-chain map',
  'module_owner',
  'reviewer',
  'handoff_id',
  'fixture_set',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'constants/projectEscrowConstants.ts',
  'constants/loanLedgerConstants.ts',
  'constants/tokenCollateralConstants.ts',
  'constants/peerReviewRewardConstants.ts',
  'constants/authorityControlConstants.ts',
  'types/backendChainMapTypes.ts',
  'fixtures/smartContractDemoFixtures.ts',
  'replay/localReplayPlan.ts',
  'serialization/auditEventSerialization.ts',
  'deploy.ts',
  'mainnet.ts',
  'releasePayment.ts',
  'approveLoan.ts',
  'routeRepayment.ts',
  'liquidateCollateral.ts',
  'settleStablecoin.ts',
  'aiFinalDecision.ts',
  'no live XPR',
  'real payment',
  'real loan',
  'real escrow',
  'repayment routing',
  'token collateral liquidation',
  'stablecoin settlement',
  'AI final authority',
  'npm run check:smart-contract-scaffold-file-manifest',
  'npm run check:smart-contract-scaffold-handoff',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-coding-readiness',
  'npm run check:smart-contract-local-replay',
  'npm run check:backend-to-chain-map',
  'npm run check:smart-contract-audit-event-map',
  'npm run check',
]) assertIncludes(manifest, required, manifestPath);

assertIncludes(context, 'Smart contract scaffold file manifest', contextPath);
assertIncludes(context, 'check:smart-contract-scaffold-file-manifest', contextPath);
assertIncludes(backlog, 'Smart contract scaffold file manifest', backlogPath);
assertIncludes(backlog, 'check:smart-contract-scaffold-file-manifest', backlogPath);
assertIncludes(realAudit, 'Smart contract scaffold file manifest', realAuditPath);

const scriptName = 'check:smart-contract-scaffold-file-manifest';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(manifest)) {
  fail('Smart contract scaffold file manifest must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_scaffold_file_manifest: manifestPath,
  scaffold_file_manifest_checked: true,
}, null, 2));
