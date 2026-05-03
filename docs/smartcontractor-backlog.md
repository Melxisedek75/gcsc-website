# SmartContractor Backlog

Date: 2026-05-03

Status legend:

- `NOW` - work this week.
- `NEXT` - prepare after current MVP flow.
- `LATER` - important but not blocking the first demo.
- `BLOCKED` - needs founder action, external account, legal review, or paid service.

## NOW: Clickable MVP

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Open Bids screen | Codex | DONE | Contractor can see active jobs from backend |
| P0 | Submit Bid flow | Codex | DONE | Contractor can submit bid and see confirmation |
| P0 | Starter Loan screen | Codex | DONE | Contractor can request $3,500-$4,000 starter loan |
| P0 | Loan scoring display | Codex | DONE | UI shows UBI/EIN/license/rating/repayment/dispute factors |
| P0 | Dispute Center screen | Codex | DONE | Homeowner can open a dispute for a job |
| P0 | Evidence upload simulation | Codex | DONE | User can attach photo/video/link/note metadata |
| P0 | Peer Review screen | Codex | DONE | Peer contractor can submit score and recommendation |
| P1 | Mobile responsive pass | Codex | DONE | MVP is usable on phone width |
| P1 | Demo seed data | Codex | DONE | One homeowner, contractor, job, bid, loan, dispute path can be tested |

## NEXT: Backend And Database Hardening

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | API validation | Codex | NEXT | Bad requests return clear 400 errors |
| P0 | Auth plan | Codex + Founder | NEXT | Decide Supabase Auth email/password vs magic link |
| P0 | RLS replacement | Codex | NEXT | Dev `true` policies replaced before public launch |
| P1 | Loan repayment endpoint | Codex | DONE | Milestone payment can create repayment record |
| P1 | Token collateral fields | Codex | NEXT | Contractor loan can store token collateral estimate |
| P1 | Audit/event log | Codex | NEXT | Important actions are recorded |
| P1 | Multi-provider payment router | Codex | DONE | Metal Pay, XPR, Stripe, PayPal, Coinbase, BTCPay options are exposed through one API |
| P1 | Metal Pay Connect signature endpoint | Codex | DONE | Backend can generate HMAC signature when Metal Pay keys are configured |

## NEXT: Product Documents

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Microsoft/Azure application | Codex + Founder | NEXT | Application text ready for submission |
| P0 | Updated whitepaper section | Codex | NEXT | Loan, dispute, token collateral sections are clean |
| P1 | Founder one-pager | Codex | NEXT | One-page summary for partners/investors |
| P1 | Demo script | Codex | NEXT | 5-minute demo path written step-by-step |

## NEXT: Deployment

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Decide deploy platform | Founder | BLOCKED | Vercel/GitHub Pages/Supabase Edge/Azure selected |
| P0 | Connect deploy account | Founder | BLOCKED | Account connected without exposing password |
| P1 | Environment variables checklist | Codex | NEXT | `.env.example` contains required non-secret keys |
| P1 | GitHub Actions build check | Codex | NEXT | Push triggers basic validation |

## LATER: Blockchain And Smart Contracts

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Project escrow contract design | Codex + Founder | LATER | Milestone lock/release/default states documented |
| P0 | Loan ledger contract design | Codex + Founder | LATER | Loan origination, repayment, default events documented |
| P1 | Token collateral lock design | Codex | LATER | LTV, oracle, margin, liquidation rules defined |
| P1 | Peer review reward hook | Codex | LATER | Reviewer reward and reputation events defined |

## LATER: Mobile Apps

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | PWA polish | Codex | LATER | Installable mobile app experience works |
| P1 | Capacitor wrapper | Codex | LATER | Android shell builds locally |
| P1 | Android QA | Codex | LATER | Emulator test path completed |
| P2 | iOS plan | Founder + Codex | BLOCKED | Apple account/certificates available |

## Founder Action Queue

1. Decide whether to connect deploy service now or later.
2. Decide whether Supabase Auth should use password login or magic link.
3. Review legal language with attorney before real loans.
4. Approve when to use parallel agents.
5. Submit Microsoft/Azure startup application when document is ready.
