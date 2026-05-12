# SmartContractor Mobile Local QA Commands

Purpose: give the founder one safe Windows command list for local mobile QA. This is a checklist for evidence only; it does not publish Android/iOS apps or activate real payments.

## No Secrets

Do not paste passwords, API keys, Supabase service-role keys, database passwords, Magic Link URLs, private keys, seed phrases, signing keys, wallet secrets, or payment provider secrets into the terminal or chat.

Do not run Play Store, App Store, payment provider, loan, escrow, or token-collateral commands from this checklist.

## Start Here

Open PowerShell and run:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile-install-readiness
npm run check:android-wrapper
npm run check:android-toolchain-preflight
```

Expected result:

- the checks pass, or
- `check:android-toolchain-preflight` clearly says Java/Android SDK is missing.

## Android Evidence Commands

After Java 17 and Android Studio are installed locally, run:

```powershell
cd C:\gcsc\construction-ai\android
.\gradlew.bat assembleDebug
```

Then return to the project and run:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-debug-build-evidence
npm run check:android-emulator-smoke-evidence
npm run check:android-device-smoke-checklist
```

Safe report back only the status and APK path if available. Do not attach signing keys or any secret file.

## Screenshot And Release Commands

Before sharing any screenshot, recording, request ID, or mobile QA note, run:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile-screenshot-redaction
npm run check:mobile-release-go-no-go
npm run check:mobile-founder-qa-report
```

Use request ID only as a short evidence pointer. Do not paste authorization headers, cookies, Magic Link URLs, database URLs, or request bodies.

## Full Local Check

Run this before telling Codex that mobile QA is ready:

```powershell
cd C:\gcsc\construction-ai
npm run check
```

## Required Safe Confirmations

Mobile public beta or native release remains blocked until these are confirmed:

- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled;
- screenshots and recordings redacted;
- Android debug build, emulator smoke, and/or physical phone smoke evidence captured;
- iOS preflight reviewed before any iOS release work.

## Safe Founder Report

Use this short format:

```text
Mobile local QA commands:
npm run check: passed / failed
Android debug build: passed / failed / blocked
Android emulator smoke: passed / failed / blocked
Android physical phone smoke: passed / failed / blocked
request ID: none / safe request ID only
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
```
