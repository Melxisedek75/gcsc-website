# GCSC Whitepaper v1.3 Public Announcement Review Template

Status: internal public announcement review template. No public announcement, distribution copy, email, social post, deck text, grant packet text, partner packet text, investor packet text, or reviewer outreach is approved or recorded here.

This template does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This template defines the future review rows required before any v1.3 announcement or distribution copy is used outside the local repo. It keeps public messaging separate from publication approval and provider outreach approval.

## Announcement Review Record Template

| Field | Value |
|---|---|
| review id | PENDING_REVIEW_ID |
| review date | PENDING_DATE |
| reviewer | PENDING_FOUNDER_OR_APPROVED_REVIEWER |
| source commit | PENDING_COMMIT |
| intended audience | PENDING_AUDIENCE |
| channel | PENDING_CHANNEL |
| publication approved? | NO by default |
| public file replacement approved? | NO by default |
| provider outreach approved? | NO by default |
| reviewer outreach approved? | NO by default |
| legal/provider review recorded? | NO by default |
| final state | PENDING_ANNOUNCEMENT_REVIEW |

## Announcement Copy Rows Template

| Evidence ID | Channel | Required Review | Current State | Notes |
|---|---|---|---|---|
| V13-ANNOUNCE-WEB-01 | website notice | no live finance, partnership, investment, token upside, or provider-clearance claim | PENDING_ANNOUNCEMENT_REVIEW | do not publish until separate GO |
| V13-ANNOUNCE-EMAIL-01 | founder email | no provider outreach, legal conclusion, or request for sensitive data | PENDING_ANNOUNCEMENT_REVIEW | do not send until founder-controlled send approval |
| V13-ANNOUNCE-SOCIAL-01 | social post | no investment, yield, staking return, public NFT, instant loan, or escrow custody claim | PENDING_ANNOUNCEMENT_REVIEW | do not post autonomously |
| V13-ANNOUNCE-DECK-01 | deck or investor packet | conservative traction and technology claims only, with review gates visible | PENDING_ANNOUNCEMENT_REVIEW | do not distribute autonomously |
| V13-ANNOUNCE-PARTNER-01 | partner packet | no implied relationship, integration, approval, or commitment | PENDING_ANNOUNCEMENT_REVIEW | do not contact providers autonomously |
| V13-ANNOUNCE-GRANT-01 | grant packet | no production-readiness or regulatory-clearance overstatement | PENDING_ANNOUNCEMENT_REVIEW | do not submit autonomously |

## Allowed Result States

- PENDING_ANNOUNCEMENT_REVIEW;
- PASS_REVIEWED_LATER;
- FAIL_REVIEWED_LATER;
- BLOCKED_FOR_REWRITE;
- BLOCKED_FOR_LEGAL_PROVIDER_REVIEW.

## Required Before Any PASS

- founder approves the specific audience and channel;
- public publication decision remains separate;
- public file replacement decision remains separate;
- provider outreach decision remains separate;
- legal/provider review is recorded when regulated claims are included;
- announcement copy is checked against `docs/whitepaper-v1-3-claim-risk-hardening-checklist.md`;
- no secrets, private contact details, private customer information, account IDs, wallet/payment data, or raw evidence are included.

## Stop Boundary

This template cannot be used to publish announcements, send email, post social content, submit grant materials, distribute decks, contact providers, contact reviewers, approve public wording, replace public files, claim legal/provider review is complete, touch live Supabase, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, or sign XPR actions.
