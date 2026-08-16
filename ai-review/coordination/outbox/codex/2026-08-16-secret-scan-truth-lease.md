# CODEX Task Lease: Secret-Scan Truthfulness

- Task ID: `CODEX-2026-08-16-secret-scan-truth`
- Status: `CLAIMED`
- Agent: `CODEX` (implementation coordinated with Terra and SOL Ultra)
- Claimed at: `2026-08-16T05:25:34Z`
- Lease expires at: `2026-08-16T06:55:34Z`
- Base branch: `origin/main` at `b55217ec9c177a732a726ba3c193956036c39aa1`
- Task branch: `codex/secret-scan-truth`
- Worktree: `C:\gcsc\.tmp\codex\secret-scan-truth`

## Scope

Correct the local public secret scanner so it flags credential-shaped values rather
than ordinary safety wording. Add focused Node tests and run the existing Android
preflight and security-audit checks. This task must not access secrets, external
accounts, Supabase, payment services, XPR, or any live system.

## Allowed paths

- `construction-ai/src/validation/public-secret-scan.mjs`
- `construction-ai/test/public-secret-scan.test.mjs`
- `construction-ai/scripts/validate-android-wrapper-preflight.mjs`
- `construction-ai/package.json`
- `ai-review/records/2026-08-16-secret-scan-truth.md`
- `ai-review/coordination/inbox/codex-review/2026-08-16-review-secret-scan-truth.md`
- `ai-review/coordination/outbox/codex/2026-08-16-secret-scan-truth-*.md`

## Required checks

1. `node --test construction-ai/test/public-secret-scan.test.mjs`
2. `npm --prefix construction-ai run check:android-preflight`
3. `npm --prefix construction-ai run check:security-audit`
4. `git diff --check`
