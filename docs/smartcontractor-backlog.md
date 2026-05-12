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
| P0 | Invalid JSON guard | Codex | DONE | Malformed JSON requests return clear 400 responses with request_id and smoke-test coverage |
| P0 | Unknown API route guard | Codex | DONE | Missing `/api/*` routes return JSON 404 responses with request_id and smoke-test coverage |
| P0 | Auth plan | Codex + Founder | REVIEW | Magic link MVP recommendation documented for founder approval |
| P0 | Auth/RLS plan validator | Codex | DONE | `npm run check:auth-rls-plan` keeps Magic Link, identity binding, browser/backend key boundaries, owner policies, backend-only tables, founder approval gates, and strict-mode blockers aligned |
| P0 | Auth decision package | Codex + Founder | DONE | Endpoint, UI, docs, env placeholder, and checklist show Magic Link recommendation without enabling live Auth/RLS |
| P0 | Auth implementation scaffold | Codex | DONE | Magic Link endpoint, session-check endpoint, frontend auth panel, readiness status, and docs exist without exposing secrets or applying live RLS |
| P0 | Magic Link rate limit | Codex | DONE | Login email requests are rate-limited separately from chat/API traffic; live smoke test verifies repeated requests return 429 |
| P0 | Profile ownership binding | Codex + Founder | REVIEW | Backend binds profiles to Supabase auth user when token exists; SQL draft for auth_user_id column/index is ready but not applied live |
| P0 | Role ownership guards | Codex | DONE | Authenticated writes verify owned profile/homeowner/contractor IDs while anonymous demo mode remains available for local testing |
| P0 | Auth smoke-test harness | Codex | DONE | `npm run check:auth` verifies auth endpoints, feature flags, guard coverage, and supports optional real Supabase token wrong-owner tests |
| P0 | Strict route gate smoke test | Codex | DONE | `npm run check:strict-gates` verifies protected SmartContractor/admin/audit routes close without token and can optionally verify a real founder Magic Link token from local ENV |
| P0 | Supabase service-role boundary | Codex + Founder | REVIEW | Backend separates publishable Auth client from server-only service-role database client; real secret setup remains founder/deployment step |
| P0 | Admin role model | Codex + Founder | REVIEW | Live `admin_memberships` table exists; founder/admin user assignment still requires Magic Link Auth user selection |
| P0 | Admin enforcement scaffold | Codex | DONE | Draft/strict helper and `/api/admin/me` are ready; strict mode remains blocked until real admin user, service-role setup, and admin smoke tests |
| P0 | Founder Action Center | Codex | DONE | Admin workspace shows owner-only actions for accounts, secrets, legal review, payments, RLS, and deployment without exposing secrets |
| P0 | Founder Auth Setup | Codex | DONE | Read-only API/UI show Magic Link session, linked profile, active admin roles, admin membership table reachability, and exact next founder step before strict RLS |
| P0 | Founder admin activation runbook | Codex + Founder | REVIEW | Step-by-step local backend preflight, SQL, post-check, and rollback package is ready; live founder role insert still requires founder approval and real `auth_user_id` |
| P0 | RLS replacement | Codex + Founder | REVIEW | Strict replacement SQL and review report prepared locally; founder approval required before live Supabase apply |
| P0 | RLS draft preflight validator | Codex | DONE | `npm run check:rls-draft` verifies strict RLS SQL has required owner policies, no `true` policies, no anon grants, backend-only tables closed, and no secret placeholders |
| P1 | Loan repayment endpoint | Codex | DONE | Milestone payment can create repayment record |
| P1 | Token collateral fields | Codex | DONE | Contractor loan can store token collateral estimate |
| P1 | Audit/event log | Codex | DONE | Important actions are recorded |
| P1 | Multi-provider payment router | Codex | DONE | Metal Pay, XPR, Stripe, PayPal, Coinbase, BTCPay options are exposed through one API |
| P1 | Payment intent ownership model | Codex + Founder | REVIEW | Typed ownership SQL draft prepared so payment rows can be safely shown through strict RLS |
| P1 | Payment ownership draft validator | Codex | DONE | `npm run check:payment-ownership` verifies typed payment ownership columns, indexes, participant policy, no anon grants, and no browser insert/update policies |
| P1 | Metal Pay Connect signature endpoint | Codex | DONE | Backend can generate HMAC signature when Metal Pay keys are configured |
| P1 | Project contract entity | Codex | DONE | Accepted bid can become a central project contract |
| P1 | Milestone entity | Codex | DONE | Project contract can hold milestone payment/work states |
| P1 | Payment webhook skeletons | Codex | DONE | Provider webhooks can update payment intent status and audit ledger |
| P1 | Verification provider abstraction | Codex | DONE | Identity, business, license, insurance, wallet, and bank checks are provider-agnostic |
| P1 | Admin / Risk Console MVP | Codex | DONE | Founder can see pending loans, disputes, payment exceptions, verification checks, collateral review, provider setup, and recent audit events |
| P1 | Admin Console review workflow | Codex | DONE | Admin queue supports filters, click-to-review details, inferred review status, and local draft decision notes without executing real approvals |
| P1 | Production Readiness Gate | Codex | DONE | Endpoint and UI show demo/public/real-money launch readiness, missing config, review items, and blocked legal/payment/auth steps without exposing secrets |
| P1 | Baseline security headers | Codex | DONE | Backend sets content-type, frame, referrer, and browser permission headers; static and live smoke checks verify them without breaking the MVP app shell |
| P1 | Request traceability | Codex | DONE | Backend sets or echoes safe `X-Request-Id`, stores it in audit events, and smoke tests verify the response header |

