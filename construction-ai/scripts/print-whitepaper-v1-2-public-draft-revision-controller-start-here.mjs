import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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

const workerIds = [
  'Kimi-A',
  'Kimi-B',
  'Kimi-C',
  'Kimi-D',
  'Kimi-E',
  'Claude-Audit',
  'Codex-Integration',
];

const latestPromptFolder = latestDirectory('whitepaper-v1-2-public-draft-revision-worker-prompts-');
const promptRoot = latestPromptFolder?.path ?? null;
const controllerStartHere = promptRoot ? join(promptRoot, 'CONTROLLER-START-HERE.txt') : null;
const workerAssignmentCsv = promptRoot ? join(promptRoot, 'worker-assignment.csv') : null;
const manifest = promptRoot ? join(promptRoot, 'manifest.json') : null;
const readme = promptRoot ? join(promptRoot, 'README.md') : null;
const promptFolder = promptRoot ? join(promptRoot, 'prompts') : null;
const promptFiles = workerIds.map((workerId) => promptFolder ? join(promptFolder, `${workerId}-prompt.md`) : null);

const requiredFiles = [
  controllerStartHere,
  workerAssignmentCsv,
  manifest,
  readme,
  ...promptFiles,
].filter(Boolean);

const missingFiles = requiredFiles.filter((filePath) => !existsSync(filePath));

if (!promptRoot || missingFiles.length > 0) {
  console.log(`Start here for whitepaper v1.2 public draft revision controller
Status: missing_latest_whitepaper_revision_controller_artifacts

Run from C:\\gcsc\\construction-ai:
1. npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts
2. npm run print:whitepaper-v1-2-public-draft-revision-controller-start-here

Expected files:
- CONTROLLER-START-HERE.txt
- worker-assignment.csv
- manifest.json
- README.md
- prompts/Kimi-A-prompt.md
- prompts/Kimi-B-prompt.md
- prompts/Kimi-C-prompt.md
- prompts/Kimi-D-prompt.md
- prompts/Kimi-E-prompt.md
- prompts/Claude-Audit-prompt.md
- prompts/Codex-Integration-prompt.md

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

console.log(readFileSync(controllerStartHere, 'utf8'));
