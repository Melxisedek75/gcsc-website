# GCSC Whitepaper v1.2 Contract-Backed Loan Legal/Provider Handoff

Status: internal legal/provider handoff only. This is not legal advice, not a request to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This handoff summarizes what a legal, escrow, lending, payment, or compliance provider should review before contract-backed working-capital language can move from internal founder review toward public wording. It keeps review questions focused on classification, consumer protection, money movement, provider roles, borrower disclosures, receivables language, escrow boundaries, and prohibited promises.

## Handoff Packet

Send only non-secret local excerpts from:

- `docs/whitepaper-v1-2-contract-backed-loan-founder-decision-summary.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-founder-review-closeout.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-exact-sentence-register.md`;
- `docs/whitepaper-v1-2-contract-backed-loan-public-excerpt-review-packet.md`.

Do not send passwords, private keys, API keys, service-role keys, wallet seed phrases, borrower personal data, bank data, escrow account data, lender agreements, private contact lists, or live system credentials.

## Review Questions

| Area | Question |
|------|----------|
| Project receivables | Can GCSC describe signed project contracts as future receivables or working-capital eligibility without implying collateral, lien, assignment, or guaranteed financing? |
| Contractor credit | What disclosures are required if a contractor requests working capital based on project history, signed contract value, and milestone schedule? |
| Repayment waterfall | What language is safe for future milestone proceeds repaying an approved provider loan before remaining funds go to the contractor? |
| Escrow boundary | What wording avoids implying that GCSC is already an escrow agent, money transmitter, lender, broker, bank, or underwriter? |
| Stablecoin settlement | What wording is allowed for future compliant stablecoin settlement without implying current live settlement or custody? |
| Token collateral | Should token collateral be omitted from public wording until a separate legal, risk, oracle, LTV, margin, liquidation, and security review exists? |
| AI verification | What wording keeps AI as support only, not final judge, lender, inspector, payment releaser, or dispute authority? |
| Public claims | Which exact sentences require disclaimers, removal, or provider-specific approval before publication? |

## Required Provider Answers

Before public use, the project needs written non-secret answers for:

- allowed terms;
- blocked terms;
- required disclaimers;
- provider role boundaries;
- borrower/contractor disclosure needs;
- escrow and money-transmission boundaries;
- lending, broker, bank, and underwriting boundaries;
- stablecoin settlement boundaries;
- token collateral boundaries;
- AI verification boundaries;
- required revisions to exact sentence IDs and placement IDs.

## Blocked Until Review

Do not publish or implement:

- live contractor loans;
- real escrow;
- stablecoin settlement;
- token collateral;
- automatic repayment routing;
- AI milestone approval as final judge;
- AI payment-release authority;
- GCSC as lender, bank, broker, escrow agent, payment provider, legal advisor, underwriter, or money transmitter.

## Required Checks

Run these checks after any legal/provider handoff update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-decision-summary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register`
- `npm run check`

If any check fails, the handoff remains internal draft only.
