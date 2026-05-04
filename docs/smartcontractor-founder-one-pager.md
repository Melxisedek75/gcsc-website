# SmartContractor Founder One-Pager

Date: 2026-05-04

## One-Line Summary

SmartContractor is the product layer of GCSC: a construction marketplace and trust platform that combines verified contractors, open bidding, milestone payments, working-capital loans, dispute review, AI agents, and XPR Network smart-contract settlement rails.

## Problem

Homeowners and contractors still rely on fragile trust:

- homeowners often pay money upfront before work is proven;
- serious contractors lose jobs because customers fear fraud;
- small contractors struggle to fund materials and labor mobilization;
- bids, licenses, insurance, payments, disputes, and evidence are scattered across disconnected tools;
- quality disputes are usually emotional, slow, and hard to verify;
- construction workers and contractors have weak access to modern financial and benefit infrastructure.

## Product

SmartContractor creates one connected workflow:

1. Homeowner posts a construction job.
2. Contractors submit bids.
3. A selected bid becomes a project contract.
4. The job is split into milestones.
5. Contractor can request starter working capital tied to the project.
6. Homeowner pays by milestone after visible progress.
7. Milestone payment can repay the contractor loan first.
8. Disputes collect photo, video, document, and note evidence.
9. Qualified peer contractors or inspectors can review disputed work.
10. Important actions are written into an audit ledger and can later connect to smart contracts.

## Why It Matters

SmartContractor reduces the biggest trust gap in residential construction:

```text
homeowners should not have to risk large upfront deposits, and serious contractors should still have a way to start work.
```

The platform turns contractor seriousness into measurable signals:

- business identity;
- EIN / UBI / license / insurance;
- completed jobs;
- bid accuracy;
- repayment history;
- dispute history;
- peer-review contribution;
- token collateral where legally and technically supported.

## Current MVP Progress

Already implemented locally:

- GitHub repository and live website foundation;
- SmartContractor MVP page;
- backend API on Node/Express;
- Supabase database tables for profiles, homeowners, contractors, jobs, bids, loans, repayments, disputes, evidence, peer reviews, payments, verification, audit events, project contracts, milestones, and token collateral;
- multi-provider payment router design: XPR/WebAuth, Metal Pay Connect, Stripe, PayPal, Coinbase Commerce, BTCPay;
- payment webhook skeleton;
- verification provider abstraction;
- token collateral ledger;
- API validation;
- GitHub Actions CI;
- 5-minute demo script;
- Auth/RLS production plan drafted.

## Technology Stack

- Blockchain: XPR Network / Proton.
- Smart contracts: `proton-tsc`, TypeScript to WASM.
- Backend: Node.js, Express, Supabase.
- Database/Auth target: Supabase Auth and Postgres RLS.
- Payments: XPR/WebAuth, Metal Pay Connect, Stripe, PayPal, Coinbase Commerce, BTCPay.
- AI roadmap: Contractor Matching Agent, Risk Assessment Agent, Compliance Agent, Treasury Agent, Real Estate Agent.
- Mobile roadmap: PWA first, then Android wrapper, then iOS when Apple account/certificates are ready.

## Business Model

Potential revenue streams:

- lead token purchases;
- contractor and homeowner subscriptions;
- platform fees on milestone payments;
- working-capital loan interest or origination economics, subject to legal review;
- verification and premium profile services;
- dispute review or inspection coordination fees;
- token utility and DAO treasury flows where compliant.

## Differentiation

SmartContractor is not only a contractor directory and not only a crypto app.

It combines:

- construction-specific milestone workflow;
- contractor credit layer;
- payment readiness;
- peer dispute review;
- verification and compliance;
- audit ledger;
- blockchain settlement path;
- AI agents for matching, risk, compliance, treasury, and real estate.

## Responsible Launch Position

The MVP is ready for technical demo, but not yet for real lending or production payments.

Before public launch:

- approve Supabase Auth mode;
- replace demo/dev RLS policies;
- connect deployment service;
- configure provider keys server-side only;
- review loan language with an attorney;
- avoid real personal documents until verification provider, privacy policy, and storage rules are ready.

## Ask

GCSC is seeking cloud, AI, technical, and strategic support to move SmartContractor from MVP demo to pilot launch.

The most valuable support now:

- Azure/OpenAI or cloud startup credits;
- payment and verification provider access;
- legal review for contractor working-capital structure;
- pilot contractors and homeowners;
- technical help with mobile app packaging, security, and smart-contract deployment.

## Founder Note

GCSC is being built to connect blockchain, AI, and the real construction economy. The project already has a domain, business email, GitHub repository, whitepaper, smart-contract architecture, local backend, SmartContractor MVP, and a clear roadmap. The next goal is to turn the MVP into a secure pilot that helps homeowners reduce upfront payment risk and helps serious contractors access trusted project-based capital.
