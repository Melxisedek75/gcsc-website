# SmartContractor Mobile Release Blockers

Purpose: keep Android and iOS release status honest. SmartContractor has a strong PWA/mobile foundation, but native mobile release must remain blocked until the required local build, QA, signing, store, Auth, and live-risk gates are finished.

This document is a planning and safety gate only. It does not approve Google Play Console publishing, App Store Connect publishing, production signing keys, real payments, real loans, escrow, token collateral, or production wallet activity.

Hard rule: no real payments, no real loans, no escrow, and no token collateral in native mobile QA or public mobile release until founder/legal/provider approval is complete.

## Current Mobile State

| Area | State | Notes |
|------|-------|-------|
| PWA shell | Prepared | Mobile responsive app shell and install readiness are validated locally. |
| Android wrapper | Prepared | Capacitor Android project exists under `C:\gcsc\construction-ai\android`. |
| Android toolchain | Blocked locally | JDK 17, `JAVA_HOME`, `ANDROID_HOME`, and Android SDK tooling must be installed/configured before a real debug build is trusted. |
| Android debug APK | Blocked until toolchain | `gradlew.bat assembleDebug` must pass locally before APK QA is considered real. |
| Android emulator smoke | Prepared, not completed | The emulator smoke checklist exists, but needs a real emulator/device run. |
| Android physical phone smoke | Prepared, not completed | The physical Android phone checklist exists, but needs a real phone run. |
| iOS wrapper | Blocked | Requires Apple Developer account, Mac/Xcode path, certificates/profiles, and founder approval. |
| Store release | Blocked | Google Play Console and App Store Connect are founder/external account steps. |

## Android Blockers

Android must stay blocked until all of these are true:

- JDK 17 is installed.
- `JAVA_HOME` points to the JDK 17 install folder.
- `ANDROID_HOME` points to the Android SDK folder.
- Android SDK platform tools are available.
- `adb devices` can see an emulator or physical Android phone.
- `gradlew.bat assembleDebug` passes from `C:\gcsc\construction-ai\android`.
- `app-debug.apk` installs on an emulator or physical Android phone.
- emulator smoke is Passed or explicitly documented as Blocked with reason.
- physical Android phone smoke is Passed or explicitly documented as Blocked with reason.
- screenshots or recordings are redacted before sharing.
- no real payments, real loans, escrow, token collateral, or production wallet funds are used.

## iOS Blockers

iOS must stay blocked until all of these are true:

- Apple Developer account is available.
- App Store Connect access is available.
- Mac/Xcode build path is selected.
- Bundle identifier is approved.
- certificates and provisioning profiles are created by the founder or approved account owner.
- production signing keys are handled outside chat and never committed.
- iOS build can run locally or through a trusted CI path.
- iPhone or simulator smoke test is documented.
- no real payments, real loans, escrow, token collateral, or production wallet funds are used.

## Store Release Blockers

Do not start public store release until:

- public beta web/PWA is stable;
- Supabase Auth founder path is confirmed;
- admin membership is activated with founder approval;
- strict RLS/admin smoke tests are passed;
- privacy policy and support contact are ready;
- screenshot set is redacted and approved;
- app description avoids token-price promises, loan approval promises, and regulated financial claims;
- Google Play Console setup is founder-controlled;
- App Store Connect setup is founder-controlled.

## Live-Risk Blockers

Mobile release must not enable:

- real payment capture;
- real loan origination;
- escrow release;
- automatic repayment;
- token collateral lock;
- liquidation;
- production wallet funding;
- production payment provider keys;
- live Supabase migrations;
- RLS replacement;
- admin role assignment.

These stay founder/legal/provider controlled.

## Founder Go / No-Go

Use this decision line before any public mobile sharing:

```text
Mobile release decision:
Android debug build: Blocked / Passed / Failed
Android emulator smoke: Blocked / Passed / Failed
Android physical phone smoke: Blocked / Passed / Failed
iOS preflight: Blocked / Passed / Failed
Store accounts: Blocked / Ready
Screenshots redacted: Blocked / Approved
Real-money features disabled: Confirmed / Not confirmed
Founder Go / No-Go: Go / Review / No-Go
```

## Safe Next Step

The next safe mobile step is local only:

1. Install JDK 17.
2. Set `JAVA_HOME`.
3. Install Android Studio SDK tools.
4. Set `ANDROID_HOME`.
5. Run `gradlew.bat assembleDebug`.
6. Capture Android debug build evidence.
7. Run emulator smoke.
8. Run physical Android phone smoke if a phone is available.

Do not touch Google Play Console, App Store Connect, production signing keys, production payment keys, live Supabase settings, real payments, real loans, escrow, or token collateral during this step.
