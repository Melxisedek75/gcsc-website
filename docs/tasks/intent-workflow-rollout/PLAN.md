# PLAN: INTENT → SPEC → PLAN workflow rollout

Current checkout: `C:\gcsc`
Branch: `codex/ai-tooling-foundation`
Baseline commit: `05822d489f25a4715545a0f59b6a3c5b1688338a`

| Step | Requirement | Scope | Verification | Status |
|---|---|---|---|---|
| 1 | R3 | Create current INTENT, SPEC, PLAN, REPORT from the supplied handoff and repository evidence. | Required files exist and cross-reference the same task-id. | Complete |
| 2 | R1 | Add the supplied rule to the real desktop Codex `AGENTS.md`. | Exact-text search and preserved surrounding rules. | Complete and verified |
| 3 | R2 | Add the rule to the three confirmed GCSC instruction copies. | Exact-text search, identical SHA-256, `git diff --check`. | Complete and verified |
| 4 | R4 | Start a history-free desktop Codex session against `C:\gcsc` and ask it to resume this task. | Session names the first incomplete step from this PLAN and does not claim API integration complete. | Complete and verified |
| 5 | R5 | Identify and integrate the real API-agent task entrypoint. | Security tests plus one safe end-to-end agent run using current task documents and version. | Blocked pending runtime identification |
| 6 | R1-R5 | Update REPORT with exact evidence, limitations, and scoped Git state. | Report distinguishes file validation, fresh-session behavior, runtime test, commit, and push. | Complete for current desktop phase |

## Current next step

Confirm the real API-agent task-processing entrypoint and task-start contract for
step 5. Do not modify `construction-ai/server.js` until its product AI endpoints
are confirmed to be that runtime or another real task entrypoint is supplied.
