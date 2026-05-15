# Kimi Stream M Work Order: Mobile Readiness And Native Release Prep

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval for Google Play, App Store, production signing, external account changes, public mobile release, or real-money mobile features.

Purpose: give Kimi a precise Stream M package for auditing SmartContractor PWA, Android, and iOS mobile readiness without touching Google Play Console, App Store Connect, Apple Developer, production signing keys, external accounts, live Supabase, deployment settings, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, provider commitments, or public launch.

This work order is not app-store approval, not native release approval, not signing-key approval, not legal advice, not payment approval, not lending approval, and not approval for any live mobile distribution action.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute Stream M only: create a local mobile readiness package that tells Codex and the founder what is ready for PWA/mobile demo review, what blocks Android/iOS native release, what evidence is missing, and which tasks can be split across many agents without touching app stores, signing keys, live systems, or real-money actions.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md
- docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md
- docs/gcsc-kimi-stream-m-mobile-readiness-work-order.md
- every source file listed in "Required Source Files"

Safety:
- No secrets.
- No external account login.
- No Google Play Console action.
- No App Store Connect action.
- No Apple Developer account action.
- No production signing key creation, upload, paste, or commit.
- No release APK/AAB/IPA distribution.
- No live Supabase change.
- No production deploy or public mobile release.
- No tester invite sending.
- No real payment, loan, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal, lender, provider, store-review, privacy-policy, or public-launch conclusions.
- Do not edit files outside your assigned file set.
- Do not edit AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, package.json, server.js, public HTML, Android native files, iOS files, deploy/account files, Supabase config, or public website files unless the integrator explicitly assigns a later package.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers ranked Critical/High/Medium/Low.
- Proposed integrator actions.
- Confirmation that no live/legal/money/external/secrets/app-store/signing boundary was crossed.
```

## Stream M Goal

Create a local-only mobile readiness package that lets the founder, Codex, Claude, and Kimi decide what can be accelerated safely before any mobile release.

The package must answer:

- Which PWA/mobile evidence is already prepared?
- Which Android wrapper/build/QA items are prepared, blocked, or missing?
- Which iOS items are only preflighted and which are blocked by Apple/Mac/account constraints?
- Which screenshot, recording, and log evidence can be collected safely?
- Which native release blockers are absolute no-go gates?
- Which future Kimi workers can safely generate reports or redlines without touching shared files or app-store surfaces?
- What should remain founder-controlled even if Kimi can prepare drafts quickly?

## Required Source Files

Kimi Stream M must read:

- `docs/smartcontractor-mobile-roadmap.md`
- `docs/smartcontractor-mobile-build-system.md`
- `docs/smartcontractor-pwa-qa-checklist.md`
- `docs/smartcontractor-mobile-release-blockers.md`
- `docs/smartcontractor-mobile-release-go-no-go-matrix.md`
- `docs/smartcontractor-mobile-release-evidence.md`
- `docs/smartcontractor-mobile-founder-qa-report-template.md`
- `docs/smartcontractor-mobile-local-qa-commands.md`
- `docs/smartcontractor-mobile-screenshot-redaction-checklist.md`
- `docs/smartcontractor-android-wrapper-preflight.md`
- `docs/smartcontractor-android-toolchain-preflight.md`
- `docs/smartcontractor-founder-android-setup-checklist.md`
- `docs/smartcontractor-android-debug-build-evidence.md`
- `docs/smartcontractor-android-emulator-smoke-evidence.md`
- `docs/smartcontractor-android-device-smoke-checklist.md`
- `docs/smartcontractor-android-qa-runbook.md`
- `docs/smartcontractor-android-build.md`
- `docs/smartcontractor-ios-preflight.md`
- `docs/smartcontractor-ios-build.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-public-beta-review-packet.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `construction-ai/capacitor.config.json`
- `construction-ai/package.json` scripts section, read-only

Kimi Stream M may inspect read-only, but must not modify:

- `construction-ai/android/`
- `construction-ai/public/manifest.json`
- `construction-ai/public/service-worker.js`
- `construction-ai/public/offline.html`
- `construction-ai/public/smartcontractor.html`
- `construction-ai/public/smartcontractor-app.js`

Read-only comparison files if needed:

- `docs/gcsc-active-context.md`
- `docs/smartcontractor-backlog.md`
- `docs/gcsc-real-status-audit-2026-05-11.md`
- `docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md`

