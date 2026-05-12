# GCSC Active Context

Date: 2026-05-11 PT

Purpose: this file is the short source-of-truth briefing for Codex when the chat becomes long, context is compressed, or a new session starts.

Latest real-status audit: `docs/gcsc-real-status-audit-2026-05-11.md`.
Founder evening checklist: `docs/smartcontractor-founder-tonight-checklist.md`.
Founder Auth troubleshooting: `docs/smartcontractor-founder-auth-troubleshooting.md`.
Founder Auth evidence template: `docs/smartcontractor-founder-auth-evidence-template.md`.
Founder action queue: `docs/smartcontractor-founder-action-queue.md`.
Founder one-pager validator: `npm run check:founder-one-pager`.
Microsoft/Azure application validator: `npm run check:microsoft-startups`.
Whitepaper section validator: `npm run check:whitepaper-sections`.
Target architecture validator: `npm run check:target-architecture`.
Auth/RLS plan validator: `npm run check:auth-rls-plan`.
Strict admin smoke checklist: `docs/smartcontractor-strict-admin-smoke-checklist.md`.
Controlled user test plan: `docs/smartcontractor-controlled-user-test-plan.md`.
Beta issue log template: `docs/smartcontractor-beta-issue-log-template.md`.
Beta tester invite: `docs/smartcontractor-beta-tester-invite.md`.
Beta tester follow-up: `docs/smartcontractor-beta-tester-followup.md`.
Beta feedback synthesis: `docs/smartcontractor-beta-feedback-synthesis.md`.
Beta session runbook: `docs/smartcontractor-beta-session-runbook.md`.
Beta session summary template: `docs/smartcontractor-beta-session-summary-template.md`.
Beta decision log: `docs/smartcontractor-beta-decision-log.md`.
Public beta review packet: `docs/smartcontractor-public-beta-review-packet.md`.
Beta triage rubric: `docs/smartcontractor-beta-triage-rubric.md`.
Beta issue lifecycle: `docs/smartcontractor-beta-issue-lifecycle.md`.
Beta go/no-go scorecard: `docs/smartcontractor-beta-go-no-go-scorecard.md`.
Beta evidence checklist: `docs/smartcontractor-beta-evidence-checklist.md`.
Public launch runbook validator: `npm run check:public-launch-runbook`.

Current honest readiness:

- local clickable demo: 85-90%;
- public beta demo without real money: 60-70%;
- small controlled pilot without real money movement: 45-55%;
- real-money construction finance pilot: 25-35%;
- native Android/iOS store launch: 20-30%;
- mature full platform vision: 10-15%.

Backlog count at latest audit: 184 tracked items, 167 DONE, 12 REVIEW, 3 BLOCKED, 2 LATER.

Real status audit validator: `npm run check:real-status-audit` keeps the readiness percentages, blockers, launch timeline, and ASCII-safe audit text from being accidentally softened or corrupted.

## Codex Nonstop Execution Hook

Codex must follow `docs/codex-nonstop-execution-hook.md`.

After every completed safe task, Codex must immediately select the next safe task from `docs/smartcontractor-backlog.md`, implement it, test it, update docs, commit, and push. Codex should stop only for secrets, external account changes, live Supabase changes without explicit approval, real payments/loans/escrow/token collateral, legal decisions, or founder-only business decisions.

There are two automation layers:

- heartbeat `gcsc-nonstop-next-task-hook`: wakes this chat every 1 minute when the Codex app/thread can receive heartbeats, then Codex must keep looping through safe tasks inside the same active run when feasible;
- cron `gcsc-hourly-autonomous-builder`: standalone hourly local workspace worker for overnight safe scoped tasks. This is a backup layer, not the primary "continue after each task" mechanism.

## Red Line

GCSC is not a generic crypto website. It is a real-world construction finance and trust platform built around SmartContractor, XPR Network smart contracts, AI agents, contractor credit, milestone payments, disputes, peer review, and DAO/token economics.

