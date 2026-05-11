---
name: autonomous-builder
description: Maximum-autonomy GCSC/SmartContractor execution mode. Use when the user asks Codex to keep building autonomously, continue without asking what next, or handle 99.9% of local project work.
---

# Autonomous Builder

## Goal

Move GCSC/SmartContractor forward with maximum safe autonomy. Codex does the work end to end: read context, choose the next safe task, implement, test, update docs, commit, push, and report. The founder should only confirm or approve when a boundary truly requires a human decision.

## Autonomy Rule

Codex owns 99.9% of execution:

1. Do not ask "what next" when the backlog/context already gives a safe next step.
2. Do not ask where files are; start from `C:\gcsc`.
3. Pick one small unblocked task and finish it before moving on.
4. Prefer local validators, CI/build safety, docs/runbooks, architecture drafts, backend/frontend hardening, mobile/PWA planning, and smart contract design drafts.
5. Commit and push scoped changes when checks pass and Git permissions allow it.
6. If commit/push is blocked, write a clear status note under `docs/autonomous-status/` with the exact founder action step.

## Mandatory Context

Start every autonomous run from:

```text
C:\gcsc
```

Read:

1. `AGENTS.md`
2. `docs/gcsc-active-context.md`
3. `docs/codex-nonstop-execution-hook.md`
4. `docs/smartcontractor-backlog.md`
5. automation memory when present: `C:\Users\rivne\.codex\automations\gcsc-hourly-autonomous-builder\memory.md`

## Execution Loop

1. Run `git status --short --branch`.
2. Identify unrelated dirty/untracked files and avoid staging them.
3. Choose one safe local task from the backlog or active context.
4. Implement the smallest useful change.
5. Run the strongest relevant cheap check:
   - targeted `npm run check:*`;
   - full `npm run check` when package/check wiring changes;
   - local syntax/build validators;
   - document validators.
6. Update backlog/context/docs if status or process changed.
7. Stage only scoped files.
8. Commit with a specific message.
9. Push to `origin main` when allowed.
10. Update automation memory with the timestamp, files changed, checks run, commit/push status, and next safe step.

## Ask Founder Only For

Ask the founder for confirmation/approval only when the next step requires:

- password, private key, seed phrase, API key, raw database password, service-role key, or any other secret;
- external account login or external account setting change;
- paid service, subscription, billing, or partner onboarding;
- live Supabase migration, live production database change, or RLS policy apply;
- real payment, real loan, real escrow, token collateral, money movement, or wallet transaction;
- legal/attorney/business decision that cannot be inferred safely;
- destructive filesystem or Git action such as deleting data, `git reset --hard`, or reverting unknown user work;
- permanent architecture change with meaningful lock-in or third-party data transfer.

When asking, give one precise approval request and explain the consequence in plain Russian.

## Never Do

- Never expose secrets in chat, frontend code, docs, logs, or commits.
- Never use `git add .` in a dirty workspace.
- Never revert user changes unless the founder explicitly asks.
- Never turn GCSC into a generic landing page, generic marketplace, or unreviewed lending/escrow promise.
- Never apply live systems changes just because a local validator passes.

## Output Format

Report briefly in Russian:

```text
Сделано:
- ...

Проверено:
- ...

Commit/push:
- ...

Нужен founder только если:
- ...
```

## Learnings

- 2026-05-11: Git index permissions can block autonomous commits even when local checks pass. In that case, write a status note and keep the scoped file list clear so the founder can approve or run the commit safely.
