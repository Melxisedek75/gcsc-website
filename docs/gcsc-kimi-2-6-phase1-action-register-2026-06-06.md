# GCSC Kimi 2.6 Phase 1 Action Register

Date: 2026-06-06 PT

Status: CODEX_TRIAGED_LOCAL_ONLY

Purpose: convert the accepted Kimi 2.6 Phase 1 100-worker report package into a Codex-owned action register. This file prevents duplicate work, separates stale Kimi findings from real local gaps, and keeps founder/live/legal/provider boundaries explicit.

This register does not approve public website replacement, public whitepaper publication, deployment, live Supabase writes, admin activation, strict RLS apply, public beta launch, tester invites, external sends, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR/FIO signatures, app-store actions, secrets handling, production release, or destructive actions.

## Inputs Read

- `docs/gcsc-kimi-2-6-phase1-worker-output-intake-2026-06-06.md`
- `.tmp/kimi-phase1-2026-06-07/gcsc-kimi-2-6-controller-executive-summary-2026-06-07.md`
- `.tmp/kimi-phase1-2026-06-07/stream-*.md`
- `VALIDATORS.md`
- `construction-ai/package.json`
- `.github/workflows/smartcontractor-ci.yml`
- `docs/smartcontractor-smart-contract-test-fixtures.md`

## Status Vocabulary

| Status | Meaning |
| --- | --- |
| `DONE_CONFIRMED` | The item already exists or was completed by Codex after intake and has a passing local check where applicable. |
| `CORRECTED_STALE_KIMI_FINDING` | Kimi reported a missing item, but Codex verified it already exists locally. |
| `OPEN_SAFE_LOCAL` | Safe local documentation, validator, fixture, or review artifact can be created later without live action. |
| `VERIFY_BEFORE_BUILDING` | Kimi found a gap, but Codex must inspect existing files first to avoid duplicates. |
| `FOUNDER_OR_EXTERNAL_ONLY` | The next step requires founder, legal, provider, account, public, live, or money authority. |

## Corrected Tier 1 Tasks

| Kimi Task | Codex Triage | Evidence | Next Codex Action |
| --- | --- | --- | --- |
| Create blocked-for-live smart-contract validator | `DONE_CONFIRMED` | `npm --prefix construction-ai run check:smart-contract-local-replay-live-gate` passed; actual local command is `check:smart-contract-local-replay-live-gate`. | Do not create duplicate `check:smart-contract:blocked-for-live`; improve existing gate only if a real gap appears. |
| Create CI pipeline | `DONE_CONFIRMED` | `.github/workflows/smartcontractor-ci.yml` exists and `npm --prefix construction-ai run check:ci-workflow` passed. | Do not create duplicate workflow; maintain existing CI gate. |
| Create `VALIDATORS.md` | `DONE_CONFIRMED` | Root `VALIDATORS.md` exists after Codex intake follow-up. | Use as registry for future check selection. |
| Create `test/fixtures/` directory | `VERIFY_BEFORE_BUILDING` | No `test/fixtures/` directory exists, but `docs/smartcontractor-smart-contract-test-fixtures.md` exists, `docs/smartcontractor-smart-contract-fixture-gap-map-2026-06-06.md` records the executable fixture gap map, and `npm --prefix construction-ai run check:smart-contract-test-fixtures` passed. | Create executable fixture files only if a concrete local replay validator needs them. |
| Create `check:security-audit` | `OPEN_SAFE_LOCAL` | No package script with this exact name exists. Existing audit-related checks are narrower. | Candidate future task: local-only audit/secrets scan validator, no paid services and no secret output. |

## Corrected Tier 2 Tasks

