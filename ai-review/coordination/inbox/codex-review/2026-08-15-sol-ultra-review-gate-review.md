# Review request: SOL Ultra independent review gate

- Change ID: 2026-08-15-sol-ultra-review-gate
- State: QUEUED
- Author AI: CODEX_AUTHOR
- Author context ID: 019e7c87-8410-79f1-b86a-eedf78a1aa27
- Requested reviewer: SOL_ULTRA_REVIEWER
- Repository: C:\gcsc\.tmp\codex\sol-ultra-review-gate
- Branch: codex/sol-ultra-review-gate
- Base commit: 06bbb5f2b16fa9f810ef9a2fb6152517e2e0ec21
- Reviewed implementation commit: b6a178e53a84bf80781b705ac76b272c6d1b9313
- Reviewed implementation tree: 2d2db19cc9e1f6bcac4ba8d733e255cdd9a3c872
- Risk tier: HIGH
- Review record: ai-review/records/2026-08-15-sol-ultra-review-gate.md

## Requirements

Review against:

- `docs/superpowers/specs/2026-08-15-sol-ultra-review-gate-design.md`
- `docs/superpowers/plans/2026-08-15-sol-ultra-review-gate.md`

Verify role/context isolation, UUIDv7 dispatch binding, mandatory paired-request
bindings, field/value consistency, PowerShell 5.1 behavior, fail-closed legacy
handling, negative tests, QA requirements, and all
founder/live-risk boundaries.

## Required checks

```powershell
git diff --check 06bbb5f2b16fa9f810ef9a2fb6152517e2e0ec21...b6a178e53a84bf80781b705ac76b272c6d1b9313
powershell -NoProfile -ExecutionPolicy Bypass -File execution/tests/ai-review-gate.tests.ps1
$a=(Get-FileHash AGENTS.md -Algorithm SHA256).Hash
$c=(Get-FileHash .claude/CLAUDE.md -Algorithm SHA256).Hash
$g=(Get-FileHash GEMINI.md -Algorithm SHA256).Hash
if(($a -ne $c)-or($a -ne $g)){throw 'Instruction files diverged'}
```

## Boundaries

The reviewer and QA agents are read-only except that the final reviewer may
update the review record. They must not commit, push, merge, deploy, access
external accounts, use secrets, modify live systems, move funds, or sign XPR/FIO
transactions.
