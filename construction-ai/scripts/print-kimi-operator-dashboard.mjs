import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve('..');
const docsRoot = resolve(projectRoot, 'docs');
const tmpRoot = resolve(projectRoot, '.tmp');

function newestMatching(root, predicate) {
  if (!existsSync(root)) return null;
  return readdirSync(root)
    .filter(predicate)
    .map((name) => {
      const path = resolve(root, name);
      return { name, path, mtimeMs: statSync(path).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs || b.name.localeCompare(a.name))[0] ?? null;
}

function optionalPath(path) {
  return path && existsSync(path) ? path : null;
}

const latestLaunch = newestMatching(tmpRoot, (name) => name.startsWith('kimi-wave-one-handoff-'));
const latestAgentPrompts = newestMatching(tmpRoot, (name) => name.startsWith('kimi-wave-one-agent-prompts-'));
const latestIntake = newestMatching(tmpRoot, (name) => name.startsWith('kimi-wave-one-output-intake-'));
const latestAuditBundle = newestMatching(tmpRoot, (name) => name.startsWith('claude-kimi-audit-'));
const latestMergeQueue = newestMatching(
  docsRoot,
  (name) => name.startsWith('codex-kimi-integration-merge-queue-wave-one-') && name.endsWith('.md')
);

const latestPaths = {
  founder_launch_root: latestLaunch?.path ?? null,
  handoff_bundle: latestLaunch?.path ?? null,
  kimi_founder_prompt: optionalPath(latestLaunch && resolve(latestLaunch.path, 'KIMI-FOUNDER-PROMPT.txt')),
  agent_prompt_root: latestAgentPrompts?.path ?? null,
  agent_assignment_csv: optionalPath(latestAgentPrompts && resolve(latestAgentPrompts.path, 'agent-assignment.csv')),
  output_intake_root: latestIntake?.path ?? null,
  controller_summary_folder: optionalPath(latestIntake && resolve(latestIntake.path, '00-controller-summary')),
  claude_verdicts_folder: optionalPath(latestIntake && resolve(latestIntake.path, '01-claude-audit')),
  codex_merge_queue_folder: optionalPath(latestIntake && resolve(latestIntake.path, '02-codex-merge-queue')),
  blocked_or_rejected_folder: optionalPath(latestIntake && resolve(latestIntake.path, '99-blocked-or-rejected')),
  claude_audit_bundle: latestAuditBundle?.path ?? null,
  claude_audit_prompt: optionalPath(latestAuditBundle && resolve(latestAuditBundle.path, 'CLAUDE-AUDIT-PROMPT.txt')),
  kimi_output_to_add_folder: optionalPath(latestAuditBundle && resolve(latestAuditBundle.path, 'kimi-output-to-add')),
  codex_merge_queue_file: latestMergeQueue?.path ?? null,
};

const requiredDocs = [
  'gcsc-founder-kimi-claude-quick-start-2026-05-14.md',
  'gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md',
  'gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md',
  'gcsc-kimi-wave-one-progress-tracker-2026-05-14.md',
  'gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md',
  'gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md',
  'gcsc-claude-kimi-output-audit-work-order-2026-05-14.md',
  'gcsc-claude-kimi-audit-report-template-2026-05-14.md',
  'gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md',
];

const missingRequiredDocs = requiredDocs
  .map((name) => resolve(docsRoot, name))
  .filter((path) => !existsSync(path));

const missingLatestArtifacts = Object.entries(latestPaths)
  .filter(([, value]) => !value)
  .map(([key]) => key);

console.log(JSON.stringify({
  status: missingRequiredDocs.length === 0 ? 'ready_local_only' : 'needs_local_repair',
  dashboard: 'kimi_wave_one_operator_dashboard',
  docs_root: docsRoot,
  tmp_root: tmpRoot,
  latest_paths: latestPaths,
  missing_required_docs: missingRequiredDocs,
  missing_latest_artifacts: missingLatestArtifacts,
  fastest_safe_sequence: [
    'npm run print:kimi-operator-dashboard',
    'npm run print:kimi-pipeline-commands',
    'npm run prepare:kimi-founder-launch',
    'npm run print:kimi-latest-launch-paths',
    'npm run prepare:kimi-output-intake',
    'npm run print:kimi-latest-intake-paths',
    'npm run summarize:kimi-output-intake',
    'npm run audit:kimi-worker-reports',
    'npm run prepare:claude-kimi-audit-bundle',
    'npm run print:claude-kimi-latest-audit-bundle-paths',
    'npm run prepare:kimi-merge-queue',
    'npm run print:kimi-latest-merge-queue-paths',
  ],
  required_checks_before_codex_merge: [
    'npm run check:kimi-handoff-bundle',
    'npm run check:kimi-agent-prompts',
    'npm run check:kimi-output-intake',
    'npm run check:kimi-output-intake-summary',
    'npm run check:kimi-worker-report-audit',
    'npm run check:kimi-merge-queue',
    'npm run check:kimi-latest-launch-paths',
    'npm run check:kimi-latest-intake-paths',
    'npm run check:claude-kimi-latest-audit-bundle-paths',
    'npm run check:kimi-latest-merge-queue-paths',
    'npm run check:kimi-operator-dashboard',
  ],
  stop_boundaries: [
    'No secrets, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
    'No live Supabase writes, production deploy settings, external account changes, public launch, app-store actions, or XPR signatures.',
    'No real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, legal decisions, or provider commitments.',
    'Codex integrates only Claude-approved PASS_LOCAL_ONLY output after local checks pass.',
  ],
}, null, 2));
