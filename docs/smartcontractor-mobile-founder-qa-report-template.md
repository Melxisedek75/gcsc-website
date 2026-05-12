# SmartContractor Mobile Founder QA Report Template

Purpose: give the founder one safe report format after testing SmartContractor on PWA, Android, and iOS paths. This is for demo/mobile QA evidence only.

This template does not approve App Store release, Play Store release, production signing keys, real payments, real loans, escrow, token collateral, or production wallet activity.

## No Secrets

Do not paste or attach:

- passwords, API keys, service-role keys, private keys, seed phrases, database URLs, or Magic Link URLs;
- raw wallet data, payment card data, payment provider secrets, or signing key material;
- unredacted names, phone numbers, emails, home addresses, job addresses, or account IDs;
- unredacted screenshots showing browser tabs, request bodies, authorization headers, or environment variables.

## Safe Report-Back

Use this exact short format when reporting mobile QA back to Codex:

```text
SmartContractor mobile QA:
PWA install: Not tested / Passed / Failed / Blocked
offline shell: Not tested / Passed / Failed / Blocked
Android debug build: Not tested / Passed / Failed / Blocked
Android emulator smoke: Not tested / Passed / Failed / Blocked
Android physical phone smoke: Not tested / Passed / Failed / Blocked
iOS preflight: Not tested / Passed / Failed / Blocked
request ID captured: none / request ID only, no secrets
screenshot redaction: Not needed / Passed / Needs review / Blocked
real payments disabled: Confirmed / Not confirmed
real loans disabled: Confirmed / Not confirmed
escrow disabled: Confirmed / Not confirmed
token collateral disabled: Confirmed / Not confirmed
Founder Decision: Go / Review / No-Go
Notes: one short sentence, no secrets
```

## Evidence Checklist

| Area | Evidence to capture | Safe value |
|------|---------------------|------------|
| PWA install | Installed/opened app shell on mobile browser | Passed / Failed / Blocked |
| offline shell | App opens offline without blank screen or cached API data | Passed / Failed / Blocked |
| Android debug build | `gradlew.bat assembleDebug` status and APK path only | Passed / Failed / Blocked |
| Android emulator smoke | Emulator install, launch, layout, offline shell, demo-only WebAuth | Passed / Failed / Blocked |
| Android physical phone smoke | USB debugging, `adb devices`, install, launch, layout, offline shell | Passed / Failed / Blocked |
| iOS preflight | Apple Developer/App Store Connect/Xcode path readiness | Passed / Failed / Blocked |
| request ID | One safe request ID from failed/interesting API response | request ID only, no headers |
| screenshot redaction | Screenshots/recordings reviewed before sharing | Passed / Needs review / Blocked |

## Automatic No-Go

Founder Decision should be No-Go if any of these are true:

- Android debug build is missing or will not install.
- Android emulator smoke and Android physical phone smoke are both missing.
- PWA opens to a blank screen.
- offline shell is not verified.
- screenshots contain secrets, payment data, wallet data, private contact details, home addresses, or database/API URLs.
- real payments disabled is not confirmed.
- real loans disabled is not confirmed.
- escrow disabled is not confirmed.
- token collateral disabled is not confirmed.
- iOS release is considered before Apple Developer/App Store Connect/certificates are ready.

## Recommended Next Action

If the report is mostly Passed but one gate is Blocked, keep the release state as Review and fix only that gate.

If any real-money disablement line is Not confirmed, keep the release state as No-Go until the founder can verify the demo/public beta cannot move real funds.
