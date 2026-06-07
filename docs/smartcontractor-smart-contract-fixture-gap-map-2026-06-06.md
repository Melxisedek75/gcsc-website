# SmartContractor Smart Contract Fixture Gap Map

Date: 2026-06-06 PT

Status: LOCAL_FIXTURE_GAP_MAP_ONLY

Purpose: answer Kimi Phase 1 Stream H-10 without blindly creating `test/fixtures/` directories. The current workspace already has a smart-contract fixture plan and validator; this map separates covered fixture design from real executable fixture gaps.

This document does not approve live XPR deployment, account creation, signatures, real escrow, real loans, real payments, repayment routing, stablecoin settlement, token collateral, token custody, provider action, legal decision, live Supabase write, production release, or public file replacement.

## Inputs Checked

- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `construction-ai/scripts/validate-smart-contract-test-fixtures.mjs`
- `construction-ai/src/smart-contracts/replay/`
- `construction-ai/src/smart-contracts/replay/repaymentWaterfallDraftEndpointFixtures.mjs`
- `construction-ai/scripts/validate-repayment-waterfall-draft-endpoint-fixtures.mjs`
- `.tmp/kimi-phase1-2026-06-07/stream_h_qa_validators_fixtures_ci.md`
- `docs/gcsc-kimi-2-6-phase1-action-register-2026-06-06.md`

## What Already Exists

| Area | Existing Coverage | Current Status |
| --- | --- | --- |
| Fixture plan | `docs/smartcontractor-smart-contract-test-fixtures.md` defines local fixture accounts, objects, scenarios, links, not-allowed items, and pre-execution gates. | `DONE_CONFIRMED` |
| Fixture validator | `npm --prefix construction-ai run check:smart-contract-test-fixtures` validates the fixture plan and no-real-money boundaries. | `DONE_CONFIRMED` |
| Repayment fixture helper | `construction-ai/src/smart-contracts/replay/repaymentWaterfallDraftEndpointFixtures.mjs` exists with a targeted validator. | `PARTIAL_EXECUTABLE_COVERAGE` |
| Local replay package | `construction-ai/src/smart-contracts/replay/` contains replay packet, manifest, digest, evidence, review proof, founder packet, live gate, and approval-decision helpers. | `DONE_CONFIRMED` |
| Live gate | `check:smart-contract-local-replay-live-gate` exists and returns `HOLD_FOR_FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW`. | `DONE_CONFIRMED` |

## Gap Map

| Kimi Fixture Category | Current Local State | Gap | Recommended Next Step |
| --- | --- | --- | --- |
| `test/fixtures/users/` | Fixture accounts are documented (`demoowner111`, `democontr111`, `demoinspect1`, `demoadmin111`, `demoprovidr1`, `demosecurty1`, `demomulti111`). | No executable user fixture module yet. | Create only when a validator needs importable mock users; keep fake names and no auth tokens. |
| `test/fixtures/smart-contracts/` | Fixture objects and seven required scenarios are documented; replay helpers exist. | No shared executable state fixture module for project, milestone, dispute, authority, collateral, and audit cases. | Prefer a small smart-contract fixture module after the first concrete replay validator requests it. |
| `test/fixtures/auth/` | Auth/admin readiness is covered by docs and local checks, but live Magic Link/profile evidence is founder-only. | No mock-session fixture module. | Keep auth fixtures token-free; never use real Magic Link URLs, JWTs, cookies, or service-role values. |
| `test/fixtures/whitepaper/` | Whitepaper validators mostly scan local docs/drafts directly. | Isolated mock whitepaper fixtures are not yet required by current validators. | Defer unless future validators need controlled positive/negative claim examples. |
| `test/fixtures/homepage/` | Homepage static draft validator exists and scans local draft/public candidates. | Isolated homepage fixture HTML is not yet required. | Defer until W3C/a11y/responsive validators are implemented locally. |
| `test/fixtures/payments/` | Payment, loan, escrow, repayment, stablecoin, and token collateral are blocked/live-risk domains. | No executable payment fixture module. | If created, use labels only such as `FAKE_PAYMENT_EVENT`, never bank/card/wallet/provider data. |
| `test/fixtures/investor-package/` | Investor/founder package checks are metadata-only and external sends are blocked. | No fixture module needed today. | Keep low priority; create only for local claim-risk tests. |
| `test/fixtures/factories/` | No factory functions exist. | Factory layer would be premature before first executable fixture module. | Add after at least one users or smart-contract fixture module exists. |

## Path Decision

Do not create root-level `test/fixtures/` yet. The active Node package is `construction-ai`, and it currently has no dedicated test runner beyond `npm run check`.

Preferred future path if executable fixtures become necessary:

```text
construction-ai/src/smart-contracts/fixtures/
```

Use `construction-ai/test/fixtures/` only after the project adds a real test runner that expects that directory.

## Acceptance Criteria Before Executable Fixtures

Executable fixtures should be added only when all of these are true:

1. A named validator or replay check needs importable fixture data.
2. The fixture file contains `FAKE_DATA_ONLY`.
3. No fixture contains secrets, tokens, cookies, wallet keys, service-role values, bank/card data, real wallet addresses, live RPC URLs, or production provider identifiers.
4. Fixture values use demo labels and local-only XPR-style placeholder account names.
5. The validator proves no live Supabase, external provider, deployment, payment, escrow, loan, token collateral, FIO, or XPR signature path can run.
6. `index.html` and `whitepaper.html` remain unchanged.

## Immediate Recommendation

Keep the current fixture work at `VERIFY_BEFORE_BUILDING`. The existing fixture plan and validator are enough for current documentation/readiness gates. The next safe implementation step is not to create a directory tree, but to create a first executable fixture only when a specific replay validator needs it.

