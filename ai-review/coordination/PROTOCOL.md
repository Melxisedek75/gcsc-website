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
   writes `READY_FOR_REVIEW` to the record with `Change ID`, `Author AI`,
   `Author context ID`, and one of the exact risk tiers: `DOCS`, `STANDARD`,
   `HIGH`, or `LIVE`.
2. The author writes one request to
   `inbox/codex-review/YYYY-MM-DD-short-name-review.md` with only the bounded
   evidence packet: base/head SHA, changed files, requirements, exact commands,
   risk tier/boundaries, and review-record path.
3. The dispatcher starts a fresh `SOL_ULTRA_REVIEWER` task in a distinct
   reviewer context. The reviewer records its environment-issued UUID as
   `Reviewer context ID` before inspecting the diff. Identical, non-UUID, or
   placeholder context IDs are rejected.
4. The reviewer independently reads the diff and reruns the listed checks. For
   `DOCS` and `STANDARD`, `Independent QA/security` and `QA/security context ID`
   are both `NOT_REQUIRED`. For `HIGH` and `LIVE`, set
   `Independent QA/security: PASS` and record a concrete non-placeholder
   isolated `QA/security context ID` that differs from the author and reviewer
   context IDs, with its commands and results in the same review record.
5. P0/P1 findings produce `CHANGES_REQUESTED`. After repair, a fresh reviewer
   context repeats the review. Only that isolated reviewer can set `APPROVED`,
   attest the exact Head commit/tree, and create the review-only commit.
   After the reviewed head, only the current tracked regular Markdown review
   record may change. Coordination payloads, scripts, binaries, or additional
   records require a new reviewed head and independent pass. Final approval
   replaces every author/reviewer evidence placeholder with a UTC timestamp,
   completed summaries, diff inspection, rerun checks, findings, rationale,
   and `Status: APPROVED`.
6. If no independent reviewer configuration is available, leave the record
   `READY_FOR_REVIEW` or `BLOCKED`; never self-approve and never substitute
   repeated paid Claude polling for the required review.

## Boundaries

New records start with `Reviewer decision: PENDING`, `Required checks: PENDING`,
`Merge decision: BLOCKED`, `Deploy decision: BLOCKED_FOUNDER`,
`Live-risk decision: BLOCKED_FOUNDER`, `Founder evidence: PENDING`, `Founder
approval head: PENDING`, and `Founder approval operation: PENDING`.

After safe independent review, only `Reviewer decision: APPROVED`,
`Required checks: PASS`, and `Merge decision: READY` permit merge consideration.
For a merge that requests no live action, also set `Live-risk decision:
NOT_REQUIRED` and `Founder evidence: NOT_REQUIRED`. A human or authorized
integration action must still decide whether to merge; merge is not automatic.
Validate that state with:

```powershell
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/YYYY-MM-DD-short-name.md -Operation Merge
```

`Deploy decision` and all live-risk boundaries remain `BLOCKED_FOUNDER` until
a separate evidence-backed founder approval records `Live-risk decision:
FOUNDER_APPROVED`, safe `Founder evidence`, the exact reviewed SHA in `Founder
approval head`, an operation scope of `Merge`, `Deploy`, or `MergeAndDeploy`,
and `Deploy decision: READY` when deploy is requested.
Only then may the explicit deploy validation be run:

```powershell
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/YYYY-MM-DD-short-name.md -Operation Deploy
```

Neither command performs a merge or deploy.
The local gate always rejects `LIVE` and `Deploy`; a separate
founder-controlled runner must verify founder identity/evidence for either
operation.

Reviewers do not merge, deploy, publish, access external accounts, use secrets,
sign blockchain transactions, move funds, or alter live systems while reviewing.

## Historical records

Existing `CODEX`/`CLAUDE` records and old inbox items remain readable. Do not
rewrite them for this policy. `-LegacyRecord` is archival and always fails
closed; it cannot authorize merge or deploy. Any work that will be integrated
must receive a new strict record with explicit role/context fields and does not
depend on legacy Claude availability.
