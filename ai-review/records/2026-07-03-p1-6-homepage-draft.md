# P1-6 — Homepage v1.3 draft (whitepaper-aligned) + CI runner

- Change ID: 2026-07-03-p1-6-homepage-draft
- Repository: gcsc-website
- Branch: `fix/p1-6-homepage-v1-3-draft`
- Author AI: CLAUDE
- Reviewer AI: CODEX
- Author status: READY_FOR_REVIEW
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED (public homepage — founder-gated)
- Deploy decision: BLOCKED

## Scope

Closes audit findings **P1-6** and **P1-4** together.

- **P1-6**: built the whitepaper-aligned homepage draft as INTERNAL, non-published files:
  - `index-v1-3-static-draft.html` — hand-authored, dependency-free (0 JS, 0 external assets, 1 inline style block, 7976 bytes). Carries `noindex,nofollow`, `Internal Draft - Not Approved For Publication`, `Publication Gate: NO-GO`, `Scope: No Real Money`. Wording matches the whitepaper boundary (Construction Trust Infrastructure / readiness data / future reviewed infrastructure) with NO blockchain/web3/token/xpr/escrow/loan/collateral claims.
  - `index-v1-3-draft.html` — Tailwind CDN QA baseline stub (kept so the existing draft-QA evidence reference resolves).
- **P1-4**: registered all 9 previously-drifting validators in `construction-ai/scripts/run-checks.mjs` (the 5 ready ones + the 4 homepage-v1-3 ones that now pass thanks to the draft). This **supersedes** branch `fix/p1-4-ci-runner` (which took the interim "remove 4 scripts" approach). Here nothing is removed — all 9 registered and green.

## What was NOT changed
- Public `index.html` and public `whitepaper.html` — untouched (validators confirm no draft-only content leaked into them).
- No deploy, no publication, no DNS/Pages/Vercel change.

## Verification (run by author)
| Check | Result |
|---|---|
| `check:homepage-v1-3-static-draft` | PASS (exit 0) |
| `check:homepage:performance` | PASS (7976 HTML bytes / 2888 CSS bytes, 0 JS, 0 external) |
| `check:homepage:seo` | PASS (title 28, desc 196, 1 h1, 5 h2 signals, noindex/nofollow, no canonical/og/twitter) |
| `check:homepage:w3c` | PASS (doctype, single skeleton, balanced stack, unique ids, 5 sections, 1 nav, 1 footer, local-only links) |
| runner drift (missingFromRunner / missingFromPackage) | 0 / 0 |

## Reviewer Notes (2026-07-03, CODEX)

- Reviewer independently inspected the diff: YES
- Reviewer independently ran required checks: YES
- Public/live/legal/payment boundary reviewed: YES
- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Deploy decision: BLOCKED
- Live-risk decision: BLOCKED

### Independent verification

| Check | Result | Evidence |
|---|---|---|
| Static draft validator | PASS | `node scripts/validate-homepage-v1-3-static-draft.mjs`, exit 0 |
| Performance validator | PASS | `node scripts/validate-homepage-v1-3-performance.mjs`, exit 0; 8208 HTML bytes, 3003 inline CSS bytes, 0 JS/external/data URI references in the Windows worktree |
| SEO validator | PASS | `node scripts/validate-homepage-v1-3-seo.mjs`, exit 0 |
| W3C/local validator | PASS WITH COVERAGE GAP | `node scripts/validate-homepage-v1-3-w3c.mjs`, exit 0, but it allowlists local HTML names without checking that targets exist |
| Public file boundary | PASS | `origin/main` and branch blob IDs are identical for `index.html` and `whitepaper.html` |
| Runner registry | PASS | `npm run check` passes the missing-script registry gate and starts executing checks |
| Full aggregate runner | FAIL (pre-existing baseline blocker) | Stops at `check:android-preflight`: forbidden secret-like wording in unchanged `construction-ai/public/smartcontractor.html` |

### Required change

**P1:** `index-v1-3-static-draft.html:134` and `:224` link to `whitepaper-v1-3-draft.html`, but that file is absent from the clean branch and repository. The validator allowlists the name at `construction-ai/scripts/validate-homepage-v1-3-w3c.mjs:35` and never checks target existence. Add the tracked target, point both links to an existing tracked document, or remove the links; then make the validator reject missing local targets and rerun all four validators.

### Additional notes

- The P1-4 runner registry repair is technically effective: all nine scripts are registered and the runner advances beyond its former drift failure.
- The aggregate Android preflight failure is not introduced by this branch; the checked public asset is byte-identical to `origin/main`.
- This is a stacked branch containing the P0 repair commits. If approved after correction, preserve merge order or rebase it onto the then-current reviewed base.
- The local `ai-review-gate.ps1` currently fails to parse CRLF review records on Windows (`missing field: Author AI`); this is a separate review-tooling blocker, not approval evidence for this branch.
- No public file replacement, publication, merge, or deploy is approved.

## Sign-off

- Reviewer decision: CHANGES_REQUESTED
- Required checks: FAIL
- Unresolved P0/P1 findings: 1
- Live-risk decision: BLOCKED
- Founder evidence: PENDING
- Deploy decision: BLOCKED
