import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';

const projectRoot = resolve('..');
const outputRoot = resolve(projectRoot, '.tmp');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const bundleRoot = resolve(outputRoot, `kimi-wave-one-handoff-${stamp}`);

const files = [
  'AGENTS.md',
  'docs/gcsc-active-context.md',
  'docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md',
  'docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md',
  'docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md',
  'docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md',
  'docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'docs/gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md',
  'docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md',
  'docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md',
  'docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md',
  'docs/gcsc-kimi-stream-h-auth-rls-admin-work-order.md',
  'docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md',
  'docs/gcsc-kimi-stream-o-investor-partner-alignment-work-order.md',
  'docs/gcsc-kimi-stream-m-mobile-readiness-work-order.md',
  'docs/gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md',
  'docs/gcsc-kimi-stream-l-legal-provider-review-work-order.md',
  'docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'docs/gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md',
];

const stopBoundaryText = [
  'Do not add secrets, passwords, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
  'Do not ask Kimi or Claude to perform live Supabase changes, deployment, external account changes, public launch, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or destructive actions.',
  'Use this bundle for local/internal drafting and review only.',
].join('\n');

function fail(message) {
  console.error(`Kimi handoff bundle preparation failed: ${message}`);
  process.exit(1);
}

mkdirSync(bundleRoot, { recursive: true });

const copiedFiles = [];
const fileIntegrity = [];
for (const relativePath of files) {
  const sourcePath = resolve(projectRoot, relativePath);
  if (!existsSync(sourcePath)) {
    fail(`Missing required source file: ${relativePath}`);
  }

  const targetRelativePath = relativePath.replaceAll('\\', '/');
  const targetPath = resolve(bundleRoot, targetRelativePath);
  const sourceBytes = readFileSync(sourcePath);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, sourceBytes);
  copiedFiles.push(targetRelativePath);
  fileIntegrity.push({
    path: targetRelativePath,
    bytes: sourceBytes.length,
    sha256: createHash('sha256').update(sourceBytes).digest('hex'),
  });
}

const readme = `# GCSC Kimi Wave One Handoff Bundle

Generated: ${new Date().toISOString()}

Purpose: local/internal bundle for starting Kimi Wave One and then routing Kimi output to Claude/Codex review.

${stopBoundaryText}

## Start Here

1. Open \`docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md\`.
2. Give Kimi the files listed in \`docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md\`.
3. Require each Kimi worker to use \`docs/gcsc-kimi-worker-output-package-template-2026-05-14.md\`.
4. Give Claude \`docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md\` and \`docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md\` after Kimi returns.
5. Give Codex only Claude-approved local outputs and create the merge queue from \`docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md\`.

## Files Copied

${copiedFiles.map((file) => `- \`${file}\``).join('\n')}

## Integrity Manifest

\`bundle-files.json\` includes SHA-256 checksums and byte counts for every copied file so Kimi/Claude/Codex can detect missing or edited handoff files before review.
`;

writeFileSync(resolve(bundleRoot, 'README.md'), readme);
writeFileSync(resolve(bundleRoot, 'bundle-files.json'), `${JSON.stringify({
  status: 'prepared',
  generated_at: new Date().toISOString(),
  files_copied: copiedFiles,
  file_integrity: fileIntegrity,
  file_count: copiedFiles.length,
  stop_boundaries: stopBoundaryText.split('\n'),
}, null, 2)}\n`);

console.log(JSON.stringify({
  status: 'prepared',
  bundle_root: bundleRoot,
  files_copied: copiedFiles.length,
  first_file: basename(files[0]),
  readme: resolve(bundleRoot, 'README.md'),
}, null, 2));
