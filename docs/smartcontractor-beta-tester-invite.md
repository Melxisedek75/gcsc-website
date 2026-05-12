# SmartContractor Beta Tester Invite And Scope Brief

Date: 2026-05-11 PT

Purpose: founder-ready invitation text and scope rules for the first SmartContractor controlled beta testers.

Use this only for demo/public-beta testing without real money movement.

## Founder Safety Boundary

Do not promise or enable during this beta:

- real contractor loans;
- real escrow;
- automatic payment release;
- token collateral locking or liquidation;
- investment returns;
- legal decisions;
- licensed contractor verification as a final legal guarantee;
- production payment provider mode.

Do not ask testers to send:

- passwords;
- bank account details;
- full card data;
- SSN;
- private keys or seed phrases;
- government ID photos;
- real customer addresses;
- private project contracts.

## Who To Invite First

Invite only a small controlled group:

1. One homeowner who can test posting a demo job.
2. One contractor who can test finding a job and submitting a bid.
3. One construction professional who can test peer review/dispute feedback.
4. One trusted observer who can play admin/founder review with you.

Keep the first round to 3-5 people.

## Short Invite Message

```text
Hi [Name],

I am testing SmartContractor, a GCSC platform for safer construction jobs, contractor bids, milestone-based work review, disputes, and future contractor credit.

This first test is demo-only. There is no real payment, no real loan, no real escrow, and no legal decision being made. I only need feedback on whether the flow is clear and useful.

You would test one role:
- homeowner: post a demo construction job;
- contractor: submit a demo bid and view simulated starter-loan scoring;
- peer reviewer: review a demo dispute using non-sensitive evidence metadata;
- admin observer: help review risk/admin screens.

Please do not enter private passwords, bank data, card data, SSN, government ID, private keys, or real customer addresses.

After testing, please send me:
1. what was clear;
2. what was confusing;
3. what felt useful for real construction work;
4. what would stop you from trusting the platform;
5. any visible non-secret error or request ID.

Thank you,
[Founder Name]
GCSC / SmartContractor
```

## Tester Instructions

Tell each tester:

1. Use demo data only.
2. Do not upload private documents.
3. Do not enter real payment details.
4. Do not treat any loan score as a real loan offer.
5. Report confusing steps immediately.
6. Send screenshots only if they do not include private data.

## Feedback Questions

Ask each tester:

```text
Role tested:
Was the first screen understandable? yes/no
Could you complete the task? yes/no
What confused you?
What felt useful?
What felt risky?
Would this help homeowners trust contractors? why/why not?
Would this help contractors win jobs? why/why not?
What would you need before using this for a real project?
Any visible non-secret error:
Request ID if visible:
```

## Founder Review Checklist

After the first 3-5 testers:

1. Move bugs into `docs/smartcontractor-beta-issue-log-template.md`.
2. Mark P0/P1 issues before public beta.
3. Keep real-money features disabled.
4. Update demo script if testers get confused.
5. Update onboarding copy only after repeated feedback.
6. Do not expand tester group until Auth/admin/RLS/deploy gates are reviewed.

## Acceptance Check

This invite package is ready when:

- it clearly says demo-only;
- it blocks real payments, loans, escrow, and token collateral;
- it tells testers not to send secrets or sensitive data;
- it defines 3-5 first testers;
- it includes simple feedback questions;
- it links issues back to the beta issue log.

