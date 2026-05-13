# GCSC Whitepaper v1.2 Publication Distribution Log

Status: internal distribution log template. This is not approval to publish, send, share, recall, supersede, or replace `whitepaper.html`.

Purpose: define how any future approved v1.2 whitepaper artifact distribution should be tracked after publication, without storing private recipient contact details, secrets, raw legal advice, provider credentials, or unsafe claims.

Related controls: `whitepaper-v1-2-publication-version-history.md`, `whitepaper-v1-2-publication-go-no-go-checklist.md`, `whitepaper-v1-2-publication-correction-notice.md`, `whitepaper-v1-2-publication-evidence-log.md`, `whitepaper-v1-2-publication-rollback-plan.md`, and `whitepaper-v1-2-approval-record-template.md`.

## Distribution Rules

- Record only non-secret distribution metadata.
- Do not store private recipient names, emails, phone numbers, wallet addresses, account IDs, database URLs, API keys, service-role keys, passwords, seed phrases, private keys, raw legal advice, or provider credentials.
- Do not distribute a Draft, Review, Recalled, or Archived artifact as current public material.
- Do not distribute a corrected or superseded artifact unless the correction notice or version history clearly points to the current approved reference.
- Do not imply real escrow, real lending, real token collateral, guaranteed contractor credit, token price, yield, legal approval, provider approval, or AI automated legal/financial decisions.

## Distribution Record Template

| Field | Safe Content |
|-------|--------------|
| Distribution ID | `WP12-DIST-YYYYMMDD-##` |
| Version ID | Approved or Published version ID from the version history |
| Artifact reference | Public URL, filename, or packet label without private recipient data |
| Audience type | Public, partner, grant, investor, provider, legal, internal, email, social, or announcement |
| Channel | Website, PDF, deck, packet, email, social, meeting, or repository |
| Share status | Planned, Shared, Paused, Corrected, Superseded, Recalled, or Blocked |
| Approval link | Approval record path or ID |
| Evidence link | Evidence log ID or path |
| Follow-up owner | Founder, technical reviewer, attorney/provider reviewer, or Codex draft only |

## Required Distribution Boundaries

- A distribution record must reference an Approved or Published version, a completed approval record, and a non-secret evidence log.
- Partner, grant, investor, provider, or legal distribution must use the approved audience-specific packet or public artifact label only.
- Email, social, and announcement distribution must use approved public-safe wording and must not create investment, lending, escrow, token, provider, or legal promises.
- If a distributed artifact is corrected, superseded, recalled, or blocked, the distribution record must link to the correction notice, version history state, or rollback record.

## Automatic Block Triggers

Mark distribution Blocked if the artifact or share context says or implies:

- real escrow is live;
- real lending is live;
- real token collateral is live;
- contractor credit is guaranteed;
- token price is promised;
- yield is guaranteed;
- AI makes automatic legal or financial decisions;
- Digital Asset Market Clarity Act creates legal approval for GCSC;
- attorney/provider/founder approval is optional.

## Required Commands

```bash
npm run check:whitepaper-v1-2-publication-distribution-log
npm run check:whitepaper-v1-2-publication-version-history
npm run check:whitepaper-v1-2-publication-go-no-go
npm run check:whitepaper-v1-2-publication-correction-notice
npm run check:whitepaper-v1-2-publication-evidence-log
npm run check
```

## Safe Default

If approval, version state, evidence, audience, channel, correction, rollback, or claim review is unclear, mark distribution Blocked, keep v1.2 material internal, and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged.
