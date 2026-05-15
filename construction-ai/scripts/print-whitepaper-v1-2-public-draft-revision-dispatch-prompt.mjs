import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const tmpRoot = resolve('..', '.tmp');

function latestDirectory(prefix) {
  if (!existsSync(tmpRoot)) return null;

  const candidates = readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => {
      const fullPath = join(tmpRoot, entry.name);
      return {
        name: entry.name,
        path: fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs || right.name.localeCompare(left.name));

  return candidates[0] ?? null;
}

const latestPromptFolder = latestDirectory('whitepaper-v1-2-public-draft-revision-worker-prompts-');
const promptRoot = latestPromptFolder?.path ?? null;
const promptFolder = promptRoot ? join(promptRoot, 'prompts') : null;
const workerAssignmentCsv = promptRoot ? join(promptRoot, 'worker-assignment.csv') : null;
const manifest = promptRoot ? join(promptRoot, 'manifest.json') : null;
const readme = promptRoot ? join(promptRoot, 'README.md') : null;

const workerIds = [
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
];

const promptFiles = workerIds.map((workerId) => ({
  workerId,
  path: promptFolder ? join(promptFolder, `${workerId}-prompt.md`) : null,
}));

const requiredFiles = [
  workerAssignmentCsv,
  manifest,
  readme,
  ...promptFiles.map((prompt) => prompt.path),
].filter(Boolean);

const missingFiles = requiredFiles.filter((filePath) => !existsSync(filePath));

if (!promptRoot || missingFiles.length > 0) {
  console.log(`Start here for whitepaper v1.2 public draft revision dispatch
Status: missing_latest_whitepaper_revision_prompt_artifacts

Run from C:\\gcsc\\construction-ai:
1. npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts
2. npm run print:whitepaper-v1-2-public-draft-revision-dispatch-prompt

Missing files:
${missingFiles.map((filePath) => `- ${filePath}`).join('\n') || '- latest whitepaper-v1-2-public-draft-revision-worker-prompts-* folder'}

Stop boundaries:
- Do not publish, edit public website files, release PDFs, send emails, post social content, or use this outside local/internal review.
- Do not add secrets, passwords, API keys, private keys, service-role keys, seed phrases, OAuth tokens, or raw database passwords.
- Do not perform live Supabase changes, production database writes, deployments, DNS changes, provider setup, app-store work, wallet changes, or external-account changes.
- Do not perform real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement.
- Do not make legal, provider, finance, regulator, securities, tax, AML, custody, lending, escrow, or public-launch decisions.
`);
  process.exit(promptRoot ? 1 : 0);
}

console.log(`Start here for whitepaper v1.2 public draft revision dispatch

Use this local-only prompt bundle in this order:
1. Upload or attach this folder to Kimi: ${promptRoot}
2. Use this tracking CSV: ${workerAssignmentCsv}
3. Keep this manifest with the handoff: ${manifest}
4. Read this README before assigning workers: ${readme}
5. Give each worker exactly one prompt file:
${promptFiles.map(({ workerId, path }) => `   - ${workerId}: ${path}`).join('\n')}

Review order:
Kimi workers -> Claude-Audit -> Codex-Integration

Controller instructions:
1. Send Kimi-A-prompt.md, Kimi-B-prompt.md, Kimi-C-prompt.md, Kimi-D-prompt.md, and Kimi-E-prompt.md to separate Kimi workers.
2. Require each worker to return the exact report format from its prompt.
3. Send all Kimi reports plus the draft files to Claude-Audit-prompt.md before Codex sees integration work.
4. Codex-Integration-prompt.md may be used only after Claude-Audit returns PASS or precise REVISE notes.
5. Codex may integrate only local-only changes after validators pass.

Stop boundaries:
- Do not publish, edit public website files, release PDFs, send emails, post social content, or use this outside local/internal review.
- Do not add secrets, passwords, API keys, private keys, service-role keys, seed phrases, OAuth tokens, or raw database passwords.
- Do not perform live Supabase changes, production database writes, deployments, DNS changes, provider setup, app-store work, wallet changes, or external-account changes.
- Do not perform real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement.
- Do not make legal, provider, finance, regulator, securities, tax, AML, custody, lending, escrow, or public-launch decisions.
`);
