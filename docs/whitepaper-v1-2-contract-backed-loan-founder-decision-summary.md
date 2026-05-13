# GCSC Whitepaper v1.2 Contract-Backed Loan Founder Decision Summary

Status: internal founder decision summary only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This summary gives the founder one short place to record the internal decision after reviewing the contract-backed working-capital packet. It is designed to sit after the founder review closeout and before any legal/provider, finance-provider, technical, claim-review, public excerpt, or public-use review.

## Decision Fields

| Field | Allowed Values | Notes |
|-------|----------------|-------|
| Decision ID | `CBL-FDS-001` style ID | Non-secret internal reference only |
| Packet version | Draft label or commit hash | Do not include private links or credentials |
| Founder outcome | Accept / Revise / Reject / Hold | Must match response template and triage log |
| Reason | Short non-secret explanation | No legal conclusions or provider promises |
| Next queue | Legal/provider / Finance-provider / Technical / Claim-review / Public-use gate / Blocked | Choose only review queues, not live launch |
| Exact sentence IDs | Existing sentence IDs only | New sentences must go through the exact sentence register |
| Placement IDs | Existing placement IDs only | New placements must go through the placement map |
| Public-use status | Blocked / Review / Future GO | GO requires all approval records |
| Live implementation status | Blocked | Live loans, escrow, token collateral, repayment routing, and AI payment release remain blocked |

## Allowed Summary Outcomes

- Accept for internal review only.
- Revise internal wording.
- Reject the concept.
- Hold for legal/provider review.
- Hold for finance-provider review.
- Hold for technical review.
- Hold for claim-review or public-use gate review.

## Blocked Summary Outcomes

The summary cannot approve:

- public whitepaper publication;
- website, deck, grant, partner, investor, email, social, or announcement excerpts;
- live contractor loans;
- real escrow;
- stablecoin settlement;
- token collateral;
- automatic repayment routing;
- AI as final milestone judge;
- AI payment-release authority;
- GCSC acting as lender, bank, broker, escrow agent, payment provider, legal advisor, or underwriter.

## Safe Decision Template

Use this template after founder review:

```text
Decision ID:
Packet version:
Founder outcome:
Reason:
Next review queue:
Exact sentence IDs:
Placement IDs:
Public-use status: Blocked
Live implementation status: Blocked
Notes for legal/provider review:
Notes for finance-provider review:
Notes for technical review:
```

## Required Checks

Run these checks after any founder decision summary update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-review-closeout`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the decision summary remains internal draft only.
