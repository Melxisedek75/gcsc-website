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

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-handoff-bundle
```

This creates a timestamped local folder under `C:\gcsc\.tmp\` with the Kimi/Claude/Codex handoff files, a `README.md`, and a `bundle-files.json` integrity manifest. Do not upload `.env`, credentials, screenshots, private customer data, or anything outside that generated bundle unless Codex explicitly adds it later.

Keep `bundle-files.json` with the bundle because it includes SHA-256 checksums and byte counts for every copied file. That gives Kimi, Claude, and Codex a fast way to spot missing or accidentally changed files before review.

Then:

1. Open Kimi.
2. Create a new chat or project for GCSC Wave One.
3. Upload or paste these files in this order:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`
- `docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md`
- `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md`
- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`
- `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md`
- `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`
- `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md`
- `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md`
- all Kimi stream work orders listed in the controller launch packet.

4. Paste the copy-paste controller prompt from `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md`.
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
```

This creates a timestamped local folder under `C:\gcsc\.tmp\` with stream folders for controller summary, worker reports, Kimi-created files, Claude verdicts, Codex merge queue, and blocked/rejected packages. Keep unsafe, incomplete, or external-review output in `99-blocked-or-rejected`.

Use `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md` as the simple status board while Kimi returns the 100 worker reports. It tells you which streams are ready, which need Claude review, which are blocked, and which must never be merged.

After files are saved into the intake folder, run:

```powershell
cd C:\gcsc\construction-ai
npm run summarize:kimi-output-intake
npm run audit:kimi-worker-reports
npm run prepare:kimi-merge-queue
```

This prints a JSON summary of how many controller, worker, Claude, Codex, blocked/rejected, and per-stream files are present, audits worker reports for required fields, stream mismatches, missing expected reports, and unsafe live/legal/money wording, then creates the dated Codex merge queue. If either audit command reports `blocked_for_review`, `needs_rework`, or `needs_review`, do not send those files forward until Claude/Codex reviews the finding.

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
