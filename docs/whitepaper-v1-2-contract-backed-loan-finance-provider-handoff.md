# GCSC Whitepaper v1.2 Contract-Backed Loan Finance-Provider Handoff

Status: internal finance-provider handoff only. This is not legal advice, not a request to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This handoff gives a lender, underwriting partner, credit provider, payment provider, or finance reviewer the questions they must answer before GCSC uses contract-backed working-capital language publicly. It focuses on receivables-based eligibility, underwriting inputs, repayment waterfalls, milestone payment controls, provider responsibilities, and prohibited promises.

## Handoff Packet

Use only non-secret excerpts from:

- `docs/whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-flow.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md`.

Do not include passwords, private keys, API keys, service-role keys, wallet seed phrases, bank account details, borrower personal data, lender contracts, private contact lists, escrow account details, or live payment credentials.

## Finance Review Questions

| Area | Question |
|------|----------|
| Eligibility | Which signed-contract fields can support working-capital eligibility without creating a public promise of approval? |
| Underwriting | Which inputs are required: business identity, license, insurance, contract value, milestone schedule, dispute history, repayment history, bid accuracy, and provider risk score? |
| Receivables | What language can describe future milestone proceeds without implying assignment, lien, collateral, or guaranteed collectability? |
| Repayment waterfall | Can approved milestone proceeds repay provider credit first, then release remaining funds to the contractor, and what disclosures are required? |
| Payment controls | Which ledger, payment-intent, audit, ownership, and dispute-pause controls are required before any real repayment routing? |
| Provider role | What should be handled by a licensed lender, credit provider, escrow provider, payment provider, or servicing partner instead of GCSC? |
| Risk limits | What limits are required for loan size, duration, APR, geography, contractor tier, industry category, dispute status, and default handling? |
| Public wording | Which sentences are safe, which need disclaimers, and which must stay internal only? |

## Required Finance Answers

Before public or live use, the project needs non-secret answers for:

- approved eligibility inputs;
- blocked eligibility claims;
- underwriting and adverse-action boundaries;
- repayment waterfall requirements;
- milestone approval and dispute-pause requirements;
- provider-of-record responsibilities;
- borrower/contractor disclosure requirements;
- pricing and APR disclosure boundaries;
- default, chargeback, and cancellation handling;
- public wording revisions by exact sentence ID and placement ID.

## Blocked Until Review

Do not publish or implement:

- guaranteed financing;
- automatic loan approval;
- live contractor loans;
- real repayment routing;
- real escrow;
- stablecoin settlement;
- token collateral;
- AI as lender, underwriter, final milestone judge, or payment releaser;
- GCSC as lender, bank, broker, escrow agent, payment provider, servicer, or underwriter.

## Required Checks

Run these checks after any finance-provider handoff update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the finance-provider handoff remains internal draft only.
