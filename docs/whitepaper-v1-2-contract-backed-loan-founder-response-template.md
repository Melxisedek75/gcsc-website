# GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Template

Status: internal founder response template only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This template gives the founder a simple way to respond after reading `docs/whitepaper-v1-2-contract-backed-loan-founder-reading-order.md`. It captures Accept, Revise, Reject, or Hold decisions without asking for secrets, legal conclusions, live provider commitments, real payment setup, or public publication approval.

## Founder Response Table

| Review Area | Founder Decision | Notes To Capture | Safe Default |
|-------------|------------------|------------------|--------------|
| Concept | Accept / Revise / Reject / Hold | Should signed SmartContractor project contracts support future provider-reviewed working-capital eligibility? | Hold |
| Terminology | Accept / Revise / Reject / Hold | Should public language use receivables-based underwriting and working-capital eligibility instead of collateral, lien, assignment of receivables, or security interest? | Accept safest wording |
| Repayment-first waterfall | Accept / Revise / Reject / Hold | Should future approved milestone payments describe repayment-first routing only after legal, technical, and provider approval? | Hold |
| Placement | Accept / Revise / Reject / Hold | Should this stay secondary to SmartContractor Platform, Trust Infrastructure, and Settlement & Tokenized Construction Network? | Accept safest placement |
| Exact sentence | Accept / Revise / Reject / Hold | Choose CBL-SAFE-01, CBL-SAFE-02, or CBL-SAFE-03 only after review. | Hold |
| Public use | Accept / Revise / Reject / Hold | Should any sentence move toward public-use gate review? | Hold |

## Required Founder Notes

The founder can answer in short non-secret notes:

- What idea should be kept?
- What wording feels too risky or too weak?
- Which sentence ID should be revised?
- Which section should receive the concept?
- Which questions should go to legal/provider review?
- Which questions should go to finance-provider review?
- Which questions should go to technical review?

## Do Not Include

Do not paste or request:

- passwords;
- private keys;
- service-role keys;
- provider API keys;
- lender contracts;
- private borrower data;
- raw payment data;
- legal advice from counsel;
- attorney-client privileged notes;
- live Supabase SQL changes;
- real-money loan, escrow, token collateral, or repayment-routing instructions.

## Blocked Approval Shortcuts

The founder response cannot approve:

- live loans;
- real escrow;
- token collateral;
- stablecoin settlement;
- repayment routing;
- public lending claims;
- guaranteed funding;
- instant approval;
- AI loan approval;
- AI automatic payment release;
- GCSC acting as a lender, bank, broker, licensed finance provider, or escrow agent.

## Required Checks

Run these checks after any founder response template update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-reading-order`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the founder response template remains internal draft only.
