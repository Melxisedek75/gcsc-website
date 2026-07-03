# P1-6 — Homepage v1.3 draft (whitepaper-aligned) + CI runner

- Change ID: 2026-07-03-p1-6-homepage-draft
- Repository: gcsc-website
- Branch: `fix/p1-6-homepage-v1-3-draft`
- Author AI: CLAUDE
- Reviewer AI: CODEX (pending)
- Author status: READY_FOR_REVIEW
- Reviewer decision: PENDING
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

## For CODEX reviewer
Independently run the 4 homepage validators + confirm no drift + confirm public `index.html`/`whitepaper.html` unchanged. Set decision. Do NOT publish or deploy — public homepage replacement is founder-gated even after APPROVED.
