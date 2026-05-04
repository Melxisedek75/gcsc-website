# Microsoft For Startups Application Draft

Date: 2026-05-04

## Project Name

Global Construction Smart Contract (GCSC)

## Product Name

SmartContractor

## Website

```text
https://xprnet.org
```

Fallback while DNS/HTTPS finishes propagating:

```text
http://xprnet.org
```

## GitHub

```text
https://github.com/Melxisedek75/gcsc-website
```

## Business Email

```text
gcsc@xprnet.org
```

## One-Line Summary

GCSC is an AI and blockchain platform for the construction industry. Its first product, SmartContractor, helps homeowners and contractors manage verified bids, milestone payments, contractor working-capital loans, dispute evidence, peer review, and future XPR Network smart-contract settlement.

## Problem

The construction industry is a multi-trillion-dollar global market, but residential and small-business construction still has major trust and finance problems:

- homeowners often pay large upfront deposits before work is proven;
- unreliable contractors create fraud risk and project abandonment risk;
- serious small contractors lose jobs because customers do not trust the process;
- small contractors often lack working capital for materials and labor mobilization;
- license, insurance, identity, bid, payment, dispute, and evidence workflows are scattered across disconnected tools;
- construction workers and contractors have weak access to modern benefits, reputation, and long-term financial infrastructure.

## Solution

GCSC is building SmartContractor as a construction-specific marketplace, credit, payment, compliance, and dispute-resolution platform.

The MVP workflow:

1. A homeowner creates a job.
2. Contractors submit bids.
3. A selected bid becomes a project contract.
4. The project is divided into milestones.
5. The contractor may request working capital linked to the project.
6. Milestone payments can repay the contractor loan first.
7. Disputes collect photo, video, document, and note evidence.
8. Qualified peer contractors can review disputed work.
9. Important actions are written to an audit ledger.
10. Future settlement, rewards, collateral, membership, treasury, and governance events can connect to XPR Network smart contracts.

## Why Microsoft Azure / AI Credits Matter

Azure and AI credits would help GCSC move from MVP demo to pilot launch by supporting:

- secure backend APIs for homeowner, contractor, loan, payment, dispute, and verification workflows;
- Azure App Service or Azure Container Apps for backend deployment;
- Azure Database / Supabase-compatible production database planning;
- Azure Storage for future evidence files, documents, and generated reports;
- Azure AI / Azure OpenAI calls for contractor matching, compliance review, risk scoring, document generation, and multilingual onboarding;
- GitHub Actions deployment and testing pipelines;
- responsible AI evaluations for matching, risk scoring, and compliance automation;
- monitoring, security, and production readiness work.

## Current Progress

GCSC already has:

- domain: `xprnet.org`;
- business email: `gcsc@xprnet.org`;
- GitHub repository;
- public website foundation;
- whitepaper and tokenomics;
- XPR Network smart-contract architecture;
- local SmartContractor MVP frontend;
- Node/Express backend;
- Supabase database schema for profiles, homeowners, contractors, jobs, bids, loans, repayments, disputes, evidence, peer reviews, payment intents, payment events, verification checks, audit events, project contracts, milestones, and token collateral;
- multi-provider payment router design: XPR/WebAuth, Metal Pay Connect, Stripe, PayPal, Coinbase Commerce, BTCPay;
- payment webhook skeleton;
- verification provider abstraction;
- token collateral ledger;
- GitHub Actions CI;
- API validation;
- 5-minute demo script;
- Auth/RLS production plan drafted.

## Technical Stack

- Blockchain: XPR Network / Proton.
- Smart contracts: `proton-tsc`, TypeScript to WASM.
- Backend: Node.js, Express.
- Database/Auth target: Supabase Auth and Postgres RLS.
- Payments: XPR/WebAuth, Metal Pay Connect, Stripe, PayPal, Coinbase Commerce, BTCPay.
- AI roadmap: Contractor Matching Agent, Risk Assessment Agent, Compliance Agent, Treasury Agent, Real Estate Agent.
- Mobile roadmap: PWA first, then Android wrapper, then iOS when Apple account/certificates are ready.
- DevOps: GitHub Actions, future Azure deployment.

## AI Use Cases

GCSC plans to use AI for practical construction workflows:

- contractor-job matching based on trade, location, budget, schedule, and project scope;
- risk scoring for contractor working-capital requests;
- compliance checks for license, insurance, business identity, and document completeness;
- dispute evidence summarization from photos, video notes, documents, and peer-review inputs;
- homeowner and contractor onboarding in multiple languages;
- document generation for project summaries, milestone updates, and internal review packets;
- treasury and DAO workflow recommendations in later phases.

## Impact

GCSC targets real-world construction problems, not only crypto-native speculation.

The goal is to help:

- homeowners reduce upfront deposit risk;
- contractors prove seriousness and access project-linked working capital;
- workers and contractors build reputation and financial history;
- peer reviewers earn rewards for objective quality review;
- DAOs manage treasury, insurance, and real estate participation transparently;
- the XPR ecosystem demonstrate practical business usage.

## Requested Support

GCSC is requesting startup cloud and AI credits to accelerate development, testing, deployment, and responsible AI implementation for the SmartContractor pilot launch.

The most useful support now:

- Azure cloud credits;
- Azure AI / Azure OpenAI access;
- startup technical guidance;
- security and production architecture guidance;
- help preparing a scalable backend and AI agent infrastructure.

## Short Founder Note

I am building GCSC to connect blockchain, AI, and the real construction economy. The project already has a domain, business email, GitHub repository, whitepaper, smart-contract architecture, local backend, SmartContractor MVP, database schema, payment architecture, and a clear roadmap. Startup credits would directly help me finish the backend, improve the frontend, deploy reliable infrastructure, and build AI agents that solve real operational problems in construction.

## Responsible Launch Note

SmartContractor is currently an MVP and technical demo. Real lending, production payment flows, identity document handling, and public launch require additional legal review, stricter Supabase RLS policies, secure provider credentials, privacy policy, and production monitoring.

