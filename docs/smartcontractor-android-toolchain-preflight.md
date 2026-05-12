# SmartContractor Android Toolchain Preflight

Date: 2026-05-12 PT

Purpose: document the local machine checks required before building the generated Android wrapper into a debug APK.

This is a local preflight only. It does not connect to Google Play, does not change external accounts, and does not handle secrets.

## Current Wrapper

Android wrapper path:

```text
C:\gcsc\construction-ai\android
```

Generated wrapper status:

- Capacitor Android wrapper exists.
- SmartContractor web assets are bundled from the PWA shell.
- Package identity remains `com.gcsc.smartcontractor`.
- Wrapper structure is validated by `npm run check:android-wrapper`.

## Required Local Tools

Before running a real Android debug build, the computer needs:

- JDK 17 or newer.
- `JAVA_HOME` pointed to the JDK folder.
- Android Studio or Android SDK command-line tools.
- `ANDROID_HOME` pointed to the Android SDK folder.
- Android SDK Platform Tools.
- Android SDK Build Tools.
- One emulator or connected Android phone for later QA.

## Read-Only Checks

Run these from PowerShell when the founder is ready to set up Android tooling:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-wrapper
java -version
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
cd C:\gcsc\construction-ai\android
.\gradlew.bat assembleDebug
```

Expected meaning:

- `java -version` should print the installed JDK version.
- `JAVA_HOME` should show the JDK install folder.
- `ANDROID_HOME` should show the Android SDK folder.
- `gradlew.bat assembleDebug` should build a local debug APK after Java and Android SDK are installed.

## Current Blocker

On 2026-05-12, `gradlew.bat assembleDebug` was attempted locally and stopped because Java was not available and `JAVA_HOME` was not set.

This is not a SmartContractor code failure. It is a local Android toolchain setup blocker.

## Safety Boundaries

This preflight requires no secrets.

Do not paste or store:

- Google account passwords.
- Play Console credentials.
- signing keystore passwords.
- Supabase keys.
- payment provider keys.
- wallet seed phrases.

This preflight requires no Play Console.

Do not:

- upload an APK or AAB;
- create a Play Console release;
- create a paid Google developer account;
- connect production payments;
- enable real loans, escrow, or token collateral.

## Founder Action Step

When ready, the founder should do this step-by-step:

1. Install JDK 17 or newer.
2. Install Android Studio.
3. Open Android Studio once so it installs Android SDK tools.
4. Set `JAVA_HOME` to the JDK folder.
5. Set `ANDROID_HOME` to the Android SDK folder.
6. Restart PowerShell.
7. Run `java -version`.
8. Run `echo $env:JAVA_HOME`.
9. Run `echo $env:ANDROID_HOME`.
10. Run:

```powershell
cd C:\gcsc\construction-ai\android
.\gradlew.bat assembleDebug
```

Report back only non-secret status:

```text
java -version works: yes/no
JAVA_HOME visible: yes/no
ANDROID_HOME visible: yes/no
assembleDebug result: passed/failed
```
