# GCSC Whitepaper v1.2 Public Edit Queue

Status: internal founder-review queue. Do not edit the published whitepaper from this file until approval is recorded.

Purpose: list the exact public whitepaper edits that should be made only after founder/legal/provider/technical approval, while keeping the current public whitepaper unchanged.

## Edit Order

1. Replace the opening positioning with SmartContractor Marketplace as the first product.
2. Add project contracts and milestones as the first operating layer.
3. Add Contractor Reputation Layer as the trust and quality layer.
4. Add AI-assisted workflows with explicit AI boundaries.
5. Add escrow-ready and credit-ready language as gated future infrastructure.
6. Add stablecoin settlement roadmap and tokenized construction agreements as future regulated roadmap items.
7. Add Digital Asset Market Clarity Act only as policy context, not a legal conclusion.
8. Keep Real Estate DAO, token economics, and GCSC/GCST utility after the marketplace product narrative.
9. Add risk gates for legal review, provider review, strict RLS/admin readiness, security review, and founder approval.

## Files To Check First

- `whitepaper-v1-2-restructure-draft.md`
- `whitepaper-v1-2-founder-review-checklist.md`
- `whitepaper-v1-2-edit-plan.md`
- `whitepaper-v1-2-source-map.md`
- `whitepaper-v1-2-publish-gate.md`
- `whitepaper-v1-2-approval-record-template.md`
- `whitepaper-v1-2-founder-decision-packet.md`
- `whitepaper-v1-2-public-excerpt-guard.md`
- `whitepaper-v1-2-terms-glossary.md`
- `whitepaper-v1-2-claim-review-matrix.md`

## Blocked Until Approval

Do not update public `whitepaper.html`, PDF, website copy, partner packet, grant packet, investor packet, deck, email, social post, or announcement until all of these are true:

- founder approval recorded;
- attorney/provider/founder approval recorded for escrow, lending, token collateral, and stablecoin settlement wording;
- technical approval recorded for current MVP readiness and disabled real-money gates;
- no real escrow, no real lending, no real token collateral, no token price promise, no guaranteed yield, and no automatic AI legal or financial decision boundaries remain visible.

## Required Commands

```bash
npm run check:whitepaper-v1-2-public-edit-queue
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-terms-glossary
npm run check
```

## Safe Default

If approval is incomplete, keep all v1.2 wording internal. The next public-facing step is founder review, not publication.