Every feature must support this core mission:

- help homeowners find and pay verified contractors safely;
- help contractors win jobs, prove seriousness, and access responsible working capital;
- replace risky upfront homeowner deposits with milestone-based progress, credit, verification, and audit trails;
- connect real construction workflows to XPR Network, GCSC token utility, GCST internal payments, and future smart contracts;
- keep legal, financial, identity, escrow, lending, and token-collateral actions reviewable before public launch.

## Product Model

SmartContractor is the main product experience.

Core user roles:

- homeowner;
- contractor;
- peer reviewer or inspector;
- admin/founder;
- future worker, lender, DAO member, and AI agent roles.

Core workflow:

1. Homeowner posts a construction job.
2. Contractor registers, verifies identity/business/license/insurance, and submits a bid.
3. Accepted bid becomes a project contract.
4. Project contract breaks work into milestones.
5. Contractor may request a starter loan or token-backed credit.
6. Homeowner pays milestones after visible progress and/or inspection.
7. Milestone payment can repay contractor loan first, then pay contractor.
8. If there is a dispute, evidence is uploaded and peer reviewers/inspectors can evaluate the work.
9. Reviews affect payment release, reputation, token rewards, and future credit limits.
10. Important actions are written to audit/payment/verification ledgers and later mapped to smart contracts.

## Strategic Decisions Already Made

- Magic Link is the preferred MVP authentication path.
- Supabase is the current backend/database/Auth candidate.
- GitHub Pages is currently used for the public static site at `xprnet.org`.
- Local SmartContractor MVP runs from `C:\gcsc\construction-ai`.
- Route protection remains in draft mode until Supabase Auth, RLS, admin memberships, and smoke tests are ready.
- Service-role keys stay server-side only and must never be exposed in frontend or chat.
- RLS policies must be strict before public launch; current live dev policies are too open for production.
- Payment intent rows need typed ownership columns before browser RLS can safely show payment status to the correct homeowner or contractor.
- Payment providers are adapters behind one payment router: XPR/WebAuth, Metal Pay, Stripe, PayPal/Crypto, Coinbase Commerce, BTCPay, and future ACH/open-banking rails.
- Metal Pay is important but requires partner/API credentials before real integration.
- Smart contracts should receive finalized settlement/token logic only after database MVP, legal review, and security review.
- Loans, escrow, collateral, and legal ownership language require attorney review before real-money launch.

## Current Engineering State

Live/local pieces already prepared:

