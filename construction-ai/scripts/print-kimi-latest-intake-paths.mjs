import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve('..');
const tmpRoot = resolve(projectRoot, '.tmp');
const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];

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

const intakeRoot = latestDirectory('kimi-wave-one-output-intake-');
const readme = intakeRoot ? join(intakeRoot, 'README.md') : null;
const folderMap = intakeRoot ? join(intakeRoot, 'intake-folder-map.json') : null;

const paths = intakeRoot ? {
  controller_summary: join(intakeRoot, '00-controller-summary'),
  claude_audit: join(intakeRoot, '01-claude-audit'),
  codex_merge_queue: join(intakeRoot, '02-codex-merge-queue'),
  blocked_or_rejected: join(intakeRoot, '99-blocked-or-rejected'),
  streams_root: join(intakeRoot, 'streams'),
} : {};

const stream_paths = Object.fromEntries(streams.map((stream) => [
  stream,
  intakeRoot ? {
    worker_reports: join(intakeRoot, 'streams', stream, 'worker-reports'),
    created_or_modified_files: join(intakeRoot, 'streams', stream, 'created-or-modified-files'),
    claude_verdict: join(intakeRoot, 'streams', stream, 'claude-verdict'),
  } : null,
]));

const requiredPaths = [
  intakeRoot,
  readme,
  folderMap,
  ...Object.values(paths),
  ...Object.values(stream_paths)
    .filter(Boolean)
    .flatMap((streamPath) => Object.values(streamPath)),
].filter(Boolean);

const missingPaths = requiredPaths.filter((filePath) => !existsSync(filePath));
const ready = Boolean(intakeRoot && missingPaths.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_kimi_intake_paths',
  tmp_root: tmpRoot,
  latest_intake_root: intakeRoot,
  readme,
  intake_folder_map: folderMap,
  paths,
  stream_paths,
  missing_paths: missingPaths,
  next_steps: ready ? [
    'Save Kimi controller summary into paths.controller_summary.',
    'Save each Kimi worker report into stream_paths.<STREAM>.worker_reports.',
    'Save Kimi-created local draft files into stream_paths.<STREAM>.created_or_modified_files.',
    'Save Claude stream verdicts into stream_paths.<STREAM>.claude_verdict.',
    'Keep unsafe, incomplete, or external-review items in paths.blocked_or_rejected.',
    'Run npm run summarize:kimi-output-intake before sending material to Claude.',
  ] : [
    'Run npm run prepare:kimi-output-intake from C:\\gcsc\\construction-ai.',
    'Run npm run print:kimi-latest-intake-paths again.',
  ],
  stop_boundaries: [
    'No secrets or private account values.',
    'No live Supabase changes.',
    'No deployment, public launch, external account, app-store, or DNS changes.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
    'No legal, provider, finance, or regulator conclusions.',
  ],
}, null, 2));