## Assigned File Set

Kimi Stream M may create:

- `docs/smartcontractor-mobile-kimi-readiness-audit.md`
- `docs/smartcontractor-mobile-qa-device-matrix.md`
- `docs/smartcontractor-mobile-kimi-worker-split.md`

Kimi Stream M may propose, but should not directly apply unless assigned later by the Codex integrator:

- updates to mobile docs;
- updates to Android/iOS runbooks;
- screenshot/evidence folder templates;
- new local-only validators;
- package script additions;
- PWA, Android, or iOS code changes.

Reason: mobile release touches shared product, evidence, public beta, Auth, app-store, privacy, signing, and public-claim surfaces. Integration must happen in controlled scoped passes.

## No-Touch Files And Actions

Do not modify:

- `.env`, `.env.*`, secrets, credentials, tokens, Supabase keys, OAuth files, wallet files;
- `AGENTS.md`, `GEMINI.md`, `.claude/CLAUDE.md`;
- `construction-ai/package.json` unless a later integrator package explicitly assigns it;
- `construction-ai/server.js`;
- `construction-ai/android/` native files;
- iOS project files, if they appear later;
- public website, public whitepaper, public deck, email, social, deploy, account, app-store, payment-provider, wallet, or Supabase config files.

Do not perform:

- Google Play Console setup or upload;
- App Store Connect setup or upload;
- Apple Developer setup;
- production signing key creation or handling;
- release APK/AAB/IPA build distribution;
- production deploy;
- Supabase Auth redirect change;
- live Supabase write or migration;
- tester invite sending or public URL sharing;
- public mobile launch announcement;
- payment/provider/lender/wallet setup.

## Output 1: Mobile Kimi Readiness Audit

`docs/smartcontractor-mobile-kimi-readiness-audit.md` must include:

- executive summary;
- required source files read;
- PWA install/offline readiness;
- Android wrapper status;
- Android toolchain status;
- Android debug build evidence status;
- Android emulator and physical device QA status;
- iOS preflight status;
- store/signing/account blocker status;
- screenshot, recording, log, and evidence safety status;
- Auth/admin/public beta dependency status;
- real-money disablement status;
- critical/high/medium/low findings;
- blocked-live gates;
- no-touch confirmation.

Required table:

| Area | Current Evidence | Ready State | Missing Evidence | Live Status | Owner |
| --- | --- | --- | --- | --- | --- |

Required areas:

- PWA install;
- offline shell;
- mobile viewport layout;
- service-worker/cache boundary;
- Capacitor config identity;
- Android wrapper generated;
- Android JDK/SDK/toolchain;
- Android debug APK;
- Android emulator smoke;
- Android physical phone smoke;
- iOS preflight;
- iOS wrapper/build;
- screenshot redaction;
- QA evidence storage;
- Auth/admin dependency;
- public beta dependency;
- Google Play Console;
- App Store Connect;
- production signing keys;
- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled.

## Output 2: Mobile QA Device Matrix

`docs/smartcontractor-mobile-qa-device-matrix.md` must define a local QA matrix for PWA, Android, and iOS without requiring app-store work.

Required table:

| Device Or Path | Minimum Check | Evidence To Capture | Allowed Scope | Blocked Actions | Owner |
| --- | --- | --- | --- | --- | --- |

Required paths:

- Windows Chrome mobile viewport;
- installed PWA on desktop/mobile browser;
- offline fallback path;
- Android emulator with debug APK;
- Android physical phone with debug APK;
- iOS Safari PWA;
- future iOS simulator;
- future iPhone build;
- screenshot/recording review;
- founder QA report.

Each row must state:

- demo-only scope;
- no secrets in screenshots/logs;
- no real payments;
- no real loans;
- no escrow release;
- no repayment routing;
- no stablecoin settlement;
- no token collateral;
- no public sharing until founder approval.

## Output 3: Worker Split

`docs/smartcontractor-mobile-kimi-worker-split.md` must define future independent workers:

| Worker | Focus | May Create/Modify | Must Not Touch | Checks |
| --- | --- | --- | --- | --- |

Workers:

- M01 PWA install/offline docs consistency audit.
- M02 Mobile viewport and visible safety-boundary audit.
- M03 Android wrapper/build preflight audit.
- M04 Android emulator and physical device QA evidence audit.
- M05 iOS preflight and Apple-account blocker audit.
- M06 Screenshot, recording, and log redaction audit.
- M07 Mobile release go/no-go and blocker reconciliation.
- M08 Mobile/public beta dependency cross-check.
- M09 Future validator proposal.
- M10 Integrator handoff and Claude review packet.