## NEXT: Product Documents

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Target architecture | Codex | DONE | Architecture map defines modules that prevent future rewrites |
| P0 | Target architecture validator | Codex | DONE | `npm run check:target-architecture` keeps the module map, build order, database/API groups, safety boundaries, and engineering state from drifting |
| P0 | Active project context | Codex | DONE | `docs/gcsc-active-context.md` preserves the project red line before context compression or new sessions |
| P0 | Nonstop execution hook | Codex | DONE | App heartbeat `gcsc-nonstop-next-task-hook` is active at 1 minute and `docs/codex-nonstop-execution-hook.md` defines the no-stop loop |
| P0 | Overnight autonomous worker | Codex | DONE | Cron automation `gcsc-hourly-autonomous-builder` runs hourly against `C:\gcsc` as a standalone safe scoped worker |
| P0 | Nonstop hook validator | Codex | DONE | `npm run check:nonstop-hook` verifies the no-stop rule stays linked in active context and backlog |
| P0 | Automation health validator | Codex | DONE | `npm run check:automation-health` verifies real Codex automation TOML files are active, readable, scheduled, pointed at the current thread/workspace, and free of secret-looking values |
| P0 | Claude Code global nonstop prompt | Codex | DONE | Reusable `~/.claude` global setup prompt is documented and validated without touching secrets or external accounts |
| P0 | Autonomous status note validator | Codex | DONE | `npm run check:autonomous-status` verifies hourly worker blocked notes include time, automation id, founder action step, and no secret-looking values |
| P0 | Founder action boundary validator | Codex | DONE | `npm run check:founder-boundaries` verifies founder-only steps stay blocked/reviewed and live-risk boundaries remain documented |
| P0 | Founder action queue | Codex | DONE | `npm run check:founder-action-queue` validates the exact founder-only next steps, safe report-back format, and stop conditions without secrets or live-risk changes |
| P0 | Founder admin activation runbook validator | Codex | DONE | `npm run check:founder-admin-runbook` verifies the founder activation runbook keeps approval gates, safe SQL template, rollback, and no secret-looking values |
| P0 | Real status audit validator | Codex | DONE | `npm run check:real-status-audit` verifies the honest readiness percentages, launch-level timeline, blockers, and ASCII-safe audit file stay preserved |
| P0 | Founder tonight checklist | Codex + Founder | DONE | Short step-by-step evening checklist guides backend start, Magic Link, Founder Auth Setup, and safe report-back without exposing secrets |
| P0 | Founder Auth troubleshooting | Codex + Founder | DONE | Symptom-by-symptom Magic Link/Auth Setup troubleshooting guide is validated and keeps secret/live-risk boundaries explicit |
| P0 | Founder Auth evidence template | Codex + Founder | DONE | Non-secret evidence template records Magic Link/session/profile/admin-role status before any live founder activation |
| P0 | Strict admin smoke checklist | Codex + Founder | DONE | Step-by-step local founder-admin smoke checklist is validated before strict RLS or public admin protection is treated as ready |
| P0 | Microsoft/Azure application | Codex + Founder | DONE | Application text and submission packet ready for founder submission |
| P0 | Microsoft/Azure application validator | Codex | DONE | `npm run check:microsoft-startups` keeps the application and submission packet aligned with Azure AI usage, SmartContractor progress, safety language, and no-secret boundaries |
| P0 | Updated whitepaper section | Codex | DONE | Loan, dispute, token collateral sections are clean |
| P0 | Whitepaper section validator | Codex | DONE | `npm run check:whitepaper-sections` keeps contractor credit, SmartContractor architecture, token collateral, AI boundaries, legal gates, and no price-guarantee language aligned |
| P1 | Founder one-pager | Codex | DONE | One-page summary for partners/investors |
| P1 | Founder one-pager validator | Codex | DONE | `npm run check:founder-one-pager` keeps the partner/investor one-pager aligned with MVP, stack, business model, safety gates, and no-secret boundaries |
| P1 | Demo script | Codex | DONE | 5-minute demo path written step-by-step |
| P1 | Demo script validator | Codex | DONE | `npm run check:demo-script` verifies the 5-minute walkthrough, safety notes, payment rails, dispute path, milestone repayment, and backlog/context links |
| P1 | Controlled user test plan | Codex | DONE | First homeowner, contractor, milestone/payment-intent, dispute/peer-review, and admin review scenarios are documented and validated without real-money actions |
| P1 | Beta issue log template | Codex | DONE | Controlled beta bugs can be captured with severity, request ID, live-risk category, and no secrets or real-money data |
| P1 | Beta tester invite | Codex | DONE | Founder has a demo-only tester invite and feedback script for the first 3-5 controlled beta users |
| P1 | Beta tester follow-up | Codex | DONE | Follow-up message and `npm run check:beta-tester-followup` collect demo-only tester feedback without secrets, sensitive data, or real-money commitments |
| P1 | Beta feedback synthesis | Codex | DONE | First tester feedback can be grouped into P0/P1 issues, trust blockers, product decisions, and founder/legal/provider gates without secrets |
| P1 | Beta readiness endpoint | Codex | DONE | `/api/admin/beta-readiness` summarizes controlled beta docs, tester scope, local checks, and blocked founder/live-risk gates without exposing secrets |
| P1 | Beta readiness UI | Codex | DONE | Admin workspace shows controlled beta readiness, first tester scope, document readiness, and founder/live-risk gates from `/api/admin/beta-readiness` |
| P1 | Beta readiness next-step UI | Codex | DONE | Admin workspace shows backend-provided `next_safe_steps` so the founder sees the safe follow-up path without guessing |
| P1 | Beta readiness document-status UI | Codex | DONE | Admin workspace shows backend-provided `required_docs` statuses so missing beta docs are visible without opening files manually |
| P1 | Beta session runbook | Codex | DONE | One-session controlled beta script and `npm run check:beta-session` keep tester agenda, evidence capture, stop conditions, and live-risk boundaries consistent |
| P1 | Beta session summary template | Codex | DONE | Post-session template and `npm run check:beta-session-summary` capture flow results, P0/P1 issues, trust blockers, and launch decisions without secrets |
| P1 | Beta decision log | Codex | DONE | Decision log and `npm run check:beta-decision-log` keep post-test decisions categorized as fix-now, public-beta, founder, legal, provider, or blocked without approving live-risk actions |
| P1 | Beta readiness document gate | Codex | DONE | `/api/admin/beta-readiness` now includes the session runbook, session summary, and decision log in required beta documents with smoke-test coverage |
| P1 | Beta readiness triage gate | Codex | DONE | `/api/admin/beta-readiness` now includes triage rubric, issue lifecycle, and go/no-go scorecard in required beta documents with smoke-test coverage |
| P1 | Beta readiness founder action gate | Codex | DONE | `/api/admin/beta-readiness` now includes the founder action queue document and next safe step with smoke-test and validator coverage |
| P1 | Public beta review packet | Codex | DONE | Founder-facing public beta review index and `npm run check:public-beta-review-packet` keep demo-safe scope, required docs, evidence, and go/no-go gates aligned |
| P1 | Beta triage rubric | Codex | DONE | Severity, trust category, evidence, and founder-only escalation rubric plus `npm run check:beta-triage-rubric` keep tester feedback actionable without live-risk approvals |
| P1 | Beta issue lifecycle | Codex | DONE | Issue status flow and `npm run check:beta-issue-lifecycle` keep beta feedback moving from new to verified without bypassing founder-only live-risk gates |
| P1 | Beta go/no-go scorecard | Codex | DONE | Founder scorecard and `npm run check:beta-go-no-go-scorecard` keep beta decisions tied to safe demo areas, automatic no-go conditions, and decision-log evidence |
| P1 | Beta evidence checklist | Codex | DONE | Controlled beta screenshots, recordings, request IDs, console/network notes, and mobile/PWA proof are captured without secrets or real-money data |
| P1 | Public launch runbook | Codex | DONE | Founder has a step-by-step strict Auth/RLS/deploy checklist for public beta preparation |
| P1 | Public launch runbook validator | Codex | DONE | `npm run check:public-launch-runbook` verifies founder-only setup, strict RLS review, deployment gates, public beta scope, and emergency rollback boundaries |
| P1 | Public beta handoff checklist | Codex | DONE | Founder can review safe beta scope, required documents, local checks, and the next deploy-account action without live changes |
| P1 | Public beta handoff checklist validator | Codex | DONE | `npm run check:public-beta-handoff` verifies safe beta scope, founder review packet, disabled real-money features, and deploy-account boundary |
| P1 | Legal/financial review checklist | Codex + Founder | REVIEW | Attorney/payment/lending questions are organized before real loans, escrow, or token collateral are enabled |
| P1 | Legal/financial review validator | Codex | DONE | `npm run check:legal-review` verifies attorney/payment/lending gates, disabled real-money scope, and no secret-looking values |
| P1 | AI agent workflow scaffold | Codex | DONE | `npm run check:ai-agent-workflows` verifies local agent recommendation contracts, workflow boundaries, audit requirements, and no autonomous money/legal actions |

