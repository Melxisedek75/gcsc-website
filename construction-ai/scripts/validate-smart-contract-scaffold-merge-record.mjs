import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mergeRecordPath = resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-merge-record.md');
const requiredDocPaths = [
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-review-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-file-manifest.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-scaffold-handoff-template.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-code-ownership-plan.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-local-replay-checklist.md'),
  resolve('..', 'docs', 'smartcontractor-smart-contract-audit-event-map.md'),
  resolve('..', 'docs', 'smartcontractor-backend-to-chain-map.md'),
];
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const realAuditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message) {
  console.error(`Smart contract scaffold merge record validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const mergeRecord = readRequired(mergeRecordPath);
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
  'SmartContractor Smart Contract Scaffold Merge Record',
  'Purpose',
  'Required Record Fields',
  'Merge Evidence Checklist',
  'Decision States',
  'Required Checks',
]) assertIncludes(mergeRecord, section, mergeRecordPath);

for (const required of [
  'internal scaffold merge record only',
  'does not approve real escrow',
  'does not approve real loans',
  'does not approve token collateral',
  'does not approve production payments',
  'does not approve repayment routing',
  'does not approve stablecoin settlement',
  'does not approve live XPR contract deployment',
  'local code scaffolding only',
  'constants',
  'types',
  'pure state-transition helpers',
  'validator-only fixtures',
  'serialization tests',
  'local replay harness placeholders',
  'project escrow',
  'loan ledger',
  'token collateral',
  'peer review rewards',
  'authority controls',
  'backend-to-chain map',
  'merge_record_id',
  'handoff_id',
  'review_id',
  'module_owner',
  'reviewer',
  'allowed_files',
  'blocked_files_checked',
  'fixture_set',
  'local_replay_status',
  'audit_event_map_status',
  'deployment_status',
  'BLOCKED_FOR_LIVE',
  'MERGED_LOCAL_ONLY',
  'REVISE',
  'HOLD',
  'NO_GO',
  'no live XPR',
  'no real payment',
  'no real loan',
  'no real escrow',
  'no repayment routing',
  'no token collateral liquidation',
  'no stablecoin settlement',
  'no AI final authority',
  'live money',
  'secrets',
  'external accounts',
  'public claims',
  'npm run check:smart-contract-scaffold-merge-record',
  'npm run check:smart-contract-scaffold-review',
  'npm run check:smart-contract-scaffold-file-manifest',
  'npm run check:smart-contract-scaffold-handoff',
  'npm run check:smart-contract-code-ownership',
  'npm run check:smart-contract-local-replay',
  'npm run check:smart-contract-audit-event-map',
  'npm run check:backend-to-chain-map',
  'npm run check',
]) assertIncludes(mergeRecord, required, mergeRecordPath);

assertIncludes(context, 'Smart contract scaffold merge record', contextPath);
assertIncludes(context, 'check:smart-contract-scaffold-merge-record', contextPath);
assertIncludes(backlog, 'Smart contract scaffold merge record', backlogPath);
assertIncludes(backlog, 'check:smart-contract-scaffold-merge-record', backlogPath);
assertIncludes(realAudit, 'Smart contract scaffold merge record', realAuditPath);

const scriptName = 'check:smart-contract-scaffold-merge-record';
if (!packageJson.scripts?.[scriptName]) fail(`package.json must define ${scriptName}`);
assertIncludes(runner, scriptName, runnerPath);
assertIncludes(ciValidator, scriptName, ciValidatorPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(mergeRecord)) {
  fail('Smart contract scaffold merge record must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  smart_contract_scaffold_merge_record: mergeRecordPath,
  scaffold_merge_record_checked: true,
}, null, 2));
