import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';

const projectRoot = resolve('..');
const outputRoot = resolve(projectRoot, '.tmp');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const bundleRoot = resolve(outputRoot, `claude-kimi-audit-${stamp}`);
const kimiOutputRoot = resolve(bundleRoot, 'kimi-output-to-add');

const requiredFiles = [
  'AGENTS.md',
  'docs/gcsc-active-context.md',
  'docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'docs/gcsc-kimi-worker-output-package-template-2026-05-14.md',
  'docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
];

const stopBoundaryText = [
  'Do not add secrets, passwords, private keys, service-role keys, Magic Link URLs, wallet material, customer private data, or live credentials.',
  'Do not ask Claude to perform live Supabase changes, deployment, external account changes, public launch, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or destructive actions.',
  'Use this bundle for local/internal audit only; Codex integrates only Claude-approved PASS_LOCAL_ONLY output later.',
].join('\n');

function fail(message) {
  console.error(`Claude Kimi audit bundle preparation failed: ${message}`);
  process.exit(1);
}

function copyRequiredFile(relativePath) {
  const sourcePath = resolve(projectRoot, relativePath);
  if (!existsSync(sourcePath)) {
    fail(`Missing required source file: ${relativePath}`);
  }

  const targetPath = resolve(bundleRoot, relativePath.replaceAll('\\', '/'));
  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(sourcePath, targetPath);
  return targetPath;
}

mkdirSync(bundleRoot, { recursive: true });
mkdirSync(kimiOutputRoot, { recursive: true });

const copiedFiles = requiredFiles.map(copyRequiredFile);

const prompt = `You are auditing GCSC/SmartContractor Kimi Wave One output for safe local integration.

Read these files first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md
- docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md
- docs/gcsc-kimi-worker-output-package-template-2026-05-14.md
- docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md
- docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md

Then audit the Kimi controller summary, worker reports, and Kimi-created files that the founder adds under kimi-output-to-add/.

Return one Claude audit report using docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md.

Allowed verdicts only:
- PASS_LOCAL_ONLY
- REWORK
- BLOCKED_EXTERNAL_REVIEW
- FAIL_UNSAFE

Hard stop boundaries:
- no secrets
- no live Supabase changes
- no deployment or external account changes
- no public launch
- no legal/provider/finance commitments
- no real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or destructive actions

Codex may integrate only streams marked PASS_LOCAL_ONLY after local checks pass.`;

writeFileSync(resolve(bundleRoot, 'CLAUDE-AUDIT-PROMPT.txt'), `${prompt}\n`);

const readme = `# GCSC Claude Kimi Audit Bundle

Generated: ${new Date().toISOString()}

Purpose: give Claude a clean local/internal audit package after Kimi returns 100-agent Wave One output.

${stopBoundaryText}

## Start Here

1. Add the Kimi controller summary, worker reports, and Kimi-created draft files into \`kimi-output-to-add/\`.
2. Upload this bundle to Claude.
3. Paste \`CLAUDE-AUDIT-PROMPT.txt\` as the Claude instruction.
4. Save Claude's final audit report before Codex integrates anything.

## Files Copied

${copiedFiles.map((file) => `- \`${file.slice(bundleRoot.length + 1).replaceAll('\\', '/')}\``).join('\n')}

## Empty Folder For Founder

- \`kimi-output-to-add/\`
`;

writeFileSync(resolve(bundleRoot, 'README.md'), readme);
writeFileSync(resolve(kimiOutputRoot, 'PUT-KIMI-OUTPUT-HERE.txt'), [
  'Put Kimi controller summary, worker reports, and Kimi-created local draft files here before sending the bundle to Claude.',
  'Do not add secrets, private customer data, live credentials, .env files, Magic Link URLs, wallet material, or external-account screenshots.',
].join('\n'));

console.log(JSON.stringify({
  status: 'prepared',
  bundle_root: bundleRoot,
  prompt_file: resolve(bundleRoot, 'CLAUDE-AUDIT-PROMPT.txt'),
  kimi_output_folder: kimiOutputRoot,
  files_copied: copiedFiles.length,
  first_file: basename(requiredFiles[0]),
  stop_boundaries_checked: true,
}, null, 2));
