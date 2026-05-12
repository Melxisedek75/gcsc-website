# SmartContractor Controlled User Test Plan

Date: 2026-05-11 PT

Purpose: safe test plan for the first controlled SmartContractor beta with real people, but without real loans, real escrow, real payment release, or token collateral.

This plan is for demo/public-beta validation only. It is not legal approval, payment approval, lending approval, or production launch approval.

## Safety Boundary

Keep disabled during this test:

- real contractor loans;
- automatic loan approval;
- real escrow;
- automatic payment release;
- token collateral locking or liquidation;
- production payment provider mode;
- irreversible on-chain settlement;
- legal ownership transfer language.

Do not collect or paste into chat:

- passwords;
- Supabase access tokens;
- service-role keys;
- database passwords;
- bank account numbers;
- full card data;
- private keys or seed phrases;
- government ID images.

Use only test accounts, demo jobs, simulated payment intents, and non-sensitive evidence metadata.

## Test Roles

Use four simple roles:

1. Founder/admin - observes the Admin / Risk Console and records issues.
2. Homeowner tester - posts one demo construction job and reviews bids.
3. Contractor tester - submits one bid and requests a simulated starter loan.
4. Peer reviewer tester - reviews one dispute using photo/video/link metadata only.

## Test Scenario 1: Homeowner Job

Goal: verify that a homeowner can start a job request without confusion.

Steps:

1. Open SmartContractor MVP.
2. Choose homeowner role.
3. Create or select a demo homeowner profile.
4. Post one demo job:
   - project type;
   - city/state;
   - rough budget;
   - short description;
   - desired start date.
5. Confirm the job appears in Open Bids.

Acceptance:

- job is visible to contractors;
- no real payment is requested;
- no private homeowner address is required for the demo;
- request ID or audit event exists for the action.

## Test Scenario 2: Contractor Bid And Starter Loan

Goal: verify contractor onboarding, bid submission, and simulated credit seriousness.

Steps:

1. Choose contractor role.
2. Create or select a demo contractor profile.
3. Open the homeowner job.
4. Submit one bid:
   - price;
   - timeline;
   - scope note;
   - license/business status as demo text.
5. Open Starter Loan.
6. Request a simulated starter loan amount between `$3,500` and `$4,000`.
7. Confirm the scoring display explains the decision factors.

Acceptance:

- bid is saved;
- starter loan stays simulated;
- UI does not promise approval;
- no real EIN, SSN, bank data, or card data is collected;
- audit/payment/loan records remain clearly demo-safe.

## Test Scenario 3: Milestone And Payment Intent

Goal: verify the milestone flow that will later protect homeowners from unsafe upfront deposits.

Steps:

1. Convert accepted demo bid into a project contract.
2. Create or review demo milestones.
3. Create a simulated milestone payment intent.
4. Confirm the payment intent can be associated with:
   - homeowner;
   - contractor;
   - job;
   - project contract;
   - milestone;
   - loan if relevant.

Acceptance:

- no production payment provider is used;
- no real card, ACH, crypto transfer, or WebAuth transfer happens;
- payment intent ownership fields are ready for strict RLS review;
- repayment-first logic remains a simulated workflow until legal/provider approval.

## Test Scenario 4: Dispute And Peer Review

Goal: verify that quality disputes can be documented and reviewed without turning the platform into an unreviewed legal decision engine.

Steps:

1. Homeowner opens one demo dispute.
2. Add evidence metadata:
   - photo file name or link;
   - video file name or link;
   - short note;
   - milestone reference.
3. Peer reviewer opens the dispute.
4. Peer reviewer submits:
   - quality score;
   - recommendation;
   - short reasoning.
5. Founder/admin reviews the dispute in Admin / Risk Console.

Acceptance:

- peer review is advisory, not automatic legal judgment;
- no automatic payment release happens;
- no automatic penalty happens;
- recommendation is visible to admin;
- audit event records the review.

## Test Scenario 5: Founder/Admin Review

Goal: verify that founder/admin sees the important risk queues before public beta.

Steps:

1. Open Admin / Risk Console.
2. Review:
   - pending starter loans;
   - disputes;
   - payment exceptions;
   - verification checks;
   - provider setup blockers;
   - recent audit events.
3. Confirm Founder Action Center still marks blocked live-risk actions.

Acceptance:

- admin-only actions stay behind admin checks;
- real loans, escrow, payment release, and token collateral are blocked;
- request IDs are visible enough for debugging;
- founder can explain the full demo in under 10 minutes.

## Evidence To Record

Record only non-secret test evidence:

```text
Test date:
Local or deployed URL:
Tester role:
Scenario completed:
Browser/device:
Visible issue:
Request ID if visible:
Screenshot filename if saved locally:
Pass/fail:
Next fix:
```

Do not upload private customer data or real identity documents.

## Exit Criteria

The controlled user test is acceptable when:

- one homeowner flow passes;
- one contractor bid flow passes;
- one simulated starter loan flow passes;
- one milestone/payment-intent flow passes without real money;
- one dispute/peer-review flow passes;
- founder/admin can see the risk queues;
- all failures are recorded as non-secret issues;
- no real money, real escrow, real lending, or token collateral action occurs.

## Next Step After Passing

After this plan passes locally:

1. choose public beta deploy platform;
2. configure demo-safe environment variables;
3. set Supabase Auth redirect URLs;
4. run public URL QA;
5. keep real-money features disabled until legal/provider/security review is complete.

