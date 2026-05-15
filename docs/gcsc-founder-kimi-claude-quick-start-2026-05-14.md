# GCSC Founder Kimi + Claude Quick Start

Date: 2026-05-14 PT

Status: founder-facing quick start for launching the Kimi -> Claude -> Codex pipeline.

Purpose: give the founder simple steps to start Kimi's 100-agent Wave One, then send Kimi output to Claude for audit, then return only reviewed local outputs to Codex for integration.

This quick start does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## What You Are Doing

You are using three AI roles:

- Kimi: creates many local draft reports fast.
- Claude: checks Kimi's work for risk, mistakes, unsafe claims, and forbidden actions.
- Codex: integrates only safe local outputs into the project, runs checks, commits, and pushes.

## Do Not Paste These Anywhere

Never paste any of this into Kimi, Claude, or chat unless Codex explicitly asks inside a safe local workflow:

- passwords;
- API keys;
- private keys;
- seed phrases;
- service-role keys;
- wallet keys;
- Magic Link URLs;
- Supabase secret values;
- payment provider keys;
- Apple/Google/Vercel/Namecheap login data;
- bank, lender, escrow, or legal private information;
- real customer private data.

If any AI asks for those, stop and mark that branch `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW`.

## Step 1: Start Kimi

Optional faster local prep:

To print the full Kimi -> Claude -> Codex command sequence:

```powershell
cd C:\gcsc\construction-ai
npm run print:kimi-operator-dashboard
npm run print:kimi-pipeline-commands
```

`npm run print:kimi-operator-dashboard` is the fastest local status view: it prints the newest launch bundle, founder prompt, 100-agent prompt folder, output intake folder, Claude audit bundle, Codex merge queue, safe next commands, required checks, and stop boundaries in one JSON block.

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-founder-launch
npm run print:kimi-latest-launch-paths
```

This creates two timestamped local folders under `C:\gcsc\.tmp\`: one Kimi/Claude/Codex handoff bundle with a `README.md`, `KIMI-FOUNDER-PROMPT.txt`, and `bundle-files.json`, plus one 100-agent prompt folder with `manifest.json`, `agent-assignment.csv`, and `prompts\<STREAM>\<AGENT>-prompt.md` files. It verifies the generated prompt, bundle manifest, agent prompt counts, and assignment CSV wiring, then prints the exact paths and next steps. `npm run print:kimi-latest-launch-paths` reprints the newest bundle path, founder prompt path, prompt folder path, manifest files, `agent-assignment.csv`, latest whitepaper revision controller start-here path, and safe commands whenever you need them again. Do not upload `.env`, credentials, screenshots, private customer data, or anything outside the generated folders unless Codex explicitly adds it later.

If Kimi supports assigning prompts to separate workers, the one-command helper already generated one prompt file per worker. You can regenerate only that prompt folder with:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-agent-prompts
```

This creates `C:\gcsc\.tmp\kimi-wave-one-agent-prompts-...\prompts\<STREAM>\<AGENT>-prompt.md` with 100 local-only prompts for A/F/N/J/H/I/O/M/K/L/Q/S. It also writes `agent-assignment.csv` with agent id, stream, prompt file, work order, and expected output. Give each Kimi worker exactly one prompt file and keep the generated `manifest.json` plus `agent-assignment.csv` with the batch.

Fallback manual prep if the one-command helper ever fails:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-handoff-bundle
npm run print:kimi-founder-prompt
```

Keep `bundle-files.json` with the bundle because it includes SHA-256 checksums and byte counts for every copied file. That gives Kimi, Claude, and Codex a fast way to spot missing or accidentally changed files before review.

Then:

1. Open Kimi.
2. Create a new chat or project for GCSC Wave One.
3. Upload or paste these files in this order:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`
- `docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md`
- `docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md`
- `docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md`
- `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md`
- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`
- `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md`
- `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`
- `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md`
- `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md`
- all Kimi stream work orders listed in the controller launch packet.

4. Paste the one-message founder prompt from the generated `KIMI-FOUNDER-PROMPT.txt`, from `npm run print:kimi-founder-prompt`, or from `docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md`. Use the controller packet only if Kimi asks for the longer controller details.
5. Tell Kimi to return one worker report per agent plus one controller summary.

## Step 2: Save Kimi Output

When Kimi finishes:

1. Save the controller summary.
2. Save every worker report.
3. Save all created local draft files.
4. Do not manually merge Kimi files into the project.
5. Do not publish or send any Kimi output externally.

Optional faster local intake folder:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-output-intake
npm run print:kimi-latest-intake-paths
```