- clickable SmartContractor MVP;
- baseline security headers for local/public backend responses, guarded by static validation and live smoke checks via `npm run check:smartcontractor` and `npm run check:auth`;
- request-id tracing via `X-Request-Id`, so API responses and audit rows can be correlated during beta testing, deployment debugging, disputes, and admin review;
- jobs, bids, starter loans, disputes, evidence, peer review;
- mobile-responsive PWA shell;
- backend validation;
- invalid JSON body handling with clear `400` responses and `request_id` for deploy/debug traceability;
- unknown API route handling with JSON `404` responses and `request_id` for frontend/deploy debugging;
- audit/event ledger;
- payment intent/event ledger;
- project contracts and milestones;
- multi-provider payment router;
- Metal Pay signature scaffold;
- verification provider abstraction;
- Admin / Risk Console MVP;
- Admin Console review workflow;
- Production Readiness Gate;
- Magic Link Auth scaffold;
- Auth/RLS plan validator via `npm run check:auth-rls-plan`, keeping Magic Link, identity binding, browser/backend key boundaries, owner policies, backend-only tables, founder approval gates, and strict-mode blockers aligned;
- Magic Link request rate limiting, advertised in `/api/health`, so public beta login emails cannot be spammed from one IP;
- profile ownership binding draft;
- role ownership guards;
- auth smoke-test harness;
- strict route gate smoke test via `npm run check:strict-gates`;
- strict RLS draft preflight validator via `npm run check:rls-draft`;
- payment ownership draft validator via `npm run check:payment-ownership`;
- smart contract design docs validator via `npm run check:contract-docs`;
- nonstop hook validator via `npm run check:nonstop-hook`;
- automation health validator via `npm run check:automation-health`, checking the real Codex heartbeat/hourly TOML files for active schedules, readable prompts, target thread, and `C:\gcsc` workspace wiring;
- autonomous status note validator via `npm run check:autonomous-status`;
- founder action boundary validator via `npm run check:founder-boundaries`;
- founder action queue at `docs/smartcontractor-founder-action-queue.md` plus validator `npm run check:founder-action-queue`, keeping founder-only deploy/Auth/admin/RLS/legal/provider/application steps and safe report-back format clear;
- deploy-platform decision brief validator via `npm run check:deploy-brief`;
- CI workflow validator via `npm run check:ci-workflow`;
- strict admin smoke checklist validator via `npm run check:strict-admin-smoke`;
- environment example validator via `npm run check:env-example`, including production `PUBLIC_SITE_URL`, local/public allowed origins, Supabase Auth redirect origins, placeholder secrets, and server-only warnings;
- PWA QA checklist validator via `npm run check:pwa-qa`;
- Android wrapper preflight validator via `npm run check:android-preflight`;
- Android toolchain preflight validator via `npm run check:android-toolchain-preflight`, keeping Java, `JAVA_HOME`, `ANDROID_HOME`, Android SDK, and debug-build safety boundaries documented before APK work;
- Founder Android setup checklist via `npm run check:founder-android-setup`, keeping the founder's JDK 17, Android Studio, `JAVA_HOME`, `ANDROID_HOME`, local debug-build, and safe report-back steps simple and secret-free;
- Android debug build evidence validator via `npm run check:android-debug-build-evidence`, keeping local `gradlew.bat assembleDebug` proof captured as Blocked/Passed/Failed without secrets or Play Console work;
- Android emulator smoke evidence validator via `npm run check:android-emulator-smoke-evidence`, keeping local `adb devices`, `adb install`, app launch, offline shell, and demo-only WebAuth proof secret-free;
- Android QA runbook validator via `npm run check:android-qa`;
- mobile release evidence bundle and validator via `npm run check:mobile-release-evidence`, keeping local QA proof, screenshots/log handling, offline checks, live-risk blockers, and founder next step reviewable before public/mobile release decisions;
- mobile install readiness endpoint `/api/admin/mobile-install-readiness` plus validator `npm run check:mobile-install-readiness`, checking PWA app shell files, manifest identity, service worker cache boundaries, offline fallback, and founder-controlled mobile release blockers;
- iOS preflight runbook at `docs/smartcontractor-ios-preflight.md`, keeping Apple/App Store steps founder-controlled;
- iOS preflight validator via `npm run check:ios-preflight`, keeping Apple-account blockers, safe command boundaries, secret checks, and live-risk gates pinned before iOS wrapper work;
- mobile package-id drift guard via `npm run check:mobile`;
- AI agent workflow scaffold validator via `npm run check:ai-agent-workflows`;
- service-role boundary draft;
- admin role model live table created in Supabase migration `20260505053127 add_admin_memberships`, with no users assigned yet;
- admin enforcement scaffold;
- Founder Action Center.
- Founder Auth Setup read-only API/UI, which checks Magic Link session status, profile binding, admin role state, and admin membership table reachability before strict RLS/admin testing.
- Founder one-pager validator via `npm run check:founder-one-pager`, keeping the partner/investor one-pager aligned with SmartContractor's trust, credit, dispute, AI, XPR, Supabase, provider, and launch-safety narrative.
- Founder admin activation runbook at `docs/smartcontractor-founder-admin-activation-runbook.md`, with local backend preflight, exact review SQL, insert template, post-checks, and rollback. Do not apply live without founder approval and real `auth_user_id`.
- Founder admin activation runbook validator via `npm run check:founder-admin-runbook`, which verifies the runbook keeps the approval gate, browser steps, SQL template, rollback, and no secret-looking values.
- Deploy-platform decision brief at `docs/smartcontractor-deploy-platform-decision-brief.md`, with Vercel as the recommended first public beta target and founder-only setup steps.
- Vercel preflight runbook at `docs/smartcontractor-vercel-preflight.md`, plus validator `npm run check:vercel-preflight`, documenting founder-controlled import settings, demo-safe environment variables, and disabled real-money launch boundaries before any external deployment work.
- Vercel environment matrix at `docs/smartcontractor-vercel-env-matrix.md`, plus validator `npm run check:vercel-env-matrix`, separating demo-safe variables, founder-only secrets, disabled real-money features, and safe setup order before Vercel import.
- Vercel post-deploy checklist at `docs/smartcontractor-vercel-postdeploy-checklist.md`, plus validator `npm run check:vercel-postdeploy`, preserving read-only deployed URL checks, security headers, request-id tracing, readiness endpoints, and founder-controlled Supabase Auth redirect steps.
- Public beta handoff checklist at `docs/smartcontractor-public-beta-handoff-checklist.md`, with safe demo scope, founder review packet, local checks, and the next deploy-account action.
- Public beta handoff checklist validator via `npm run check:public-beta-handoff`, preserving safe demo scope, review packet docs, disabled real-money features, and founder-only deploy-account action.
- demo script validator via `npm run check:demo-script`, keeping the 5-minute walkthrough aligned with SmartContractor safety boundaries, payment rails, disputes, milestone repayment, and founder review scope.
- controlled user test plan validator via `npm run check:controlled-user-test`, keeping the first homeowner, contractor, dispute, peer-review, and admin beta scenarios demo-safe and free of real-money actions.
- beta issue log template validator via `npm run check:beta-issue-log`, keeping beta bug reports non-secret, severity-ranked, and blocked for live-risk actions.
- beta tester invite validator via `npm run check:beta-tester-invite`, keeping the first 3-5 tester invite demo-only and clear about no real loans, escrow, payments, or sensitive data.
- beta tester follow-up at `docs/smartcontractor-beta-tester-followup.md` plus validator `npm run check:beta-tester-followup`, collecting demo-only feedback without secrets, sensitive data, or real-money commitments.
- beta feedback synthesis validator via `npm run check:beta-feedback-synthesis`, keeping first tester feedback grouped into product decisions without secrets or accidental real-money approvals.
- beta readiness endpoint `/api/admin/beta-readiness` plus validator `npm run check:beta-readiness`, summarizing controlled beta documents, local checks, tester scope, and founder-blocked gates without exposing secrets or approving real-money actions.
- beta readiness UI in the Admin workspace, showing controlled beta decision, first tester scope, document readiness, and founder/live-risk gates from `/api/admin/beta-readiness`.
- beta readiness next-step UI in the Admin workspace, showing backend-provided `next_safe_steps` so the founder sees the safe follow-up path without guessing.
- beta readiness document-status UI in the Admin workspace, showing backend-provided `required_docs` statuses so missing beta docs are visible without opening files manually.
- beta readiness document path UI in the Admin workspace, showing each required beta document path with its status so the founder can open the right file immediately.
- beta readiness missing-doc summary in `/api/admin/beta-readiness` and the Admin workspace, exposing `document_summary` and `missing_docs` so blocked beta paperwork is obvious.
- beta readiness validation commands in `/api/admin/beta-readiness` and the Admin workspace, showing the exact local checks to run before inviting testers.
- beta readiness safe report-back template in `/api/admin/beta-readiness` and the Admin workspace, showing non-secret founder status lines for Auth/beta readiness results.
- beta readiness safe report fields in `/api/admin/beta-readiness` and the Admin workspace, showing the exact allowed non-secret values for founder Auth/beta status reports.
- beta readiness go/no-go rules in `/api/admin/beta-readiness` and the Admin workspace, showing automatic go/review/no-go conditions before founder invites testers.
- beta readiness tester-day checklist in `/api/admin/beta-readiness` and the Admin workspace, showing the first tester-session checklist with safe evidence and issue logging boundaries.
- beta readiness issue intake fields in `/api/admin/beta-readiness` and the Admin workspace, showing required safe fields for tester issue reports without secrets or sensitive data.
- beta readiness founder review packet in `/api/admin/beta-readiness` and the Admin workspace, showing the core documents to open before tester invites.
- beta readiness founder-present tasks in `/api/admin/beta-readiness` and the Admin workspace, showing the founder-only actions that can be done when the founder is at the computer without exposing secrets.
- beta session runbook at `docs/smartcontractor-beta-session-runbook.md` plus validator `npm run check:beta-session`, keeping one-session tester agenda, evidence capture, stop conditions, and live-risk boundaries consistent.
- beta session summary template at `docs/smartcontractor-beta-session-summary-template.md` plus validator `npm run check:beta-session-summary`, keeping post-session decisions, P0/P1 issues, trust blockers, and live-risk launch decisions non-secret.
- beta decision log at `docs/smartcontractor-beta-decision-log.md` plus validator `npm run check:beta-decision-log`, keeping post-test decisions categorized without approving live-risk actions.
- beta readiness document gate now includes the session runbook, session summary, and decision log in `/api/admin/beta-readiness`, with smoke-test coverage.
- public beta review packet at `docs/smartcontractor-public-beta-review-packet.md` plus validator `npm run check:public-beta-review-packet`, keeping founder review docs, demo-safe scope, evidence capture, and go/no-go gates aligned before sharing a beta link.
- beta triage rubric at `docs/smartcontractor-beta-triage-rubric.md` plus validator `npm run check:beta-triage-rubric`, keeping beta feedback severity, trust categories, evidence, and founder-only escalation gates consistent.
- beta issue lifecycle at `docs/smartcontractor-beta-issue-lifecycle.md` plus validator `npm run check:beta-issue-lifecycle`, keeping tester issues moving from new to verified without bypassing live-risk approval gates.
- beta go/no-go scorecard at `docs/smartcontractor-beta-go-no-go-scorecard.md` plus validator `npm run check:beta-go-no-go-scorecard`, keeping founder beta decisions tied to safe demo areas, automatic no-go conditions, and decision-log evidence.
- beta evidence checklist at `docs/smartcontractor-beta-evidence-checklist.md` plus validator `npm run check:beta-evidence-checklist`, keeping screenshots, recordings, request IDs, console/network evidence, and mobile/PWA proof useful without secrets or real-money data.
- beta readiness triage gate now includes triage rubric, issue lifecycle, and go/no-go scorecard in `/api/admin/beta-readiness`, with smoke-test coverage.
- beta readiness founder action gate now includes the founder action queue document and next safe step in `/api/admin/beta-readiness`, with smoke-test and validator coverage.
- public launch runbook validator via `npm run check:public-launch-runbook`, keeping founder-only setup, strict RLS review, deployment gates, public beta scope, and emergency rollback pinned before wider launch.
- Microsoft/Azure application validator via `npm run check:microsoft-startups`, keeping the startup application and submission packet aligned with SmartContractor, Azure AI usage, safety boundaries, and no token-price/secret-risk claims.
- Whitepaper section validator via `npm run check:whitepaper-sections`, keeping SmartContractor architecture, contractor credit, token collateral, AI boundaries, legal gates, and no price-guarantee language aligned.
- Target architecture validator via `npm run check:target-architecture`, keeping the core module map, build order, database/API groups, safety boundaries, and immediate engineering state from drifting.
- Auth/RLS plan validator via `npm run check:auth-rls-plan`, keeping Supabase Auth, RLS goals, backend-only tables, service-role boundaries, admin enforcement, and founder approval gates from drifting.
- Claude Code global nonstop prompt at `docs/claude-code-global-nonstop-prompt.md`, plus validator `npm run check:claude-code-prompt`, preserving the reusable `~/.claude` setup prompt for the founder's other projects without touching external accounts or secrets.

