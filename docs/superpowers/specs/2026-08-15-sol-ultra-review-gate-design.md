# SOL Ultra Independent Review Gate Design

## Decision

The founder approved replacing the unavailable mandatory Claude review with an
independent Codex review profile named `SOL_ULTRA_REVIEWER`. `SOL_ULTRA` is an
internal GCSC capability profile, not a hard-coded public model name.

## Goals

- Keep implementation authors and approving reviewers in separate contexts.
- Use the highest locally available Codex reasoning profile for final review.
- Preserve reproducible checks, P0/P1 remediation, and auditable sign-off.
- Keep merge and every live-risk action behind their existing gates.
- Remove Claude subscription availability as a delivery blocker.

## Non-goals

- A working agent may not approve its own changes.
- Review approval does not merge, deploy, publish, move funds, or authorize a
  live service.
- The policy does not claim that `SOL_ULTRA` is an official OpenAI model name.
- Historical review records are not rewritten.

## Agent identities

Every new review record carries both an agent identity and a context identity:

- `Author AI`: `CODEX_AUTHOR`, `SOL_ULTRA_AUTHOR`, or a supported external
  author such as `CLAUDE`.
- `Author context ID`: the originating environment-issued UUIDv7.
- `Reviewer AI`: normally `SOL_ULTRA_REVIEWER`; `CODEX_REVIEWER` and
  `CLAUDE_REVIEWER` remain valid independent alternatives.
- `Reviewer context ID`: the isolated reviewer environment-issued UUIDv7.
- `Reviewer dispatch evidence`: `codex-agent:<Reviewer context ID>`, verified
  against the actual dispatcher notification by the integration controller.
- `QA/security dispatch evidence`: the same binding for required HIGH/LIVE QA.

The gate rejects identical author/reviewer roles and identical non-placeholder
context IDs. A reviewer must receive a bounded evidence packet rather than the
author's reasoning history. The paired review request is mandatory and binds
Change ID, branch, and head. Git author metadata is not cryptographic identity;
the trusted integration controller verifies dispatch evidence against actual
subagent notifications.
The gate also binds Base commit to `merge-base(origin/main, Head commit)` and
compares both record and request working content with their committed blobs.

## Review workflow

1. The author works on a dedicated branch/worktree and records exact scope.
2. The author runs every required check and marks the record
   `READY_FOR_REVIEW`.
3. A fresh `SOL_ULTRA_REVIEWER` receives the base/head SHAs, changed files,
   requirements, commands, risk boundaries, and review-record path.
4. The reviewer independently reads the diff and reruns the checks.
5. P0/P1 findings produce `CHANGES_REQUESTED`; the author repairs them and a
   fresh review pass repeats.
6. Only the isolated reviewer writes `APPROVED` and `Required checks: PASS`.
7. `execution/ai-review-gate.ps1` validates identity separation and record
   completeness before merge consideration.
8. Merge remains an explicit integration action. Deploy and all live-risk
   operations remain `BLOCKED_FOUNDER` until separately approved.

## Risk tiers

- Documentation-only changes require one independent `SOL_ULTRA_REVIEWER`.
- Runtime, authentication, payment, contract, database, or CI changes require
  the reviewer plus an independent QA/security pass recorded in the same file.
- Live-risk work always stops before external mutation regardless of review
  outcome.

## Compatibility

Historical `CODEX` and `CLAUDE` records remain readable. New records use
explicit role and context fields. `-LegacyRecord` is an archival marker that
always fails closed and cannot authorize merge or deploy.

## Validation

Pester-independent PowerShell fixtures cover:

- valid independent SOL Ultra review;
- same-role rejection;
- same-context rejection;
- pending decision rejection;
- failed checks rejection;
- uncleared live-risk rejection;
- fail-closed archival handling when explicitly requested;
- UTF-8 and line-ending handling.

## Current PR migration

PR #3 remains draft. Its review task changes from unavailable `CLAUDE` to a
fresh `SOL_ULTRA_REVIEWER`. The reviewer must inspect commit
`393135a4236b0b4abed634325b3424da92c0cdce`, rerun the documented checks, and
update its review record without relying on the author's prior conclusions.
