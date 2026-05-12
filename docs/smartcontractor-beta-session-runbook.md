# SmartContractor Beta Session Runbook

Date: 2026-05-11 PT

Purpose: one-session operating script for a controlled SmartContractor beta test with 3-5 trusted people, without real money, real loans, real escrow, real payment release, or token collateral.

This runbook is for product testing only. It is not legal approval, lending approval, payment approval, escrow approval, token-sale approval, or production launch approval.

## Safety Boundary

Keep disabled during every beta session:

- real contractor loans;
- automatic loan approval;
- real escrow;
- automatic payment release;
- production payment provider mode;
- token collateral lock, liquidation, or margin call;
- irreversible on-chain settlement;
- legal ownership transfer language.

Do not collect, paste, screenshot, or commit:

- passwords;
- Magic Link URLs;
- Supabase access tokens;
- service-role keys;
- database passwords;
- API keys;
- private keys or seed phrases;
- bank account numbers;
- full card data;
- SSN, EIN, or government ID images;
- private homeowner address details.

Use only demo profiles, demo jobs, simulated payment intents, non-sensitive evidence metadata, and local screenshots that do not expose private data.

## Roles

Use these roles in one session:

1. Founder/admin - runs the session, watches Admin / Risk Console, and records issues.
2. Homeowner tester - creates one demo job and reviews bids.
3. Contractor tester - submits one bid and requests one simulated starter loan.
4. Peer reviewer tester - reviews one dispute using safe evidence metadata.
5. Observer, optional - watches confusion points and timing.

## Pre-Session Checklist

Before inviting testers:

1. Run `npm run check`.
2. Open SmartContractor locally or on the demo-safe public URL.
3. Open Admin / Risk Console.
4. Refresh Controlled Beta Readiness.
5. Confirm real-money pilot is blocked.
6. Confirm issue log template is ready.
7. Confirm tester invite says no real loans, escrow, payments, or sensitive data.
8. Confirm each tester understands this is a demo-only session.

## Session Agenda

Target length: 45-60 minutes.

1. Five-minute intro:
   - explain homeowner deposit risk;
   - explain contractor seriousness through verification, milestones, and simulated credit;
   - explain that all money movement is disabled.
2. Homeowner flow:
   - create one demo job;
   - confirm it appears in Open Bids.
3. Contractor flow:
   - submit one bid;
   - request one simulated starter loan;
   - explain visible risk factors.
4. Milestone/payment-intent flow:
   - review or create project contract;
   - review milestone;
   - create simulated payment intent only.
5. Dispute and peer-review flow:
   - open one dispute;
   - add safe evidence metadata;
   - submit peer-review recommendation.
6. Admin review:
   - inspect risk queue;
   - inspect readiness gates;
   - record issues.
7. Closing questions:
   - what felt confusing;
   - what felt trustworthy;
   - what would stop you from using it;
   - what should be fixed before public beta.

## Evidence To Record

Record one session summary:

```text
Session ID:
Date/time:
Environment: local/public-beta
URL:
Tester roles present:
Browser/devices:
Homeowner flow: pass/fail
Contractor bid flow: pass/fail
Simulated starter loan flow: pass/fail
Milestone/payment-intent flow: pass/fail
Dispute/peer-review flow: pass/fail
Admin review flow: pass/fail
Top 3 confusion points:
Top 3 trust blockers:
P0/P1 issues opened:
Request IDs captured:
Screenshots saved locally:
Real money involved: no
Secrets/private data recorded: no
Founder decision needed:
Next fixes:
```

Record each issue separately in `docs/smartcontractor-beta-issue-log-template.md`.

## Pass Criteria

One controlled beta session passes only when:

- all five core flows are attempted;
- no real money, real loan, real escrow, production payment, or token collateral action occurs;
- no secret or private customer data is recorded;
- request IDs are captured for backend/API problems when visible;
- P0/P1 issues are written into the issue log;
- founder can explain the demo story in under 10 minutes;
- testers understand that peer review is advisory and not an automatic legal judgment.

## Stop Conditions

Stop the session immediately if:

- any screen asks for real card, bank, SSN, EIN, private key, seed phrase, or service-role data;
- a tester receives or exposes a Magic Link URL in chat;
- a real payment provider checkout starts;
- a real crypto transfer is triggered;
- an admin action appears to approve real lending, escrow, payment release, or token collateral;
- private homeowner or contractor data appears in a screenshot.

## After-Session Steps

After the session:

1. Copy findings into the issue log template.
2. Group feedback with `docs/smartcontractor-beta-feedback-synthesis.md`.
3. Fix P0 issues before the next session.
4. Fix P1 issues before public beta.
5. Keep legal/payment/lending/token collateral items blocked until attorney, provider, and founder review.
6. Run relevant checks before inviting the next tester group.
