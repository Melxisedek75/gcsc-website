import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const checkOnly = process.argv.includes('--check');
const tmpRoot = resolve('..', '.tmp');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputRoot = resolve(tmpRoot, `whitepaper-v1-2-public-draft-revision-worker-prompts-${stamp}`);

const sourceFiles = [
  'AGENTS.md',
  'docs/gcsc-active-context.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'docs/whitepaper-v1-2-public-draft-founder-review-packet.md',
  'docs/whitepaper-v1-2-public-draft-founder-response-intake.md',
  'docs/whitepaper-v1-2-public-draft-revision-plan.md',
  'docs/whitepaper-v1-2-public-draft-revision-checklist.md',
  'docs/whitepaper-v1-2-public-draft-revision-worker-packet.md',
  'docs/whitepaper-v1-2-claim-review-matrix.md',
  'docs/whitepaper-v1-2-publication-go-no-go-checklist.md',
];

const stopBoundaries = [
  'No public publication, website edits, PDF release, deck, investor, grant, email, social, or announcement use.',
  'No secrets, passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, or raw database passwords.',
  'No live Supabase changes, production database writes, deployment, external accounts, DNS, Vercel, GitHub Pages, providers, app stores, or wallet changes.',
  'No real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement.',
  'No legal, financial, lending, escrow, custody, securities, tax, AML, provider, regulator, or public-launch decisions.',
  'No edits outside local-only assigned report or proposed patch notes unless Codex explicitly integrates after checks.',
];

const workers = [
  {
    id: 'Kimi-A',
    role: 'Wording and structure pass',
    focus: 'Review every section for narrative clarity, order, duplication, and product-first SmartContractor positioning.',
    output: 'Proposed local wording patch notes by section.',
    mustNot: 'Publish, edit public surfaces, or weaken safety gates.',
  },
  {
    id: 'Kimi-B',
    role: 'Claim-risk pass',
    focus: 'Find risky phrases around traction, compliance, guarantees, launch readiness, audits, providers, and market claims.',
    output: 'Risky phrase list with safe replacement wording.',
    mustNot: 'Claim legal, provider, regulator, audit, lender, escrow, custody, AML, or public-launch approval.',
  },
  {
    id: 'Kimi-C',
    role: 'Contract-backed loan pass',
    focus: 'Compare loan language against exact sentence, implementation, provider-review, and blocked-live gates.',
    output: 'Loan wording findings and local-only replacement proposals.',
    mustNot: 'Say loans, credit approval, repayment routing, escrow release, or provider financing are live.',
  },
  {
    id: 'Kimi-D',
    role: 'Token / GCST / XPR pass',
    focus: 'Check GCSC, GCST, XPR, utility, settlement, roadmap, staking, yield, liquidity, and collateral wording.',
    output: 'Token and settlement wording findings with safe utility-roadmap replacements.',
    mustNot: 'Promise token value, price, yield, liquidity, stablecoin readiness, or token collateral availability.',
  },
  {
    id: 'Kimi-E',
    role: 'AI boundary pass',
    focus: 'Check that AI remains assistive, explainable, non-final, and subordinate to human/admin/provider review.',
    output: 'AI boundary findings and local-only wording replacements.',
    mustNot: 'Give AI legal, finance, escrow, admin, loan, dispute, or payment-release authority.',
  },
  {
    id: 'Claude-Audit',
    role: 'Independent audit',
    focus: 'Audit the combined worker reports and draft for PASS/REVISE/HOLD readiness before Codex integration.',
    output: 'Severity-ranked PASS/REVISE/HOLD audit report.',
    mustNot: 'Merge, publish, deploy, or decide live/legal/money actions.',
  },
  {
    id: 'Codex-Integration',
    role: 'Integration owner',
    focus: 'Integrate only safe local wording/report changes after Kimi and Claude reports pass boundaries.',
    output: 'Scoped local integration checklist, commands, and commit plan.',
    mustNot: 'Accept public publication, live/legal/money, external-account, deployment, or secret-handling requests.',
  },
];

function fail(message) {
  console.error(`Whitepaper revision worker prompt preparation failed: ${message}`);
  process.exit(1);
}

