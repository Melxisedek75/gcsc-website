# GCSC Validator Registry

Date: 2026-06-06 PT

Purpose: provide one root-level map for local validators after Kimi 2.6 Phase 1 so Codex and report-only workers do not create duplicate checks or treat stale findings as missing work.

## Source Of Truth

- `construction-ai/package.json` is the validator script registry. `check:ci-workflow` currently verifies 301 required check scripts; the package may also contain narrower local `check*` gates outside that CI-required set.
- `construction-ai/scripts/run-checks.mjs` is the aggregate local check runner.
- `.github/workflows/smartcontractor-ci.yml` is the existing CI workflow gate.
- `docs/gcsc-kimi-2-6-phase1-worker-output-intake-2026-06-06.md` is the current Kimi Phase 1 intake record and stale-finding correction log.

## Core Commands

| Scope | Command | Use |
| --- | --- | --- |
| Full local aggregate | `npm --prefix construction-ai run check` | Broad local safety pass before major handoff or release prep. |
| Local security audit | `npm --prefix construction-ai run check:security-audit` | Scans tracked files only for high-risk secret-looking values with redacted output. |
| No live actions | `npm --prefix construction-ai run check:no-live-actions` | Scans tracked source/config for live-action triggers with redacted output. |
| SmartContractor app | `npm --prefix construction-ai run check:smartcontractor` | Main product/backend/admin readiness sweep. |
| Auth/admin | `npm --prefix construction-ai run check:auth` | Auth guards, request IDs, admin evidence and safe metadata checks. |
| CI workflow | `npm --prefix construction-ai run check:ci-workflow` | Verifies the local CI workflow remains present and wired. |

## High-Priority Safety Gates

| Family | Command | Boundary Protected |
| --- | --- | --- |
| Live chain block | `npm --prefix construction-ai run check:smart-contract-local-replay-live-gate` | Keeps replay work local and blocks live XPR/FIO/signature assumptions. |
| Local replay | `npm --prefix construction-ai run check:smart-contract-local-replay` | Verifies local smart-contract replay package readiness. |
| Deployment blockers | `npm --prefix construction-ai run check:smart-contract-deployment-blockers` | Keeps contract deployment/account/signature work blocked until founder approval. |
| Fixtures | `npm --prefix construction-ai run check:smart-contract-test-fixtures` | Verifies local smart-contract fixture coverage. |
| v1.3 publication dry run | `npm --prefix construction-ai run check:whitepaper-v1-3-publication-readiness-dry-run` | Keeps public publication in review-only mode. |
| v1.3 claim hardening | `npm --prefix construction-ai run check:whitepaper-v1-3-claim-risk-hardening` | Blocks risky public Web3/token/loan/escrow claims. |
| Homepage static draft | `npm --prefix construction-ai run check:homepage-v1-3-static-draft` | Validates the local homepage candidate without touching public files. |
| Local security audit | `npm --prefix construction-ai run check:security-audit` | Keeps tracked source/docs free of high-risk secret-looking values without printing secrets or reading untracked `.env` files. |
| No live actions | `npm --prefix construction-ai run check:no-live-actions` | Blocks package/workflow/source triggers for deploy, live Supabase mutation commands, signing, public HTML replacement, and unguarded external write calls. |

## Week 2 Founder-Decision Rechecks

| Area | Command |
| --- | --- |
| Auth/admin activation prep | `npm --prefix construction-ai run check:founder-auth-admin-activation-prep` |
| Deployment/public beta | `npm --prefix construction-ai run check:week-two-deployment-public-beta-recheck` |
| Legal/provider | `npm --prefix construction-ai run check:week-two-legal-provider-recheck` |
| Public beta scope | `npm --prefix construction-ai run check:week-two-public-beta-scope-recheck` |
| Mobile release | `npm --prefix construction-ai run check:week-two-mobile-release-recheck` |
| Investor/founder package | `npm --prefix construction-ai run check:week-two-investor-founder-package-recheck` |

## Non-Negotiable Boundaries

- Validators are local/read-only unless the script name and docs explicitly say otherwise.
- Do not use validators as approval for secrets, live Supabase writes, external account changes, deployment, public website replacement, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, FIO registration, legal decisions, provider commitments, mobile store actions, production, or destructive actions.
- `index.html` and `whitepaper.html` remain blocked from autonomous edits unless the founder gives explicit standalone publication approval.
- Kimi Phase 1 already identified stale findings: CI workflow and smart-contract live gate already exist. Do not create duplicate CI/live-gate validators; use the commands above.
