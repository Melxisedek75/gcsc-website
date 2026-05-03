# SmartContractor Product Map

## Что найдено в проекте

SmartContractor уже присутствует в проекте как продуктовая линия GCSC.

Текущие найденные слои:

1. `C:\gcsc\index.html`
   - Публичный сайт на `xprnet.org`.
   - Есть секция `SMART-CONTRACTOR`.
   - Есть UI для WebAuth wallet.
   - Есть кнопки `Connect WebAuth`, `Create Account`, `Mint Contractor Pass`, `Mint Homeowner Pass`.
   - Есть презентация Contractor DAO и Homeowner App.

2. `C:\gcsc\construction-ai`
   - Node.js/Express backend для GCSC BuilderAI.
   - Есть API:
     - `POST /api/chat`
     - `POST /api/quick`
     - `GET /api/suggestions`
     - `POST /api/slack/events`
     - `POST /api/webhook`
     - `GET /api/health`
   - Есть knowledge base по строительству, документам, contractors, homeowners, liens, agreements, risk.

3. `C:\gcsc\_collected\gcsc-agent-kit`
   - Архитектура AI agents:
     - CMA — Contractor Matching Agent
     - RAA — Risk Assessment Agent
     - CA — Compliance Agent
     - TA — Treasury Agent
     - REA — Real Estate Agent
   - Описаны scoring rules, escrow rules, KYC/compliance rules, Telegram commands, API endpoints.

4. `C:\gcsc\contracts`
   - Smart contract layer для token, membership, staking, treasury, real estate, insurance, governance, bounty, lottery.

## Что уже похоже на работающий продукт

- Публичный домен `xprnet.org`.
- Landing page с SmartContractor позиционированием.
- WebAuth connect flow на frontend.
- AI assistant backend для contractor/homeowner вопросов.
- Agent rules для matching/risk/compliance/treasury.
- Smart contract modules для GCSC ecosystem.

## Чего пока не хватает для настоящего MVP marketplace

Чтобы SmartContractor стал рабочей платформой, нужны эти модули:

1. Authentication / registration
   - Email registration.
   - User role: `contractor` или `homeowner`.
   - XPR/WebAuth account binding.
   - User profile stored in backend database.

2. Contractor profile
   - Business name.
   - License number/state.
   - Insurance info.
   - Trades/services.
   - Service area.
   - Rating/reputation.
   - Wallet/account.

3. Homeowner profile
   - Name/email.
   - Property location.
   - Preferred communication.
   - Wallet/account.

4. Project/job posting
   - Homeowner creates job.
   - Job title, category, address/city/state, description, budget, photos, timeline.
   - AI parses job and suggests category/risk.

5. Bid system
   - Contractors submit bids.
   - Bid fields: amount, timeline, scope, exclusions, warranty, payment milestones.
   - Homeowner sees own project bids.
   - Competitor bid visibility can be paid/unlocked.

6. Lead/payment system
   - Lead Token or XPR payment for access.
   - Integration with `mppx-xpr-network`.
   - Receipt and unlock state.

7. Matching
   - CMA ranks contractors by skills, location, rating, response time, completion, price.
   - Top matches shown to homeowner.

8. Compliance
   - CA verifies license/insurance/KYC.
   - Initially can be manual or semi-automated.
   - Later integrate government APIs.

9. Escrow/milestones
   - Homeowner funds project.
   - Milestones: 20/30/30/20.
   - RAA risk score and homeowner confirmation before release.

10. Admin/testing dashboard
   - View users.
   - View jobs.
   - View bids.
   - Manually approve/deny contractors.
   - Simulate XPR/WebAuth actions on testnet.

