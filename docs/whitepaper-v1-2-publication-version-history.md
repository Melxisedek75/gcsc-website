# GCSC Whitepaper v1.2 Publication Version History

Status: internal version history template. This is not approval to publish, edit, recall, supersede, or replace `whitepaper.html`.

Purpose: define how every future approved v1.2 whitepaper artifact version should be tracked across draft, approved, published, corrected, superseded, recalled, or archived states without storing secrets, private recipient data, raw legal advice, provider credentials, or unsafe claims.

Related controls: `whitepaper-v1-2-publication-go-no-go-checklist.md`, `whitepaper-v1-2-publication-correction-notice.md`, `whitepaper-v1-2-publication-evidence-log.md`, `whitepaper-v1-2-publication-rollback-plan.md`, `whitepaper-v1-2-public-edit-queue.md`, and `whitepaper-v1-2-approval-record-template.md`.

## Version States

| State | Meaning | Public Action |
|-------|---------|---------------|
| Draft | Internal working material only | Do not publish |
| Review | Founder, attorney/provider, or technical review is pending | Do not publish |
| Approved | Approval record is complete, but artifact is not public yet | Publish only through approved queue |
| Published | Approved artifact is public | Monitor and preserve evidence |
| Corrected | Public artifact was corrected with approved notice | Point users to corrected reference |
| Superseded | Newer approved artifact replaced this version | Stop using older version as current |
| Recalled | Artifact should not be used or shared | Stop sharing and follow rollback plan |
| Archived | Internal record retained for traceability | Do not use as current public copy |

## Version Record Template

| Field | Safe Content |
|-------|--------------|
| Version ID | `WP12-VYYYYMMDD-##` |
| Artifact type | Whitepaper HTML, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social, or announcement |
| Artifact reference | Public URL, filename, or internal path without private recipient details |
| State | Draft, Review, Approved, Published, Corrected, Superseded, Recalled, or Archived |
| Approval record | Approval record path or ID |
| Evidence log | Evidence log ID or path |
| Claim review | Claim review matrix ID or path |
| Correction notice | Correction notice ID or not applicable |
| Rollback link | Rollback record ID or not applicable |
| Owner | Founder, technical reviewer, attorney/provider reviewer, or Codex draft only |

## Required Version Boundaries

- Public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language must not change unless the version state is Approved and the public edit queue is locked.
- A Published version must have founder approval, attorney/provider approval where required, technical approval, claim review, publication evidence, rollback readiness, and passing verification commands.
- A Corrected, Superseded, or Recalled version must link to a correction notice or rollback record.
- A Draft or Review version must stay internal and must not be used as public, partner, grant, investor, provider, legal, email, social, or announcement language.

## Automatic No-Go Triggers

Do not mark a version Approved or Published if it says or implies:

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
npm run check:whitepaper-v1-2-publication-version-history
npm run check:whitepaper-v1-2-publication-go-no-go
npm run check:whitepaper-v1-2-publication-correction-notice
npm run check:whitepaper-v1-2-publication-evidence-log
npm run check:whitepaper-v1-2-publication-rollback-plan
npm run check
```

## Safe Default

If version state, approvals, claim review, correction, rollback, or evidence are unclear, mark the artifact Review or Recalled, keep v1.2 material internal, and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged.
