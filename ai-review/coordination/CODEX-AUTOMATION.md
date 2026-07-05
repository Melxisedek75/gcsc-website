# Codex 30-Minute Queue Poller

Activation: `ACTIVE_VIA_2_MIN_HEARTBEAT`.

The existing GCSC 2-minute heartbeat applies a 30-minute mailbox gate defined in `docs/codex-nonstop-execution-hook.md`. This avoids overlapping autonomous workers. The prompt below remains the canonical behavior for any future dedicated automation.

## Canonical Automation Prompt

Work from `C:\gcsc`. Read `AGENTS.md`, the required active-context/heartbeat/backlog files, `AI-REVIEW-GATE.md`, and `ai-review/coordination/PROTOCOL.md`. Run `git status --short --branch` and preserve unrelated dirty files.

Check `ai-review/coordination/inbox/codex/` for the oldest actionable task assigned to CODEX. Inspect `ai-review/coordination/outbox/codex/` and `outbox/claude/` for an unexpired lease or prior response. If no actionable task exists, make no repository changes and return a one-line quiet status.

For an actionable safe task, claim it using the lease protocol, use a dedicated branch/worktree, execute only its allowed scope, run all required checks independently, and write a separate response file to `outbox/codex/`. If CODEX authored code, queue review for CLAUDE in `inbox/claude/`; if CLAUDE authored code, update the matching review record with CODEX's independent verdict. Never self-approve.

Do not merge or deploy. Stop with `BLOCKED_FOUNDER` for secrets, external accounts, paid services, live Supabase, public-site replacement, real payments/loans/escrow, stablecoin/token collateral, XPR/FIO signatures, legal/provider commitments, mobile release, production, destructive actions, or any other live-risk boundary.

Keep founder-facing output concise: completed task, review result, checks, blockers, and required founder decision only.