11. Contractor working capital loans
   - Contractor can request a small business loan through SmartContractor.
   - Loan eligibility depends on platform history, verified business identity, UBI/EIN where applicable, license/compliance status, completed jobs, rating, dispute history, and repayment history.
   - Starter loan limit should be conservative: about $3,500-$4,000 until the contractor builds platform history.
   - Contractor uses the loan to buy materials and start work without asking the homeowner for a risky upfront deposit.
   - Homeowner pays through platform milestones only after visible/approved work progress.
   - Contractor repays the platform loan from homeowner milestone payments.
   - This reduces homeowner risk and makes contractor seriousness measurable.
   - Legal structure should use business loan agreement, security agreement, payout assignment, fraud/no-bad-intent certification, and optional UCC filing after attorney review.
   - Do not describe the unpaid loan as automatic GCSC ownership of the contractor company; describe it as repayment rights and secured interest in defined collateral where legally allowed.
   - Future token collateral layer: contractors can use eligible GCSC/GCSCBUILD holdings as additional collateral for larger loans, subject to conservative LTV, custody, volatility, and legal compliance rules.
   - Do not promise token price growth; describe token collateral only as eligible collateral if market value and liquidity exist.
   - RAA calculates credit/risk score.
   - CA verifies business/license/compliance before loan approval.
   - TA manages loan pool, repayment, delinquency, and treasury reporting.

12. Contractor peer dispute review
   - If homeowner and contractor disagree about work quality, SmartContractor opens a structured dispute case.
   - Disputed milestone can be paused while evidence is collected.
   - Evidence can include photos, videos, documents, receipts, contract scope, change orders, and notes.
   - Qualified peer contractors can review disputed work remotely by photo/video or perform onsite inspection.
   - Peer reviewers submit quality score, finding, and recommended resolution.
   - Honest reviewers earn GCSC/GCSCBUILD rewards, rating points, inspection reputation, and better future loan eligibility.
   - Review quality and bias must be tracked so bad reviewers lose review privileges.
   - This creates a construction-specific trust layer that Upwork does not have for physical work.

## MVP sequence

### Phase 1 — Local clickable MVP

Goal: test user flow without real money.

- Build `/app` interface.
- Roles: contractor / homeowner.
- Local database or JSON/SQLite.
- Create project.
- Submit bid.
- Show bids.
- Unlock competitor bid as simulated paid feature.
- Basic AI match score.

### Phase 2 — Real backend MVP

Goal: deploy working backend.

- Express/Node API.
- SQLite/Postgres.
- Authentication.
- User profiles.
- Project and bid APIs.
- AI assistant integration from `construction-ai`.

### Phase 3 — XPR/WebAuth integration

Goal: connect real wallet/account flows.

- WebAuth account binding.
- XPR testnet transaction hooks.
- Membership NFT/pass simulation first, then real smart contract calls.

### Phase 4 — Smart contracts

Goal: move critical state on-chain.

- Membership/pass contract.
- Project escrow contract.
- Bid registry or bid hash registry.
- Lead unlock payment logic.
- Treasury/dispute hooks.
- Contractor loan contract or loan ledger hook.
- Repayment routing from milestone payments.
- Dispute escrow pause/release hook.
- Peer review reward and reputation hook.

### Phase 5 — Contractor credit layer

Goal: make SmartContractor a financing rail for serious contractors.

- Contractor score based on:
  - verified EIN/business identity;
  - platform job history;
  - homeowner ratings;
  - completed milestones;
  - dispute rate;
  - repayment history;
  - license/insurance status;
  - response time;
  - bid accuracy.
- Small starter loans for new verified contractors.
- Starter loan ceiling around $3,500-$4,000 until the contractor proves repayment behavior.
- Larger loans only after successful platform history.
- Homeowner deposit risk reduced because contractor finances material/startup costs through platform credit.
- Loan repayment automatically suggested or routed from milestone payments.
- Legal controls: business-purpose certification, no-fraud certification, platform payout assignment, security agreement, UCC filing where appropriate, and attorney-reviewed default remedies.
- Token collateral controls: conservative LTV, collateral lock, price/oracle checks, margin warning, liquidation/partial repayment rules, and no promise of token price appreciation.

## Recommended next technical step

Create a separate app folder:

```text
C:\gcsc\smartcontractor-app
```

Start with a local MVP:

- frontend: React/Vite or plain HTML if we need ultra-simple;
- backend: Express;
- database: SQLite;
- first flows:
  - register as homeowner;
  - register as contractor;
  - create project;
  - submit bid;
  - paid unlock simulation;
  - AI match score.

This avoids breaking the public landing page while we build the real product behind it.
