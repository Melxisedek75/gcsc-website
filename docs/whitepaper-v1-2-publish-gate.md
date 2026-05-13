# GCSC Whitepaper v1.2 Publish Gate

Status: blocking gate. Do not publish until every gate below is approved.

## Purpose

This document prevents a draft whitepaper restructure from becoming public language before founder, legal, provider, and technical checks are ready.

Do not publish a v1.2 whitepaper, PDF, site update, partner packet, grant packet, investor packet, or public excerpt until this gate is passed.

## Required Approvals

Founder approval required:

- structure approved;
- source target approved;
- publish audience approved;
- public date approved;
- final diff approved.

Provider or attorney/provider/founder approval required before any real financial language is public-facing:

- real escrow;
- real lending;
- real token collateral;
- stablecoin settlement;
- custody;
- AML controls;
- payment provider availability.

## Content Gate

The final draft must preserve:

- SmartContractor Marketplace as the practical first product;
- project contracts and milestones before token mechanics;
- escrow-ready language instead of live escrow claims;
- contractor credit as a workflow, not automatic financing;
- Digital Asset Market Clarity Act language as evolving policy context only;
- compliance-ready language, not compliance-guaranteed language;
- no legal conclusion from pending legislation.

Required source files:

- `docs/whitepaper-v1-2-source-map.md`;
- `docs/whitepaper-v1-2-edit-plan.md`;
- `docs/whitepaper-v1-2-founder-review-checklist.md`;
- `docs/whitepaper-v1-2-restructure-draft.md`.

## Legal And Financial Gate

The final draft must say:

- no real escrow without approval;
- no real lending without approval;
- no real token collateral without approval;
- no token price promise;
- no stablecoin settlement in unsupported jurisdictions;
- no automatic AI legal or financial decision.

The final draft must not say:

- GCSC tokens will increase in value;
- legislation makes GCSC automatically legal;
- loans are automatically approved;
- disputed funds are automatically released;
- token collateral is automatically liquidated;
- stablecoins can be used everywhere.

## Technical Gate

Run before publish:

```bash
npm run check:whitepaper-sections
npm run check:whitepaper-v1-2-restructure
npm run check:whitepaper-v1-2-founder-review
npm run check:whitepaper-v1-2-edit-plan
npm run check:whitepaper-v1-2-source-map
npm run check:whitepaper-v1-2-publish-gate
npm run check
```

The final draft must also be checked for:

- no secrets;
- no provider credentials;
- no outdated file paths;
- no mismatch with current product readiness;
- no unsupported public launch claim.

## Founder Final Check

Founder should confirm:

```text
I approve the v1.2 structure:
I approve the final source file:
I approve the public audience:
I approve the publication date:
I confirm legal/provider review status:
I approve the final diff:
```

## Blocked Outcomes

If any item above is missing, do not publish.

Allowed blocked outcome:

- keep the draft internal;
- update the checklist;
- request founder/legal/provider review;
- revise the source map;
- rerun `npm run check:whitepaper-v1-2-publish-gate`.
