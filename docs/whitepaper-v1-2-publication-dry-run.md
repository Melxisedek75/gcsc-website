# GCSC Whitepaper v1.2 Publication Dry Run

Status: internal publication dry run. This is not approval to publish or edit `whitepaper.html`.

Purpose: rehearse the exact public v1.2 whitepaper update sequence without changing public files, so the founder can see what will be touched after approvals are recorded.

## Dry Run Scope

The dry run may inspect and plan updates for:

- public `whitepaper.html`;
- future PDF export;
- website copy that references the whitepaper;
- deck, partner packet, grant packet, investor packet, email, social post, and announcement excerpts.

The dry run must not modify any of those public files.

## Inputs

Before a real publication pass, verify these internal inputs:

- `whitepaper-v1-2-founder-review-worksheet.md`;
- `whitepaper-v1-2-founder-response-intake.md`;
- `whitepaper-v1-2-review-change-log.md`;
- `whitepaper-v1-2-approval-record-template.md`;
- `whitepaper-v1-2-public-edit-queue.md`;
- `whitepaper-v1-2-claim-review-matrix.md`;
- `whitepaper-v1-2-terms-glossary.md`;
- `whitepaper-v1-2-section-replacement-preview.md`.

## Dry Run Checklist

| Step | Dry Run Action | Required Evidence | Status |
|------|----------------|-------------------|--------|
| 1 | Confirm founder decisions are captured | Response intake has Accept/Revise/Reject entries | Pending |
| 2 | Confirm change log matches founder decisions | Change log has no stale Pending rows before publication | Pending |
| 3 | Confirm approval record is complete | Founder, attorney/provider, and technical approvals are recorded | Pending |
| 4 | Confirm blocked claims are absent | Claim review matrix has no public-use blocked claim | Pending |
| 5 | Confirm replacement wording is ready | Section replacement preview is aligned with accepted/revised decisions | Pending |
| 6 | Confirm public edit order | Public edit queue lists the exact file order | Pending |
| 7 | Confirm verification commands | Required commands are run and saved as evidence | Pending |
| 8 | Confirm rollback path | Old public whitepaper and PDF can be restored if needed | Pending |

## Must Stay Blocked

Do not publish wording that says:

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
npm run check:whitepaper-v1-2-publication-dry-run
npm run check:whitepaper-v1-2-review-change-log
npm run check:whitepaper-v1-2-approval-record
npm run check:whitepaper-v1-2-public-edit-queue
npm run check
```

## Safe Default

If any dry-run item is Pending, conflicted, or missing evidence, keep all v1.2 material internal and leave public `whitepaper.html`, PDF, website copy, deck, partner packet, grant packet, investor packet, email, social post, and announcement language unchanged.