## Required Safety Conclusions

Every output must preserve these conclusions:

- SmartContractor mobile is demo/PWA-prepared, not native store-release approved.
- Android wrapper exists, but native release remains blocked until local toolchain, debug build, emulator/phone QA, signing, store, Auth/admin, privacy, and real-money disablement evidence are complete.
- iOS remains blocked until Apple Developer, App Store Connect, Mac/Xcode path, certificates/profiles, iOS build QA, privacy/support URLs, and founder approval are ready.
- Production signing keys, Apple credentials, Google Play credentials, Supabase secrets, wallet keys, payment keys, and private user data must never enter chat, docs, screenshots, logs, or git.
- PWA/public beta can be reviewed only as demo/no-real-money until founder/deploy/Auth/admin/legal/provider/security gates pass.
- Mobile must not enable real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral lock/liquidation, production wallet funding, or provider production mode.
- App-store publication and tester distribution remain founder-controlled.

## Commands To Run

Start with:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile
npm run check:pwa-qa
npm run check:mobile-install-readiness
npm run check:android-preflight
npm run check:android-wrapper
npm run check:android-toolchain-preflight
npm run check:founder-android-setup
npm run check:android-debug-build-evidence
npm run check:android-emulator-smoke-evidence
npm run check:android-device-smoke-checklist
npm run check:android-qa
npm run check:ios-preflight
npm run check:mobile-screenshot-redaction
npm run check:mobile-release-blockers
npm run check:mobile-release-go-no-go
npm run check:mobile-founder-qa-report
npm run check:mobile-local-qa-commands
npm run check:mobile-release-evidence
```

If Stream M creates docs only, also run:

```powershell
cd C:\gcsc
git diff --check
```

If a later integrator accepts validator, PWA, Android, iOS, package-script, or evidence changes, run:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile
npm run check:pwa-qa
npm run check:android-preflight
npm run check:android-wrapper
npm run check:ios-preflight
npm run check:mobile-release-blockers
npm run check:mobile-release-go-no-go
npm run check:real-status-audit
npm run check
```

## Definition Of Done

Stream M is done only when:

- mobile readiness audit exists;
- mobile QA device matrix exists;
- worker split exists;
- every required source file is listed as read or explicitly missing;
- every output states local-only/internal status;
- PWA, Android, and iOS are separated clearly;
- Android debug build, emulator smoke, physical phone smoke, toolchain, signing, and store blockers are explicit;
- iOS Apple/Mac/Xcode/certificate/App Store blockers are explicit;
- screenshot/log/evidence redaction is explicit;
- real payment, real loan, escrow, repayment routing, stablecoin settlement, token collateral, and wallet production activity remain blocked;
- no locked files were modified;
- no secrets, external accounts, app-store actions, signing keys, deploys, live Supabase changes, tester invites, public launch, or real-money actions were touched;
- commands run are listed with exact results.

## Handoff To Codex And Claude

After Kimi completes Stream M:

1. Codex reviews the three docs first.
2. Codex checks for locked-file changes and app-store/signing/live-risk claims.
3. Codex runs the Stream M commands and intake checklist.
4. Codex may batch local-only validator, docs, or PWA evidence updates in a later scoped integrator commit.
5. Claude reviews mobile release assumptions and app-store/privacy/signing boundaries before any founder external setup session.
6. Founder approval remains required before Google Play Console, App Store Connect, Apple Developer, production signing keys, release builds, public mobile distribution, tester invites, public URL sharing, deploy/account changes, or real-money features.

## Stop Conditions

Stop and report instead of continuing if Kimi encounters:

- passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, Magic Link URLs, environment variable values, Apple credentials, Google credentials, or keystore material;
- Google Play Console, App Store Connect, Apple Developer, payment-provider, lender, escrow, wallet, or external provider setup requirements;
- production signing key generation, upload, paste, storage, or commit;
- Vercel/GitHub Pages/DNS/Supabase Auth redirect changes;
- live Supabase writes or migrations;
- release APK/AAB/IPA upload or public distribution;
- tester invite sending or public mobile URL publication;
- real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, wallet funding, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, privacy-policy, app-store-review, or public launch decisions;
- need to edit locked files to complete the assigned stream.