## Current Supabase State

Project:

- name: `smartcontractor-gcsc`;
- project ref: `uhixuyurxsrxayhghjzm`;
- region: `us-east-1`;
- status: active/healthy in the latest connector check.

Known security status:

- all important public tables have RLS enabled;
- many live policies are still development policies with `USING true` / `WITH CHECK true`;
- strict RLS replacement must be prepared, reviewed, tested, and only then applied;
- do not run live DDL/migrations without explicit founder approval.

Known performance advisor items:

- FK indexes for `project_contracts.accepted_bid_id` and `token_collateral_locks.price_snapshot_id` were applied live in Supabase migration `20260505033416 add_missing_fk_indexes`;
- `admin_memberships` exists live from migration `20260505053127 add_admin_memberships`, but it has zero rows until founder Magic Link/Auth user is selected;
- local `/api/admin/founder-auth-setup` can now show whether the current browser Magic Link session has a linked SmartContractor profile and active founder role, without assigning roles or changing live data;
- keep unused-index cleanup for later because demo data is small.

## Current Priorities

P0 before public/real-money launch:

- strict RLS replacement package;
- Supabase Auth real user testing;
- admin membership activation;
- service-role secret setup in deployment environment only;
- legal review for loans, escrow/payment handling, contractor credit, token collateral, and business-control language;
- deploy-platform decision and production environment variables;
- public demo script and founder/investor package polishing.
- legal/financial review validator via `npm run check:legal-review`, keeping real loans disabled, real escrow disabled, token collateral disabled, production payments blocked, and AI approvals blocked until attorney/provider/founder review.

