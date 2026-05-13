# GCSC Whitepaper v1.2 Edit Plan

Status: draft plan only. Founder approval required before any published whitepaper file is edited.

## Scope

This plan defines how to turn the v1.2 restructure draft into a clean whitepaper update after founder approval.

It does not edit `whitepaper.html` yet, does not publish a PDF, and does not change the public site.

## Inputs

- `docs/whitepaper-v1-2-restructure-draft.md`
- `docs/whitepaper-v1-2-founder-review-checklist.md`
- current published whitepaper source after founder identifies the exact file to update
- attorney/provider/founder approval status for any real escrow, lending, token collateral, stablecoin settlement, and regulated finance language

## Do Not Edit Yet

Do not edit `whitepaper.html` yet.

The published whitepaper should stay unchanged until the founder confirms:

- approved structure;
- approved naming;
- approved contractor credit placement;
- approved GCSC/GCST token economics placement;
- approved Real Estate DAO placement;
- approved Digital Asset Market Clarity Act and compliance-ready language;
- approved publish path.

## Pass 1: Structure

Replace the old flow with the approved structure.

Default draft structure:

1. Executive Summary
2. Construction Trust Problem
3. Regulated Construction-Financial Infrastructure
4. SmartContractor Marketplace
5. Project Contracts, Milestones, And Escrow-Ready Coordination
6. Contractor Reputation Layer
7. AI Boundaries And Compliance Review
8. Regulated Settlement And Tokenized Agreements
9. GCSC/GCST Token Economics
10. Roadmap, Risk Factors, And Launch Gates

## Pass 2: Product Narrative

Make SmartContractor the first product and the first proof point.

Required narrative:

- property owners and contractors meet in one marketplace;
- accepted bids become project contracts;
- milestones structure payment and work review;
- escrow-ready records prepare future provider workflows without claiming live escrow;
- contractor credit reduces upfront deposit risk but stays blocked from real lending until review;
- disputes, evidence, peer review, and audit events become the trust record.

## Pass 3: Trust And Compliance

Add or strengthen:

- Contractor Reputation Layer;
- license, identity, insurance, business, dispute, repayment, bid accuracy, and milestone performance signals;
- AI boundaries;
- no AI-only legal or financial decisions;
- no automatic release of disputed funds;
- no automatic loan approval;
- no automatic collateral liquidation;
- compliance-ready framing around the Digital Asset Market Clarity Act without making a legal conclusion.

## Pass 4: Token And Settlement Language

Move token and settlement language after the product and trust sections unless founder chooses otherwise.

Required constraints:

- GCSC/GCST token economics must be utility and governance oriented;
- stablecoin settlement must be described as later regulated infrastructure;
- Real Estate DAO should be later expansion unless founder chooses main-body placement;
- no real escrow;
- no real lending;
- no real token collateral;
- no token price promise;
- attorney/provider/founder approval required before regulated financial workflows.

## Pass 5: Risk Factors And Gates

Add a clear risk and launch gate section covering:

- legal review;
- payment provider review;
- escrow provider review;
- lending/provider review;
- custody and AML controls;
- smart contract audit;
- strict RLS/admin readiness;
- public beta evidence;
- founder approval required before live-risk activation.

## Verification Plan

After an approved whitepaper edit, run:

```bash
npm run check:whitepaper-sections
npm run check:whitepaper-v1-2-restructure
npm run check:whitepaper-v1-2-founder-review
npm run check:whitepaper-v1-2-edit-plan
npm run check
```

Also verify manually:

- no legal conclusion from pending legislation;
- no real escrow, lending, token collateral, stablecoin settlement, or token price promise language;
- no secrets or provider credentials;
- no mismatch between roadmap phase and product status;
- SmartContractor remains the practical launch product.

## Founder Approval Required

This plan is ready for review, but blocked from published implementation until founder approval.

Approved next action after founder review:

1. create a scoped branch or commit for the actual whitepaper edit;
2. update only the approved whitepaper source files;
3. run the verification plan;
4. produce a short founder diff summary before public use.
