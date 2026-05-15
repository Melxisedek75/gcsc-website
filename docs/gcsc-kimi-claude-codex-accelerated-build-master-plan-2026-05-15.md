# GCSC Kimi Claude Codex Accelerated Build Master Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compress the next GCSC/SmartContractor build cycle by giving Kimi, Claude, and Codex one exact execution plan for parallel local-only work, review, and safe integration.

**Architecture:** Kimi performs high-volume local drafting, inventory, static audits, and report generation in isolated stream packages. Claude reviews Kimi output for claim risk, safety, architecture drift, and code-review issues. Codex owns repo integration, shared-file edits, validators, final checks, commits, and all stop-boundary enforcement.

**Tech Stack:** Windows PowerShell, Node.js scripts under `C:\gcsc\construction-ai\scripts`, Markdown docs under `C:\gcsc\docs`, existing SmartContractor npm validators, Git/GitHub main branch.

---

This plan does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Operating Rule

Kimi does volume. Claude reviews risk. Codex integrates only scoped, safe, reviewed output.

No agent may merge, publish, deploy, apply live SQL, assign admin roles, move money, sign XPR transactions, connect external accounts, request secrets, or make legal/provider decisions.

## Current Local Baseline

Use this baseline before assigning work:

```powershell
cd C:\gcsc
git status --short --branch
cd C:\gcsc\construction-ai
npm run prepare:kimi-output-intake
npm run summarize:kimi-output-intake
npm run audit:kimi-worker-reports
npm run prepare:kimi-merge-queue
```

Expected current state until Kimi returns output:

```text
npm run audit:kimi-worker-reports -> status no_reports_yet
docs/codex-kimi-integration-merge-queue-wave-one-2026-05-15.md -> Overall queue status REWORK_REQUIRED
```

That is correct. It means the intake and queue are prepared, not that work is ready to merge.

## File Map

### Controller Files

- `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`: founder/Kimi controller starting point.
- `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md`: agent allocation and stream instructions.
- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`: complete audit and stream definitions.
- `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`: acceptance/rejection rules.
- `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md`: status board.
- `docs/codex-kimi-integration-merge-queue-wave-one-2026-05-15.md`: generated Codex integration queue.

### Local Tooling

- `construction-ai/scripts/prepare-kimi-handoff-bundle.mjs`: creates safe Kimi/Claude/Codex handoff bundle.
- `construction-ai/scripts/prepare-kimi-output-intake.mjs`: creates stream folders for returned Kimi output.
- `construction-ai/scripts/summarize-kimi-output-intake.mjs`: counts returned output and flags obvious risk wording.
- `construction-ai/scripts/audit-kimi-worker-reports.mjs`: checks required worker report fields and unsafe wording.
- `construction-ai/scripts/prepare-kimi-merge-queue.mjs`: creates the dated Codex merge queue.

### Shared Files Locked From Kimi Workers

Kimi workers must not edit these files directly:

- `construction-ai/package.json`
- `construction-ai/scripts/run-checks.mjs`
- `construction-ai/server.js`
- `whitepaper.html`
- `index.html`
- `AGENTS.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`
- `.env`
- `.env.*`
- Supabase live apply files
- deploy/account/provider/app-store/wallet files
- smart contract source or XPR folders unless the stream explicitly says read-only audit

Any needed change to a locked file must be written as a proposal in the worker report.

## Wave One Stream Ownership

| Stream | Agents | Owner | Primary Output | Codex Integration Priority |
| --- | ---:| --- | --- | ---:|
| N | 8 | Kimi safety workers | public artifact safety audit | 1 |
| F | 12 | Kimi API workers | API/OpenAPI inventory | 2 |
| A | 20 | Kimi whitepaper workers | public v1.2 whitepaper draft package | 3 |
| J | 10 | Kimi smart contract workers | local build map and anti-backdoor gaps | 4 |
| K | 8 | Kimi loan implementation workers | contract-backed loan implementation gap package | 5 |
| L | 8 | Kimi legal/provider prep workers | legal/provider review prep package | 6 |
| H | 6 | Kimi Auth/RLS workers | Auth/RLS/Admin readiness package | 7 |
| I | 6 | Kimi deploy/beta workers | deployment/public beta package | 8 |
| O | 6 | Kimi investor workers | investor/grant/partner alignment package | 9 |
| M | 5 | Kimi mobile workers | mobile readiness package | 10 |
| Q | 6 | Kimi intake workers | cross-stream intake dry-run reports | 11 |
| S | 5 | Kimi safety reviewers | cross-stream no-touch review | 12 |

## Required Worker Report

Every Kimi worker must return this exact structure:

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

Any missing field means `REWORK_REQUIRED`.

## Kimi Controller Launch Steps

### Task 1: Prepare The Handoff Bundle

**Files:**
- Read: `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`
- Read: `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md`
- Output: `.tmp/kimi-wave-one-handoff-*`

- [ ] **Step 1: Generate handoff bundle**

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-handoff-bundle
```

