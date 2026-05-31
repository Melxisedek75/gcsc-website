# GCSC Whitepaper v1.3 Public HTML Replacement Plan

Status: internal replacement plan. This does not approve editing, publishing, deleting, or replacing `whitepaper.html` or `index.html`.

## Goal

Prepare a safe replacement path from the current token-first public website language to v1.3 Construction Trust Infrastructure language.

## Replacement Strategy

Do not patch scattered sentences in place first. The current `whitepaper.html` has a token-first structure, so the safer path is:

1. archive current `whitepaper.html`;
2. create a new v1.3 public-safe HTML draft from `docs/whitepaper-v1-3-public-draft.md`;
3. keep all regulated claims future, provider-reviewed, not-live, or review-required;
4. run wording validators;
5. review manually;
6. publish only after publication gate GO.

## Proposed Public HTML Files

| File | Purpose | Status |
|---|---|---|
| `whitepaper.html` | current public v1.0 file | do not edit until GO |
| `whitepaper-v1-0-archive.html` | future archived v1.0 file | create only after GO |
| `whitepaper-v1-3-draft.html` | future local/public-safe draft | safe to create locally |
| `docs/whitepaper-v1-3-public-draft.md` | source copy for HTML | already created |

## New `whitepaper-v1-3-draft.html` Structure

1. Header: "GCSC Whitepaper v1.3 Draft"
2. Status banner: "Internal public-safe draft - not approved for publication"
3. Executive Summary
4. Construction Trust Problem
5. SmartContractor Product Layer
6. Verified Contractor Workflow
7. Milestones And Escrow-Ready Records
8. Partner-Powered Working Capital Readiness
9. Disputes, Evidence, And Peer Review
10. Reputation And Underwriting Data
11. AI Assistance Boundaries
12. Licensed Partner Model
13. Future Regulated Web3 Layer
14. FIO Protocol Roadmap
15. XPR/WebAuth/Metal/Metallicus Research Path
16. Value Mirror System
17. Security And Audit Trail
18. Roadmap
19. Review Gates
20. Risk Factors

## `index.html` Replacement Priorities

| Current Area | Safer v1.3 Direction |
|---|---|
| Meta description | Construction Trust Infrastructure for verified project records and future regulated Web3 settlement |
| Hero badge | Building construction trust infrastructure |
| Hero title | Trust infrastructure for construction workflows |
| Hero paragraph | verified project records, milestone evidence, partner-reviewed working capital, future regulated Web3 layer |
| Problem card "Our Solution" | escrow-ready milestone records, not blockchain escrow release |
| Product section | SmartContractor as construction workflow, not P2P blockchain escrow |
| Technology section | XPR/WebAuth as future infrastructure path, not every payment live on-chain |
| Vision CTA | reputation as underwriting data, not collateral |

## Must Remove Or Reframe

- direct "investment" token language;
- staking/yield/buyback/burn return language;
- automatic AI financial/legal control;
- public NFT ownership/upside;
- live blockchain escrow release;
- direct GCSC loan approval;
- token collateral;
- stablecoin settlement as live;
- guaranteed protection;
- public DAO control;
- Metallicus/FIO/XPR partnership implication.

## Required Validator

Create a future validator:

```text
construction-ai/scripts/validate-whitepaper-v1-3-public-html-plan.mjs
```

It should scan `whitepaper-v1-3-draft.html`, `whitepaper.html`, and `index.html` for blocked claims and require public files to keep not-live/provider-reviewed context.

## GO Condition

Only after publication gate GO:

1. copy `whitepaper.html` to `whitepaper-v1-0-archive.html`;
2. replace `whitepaper.html` with reviewed v1.3 public HTML;
3. update `index.html` safe wording;
4. run validators;
5. commit/push;
6. verify public URL.

## Current State

Current state remains NO-GO. Safe next step is to create `whitepaper-v1-3-draft.html` locally or a validator for public wording. Public replacement is blocked.
