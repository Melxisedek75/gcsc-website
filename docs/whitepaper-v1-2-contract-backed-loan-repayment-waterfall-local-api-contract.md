# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Contract

Status: LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_CONTRACT

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, and not approval to move real money.

## Purpose

This contract defines the local-only API shape for reviewing draft repayment waterfall calculations inside founder/admin tooling. It connects the fixture matrix and pseudocode to an internal endpoint boundary without creating borrower obligations, lender/provider commitments, escrow custody, repayment routing, stablecoin settlement, token collateral, or production money movement.

The endpoint can only return a local draft response for engineering review. It must not be exposed as a borrower-facing, contractor-facing, provider-facing, public, production repayment, or money movement endpoint.

## Linked Inputs

- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-failure-state-matrix.md`
- `docs/smartcontractor-auth-rls-plan.md`

## Local Endpoint Boundary

The only allowed endpoint shape for local planning is:

`POST /api/admin/contract-backed-loan/repayment-waterfall/draft`

This is an admin-only local draft endpoint. It is scoped to founder/admin review, deterministic replay, fixture coverage, and audit-event planning. It must remain disabled for live repayment routing, public clients, provider calls, escrow release, stablecoin settlement, token collateral, production balance mutation, or AI final approval.

## Request Contract

Each request must include:

- `request_id`: unique local request identifier.
- `idempotency_key`: local replay key for deterministic duplicate handling.
- `actor_profile_id`: founder/admin reviewer profile reference.
- `actor_role`: founder, admin, legal_reviewer, finance_provider_reviewer, security_reviewer, or codex_local_reviewer.
- `project_contract_id`: local project contract reference.
- `milestone_id`: local milestone reference.
- `loan_request_id`: local draft loan request reference.
- `provider_terms_version`: reviewed local provider/legal/payment term version.
- `calculation_input`: repayment waterfall inputs from the pseudocode.
- `blocked_live_gate_status`: `BLOCKED_FOR_LIVE` or stricter.

The request must not include passwords, API keys, service-role keys, bank details, raw wallet secrets, private customer identity fields, provider credentials, live payment instructions, stablecoin routes, token collateral locks, or production repayment destinations.

## Response Contract

A successful local draft response must include:

- `request_id`
- `idempotency_key`
- `fixture_state`: `DRAFT_REPAYMENT_ALLOCATION` or a hold state.
- `approved_loan_repayment`
- `contractor_net_payout`
- `hold_reason`: null only for a valid local draft allocation.
- `blocked_live_gate_status`: `BLOCKED_FOR_LIVE` or stricter.
- `audit_event_id`

The response must not include an approval to originate credit, release escrow, route repayment, call a provider API, settle stablecoins, lock token collateral, mutate live balances, charge fees, or move production money.

## Error And Hold Responses

The endpoint must map local review failures to explicit hold states:

| Condition | Required Response |
| --- | --- |
| Missing, expired, copied, unclear, or unreviewed provider terms | `HOLD_FOR_PROVIDER_TERM_REVALIDATION` |
| Active dispute, unresolved evidence, or open dispute window | `HOLD_FOR_DISPUTE_WINDOW_REVIEW` |
| Missing owner acceptance or unapproved milestone | `HOLD_FOR_OWNER_ACCEPTANCE_REVIEW` |
| Retainage or lien waiver review incomplete | `HOLD_FOR_RETAINAGE_LIEN_REVIEW` |
| Pending, stale, unsigned, disputed, or over-budget change order | `HOLD_FOR_CHANGE_ORDER_REVIEW` |
| Calculated contractor payout below zero | `HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW` |
| Token collateral dependency | `LIVE_TOKEN_COLLATERAL_BLOCKED` |
| Stablecoin settlement dependency | `LIVE_STABLECOIN_SETTLEMENT_BLOCKED` |

Every hold response must include `request_id`, `idempotency_key`, `hold_reason`, `blocked_live_gate_status`, and `audit_event_id`.

## Idempotency And Replay Rules

- The same idempotency_key plus same request body must return the same local draft response.
- A changed request body with reused idempotency_key must return HOLD_FOR_IDEMPOTENCY_REVIEW.
- Replays must compare `input_hash`, `output_hash`, fixture state, blocked-live status, and audit-event reference.
- Replay output can only support local evidence review and must not mutate live balances, create repayment records, release escrow, or trigger provider calls.

## Auth And RLS Boundary

This endpoint must preserve the Auth/RLS safety model:

- no service-role key in browser code
- no anonymous access
- no borrower-facing endpoint
- no contractor self-approval
- no RLS bypass for public clients
- founder/admin reviewer access only until live Auth, strict RLS, admin activation, legal/provider approval, and security review are complete

Any missing actor profile, missing admin role, stale auth evidence, or unclear RLS ownership state must return HOLD_FOR_AUTH_RLS_REVIEW and `BLOCKED_FOR_LIVE`.

## Audit Event Contract

Each response must create or reference an append-only local audit event:

- audit_event must include request_id
- audit_event must include actor_profile_id
- audit_event must include input_hash
- audit_event must include output_hash
- audit_event must include blocked_live_gate_status
- audit_event must include endpoint name, fixture state, hold reason, created timestamp, and source commit when available

The audit event is local evidence only. It is not a ledger transaction, provider acknowledgement, escrow release instruction, repayment instruction, stablecoin settlement record, token collateral lock, or legal approval.

The required blocked gate set is:

- BLOCKED_FOR_LIVE
- LIVE_REPAYMENT_ROUTING_BLOCKED
- LIVE_ESCROW_CUSTODY_BLOCKED
- LIVE_STABLECOIN_SETTLEMENT_BLOCKED
- LIVE_TOKEN_COLLATERAL_BLOCKED
- AI_FINAL_APPROVAL_BLOCKED

## Blocked Live Actions

This API contract blocks:

- real loan origination
- real escrow
- real repayment routing
- provider API calls
- stablecoin settlement
- token collateral
- production money movement

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:auth-rls-plan`
- `npm run check`

## Acceptance Check

This local API contract passes when the endpoint path, request fields, response fields, hold responses, idempotency rules, Auth/RLS boundaries, audit-event requirements, blocked-live gate set, and required checks are explicit without enabling real loans, escrow, repayment routing, provider API calls, stablecoin settlement, token collateral, public access, borrower-facing flows, contractor self-approval, or production money movement.