function renderWorkerPrompt(worker) {
  return `# Whitepaper v1.2 Public Draft Revision Worker Prompt: ${worker.id}

You are ${worker.id} for GCSC / SmartContractor.

Language for final report: Russian.

## Assignment

- Role: ${worker.role}
- Focus: ${worker.focus}
- Expected output: ${worker.output}
- Must not do: ${worker.mustNot}

## Read First

${sourceFiles.map((file, index) => `${index + 1}. ${file}`).join('\n')}

## Work Rules

- Treat this as local-only internal review work.
- Propose changes as patch notes or report text unless your role is Codex-Integration.
- If a request would touch public, live, legal, money, provider, deployment, account, wallet, or secret boundaries, mark it HOLD.
- Keep the draft product-first: SmartContractor construction trust infrastructure before token economics.
- Keep contract-backed loan language as readiness/concept/review-gated, not live lending.
- Keep AI assistive and non-final.

## Stop Boundaries

${stopBoundaries.map((boundary) => `- ${boundary}`).join('\n')}

## Required Report Format

\`\`\`text
Worker: ${worker.id}
Source files read:
Sections reviewed:
Findings:
Proposed local-only changes:
Blocked or HOLD items:
Required validators:
PASS / REVISE / HOLD:
\`\`\`

## Validators To Reference

\`\`\`powershell
cd C:\\gcsc\\construction-ai
npm run check:whitepaper-v1-2-public-draft-revision-worker-packet
npm run check:whitepaper-v1-2-public-draft-revision-checklist
npm run check:whitepaper-v1-2-public-draft-revision-plan
npm run check:whitepaper-v1-2-public-draft
\`\`\`
`;
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function renderAssignmentCsv() {
  const rows = [
    ['worker_id', 'role', 'prompt_file', 'expected_output', 'must_not_do'],
    ...workers.map((worker) => [
      worker.id,
      worker.role,
      `prompts/${worker.id}-prompt.md`,
      worker.output,
      worker.mustNot,
    ]),
  ];

  return `${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}\n`;
}

if (workers.length !== 7) {
  fail(`Expected 7 workers, got ${workers.length}`);
}

const uniqueWorkerIds = new Set(workers.map((worker) => worker.id));
if (uniqueWorkerIds.size !== workers.length) {
  fail('Worker IDs must be unique');
}

for (const worker of workers) {
  for (const field of ['id', 'role', 'focus', 'output', 'mustNot']) {
    if (!worker[field]) fail(`Worker ${worker.id || '<unknown>'} is missing ${field}`);
  }
}

if (!checkOnly) {
  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(join(outputRoot, 'prompts'), { recursive: true });

  for (const worker of workers) {
    writeFileSync(join(outputRoot, 'prompts', `${worker.id}-prompt.md`), renderWorkerPrompt(worker), 'utf8');
  }

  writeFileSync(join(outputRoot, 'README.md'), `# Whitepaper v1.2 Public Draft Revision Worker Prompts

Generated local-only prompts for Kimi-A through Kimi-E, Claude-Audit, and Codex-Integration.

Give each worker exactly one prompt from \`prompts/\`, plus the source files listed inside that prompt. Use \`worker-assignment.csv\` to track assignment and output.

This folder does not approve public publication, website edits, PDF release, investor or grant use, legal/provider decisions, live Supabase changes, deployment, external accounts, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.
`, 'utf8');

  writeFileSync(join(outputRoot, 'worker-assignment.csv'), renderAssignmentCsv(), 'utf8');

  writeFileSync(join(outputRoot, 'manifest.json'), JSON.stringify({
    status: 'prepared',
    total_workers: workers.length,
    assignment_csv: 'worker-assignment.csv',
    source_files: sourceFiles,
    workers: workers.map((worker) => ({
      worker_id: worker.id,
      role: worker.role,
      prompt_file: `prompts/${worker.id}-prompt.md`,
      expected_output: worker.output,
    })),
    stop_boundaries: stopBoundaries,
  }, null, 2), 'utf8');
}

console.log(JSON.stringify({
  status: checkOnly ? 'validated' : 'prepared',
  output_root: checkOnly ? null : outputRoot,
  assignment_csv: checkOnly ? null : join(outputRoot, 'worker-assignment.csv'),
  total_workers: workers.length,
  worker_ids: workers.map((worker) => worker.id),
  source_files_checked: sourceFiles.length,
  safety_boundaries_checked: true,
}, null, 2));
