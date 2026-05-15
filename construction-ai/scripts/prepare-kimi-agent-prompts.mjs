import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const checkOnly = process.argv.includes('--check');
const tmpRoot = resolve('..', '.tmp');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputRoot = resolve(tmpRoot, `kimi-wave-one-agent-prompts-${stamp}`);

const stopBoundaries = [
  'No secrets, passwords, API keys, seed phrases, private keys, service-role keys, or raw database passwords.',
  'No live Supabase changes or production database writes.',
  'No deployment, public launch, external account, DNS, Vercel, GitHub Pages, provider, app-store, or wallet changes.',
  'No real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement.',
  'No legal, financial, lending, escrow, custody, securities, tax, AML, provider, or regulator conclusions.',
  'No destructive actions and no edits outside the assigned stream package.',
];

const streams = [
  {
    code: 'A',
    count: 20,
    name: 'Public Whitepaper v1.2 Draft',
    workOrder: 'docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md',
    output: 'claim-safe public whitepaper draft/report package',
  },
  {
    code: 'F',
    count: 12,
    name: 'API/OpenAPI Inventory',
    workOrder: 'docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md',
    output: 'route inventory, OpenAPI draft sections, and validator proposals',
  },
  {
    code: 'N',
    count: 8,
    name: 'Public Artifact Safety',
    workOrder: 'docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md',
    output: 'public safety findings and blocked-claim report',
  },
  {
    code: 'J',
    count: 10,
    name: 'Smart Contract Local Build Map',
    workOrder: 'docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md',
    output: 'local-only module build map, fixture gaps, and anti-backdoor notes',
  },
  {
    code: 'H',
    count: 6,
    name: 'Auth/RLS/Admin Readiness',
    workOrder: 'docs/gcsc-kimi-stream-h-auth-rls-admin-work-order.md',
    output: 'local-only Auth/RLS/Admin readiness matrix',
  },
  {
    code: 'I',
    count: 6,
    name: 'Deployment/Public Beta Prep',
    workOrder: 'docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md',
    output: 'deployment and public beta prep report without external changes',
  },
  {
    code: 'O',
    count: 6,
    name: 'Investor/Partner Alignment',
    workOrder: 'docs/gcsc-kimi-stream-o-investor-partner-alignment-work-order.md',
    output: 'conservative investor, grant, and partner alignment report',
  },
  {
    code: 'M',
    count: 5,
    name: 'Mobile Readiness',
    workOrder: 'docs/gcsc-kimi-stream-m-mobile-readiness-work-order.md',
    output: 'mobile readiness and blocker report',
  },
  {
    code: 'K',
    count: 8,
    name: 'Contract-Backed Loan Implementation',
    workOrder: 'docs/gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md',
    output: 'local-only working-capital implementation gap package',
  },
  {
    code: 'L',
    count: 8,
    name: 'Legal/Provider Review Prep',
    workOrder: 'docs/gcsc-kimi-stream-l-legal-provider-review-work-order.md',
    output: 'legal/provider review prep package without conclusions',
  },
  {
    code: 'Q',
    count: 6,
    name: 'Cross-Stream Intake Dry Run',
    workOrder: 'docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md',
    output: 'intake dry-run classification and missing-field report',
  },
  {
    code: 'S',
    count: 5,
    name: 'Cross-Stream Safety Review',
    workOrder: 'docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md',
    output: 'no-touch safety review and stop-boundary report',
  },
];

function agentIds(stream) {
  return Array.from({ length: stream.count }, (_, index) => `${stream.code}${String(index + 1).padStart(2, '0')}`);
}

function allAgents() {
  return streams.flatMap((stream) => agentIds(stream).map((id) => ({ id, stream })));
}

function renderPrompt({ id, stream }) {
  return `# Kimi Wave One Agent Prompt: ${id}

You are Kimi worker ${id} for GCSC / SmartContractor.

Language for final report: Russian.

## Assignment

- Stream: ${stream.code}
- Stream name: ${stream.name}
- Primary work order: ${stream.workOrder}
- Expected output: ${stream.output}

## Read First

1. AGENTS.md
2. docs/gcsc-active-context.md
3. docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md
4. docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md
5. ${stream.workOrder}

## Work Rules

- Work only inside this stream's assigned scope.
- If a required change touches locked/shared files, write a proposed integrator action instead of editing the locked file.
- Return a report even if you cannot complete the work.
- Do not merge, publish, deploy, apply live SQL, sign transactions, request secrets, or make business/legal/provider decisions.

## Stop Boundaries

${stopBoundaries.map((boundary) => `- ${boundary}`).join('\n')}

## Required Report Format

\`\`\`text
Worker ID: ${id}
Stream: ${stream.code}
Files read:
Files created/modified:
Commands run:
Result:
Findings by severity:
Proposed integrator action:
Stop boundaries checked:
No-touch confirmation:
Remaining blockers:
\`\`\`

## Acceptance Target

The report should be ready for Claude audit and Codex intake. If anything is incomplete, mark it as REWORK_REQUIRED and list the exact missing fields, files, or commands.
`;
}

function fail(message) {
  console.error(`Kimi agent prompt preparation failed: ${message}`);
  process.exit(1);
}

const agents = allAgents();
const uniqueIds = new Set(agents.map((agent) => agent.id));

if (agents.length !== 100) {
  fail(`Expected 100 agents, got ${agents.length}`);
}
if (uniqueIds.size !== agents.length) {
  fail('Agent IDs must be unique');
}
for (const stream of streams) {
  if (!stream.workOrder.startsWith('docs/')) {
    fail(`Stream ${stream.code} must point to a docs work order`);
  }
}

if (!checkOnly) {
  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(join(outputRoot, 'prompts'), { recursive: true });

  for (const stream of streams) {
    const streamRoot = join(outputRoot, 'prompts', stream.code);
    mkdirSync(streamRoot, { recursive: true });
    for (const id of agentIds(stream)) {
      writeFileSync(join(streamRoot, `${id}-prompt.md`), renderPrompt({ id, stream }), 'utf8');
    }
  }

  writeFileSync(join(outputRoot, 'README.md'), `# Kimi Wave One Agent Prompts

Generated for 100 local-only Kimi workers.

Start with \`manifest.json\`, then give each worker exactly one file from \`prompts/<STREAM>/<AGENT>-prompt.md\`.

This folder is temporary local handoff material. It does not approve live Supabase changes, deployment, public launch, external account changes, legal/provider decisions, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.
`, 'utf8');

  writeFileSync(join(outputRoot, 'manifest.json'), JSON.stringify({
    status: 'prepared',
    total_agents: agents.length,
    streams: streams.map((stream) => ({
      stream: stream.code,
      name: stream.name,
      count: stream.count,
      work_order: stream.workOrder,
      prompt_folder: `prompts/${stream.code}`,
    })),
    stop_boundaries: stopBoundaries,
  }, null, 2), 'utf8');
}

console.log(JSON.stringify({
  status: checkOnly ? 'validated' : 'prepared',
  output_root: checkOnly ? null : outputRoot,
  total_agents: agents.length,
  streams_prepared: streams.length,
  stream_counts: Object.fromEntries(streams.map((stream) => [stream.code, stream.count])),
  safety_boundaries_checked: true,
}, null, 2));
