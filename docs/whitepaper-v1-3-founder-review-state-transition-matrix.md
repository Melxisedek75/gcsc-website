# GCSC Whitepaper v1.3 Founder Review State Transition Matrix

Status: internal founder review state transition matrix. Current publication decision remains NO-GO.

This matrix does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This matrix defines which v1.3 founder-review states are allowed, what evidence is required to enter each state, and which next actions remain blocked. It prevents a local-review approval from being reused as public publication approval, provider outreach approval, legal/provider clearance, or live finance/Web3 approval.

## State Matrix

| State | Meaning | Required Evidence | Allowed Next Step | Blocked Next Step |
|---|---|---|---|---|
| NO_GO_PUBLICATION_DEFAULT | default state for all public/live use | publication gate and blocker matrix remain NO-GO | safe local prep, validators, packet cleanup | publication, outreach, live finance, live Web3 |
| LOCAL_REVIEW_REQUESTED | founder may be asked for local-review approval | `docs/whitepaper-v1-3-founder-approval-to-review-packet.md` | founder may type exact phrase | treating request as approval |
| LOCAL_REVIEW_ACTIVE | founder has typed `V1_3_LOCAL_REVIEW_APPROVED` for local polish only | current-thread intake record with exact phrase and live/public exclusions | local draft polish, validators, review-packet refinement | public replacement, outreach, legal/provider clearance, live actions |
| REVISION_REQUESTED | founder requests local changes | founder decision intake identifies files and scope | local revisions and validators | publishing revised content |
| REVIEWER_ROUTING_READY | founder chooses reviewer route but no send is authorized | founder names reviewer category and packet scope | local packet assembly and redaction check | autonomous outreach or provider commitment |
| REVIEWER_PACKET_PREPARED | packet is locally assembled for founder-controlled send | cover sheet, redaction checklist, routing index, and response intake template | founder-controlled manual send decision later | Codex sending packet or claiming review |
| PUBLICATION_GO_RECORD_REQUIRED | public use remains unavailable until separate evidence exists | future publication GO record with founder/legal/provider/evidence support | none until record exists | any inferred public GO |
| LIVE_ACTION_AUTH_REQUIRED | live finance/Web3 remains unavailable until separate evidence exists | future live-action authorization path, legal/provider/security evidence, and external account owner action | none until record exists | payments, loans, escrow, stablecoin, token collateral, FIO, XPR, wallet signatures |

## Allowed Transitions

| From | To | Required Condition |
|---|---|---|
| NO_GO_PUBLICATION_DEFAULT | LOCAL_REVIEW_REQUESTED | founder-facing local-review packet exists |
| LOCAL_REVIEW_REQUESTED | LOCAL_REVIEW_ACTIVE | exact `V1_3_LOCAL_REVIEW_APPROVED` phrase is recorded with local-review-only scope |
| LOCAL_REVIEW_REQUESTED | NO_GO_PUBLICATION_DEFAULT | exact phrase is absent, ambiguous, stale, bundled with live scope, or rejected |
| LOCAL_REVIEW_ACTIVE | REVISION_REQUESTED | founder identifies specific local sections to revise |
| LOCAL_REVIEW_ACTIVE | REVIEWER_ROUTING_READY | founder chooses `ROUTE_TO_REVIEWERS` and names reviewer category separately |
| REVIEWER_ROUTING_READY | REVIEWER_PACKET_PREPARED | local redaction checklist and cover sheet are ready |
| any state | NO_GO_PUBLICATION_DEFAULT | evidence is stale, unsafe, ambiguous, revoked, or mixed with live/public scope |

## Disallowed Transitions

The following transitions are always blocked unless a separate future approval packet and evidence record exists:

| From | Blocked To | Reason |
|---|---|---|
| LOCAL_REVIEW_ACTIVE | public file replacement | local-review approval is not publication approval |
| LOCAL_REVIEW_ACTIVE | provider outreach | founder must approve recipient and send separately |
| LOCAL_REVIEW_ACTIVE | legal/provider clearance | reviewer response and summary are separate records |
| LOCAL_REVIEW_ACTIVE | live finance/Web3 | live actions require legal/provider/security/external-account paths |
| REVIEWER_PACKET_PREPARED | provider commitment | sending a packet cannot create partnership or approval |
| REVIEWER_PACKET_PREPARED | publication clearance | reviewer feedback must be recorded and routed first |

## Evidence Freshness Rules

- Current-thread founder text is required for `V1_3_LOCAL_REVIEW_APPROVED`.
- Screenshots do not replace typed current-thread confirmation.
- Old approvals from a prior date, thread, or artifact remain stale until re-recorded.
- Any approval message that includes secrets, credentials, private keys, service-role keys, seed phrases, payment data, publication scope, outreach scope, live finance scope, or Web3 activation scope becomes HOLD_FOR_CLARIFICATION.
- Local validators can support readiness, but they cannot create publication clearance or live-action authorization.

## Linked Controls

- `docs/whitepaper-v1-3-founder-approval-to-review-packet.md`
- `docs/whitepaper-v1-3-founder-decision-intake-template.md`
- `docs/whitepaper-v1-3-founder-review-closeout.md`
- `docs/whitepaper-v1-3-publication-blocker-status-matrix.md`
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`
- `docs/whitepaper-v1-3-reviewer-routing-index.md`
- `docs/whitepaper-v1-3-external-reviewer-cover-sheet.md`
- `docs/whitepaper-v1-3-reviewer-response-intake-template.md`

## Stop Boundary

This matrix does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, public website update, investor packet, provider packet, or announcement;
- contacting providers, reviewers, attorneys, banks, lenders, escrow providers, insurers, appraisers, regulators, FIO, XPR, WebAuth, Metal, or Metallicus;
- creating accounts or changing external settings;
- claiming founder, legal, provider, reviewer, screenshot, publication, partnership, or live-system clearance;
- activating real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, minting, staking, bridging, swaps, transfers, or production Web3 actions.
