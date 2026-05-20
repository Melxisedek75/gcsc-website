# SmartContractor Mobile Release Go/No-Go Matrix

Purpose: give the founder one simple mobile release decision table for Android, iOS, and PWA status. This keeps SmartContractor honest: mobile can be demo-ready while still blocked for native public release.

This matrix is a review tool only. It does not approve Play Store release, App Store release, production signing keys, real payments, real loans, escrow, token collateral, or production wallet activity.

## Decision States

| State | Meaning |
|-------|---------|
| Go | Safe for the stated demo/release scope. |
| Review | Mostly ready, but one non-critical issue or founder decision remains. |
| No-Go | Blocked by build, QA, store, Auth, legal, payment, secret, or safety risk. |

## Matrix

| Gate | Required Evidence | Current Default | Founder Decision |
|------|-------------------|-----------------|------------------|
| PWA install | PWA install checklist and mobile install readiness are Passed | Review | Go / Review / No-Go |
| offline shell | Offline fallback opens without blank screen or cached API leakage | Review | Go / Review / No-Go |
| Android debug build | `gradlew.bat assembleDebug` evidence shows Passed | No-Go | Go / Review / No-Go |
| Android emulator smoke | Emulator install, launch, layout, offline, and WebAuth demo-only checks are Passed | No-Go | Go / Review / No-Go |
| Android physical phone smoke | Physical Android phone USB debugging, `adb devices`, APK install, launch, layout, and offline checks are Passed | No-Go | Go / Review / No-Go |
| iOS preflight | Apple Developer, Xcode/Mac path, bundle id, certificates/profiles, and iPhone/simulator plan are ready | No-Go | Go / Review / No-Go |
| screenshot redaction | Android/iOS screenshots and recordings are reviewed, redacted, and approved for intended audience | Review | Go / Review / No-Go |
| store accounts | Google Play Console and App Store Connect are founder-controlled and ready | No-Go | Go / Review / No-Go |
| production signing keys | Signing keys/certificates exist outside chat and are never committed | No-Go | Go / Review / No-Go |
| real payments disabled | Real payment capture is disabled or blocked for mobile demo/public beta | No-Go until confirmed | Go / Review / No-Go |
| real loans disabled | Real loan origination is disabled or blocked for mobile demo/public beta | No-Go until confirmed | Go / Review / No-Go |
| escrow disabled | Escrow release is disabled or blocked for mobile demo/public beta | No-Go until confirmed | Go / Review / No-Go |
| token collateral disabled | Token collateral lock/liquidation is disabled or blocked for mobile demo/public beta | No-Go until confirmed | Go / Review / No-Go |

## Automatic No-Go Conditions

Mobile release is No-Go if any of these are true:

- Android debug build does not exist or does not install.
- Android app opens to a blank screen.
- Android emulator smoke is not completed and no physical phone smoke is completed.
- iOS release is being considered without Apple Developer/App Store Connect readiness.
- production signing keys are pasted into chat, committed, or exposed in screenshots.
- screenshots or recordings contain secrets, private contact details, wallet data, payment data, database URLs, API keys, or magic links.
- real payments disabled is not confirmed.
- real loans disabled is not confirmed.
- escrow disabled is not confirmed.
- token collateral disabled is not confirmed.

## Mobile Store Listing Evidence Boundary

Do not submit Android or iOS store listings, upload signing keys, change app-store metadata, or publish a production/mobile release from Codex.

store screenshots, listing text, package IDs, bundle IDs, signing evidence, and reviewer notes stay founder-controlled until redacted and approved.

demo-only mobile evidence must not include secrets, private tester data, payment data, wallet data, Magic Link tokens, service-role keys, raw logs, or unredacted screenshots.

any store account, signing, reviewer, production listing, public release, or paid developer account step stays BLOCKED_FOR_EXTERNAL_ACTION.

## Mobile Founder Release Approval Phrase Boundary

A mobile release decision is not actionable unless the founder records the exact standalone phrase MOBILE_RELEASE_DECISION_RECORDED with platform, scope, build identifier, evidence file, disabled real-money confirmation, rollback owner, and decision.

Screenshots, chats, voice notes, old approvals, bundled deployment approvals, or informal Go messages must stay Review until the exact phrase and evidence fields are present.

MOBILE_RELEASE_DECISION_RECORDED does not approve store submission, signing-key upload, Play Console actions, App Store Connect actions, production deploy, real payments, real loans, escrow, token collateral, legal decisions, or public launch.

## Mobile Build Artifact Provenance Boundary

Every mobile build artifact considered for founder QA or release review must record platform, artifact_type, build_id, source_commit, generated_at, builder_owner, signing_mode, package_or_bundle_id, QA_evidence_file, disabled_real_money_evidence, and rollback_or_hold_decision.

Copied APKs, old TestFlight builds, stale screenshots, unsigned files, unknown signing state, cloud build links, or artifacts from a different commit default to HOLD_FOR_ARTIFACT_PROVENANCE_REVIEW.

A debug APK, local simulator build, emulator screenshot, or PWA install proof cannot be converted into App Store, Play Console, TestFlight, production signing, tester distribution, or public mobile release approval.

Mobile artifact provenance review never approves signing keys, Apple Developer setup, Play Console setup, store submission, public release notes, live Supabase changes, production payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch.

## Mobile Founder Store Submission Decision Gate

MOBILE_STORE_SUBMISSION_DECISION_GATE is a founder-present internal store-submission readiness decision before any Android, iOS, TestFlight, Play Console, or App Store Connect action.

Before founder-controlled store action, record platform, release channel, build_id, source_commit, package_or_bundle_id, store_account_owner, signing_owner, screenshot_redaction_evidence, disabled_real_money_evidence, QA_evidence_file, latest_check_run, rollback_owner, and blocked_next_action.

No Play Console action, App Store Connect action, TestFlight upload, signing-key upload, production metadata change, store submission, public mobile release, production deploy, live Supabase change, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, legal decision, or provider commitment is approved by this gate.

## Founder Decision Template

Use this safe report format:

```text
Mobile release go/no-go:
PWA install: Go / Review / No-Go
offline shell: Go / Review / No-Go
Android debug build: Go / Review / No-Go
Android emulator smoke: Go / Review / No-Go
Android physical phone smoke: Go / Review / No-Go
iOS preflight: Go / Review / No-Go
screenshot redaction: Go / Review / No-Go
store accounts: Go / Review / No-Go
production signing keys: Go / Review / No-Go
real payments disabled: Go / Review / No-Go
real loans disabled: Go / Review / No-Go
escrow disabled: Go / Review / No-Go
token collateral disabled: Go / Review / No-Go
Founder Decision: Go / Review / No-Go
```

## Recommended Current Decision

Current recommended state: Review for PWA demo, No-Go for native Android/iOS public release.

Reason: the Android wrapper and documents are prepared, but local Java/Android SDK debug build evidence, emulator/phone smoke, store accounts, signing, and live-risk disablement proof still need completion before native release.
