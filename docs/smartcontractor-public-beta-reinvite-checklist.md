# SmartContractor Public Beta Re-Invite Checklist

## Purpose

This checklist gives the founder a safe way to re-invite a public beta tester after a previous session, issue, support queue item, consent update, or evidence review.

This is for demo only public beta work. It is not a marketing automation system, legal advice, production consent workflow, or permission to change live accounts. Before public launch, final consent, privacy, and communication workflows need founder review and legal review.

## When To Use This

Use this before sending a second beta invite to a tester who already:

- completed a first SmartContractor demo session;
- submitted an issue ID or X-Request-Id;
- has a support queue item;
- reported known issues;
- signed a consent acknowledgement;
- reviewed the privacy notice;
- requested a use restriction request, data deletion request, or consent withdrawal request that needs review.

Do not use this to restart a tester who withdrew consent, asked for deletion, or has unresolved legal/privacy concerns unless founder review and legal review explicitly clear the re-invite.

## Safe Re-Invite Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Previous session summary | short redacted summary |
| Related issue ID | `BETA-001` |
| Related X-Request-Id | `req-demo-123` |
| Support queue item | safe short label |
| Known issues status | fixed, accepted limitation, blocked, or under review |
| Consent status | current, pending update, withdrawn, or blocked |
| Re-invite decision | send, hold, founder review, or legal review |

Do not store private contact details, personal IDs, payment data, wallet data, real customer addresses, no SQL, no secrets, database URLs, API keys, Magic Link tokens, or service-role keys in the re-invite log.

## Do Not Re-Invite If

Hold the re-invite if any of these are true:

- consent withdrawal request is active;
- data deletion request is pending;
- use restriction request blocks the planned session or artifact use;
- the tester reported sensitive data in screenshots or recordings that has not been redacted;
- known issues include Auth/admin confusion, payment confusion, loan approval confusion, escrow confusion, or token collateral confusion;
- founder review or legal review is required and not complete.

## Founder Handling Steps

1. Open the previous session summary and support queue item.
2. Confirm every issue ID and X-Request-Id is safe to reference.
3. Check known issues and decide whether the next session is still useful.
4. Confirm the consent acknowledgement and privacy notice are still current.
5. Check whether the tester has an active consent withdrawal request, data deletion request, or use restriction request.
6. Send a re-invite only if the tester is still within demo only scope.
7. Keep real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Re-Invite Log Format

Use this safe log format:

```text
SmartContractor public beta re-invite log
Scope: demo only
PUBLIC_SITE_URL:
Tester role:
Previous session summary:
Issue ID:
X-Request-Id:
Support queue item:
Known issues status:
Consent acknowledgement status:
Privacy notice status:
Restriction/deletion/withdrawal status:
Re-invite decision:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
Legal review required: yes/no
```

The log must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This checklist does not authorize:

- live Supabase SQL changes;
- production consent changes;
- external account changes;
- legal promises;
- real customer onboarding;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- sharing private tester contact details.

Those actions require founder review, legal review, and the final public beta communication process.

## Tester Re-Invite Template

Subject: SmartContractor public beta follow-up session

Message:

Thank you for helping test SmartContractor.

I would like to invite you to a follow-up demo only public beta session. The goal is to re-check the SmartContractor flow after reviewing the previous session summary, known issues, issue ID, X-Request-Id, and support queue note.

Please do not send SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

If you want to withdraw consent, request deletion, request export, request correction, or restrict how your feedback is used, tell me before the session and I will handle it through the matching public beta request process.