P1 after P0 is stable:

- beta readiness evidence retention policy is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping screenshots, recordings, request IDs, and tester notes local/redacted before outside sharing.
- beta readiness tester handoff packet is now exposed through `/api/admin/beta-readiness` and the Admin workspace, showing the exact demo-safe files to give testers before a controlled beta session.
- beta readiness session stop conditions are now exposed through `/api/admin/beta-readiness` and the Admin workspace, telling the founder when to stop a tester session before secrets, real-money flows, Auth/admin ambiguity, or sensitive evidence leaks.
- beta readiness post-session actions are now exposed through `/api/admin/beta-readiness` and the Admin workspace, turning tester notes into safe issue-log, synthesis, and decision-log follow-up before public beta scope changes.
- beta readiness public beta exit criteria are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping public beta promotion demo-only until checks, P0 issues, Auth/admin clarity, deploy blockers, and live-risk gates are clear.
- beta readiness pre-invite checks are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping tester invites blocked until local checks, demo-safe scope, handoff docs, and stop-condition awareness are ready.
- beta readiness invite message checklist is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping tester invites free of real-money promises, loan approvals, token appreciation claims, and requests for sensitive data.
- beta readiness tester consent checklist is now exposed through `/api/admin/beta-readiness` and the Admin workspace, making demo-only scope, no sensitive data, no real-money actions, and redacted evidence explicit before tester sessions.
- beta readiness tester role briefing is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping homeowner, contractor, peer reviewer, and founder/admin testers inside demo-only role boundaries.
- beta readiness tester success signals are now exposed through `/api/admin/beta-readiness` and the Admin workspace, defining what controlled beta testers should be able to explain or report after the demo.
- beta readiness tester failure signals are now exposed through `/api/admin/beta-readiness` and the Admin workspace, defining when a controlled beta session should stop or be reworked before broader sharing.
- beta readiness tester redaction reminders are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping names, contact details, IDs, payment data, secrets, and raw recordings out of shared beta evidence.
- beta readiness tester artifact naming is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping beta screenshots, recordings, and issue-note filenames safe, short, and tied to request IDs when available.
- beta readiness tester artifact index is now exposed through `/api/admin/beta-readiness` and the Admin workspace, mapping beta screenshots, recordings, logs, request IDs, issue IDs, and redaction status without exposing private content.
- beta readiness tester artifact review queue is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping beta artifacts in redaction/founder-review/internal-approval/block/archive states before outside sharing.
- beta readiness tester artifact export guard is now exposed through `/api/admin/beta-readiness` and the Admin workspace, blocking unsafe beta evidence from public, partner, grant, or investor packets until redacted and approved.
- beta readiness tester artifact purge policy is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping raw recordings, unredacted screenshots, and local logs deleted or retained only as redacted summaries after review.
- beta readiness tester artifact retention clock is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping raw tester artifacts reviewed or purged within 24 hours and tying retained redacted evidence to issue/decision records.
- beta readiness tester artifact disposal ledger is now exposed through `/api/admin/beta-readiness` and the Admin workspace, proving purge/retention decisions without storing sensitive artifact contents.
- beta readiness tester artifact access roles are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping raw beta artifacts founder/admin-only while allowing only redacted summaries or approved artifacts into partner/grant packets.
- beta readiness tester artifact chain of custody is now exposed through `/api/admin/beta-readiness` and the Admin workspace, recording artifact capture, review, redaction, approval, export, purge, and retention handoffs before outside sharing.
- beta readiness tester artifact public summary rules are now exposed through `/api/admin/beta-readiness` and the Admin workspace, allowing only aggregate/redacted lessons into public, partner, grant, or investor summaries without raw sensitive evidence.
- beta readiness tester artifact anonymization checklist is now exposed through `/api/admin/beta-readiness` and the Admin workspace, requiring names, emails, phones, addresses, account IDs, wallet/payment data, URLs, tabs, and request bodies to be removed or blurred before sharing.
- beta readiness tester artifact approval stamp is now exposed through `/api/admin/beta-readiness` and the Admin workspace, requiring approved-by role, approval date, artifact type, redaction status, and intended audience before beta artifacts leave local founder/admin review.
- beta readiness tester artifact revocation rules are now exposed through `/api/admin/beta-readiness` and the Admin workspace, requiring immediate approval revocation if sensitive data, wrong audience, stale consent, incorrect redaction, or real-money evidence is discovered.
- beta readiness tester artifact external packet manifest is now exposed through `/api/admin/beta-readiness` and the Admin workspace, requiring every public, partner, grant, or investor packet artifact/summary/quote/metric/reference to be listed with audience, approval stamp, redaction status, source issue, and owner.
- beta readiness tester artifact external packet distribution log is now exposed through `/api/admin/beta-readiness` and the Admin workspace, recording safe packet share version/audience/channel/owner metadata without recipient contact details.
- beta readiness tester artifact external packet recall checklist is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping revoked or corrected shared evidence traceable without preserving unsafe packet content.
- beta readiness tester artifact external packet correction notice is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping corrected public, partner, grant, or investor packets explainable without repeating unsafe artifact content.
- beta readiness tester artifact external packet version history is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping external packet draft/approved/distributed/corrected/recalled/superseded/blocked states traceable without raw tester evidence.
- beta readiness tester artifact external packet claim review is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping product, traction, security, AI, payment, loan, escrow, token, and launch-readiness claims conservative until evidence/founder/legal/provider review supports them.
- beta readiness tester artifact external packet audience review is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping public, partner, grant, investor, provider, and legal packets matched to the right evidence depth and approval gates.
- beta readiness tester artifact external packet recipient acknowledgement is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping external packet follow-up traceable with non-contact acknowledgement metadata and founder/legal/provider routing for sensitive questions.
- beta readiness tester artifact external packet follow-up queue is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping post-share tasks categorized without secrets, recipient contact details, or live-risk actions.
- beta readiness tester artifact external packet follow-up closure rules are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping external packet follow-up closure tied to safe evidence, decision logs, and founder/legal/provider routing when needed.
- beta readiness tester artifact external packet follow-up escalation rules are now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping expired or sensitive external packet follow-up routed to founder, legal, provider, product, technical, grant, investor, or blocked review.
- beta readiness tester artifact external packet follow-up SLA policy is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping owners, due windows, severity, and escalation timing visible without creating legal, payment, loan, escrow, token, or provider obligations.
- beta readiness tester artifact external packet follow-up decision summary is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping closed or escalated packet follow-up summarized without private recipient details, raw artifacts, or live-risk promises.
- beta readiness tester artifact external packet follow-up owner handoff is now exposed through `/api/admin/beta-readiness` and the Admin workspace, keeping owner changes traceable without assigning secrets, live payments, legal advice, or production authority to autonomous Codex.
- Android README drift guard now blocks stale instructions that would reinitialize Capacitor or run mobile wrapper commands outside `C:\gcsc\construction-ai`.
- Android Capacitor dependencies are now installed in `C:\gcsc\construction-ai`, and `npm run check:android-preflight` blocks wrapper generation if `@capacitor/core`, `@capacitor/cli`, or `@capacitor/android` drift out.
- Android native wrapper now exists under `C:\gcsc\construction-ai\android`, bundles SmartContractor PWA assets, and is validated by `npm run check:android-wrapper`; Android toolchain preflight is documented and validated by `npm run check:android-toolchain-preflight`, while the debug Gradle build is still blocked locally until `JAVA_HOME` and Android SDK tooling are available.
- Founder Android setup checklist is now documented and validated by `npm run check:founder-android-setup`, giving the founder a safe step-by-step Windows setup path for JDK 17, Android Studio, `JAVA_HOME`, `ANDROID_HOME`, and local `gradlew.bat assembleDebug` report-back.
- Android debug build evidence is now documented and validated by `npm run check:android-debug-build-evidence`, giving the founder a safe Blocked/Passed/Failed template for APK proof after local toolchain setup.
- Android emulator smoke evidence is now documented and validated by `npm run check:android-emulator-smoke-evidence`, giving the founder a safe local emulator/phone QA template for install, launch, offline shell, and demo-only WebAuth boundaries.
- Android Capacitor shell;
- iOS plan after Apple account/certificates;
- more complete contractor/homeowner onboarding;
- verification provider selection;
- payment provider partner onboarding;
- AI agent workflow scaffolds.

