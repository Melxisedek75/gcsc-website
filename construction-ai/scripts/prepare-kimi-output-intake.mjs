import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve('..');
const outputRoot = resolve(projectRoot, '.tmp');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const intakeRoot = resolve(outputRoot, `kimi-wave-one-output-intake-${stamp}`);

const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const stopBoundaryText = [
  'Do not place secrets, passwords, private keys, service-role keys, Magic Link URLs, wallet material, customer private data, or live credentials in this intake folder.',
  'Do not use this folder to perform live Supabase changes, deployment, external account changes, public launch, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or destructive actions.',
  'Use this intake folder for local/internal review routing only.',
].join('\n');

mkdirSync(intakeRoot, { recursive: true });

const folders = [
  '00-controller-summary',
  '01-claude-audit',
  '02-codex-merge-queue',
  '99-blocked-or-rejected',
  ...streams.flatMap((stream) => [
    `streams/${stream}/worker-reports`,
    `streams/${stream}/created-or-modified-files`,
    `streams/${stream}/claude-verdict`,
  ]),
];

for (const folder of folders) {
  mkdirSync(resolve(intakeRoot, folder), { recursive: true });
}

const intakeWriteAllowlist = [
  resolve(intakeRoot, '00-controller-summary'),
  resolve(intakeRoot, '01-claude-audit'),
  resolve(intakeRoot, '02-codex-merge-queue'),
  resolve(intakeRoot, '99-blocked-or-rejected'),
  ...streams.flatMap((stream) => [
    resolve(intakeRoot, `streams/${stream}/worker-reports`),
    resolve(intakeRoot, `streams/${stream}/created-or-modified-files`),
    resolve(intakeRoot, `streams/${stream}/claude-verdict`),
  ]),
];

const intakeBlocklist = [
  'Do not write into the project source tree.',
  'Do not write .env files.',
  'Do not write credentials, private keys, tokens, service-role keys, Magic Link URLs, wallet material, or raw database passwords.',
  'Do not write private customer data, screenshots, recordings, or raw logs.',
  'Do not write files outside the generated intake folder unless Codex explicitly adds them later.',
];

const readme = `# GCSC Kimi Wave One Output Intake

Generated: ${new Date().toISOString()}

Purpose: local/internal folder structure for saving Kimi output, Claude audit results, and Codex merge-queue notes without mixing unsafe or unreviewed files into the project.

${stopBoundaryText}

## Folder Order

1. Save Kimi controller summary in \`00-controller-summary\`.
2. Save each Kimi worker report in \`streams/<STREAM>/worker-reports\`.
3. Save Kimi-created or Kimi-modified local draft files in \`streams/<STREAM>/created-or-modified-files\`.
4. Save Claude stream verdict notes in \`streams/<STREAM>/claude-verdict\`.
5. Save the final Claude audit report in \`01-claude-audit\`.
6. Save Codex merge queue notes in \`02-codex-merge-queue\`.
7. Move unsafe, incomplete, blocked, or rework-required packages to \`99-blocked-or-rejected\`.

## Intake Write Allowlist

Only write Kimi/Claude/Codex handoff files inside this generated intake folder:

${intakeWriteAllowlist.map((folder) => `- \`${folder}\``).join('\n')}

## Intake Blocklist

${intakeBlocklist.map((item) => `- ${item}`).join('\n')}

## Stream Folders

${streams.map((stream) => `- \`streams/${stream}/\``).join('\n')}

## Required Review Files

- \`docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md\`
- \`docs/gcsc-kimi-worker-output-package-template-2026-05-14.md\`
- \`docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md\`
- \`docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md\`
`;

writeFileSync(resolve(intakeRoot, 'README.md'), readme);
writeFileSync(resolve(intakeRoot, 'intake-folder-map.json'), `${JSON.stringify({
  status: 'prepared',
  generated_at: new Date().toISOString(),
  streams,
  folders,
  intake_write_allowlist: intakeWriteAllowlist,
  intake_blocklist: intakeBlocklist,
  stop_boundaries: stopBoundaryText.split('\n'),
}, null, 2)}\n`);

console.log(JSON.stringify({
  status: 'prepared',
  intake_root: intakeRoot,
  intake_write_allowlist: intakeWriteAllowlist,
  intake_blocklist: intakeBlocklist,
  streams_prepared: streams.length,
  folders_created: folders.length,
  readme: resolve(intakeRoot, 'README.md'),
}, null, 2));
