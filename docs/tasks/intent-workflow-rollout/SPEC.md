# SPEC: INTENT → SPEC → PLAN workflow rollout

## Requirements

| ID | Requirement | Acceptance evidence |
|---|---|---|
| R1 | Preserve existing desktop Codex rules and add the supplied workflow rule to the real global `AGENTS.md`. | Exact rule is found in `C:\Users\rivne\.codex\AGENTS.md`; surrounding v2 rules remain present. |
| R2 | Add the same rule to the confirmed GCSC project instructions. | `AGENTS.md`, `GEMINI.md`, and `.claude/CLAUDE.md` contain the rule and have identical SHA-256 hashes. |
| R3 | Record the task in four current task documents. | All four files exist under `docs/tasks/intent-workflow-rollout/` and PLAN identifies one next step. |
| R4 | Confirm desktop consumption, not only storage. | A fresh Codex session without conversation history reads the task documents and reports the actual next incomplete step. |
| R5 | API agents load only the requested task context at the real runtime entrypoint. | Runtime test proves validated task-id, containment under `docs/tasks`, exact document set, version metadata, secret rejection, and observable use by the agent. |

## Security rules for R5

- Accept a task-id only through a documented task-start contract.
- Reject traversal, absolute paths, separators, symlinks escaping `docs/tasks`,
  oversized context, missing required documents, and secret-looking content.
- Load only `INTENT.md`, `SPEC.md`, `PLAN.md`, and `REPORT.md` for that task-id.
- Attach repository commit and/or deterministic content version to the context.
- Do not expose task documents through an unauthenticated product endpoint.

## Scope boundary

The existing `construction-ai/server.js` product endpoints are not assumed to
be the coding-agent task runtime merely because they call an AI provider. R5
requires confirmation of the real API-agent task entry before implementation.
