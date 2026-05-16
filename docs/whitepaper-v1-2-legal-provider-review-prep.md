# GCSC Whitepaper v1.2 Legal Provider Review Prep

Status: INTERNAL_REVIEW_PREP_ONLY

This packet is not legal advice, not provider approval, not lender approval, not escrow approval, not payment-provider approval, and not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, or public launch.

Explicit launch boundary: not approval to launch real loans; not approval to launch real escrow; not approval to launch real repayment routing; not approval to launch stablecoin settlement; not approval to launch token collateral.

## Purpose

Prepare one conservative, non-secret review packet for attorneys, finance providers, escrow/payment providers, and future compliance reviewers.

The packet explains what GCSC and SmartContractor do now, which features remain local/demo only, which future concepts need external review, and which live actions stay blocked until written approvals are recorded.

## What GCSC SmartContractor Does Now

Current implemented scope is a local/demo construction marketplace workflow:

- jobs and bids;
- signed project contracts as workflow records;
- milestone records and evidence review states;
- evidence upload simulation metadata;
- dispute center and peer/admin review;
- contractor risk and admin console views;
- audit logs and request IDs;
- provider/payment/Auth scaffolds;
- mobile/PWA readiness runbooks;
- smart contract architecture drafts and local replay material.

Current scope does not move real money, originate real loans, hold escrow funds, route repayment, settle stablecoins, lock token collateral, or make automated AI final approvals.

## Future Concepts Needing Review

These concepts are architecture targets only until legal/provider approval:

- contract-backed working-capital eligibility after a signed project contract;
- receivables-based underwriting based on project value, milestone schedule, contractor profile, verification, history, and dispute state;
- repayment-first milestone waterfall where approved milestone proceeds can repay a provider-approved balance before contractor net payout;
- escrow-ready payment coordination without autonomous custody;
- stablecoin settlement roadmap;
- token collateral roadmap;
- AI-assisted verification for recommendations only;
- modular smart contract split for authority, project registry, milestone, loan ledger, repayment waterfall, collateral/risk, reputation/review, dispute/override, and audit/compliance.

## Disabled And Blocked Live Actions

The following actions remain blocked:

- live loan origination;
- live escrow custody;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- production provider API calls;
- AI final approval;
- AI payment release;
- AI dispute decision;
- public claims that loans, escrow, repayment routing, stablecoin settlement, token collateral, or compliant finance features are live.

Any unclear or missing written approval defaults to HOLD, REVIEW, or BLOCKED_FOR_LIVE.

## Legal And Provider Classification Questions

Questions for attorney/provider review:

- Is GCSC only software/marketplace infrastructure, or does a proposed flow touch lending, escrow, payment handling, money transmission, credit brokering, servicing, or collection activity?
- Which state-by-state contractor finance, home improvement, consumer protection, or disclosure rules may apply?
- Does contract-backed working capital require UCC filings, assignment of receivables, security interests, lien notices, borrower disclosures, or lender licensing?
- What homeowner protections, cancellation rights, refund rules, dispute rights, or milestone approval rules must be reflected?
- What privacy, retention, audit, adverse-action, and data correction rules apply to contractor scoring and AI-assisted recommendations?
- Which public whitepaper, website, deck, email, social, grant, investor, and provider claims require legal approval before use?

## Finance Provider Review Questions

Questions for a future lender or finance provider:

- Who is the lender of record and who owns underwriting responsibility?
- Which contractor eligibility, verification, license, insurance, bank, tax, dispute, and repayment-history fields are required?
- What borrower terms, APR/fee disclosures, repayment schedule, late-payment treatment, and servicing rules are mandatory?
- Can milestone proceeds be used in a repayment-first waterfall, and who authorizes that allocation?
- How should disputes, partial milestone approvals, refunds, failed payments, overpayments, and chargebacks stop or alter repayment?
- Are fair lending, adverse action, credit reporting, collection, or state licensing rules triggered?

## Escrow And Payment Provider Review Questions

Questions for escrow/payment providers:

- Who holds funds, if anyone, and under what license or provider account?
- Who has release authority for milestone funds?
- How are refunds, chargebacks, payment failures, ACH/cards/wallet rails, and provider disputes handled?
- Can GCSC display escrow-ready states without custody?
- What must be true before any live repayment allocation touches payment rails?
- Which stablecoin or XPR/Metal Pay flows are allowed, restricted, or provider-prohibited?