| Kimi Task | Codex Triage | Evidence | Next Codex Action |
| --- | --- | --- | --- |
| Create legal/provider review packet | `CORRECTED_STALE_KIMI_FINDING` | `docs/whitepaper-v1-3-legal-provider-review-packet.md` exists. | Do not recreate; refresh only if founder/provider review scope changes. |
| Create partner outreach drafts | `CORRECTED_STALE_KIMI_FINDING` | `docs/whitepaper-v1-3-partner-outreach-drafts.md` exists. | Do not recreate; keep external sends founder-only. |
| Create unified vocabulary matrix | `DONE_CONFIRMED` | `docs/gcsc-unified-vocabulary-matrix.md` exists and stays local-only/no-live-action. | Use it to resolve Safe / Review-Required / Blocked wording conflicts without editing public files. |
| Create smart-contract anti-backdoor checklist | `DONE_CONFIRMED` | `docs/smart-contract-anti-backdoor-checklist.md` exists and stays local-only/no-live-action. | Use for future module/code review; do not treat it as deployment approval. |
| Create smart-contract deployment blocker spec | `DONE_CONFIRMED` | `docs/smart-contract-deployment-blocker-spec.md` exists and stays review-only/no-live-action. | Use for future module deployment-readiness reviews; local checks can never approve XPR deployment. |
| Create smart-contract complete boundary matrix | `DONE_CONFIRMED` | `docs/smart-contract-complete-boundary-matrix.md` exists and stays local-only/no-live-action. | Use as the cross-domain boundary map for future smart-contract-adjacent review. |
| Create repayment waterfall algorithm spec | `DONE_CONFIRMED` | `docs/repayment-waterfall-algorithm-spec-review-only.md` exists, ties the existing local helper/API fixtures to deterministic review-only waterfall inputs, outputs, hold precedence, fake-data cases, and required checks. | Use as local-only algorithm reference; do not treat it as live repayment, escrow, loan, token collateral, provider, XPR, public, or AI final approval. |
| Create working-capital language style guide | `DONE_CONFIRMED` | `docs/working-capital-language-style-guide-review-only.md` exists, after scanning v1.3 claim-risk/public draft, SmartContractor wording alignment/status, contract-backed loan technical requirements, repayment waterfall spec, and loan legal-risk model. | Use as local-only wording reference; do not treat it as public publication, loan, escrow, repayment, token collateral, provider, XPR/FIO, or AI final approval. |
| Create admin public copy validation rules | `DONE_CONFIRMED` | `docs/admin-public-copy-validation-rules.md` now documents the already-existing `POST /api/admin/beta-readiness/public-copy/validate`, `traditional_first_public_copy_gate`, browser-local metadata history, evidence-export source, safe/unsafe runtime smoke, and no-public/no-external/no-live boundaries. | Use the rules doc with `npm --prefix construction-ai run check:smartcontractor` and `npm --prefix construction-ai run check:auth`; do not create duplicate endpoint or publication approval flow. |
| Create Stream F loan boundary verification report | `DONE_CONFIRMED` | `docs/stream-f-loan-boundary-verification-report-2026-06-07.md` source-verifies Kimi Stream F against local contract-backed loan docs, Admin endpoints, auth smoke, repayment waterfall checks, and technical-requirements validators. | Use as the current local-only Stream F closeout; do not create a duplicate validator unless a future source-verified gap appears. |

## Corrected Tier 3 Tasks

| Kimi Task | Codex Triage | Evidence | Next Codex Action |
| --- | --- | --- | --- |
| Standardize future-regulated modal verbs | `DONE_CONFIRMED` | `docs/whitepaper-v1-3-future-regulated-modal-verbs-scan-2026-06-06.md` scans core v1.3 draft/positioning files and confirms source edits are not required now; watchlist replacements are documented for any future public-copy pass. | Use the scan before future publication or copy edits; keep public `index.html` and `whitepaper.html` unchanged unless founder gives a separate scoped publication approval. |
| Soften Metallicus framing | `VERIFY_BEFORE_BUILDING` | Current active context already says candidate/preferred only after diligence. | Scan source docs first; do not claim partnership. |
| Add claim-risk register entries | `OPEN_SAFE_LOCAL` | `docs/whitepaper-v1-3-claim-risk-register.md` exists. | Candidate future targeted update if missing entries are confirmed. |
| Add FCRA/ECOA compliance tracking document | `FOUNDER_OR_EXTERNAL_ONLY` for legal conclusions; `OPEN_SAFE_LOCAL` for question tracking | Legal review engagement remains founder/attorney-only. | Only create a question tracker; do not write legal conclusions. |
| Add homepage founder sub-states/timestamps | `VERIFY_BEFORE_BUILDING` | Admin surfaces exist; Kimi lacked full workspace access. | Inspect current Admin data model before adding fields. |
| Create homepage W3C/a11y/responsive validators | `OPEN_SAFE_LOCAL` | Exact scripts do not exist; `check:homepage-v1-3-static-draft` exists. | Candidate future validators, no public replacement. |
| Archive v1.2/Wave One docs | `FOUNDER_OR_EXTERNAL_ONLY` unless explicitly scoped | Moving many docs is broad and potentially destructive to project memory. | Do not archive autonomously; create a read-only archive plan first if needed. |
| Bump active context date | `VERIFY_BEFORE_BUILDING` | Active context date is intentionally older source-of-truth date. | Do not bump mechanically; update only with a meaningful context change. |

## Founder-Only Blockers

These remain outside Codex/Kimi autonomous authority:

1. Magic Link/Auth evidence and verified founder profile selection.
2. Live admin activation and strict RLS apply.
3. Deploy target/account/DNS/public URL decisions.
4. Legal/provider recipient decisions and external sends.
5. Public beta launch and tester invites.
6. `PUBLICATION_GO` for public `index.html` or `whitepaper.html`.
7. Real payments, loans, escrow, repayment routing, settlement, token collateral, and custody.
8. XPR/FIO signatures, registration, account creation, and smart contract deployment.
9. Mobile app-store/signing actions.

## Recommended Next Safe Local Queue

1. Create a local-only security audit validator only if it can run without exposing secrets or requiring paid/external services.
2. Add a dedicated loan-boundary validator only if Kimi Phase 2 or Codex source review finds a concrete uncovered assertion not already covered by `check:smartcontractor`, `check:auth`, repayment waterfall checks, and the contract-backed loan technical-requirements validator.
3. Create a read-only archive plan for legacy Wave One/v1.2 docs only if the founder asks for archive planning; do not move files autonomously.

## Closeout

Kimi Phase 1 remains accepted for local analysis only. Codex is the final integrator. The highest-value immediate correction was to separate real gaps from stale Kimi file-access findings before implementing any worker recommendation.
