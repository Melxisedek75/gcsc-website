# INTENT: INTENT → SPEC → PLAN workflow rollout

## Outcome

Desktop Codex must reliably use task-scoped `INTENT.md`, `SPEC.md`, `PLAN.md`,
and `REPORT.md` for substantial GCSC work, including after a fresh session.
API-driven agents must eventually receive the same current task context from
their real task-processing entrypoint rather than relying on files merely being
present in GitHub.

## Users

- GCSC founder using desktop Codex on this Windows machine.
- Codex, Claude, and Gemini agents operating in the confirmed `C:\gcsc` checkout.
- API agents once their real task runtime and task contract are confirmed.

## Constraints

- Preserve all existing global and project instructions.
- Do not change models, credentials, permissions, billing, or live services.
- Do not expose secrets or load arbitrary repository paths.
- Keep the three project instruction copies byte-identical.
- Do not claim API-agent integration from documents or scaffolding alone.

## Success

The global desktop instructions and confirmed project instructions contain the
workflow rule, a fresh session can identify the real next plan step, and any
future API integration is accepted only after a real end-to-end context-loading
check at the actual runtime entrypoint.
