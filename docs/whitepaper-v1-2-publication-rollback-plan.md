# GCSC Whitepaper v1.2 Publication Rollback Plan

Status: internal rollback plan. This is not approval to publish or edit `whitepaper.html`.

Purpose: define how to safely reverse a future v1.2 public whitepaper update if a claim, approval, formatting issue, broken link, or public-risk problem is found after publication.

Related controls: `whitepaper-v1-2-publication-dry-run.md`, `whitepaper-v1-2-review-change-log.md`, and `whitepaper-v1-2-approval-record-template.md`.

## Rollback Scope

This plan applies only after founder-approved publication work has already changed one or more public artifacts:

- public `whitepaper.html`;
- generated PDF export;
- website copy that references the whitepaper;
- deck, partner packet, grant packet, investor packet, email, social post, or announcement excerpts.

This plan does not authorize publication, legal claims, real escrow, real lending, real token collateral, or provider commitments.

## Rollback Triggers

Rollback immediately if any public artifact says or implies:

- real escrow is live;
- real lending is live;
- real token collateral is live;
- contractor credit is guaranteed;
- token price is promised;
- yield is guaranteed;
- AI makes automatic legal or financial decisions;
- Digital Asset Market Clarity Act creates legal approval for GCSC;
- attorney/provider/founder approval is optional.

Rollback also applies if:

- founder approval record is missing or conflicts with the published text;
- attorney/provider review is missing for escrow, lending, collateral, stablecoin, or tokenized agreement wording;
- technical approval is missing for MVP readiness, strict RLS/admin readiness, or disabled real-money gates;
- public links, PDF export, or mobile layout are broken;
- public wording creates avoidable legal, investor, consumer, lender, or provider confusion.

## Rollback Steps

| Step | Action | Evidence |
|------|--------|----------|
| 1 | Stop further sharing of the affected public artifact | Note channel and timestamp |
| 2 | Identify the exact public file or excerpt | Record file path, packet name, or URL |
| 3 | Restore the last approved public version | Record commit or artifact version |
| 4 | Re-run public safety validators | Save command output summary |
| 5 | Update the review change log | Mark item Rejected, Revised, Blocked, or Deferred |
| 6 | Update the approval record | Record rollback reason and next required approval |
| 7 | Publish only a corrected version after approval | Keep public files unchanged until approval is recorded |

## Required Commands

```bash
npm run check:whitepaper-v1-2-publication-rollback-plan
npm run check:whitepaper-v1-2-publication-dry-run
npm run check:whitepaper-v1-2-review-change-log
npm run check:whitepaper-v1-2-approval-record
npm run check
```

## Safe Default

If rollback evidence is incomplete, keep the last known safe public version and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged until the founder approves the corrected version.
