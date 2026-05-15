import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve('..');
const docsRoot = resolve(projectRoot, 'docs');
const tmpRoot = resolve(projectRoot, '.tmp');

function latestFile(folder, prefix, suffix) {
  if (!existsSync(folder)) return null;

  const candidates = readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith(prefix) && entry.name.endsWith(suffix))
    .map((entry) => {
      const fullPath = join(folder, entry.name);
      return {
        path: fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  return candidates[0]?.path ?? null;
}

function latestDirectory(prefix) {
  if (!existsSync(tmpRoot)) return null;

  const candidates = readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => {
      const fullPath = join(tmpRoot, entry.name);
      return {
        path: fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  return candidates[0]?.path ?? null;
}

const queuePath = latestFile(docsRoot, 'codex-kimi-integration-merge-queue-wave-one-', '.md');
const latestIntakeRoot = latestDirectory('kimi-wave-one-output-intake-');

const paths = queuePath ? {
  merge_queue: queuePath,
  merge_queue_template: join(docsRoot, 'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md'),
  output_intake_checklist: join(docsRoot, 'gcsc-kimi-output-integration-intake-checklist-2026-05-14.md'),
  worker_output_template: join(docsRoot, 'gcsc-kimi-worker-output-package-template-2026-05-14.md'),
  claude_audit_template: join(docsRoot, 'gcsc-claude-kimi-audit-report-template-2026-05-14.md'),
  latest_intake_root: latestIntakeRoot,
  latest_intake_codex_queue_folder: latestIntakeRoot ? join(latestIntakeRoot, '02-codex-merge-queue') : null,
  latest_intake_blocked_folder: latestIntakeRoot ? join(latestIntakeRoot, '99-blocked-or-rejected') : null,
} : {};

const requiredPaths = queuePath ? [
  paths.merge_queue,
  paths.merge_queue_template,
  paths.output_intake_checklist,
  paths.worker_output_template,
  paths.claude_audit_template,
].filter(Boolean) : [];

const optionalPaths = [
  paths.latest_intake_root,
  paths.latest_intake_codex_queue_folder,
  paths.latest_intake_blocked_folder,
].filter(Boolean);

const missingPaths = requiredPaths.filter((filePath) => !existsSync(filePath));
const missingOptionalPaths = optionalPaths.filter((filePath) => !existsSync(filePath));
const ready = Boolean(queuePath && missingPaths.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_kimi_merge_queue_paths',
  docs_root: docsRoot,
  tmp_root: tmpRoot,
  latest_merge_queue: queuePath,
  paths,
  merge_queue_upload_allowlist: ready ? [
    ...requiredPaths,
    ...optionalPaths,
  ] : [],
  merge_queue_upload_blocklist: [
    'Do not upload the whole project.',
    'Do not upload .env files.',
    'Do not upload credentials, private keys, tokens, service-role keys, Magic Link URLs, or wallet material.',
    'Do not upload private customer data, screenshots, recordings, or raw logs.',
    'Do not upload folders outside the merge queue, approved templates, or generated intake folders unless Codex explicitly adds them later.',
  ],
  missing_paths: missingPaths,
  missing_optional_paths: missingOptionalPaths,
  next_steps: ready ? [
    'Open paths.merge_queue before staging any Kimi output.',
    'Confirm Claude marked a stream PASS_LOCAL_ONLY before integration.',
    'Move unsafe, incomplete, or external-review outputs to paths.latest_intake_blocked_folder when available.',
    'Run the queue required checks before any scoped commit.',
  ] : [
    'Run npm run prepare:kimi-merge-queue from C:\\gcsc\\construction-ai after Kimi output intake exists.',
    'Run npm run print:kimi-latest-merge-queue-paths again.',
  ],
  stop_boundaries: [
    'No secrets, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
    'No live Supabase changes.',
    'No deployment, public launch, external account, app-store, DNS, or destructive actions.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
    'No legal, provider, finance, lender, regulator, or compliance conclusions.',
  ],
}, null, 2));
