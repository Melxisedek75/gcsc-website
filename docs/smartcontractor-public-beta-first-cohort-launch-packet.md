# SmartContractor Public Beta First Cohort Launch Packet

Status: INTERNAL_FIRST_COHORT_PACKET_ONLY

Purpose: give the founder one practical launch packet for the first 3-5 SmartContractor public beta testers, using demo-only scope and no private tester identities in repo docs.

This packet is not a public launch approval, not a production deploy approval, not legal advice, not provider approval, not payment approval, not loan approval, not escrow approval, and not token-collateral approval.

## Launch Readiness Rule

The first cohort can move from planning to invite drafting only when:

- public beta founder execution plan is reviewed;
- launch decision record is `GO` or explicitly `REVIEW` for a limited demo-only test;
- support owner and response window are known;
- known issues are acceptable for a 3-5 person test;
- tester FAQ, consent acknowledgement, privacy notice, and quickstart are ready;
- real payments disabled, real loans disabled, escrow disabled, repayment routing disabled, stablecoin settlement disabled, and token collateral disabled.

If any item is unclear, keep the cohort in `planned` or `review`, not `sent`.

## First Cohort Shape

Recommended first wave:

| Tester code | Role | Primary Flow | Success Signal |
| --- | --- | --- | --- |
| `PB-HO-001` | homeowner | job intake, bid review, milestones, dispute clarity | can explain whether the homeowner flow feels safer than upfront deposits |
| `PB-CO-001` | contractor | bids, simulated starter-loan scoring, verification, milestone payment status | can explain whether the contractor path feels useful and realistic |
| `PB-PR-001` | peer reviewer | dispute evidence metadata, scoring, recommendation language | can explain whether peer review feels fair and auditable |
| `PB-AD-001` | founder/admin observer | readiness, support queue, known issues, go/no-go | can identify blockers without touching live systems |
| `PB-OB-001` | optional construction/business observer | full walkthrough feedback | can explain trust, confusion, and adoption blockers |

Do not store names, emails, phones, addresses, wallet IDs, account IDs, or other private tester identifiers in repo docs.

## Invite Sequence

1. Confirm the launch decision record is not `NO-GO`.
2. Confirm the cohort tracker uses tester codes only.
3. Confirm the invite batch tracker has one small first wave.
4. Send the public beta launch message only through a founder-controlled channel.
5. Send or show the tester FAQ.
6. Send or show the consent acknowledgement.
7. Send or show the privacy notice.
8. Send the tester quickstart.
9. Open the support queue for safe issue intake.
10. Run the session with demo data only.
11. Capture only safe support IDs, issue IDs, request IDs, and redacted screenshots.
12. Update daily status, weekly closeout, metrics snapshot, and go/no-go scorecard after the session.

## Role Prompts

Homeowner prompt:

- post a demo project;
- review a demo contractor bid;
- inspect milestone and dispute language;
- report what builds or breaks trust.

Contractor prompt:

- find a demo job;
- submit a demo bid;
- inspect simulated starter-loan scoring;
- report whether the flow helps start work without asking homeowners for risky upfront deposits.

Peer reviewer prompt:

- review evidence metadata only;
- score clarity, fairness, and recommendation wording;
- report whether the review feels auditable and not arbitrary.

Founder/admin observer prompt:

- check readiness, support queue, known issues, request IDs, and go/no-go language;
- report any screen that appears to enable real money, real loan approval, real escrow, repayment routing, stablecoin settlement, token collateral, legal claims, or provider commitments.

## Safe Support Intake

Support intake may include:

- tester code;
- tester role;
- page or flow;
- expected result;
- actual result;
- device/browser;
- safe `X-Request-Id`;
- issue ID;
- redacted screenshot status.

Support intake must not include:

- no SQL;
- no secrets;
- passwords;
- private keys or seed phrases;
- bank data;
- card data;
- personal IDs;
- private contact details;
- emails;
- phone numbers;
- real customer addresses;
- Supabase tokens;
- SQL output;
- database URLs;
- API keys;
- service-role keys;
- Magic Link tokens;
- payment data;
- wallet data;
- private project contracts;
- unredacted screenshots;
- raw recordings.

## Automatic Stop Conditions

Stop the cohort session immediately if:

- a tester is asked for secrets or private data;
- a tester tries to enter real payment, wallet, loan, escrow, collateral, or legal/provider information;
- a screen appears to approve real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral;
- Magic Link or admin status becomes confusing;
- support owner is unavailable;
- a P0 issue blocks the main demo flow;
- the public beta URL or local demo is unstable;
- screenshots or recordings expose private information.

## Existing Documents To Use

- `docs/smartcontractor-founder-evening-command-board.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-public-beta-launch-decision-record.md`
- `docs/smartcontractor-public-beta-tester-cohort.md`
- `docs/smartcontractor-public-beta-invite-batches.md`
- `docs/smartcontractor-public-beta-launch-message.md`
- `docs/smartcontractor-public-beta-tester-faq.md`
- `docs/smartcontractor-public-beta-consent-acknowledgement.md`
- `docs/smartcontractor-public-beta-privacy-notice.md`
- `docs/smartcontractor-public-beta-tester-quickstart.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-daily-status-template.md`
- `docs/smartcontractor-public-beta-weekly-closeout.md`
- `docs/smartcontractor-public-beta-metrics-snapshot.md`
- `docs/smartcontractor-beta-go-no-go-scorecard.md`

## Founder Summary Template

```text
SmartContractor first public beta cohort
Scope: demo only
Cohort size: 3-5
Launch decision state:
Support owner:
Known issue state:
Tester codes planned:
Invites sent:
Consent acknowledged:
Privacy notice acknowledged:
Sessions complete:
P0 issues:
Go/review/no-go after first wave:
Live-risk actions taken: none
```

## Required Checks

- `npm run check:public-beta-first-cohort-launch-packet`
- `npm run check:public-beta-founder-execution-plan`
- `npm run check:public-beta-launch-decision-record`
- `npm run check:public-beta-tester-cohort`
- `npm run check:public-beta-invite-batches`
- `npm run check:public-beta-launch-message`
- `npm run check:public-beta-tester-faq`
- `npm run check:public-beta-consent-ack`
- `npm run check:public-beta-privacy-notice`
- `npm run check:public-beta-support-queue`
- `npm run check:public-beta-known-issues`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

The founder can use this packet to run the first 3-5 tester wave with tester codes, demo-only prompts, safe support intake, automatic stop conditions, linked source docs, and no live/external/legal/money action.
