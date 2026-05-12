# SmartContractor Android Device Smoke Checklist

Purpose: verify the SmartContractor Android debug build on a physical Android phone before treating mobile QA as ready. This is local QA only. It does not use Play Console, real payments, real loans, escrow, token collateral, or production provider accounts.

## Scope

- Device: physical Android phone.
- Build source: `C:\gcsc\construction-ai\android`.
- APK: `app-debug.apk` from the local debug build.
- Tools: Android Studio platform tools and `adb`.
- Safety: no secrets, no Play Console, no real payments, no production wallet funds.

## Prerequisites

- Android toolchain preflight is Passed.
- Android debug build evidence is Passed.
- Phone has enough battery or is plugged in.
- USB cable supports data, not only charging.
- The phone is unlocked during the test.

## Phone Setup

1. Open Android phone Settings.
2. Open About phone.
3. Tap Build number 7 times until Developer options are enabled.
4. Go back to Settings.
5. Open Developer options.
6. Turn on USB debugging.
7. Connect the phone to the computer with USB.
8. On the phone, tap Allow USB debugging if Android asks.

## Commands

Run these only from `C:\gcsc\construction-ai`.

```text
cd C:\gcsc\construction-ai
adb devices
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

Expected `adb devices` result:

```text
List of devices attached
<device-id>    device
```

If the result says `unauthorized`, unlock the phone and accept the USB debugging prompt.

## Smoke Checks

| Check | Expected Result | Status |
|-------|-----------------|--------|
| Device detected | `adb devices` shows one physical Android phone as `device` | Blocked / Passed / Failed |
| APK install | `adb install` completes without install error | Blocked / Passed / Failed |
| Launch app | SmartContractor opens on the phone | Blocked / Passed / Failed |
| App shell | Header, navigation, main panels, and buttons fit phone width | Blocked / Passed / Failed |
| Open Bids | User can open or view the bids/jobs flow | Blocked / Passed / Failed |
| Starter Loan | Demo starter loan screen opens without real loan action | Blocked / Passed / Failed |
| Dispute Center | Demo dispute/evidence flow opens without sensitive files | Blocked / Passed / Failed |
| Offline check | With Wi-Fi/mobile data off, offline shell or safe error state appears | Blocked / Passed / Failed |
| WebAuth | WebAuth flow is demo-only; do not use production funds or private wallet data | Blocked / Passed / Failed |
| Rotation | Portrait stays usable; landscape does not hide primary actions | Blocked / Passed / Failed |

## Evidence To Capture

- Phone model.
- Android version.
- APK build date.
- `adb devices` status: Blocked, Passed, or Failed.
- Install status: Blocked, Passed, or Failed.
- Launch status: Blocked, Passed, or Failed.
- One redacted screenshot of the app shell, if safe.
- One short note for any layout issue.

Do not capture or share:

- passwords;
- seed phrases;
- private keys;
- service-role keys;
- database URLs;
- real payment data;
- real wallet balances;
- homeowner or contractor private contact details.

## Stop Conditions

Stop and report Blocked if:

- phone does not appear in `adb devices`;
- phone stays `unauthorized`;
- APK cannot install;
- app opens to a blank screen;
- app asks for production payment, real loan, escrow, or token collateral action;
- any screen exposes secrets or private data.

## Founder Report Back

Use this exact safe format:

```text
Android physical device smoke:
Phone model:
Android version:
adb devices: Blocked / Passed / Failed
APK install: Blocked / Passed / Failed
Launch app: Blocked / Passed / Failed
Offline check: Blocked / Passed / Failed
WebAuth demo-only boundary: Confirmed / Not confirmed
Problems seen:
No secrets shared: Yes / No
```

## Go / No-Go

- Passed: install, launch, layout, offline check, and demo-only WebAuth boundary are all confirmed.
- Review: app launches, but one non-critical layout or usability issue needs fixing.
- No-Go: install fails, launch fails, app is blank, or any real-money/live-risk action appears.
