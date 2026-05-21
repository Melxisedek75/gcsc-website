import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const boardPath = resolve('..', 'docs', 'smartcontractor-founder-evening-command-board.md');
const dailyHookPath = resolve('..', 'docs', 'gcsc-daily-work-mode-hook.md');
const nonstopHookPath = resolve('..', 'docs', 'codex-nonstop-execution-hook.md');
const architecturePath = resolve('..', 'docs', 'gcsc-v1-2-core-architecture-package.md');
const loanBlueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const loanRequirementsPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-technical-requirements.md');
const moduleSplitPath = resolve('..', 'docs', 'whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md');
const legalProviderPath = resolve('..', 'docs', 'whitepaper-v1-2-legal-provider-review-prep.md');
const founderAuthPath = resolve('..', 'docs', 'smartcontractor-founder-auth-admin-activation-prep.md');
const deploymentPath = resolve('..', 'docs', 'smartcontractor-deployment-decision-prep.md');
const publicBetaPath = resolve('..', 'docs', 'smartcontractor-public-beta-founder-execution-plan.md');
const investorPath = resolve('..', 'docs', 'smartcontractor-investor-founder-package.md');
const mobilePath = resolve('..', 'docs', 'smartcontractor-mobile-release-go-no-go-matrix.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packageJsonPath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Founder evening command board validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const board = readRequired(boardPath);
const dailyHook = readRequired(dailyHookPath);
const nonstopHook = readRequired(nonstopHookPath);
const architecture = readRequired(architecturePath);
const loanBlueprint = readRequired(loanBlueprintPath);
const loanRequirements = readRequired(loanRequirementsPath);
const moduleSplit = readRequired(moduleSplitPath);
const legalProvider = readRequired(legalProviderPath);
const founderAuth = readRequired(founderAuthPath);
const deployment = readRequired(deploymentPath);
const publicBeta = readRequired(publicBetaPath);
const investor = readRequired(investorPath);
const mobile = readRequired(mobilePath);
const audit = readRequired(auditPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packageJsonPath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Founder Evening Command Board',
  'Status: INTERNAL_EVENING_COMMAND_BOARD_ONLY',
  'Purpose',
  'Operating Rule',
  'Priority Board',
  'Default Next Task Rule',
  'Evening Cutover Guard',
  'Founder-Facing Status Format',
  'Current Evening Session Run Sheet',
  'Cross-Workstream Decision Handoff Matrix',
  'Founder Evening Decision Packet Reading Order',
  'Current Recommended Sequence',
  'Required Source Documents',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(board, section, boardPath);

for (const required of [
  'founder standing approval',
  'after-17:00 priority board',
  'without requiring repeated "approve point N" messages',
  'Stop the old monotone micro-validator loop',
  'Do not extend long same-family validator chains just because another chain node exists',
  'Prefer workstream deliverables that help the founder make evening decisions',
  'Micro-validator continuation is allowed only when it directly supports one of the priority-board workstreams',
  'Record the workstream and founder-facing value in the final heartbeat message',
  'Evening session state',
  'highest-value internal workstream',
  'Founder action needed tonight',
  'Do not ask for another approval unless the next step crosses a stop boundary',
  'If the founder asks for status, answer from this run sheet first',
  'handoff_readiness_state',
  'READY_FOR_FOUNDER_REVIEW, NEEDS_INTERNAL_PACKET_UPDATE, BLOCKED_FOR_LIVE_ACTION, or HOLD_FOR_EXTERNAL_REVIEW',
  'decision_owner',
  'evidence_packet',
  'blocked_next_action',
  'Do not convert a handoff row into a live Supabase change, external account action, production deploy setting, real payment, real loan, escrow release, repayment routing, stablecoin settlement, token collateral lock, legal decision, provider commitment, public sharing, mobile store action, or public launch',
  'decision_packet_reading_state',
  'READY_FOR_FOUNDER_REVIEW, NEEDS_PACKET_REFRESH, HOLD_FOR_LIVE_BOUNDARY, HOLD_FOR_LEGAL_PROVIDER_REVIEW, or NO_GO',
  'decision_packet_reading_order',
  'public wording, contract-backed loan, smart contract architecture, Founder Auth/Admin, legal/provider review, deployment, public beta, investor/founder package, mobile release',
  'decision_packet_reading_evidence',
  'decision_packet_reading_blocked_action',
  'Do not treat the reading order as approval to edit public files, send packets, contact providers, change accounts, deploy production, publish beta links, submit stores, approve loans, route payments, release escrow, settle stablecoins, lock token collateral, make legal decisions, or launch publicly',
  'Stop before any live/external/legal/money action',
  'GCSC v1.2 / public wording',
  'Contract-backed loan',
  'Smart contract architecture',
  'Founder Auth/Admin',
  'Legal/provider review',
  'Deployment decision prep',
  'Public beta planning',
  'Investor/founder package',
  'Mobile release decisions',
  'Vercel',
  'GitHub Pages',
  'DNS/Namecheap',
  'Magic Link',
  'admin_memberships',
  'strict RLS',
  'real payments',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'live XPR deployment',
  'legal decisions',
  'financial/provider commitments',
  'public launch',
  'production deploy settings',
  'npm run check:founder-evening-command-board',
  'npm run check:daily-work-mode-hook',
  'npm run check:public-beta-founder-execution-plan',
  'npm run check:contract-backed-loan-blueprint',
  'npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements',
  'npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor',
  'npm run check:founder-auth-admin-activation-prep',
  'npm run check:deployment-decision-prep',
  'npm run check:investor-founder-package',
  'npm run check:mobile-release-go-no-go',
]) assertIncludes(board, required, boardPath);

for (const linkedDoc of [
  'docs/gcsc-daily-work-mode-hook.md',
  'docs/codex-nonstop-execution-hook.md',
  'docs/gcsc-v1-2-core-architecture-package.md',
  'docs/gcsc-contract-backed-loan-blueprint.md',
  'docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md',
  'docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md',
  'docs/whitepaper-v1-2-legal-provider-review-prep.md',
  'docs/smartcontractor-founder-auth-admin-activation-prep.md',
  'docs/smartcontractor-deployment-decision-prep.md',
  'docs/smartcontractor-public-beta-founder-execution-plan.md',
  'docs/smartcontractor-investor-founder-package.md',
  'docs/smartcontractor-mobile-release-go-no-go-matrix.md',
]) assertIncludes(board, linkedDoc, boardPath);

for (const [content, snippet, file] of [
  [dailyHook, 'Founder Standing Approval For Internal Evening Work', dailyHookPath],
  [nonstopHook, 'Founder-Present Evening Mode', nonstopHookPath],
  [architecture, 'FOUNDER_APPROVED_INTERNAL_SOURCE_OF_TRUTH', architecturePath],
  [loanBlueprint, 'Contract-Backed Loan Blueprint', loanBlueprintPath],
  [loanRequirements, 'Contract-Backed Loan Technical Requirements', loanRequirementsPath],
  [moduleSplit, 'Smart Contract Module Split And Anti-Backdoor Review', moduleSplitPath],
  [legalProvider, 'GCSC Whitepaper v1.2 Legal Provider Review Prep', legalProviderPath],
  [founderAuth, 'SmartContractor Founder Auth/Admin Activation Prep', founderAuthPath],
  [deployment, 'SmartContractor Deployment Decision Prep', deploymentPath],
  [publicBeta, 'SmartContractor Public Beta Founder Execution Plan', publicBetaPath],
  [investor, 'SmartContractor Investor Founder Package', investorPath],
  [mobile, 'SmartContractor Mobile Release Go/No-Go Matrix', mobilePath],
]) assertIncludes(content, snippet, file);

assertIncludes(context, 'Founder evening command board', contextPath);
assertIncludes(context, 'Founder evening command board cross-workstream decision handoff matrix', contextPath);
assertIncludes(context, 'Founder evening decision packet reading order', contextPath);
assertIncludes(context, 'check:founder-evening-command-board', contextPath);
assertIncludes(backlog, 'Founder evening command board', backlogPath);
assertIncludes(backlog, 'Founder evening command board cross-workstream decision handoff matrix', backlogPath);
assertIncludes(backlog, 'Founder evening decision packet reading order', backlogPath);
assertIncludes(backlog, 'check:founder-evening-command-board', backlogPath);
assertIncludes(audit, 'Founder evening command board', auditPath);
assertIncludes(audit, 'Founder evening command board cross-workstream decision handoff matrix', auditPath);
assertIncludes(audit, 'Founder evening decision packet reading order', auditPath);
assertIncludes(packageJson, '"check:founder-evening-command-board"', packageJsonPath);
assertIncludes(runner, '"check:founder-evening-command-board"', runnerPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(board)) {
  fail('Founder evening command board must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_evening_command_board: boardPath,
  priority_workstreams_checked: 9,
  linked_source_docs_checked: 12,
  live_risk_boundaries_checked: true,
}, null, 2));
