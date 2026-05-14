import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dailyHookPath = resolve('..', 'docs', 'gcsc-daily-work-mode-hook.md');
const nonstopHookPath = resolve('..', 'docs', 'codex-nonstop-execution-hook.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Daily work mode hook validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readRequired(file) {
  assert(existsSync(file), `Missing required file: ${file}`);
  return readFileSync(file, 'utf8');
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

function assertOrdered(content, snippets, file) {
  let cursor = -1;
  for (const snippet of snippets) {
    const next = content.toLowerCase().indexOf(snippet.toLowerCase(), cursor + 1);
    assert(next > cursor, `${file} must keep ordered snippet: ${snippet}`);
    cursor = next;
  }
}

const dailyHook = readRequired(dailyHookPath);
const nonstopHook = readRequired(nonstopHookPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = JSON.parse(readRequired(packagePath));

for (const phrase of [
  'GCSC Daily Work Mode Hook',
  'Before 17:00',
  'After 17:00',
  'Autonomous Nonstop Mode',
  'Founder-Present Evening Mode',
  'This is an operating hook, not legal, financial, deployment, or live-system approval.',
  'When the founder is not home',
  'When asked for a daily audit',
  'what Codex completed while the founder was away',
  'recommended evening agenda with the founder',
  'No live system, secret, account, money, legal, or destructive action happens without explicit founder approval.',
]) {
  assertIncludes(dailyHook, phrase, dailyHookPath);
}

assertOrdered(dailyHook, [
  'Before 17:00: Autonomous Nonstop Mode',
  'Fix failing local tests',
  'Harden local backend/API behavior',
  'Harden local frontend/PWA flows',
  'Prepare documentation and runbooks',
  'Prepare architecture drafts',
  'Prepare smart contract design drafts',
  'Prepare mobile readiness docs',
  'Update backlog/context/audit records',
  'Commit and push only scoped safe files',
], dailyHookPath);

assertOrdered(dailyHook, [
  'After 17:00: Founder-Present Evening Mode',
  'Whitepaper v1.2 positioning',
  'Contract-backed loan architecture',
  'Smart contract module split',
  'Founder Auth and admin activation',
  'Strict RLS review',
  'Legal/provider review packet',
  'Deploy strategy',
  'Public beta plan',
  'Investor/founder package',
  'Mobile release decisions',
], dailyHookPath);

for (const blockedBoundary of [
  'real loans, real escrow, real payments, token collateral, or money movement',
  'live Supabase migrations or live production database changes without explicit founder approval',
  'external account settings, deploy settings, Namecheap, Vercel, GitHub Pages, payment providers, or app stores',
  'passwords, API keys, private keys, seed phrases, service-role keys, or secrets',
  'legal, financial, lender, provider, securities, tax, or compliance decisions',
  'founder business decisions such as public positioning, launch timing, provider choice, or production go/no-go',
]) {
  assertIncludes(dailyHook, blockedBoundary, dailyHookPath);
}

assertOrdered(dailyHook, [
  '`docs/gcsc-active-context.md`',
  '`docs/codex-nonstop-execution-hook.md`',
  '`docs/gcsc-daily-work-mode-hook.md`',
  '`docs/smartcontractor-backlog.md`',
  'git status --short',
], dailyHookPath);

for (const phrase of [
  'docs/gcsc-daily-work-mode-hook.md',
  'Daily Work Mode Hook',
  'Before 17:00 founder local time',
  'After 17:00 founder local time',
  'done while founder was away',
  'needs founder tonight',
]) {
  assertIncludes(nonstopHook, phrase, nonstopHookPath);
}

assertIncludes(context, 'Daily work mode hook', contextPath);
assertIncludes(context, 'docs/gcsc-daily-work-mode-hook.md', contextPath);
assertIncludes(context, 'check:daily-work-mode-hook', contextPath);
assertIncludes(backlog, 'Daily work mode hook', backlogPath);
assertIncludes(backlog, 'check:daily-work-mode-hook', backlogPath);
assertIncludes(packageJson.scripts?.['check:daily-work-mode-hook'] || '', 'scripts/validate-daily-work-mode-hook.mjs', packagePath);

console.log(JSON.stringify({
  status: 'passed',
  daily_hook: dailyHookPath,
  nonstop_hook_linked: true,
  context_linked: true,
  backlog_linked: true,
  autonomous_priorities_checked: 9,
  evening_priorities_checked: 10,
  blocked_boundaries_checked: 6,
}, null, 2));
