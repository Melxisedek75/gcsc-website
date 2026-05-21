# GCSC Whitepaper v1.2 Contract-Backed Loan Repayment Waterfall Local API Examples

Status: LOCAL_ONLY_REPAYMENT_WATERFALL_LOCAL_API_EXAMPLES

This document is not legal advice, not lending approval, not escrow approval, not payment-provider approval, not approval to launch real loans, not approval to launch real escrow, not approval to launch real repayment routing, not approval to launch stablecoin settlement, not approval to launch token collateral, and not approval to move real money.

## Purpose

This document gives placeholder-only request and response examples for the local repayment waterfall draft endpoint. The examples are intended for engineering review, fixture replay, and admin UI planning only.

The examples must not be used as production payloads, borrower-facing notices, lender commitments, provider instructions, escrow instructions, repayment instructions, stablecoin routes, token collateral locks, or public claims.

## Linked Inputs

- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md`
- `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix.md`
- `docs/smartcontractor-auth-rls-plan.md`

## Example Data Rules

All example data is placeholder-only:

- no real customer names
- no real bank details
- no real wallet secrets
- no provider credentials
- no live payment instructions
- no real project addresses
- no real borrower obligations
- no real escrow custody
- no stablecoin route
- no token collateral lock

## Example 1: Happy Path Draft Allocation

`example_request`

```json
{
  "request_id": "req_local_waterfall_001",
  "idempotency_key": "idem_local_waterfall_001",
  "actor_profile_id": "profile_founder_placeholder",
  "actor_role": "founder",
  "project_contract_id": "project_contract_placeholder_001",
  "milestone_id": "milestone_placeholder_001",
  "loan_request_id": "loan_request_placeholder_001",
  "provider_terms_version": "provider_terms_local_v0",
  "blocked_live_gate_status": "BLOCKED_FOR_LIVE",
  "calculation_input": {
    "milestone_gross": "10000.00",
    "approved_platform_fees": "300.00",
    "requested_repayment": "2500.00",
    "outstanding_balance": "2500.00",
    "milestone_repayment_cap": "3000.00",
    "retainage_holdback": "0.00",
    "disputed_work_amount": "0.00",
    "provider_approval_state": "LOCAL_REVIEWED_PLACEHOLDER",
    "dispute_state": "NO_ACTIVE_DISPUTE"
  }
}
```

`example_response`

```json
{
  "request_id": "req_local_waterfall_001",
  "idempotency_key": "idem_local_waterfall_001",
  "fixture_state": "DRAFT_REPAYMENT_ALLOCATION",
  "approved_loan_repayment": "2500.00",
  "contractor_net_payout": "7200.00",
  "hold_reason": null,
  "blocked_live_gate_status": "BLOCKED_FOR_LIVE",
  "audit_event_id": "audit_local_waterfall_001"
}
```

## Example 2: Missing Provider Terms Hold

The response must return `HOLD_FOR_PROVIDER_TERM_REVALIDATION` when `provider_terms_version` is missing, expired, copied, unclear, or unreviewed.

```json
{
  "example_request": {
    "request_id": "req_local_waterfall_002",
    "idempotency_key": "idem_local_waterfall_002",
    "actor_profile_id": "profile_admin_placeholder",
    "project_contract_id": "project_contract_placeholder_002",
    "milestone_id": "milestone_placeholder_002",
    "loan_request_id": "loan_request_placeholder_002",
    "provider_terms_version": "MISSING_LOCAL_REVIEW",
    "calculation_input": {}
  },
  "example_response": {
    "fixture_state": "HOLD_FOR_PROVIDER_TERM_REVALIDATION",
    "hold_reason": "provider_terms_missing_or_unreviewed",
    "blocked_live_gate_status": "BLOCKED_FOR_LIVE",
    "audit_event_id": "audit_local_waterfall_002"
  }
}
```

## Example 3: Active Dispute Hold

The response must return `HOLD_FOR_DISPUTE_WINDOW_REVIEW` when a milestone has an active dispute, unresolved evidence, or an open dispute window.

```json
{
  "example_request": {
    "request_id": "req_local_waterfall_003",
    "idempotency_key": "idem_local_waterfall_003",
    "actor_profile_id": "profile_admin_placeholder",
    "project_contract_id": "project_contract_placeholder_003",
    "milestone_id": "milestone_placeholder_003",
    "loan_request_id": "loan_request_placeholder_003",
    "provider_terms_version": "provider_terms_local_v0",
    "calculation_input": {
      "dispute_state": "ACTIVE_DISPUTE_PLACEHOLDER"
    }
  },
  "example_response": {
    "fixture_state": "HOLD_FOR_DISPUTE_WINDOW_REVIEW",
    "hold_reason": "active_dispute_or_unresolved_evidence",
    "blocked_live_gate_status": "LIVE_REPAYMENT_ROUTING_BLOCKED",
    "audit_event_id": "audit_local_waterfall_003"
  }
}
```

## Example 4: Idempotency Mismatch Hold

The response must return `HOLD_FOR_IDEMPOTENCY_REVIEW` when a caller reuses an `idempotency_key` with a changed request body.

```json
{
  "example_request": {
    "request_id": "req_local_waterfall_004",
    "idempotency_key": "idem_local_waterfall_001",
    "actor_profile_id": "profile_admin_placeholder",
    "project_contract_id": "project_contract_placeholder_004",
    "milestone_id": "milestone_placeholder_004",
    "loan_request_id": "loan_request_placeholder_004",
    "provider_terms_version": "provider_terms_local_v0",
    "calculation_input": {
      "requested_repayment": "9999.00"
    }
  },
  "example_response": {
    "fixture_state": "HOLD_FOR_IDEMPOTENCY_REVIEW",
    "hold_reason": "same_idempotency_key_changed_body",
    "blocked_live_gate_status": "BLOCKED_FOR_LIVE",
    "audit_event_id": "audit_local_waterfall_004"
  }
}
```

## Example 5: Token Collateral Or Stablecoin Block

The response must block token-collateral or stablecoin-dependent paths with `LIVE_TOKEN_COLLATERAL_BLOCKED` and `LIVE_STABLECOIN_SETTLEMENT_BLOCKED`.

```json
{
  "example_request": {
    "request_id": "req_local_waterfall_005",
    "idempotency_key": "idem_local_waterfall_005",
    "actor_profile_id": "profile_admin_placeholder",
    "project_contract_id": "project_contract_placeholder_005",
    "milestone_id": "milestone_placeholder_005",
    "loan_request_id": "loan_request_placeholder_005",
    "provider_terms_version": "provider_terms_local_v0",
    "calculation_input": {
      "requires_stablecoin_route": true,
      "requires_token_collateral": true
    }
  },
  "example_response": {
    "fixture_state": "LIVE_TOKEN_COLLATERAL_BLOCKED",
    "hold_reason": "stablecoin_or_token_collateral_dependency",
    "blocked_live_gate_status": "LIVE_STABLECOIN_SETTLEMENT_BLOCKED",
    "audit_event_id": "audit_local_waterfall_005"
  }
}
```

## Example 6: Auth/RLS Hold

The response must return `HOLD_FOR_AUTH_RLS_REVIEW` when reviewer identity, admin role, Auth evidence, or RLS ownership is unclear.

```json
{
  "example_request": {
    "request_id": "req_local_waterfall_006",
    "idempotency_key": "idem_local_waterfall_006",
    "actor_profile_id": "profile_unknown_placeholder",
    "actor_role": "unverified_reviewer",
    "project_contract_id": "project_contract_placeholder_006",
    "milestone_id": "milestone_placeholder_006",
    "loan_request_id": "loan_request_placeholder_006",
    "provider_terms_version": "provider_terms_local_v0",
    "calculation_input": {}
  },
  "example_response": {
    "fixture_state": "HOLD_FOR_AUTH_RLS_REVIEW",
    "hold_reason": "actor_or_rls_boundary_unclear",
    "blocked_live_gate_status": "BLOCKED_FOR_LIVE",
    "audit_event_id": "audit_local_waterfall_006"
  }
}
```

The blocked gate set remains:

- BLOCKED_FOR_LIVE
- LIVE_REPAYMENT_ROUTING_BLOCKED
- LIVE_ESCROW_CUSTODY_BLOCKED
- LIVE_STABLECOIN_SETTLEMENT_BLOCKED
- LIVE_TOKEN_COLLATERAL_BLOCKED
- AI_FINAL_APPROVAL_BLOCKED

## Blocked Live Actions

These examples block:

- real loan origination
- real escrow
- real repayment routing
- provider API calls
- stablecoin settlement
- token collateral
- production money movement

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-examples`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode`
- `npm run check:whitepaper-v1-2-contract-backed-loan-repayment-waterfall-fixture-matrix`
- `npm run check:auth-rls-plan`
- `npm run check`

## Acceptance Check

This example set passes when happy-path draft allocation, missing provider terms, active dispute, idempotency mismatch, token collateral or stablecoin dependency, and Auth/RLS hold examples preserve placeholder-only data, request and response shape, audit event IDs, blocked-live status, and no-real-money boundaries.
