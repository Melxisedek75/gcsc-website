# SmartContractor Backlog

Date: 2026-05-03

Status legend:

- `NOW` - work this week.
- `NEXT` - prepare after current MVP flow.
- `REVIEW` - prepared by Codex, waiting for founder approval before live/external change.
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
| P0 | API validation | Codex | DONE | Bad requests return clear 400 errors |
| P0 | Auth plan | Codex + Founder | REVIEW | Magic link MVP recommendation documented for founder approval |
| P0 | RLS replacement | Codex | REVIEW | Local production RLS draft prepared; not applied to live Supabase yet |
| P1 | Loan repayment endpoint | Codex | DONE | Milestone payment can create repayment record |
| P1 | Token collateral fields | Codex | DONE | Contractor loan can store token collateral estimate |
| P1 | Audit/event log | Codex | DONE | Important actions are recorded |
| P1 | Multi-provider payment router | Codex | DONE | Metal Pay, XPR, Stripe, PayPal, Coinbase, BTCPay options are exposed through one API |
| P1 | Metal Pay Connect signature endpoint | Codex | DONE | Backend can generate HMAC signature when Metal Pay keys are configured |
| P1 | Project contract entity | Codex | DONE | Accepted bid can become a central project contract |
| P1 | Milestone entity | Codex | DONE | Project contract can hold milestone payment/work states |
| P1 | Payment webhook skeletons | Codex | DONE | Provider webhooks can update payment intent status and audit ledger |
| P1 | Verification provider abstraction | Codex | DONE | Identity, business, license, insurance, wallet, and bank checks are provider-agnostic |
| P1 | Admin / Risk Console MVP | Codex | DONE | Founder can see pending loans, disputes, payment exceptions, verification checks, collateral review, provider setup, and recent audit events |
| P1 | Admin Console review workflow | Codex | DONE | Admin queue supports filters, click-to-review details, inferred review status, and local draft decision notes without executing real approvals |
| P1 | Production Readiness Gate | Codex | DONE | Endpoint and UI show demo/public/real-money launch readiness, missing config, review items, and blocked legal/payment/auth steps without exposing secrets |

## NEXT: Product Documents

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Target architecture | Codex | DONE | Architecture map defines modules that prevent future rewrites |
| P0 | Microsoft/Azure application | Codex + Founder | DONE | Application text and submission packet ready for founder submission |
| P0 | Updated whitepaper section | Codex | DONE | Loan, dispute, token collateral sections are clean |
| P1 | Founder one-pager | Codex | DONE | One-page summary for partners/investors |
| P1 | Demo script | Codex | DONE | 5-minute demo path written step-by-step |

## NEXT: Deployment

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Decide deploy platform | Founder | BLOCKED | Vercel/GitHub Pages/Supabase Edge/Azure selected |
| P0 | Connect deploy account | Founder | BLOCKED | Account connected without exposing password |
| P1 | Environment variables checklist | Codex | DONE | `.env.example` contains required non-secret keys |
| P1 | GitHub Actions build check | Codex | DONE | Push triggers basic validation |
| P1 | Local QA smoke checks | Codex | DONE | `npm run check` validates backend syntax, frontend JS, PWA manifest, offline shell, and docs |

## LATER: Blockchain And Smart Contracts

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Project escrow contract design | Codex + Founder | REVIEW | Milestone lock/release/default states documented |
| P0 | Loan ledger contract design | Codex + Founder | REVIEW | Loan origination, repayment, default events documented |
| P1 | Token collateral lock design | Codex | REVIEW | LTV, oracle, margin, liquidation rules defined |
| P1 | Peer review reward hook | Codex | REVIEW | Reviewer reward and reputation events defined |

## LATER: Mobile Apps

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | PWA polish | Codex | DONE | Installable mobile app experience works |
| P1 | Capacitor config readiness | Codex | DONE | App id, app name, webDir, PWA entrypoint, and mobile docs are validated by npm run check:mobile |
| P1 | Capacitor wrapper | Codex | LATER | Android shell builds locally |
| P1 | Android QA | Codex | LATER | Emulator test path completed |
| P2 | iOS plan | Founder + Codex | BLOCKED | Apple account/certificates available |

## Founder Action Queue

1. Decide whether to connect deploy service now or later.
2. Decide whether Supabase Auth should use password login or magic link.
3. Review legal language with attorney before real loans.
4. Approve when to use parallel agents.
5. Submit Microsoft/Azure startup application when document is ready.
