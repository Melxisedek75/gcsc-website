# SmartContractor Public Beta Consent Acknowledgement

## Purpose

This draft gives the founder a simple consent acknowledgement to show or send before a SmartContractor public beta test. It is not a legal contract. It is a plain-English safety checkpoint so testers understand the beta is demo only.

Use it with `PUBLIC_SITE_URL`, the public beta launch message, tester FAQ, known issues, and support queue.

## Plain English Acknowledgement

```text
I understand that SmartContractor public beta is an early demo test.

I will use demo information only. I will not enter passwords, private keys, bank data, card data, private documents, personal IDs, real customer addresses, Supabase tokens, SQL output, or other secrets.

I understand that real payments disabled, real loans disabled, escrow disabled, and token collateral disabled during this beta.

I understand that the beta provides no investment advice, no legal advice, no provider approval, no production readiness promise, and no loan approval.

If I find an issue, I will report only safe details: test role, page or flow, expected result, actual result, device/browser, safe X-Request-Id if visible, and a redacted screenshot if useful.
```

## Tester Confirms

The tester confirms:

- this is demo only;
- they are testing as homeowner, contractor, peer reviewer, observer, or founder/admin reviewer;
- Magic Link login may be tested only if enabled by the founder;
- they will use `PUBLIC_SITE_URL` provided by the founder;
- they will report issues through the support queue or founder-approved channel;
- they will stop if a screen appears to enable real money, real loan approval, escrow, token collateral, or production provider actions.

## Tester Must Not Share

The tester must not share:

- no SQL;
- no secrets;
- passwords;
- private keys or seed phrases;
- bank data or card data;
- payment data;
- wallet private data;
- real personal IDs;
- real customer addresses;
- unredacted screenshots;
- legal, provider, loan, escrow, or investment claims as if they are approved.

## Founder Review Required

Founder review is required before:

- any real payment provider setup;
- any real loan workflow;
- any escrow workflow;
- any token collateral workflow;
- any legal review conclusion;
- any provider review conclusion;
- any external public claim about production readiness;
- any tester quote, screenshot, or artifact leaves local/founder review.

## Safe Record Fields

If the founder records consent, keep only safe metadata:

- tester role;
- consent version or file name;
- date;
- `PUBLIC_SITE_URL` tested;
- optional issue ID;
- optional safe `X-Request-Id`;
- whether a redacted screenshot was provided;
- founder review status.

Do not store private contact details, raw recordings, private documents, payment data, wallet data, or secret-looking values in this consent record.

## Do Not Use As Legal Advice

This is not legal advice and not a substitute for attorney-reviewed terms of service, privacy policy, lending disclosures, escrow terms, payment provider terms, or token-risk disclosures.

Before real payments, real loans, escrow, token collateral, production provider integrations, or public investment language, the founder must complete legal review and provider review.