Expected:

```text
"status": "prepared"
"bundle_root": "C:\\gcsc\\.tmp\\kimi-wave-one-handoff-..."
```

- [ ] **Step 2: Keep bundle manifest**

Give Kimi the generated folder and keep `bundle-files.json` with it. The JSON contains SHA-256 checksums and byte counts.

- [ ] **Step 3: Tell Kimi to run Wave One only**

Use this exact instruction:

```text
Run Wave One only. Use docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md as the controller index. Dispatch A/F/N/J/H/I/O/M/K/L/Q/S exactly as assigned. Do not touch secrets, live systems, external accounts, public files, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app stores, or deployment. Return one report per worker and one controller summary.
```

## Kimi Output Intake Steps

### Task 2: Create The Local Intake Folder

**Files:**
- Create: `.tmp/kimi-wave-one-output-intake-*`
- Read: `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`

- [ ] **Step 1: Prepare intake folder**

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-output-intake
```

Expected:

```text
"status": "prepared"
"streams_prepared": 12
```

- [ ] **Step 2: Save Kimi controller summary**

Save the controller summary into:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\00-controller-summary\
```

- [ ] **Step 3: Save worker reports**

Save each worker report into:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\worker-reports\
```

Example:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\streams\A\worker-reports\A01-report.md
```

- [ ] **Step 4: Save Kimi-created files**

Save Kimi-created draft files into:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\created-or-modified-files\
```

Do not copy Kimi-created files directly into live project folders until Claude and Codex review them.

## Claude Review Steps

### Task 3: Give Claude The Audit Packet

**Files:**
- Read: `docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md`
- Read: `docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md`
- Output: `.tmp/kimi-wave-one-output-intake-<stamp>\01-claude-audit\`

- [ ] **Step 1: Give Claude safe inputs**

Give Claude:

```text
docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md
docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md
Kimi controller summary
Kimi worker reports
Kimi-created draft files
```

- [ ] **Step 2: Require stream verdicts**

Claude must classify each stream as exactly one:

```text
PASS_LOCAL_ONLY
REWORK
BLOCKED_EXTERNAL_REVIEW
FAIL_UNSAFE
```

- [ ] **Step 3: Save Claude verdicts**

Save stream verdicts into:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\claude-verdict\
```

Save final audit into:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\01-claude-audit\
```

## Codex Intake And Integration Steps

### Task 4: Summarize And Audit Kimi Output

**Files:**
- Read: `.tmp/kimi-wave-one-output-intake-*`
- Modify only after review: scoped accepted project files

- [ ] **Step 1: Summarize intake**

```powershell
cd C:\gcsc\construction-ai
npm run summarize:kimi-output-intake
```

Expected safe result:

```text
"status": "summarized"
"findings": []
```

Blocked result:

```text
"status": "blocked_for_review"
```

- [ ] **Step 2: Audit worker reports**

```powershell
cd C:\gcsc\construction-ai
npm run audit:kimi-worker-reports
```

Expected safe result after all reports arrive:

```text
"status": "passed"
"total_worker_reports": 100
"missing_expected_reports": 0
```

Results that block direct integration:

```text
"status": "blocked_for_review"
"status": "needs_rework"
"status": "needs_review"
```

- [ ] **Step 3: Generate merge queue**

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-merge-queue
```

Expected after complete reports and Claude review:

```text
"overall_queue_status": "PARTIAL_READY"
```

If the queue says `REWORK_REQUIRED`, Codex must not integrate the missing streams.

### Task 5: Integrate One Accepted Stream At A Time

**Files:**
- Read: `docs/codex-kimi-integration-merge-queue-wave-one-2026-05-15.md`
- Read: `.tmp/kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\worker-reports\`
- Read: `.tmp/kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\claude-verdict\`
- Modify: only files listed in the stream work order and merge queue

- [ ] **Step 1: Check branch**

```powershell
cd C:\gcsc
git status --short --branch
```

Expected:

```text
## main...origin/main
```

Old untracked local artifacts may remain. Do not stage unrelated untracked files.

- [ ] **Step 2: Confirm stream is safe**

Read the stream row in:

```text
docs/codex-kimi-integration-merge-queue-wave-one-2026-05-15.md
```

Only integrate if:

```text
Claude verdict: PASS_LOCAL_ONLY
Codex intake state: ACCEPT_LOCAL_ONLY or ACCEPT_AFTER_INTEGRATOR_EDIT
Commit allowed: yes or review-first after manual Codex confirmation
```

- [ ] **Step 3: Apply accepted files**

Copy only accepted stream files from:

```text
C:\gcsc\.tmp\kimi-wave-one-output-intake-<stamp>\streams\<STREAM>\created-or-modified-files\
```

into their intended project paths. Do not copy files that Claude marked `REWORK`, `BLOCKED_EXTERNAL_REVIEW`, or `FAIL_UNSAFE`.

- [ ] **Step 4: Run targeted checks**

For Stream N:

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-public-excerpt-guard
npm run check:real-status-audit
```

