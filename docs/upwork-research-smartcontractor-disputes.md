# Upwork Research: What SmartContractor Should Borrow

Date: 2026-05-03

## What Upwork Does Well

Upwork is not just a job board. Its real strength is trust infrastructure:

- two-sided marketplace: client posts work, freelancer sends proposal;
- profile reputation: ratings, history, badges, completed work;
- milestone payments and escrow;
- hourly work diary with screenshots/activity evidence;
- documented dispute process;
- platform-controlled payment release;
- stats dashboard for workers/freelancers;
- mobile apps for both sides.

Official Upwork material shows several important patterns:

- fixed-price projects use milestones and deposited funds before work starts;
- submitted work has a review window before funds are released;
- disputes rely heavily on documentation: scope, messages, delivery proof, screenshots, dates, version history;
- hourly disputes are checked against Work Diary evidence;
- reputation and badges affect trust, visibility, and earning power.

Sources:

- https://www.upwork.com/
- https://support.upwork.com/hc/en-us/articles/211062568-How-Upwork-protects-your-payments
- https://www.upwork.com/resources/upwork-dispute-process
- https://support.upwork.com/hc/en-us/articles/211068468-How-to-become-Top-Rated-on-Upwork
- https://support.upwork.com/hc/en-us/articles/211062968-How-to-use-your-Upwork-stats-and-trends

## Key Difference For GCSC

Upwork is built for digital freelance work.

SmartContractor is built for physical construction work.

This means GCSC can do something Upwork cannot do well:

```text
independent contractor peer review of real-world work quality
```

In construction, quality can often be inspected through:

- photos;
- videos;
- before/after evidence;
- permits;
- material receipts;
- inspection reports;
- onsite visit by another qualified contractor;
- city/state code references;
- trade-specific standards.

## Product Rule For SmartContractor

When there is a dispute between a homeowner and contractor, SmartContractor should not rely only on subjective feedback.

The platform should create a structured dispute case:

1. Homeowner or contractor opens a dispute.
2. Platform locks or pauses the disputed milestone.
3. Both sides upload evidence:
   - photos;
   - videos;
   - notes;
   - documents;
   - receipts;
   - contract scope;
   - change orders.
4. AI summarizes the dispute and checks the original scope.
5. Qualified peer contractors can apply to review the dispute.
6. Review can be:
   - remote review by photo/video;
   - onsite inspection.
7. Peer reviewers submit:
   - quality score;
   - finding;
   - recommended resolution;
   - whether onsite inspection is required.
8. Honest, useful peer reviewers earn:
   - GCSC/GCSCBUILD token rewards;
   - rating points;
   - inspection reputation;
   - better eligibility for larger contractor loans.
9. Bad or biased reviewers can lose reputation or review privileges.

## Why This Is Powerful

This creates a new trust economy inside construction:

- homeowners get protection when work is poor;
- good contractors are protected from unfair homeowner claims;
- experienced contractors earn tokens for professional inspection;
- peer review data improves contractor scoring;
- loan limits become tied to real platform behavior;
- the platform builds a construction-specific reputation graph.

## MVP Database Layer Added

Tables:

- `disputes`
- `dispute_evidence`
- `dispute_reviews`

Purpose:

- open dispute cases;
- store photo/video/document/note evidence links;
- allow peer contractors to review disputed work;
- store token reward, rating points, and loan score points.

## MVP API Layer Added

```http
GET /api/smartcontractor/disputes
POST /api/smartcontractor/disputes
POST /api/smartcontractor/disputes/:disputeId/evidence
POST /api/smartcontractor/disputes/:disputeId/reviews
```

## Future Smart Contract Layer

Later this can become on-chain:

- dispute opened -> milestone escrow paused;
- evidence hash stored on-chain;
- peer reviewer selected;
- review result signed;
- reward paid in GCSC/GCSCBUILD;
- reviewer reputation updated;
- contractor credit score updated;
- milestone released, partially refunded, or sent to rework.

## Recommended UI Screens

Add to SmartContractor:

- Dispute Center;
- Open Dispute modal;
- Evidence Upload;
- Peer Review Marketplace;
- Remote Review screen;
- Onsite Inspection request;
- Reviewer Earnings and Reputation dashboard.

