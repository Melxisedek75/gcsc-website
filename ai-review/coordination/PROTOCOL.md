# Independent SOL Ultra Review Coordination Protocol

## Purpose

This protocol dispatches independent review without making a paid Claude
subscription, Claude polling, external account, or a web login a prerequisite.
For new Codex-authored work, the default reviewer is `SOL_ULTRA_REVIEWER`.
`SOL_ULTRA` is an internal GCSC capability profile resolved to the highest
available Codex reasoning configuration; it is not an official public model.

## Locations

- `ai-review/records/`: authoritative review records created from
  `ai-review/TEMPLATE.md`.
- `ai-review/coordination/inbox/codex-review/`: new bounded review requests
  for `SOL_ULTRA_REVIEWER`. The first request creates this directory with its
  request file.
- `ai-review/coordination/inbox/codex/` and
  `ai-review/coordination/inbox/claude/`: legacy compatibility routes only;
  they do not control the default reviewer for new Codex-authored work.
- `ai-review/coordination/outbox/`: optional claim/result notices. The review
  record remains the source of truth for decisions.

## Request lifecycle

1. The author completes its own checks on a dedicated branch/worktree and
   writes `READY_FOR_REVIEW` to the record with `Author AI` and `Author context ID`.
2. The author writes one request to
   `inbox/codex-review/YYYY-MM-DD-short-name-review.md` with only the bounded
   evidence packet: base/head SHA, changed files, requirements, exact commands,
   risk tier/boundaries, and review-record path.
3. The dispatcher starts a fresh `SOL_ULTRA_REVIEWER` task in a distinct
   reviewer context. The reviewer records its `Reviewer context ID` before
   inspecting the diff. Identical or placeholder context IDs are rejected.
4. The reviewer independently reads the diff and reruns the listed checks. For
   `RUNTIME` or `LIVE_RISK`, an independent QA/security pass is recorded in the
   same review record.
5. P0/P1 findings produce `CHANGES_REQUESTED`. After repair, a fresh reviewer
   context repeats the review. Only that isolated reviewer can set `APPROVED`.
6. If no independent reviewer configuration is available, leave the record
   `READY_FOR_REVIEW` or `BLOCKED`; never self-approve and never substitute
   repeated paid Claude polling for the required review.

## Boundaries

An `APPROVED` review only permits merge consideration. A human or authorized
integration action must decide whether to merge; merge is not automatic.
`Deploy decision` and all live-risk boundaries remain `BLOCKED_FOUNDER` until
a separate, evidence-backed founder approval is attached without secrets.

Reviewers do not merge, deploy, publish, access external accounts, use secrets,
sign blockchain transactions, move funds, or alter live systems while reviewing.

## Historical records

Existing `CODEX`/`CLAUDE` records and old inbox items remain readable. Do not
rewrite them for this policy. They are compatibility evidence only; new work
uses explicit role and context fields and does not depend on legacy Claude
availability.
