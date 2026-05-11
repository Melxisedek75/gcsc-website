# SmartContractor Android QA Runbook

Date: 2026-05-06

Purpose: define a safe local QA path for the future Android wrapper without touching live accounts, Google Play, real payments, real loans, escrow, token collateral, or Supabase production data.

## Scope

This runbook is for local developer QA only.

It allows:

- checking the PWA shell before native wrapping;
- generating or syncing the Android wrapper only after `npm run check:android-preflight` passes;
- running an emulator smoke test when Android Studio/SDK is already installed by the machine owner;
- collecting screenshots and logs for review.

It does not allow:

- Google Play Console upload;
- signing release builds with production keys;
- live Supabase migrations or policy changes;
- real payment provider production mode;
- real lending, escrow, loan repayment, or token collateral actions;
- entering secrets into frontend files, Android assets, screenshots, logs, or chat.

## Required Local Checks

Run from:

```powershell
cd C:\gcsc\construction-ai
npm run check
```

The full local gate must pass before emulator QA. At minimum, the Android path depends on:

- `npm run check:pwa-qa`;
- `npm run check:android-preflight`;
- `npm run check:android-qa`;
- `npm run check:strict-gates`;
- `npm run check:founder-boundaries`.

## Emulator Smoke Path

Only run this section when Android Studio and an emulator already exist locally.

1. Start the local SmartContractor server from `C:\gcsc\construction-ai`.
2. Open the Android emulator.
3. Install or launch the debug Android wrapper if it already exists.
4. Verify the app opens the SmartContractor PWA entry screen.
5. Test only demo-mode flows: open jobs, bids, loan scoring display, dispute center, evidence metadata, peer review, admin readiness screens.
6. Confirm strict/live-risk actions remain blocked or marked as founder-only.
7. Capture screenshots for mobile layout issues only.
8. Collect logs only after confirming they do not contain tokens, cookies, API keys, passwords, seed phrases, service-role keys, or private keys.

## Pass Criteria

- PWA install shell loads on mobile viewport or emulator.
- No visible text overlaps on the main demo path.
- Offline page works after service worker installation.
- Founder-only actions remain labeled as founder-only or blocked.
- No real payment, real loan, real escrow, or token collateral action can be executed from the QA path.
- No secret-like values appear in public assets, screenshots, logs, or Android docs.

## Founder Action Step

If emulator tooling is not installed, the founder should install Android Studio later. Do not install system-level SDKs or accept external account prompts from this automation worker.
