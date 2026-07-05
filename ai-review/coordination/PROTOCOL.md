# Codex-Claude Collaboration Protocol

## Purpose

Codex and Claude Code coordinate GCSC work through Git without requiring the founder to relay messages manually.

## Polling

- Codex checks `inbox/codex/` every 30 minutes through the Codex app heartbeat.
- Claude checks `inbox/claude/` through its local scheduler when available and at every Claude Code session start.
- If the assigned inbox contains no actionable task, the agent exits quietly after updating no files.
- Polling does not authorize continuous paid API use outside the founder's existing accounts or plans.

## Task Lifecycle

Allowed states:

`QUEUED` -> `CLAIMED` -> `IN_PROGRESS` -> `READY_FOR_REVIEW` -> `APPROVED`

Alternative states:

- `CHANGES_REQUESTED`: author must fix and return the same task for review.
- `BLOCKED_FOUNDER`: live-risk or decision requires founder action.
- `BLOCKED_EXTERNAL`: required external state is unavailable.
- `CANCELLED`: only founder or original delegator may cancel.

## Claim and Lease

Before starting, the agent creates a response file in its own outbox containing:

- task ID;
- `CLAIMED` status;
- agent name;
- UTC timestamp;
- lease expiry, maximum 90 minutes;
- intended branch/worktree.

An unexpired lease blocks another run from claiming the task. If a lease expires, the next run must inspect Git state and the previous response before resuming. It must never overwrite unknown work.

## Delegation Rules

1. One task has one owner, one branch, one review record, and one reviewer.
2. The task author provides exact scope, allowed files, prohibited actions, checks, and acceptance criteria.
3. The receiving agent may split a large task into child task files but must preserve the original risk boundary.
4. An agent never approves its own implementation.
5. The reviewer independently reads the diff and reruns the listed checks.
6. P0/P1 findings require correction and re-review.
7. A review `APPROVED` decision permits merge consideration only; it does not perform or authorize merge/deploy.

## Git Rules

- Fetch before inspection.
- Use a dedicated branch or isolated worktree.
- Never reset, overwrite, stash, or discard unrelated founder/agent changes.
- Stage explicit files only.
- Push the task branch and record its full commit SHA.
- Never force-push unless the founder explicitly approves it.
- Use Draft Pull Requests when GitHub review is needed.

## Mandatory Handoff Evidence

Every `READY_FOR_REVIEW` response includes:

- repository and local path;
- base branch and task branch;
- full head SHA;
- exact changed files;
- exact commands executed;
- result of every command;
- known limitations and residual risks;
- review-record path;
- confirmation that secrets and live systems were not used.

## Live-Risk Stop Boundary

The agents must stop with `BLOCKED_FOUNDER` before any:

- merge to `main` or production branch;
- production/Railway/Vercel/Supabase deploy or configuration change;
- public `index.html` or `whitepaper.html` replacement/publication;
- real payment, loan, escrow, repayment routing, stablecoin settlement, or token collateral action;
- XPR/FIO signature, contract deployment, token custody, or blockchain account creation;
- secret, private key, paid service, or external account access;
- legal conclusion, provider commitment, outreach, submission, or contract acceptance;
- mobile store/TestFlight/Play Console release;
- destructive action or data deletion.

Cross-review approval never overrides this boundary.

## Founder Reporting

Routine agent dialogue stays in the coordination directory. `FOUNDER-REPORT.md` contains only:

1. completed work;
2. independent review result;
3. checks run;
4. unresolved blockers;
5. decisions requiring founder approval.

No raw logs, secrets, repetitive no-op polling messages, or copy/paste instructions are sent to the founder.