## Stablecoin And Token Collateral Review Questions

Questions before any stablecoin settlement or token collateral language is used live:

- Which rails and jurisdictions are permitted for stablecoin settlement?
- Who has custody or control of assets?
- What oracle, LTV, valuation, liquidation, pause, dispute, and emergency authority rules are required?
- Do token collateral references create securities, commodities, lending, custody, tax, or accounting concerns?
- Which words must be avoided in public materials until legal/provider review is complete?

## AI Review Questions

AI must stay recommendation-only until approved.

Review questions:

- Which AI outputs can be shown as suggestions versus decisions?
- Who makes final underwriting, milestone approval, payment release, dispute, and collateral decisions?
- What explainability, correction, appeal, audit, and human-review records are required?
- What data may AI process, retain, or share with providers?

## Smart Contract Review Questions

Questions for smart contract/security review:

- Are authority roles separated from frontend, AI, and provider adapters?
- Is multisig or stronger approval required for deploy, upgrade, unpause, provider authorization, and live-money enablement?
- Are there no backdoors: no hidden owner drain, no hidden upgrade path, no arbitrary balance mutation, no dispute bypass, no AI-only final approval, and no contractor self-approval?
- Are audit events append-only and non-secret?
- Are emergency pause and recovery paths defined without moving funds?

## Reviewer Role Separation Matrix

No reviewer role can approve another reviewer role by implication. A legal answer does not activate provider rails, a provider answer does not create legal approval, a security answer does not approve business launch timing, and founder approval does not replace external legal, finance-provider, payment-provider, or security review where those reviews are required.

| Reviewer role | May review | Must not approve alone |
| --- | --- | --- |
| Attorney / legal reviewer | Attorney review may classify legal, lending, escrow, payment, consumer-protection, privacy, disclosure, and public-claim risks. | Live lending, escrow, payment rails, provider commitments, code deployment, or production launch without the matching provider/security/founder records. |
| Finance provider | Finance-provider review may define lender-of-record, underwriting, borrower terms, servicing, repayment, adverse-action, and collection requirements. | Legal classification, escrow custody, payment processor setup, smart contract deployment, or public claims outside provider-approved wording. |
| Escrow/payment provider | Escrow/payment-provider review may define custody, payment rail, chargeback, refund, release, callback, and provider dispute requirements. | Lending approval, borrower terms, legal classification, stablecoin/token collateral handling, or security approval. |
| Security / smart contract reviewer | Security/smart-contract review may approve code safety, authority separation, auditability, pause, upgrade, rollback, and anti-backdoor controls. | Legal compliance, lender/provider terms, payment custody, public launch, or real-money enablement. |
| Founder / owner | Founder approval may approve product scope, business priority, reviewer routing, and external owner actions, but it does not replace legal, finance-provider, payment-provider, or security approval. | Any live loan, escrow, repayment, stablecoin, token collateral, provider, legal/compliance, or public launch claim without the required external review evidence. |

## Evidence Packet Index

Primary internal sources for reviewer orientation:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md`
- `docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`

## Allowed Internal Next Steps

Allowed without live/external action:

- prepare local checklists;
- prepare internal drafts;
- prepare redacted reviewer packets;
- prepare schemas and local-only fixtures;
- run local validators and no-real-money tests;
- record blocked-live gates and review questions.

## Blocked Until Explicit External Approval

Blocked until written founder/legal/provider/security approval and live owner action:

- external account setup or provider commitments;
- live Supabase changes;
- production deploy settings;
- real payment, loan, escrow, repayment, stablecoin, or token collateral flows;
- public launch;
- legal conclusions or compliance claims.

## Founder Handoff

For an attorney or provider, send this packet as a non-secret orientation bundle and ask for written answers. Do not send passwords, API keys, seed phrases, service-role keys, private keys, raw database credentials, private customer data, or unredacted tester artifacts.

Required response format:

- reviewer role;
- reviewed files;
- decision: HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP;
- required changes;
- blocked public claims;
- blocked live actions;
- follow-up evidence requested.

## Required Checks

- `npm run check:whitepaper-v1-2-legal-provider-review-prep`
- `npm run check:legal-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff`
- `npm run check:real-status-audit`
- `npm run check`
