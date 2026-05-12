# SmartContractor Android Emulator Smoke Evidence

Date: 2026-05-12 PT

Purpose: capture safe proof that the local SmartContractor Android debug APK opens and basic demo flows work in an Android emulator or a connected Android phone.

This is local QA only. It requires no secrets and no Play Console.

## Prerequisites

Use this only after:

- Android debug build produced `app-debug.apk`.
- Android Studio emulator or Android phone is available.
- Android SDK Platform Tools are installed.

Android project path:

```text
C:\gcsc\construction-ai\android
```

Expected APK name:

```text
app-debug.apk
```

## Device Check

Run:

```powershell
adb devices
```

Record only safe status:

```text
Device visible: yes/no
Device type: emulator/phone
```

Do not include phone serial numbers in public notes.

## Install APK

Run from the APK output folder:

```powershell
adb install -r app-debug.apk
```

Record:

```text
Install status: Blocked / Passed / Failed
First error line if failed:
```

## Launch app

Open SmartContractor on the emulator or phone.

Record:

```text
Launch app status: Blocked / Passed / Failed
First visible screen:
Navigation works: yes/no
```

## Demo Flow Smoke Checks

Check only demo-safe screens:

```text
Open jobs screen: passed/failed
Submit bid demo flow: passed/failed
Starter loan demo screen: passed/failed
Dispute center demo screen: passed/failed
Peer review demo screen: passed/failed
Admin readiness screen: passed/failed
```

Do not test real payments, real loans, escrow, token collateral, or live Supabase role changes here.

## Offline check

Turn off emulator/phone internet and reopen the app.

Record:

```text
Offline shell loads: yes/no
Offline fallback visible: yes/no
No sensitive data shown offline: yes/no
```

## WebAuth

Record only demo-safe status:

```text
WebAuth button visible: yes/no
WebAuth real wallet connection attempted: no
```

Do not connect a real wallet during this smoke check.

## Safety Rules

This evidence file allows no secrets.

Do not include:

- Google passwords.
- Play Console credentials.
- signing keystore passwords.
- Supabase keys.
- payment provider keys.
- wallet seed phrases.
- private API keys.
- raw phone serial numbers.

This evidence file allows no Play Console work.

Do not:

- upload APK or AAB files;
- create a Play Store release;
- publish screenshots with private data;
- enable real payments;
- enable real loans, escrow, or token collateral.

## Founder Report Back

Send only this short status:

```text
Android emulator smoke status: Blocked/Passed/Failed
adb devices works: yes/no
adb install works: yes/no
Launch app works: yes/no
Offline shell works: yes/no
Main failed screen if any:
```
