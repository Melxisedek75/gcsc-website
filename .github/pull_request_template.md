## Scope

Describe one complete change and the user-visible behavior.

## Cross-review

- Review record: `ai-review/records/YYYY-MM-DD-short-name.md`
- Author AI: `CODEX` or `CLAUDE`
- Reviewer AI: the other agent
- Reviewer decision: `NOT_REVIEWED`
- Unresolved P0/P1 findings: `0`

## Verification

- [ ] Focused tests pass
- [ ] Regression checks pass
- [ ] Secret/dependency scan reviewed
- [ ] Public/live/legal/payment boundaries reviewed
- [ ] `execution/ai-review-gate.ps1` returns `AI_REVIEW_GATE=PASS`

## Release boundary

- Live-risk decision: `NOT_REQUIRED` / `FOUNDER_APPROVED` / `BLOCKED`
- Founder evidence (no secrets): `NOT_REQUIRED`
- Deploy decision: `BLOCKED`

Do not merge or deploy while the review record says `CHANGES_REQUESTED`, checks fail, P0/P1 findings remain, or a live-risk decision is missing.
