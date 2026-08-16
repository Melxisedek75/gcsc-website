# AI Review: <short-name>

## Identity

- Author AI: CODEX_AUTHOR
- Author context ID: <task/thread/session ID; concrete and non-placeholder>
- Reviewer AI: SOL_ULTRA_REVIEWER
- Reviewer context ID: <fresh isolated task/thread/session ID; differs from author>
- Prepared at (UTC): <YYYY-MM-DDTHH:MM:SSZ>
- Reviewed at (UTC): PENDING

`SOL_ULTRA` is an internal GCSC capability profile resolved to the highest
available Codex reasoning configuration. It is not an official public model
name. The author and reviewer roles and execution contexts must differ; a
same-context self-approval is invalid.

## Scope and risk

- Branch: <branch>
- Base SHA: <full SHA>
- Head SHA: <full SHA>
- Changed files: <explicit list or path to generated list>
- Requirements: <links or concise requirements>
- Risk tier: DOCUMENTATION
- Risk boundaries: <NOT_REQUIRED or explicit live-risk boundaries>
- Review record path: `ai-review/records/YYYY-MM-DD-short-name.md`

Use `DOCUMENTATION` for documentation-only work, `RUNTIME` for runtime,
authentication, payment, contract, database, or CI work, and `LIVE_RISK` when
any founder-required boundary is involved.

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
- Findings (P0/P1/P2/P3): PENDING
- Unresolved P0/P1 findings: PENDING

For `RUNTIME` and `LIVE_RISK`, replace `NOT_REQUIRED` with the isolated QA or
security context ID, exact commands, and result. The reviewer must use the
bounded evidence packet and independently inspect the diff.

## Decisions

- Status: PENDING
- Reviewer decision: PENDING
- Required checks: PENDING
- Merge decision: NOT_CONSIDERED
- Deploy decision: BLOCKED_FOUNDER
- Live-risk decision: BLOCKED_FOUNDER
- Founder approval evidence: PENDING

`APPROVED` only permits `Merge decision: CONSIDERATION_PERMITTED`; it does not
merge automatically. `Deploy decision` and every live-risk boundary remain
`BLOCKED_FOUNDER` until separate evidence-backed founder approval is recorded.

## Reviewer sign-off

<Only the isolated reviewer fills this section after independently reviewing
the recorded head and checks.>
