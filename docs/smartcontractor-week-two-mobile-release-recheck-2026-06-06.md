# SmartContractor Week 2 Mobile Release Recheck

Status: LOCAL_RECHECK_ONLY.

Date: 2026-06-06 PT.

Purpose: give the founder one local-only reading order and report-back block for mobile/PWA release readiness before any Android, iOS, TestFlight, Play Console, App Store Connect, signing, screenshot sharing, tester invite, public URL share, public mobile release, production deploy, or live finance action.

This recheck does not approve Android store release, iOS store release, TestFlight upload, Play Console action, App Store Connect action, Apple Developer action, signing-key upload, certificate creation, provisioning-profile creation, keystore handling, store metadata change, screenshot publication, tester invite, public URL sharing, public mobile release, production deploy, live Supabase write, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signature, FIO registration, legal/provider conclusion, provider commitment, or production action.

## Source Documents And Surfaces

Read in this order:

1. `docs/smartcontractor-mobile-roadmap.md`
2. `docs/smartcontractor-pwa-qa-checklist.md`
3. `docs/smartcontractor-mobile-release-evidence.md`
4. `docs/smartcontractor-mobile-release-blockers.md`
5. `docs/smartcontractor-mobile-release-go-no-go-matrix.md`
6. `docs/smartcontractor-android-debug-build-evidence.md`
7. `docs/smartcontractor-android-emulator-smoke-evidence.md`
8. `docs/smartcontractor-android-device-smoke-checklist.md`
9. `docs/smartcontractor-ios-preflight.md`
10. `docs/smartcontractor-mobile-screenshot-redaction-checklist.md`
11. `docs/smartcontractor-mobile-founder-qa-report-template.md`
12. `docs/smartcontractor-mobile-local-qa-commands.md`

Local Admin surfaces:

- `/api/admin/mobile-install-readiness`
- `/api/admin/week-two-mobile-release-readiness`
- `/api/admin/week-two-mobile-release-execution-checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=mobile_install_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_execution_checklist`

## Week 2 Mobile Recheck Sequence

1. Confirm PWA install/offline readiness from local evidence only: manifest, service worker, offline shell, mobile viewport checks, and no API caching.
2. Confirm Android toolchain status: JDK 17, `JAVA_HOME`, `ANDROID_HOME`, Android SDK tooling, debug build command, and blocker reason.
3. Confirm Android debug build evidence status: `Blocked`, `Passed`, or `Failed`, with no APK upload or Play Console action.
4. Confirm Android emulator and physical phone smoke status: local-only evidence, no private device data, no raw screenshots in tracked docs.
5. Confirm iOS preflight status: Apple Developer, App Store Connect, Team ID, Mac/Xcode path, certificates, provisioning profiles, and iPhone/simulator plan remain founder-controlled.
6. Confirm screenshot and recording redaction: no Magic Link tokens, account tabs, device identifiers, private customer data, wallet data, payment data, keys, raw logs, or unredacted screenshots in tracked docs.
7. Confirm build artifact provenance: platform, artifact type, build id, source commit, generated time, builder owner, signing mode, package or bundle id, QA evidence file, disabled real-money evidence, and rollback or hold decision.
8. Confirm developer account and store submission gates remain internal only unless the exact standalone phrases are recorded with non-secret fields.
9. Confirm real-money features are disabled or explicitly held: no real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, token custody, XPR signature, or production wallet activity.
10. Confirm any mobile release decision remains founder-drafting only and never becomes store submission, signing upload, public release, or live action approval.

## Current Hold State Matrix

| Area | Current local state | Required founder-controlled evidence | Default if missing |
| --- | --- | --- | --- |
| PWA install/offline | PWA shell and checklist exist | local install/offline result, viewport result, no-API-cache confirmation | REVIEW_PWA_EVIDENCE |
| Android toolchain | Android wrapper prepared | JDK 17, `JAVA_HOME`, `ANDROID_HOME`, SDK tooling, blocker or pass evidence | HOLD_FOR_ANDROID_TOOLCHAIN |
| Android debug build | Evidence template exists | `gradlew.bat assembleDebug` result, APK created yes/no, source commit, blocked reason | HOLD_FOR_ANDROID_DEBUG_BUILD |
| Android emulator/phone smoke | Smoke templates exist | emulator or phone run result, redaction status, no private device data | HOLD_FOR_DEVICE_QA |
| iOS preflight | Preflight doc exists | Apple/Mac/Xcode/signing owner and blocked action recorded | HOLD_FOR_IOS_PREP |
| Screenshot redaction | Redaction checklist exists | screenshot folder, reviewer, private-data status, redaction decision | HOLD_FOR_SCREENSHOT_REDACTION |
| Build artifact provenance | Go/no-go matrix defines boundary | platform, artifact type, build id, source commit, signing mode, QA evidence | HOLD_FOR_ARTIFACT_PROVENANCE_REVIEW |
| Developer account action | Phrase boundary exists | standalone phrase plus platform, scope, owner, evidence file, blocked action | BLOCKED_FOR_DEVELOPER_ACCOUNT_ACTION |
| Store submission | Decision gate exists | standalone store-submission readiness fields and founder-controlled account owner | BLOCKED_FOR_STORE_SUBMISSION |
| Live finance / release | Must stay blocked | disabled real-money evidence and rollback owner | BLOCKED_FOR_LIVE_OR_PUBLIC_RELEASE |

