# SmartContractor Week 2 Legal/Provider Recheck

Status: LOCAL_RECHECK_ONLY.

Date: 2026-06-06 PT.

Purpose: give the founder one local-only reading order and report-back block for legal/provider prep before any attorney outreach, provider outreach, packet send, legal conclusion, provider commitment, real finance action, token action, public claim approval, publication, public launch, or production action.

This recheck does not approve attorney/provider outreach, external sends, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR signatures, FIO registration, smart-contract deployment, public claim approval, publication, public launch, or production.

## Source Documents And Surfaces

Read in this order:

1. `docs/whitepaper-v1-3-legal-provider-review-packet.md`
2. `docs/whitepaper-v1-3-provider-question-register.md`
3. `docs/whitepaper-v1-3-provider-question-status-matrix.md`
4. `docs/whitepaper-v1-3-provider-handoff-packet-map.md`
5. `docs/whitepaper-v1-3-provider-shortlist.md`
6. `docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md`
7. `docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md`
8. `docs/smartcontractor-legal-financial-review-checklist.md`
9. `docs/smartcontractor-loan-legal-risk-model.md`
10. `docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md`
11. `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`

Local Admin surfaces:

- `/api/admin/legal-provider-next-step-readiness`
- `/api/admin/week-two-legal-provider-readiness`
- `/api/admin/week-two-legal-provider-execution-checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_execution_checklist`

## Week 2 Legal/Provider Recheck Sequence

1. Confirm the review scope is local prep only, with no attorney/provider outreach and no external packet send.
2. Confirm working-capital questions are grouped against lending, repayment routing, adverse action, credit decision, servicing, and disclosure boundaries.
3. Confirm escrow/payment questions are grouped against custody, release, refund, dispute, money transmission, payout, reconciliation, and provider-control boundaries.
4. Confirm ClaimBridge/advance questions are grouped against claim review, advance eligibility, assignment, payment priority, default handling, and human/provider decision boundaries.
5. Confirm token collateral questions are grouped against custody, volatility disclosure, security interest, lock/release, liquidation, oracle, and XPR/FIO/WebAuth action boundaries.
6. Confirm public claim wording is separated from legal/provider review and stays founder-review-only until explicit publication gates are cleared.
7. Confirm redaction and data minimization are ready before any future founder-controlled packet send.
8. Confirm response intake can record only sanitized summaries and never raw attorney advice, raw provider responses, credentials, customer private data, payment data, wallet data, or secrets.
9. Confirm every next step that needs attorney/provider opinion, provider commitment, external send, public claim approval, live finance, token collateral, XPR signature, FIO action, or production is classified as blocked.

## Current Hold State Matrix

| Area | Current local state | Required founder-controlled evidence | Default if missing |
| --- | --- | --- | --- |
| Working capital | Questions prepared | attorney/provider review owner, packet scope, redaction check, no-send state | HOLD_FOR_ATTORNEY_PROVIDER_REVIEW |
| Escrow/payment | Questions prepared | licensed escrow/payment owner, custody boundary, dispute state, no-send state | HOLD_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW |
| ClaimBridge/advance | Questions prepared | claim/advance reviewer role, assignment/priority scope, no-send state | HOLD_FOR_CLAIMBRIDGE_ADVANCE_REVIEW |
| Token collateral/custody | Questions prepared | legal/provider/security owner, custody/lock/release scope, no-token-action state | HOLD_FOR_TOKEN_COLLATERAL_REVIEW |
| Public claim wording | Review separated | founder/legal/provider review path and publication gate evidence | HOLD_FOR_PUBLIC_CLAIM_LEGAL_REVIEW |
| Provider response | No response recorded | founder-controlled response intake, redacted summary, owner role | HOLD_FOR_FOUNDER_CONTROLLED_RESPONSE_REVIEW |
| Finance/escrow live action | Blocked | separate explicit live-action approval plus provider/legal evidence | BLOCKED_FOR_LIVE_ACTION |

## Founder Safe Report-Back

Use this exact shape after local review. Do not paste secrets, attorney advice, raw provider responses, credentials, private user data, real payment references, wallet addresses, tx hashes, live URLs, or public launch approvals.

```text
Legal/Provider Week 2 Recheck
Scope: local prep only
working_capital_question_status:
escrow_payment_question_status:
claimbridge_advance_question_status:
token_collateral_question_status:
public_claim_wording_status:
question_packet_redaction_status:
selected_review_owner_role:
external_send_requested: no
provider_submission_attempted: no
raw_legal_or_provider_response_stored: no
legal_conclusion_made: no
provider_commitment_made: no
real_payment_or_loan_or_escrow_action_taken: no
token_or_xpr_action_taken: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

Use `READY_FOR_FOUNDER_REVIEW_PACKET` only when working capital, escrow/payment, ClaimBridge/advance, token collateral, public wording, redaction, evidence references, owner roles, response-intake boundary, and no-send state are recorded locally.

Use `READY_FOR_EXTERNAL_REVIEW_REQUEST_DRAFT` only when the founder can draft a future request from local materials. This state does not approve sending the request.

Use `NOT_READY_FOR_REVIEW` when questions, evidence references, redaction status, owner role, scope, no-send boundary, or response-intake boundary are unclear.

Use `BLOCKED_FOR_LEGAL_PROVIDER_DECISION` when the next step needs attorney/provider conclusion, provider commitment, external send, legal advice, raw response handling, public claim approval, live finance, escrow custody, payment movement, repayment routing, stablecoin settlement, token collateral, token custody, XPR signature, FIO registration, smart-contract deployment, publication, public launch, or production.

## Public Wording Boundary

Keep Web3, token, loan, escrow, ClaimBridge, advance, repayment routing, stablecoin, token collateral, XPR, FIO, Metallicus, provider, and partnership claims founder-review-only.

This recheck cannot approve public wording, public website replacement, public whitepaper publication, deck/PDF/email/social publication, provider outreach copy, or investor/shareholder materials.

## Codex Scope

Codex may update local docs, local validators, local review packets, Admin readiness checklists, and safe report-back templates.

Codex must stop before attorney/provider outreach, external sends, provider submissions, raw reviewer response storage, attorney advice storage, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, smart-contract deployment, XPR signatures, FIO registration, public claim approval, publication, public launch, production, external account login, paid service setup, live Supabase writes, or destructive actions.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:week-two-legal-provider-recheck
npm run check:legal-review
npm run check:whitepaper-v1-3-provider-question-status-matrix
npm run check:whitepaper-v1-3-provider-handoff-packet-map
npm run check:whitepaper-v1-3-reviewer-packet-redaction
npm run check:whitepaper-v1-3-reviewer-question-mapping
npm run check:smartcontractor
npm run check:auth
```

## Acceptance Check

This recheck passes only when the founder has one local-only legal/provider reading order, a safe no-secret and no-raw-response report-back block, READY/NOT_READY/BLOCKED states, working-capital, escrow/payment, ClaimBridge/advance, token-collateral, public-wording, redaction, and response-intake boundaries, plus explicit no-outreach, no-external-send, no-provider-submission, no-legal-conclusion, no-provider-commitment, no-real-payment, no-real-loan, no-real-escrow, no-repayment-routing, no-stablecoin-settlement, no-token-collateral, no-token-custody, no-XPR-signature, no-FIO-registration, no-smart-contract-deployment, no-public-claim-approval, no-publication, no-public-launch, and no-production boundaries.