## Do Not Drift

Do not turn the project into:

- a simple landing page;
- a generic Upwork clone;
- a generic token presale page;
- an unregulated lending promise;
- an automatic escrow/lending system without legal review;
- a crypto-only tool that ignores real construction workflows;
- a frontend-only demo without audit, verification, payments, disputes, and admin review.

## Safety Boundaries

Never:

- ask the founder to paste passwords, private keys, service-role keys, seed phrases, or raw database passwords into chat;
- expose secret keys in frontend code;
- apply live Supabase migrations without explicit approval;
- change Namecheap, GitHub Pages, payment provider, Supabase production settings, or external accounts without the founder present;
- present loan, escrow, collateral, or token appreciation language as legal advice or guaranteed returns.

Always:

- explain founder actions step by step in simple Russian;
- keep code/docs scoped and committed carefully;
- update `docs/smartcontractor-backlog.md` when status changes;
- preserve `AGENTS.md` project rules;
- read this file, `AGENTS.md`, `docs/gcsc-target-architecture.md`, and `docs/smartcontractor-backlog.md` before major autonomous work.

## Next Best Step

Use the Founder Auth Setup flow to finish the first real founder identity path:

1. send Magic Link to the founder email;
2. open the link in the same browser as the local MVP;
3. check Founder Auth Setup;
4. create/link one founder SmartContractor profile if it is missing;
5. after explicit founder approval, add that Auth user to `admin_memberships` as active `founder`;
6. run admin smoke tests before applying strict RLS.

Do not assign founder roles, apply strict RLS, or activate real loan/payment actions without explicit founder approval.
