# GCSC Whitepaper v1.2 Contract-Backed Loan Exact Sentence Register

Status: internal exact-sentence register only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing. The public whitepaper remains unchanged until an exact sentence is approved through the public use gate.

## Purpose

This register keeps contract-backed working-capital language from drifting when the concept moves from internal review into a future whitepaper v1.2 draft, website excerpt, partner packet, grant packet, investor deck, email, social post, or announcement.

Only exact approved sentences should be copied into public materials. Paraphrases must return to founder, legal/provider, finance provider, technical, claim-review, and public-use gate review before use.

## Safe Sentence Candidates

| ID | Sentence | Status | Allowed Placement |
|----|----------|--------|-------------------|
| CBL-SAFE-01 | A signed SmartContractor project contract may support contractor working-capital eligibility by documenting expected milestone receivables for provider-reviewed underwriting. | Internal candidate | SmartContractor Platform |
| CBL-SAFE-02 | Approved milestone payments may support a repayment-first waterfall where legally, technically, and provider-approved routing is enabled. | Internal candidate | Trust Infrastructure |
| CBL-SAFE-03 | GCSC treats contract-backed financing as a future compliance-reviewed roadmap concept, not as live lending, live escrow, token collateral, or guaranteed funding. | Internal candidate | Settlement & Tokenized Construction Network |

## Required Review Before Use

Before any sentence is marked public-ready, the exact text must pass:

- founder approval;
- legal/provider review;
- finance provider review if the sentence mentions provider-reviewed underwriting, milestone receivables, repayment-first waterfall, or working-capital eligibility;
- technical review confirming the feature is roadmap-safe and disabled for real money;
- claim review matrix approval;
- public excerpt guard approval;
- public use gate approval.

## Blocked Sentence Patterns

Do not publish sentences that say or imply:

- contract collateral;
- assignment of receivables;
- lien;
- security interest;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- token collateral is active;
- stablecoin settlement is live;
- AI approves loans or releases payments automatically;
- GCSC is already operating as a lender, escrow agent, bank, broker, or licensed finance provider.

## Sentence Change Rule

Any change to an approved sentence creates a new sentence ID and restarts review. Do not silently edit approved language.

Use these output states:

- Internal candidate.
- Founder review.
- Legal/provider review.
- Finance provider review.
- Technical review.
- Approved public excerpt.
- Approved whitepaper v1.2 draft.
- Rejected.
- Blocked pending legal/provider review.

## Required Checks

Run these checks before copying any sentence into public use:

- `npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing`
- `npm run check:whitepaper-v1-2-public-excerpt-guard`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check`

If any check fails, the sentence remains internal only.
