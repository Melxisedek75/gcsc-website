import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
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
  'docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md',
  'docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md',
  'docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md',
  'docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
  'docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
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

function extractFounderPrompt() {
  const promptPath = resolve(projectRoot, 'docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md');
  const promptDoc = readFileSync(promptPath, 'utf8');
  const match = promptDoc.match(/## Copy-Paste Prompt For Kimi\s+```text\s+([\s\S]*?)\s+```/);
  if (!match?.[1]) {
    fail(`Missing copy-paste prompt block in ${promptPath}`);
  }
  return match[1].trim();
}

function extractWhitepaperDispatchPrompt() {
  const promptResult = spawnSync(process.execPath, ['scripts/print-kimi-whitepaper-dispatch-prompt.mjs'], {
    cwd: resolve('.'),
    encoding: 'utf8',
    shell: false,
  });

  if (promptResult.error) {
    fail(promptResult.error.message);
  }
  if (promptResult.status !== 0) {
    fail(`print-kimi-whitepaper-dispatch-prompt.mjs failed: ${promptResult.stderr || promptResult.stdout}`);
  }

  const prompt = promptResult.stdout.trim();
  if (!prompt.includes('KIMI WHITEPAPER V1.2 REVISION DISPATCH')) {
    fail('Whitepaper dispatch prompt output is missing the dispatch header');
  }
  if (!prompt.includes('WHITEPAPER_REVISION_LOCAL_ONLY')) {
    fail('Whitepaper dispatch prompt output is missing the local-only marker');
  }
  if (!prompt.includes('Upload allowlist')) {
    fail('Whitepaper dispatch prompt output is missing the upload allowlist');
  }
  if (!prompt.includes('Do not upload the whole project')) {
    fail('Whitepaper dispatch prompt output is missing the whole-project upload block');
  }
  if (!prompt.includes('Do not upload .env files')) {
    fail('Whitepaper dispatch prompt output is missing the .env upload block');
  }
  if (!prompt.includes('Do not upload credentials')) {
    fail('Whitepaper dispatch prompt output is missing the credentials upload block');
  }
  if (!prompt.includes('Do not upload private customer data')) {
    fail('Whitepaper dispatch prompt output is missing the private customer data upload block');
  }

  return prompt;
}

function buildControllerStartHere() {
  return [
    'Start here for Kimi controller',
    '',
    'Use this local-only bundle in this order:',
    `1. Upload this generated handoff bundle folder to Kimi: ${bundleRoot}`,
    '2. Read README.md and docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md first.',
    '3. Paste KIMI-FOUNDER-PROMPT.txt when launching the full Kimi Wave One 100-agent run.',
    '4. Paste KIMI-WHITEPAPER-DISPATCH-PROMPT.txt when launching the focused whitepaper v1.2 revision sprint.',
    '5. Use the latest kimi-wave-one-agent-prompts-* folder and agent-assignment.csv for one prompt file per worker.',
    '6. Send Kimi output to Claude-Audit before Codex integrates anything.',
    '7. Codex may integrate only Claude-approved PASS_LOCAL_ONLY output after local checks pass.',
    '',
    'Stop boundaries:',
    stopBoundaryText,
  ].join('\n');
}

function addGeneratedFile(relativePath, content) {
  const normalizedPath = relativePath.replaceAll('\\', '/');
  const targetPath = resolve(bundleRoot, normalizedPath);
  const bytes = Buffer.from(`${content}\n`, 'utf8');
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, bytes);
  copiedFiles.push(normalizedPath);
  fileIntegrity.push({
    path: normalizedPath,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
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

const founderPrompt = extractFounderPrompt();
addGeneratedFile('KIMI-FOUNDER-PROMPT.txt', founderPrompt);
const whitepaperDispatchPrompt = extractWhitepaperDispatchPrompt();
addGeneratedFile('KIMI-WHITEPAPER-DISPATCH-PROMPT.txt', whitepaperDispatchPrompt);
const controllerStartHere = buildControllerStartHere();
addGeneratedFile('KIMI-CONTROLLER-START-HERE.txt', controllerStartHere);

const readme = `# GCSC Kimi Wave One Handoff Bundle

Generated: ${new Date().toISOString()}

Purpose: local/internal bundle for starting Kimi Wave One and then routing Kimi output to Claude/Codex review.

${stopBoundaryText}

## Start Here

1. Open \`KIMI-CONTROLLER-START-HERE.txt\`.
2. Open \`docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md\`.
3. Give Kimi the files listed in \`docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md\`.
4. Paste the founder one-message launch prompt from \`KIMI-FOUNDER-PROMPT.txt\`.
5. For the focused whitepaper v1.2 revision sprint, paste \`KIMI-WHITEPAPER-DISPATCH-PROMPT.txt\` into the Kimi controller.
6. Require each Kimi worker to use \`docs/gcsc-kimi-worker-output-package-template-2026-05-14.md\`.
7. Give Claude \`docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md\` and \`docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md\` after Kimi returns.
8. Give Codex only Claude-approved local outputs and create the merge queue from \`docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md\`.

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
