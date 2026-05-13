# GCSC Whitepaper v1.2 Public Excerpt Guard

Status: internal guard. Use before copying any v1.2 language into a website, PDF, partner packet, grant packet, investor packet, email, pitch deck, social post, or public announcement.

## Purpose

This guard prevents small excerpts from escaping the whitepaper approval path with stronger claims than the full draft allows.

Every excerpt must trace back to:

- `docs/whitepaper-v1-2-source-map.md`;
- `docs/whitepaper-v1-2-publish-gate.md`;
- `docs/whitepaper-v1-2-approval-record-template.md`;
- `docs/whitepaper-v1-2-founder-decision-packet.md`.

## Allowed Excerpt Themes

Allowed after founder review:

- SmartContractor Marketplace as the first practical product;
- project contracts and milestones;
- contractor verification and Contractor Reputation Layer;
- AI-assisted matching, risk review, compliance checks, and dispute triage;
- escrow-ready payment workflows, not live escrow;
- credit-ready contractor workflows, not automatic lending;
- stablecoin settlement roadmap, not guaranteed stablecoin availability;
- tokenized construction agreements as a future regulated roadmap;
- Digital Asset Market Clarity Act as policy context, not a legal conclusion.

## Blocked Excerpt Claims

Do not publish excerpts that say or imply:

- legal approval is complete;
- legislation makes GCSC automatically compliant;
- real escrow is live;
- real lending is live;
- real token collateral is live;
- stablecoin settlement is available in every jurisdiction;
- AI can make legal, lending, escrow, payment release, or investment decisions;
- GCSC or GCST has a guaranteed price, yield, return, or appreciation path;
- all contractors are verified unless the verification source and status are explicit;
- homeowners are fully protected from all fraud or construction risk.

## Required Excerpt Review

Before use, record:

```text
Excerpt text:
Source document:
Source section:
Audience:
Channel:
Founder approval:
Legal/provider review needed:
Product readiness claim:
Risk claim:
Token/settlement claim:
```

## Required Commands

Run before public use:

```bash
npm run check:whitepaper-v1-2-public-excerpt-guard
npm run check:whitepaper-v1-2-founder-decision-packet
npm run check:whitepaper-v1-2-approval-record
npm run check
```

## Safe Default

If unsure, keep the excerpt private and route it back through founder/legal/provider review.
