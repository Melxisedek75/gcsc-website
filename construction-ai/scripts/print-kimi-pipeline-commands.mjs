const commands = [
  {
    stage: '1_kimi_launch',
    purpose: 'Prepare the founder upload bundle and one-message Kimi prompt.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run print:kimi-operator-dashboard',
      'npm run prepare:kimi-founder-launch',
      'npm run print:kimi-latest-launch-paths',
    ],
  },
  {
    stage: '1b_whitepaper_revision_prompt_dispatch',
    purpose: 'Prepare the whitepaper v1.2 revision worker prompts and print the exact local paths for Kimi/Claude/Codex.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run prepare:whitepaper-v1-2-public-draft-revision-worker-prompts',
      'npm run print:whitepaper-v1-2-public-draft-revision-worker-prompt-paths',
    ],
  },
  {
    stage: '2_kimi_output_intake',
    purpose: 'Create the local folder where Kimi controller summary, worker reports, and draft files are saved.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run prepare:kimi-output-intake',
      'npm run print:kimi-latest-intake-paths',
    ],
  },
  {
    stage: '3_pre_claude_safety_scan',
    purpose: 'Summarize saved Kimi files and audit worker report format before Claude review.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run summarize:kimi-output-intake',
      'npm run audit:kimi-worker-reports',
    ],
  },
  {
    stage: '4_claude_audit',
    purpose: 'Prepare the Claude audit bundle and prompt for independent Kimi output review.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run prepare:claude-kimi-audit-bundle',
      'npm run print:claude-kimi-latest-audit-bundle-paths',
    ],
  },
  {
    stage: '5_codex_integration_queue',
    purpose: 'Create the Codex merge queue after Claude marks streams PASS_LOCAL_ONLY.',
    commands: [
      'cd C:\\gcsc\\construction-ai',
      'npm run prepare:kimi-merge-queue',
      'npm run print:kimi-latest-merge-queue-paths',
    ],
  },
  {
    stage: '6_required_checks',
    purpose: 'Run local validation before any scoped integration commit.',
    commands: [
      'cd C:\\gcsc',
      'git diff --check',
      'cd C:\\gcsc\\construction-ai',
      'npm run check:kimi-handoff-bundle',
      'npm run check:kimi-latest-launch-paths',
      'npm run check:kimi-latest-intake-paths',
      'npm run check:claude-kimi-latest-audit-bundle-paths',
      'npm run check:kimi-latest-merge-queue-paths',
      'npm run check:whitepaper-v1-2-public-draft-revision-worker-prompt-paths',
      'npm run check:kimi-operator-dashboard',
      'npm run check:kimi-output-intake',
      'npm run check:kimi-worker-report-audit',
      'npm run check:kimi-merge-queue',
      'npm run check:real-status-audit',
    ],
  },
];

console.log(JSON.stringify({
  status: 'ready',
  pipeline: 'Kimi -> Claude -> Codex',
  commands,
  stop_boundaries: [
    'Do not paste secrets, private keys, service-role keys, Magic Link URLs, wallet material, or live credentials.',
    'Do not perform live Supabase changes, deployment, external account changes, public launch, app-store actions, XPR signatures, or destructive actions.',
    'Do not approve real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, or provider commitments.',
    'Codex integrates only Claude-approved PASS_LOCAL_ONLY outputs after local checks pass.',
  ],
}, null, 2));
