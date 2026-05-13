# GCSC Whitepaper v1.2 Contract-Backed Loan Founder Response Triage Log

Status: internal founder response triage log only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to launch repayment routing, and not approval to publish public wording. The public whitepaper remains unchanged until founder, legal/provider, finance-provider, technical, claim-review, excerpt, and public-use gates approve exact text.

## Purpose

This log turns non-secret founder feedback from `docs/whitepaper-v1-2-contract-backed-loan-founder-response-template.md` into a safe next-action queue. It keeps Accept, Revise, Reject, and Hold decisions separate from legal approval, provider approval, live payment setup, public publication approval, and production implementation.

## Triage States

| State | Meaning | Allowed Next Action | Blocked Meaning |
|-------|---------|---------------------|-----------------|
| Accept | Founder likes the concept or wording direction | Keep in internal candidate set for later legal/provider and public-use review | Does not approve publication or live implementation |
| Revise | Founder wants wording, placement, or scope changed | Create a new internal draft and rerun checks | Does not approve edited public wording |
| Reject | Founder does not want this idea or sentence used | Mark as removed from candidate set | Does not delete audit/history files |
| Hold | Founder wants more review before deciding | Route to legal/provider, finance-provider, or technical review | Does not create a live loan, escrow, collateral, or payment task |

## Response Routing Table

| Founder Response Area | Safe Routing | Required Evidence Before Public Use |
|-----------------------|--------------|-------------------------------------|
| Concept | Legal/provider review, finance-provider review, and founder approval record | Approved source map, claim review, public-use gate, and approval record |
| Terminology | Exact sentence register and public wording options | No blocked terms, adjacent disclaimer, and selected sentence ID |
| Repayment-first waterfall | Technical review and finance-provider review | No real repayment routing, no provider promise, no automatic release claim |
| Placement | Placement map and public excerpt review packet | Allowed audience, allowed section, and public-use gate status |
| Exact sentence | Exact sentence register | Sentence ID, version, approval state, and rollback path |
| Public use | Public-use gate | Founder, legal/provider, finance-provider, technical, and claim-review evidence |

## Required Safe Fields

Each triage entry should capture only non-secret metadata:

- response date;
- source document;
- founder decision state;
- affected sentence ID, if any;
- affected placement, if any;
- safe revision note;
- review owner;
- next internal document to update;
- required check command;
- blocked live-risk reminder.

## Do Not Capture

Do not paste or request:

- passwords;
- private keys;
- service-role keys;
- provider API keys;
- lender contracts;
- private borrower data;
- raw payment data;
- attorney-client privileged notes;
- live Supabase SQL changes;
- real-money loan, escrow, token collateral, stablecoin settlement, or repayment-routing instructions.

## Blocked Shortcuts

This triage log cannot approve:

- live loans;
- real escrow;
- token collateral;
- repayment routing;
- public lending claims;
- guaranteed funding;
- instant approval;
- AI loan approval;
- AI automatic payment release;
- GCSC acting as a lender, bank, broker, licensed finance provider, or escrow agent.

## Required Checks

Run these checks after any founder response triage update:

- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-triage-log`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-response-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-exact-sentence-register`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check`

If any check fails, the triage log remains internal draft only.
