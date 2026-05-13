# GCSC Whitepaper v1.2 Contract-Backed Loan Placement Map

Status: internal placement map only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This map defines where approved contract-backed working-capital sentences may appear after review, so the concept stays secondary to the SmartContractor platform narrative and does not drift into a public lending, escrow, collateral, or investment promise.

Only sentences from `docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md` may move into public materials. Any new paraphrase must return to review before use.

## Approved Placement Logic

| Sentence ID | Primary Placement | Secondary Placement | Use Limit |
|-------------|-------------------|---------------------|-----------|
| CBL-SAFE-01 | SmartContractor Platform | Contractor credit roadmap | May describe signed project contracts as underwriting support only. |
| CBL-SAFE-02 | Trust Infrastructure | Milestone payment workflow | May describe repayment-first routing only as future legally, technically, and provider-approved routing. |
| CBL-SAFE-03 | Settlement & Tokenized Construction Network | Risk and compliance section | Must keep the concept framed as future compliance-reviewed roadmap language. |

## Public Artifact Placement

| Artifact | Allowed Use | Blocked Use |
|----------|-------------|-------------|
| Whitepaper v1.2 draft | One short paragraph after SmartContractor project contracts and milestone workflow | Opening headline, investment thesis, token sale section, or guaranteed loan claim |
| Website excerpt | One conservative sentence after marketplace/trust description | Hero copy, pricing page, call-to-action, or lender/escrow claim |
| Partner packet | One roadmap bullet with review status | Active product capability, licensed finance claim, or binding lender commitment |
| Grant packet | One infrastructure roadmap sentence tied to responsible contractor finance | Revenue guarantee, loan approval claim, or automatic payment-release claim |
| Investor deck | One risk-disclosed roadmap note | Token appreciation, passive income, or lending yield promise |

## Required Context Around Any Placement

Every public placement must stay close to these boundaries:

- future compliance-reviewed roadmap concept;
- provider-reviewed underwriting;
- expected milestone receivables;
- repayment-first waterfall only when legally, technically, and provider-approved;
- real loans disabled until founder/legal/provider approval;
- real escrow disabled until founder/legal/provider approval;
- token collateral disabled until founder/legal/provider approval;
- AI cannot approve loans or release payments automatically.

## Blocked Placement Patterns

Do not place contract-backed working-capital language:

- in the first headline;
- in token economics;
- in investment return language;
- beside token price, yield, staking APY, burn, or appreciation claims;
- beside “instant approval” or “guaranteed funding” language;
- beside “escrow is live” or “stablecoin settlement is live” language;
- without the public-use gate and exact sentence register.

## Required Checks

Run these checks before any placement leaves internal review:

- `npm run check:whitepaper-v1-2-contract-backed-loan-placement-map`
- `npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check:whitepaper-v1-2-public-excerpt-guard`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check`

