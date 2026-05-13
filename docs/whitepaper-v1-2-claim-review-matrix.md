# GCSC Whitepaper v1.2 Claim Review Matrix

Status: internal founder review matrix. Do not publish this file as public whitepaper text.

Purpose: separate safe product claims from review-required legal, provider, token, AI, escrow, lending, and token collateral claims before the published whitepaper is edited.

## Safe Product Claims

These claims can be used after founder approval when they match the whitepaper v1.2 source map and terms glossary:

- SmartContractor Marketplace connects homeowners and contractors around project contracts and milestones.
- Contractor Reputation Layer supports trust through ratings, dispute history, completion quality, response behavior, and verified activity.
- AI-assisted workflows can help summarize risk, compliance, disputes, bids, and project evidence.
- GCSC can describe escrow-ready, credit-ready, and stablecoin settlement roadmap language as future gated infrastructure.
- Digital Asset Market Clarity Act references are policy context, not a legal conclusion.

## Review-Required Claims

These claims require attorney/provider/founder approval before public use:

- escrow workflow handles or controls homeowner funds;
- contractor credit, working-capital credit, or lending is available;
- stablecoin settlement engine is live;
- tokenized construction agreements have enforceable legal status;
- token collateral can secure real loans;
- GCSC is regulated construction-financial infrastructure;
- AI can approve loans, escrow releases, disputes, or legal/financial outcomes.

## Blocked Claims

These claims must stay blocked unless a later formal approval record changes the project status:

- real escrow is live;
- real lending is live;
- real token collateral is live;
- guaranteed contractor credit;
- guaranteed payment release;
- guaranteed yield;
- token price promise;
- AI makes automatic legal or financial decisions;
- founder/legal/provider review is not needed.

## Evidence To Check

Before a claim moves into public text, check:

- `whitepaper-v1-2-source-map.md`
- `whitepaper-v1-2-terms-glossary.md`
- `whitepaper-v1-2-public-excerpt-guard.md`
- `whitepaper-v1-2-publish-gate.md`
- `whitepaper-v1-2-approval-record-template.md`

## Required Commands

```bash
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-terms-glossary
npm run check:whitepaper-v1-2-public-excerpt-guard
npm run check
```

## Safe Default

If a claim touches money movement, real escrow, real lending, real token collateral, token appreciation, legal status, provider integrations, or automatic AI decisions, keep it out of public whitepaper language until attorney/provider/founder approval is recorded.
