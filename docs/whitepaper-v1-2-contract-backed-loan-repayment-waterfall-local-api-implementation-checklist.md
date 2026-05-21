# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Implementation Checklist

Status: LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_IMPLEMENTATION_CHECKLIST

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, and not approval to move real money.

## Purpose

This checklist defines the minimum local implementation controls before any repayment waterfall draft endpoint can be coded or reviewed. It turns the contract, pseudocode, and examples into an engineering checklist while preserving local-only, no-real-money, no-provider-call, no-live-risk boundaries.

The checklist can only support local handler scaffolding and replay review. It must not support public access, borrower-facing flows, contractor self-approval, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, provider calls, production deploy, or production money movement.

## Linked Inputs

- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md`
- `docs/smartcontractor-auth-rls-plan.md`

## Implementation Scope

Allowed local scope:

- local handler only
- local calculation helper
- local idempotency helper
- local audit event helper
- local fixture replay helper
- admin review UI planning notes

Disallowed scope:

- live loan origination
- live repayment routing
- live escrow custody
- stablecoin settlement
- token collateral
- provider API calls
- public endpoint exposure
- production money movement

## Required Local Modules

Before implementation starts, the local package must identify:

- a route handler for `POST /api/admin/contract-backed-loan/repayment-waterfall/draft`
- a deterministic repayment calculation helper
- an idempotency key and input hash checker
- an append-only audit event helper
- a fixture replay helper for all waterfall examples
- a local Auth/RLS guard wrapper

Each module must default to `BLOCKED_FOR_LIVE` and must be reviewed as local-only.

## Required Endpoint Checks

The endpoint implementation must validate:

- `request_id`
- `idempotency_key`
- `actor_profile_id`
- `project_contract_id`
- `milestone_id`
- `loan_request_id`
- `provider_terms_version`
- `calculation_input`
- `blocked_live_gate_status`
- no secret-looking values or live payment instructions

The response must include:

- `DRAFT_REPAYMENT_ALLOCATION` or a hold state
- `approved_loan_repayment`
- `contractor_net_payout`
- `hold_reason`
- `audit_event_id`
- `blocked_live_gate_status`

## Required Hold Checks

Implementation must include local tests or fixture replay checks for:

- `HOLD_FOR_PROVIDER_TERM_REVALIDATION`
- `HOLD_FOR_DISPUTE_WINDOW_REVIEW`
- `HOLD_FOR_OWNER_ACCEPTANCE_REVIEW`
- `HOLD_FOR_RETAINAGE_LIEN_REVIEW`
- `HOLD_FOR_CHANGE_ORDER_REVIEW`
- `HOLD_FOR_NEGATIVE_CONTRACTOR_PAYOUT_REVIEW`
- `HOLD_FOR_IDEMPOTENCY_REVIEW`
- `HOLD_FOR_AUTH_RLS_REVIEW`
- `LIVE_TOKEN_COLLATERAL_BLOCKED`
- `LIVE_STABLECOIN_SETTLEMENT_BLOCKED`

No hold path may mutate a live balance, create a repayment record, release escrow, call a provider, settle stablecoins, lock collateral, or move money.

## Required Auth And RLS Checks

The implementation must preserve:

- no service-role key in browser code
- no anonymous access
- no borrower-facing endpoint
- no contractor self-approval
- no RLS bypass for public clients
- founder/admin reviewer access only while live activation remains blocked

Missing actor identity, unclear role, stale session evidence, missing admin membership, or uncertain ownership must return `HOLD_FOR_AUTH_RLS_REVIEW`.

## Required Audit Checks

Every local response must create or reference an audit event:

- audit_event must include request_id
- audit_event must include actor_profile_id
- audit_event must include input_hash
- audit_event must include output_hash
- audit_event must include blocked_live_gate_status
- audit_event must include fixture state and hold reason

The required blocked gate set remains:

- BLOCKED_FOR_LIVE
- LIVE_REPAYMENT_ROUTING_BLOCKED
- LIVE_ESCROW_CUSTODY_BLOCKED
- LIVE_STABLECOIN_SETTLEMENT_BLOCKED
- LIVE_TOKEN_COLLATERAL_BLOCKED
- AI_FINAL_APPROVAL_BLOCKED

## Blocked Live Actions

This checklist blocks:

- real loan origination
- real escrow
- real repayment routing
- provider API calls
- stablecoin settlement
- token collateral
- production money movement

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-implementation-checklist`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode`
- `npm run check:auth-rls-plan`
- `npm run check`

## Acceptance Check

This checklist passes when the local handler scope, local helper modules, endpoint field validation, response field validation, hold-state coverage, Auth/RLS guards, audit-event requirements, blocked-live gate set, and required checks are explicit before coding starts, without enabling public access, real loans, escrow, repayment routing, provider API calls, stablecoin settlement, token collateral, or production money movement.
