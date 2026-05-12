# SmartContractor Public Beta Launch Readiness

## Purpose

This document gives the founder one safe launch-readiness snapshot before sharing a SmartContractor public beta link. It is for demo only public beta coordination and is not production-ready proof, production approval, legal advice, investment reporting, loan approval, payment-provider approval, escrow approval, or token-collateral approval.

The goal is simple: decide whether the next public beta share is green, review, or no-go without exposing secrets, raw database records, private tester details, or live financial actions.

## Readiness Inputs

Check these inputs before any wider public beta share:

| Input | Required Safe Evidence |
|-------|------------------------|
| Public beta URL | `PUBLIC_SITE_URL` is known and reachable after founder-controlled deployment |
| Local checks | `npm run check` passes locally |
| Review packet | public beta review packet reviewed |
| Handoff | public beta handoff checklist reviewed |
| Metrics | public beta metrics snapshot prepared with aggregate fields only |
| Tester message | public beta launch message reviewed |
| Tester FAQ | public beta tester FAQ reviewed |
| Consent | public beta consent acknowledgement reviewed |
| Privacy | public beta privacy notice reviewed |
| Support | support queue owner and response window known |
| Known issues | known issues are acceptable or clearly blocked |
| Status rhythm | daily status and weekly closeout process ready |
| Traceability | `X-Request-Id` appears in smoke evidence where available |
| Founder dashboard | Founder Action Center blockers reviewed |
| Auth | Magic Link and Supabase Auth redirect status known |
| Deployment | Vercel setup reviewed by founder if Vercel is used |

## Green Conditions

Use green only when all of these are true:

- public beta scope remains demo only;
- `npm run check` passes;
- public beta review packet, handoff checklist, metrics snapshot, launch message, tester FAQ, consent acknowledgement, and privacy notice are ready;
- support queue, known issues, daily status, weekly closeout, and go/no-go scorecard are ready;
- founder review is complete for the beta link and tester message;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled;
- no SQL, no secrets, database URLs, API keys, service-role keys, Magic Link tokens, private contact details, payment data, or wallet data are copied into beta notes.

## Review Conditions

Use review when any of these are true:

- deployment URL works locally but the public environment still needs founder verification;
- Magic Link or Supabase Auth redirect needs founder review before tester invites;
- support queue ownership is unclear;
- known issues include P1 usability risks but no privacy, payment, loan, escrow, or token-collateral risk;
- a tester-facing statement could be read as legal, investment, payment, lending, escrow, or token promise;
- legal review or provider review is needed before changing the beta scope.

## No-Go Conditions

Use no-go when any of these are true:

- `npm run check` fails;
- public beta link exposes admin-only pages, private data, database URLs, API keys, service-role keys, Magic Link tokens, private contact details, payment data, or wallet data;
- real payments disabled, real loans disabled, escrow disabled, or token collateral disabled cannot be verified;
- a live Supabase change, external account change, payment-provider action, or legal decision is required before sharing;
- founder review is not complete;
- the beta could be mistaken as production-ready.

## Founder Launch Snapshot

Use this safe snapshot:

```text
SmartContractor public beta launch readiness
Scope: demo only
PUBLIC_SITE_URL:
Local check: npm run check passed/failed
Review packet: ready/review/no-go
Handoff checklist: ready/review/no-go
Metrics snapshot: ready/review/no-go
Launch message: ready/review/no-go
Tester FAQ: ready/review/no-go
Consent acknowledgement: ready/review/no-go
Privacy notice: ready/review/no-go
Support queue: ready/review/no-go
Known issues: acceptable/review/no-go
Daily status: ready/review/no-go
Weekly closeout: ready/review/no-go
Go/no-go scorecard: green/review/no-go
X-Request-Id smoke evidence: present/missing/not applicable
Founder Action Center blockers: reviewed/not reviewed
Magic Link status: ready/review/no-go
Supabase Auth redirect status: ready/review/no-go
Vercel status: ready/review/no-go/not used
Founder review: complete/incomplete
Legal review needed before wider scope: yes/no
Provider review needed before wider scope: yes/no
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Production-ready claim: no
```

## Blocked Actions

This launch readiness snapshot does not authorize:

- live Supabase SQL or RLS changes;
- external account changes;
- Vercel account connection without the founder;
- payment-provider activation;
- real payments;
- real loans;
- escrow or stored-value handling;
- token collateral lock, liquidation, or repayment;
- legal promises;
- investment or token-price claims;
- sharing private tester contact details or raw beta evidence.

Those actions require founder review, legal review, provider review, and separate explicit approval.

## Founder Decision Template

Use this final decision note:

```text
Decision: green / review / no-go
Reason:
Next safe action:
Founder review complete: yes/no
Legal review required before next scope: yes/no
Provider review required before next scope: yes/no
Boundaries confirmed: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no database URLs, no API keys, no service-role keys, no Magic Link tokens, no private contact details, no payment data, and no wallet data included.
Production-ready claim: no.
```
