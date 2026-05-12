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
| P1 | Beta readiness document path UI | Codex | DONE | Admin workspace shows each required beta document path with its status so the founder can open the right file immediately |
| P1 | Beta readiness missing-doc summary | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace expose `document_summary` and `missing_docs` so blocked beta paperwork is obvious |
| P1 | Beta readiness validation commands | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the exact local validation commands before inviting testers |
| P1 | Beta readiness safe report-back template | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show a non-secret founder report-back template for Auth/beta readiness results |
| P1 | Beta readiness safe report fields | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the exact allowed non-secret values for founder Auth/beta status reports |
| P1 | Beta readiness go/no-go rules | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show automatic go/review/no-go conditions before founder invites testers |
| P1 | Beta readiness tester-day checklist | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the first tester-session checklist with safe evidence and issue logging boundaries |
| P1 | Beta readiness issue intake fields | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show required safe fields for tester issue reports without secrets or sensitive data |
| P1 | Beta readiness evidence retention policy | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe local retention and redaction rules for beta evidence before sharing |
| P1 | Beta readiness tester handoff packet | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the exact demo-safe files to give testers before a controlled beta session |
| P1 | Beta readiness session stop conditions | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show when to stop a tester session before secrets, real-money flows, Auth/admin ambiguity, or sensitive evidence leaks |
| P1 | Beta readiness post-session actions | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the exact safe follow-up actions after a tester session before public beta scope changes |
| P1 | Beta readiness public beta exit criteria | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the no-real-money public beta promotion criteria and blockers before launch scope changes |
| P1 | Beta readiness pre-invite checks | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the exact local checks required before sending controlled beta tester invites |
| P1 | Beta readiness invite message checklist | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show required tester invite language boundaries before founder sends controlled beta invites |
| P1 | Beta readiness tester consent checklist | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show demo-only consent boundaries before a controlled beta tester session begins |
| P1 | Beta readiness tester role briefing | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show demo-only role briefs for homeowner, contractor, peer reviewer, and founder/admin beta testers |
| P1 | Beta readiness tester success signals | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show what each controlled beta tester should be able to explain or report after the demo |
| P1 | Beta readiness tester failure signals | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show failure signals that should stop or rework a controlled beta session |
| P1 | Beta readiness tester redaction reminders | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show what must be redacted before beta screenshots or recordings are shared |
| P1 | Beta readiness tester artifact naming | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe filename rules for beta screenshots, recordings, and issue notes |
| P1 | Beta readiness tester artifact index | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show how beta screenshots, recordings, logs, request IDs, issue IDs, and redaction status should be indexed |
| P1 | Beta readiness tester artifact review queue | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show how beta artifacts move through redaction, founder review, internal approval, blocking, and archival |
| P1 | Beta readiness tester artifact export guard | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show when beta artifacts can or cannot leave local/founder review for public, partner, grant, or investor packets |
| P1 | Beta readiness tester artifact purge policy | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show when raw recordings, unredacted screenshots, and local logs must be deleted or retained only as redacted summaries |
| P1 | Beta readiness tester artifact retention clock | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the 24-hour review/purge window for raw tester artifacts and how retained redacted evidence stays tied to issue and decision records |
| P1 | Beta readiness tester artifact disposal ledger | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe disposal ledger fields proving purge/retention decisions without preserving sensitive artifact contents |
| P1 | Beta readiness tester artifact access roles | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show who may review raw local artifacts, redacted summaries, and approved partner/grant evidence |
| P1 | Beta readiness tester artifact chain of custody | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show who captured, reviewed, redacted, approved, exported, purged, or retained each beta artifact before sharing |
| P1 | Beta readiness tester artifact public summary rules | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show what beta evidence can be summarized publicly without sharing raw or sensitive artifact contents |
| P1 | Beta readiness tester artifact anonymization checklist | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show what must be removed or blurred before beta evidence can be summarized or shared |
| P1 | Beta readiness tester artifact approval stamp | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show approval metadata required before any beta artifact leaves local founder/admin review |
| P1 | Beta readiness tester artifact revocation rules | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show when and how to revoke a beta artifact approval after sensitive or incorrect sharing risk is found |
| P1 | Beta readiness tester artifact external packet manifest | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show manifest fields for every artifact, summary, screenshot, quote, metric, and issue reference included in an outside packet |
| P1 | Beta readiness tester artifact external packet distribution log | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe non-contact distribution log rules for approved public, partner, grant, or investor packets |
| P1 | Beta readiness tester artifact external packet recall checklist | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe recall steps when shared packet evidence is revoked or corrected |
| P1 | Beta readiness tester artifact external packet correction notice | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe correction notice fields when already-shared packets are updated |
| P1 | Beta readiness tester artifact external packet version history | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe version history states for external packets without raw tester evidence |
| P1 | Beta readiness tester artifact external packet claim review | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe claim-review rules before public, partner, grant, or investor packets are shared |
| P1 | Beta readiness tester artifact external packet audience review | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe audience labels and sharing rules for public, partner, grant, investor, provider, and legal packets |
| P1 | Beta readiness tester artifact external packet recipient acknowledgement | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe non-contact acknowledgement metadata for external packet follow-up without storing private recipient details |
| P1 | Beta readiness tester artifact external packet follow-up queue | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe follow-up task categories after external packet sharing without secrets, contacts, or live-risk actions |
| P1 | Beta readiness tester artifact external packet follow-up closure rules | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe closure states for external packet follow-up without secrets, contact details, or live-risk approvals |
| P1 | Beta readiness tester artifact external packet follow-up escalation rules | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show when external packet follow-up must escalate to founder, legal, provider, product, technical, grant, investor, or blocked review |
| P1 | Beta readiness tester artifact external packet follow-up SLA policy | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe owner, due-window, severity, and escalation timing for external packet follow-up without creating legal or payment obligations |
| P1 | Beta readiness tester artifact external packet follow-up decision summary | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe closed/escalated follow-up summary fields without private recipient details, raw artifacts, or live-risk promises |
| P1 | Beta readiness tester artifact external packet follow-up owner handoff | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show safe owner-transfer fields for external packet follow-up without assigning secrets, live payments, legal advice, or production authority to autonomous Codex |
| P1 | Beta readiness founder review packet | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the core review packet documents the founder should open before tester invites |
| P1 | Beta readiness founder-present tasks | Codex | DONE | `/api/admin/beta-readiness` and Admin workspace show the founder-only actions that can be done when the founder is at the computer, without exposing secrets |
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
| P1 | Public beta environment report template | Codex | DONE | `npm run check:public-beta-env-report` validates safe founder report-back for public beta ENV, Auth redirect, request IDs, server-only service-role key, and disabled real-money features |
| P1 | Public beta smoke commands | Codex | DONE | `npm run check:public-beta-smoke-commands` validates read-only public URL smoke checks for home page, readiness APIs, request IDs, security headers, and disabled real-money gates |
| P1 | Public beta rollback drill | Codex | DONE | `npm run check:public-beta-rollback-drill` validates safe rollback trigger conditions, founder-controlled rollback paths, read-only verification, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta incident response | Codex | DONE | `npm run check:public-beta-incident-response` validates severity levels, first-15-minute response, safe evidence, founder/legal/provider escalation rules, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta support queue | Codex | DONE | `npm run check:public-beta-support-queue` validates safe support intake fields, routing rules, response templates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta support SLA | Codex | DONE | `npm run check:public-beta-support-sla` validates response windows, escalation rules, closure rules, founder-present actions, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta known issues | Codex | DONE | `npm run check:public-beta-known-issues` validates known beta limitations, issue states, tester-facing language, founder-only follow-up, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta tester quickstart | Codex | DONE | `npm run check:public-beta-tester-quickstart` validates role-based tester steps, allowed report fields, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta founder dashboard checklist | Codex | DONE | `npm run check:public-beta-founder-dashboard` validates daily dashboard checks, readiness/support review, stop conditions, founder-only actions, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta daily status template | Codex | DONE | `npm run check:public-beta-daily-status` validates daily readiness, support, risk, founder decision, safe next-action, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta weekly closeout | Codex | DONE | `npm run check:public-beta-weekly-closeout` validates weekly beta closeout, tester/support/consent/privacy summaries, go/no-go decision options, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta metrics snapshot | Codex | DONE | `npm run check:public-beta-metrics-snapshot` validates safe aggregate beta metrics for jobs, bids, loans, milestones, disputes, peer reviews, support, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch readiness | Codex | DONE | `npm run check:public-beta-launch-readiness` validates one founder launch-readiness snapshot for public beta URL, checks, support, known issues, Auth/deploy review, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta tester cohort | Codex | DONE | `npm run check:public-beta-tester-cohort` validates safe tester-code cohort tracking, role coverage, invite/consent/privacy/session/support statuses, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta invite batch tracker | Codex | DONE | `npm run check:public-beta-invite-batches` validates safe public beta invite waves, batch codes, role mix, support/known-issue gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta session schedule | Codex | DONE | `npm run check:public-beta-session-schedule` validates safe beta session codes, time windows, role tests, consent/privacy gates, no meeting links, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta session moderator checklist | Codex | DONE | `npm run check:public-beta-session-moderator` validates safe moderator opening, role prompts, evidence rules, stop conditions, no meeting links, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta session postmortem | Codex | DONE | `npm run check:public-beta-session-postmortem` validates safe after-session outcome capture, trust blockers, issue IDs, next actions, no raw evidence, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta issue escalation matrix | Codex | DONE | `npm run check:public-beta-issue-escalation` validates safe P0-P3 issue routing to product fix, technical fix, founder review, legal review, provider review, or blocked without SQL, secrets, raw evidence, or live-risk actions |
| P1 | Public beta issue closure rules | Codex | DONE | `npm run check:public-beta-issue-closure` validates safe closure states, verification evidence, do-not-close gates, founder/legal/provider/blocked routing, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta regression checklist | Codex | DONE | `npm run check:public-beta-regression-checklist` validates demo-only retest paths for homeowner, contractor, peer reviewer, founder/admin, issue linkage, support/known-issue/status/scorecard updates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta QA signoff | Codex | DONE | `npm run check:public-beta-qa-signoff` validates demo-only QA signoff inputs, role coverage, issue gates, no-go conditions, support/known-issue/status/scorecard evidence, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch decision record | Codex | DONE | `npm run check:public-beta-launch-decision-record` validates founder Go/Review/No-Go decision inputs, automatic No-Go gates, safe evidence, public beta URL status, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch day checklist | Codex | DONE | `npm run check:public-beta-launch-day-checklist` validates demo-only launch-day order, founder preflight, smoke checks, support/known-issue/status/scorecard monitoring, rollback/incident readiness, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch status board | Codex | DONE | `npm run check:public-beta-launch-status-board` validates demo-only launch status states, required rows, cadence, founder decision rules, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch day recap | Codex | DONE | `npm run check:public-beta-launch-day-recap` validates safe end-of-day outcome, issue, and decision summaries for demo-only launch day without SQL, secrets, raw evidence, or live-risk actions |
| P1 | Public beta next-day follow-up | Codex | DONE | `npm run check:public-beta-next-day-followup` validates demo-only next-day support review, issue routing, tester follow-up, recap/status/known-issue updates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-two checkpoint | Codex | DONE | `npm run check:public-beta-day-two-checkpoint` validates demo-only day-two decision states, expansion gates, support/privacy/consent/data request readiness, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-three review | Codex | DONE | `npm run check:public-beta-day-three-review` validates demo-only day-three continue/expand/pause/shrink/founder-review decisions, support/QA/privacy/data gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-four stabilization | Codex | DONE | `npm run check:public-beta-day-four-stabilization` validates demo-only day-four stabilization, issue aging, support load, tester expansion hold/reduce rules, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-five monitoring | Codex | DONE | `npm run check:public-beta-day-five-monitoring` validates demo-only monitoring cadence, thresholds, support load, known issues, privacy/data request checks, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-six decision | Codex | DONE | `npm run check:public-beta-day-six-decision` validates demo-only decision options, automatic no-go gates, support SLA, privacy/data request checks, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta day-seven readiness | Codex | DONE | `npm run check:public-beta-day-seven-readiness` validates demo-only first-week readiness, weekly closeout inputs, support/known-issue/metrics review, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-one decision | Codex | DONE | `npm run check:public-beta-week-one-decision` validates demo-only week-one decision options, support/SLA/known-issue/metrics review, privacy/consent/data request gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two plan | Codex | DONE | `npm run check:public-beta-week-two-plan` validates demo-only week-two scope, support/SLA/known-issue/metrics review, privacy/consent/data request gates, safe evidence cleanup, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two kickoff | Codex | DONE | `npm run check:public-beta-week-two-kickoff` validates demo-only kickoff order, support/SLA/known-issue/metrics review, privacy/consent/data request readiness, safe evidence cleanup, automatic stop gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two day-one status | Codex | DONE | `npm run check:public-beta-week-two-day-one-status` validates demo-only day-one reporting, support/SLA/known-issue/metrics review, tester scheduling, privacy/consent/data request readiness, safe evidence cleanup, automatic stop gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two day-two checkpoint | Codex | DONE | `npm run check:public-beta-week-two-day-two-checkpoint` validates demo-only day-two decisions, day-one carryover review, support/SLA/known-issue/metrics review, tester scheduling, privacy/consent/data request readiness, safe evidence cleanup, automatic stop gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two day-three review | Codex | DONE | `npm run check:public-beta-week-two-day-three-review` validates demo-only day-three decisions, day-one/day-two carryover review, support/SLA/known-issue/metrics review, tester scheduling, privacy/consent/data request readiness, safe evidence cleanup, automatic stop gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta week-two day-four stabilization | Codex | DONE | `npm run check:public-beta-week-two-day-four-stabilization` validates demo-only day-four stabilization, day-one/day-two/day-three carryover review, support/SLA/known-issue/metrics review, tester confusion patterns, privacy/consent/data request readiness, safe evidence cleanup, automatic stop gates, founder/legal/provider gates, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta launch message | Codex | DONE | `npm run check:public-beta-launch-message` validates tester invite language, demo-only scope, report fields, no SQL, no secrets, no investment advice, no loan approval, and disabled real-money gates |
| P1 | Public beta tester FAQ | Codex | DONE | `npm run check:public-beta-tester-faq` validates tester-facing FAQ language, demo-only scope, allowed report fields, no SQL, no secrets, no investment advice, no loan approval, and disabled real-money gates |
| P1 | Public beta consent acknowledgement | Codex | DONE | `npm run check:public-beta-consent-ack` validates plain-English tester consent boundaries, demo-only scope, safe record fields, no SQL, no secrets, legal/provider review gates, and disabled real-money gates |
| P1 | Public beta privacy notice | Codex | DONE | `npm run check:public-beta-privacy-notice` validates tester privacy notice language, demo-only scope, safe feedback fields, evidence handling, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta consent withdrawal request | Codex | DONE | `npm run check:public-beta-consent-withdrawal` validates tester consent withdrawal handling, related consent/privacy/data request routing, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta re-invite checklist | Codex | DONE | `npm run check:public-beta-reinvite-checklist` validates safe tester re-invite gating after previous sessions, known issues, consent/privacy/data requests, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta data deletion request | Codex | DONE | `npm run check:public-beta-data-deletion` validates the tester deletion request template, safe request fields, 24-hour review/purge window, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta data export request | Codex | DONE | `npm run check:public-beta-data-export` validates the tester export summary template, safe export fields, redacted summaries, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta data correction request | Codex | DONE | `npm run check:public-beta-data-correction` validates safe correction fields, redacted summaries, old/corrected values, no SQL, no secrets, and disabled real-money gates |
| P1 | Public beta use restriction request | Codex | DONE | `npm run check:public-beta-use-restriction` validates tester restrictions for public, partner, grant, investor, and provider packets without SQL, secrets, or live-risk actions |
| P1 | Public beta terms summary | Codex | DONE | `npm run check:public-beta-terms-summary` validates plain-English beta terms, tester responsibilities, no investment/legal/loan promises, privacy boundaries, and disabled real-money gates |
| P1 | Public beta tester offboarding | Codex | DONE | `npm run check:public-beta-offboarding` validates tester offboarding, support queue closure, evidence cleanup, Magic Link notes, no SQL, no secrets, and disabled real-money gates |
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
| P1 | Android README drift guard | Codex | DONE | `npm run check:android-preflight` now blocks stale Android README instructions that reinitialize Capacitor or point away from `C:\gcsc\construction-ai` |
| P1 | Android Capacitor dependency readiness | Codex | DONE | `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android` are installed in `C:\gcsc\construction-ai`, and `npm run check:android-preflight` blocks wrapper generation if they drift out |
| P1 | Android wrapper generation validator | Codex | DONE | Native Android wrapper exists under `C:\gcsc\construction-ai\android`, bundles SmartContractor PWA assets, keeps `com.gcsc.smartcontractor`, and is validated by `npm run check:android-wrapper` |
| P1 | Android toolchain preflight validator | Codex | DONE | `npm run check:android-toolchain-preflight` documents and validates local Java, `JAVA_HOME`, `ANDROID_HOME`, Android SDK, and debug-build safety boundaries before APK work |
| P1 | Founder Android setup checklist | Codex | DONE | `npm run check:founder-android-setup` validates a step-by-step founder checklist for JDK 17, Android Studio, `JAVA_HOME`, `ANDROID_HOME`, and local debug-build report-back without secrets |
| P1 | Android debug build evidence | Codex | DONE | `npm run check:android-debug-build-evidence` validates a safe Blocked/Passed/Failed evidence template for local `gradlew.bat assembleDebug` attempts and APK proof without secrets or Play Console work |
| P1 | Android emulator smoke evidence | Codex | DONE | `npm run check:android-emulator-smoke-evidence` validates safe local emulator/phone QA evidence for `adb devices`, `adb install`, app launch, offline shell, and demo-only WebAuth boundaries |
| P1 | Android physical device smoke checklist | Codex | DONE | `npm run check:android-device-smoke-checklist` validates safe physical Android phone QA steps for USB debugging, `adb devices`, APK install, app launch, offline check, WebAuth demo-only boundary, and no real payments |
| P1 | Mobile screenshot redaction checklist | Codex | DONE | `npm run check:mobile-screenshot-redaction` validates safe Android/iOS screenshot and recording redaction before sharing beta or mobile QA evidence outside local founder/admin review |
| P1 | Mobile release blockers | Codex | DONE | `npm run check:mobile-release-blockers` validates Android/iOS release blockers for debug build, emulator/phone QA, Apple Developer, store accounts, signing keys, and disabled real-money features |
| P1 | Mobile release go/no-go matrix | Codex | DONE | `npm run check:mobile-release-go-no-go` validates one founder decision matrix for PWA install, offline shell, Android/iOS QA, store/signing gates, and disabled real-money features |
| P1 | Mobile founder QA report template | Codex | DONE | `npm run check:mobile-founder-qa-report` validates a safe founder report-back format for PWA, Android, iOS, screenshots, request IDs, and disabled real-money features |
| P1 | Mobile local QA commands | Codex | DONE | `npm run check:mobile-local-qa-commands` validates the safe Windows command sequence for local PWA/Android/mobile evidence checks without secrets or store/payment actions |
| P1 | Android QA runbook validator | Codex | DONE | `npm run check:android-qa` verifies local emulator QA boundaries, secret handling, and live-risk blocks before Android testing |
| P1 | Mobile release evidence bundle | Codex | DONE | Local evidence summary template defines checks, screenshots, offline proof, live-risk blockers, and founder next step before public/mobile release decisions |
| P1 | Mobile release evidence validator | Codex | DONE | `npm run check:mobile-release-evidence` verifies the evidence bundle keeps local-only scope, secret boundaries, blocked live-risk actions, and backlog/context links |
| P1 | Capacitor wrapper | Codex | LATER | Android shell debug build passes after local Java/Android SDK toolchain is available |
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