This creates a timestamped local folder under `C:\gcsc\.tmp\` with stream folders for controller summary, worker reports, Kimi-created files, Claude verdicts, Codex merge queue, and blocked/rejected packages. `npm run print:kimi-latest-intake-paths` reprints the newest intake folder, controller summary folder, stream worker-report folders, Claude verdict folders, Codex merge queue folder, and blocked/rejected folder. Keep unsafe, incomplete, or external-review output in `99-blocked-or-rejected`.

Use `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md` as the simple status board while Kimi returns the 100 worker reports. It tells you which streams are ready, which need Claude review, which are blocked, and which must never be merged.

After files are saved into the intake folder, run:

```powershell
cd C:\gcsc\construction-ai
npm run summarize:kimi-output-intake
npm run audit:kimi-worker-reports
npm run prepare:kimi-merge-queue
npm run print:kimi-latest-merge-queue-paths
```

This prints a JSON summary of how many controller, worker, Claude, Codex, blocked/rejected, and per-stream files are present, audits worker reports for required fields, stream mismatches, missing expected reports, and unsafe live/legal/money wording, then creates the dated Codex merge queue. The final print command reprints the latest merge queue file, templates, checklist, and latest intake queue/block folders. If either audit command reports `blocked_for_review`, `needs_rework`, or `needs_review`, do not send those files forward until Claude/Codex reviews the finding.

Required Kimi output names can be flexible, but each report must show:

```text
Worker ID:
Stream:
Files read:
Files created/modified:
Commands run:
Result:
Findings by severity:
Proposed integrator action:
Stop boundaries checked:
No-touch confirmation:
Remaining blockers:
```

## Step 3: Send To Claude

Optional faster local Claude audit prep:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:claude-kimi-audit-bundle
npm run print:claude-kimi-latest-audit-bundle-paths
```

This creates a timestamped `C:\gcsc\.tmp\claude-kimi-audit-*` folder with Claude audit instructions, required templates, a `CLAUDE-AUDIT-PROMPT.txt` prompt, and a `kimi-output-to-add` folder where you place Kimi's controller summary, worker reports, and created files before uploading to Claude. The print command reprints the latest audit bundle folder, Claude prompt file, Kimi output drop folder, placeholder, and copied audit source files so you do not manually search `.tmp`.

1. Open Claude.
2. Start a new chat or project called `GCSC Kimi Wave One Audit`.
3. Give Claude these files:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md`
- `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`
- `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md`
- `docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md`
- Kimi controller summary.
- Kimi worker reports.
- Kimi-created or Kimi-modified local draft files.

4. Ask Claude to follow `docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md` exactly.
5. Claude should return one audit report with stream verdicts.

## Step 4: Return To Codex

Give Codex:

- Kimi controller summary;
- Kimi worker reports for streams Claude marked `PASS_LOCAL_ONLY`;
- Kimi files for streams Claude marked `PASS_LOCAL_ONLY`;
- Claude audit report;
- Codex merge queue should use `docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md`;
- any streams marked `REWORK` or `BLOCKED_EXTERNAL_REVIEW`.

Codex will:

1. reject locked-file edits;
2. reject secret/live/legal/money/publication violations;
3. run relevant validators;
4. integrate one accepted stream at a time;
5. commit and push scoped changes only.

## Fast Go/No-Go

Proceed locally if:

- Kimi only created local draft reports;
- Claude says the stream is `PASS_LOCAL_ONLY`;
- no secrets, live actions, legal conclusions, public edits, or money actions appear.

Stop if:

- Kimi edited public files, backend package files, smart contract source, `.env`, deployment, Supabase live apply, provider, app-store, or wallet files;
- any AI says something is legally approved, lender approved, escrow ready, production ready, or safe for public launch;
- any AI asks for credentials or live account actions.

## Tonight's Best Use

The best first run is:

1. Start Kimi Wave One.
2. Do not wait for perfection.
3. Send the returned bundle to Claude for audit.
4. Let Codex integrate only the safe local pieces tomorrow or later tonight.

The goal is speed with guardrails: Kimi does volume, Claude catches risk, Codex ships safe scoped changes.