## NEXT: Deployment

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Decide deploy platform | Founder | BLOCKED | Vercel/GitHub Pages/Supabase Edge/Azure selected |
| P0 | Connect deploy account | Founder | BLOCKED | Account connected without exposing password |
| P1 | Environment variables checklist | Codex | DONE | `.env.example` contains required non-secret keys, public site URL, CORS origins, and Auth redirect origins |
| P1 | Environment example validator | Codex | DONE | `npm run check:env-example` verifies required env keys, deploy/Auth redirect origins, draft defaults, placeholder secrets, and server-only warnings |
| P1 | Deploy platform decision brief | Codex | DONE | `npm run check:deploy-brief` verifies the founder-facing Vercel recommendation, safety boundaries, and acceptance criteria |
| P1 | Vercel preflight runbook | Codex | DONE | `npm run check:vercel-preflight` verifies founder-controlled Vercel import settings, demo-safe ENV list, and disabled real-money launch boundaries |
| P1 | Vercel environment matrix | Codex | DONE | `npm run check:vercel-env-matrix` verifies demo-safe ENV, founder-only secrets, disabled real-money features, and safe setup order |
| P1 | Vercel post-deploy checklist | Codex | DONE | `npm run check:vercel-postdeploy` verifies read-only deployed URL checks, security headers, request tracing, readiness endpoints, and founder-controlled Auth redirect steps |
| P1 | GitHub Actions build check | Codex | DONE | Push triggers basic validation |
| P1 | CI workflow validator | Codex | DONE | `npm run check:ci-workflow` verifies GitHub Actions runs `npm ci` and the full `npm run check` gate without secrets |
| P1 | Local QA smoke checks | Codex | DONE | `npm run check` validates backend syntax, frontend JS, PWA manifest, offline shell, and docs |
| P1 | Supabase missing FK indexes | Codex + Founder | DONE | Live migration `20260505033416 add_missing_fk_indexes` removed the two unindexed-FK advisor warnings |

