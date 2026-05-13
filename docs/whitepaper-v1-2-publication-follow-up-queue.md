# GCSC Whitepaper v1.2 Publication Follow-Up Queue

Status: internal follow-up queue template. This is not approval to publish, send, share, recall, supersede, replace, or revise `whitepaper.html`.

Purpose: define how future post-distribution questions, requests, corrections, and review tasks for approved v1.2 whitepaper artifacts should be tracked without storing private recipient contact details, secrets, raw legal advice, provider credentials, or unsafe claims.

Related controls: `whitepaper-v1-2-publication-distribution-log.md`, `whitepaper-v1-2-publication-version-history.md`, `whitepaper-v1-2-publication-correction-notice.md`, `whitepaper-v1-2-publication-evidence-log.md`, `whitepaper-v1-2-publication-rollback-plan.md`, `whitepaper-v1-2-publication-go-no-go-checklist.md`, and `whitepaper-v1-2-approval-record-template.md`.

## Follow-Up States

- Open: non-sensitive follow-up is recorded and awaiting owner review.
- Waiting Founder: founder decision is needed before response, revision, or routing.
- Waiting Legal/Provider: attorney or provider review is needed before response or revision.
- Technical Review: product, architecture, security, or verification evidence is being checked.
- Correction Needed: published or shared artifact may need correction, supersede, recall, or rollback routing.
- Closed: follow-up was answered or routed with no public artifact change.
- Blocked: follow-up requires secrets, external account access, live Supabase changes, real payments, real loans, real escrow, token collateral, legal decisions, or unsafe claims.

## Follow-Up Record Template

| Field | Safe Content |
|-------|--------------|
| Follow-up ID | `WP12-FUP-YYYYMMDD-##` |
| Distribution ID | Distribution log ID, if available |
| Version ID | Version history ID |
| Source type | Public, partner, grant, investor, provider, legal, internal, email, social, announcement, or meeting |
| Request category | Product, wording, evidence, legal/provider, technical, correction, rollback, investor, grant, or blocked |
| Non-private summary | Short summary without names, emails, phone numbers, wallet addresses, account IDs, raw quotes, or sensitive evidence |
| Owner | Founder, technical reviewer, attorney/provider reviewer, or Codex draft only |
| Status | Open, Waiting Founder, Waiting Legal/Provider, Technical Review, Correction Needed, Closed, or Blocked |
| Required evidence | Evidence log ID, approval record path, version history link, correction notice link, or rollback record |
| Safe next action | Internal draft, founder review, legal/provider routing, technical check, correction notice draft, rollback review, or blocked |

## Required Follow-Up Boundaries

- Do not store private recipient contact details, private investor details, raw legal advice, provider credentials, service-role keys, API keys, database URLs, wallet private data, passwords, seed phrases, or private keys.
- Do not answer legal, lending, escrow, token, provider, grant, or investor diligence questions as final without founder and required professional review.
- Do not promise production launch timing, real escrow, real lending, real token collateral, token price, yield, guaranteed contractor credit, provider approval, legal approval, or automatic AI decisions.
- If follow-up reveals an unsafe claim, stale version, wrong audience, missing approval, missing evidence, or private data exposure, mark Correction Needed or Blocked and route to the correction notice, version history, evidence log, and rollback plan.
- Public, partner, grant, investor, provider, legal, email, social, or announcement responses must use approved wording only.

## Automatic Block Triggers

Mark follow-up Blocked if the request, answer, artifact, or share context says or implies:

- real escrow is live;
- real lending is live;
- real token collateral is live;
- contractor credit is guaranteed;
- token price is promised;
- yield is guaranteed;
- AI makes automatic legal or financial decisions;
- Digital Asset Market Clarity Act creates legal approval for GCSC;
- attorney/provider/founder approval is optional;
- Codex can approve legal, provider, lending, escrow, payment, token collateral, or investor claims.

## Required Commands

```bash
npm run check:whitepaper-v1-2-publication-follow-up-queue
npm run check:whitepaper-v1-2-publication-distribution-log
npm run check:whitepaper-v1-2-publication-version-history
npm run check:whitepaper-v1-2-publication-correction-notice
npm run check:whitepaper-v1-2-publication-evidence-log
npm run check:whitepaper-v1-2-publication-go-no-go
npm run check
```

## Safe Default

If ownership, approval, version, audience, evidence, legal/provider routing, correction state, rollback state, or claim safety is unclear, mark the follow-up Blocked, keep the response internal, and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged.
