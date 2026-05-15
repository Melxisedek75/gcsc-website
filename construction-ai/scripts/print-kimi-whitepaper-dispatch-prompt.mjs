import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const workerIds = [
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
];

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

const dashboardResult = spawnSync(process.execPath, ['scripts/print-kimi-operator-dashboard.mjs'], {
  cwd: resolve('.'),
  encoding: 'utf8',
  shell: false,
});

if (dashboardResult.error) fail(dashboardResult.error.message);
if (dashboardResult.status !== 0) {
  fail('Could not read Kimi operator dashboard', {
    stdout: dashboardResult.stdout,
    stderr: dashboardResult.stderr,
  });
}

let dashboard;
try {
  dashboard = JSON.parse(dashboardResult.stdout);
} catch (error) {
  fail(`Kimi operator dashboard did not print JSON: ${error.message}`, {
    stdout: dashboardResult.stdout,
  });
}

if (dashboard.status !== 'ready_local_only') {
  fail('Kimi operator dashboard must be ready_local_only before printing dispatch prompt', {
    status: dashboard.status,
    missing_required_docs: dashboard.missing_required_docs,
    missing_latest_artifacts: dashboard.missing_latest_artifacts,
  });
}

const whitepaperRevisionCopyPasteDispatch = dashboard.whitepaper_revision_copy_paste_dispatch;
if (!Array.isArray(whitepaperRevisionCopyPasteDispatch) || whitepaperRevisionCopyPasteDispatch.length !== workerIds.length) {
  fail('whitepaper_revision_copy_paste_dispatch must include seven worker prompt paths', {
    whitepaper_revision_copy_paste_dispatch: whitepaperRevisionCopyPasteDispatch,
  });
}

const latestPaths = dashboard.latest_paths ?? {};
const uploadAllowlist = [
  latestPaths.whitepaper_revision_controller_start_here,
  latestPaths.whitepaper_revision_worker_assignment_csv,
  latestPaths.whitepaper_revision_manifest,
  latestPaths.whitepaper_revision_readme,
  ...workerIds.map((workerId) => dashboard.whitepaper_revision_worker_prompt_files?.[workerId]),
].filter(Boolean);

for (const workerId of workerIds) {
  const promptPath = dashboard.whitepaper_revision_worker_prompt_files?.[workerId];
  if (!promptPath || !existsSync(promptPath)) {
    fail('Missing whitepaper revision worker prompt file', { workerId, promptPath });
  }
}

const prompt = [
  'KIMI WHITEPAPER V1.2 REVISION DISPATCH',
  'WHITEPAPER_REVISION_LOCAL_ONLY',
  '',
  'Goal: run the local-only whitepaper v1.2 public draft revision split without taking any live, public, legal, money, payment, loan, escrow, repayment, stablecoin, token collateral, or external account action.',
  '',
  'Give each worker exactly one prompt file below.',
  'Review order: Kimi workers -> Claude-Audit -> Codex-Integration',
  'Audit gate: Send every Kimi output to Claude-Audit before Codex-Integration applies anything.',
  '',
  'Worker prompt files:',
  ...whitepaperRevisionCopyPasteDispatch,
  '',
  'Upload allowlist:',
  ...uploadAllowlist.map((filePath) => `- ${filePath}`),
  '',
  'Do not upload the whole project.',
  'Do not upload .env files.',
  'Do not upload credentials, private keys, tokens, service-role keys, Magic Link URLs, wallet material, or raw database passwords.',
  'Do not upload private customer data, screenshots, recordings, or raw logs.',
  '',
  'Required return format:',
  '- worker_id:',
  '- output_files_created:',
  '- source_files_reviewed:',
  '- blocked_items:',
  '- safety_notes:',
  '- status: PASS_LOCAL_ONLY or NEEDS_REVIEW',
  '',
  'Stop boundaries:',
  '- No secrets, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
  '- No public publication, website/PDF/deck/email/social publishing, launch announcement, or external account change.',
  '- No live Supabase writes, production deploy settings, app-store actions, XPR signatures, or wallet operations.',
  '- No XPR signatures, wallet operations, live contract calls, or chain authority changes.',
  '- No real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, provider commitment, or financial commitment.',
  '- No token collateral locks, collateral release, collateral settlement, or collateral custody changes.',
  '- No legal decision, legal advice, attorney conclusion, compliance conclusion, or lender/provider approval claim.',
  '',
  'Codex integration rule: Codex may integrate only Claude-approved PASS_LOCAL_ONLY output after local checks pass.',
].join('\n');

console.log(prompt);