## LATER: Blockchain And Smart Contracts

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | Project escrow contract design | Codex + Founder | REVIEW | Milestone lock/release/default states documented |
| P0 | Loan ledger contract design | Codex + Founder | REVIEW | Loan origination, repayment, default events documented |
| P1 | Token collateral lock design | Codex | REVIEW | LTV, oracle, margin, liquidation rules defined |
| P1 | Peer review reward hook | Codex | REVIEW | Reviewer reward and reputation events defined |
| P1 | Smart contract design docs validator | Codex | DONE | `npm run check:contract-docs` verifies escrow/loan/collateral/peer-review docs include legal safety gates and avoid risky guarantee language |

## LATER: Mobile Apps

| Priority | Item | Owner | Status | Acceptance Check |
|---------|------|-------|--------|------------------|
| P0 | PWA polish | Codex | DONE | Installable mobile app experience works |
| P1 | PWA QA checklist validator | Codex | DONE | `npm run check:pwa-qa` verifies the mobile QA checklist, manifest, service worker, offline page, and CI gate wiring |
| P1 | Mobile install readiness endpoint | Codex | DONE | `/api/admin/mobile-install-readiness` reports PWA install readiness, offline shell status, service-worker API cache boundary, and founder-controlled mobile release blockers |
| P1 | Capacitor config readiness | Codex | DONE | App id, app name, webDir, PWA entrypoint, and mobile docs are validated by npm run check:mobile |
| P1 | Mobile package-id drift guard | Codex | DONE | `npm run check:mobile` fails if mobile docs reintroduce the retired package id |
| P1 | Android wrapper preflight validator | Codex | DONE | `npm run check:android-preflight` verifies package-owner commands, Capacitor identity, safety gates, and public asset secret boundaries before native wrapper generation |
| P1 | Android QA runbook validator | Codex | DONE | `npm run check:android-qa` verifies local emulator QA boundaries, secret handling, and live-risk blocks before Android testing |
| P1 | Mobile release evidence bundle | Codex | DONE | Local evidence summary template defines checks, screenshots, offline proof, live-risk blockers, and founder next step before public/mobile release decisions |
| P1 | Mobile release evidence validator | Codex | DONE | `npm run check:mobile-release-evidence` verifies the evidence bundle keeps local-only scope, secret boundaries, blocked live-risk actions, and backlog/context links |
| P1 | Capacitor wrapper | Codex | LATER | Android shell builds locally |
| P1 | Android QA | Codex | LATER | Emulator test path completed |
| P1 | iOS preflight runbook | Codex | DONE | Local iPhone readiness, Apple-account blockers, command boundaries, and live-risk gates are documented without generating an iOS project |
| P1 | iOS preflight validator | Codex | DONE | `npm run check:ios-preflight` verifies Apple-account blockers, safe command boundaries, secret checks, and live-risk gates before iOS wrapper work |
| P2 | iOS plan | Founder + Codex | BLOCKED | Apple account/certificates available |

## Founder Action Queue

1. Decide deploy platform timing: Vercel is the recommended first public beta target, but account connection is founder-only.
2. Complete Supabase Auth founder login test with Magic Link and report only non-secret status.
3. Review and approve founder admin activation only after checking the prepared runbook and real Supabase Auth user id.
4. Review strict RLS replacement before any live Supabase apply.
5. Start attorney and provider review before real loans, escrow/payment handling, token collateral, or production payment providers.
6. Submit Microsoft/Azure startup application packet when ready.