For Stream F:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
npm run check:real-status-audit
```

For Stream A:

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-wording-package
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-publish-gate
npm run check:real-status-audit
```

For Stream J:

```powershell
cd C:\gcsc\construction-ai
npm run check:smart-contract-state-helpers-local
npm run check:smart-contract-local-replay
npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor
npm run check:real-status-audit
```

- [ ] **Step 5: Run full checks if shared files changed**

```powershell
cd C:\gcsc\construction-ai
npm run check
```

Expected:

```text
"status": "passed"
```

- [ ] **Step 6: Commit only the accepted stream**

```powershell
cd C:\gcsc
git add -- <accepted-stream-files-only>
git commit -m "Integrate Kimi stream <STREAM> local output"
git push
```

Do not make one combined mega-commit across unrelated streams.

## Rework Routing

If Kimi output is incomplete:

```text
State: REWORK_REQUIRED
Action: return exact missing worker fields, missing files, failed commands, and required next command.
Codex merge: blocked.
```

If Kimi touched locked files:

```text
State: REJECT_UNTIL_REWORKED
Action: ask Kimi to provide a proposal report instead of a patch.
Codex merge: blocked.
```

If Kimi output includes live/legal/money/external action:

```text
State: BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW
Action: move package to 99-blocked-or-rejected and route to founder/Claude/legal/provider review.
Codex merge: blocked.
```

If Kimi output includes secrets or likely private keys:

```text
State: FAIL_UNSAFE
Action: stop intake, do not paste or share content further, ask founder for secure rotation path outside chat if a real secret was exposed.
Codex merge: blocked.
```

## Seven-Day Parallel Build Schedule

### Day 1: Safety, API, Whitepaper, Smart Contract Map

- [ ] Run Streams N, F, A, J.
- [ ] Save all reports into Kimi intake folder.
- [ ] Claude reviews N/A/J claim and authority risks.
- [ ] Codex integrates only Stream N or F if Claude returns `PASS_LOCAL_ONLY`.

### Day 2: Contract-Backed Loan, Legal/Provider, Auth/RLS, Deploy/Beta

- [ ] Run Streams K, L, H, I.
- [ ] Keep all real loan, legal/provider, live Supabase, deploy, and account actions blocked.
- [ ] Claude reviews K/L/H/I for false readiness claims.
- [ ] Codex integrates only docs/validators that stay local-only.

### Day 3: Investor, Mobile, Intake Dry Run, Safety Review

- [ ] Run Streams O, M, Q, S.
- [ ] Q classifies all stream packages.
- [ ] S confirms no stop boundary was crossed.
- [ ] Codex updates merge queue and integrates safe packages by priority.

### Day 4: Backend/API Follow-Up

- [ ] Use Stream F route inventory to plan backend modularization.
- [ ] Keep `construction-ai/server.js` edits Codex-owned.
- [ ] Run `npm run check:auth` after any backend changes.

### Day 5: Public Surface Draft Review

- [ ] Claude reviews public v1.2 whitepaper draft and public copy.
- [ ] Codex integrates only internal/review-only public draft files.
- [ ] Do not publish `whitepaper.html` or external pages.

### Day 6: Smart Contract And Loan Safety Pass

- [ ] Claude reviews module split, anti-backdoor assumptions, and contract-backed loan readiness.
- [ ] Codex integrates local-only replay fixtures or docs.
- [ ] No XPR signatures, token movement, deployment, or live contract changes.

### Day 7: Founder Packet

- [ ] Codex prepares a founder packet with accepted local outputs, blocked items, passed checks, and remaining external actions.
- [ ] Founder reviews deploy/Auth/legal/provider/public beta decisions.
- [ ] Live actions remain blocked until explicit founder approval.

## Immediate Next Safe Work After This Plan

1. Wait for Kimi worker reports and Claude audit before integration.
2. If Kimi is not yet running, use `npm run prepare:kimi-handoff-bundle` and send the generated bundle to Kimi.
3. If Kimi returns partial output, run `npm run summarize:kimi-output-intake`, `npm run audit:kimi-worker-reports`, and `npm run prepare:kimi-merge-queue`.
4. Integrate only the first stream that has `PASS_LOCAL_ONLY`, no missing report fields, no locked-file violations, and targeted checks passing.

## Self-Review

- Spec coverage: this plan covers Kimi dispatch, Claude review, Codex intake, report requirements, file ownership, safety boundaries, commands, checks, rework routing, and a seven-day parallel schedule.
- Placeholder scan: this plan uses no `TBD`, `TODO`, or unspecified implementation placeholders.
- Type and command consistency: command names match current package scripts: `prepare:kimi-handoff-bundle`, `prepare:kimi-output-intake`, `summarize:kimi-output-intake`, `audit:kimi-worker-reports`, `prepare:kimi-merge-queue`, and `check:real-status-audit`.
