# GCSC Whitepaper v1.2 Contract-Backed Loan Founder Reading Order

Status: internal founder reading order only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This reading order gives the founder one simple path for reviewing the signed-project-contract working-capital concept before any whitepaper v1.2 public edit. It keeps the idea easy to study without mixing internal strategy, public wording, legal review, finance-provider review, technical gating, and publication steps.

## Reading Sequence

1. Read `docs/whitepaper-v1-2-contract-backed-loan-addendum.md` to understand the core idea: a signed SmartContractor project contract may document expected milestone receivables for provider-reviewed contractor working-capital eligibility.
2. Read `docs/whitepaper-v1-2-contract-backed-loan-flow.md` to understand the safe workflow: contract signed, underwriting reviewed, milestone approved, repayment-first waterfall considered, dispute pause enforced, and remaining funds routed only when legally, technically, and provider-approved.
3. Read `docs/whitepaper-v1-2-contract-backed-loan-review-questions.md` to decide what must go to founder, legal/provider, finance-provider, technical, and public-wording review.
4. Read `docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md` to compare conservative wording choices before selecting any sentence.
5. Read `docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md` to choose only exact sentence IDs, not paraphrases.
6. Read `docs/whitepaper-v1-2-contract-backed-loan-placement-map.md` to confirm where any exact sentence may appear.
7. Read `docs/whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md` to check exact sentence ID, allowed placement, adjacent disclaimer, blocked claims, and approval status before public use.
8. Read `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md` last. If any gate is not approved, the wording remains internal only.

## Founder Decision Points

The founder should mark each item as Accept, Revise, Reject, or Hold:

| Decision | What To Decide | Default Safe Status |
|----------|----------------|---------------------|
| Concept | Should contract-backed working capital stay in v1.2 as a future roadmap concept? | Hold until reviewed |
| Terminology | Use receivables-based underwriting and working-capital eligibility instead of collateral, lien, or security interest. | Accept safest wording |
| Placement | Keep the idea secondary to SmartContractor Platform, Trust Infrastructure, and Settlement & Tokenized Construction Network. | Accept safest placement |
| Public sentence | Use only CBL-SAFE-01, CBL-SAFE-02, or CBL-SAFE-03 after approval. | Hold until exact text approved |
| Review path | Send to legal/provider, finance provider, technical, claim-review, public excerpt guard, and public use gate. | Required |

## Study Notes For Founder

When reviewing, keep these simple questions in front of you:

- Are we describing future infrastructure, not a live lending product?
- Are we avoiding contract collateral, lien, assignment of receivables, and security interest language until counsel/provider review?
- Are we saying provider-reviewed underwriting instead of guaranteed funding?
- Are we keeping real loans, real escrow, token collateral, stablecoin settlement, and repayment routing disabled until approval?
- Are we making AI an assistant for evidence and review, not an automatic loan approver or automatic payment-release judge?
- Are we keeping the first public story as SmartContractor marketplace and trust infrastructure, not crypto or lending?

## Blocked Claims

Do not approve public wording that says or implies:

- live loans;
- real escrow is active;
- repayment routing is live;
- token collateral is active;
- stablecoin settlement is live;
- guaranteed funding;
- instant approval;
- every signed contract qualifies;
- AI approves loans;
- AI automatically releases payments;
- GCSC is a lender, bank, broker, licensed finance provider, or escrow agent.

## Required Checks

Run these checks after any founder reading-order update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet`
- `npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-placement-map`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the founder reading order remains internal draft only.
