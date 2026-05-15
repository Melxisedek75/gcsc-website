import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve('..');
const tmpRoot = resolve(projectRoot, '.tmp');

const copiedFiles = [
  'AGENTS.md',
  'docs/gcsc-active-context.md',
  'docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'docs/gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
];

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

const bundleRoot = latestDirectory('claude-kimi-audit-');
const paths = bundleRoot ? {
  bundle_root: bundleRoot,
  readme: join(bundleRoot, 'README.md'),
  prompt_file: join(bundleRoot, 'CLAUDE-AUDIT-PROMPT.txt'),
  kimi_output_folder: join(bundleRoot, 'kimi-output-to-add'),
  kimi_output_placeholder: join(bundleRoot, 'kimi-output-to-add', 'PUT-KIMI-OUTPUT-HERE.txt'),
  copied_files: Object.fromEntries(copiedFiles.map((file) => [
    file,
    join(bundleRoot, ...file.split('/')),
  ])),
} : {};

const requiredPaths = bundleRoot ? [
  paths.bundle_root,
  paths.readme,
  paths.prompt_file,
  paths.kimi_output_folder,
  paths.kimi_output_placeholder,
  ...Object.values(paths.copied_files),
] : [];

const missingPaths = requiredPaths.filter((filePath) => !existsSync(filePath));
const ready = Boolean(bundleRoot && missingPaths.length === 0);

console.log(JSON.stringify({
  status: ready ? 'ready' : 'missing_latest_claude_kimi_audit_bundle_paths',
  tmp_root: tmpRoot,
  latest_audit_bundle_root: bundleRoot,
  paths,
  claude_upload_allowlist: ready ? [
    paths.bundle_root,
    paths.kimi_output_folder,
    paths.prompt_file,
  ] : [],
  claude_upload_blocklist: [
    'Do not upload the whole project.',
    'Do not upload .env files.',
    'Do not upload credentials, private keys, tokens, service-role keys, Magic Link URLs, or wallet material.',
    'Do not upload private customer data, screenshots, recordings, or raw logs.',
    'Do not upload folders outside the generated Claude audit bundle unless Codex explicitly adds them later.',
  ],
  missing_paths: missingPaths,
  next_steps: ready ? [
    'Copy Kimi controller summary, worker reports, and Kimi-created local draft files into paths.kimi_output_folder.',
    'Upload paths.bundle_root to Claude.',
    'Paste paths.prompt_file as Claude instructions.',
    'Save Claude stream verdicts before Codex integrates anything.',
  ] : [
    'Run npm run prepare:claude-kimi-audit-bundle from C:\\gcsc\\construction-ai.',
    'Run npm run print:claude-kimi-latest-audit-bundle-paths again.',
  ],
  stop_boundaries: [
    'No secrets, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
    'No live Supabase changes.',
    'No deployment, public launch, external account, app-store, DNS, or destructive actions.',
    'No real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures.',
    'No legal, provider, finance, lender, regulator, or compliance conclusions.',
  ],
}, null, 2));
