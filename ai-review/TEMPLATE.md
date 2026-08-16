# AI Review: <short-name>

## Identity and provenance

- Change ID: <YYYY-MM-DD-short-name>
- Repository: <repository>
- Branch: <branch>
- Base commit: <full SHA>
- Head commit: <full SHA>
- Author AI: CODEX_AUTHOR
- Author context ID: <task/thread/session ID; concrete and non-placeholder>
- Reviewer AI: SOL_ULTRA_REVIEWER
- Reviewer context ID: <fresh isolated task/thread/session ID; differs from author>
- Author status: PENDING
- Prepared at (UTC): <YYYY-MM-DDTHH:MM:SSZ>
- Reviewed at (UTC): PENDING

`SOL_ULTRA` is an internal GCSC capability profile resolved to the highest
available Codex reasoning configuration. It is not an official public model
name. The author and reviewer roles and execution contexts must differ; a
same-context self-approval is invalid.

## Scope and risk

- Changed files: <explicit list or path to generated list>
- Requirements: <links or concise requirements>
- Risk tier: DOCS
- Risk boundaries: <NOT_REQUIRED or explicit live-risk boundaries>
- Review record path: `ai-review/records/YYYY-MM-DD-short-name.md`

Use only `DOCS`, `STANDARD`, `HIGH`, or `LIVE`. `DOCS` and `STANDARD` use no
independent QA/security pass; `HIGH` and `LIVE` require one.

## Author evidence packet

- Required checks run by author:
  - `<exact command>`: PENDING
- Result summary: PENDING
- Known limitations and open risks: PENDING
- Packet contents are bounded to scope, SHAs, changed files, requirements,
  commands, risk boundaries, and this record. Do not include the author's
  private reasoning transcript.

## Independent review

- Reviewer diff inspection: PENDING
- Required checks rerun independently:
  - `<exact command>`: PENDING
- Independent QA/security: NOT_REQUIRED
- QA/security context ID: NOT_REQUIRED
- Findings (P0/P1/P2/P3): PENDING
- Unresolved P0/P1 findings: PENDING

For `DOCS` and `STANDARD`, both QA/security fields remain `NOT_REQUIRED`. For
`HIGH` and `LIVE`, set `Independent QA/security: PASS` and provide a concrete,
non-placeholder isolated `QA/security context ID` that differs from the author
and reviewer context IDs; record its exact commands and results below. The
reviewer must use the bounded evidence packet and independently inspect the
diff.

## Decisions

- Status: PENDING
- Reviewer decision: PENDING
- Required checks: PENDING
- Merge decision: BLOCKED
- Deploy decision: BLOCKED_FOUNDER
- Live-risk decision: BLOCKED_FOUNDER
- Founder evidence: PENDING

After safe independent approval for merge, set `Reviewer decision: APPROVED`,
`Required checks: PASS`, and `Merge decision: READY`. This only permits merge
consideration and does not merge automatically. If no live action is requested,
also set `Live-risk decision: NOT_REQUIRED` and `Founder evidence: NOT_REQUIRED`
before the explicit `-Operation Merge` gate. `Deploy decision` remains
`BLOCKED_FOUNDER` until separate evidence-backed founder approval changes
`Live-risk decision` to `FOUNDER_APPROVED`, records safe `Founder evidence`,
sets `Deploy decision: READY`, and passes the explicit `-Operation Deploy` gate.

## Reviewer sign-off

<Only the isolated reviewer fills this section after independently reviewing
the recorded head and checks.>