## Founder Safe Report-Back

Use this exact shape after local review. Do not paste secrets, Magic Link URLs, Auth tokens, account emails, device identifiers, signing data, certificates, provisioning profiles, keystore material, screenshots, app-store links, payment data, wallet data, raw logs, or external account instructions.

```text
Mobile Release Week 2 Recheck
Scope: local prep only
PWA install/offline:
Android toolchain:
Android debug build:
Android emulator smoke:
Android physical phone smoke:
iOS preflight:
screenshot_redaction_status:
build_artifact_provenance_status:
developer_account_action_requested: no
store_submission_requested: no
tester_invite_requested: no
public_url_share_requested: no
public_mobile_release_requested: no
real_payment_or_loan_or_escrow_action_taken: no
repayment_or_stablecoin_or_token_collateral_action_taken: no
token_or_xpr_or_fio_action_taken: no
legal_or_provider_conclusion_made: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

Use `READY_FOR_FOUNDER_STORE_PREP_REVIEW` only when PWA evidence, Android blocker/build status, device QA status, iOS preflight status, screenshot redaction status, build artifact provenance, disabled real-money evidence, rollback owner, latest check run, and blocked next action are recorded.

Use `REVIEW_BLOCKERS` when a local owner can update missing PWA, Android, iOS, screenshot, provenance, QA, or report-back evidence without touching accounts, signing, store actions, public release, live finance, legal/provider decisions, or production.

Use `HOLD_FOR_ANDROID_TOOLCHAIN` when JDK 17, `JAVA_HOME`, `ANDROID_HOME`, Android SDK tooling, Gradle, emulator, or phone evidence is missing.

Use `HOLD_FOR_IOS_PREP` when Apple Developer, App Store Connect, Team ID, Mac/Xcode, certificates, provisioning profiles, bundle id, or iPhone/simulator path is missing.

Use `HOLD_FOR_DEVICE_QA` when emulator, physical phone, screenshot redaction, private-data review, or build artifact provenance is missing.

Use `NO_GO` when public mobile release, store submission, signing upload, tester distribution, real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, XPR signature, legal/provider decision, or production readiness is requested before required founder-controlled evidence exists.

## Exact Phrase Boundaries

`MOBILE_RELEASE_DECISION_RECORDED` is required before any mobile release decision can move beyond internal review. It does not approve store submission, signing upload, Play Console action, App Store Connect action, TestFlight upload, production deploy, real payments, real loans, escrow, token collateral, legal/provider decisions, or public launch.

`MOBILE_DEVELOPER_ACCOUNT_ACTION_RECORDED` is required before a bounded founder-controlled developer account readiness action can move beyond internal prep. It does not approve creating, modifying, or paying for Apple Developer, App Store Connect, Google Play Console, signing, TestFlight, Play testing, store metadata, production deploy, live Supabase, finance, legal/provider, or public launch actions.

`MOBILE_STORE_SUBMISSION_DECISION_GATE` is a founder-present internal store-submission readiness gate only. It does not approve Play Console action, App Store Connect action, TestFlight upload, signing-key upload, production metadata change, store submission, public mobile release, production deploy, live Supabase change, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, legal decision, or provider commitment.

## Codex Scope

Codex may update local docs, local validators, local evidence templates, local Admin readiness checklists, and safe report-back templates.

Codex must stop before Android store release, iOS store release, TestFlight upload, Play Console action, App Store Connect action, Apple Developer action, signing-key upload, certificate creation, provisioning-profile creation, keystore handling, store metadata change, screenshot publication, tester invite, public URL sharing, public mobile release, production deploy, live Supabase write, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR signature, FIO registration, legal/provider conclusion, provider commitment, external account login, paid developer account setup, public launch, production, or destructive action.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:week-two-mobile-release-recheck
npm run check:mobile
npm run check:pwa-qa
npm run check:mobile-install-readiness
npm run check:android-debug-build-evidence
npm run check:android-emulator-smoke-evidence
npm run check:android-device-smoke-checklist
npm run check:ios-preflight
npm run check:mobile-screenshot-redaction
npm run check:mobile-release-blockers
npm run check:mobile-release-go-no-go
npm run check:mobile-founder-qa-report
npm run check:mobile-local-qa-commands
npm run check:mobile-release-evidence
npm run check:smartcontractor
npm run check:auth
```

## Acceptance Check

This recheck passes only when the founder has one local-only mobile release reading order, a safe no-secret/no-device-private-data report-back block, READY/REVIEW/HOLD/NO-GO states, PWA install/offline evidence boundary, Android toolchain/debug/emulator/phone boundaries, iOS preflight boundary, screenshot redaction boundary, build artifact provenance boundary, developer account and store submission phrase boundaries, disabled real-money boundary, and explicit no-Android-store-release, no-iOS-store-release, no-TestFlight-upload, no-Play-Console-action, no-App-Store-Connect-action, no-Apple-Developer-action, no-signing-key-upload, no-certificate-creation, no-provisioning-profile-creation, no-keystore-handling, no-store-metadata-change, no-screenshot-publication, no-tester-invite, no-public-URL-share, no-public-mobile-release, no-production-deploy, no-live-Supabase-write, no-real-payment, no-real-loan, no-real-escrow, no-repayment-routing, no-stablecoin-settlement, no-token-collateral, no-XPR-signature, no-FIO-registration, no-legal/provider-conclusion, no-provider-commitment, and no-production boundaries.
