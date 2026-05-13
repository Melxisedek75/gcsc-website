# GCSC Whitepaper v1.2 Publication Correction Notice

Status: internal correction notice template. This is not approval to publish, edit, recall, or replace `whitepaper.html`.

Purpose: define the safe notice format to use if a future approved v1.2 whitepaper, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, or announcement needs correction after publication.

Related controls: `whitepaper-v1-2-publication-go-no-go-checklist.md`, `whitepaper-v1-2-publication-evidence-log.md`, `whitepaper-v1-2-publication-rollback-plan.md`, `whitepaper-v1-2-claim-review-matrix.md`, and `whitepaper-v1-2-approval-record-template.md`.

## Correction Rules

- Record only non-secret correction metadata.
- Do not paste private legal advice, provider credentials, API keys, service-role keys, database URLs, wallet seed phrases, private keys, passwords, raw recipient contact details, or private account IDs.
- Do not repeat unsafe or withdrawn language in public correction text.
- Do not claim that a correction is legal approval, provider approval, escrow activation, lending activation, token collateral activation, investment advice, or token-price guidance.
- Keep the public correction limited to what changed, why it changed at a high level, and where the corrected version can be reviewed.

## Correction Notice Template

| Field | Safe Content |
|-------|--------------|
| Notice ID | `WP12-COR-YYYYMMDD-##` |
| Original artifact | Public URL, filename, version label, or packet name without private recipient data |
| Correction type | Typo, clarity, claim-safety, legal/provider wording, technical readiness, artifact mismatch, rollback, or superseded version |
| Safe summary | One or two sentences explaining the correction without repeating unsafe language |
| Approval status | Founder, attorney/provider, and technical review status |
| Related evidence | Evidence log ID, claim review ID, rollback ID, issue ID, or approval record path |
| Public action | Corrected, superseded, recalled, temporarily removed, or no public action |
| Owner | Founder, legal/provider reviewer, technical reviewer, or Codex draft only |

## Public-Safe Notice Wording

Use conservative wording like:

> A previous GCSC whitepaper v1.2 draft or artifact has been corrected for clarity and review alignment. The corrected material should be treated as the current reference. No real escrow, lending, token collateral, investment return, legal approval, provider approval, or AI automated financial/legal decision is implied by this correction.

## Automatic Escalation

Escalate to founder/legal/provider review before any public correction if the issue touches:

- real escrow is live;
- real lending is live;
- real token collateral is live;
- contractor credit is guaranteed;
- token price is promised;
- yield is guaranteed;
- AI makes automatic legal or financial decisions;
- Digital Asset Market Clarity Act creates legal approval for GCSC;
- attorney/provider/founder approval is optional;
- external partner, grant, investor, provider, legal, or public audience reliance.

## Required Commands

```bash
npm run check:whitepaper-v1-2-publication-correction-notice
npm run check:whitepaper-v1-2-publication-go-no-go
npm run check:whitepaper-v1-2-publication-evidence-log
npm run check:whitepaper-v1-2-publication-rollback-plan
npm run check:whitepaper-v1-2-claim-review
npm run check
```

## Safe Default

If a correction is needed but approvals or evidence are incomplete, keep the correction internal, stop sharing the affected artifact, and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged until founder/legal/provider/technical review is complete.
