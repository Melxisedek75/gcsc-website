# SmartContractor Android Debug Build Evidence

Date: 2026-05-12 PT

Purpose: capture safe proof when the local Android debug APK build is attempted after Java and Android SDK are installed.

This is not a Play Store release checklist. It requires no secrets and no Play Console.

## Scope

Android project path:

```text
C:\gcsc\construction-ai\android
```

Expected debug build command:

```powershell
cd C:\gcsc\construction-ai\android
.\gradlew.bat assembleDebug
```

Expected debug APK name:

```text
app-debug.apk
```

Expected debug APK folder:

```text
C:\gcsc\construction-ai\android\app\build\outputs\apk\debug
```

## Toolchain Evidence

Record only safe status. Do not paste secrets.

```text
java -version result:
JAVA_HOME visible: yes/no
ANDROID_HOME visible: yes/no
Android Studio installed: yes/no
Android SDK installed: yes/no
```

## Build Attempt Evidence

Use one status: `Blocked`, `Passed`, or `Failed`.

```text
Build status: Blocked / Passed / Failed
Command used: .\gradlew.bat assembleDebug
APK created: yes/no
APK path:
Request ID or issue ID:
Short note:
```

## If Blocked

Use this when Java, `JAVA_HOME`, `ANDROID_HOME`, Android SDK, or Gradle setup is missing.

```text
Blocked reason:
Next local setup step:
```

Examples:

- Java command not found.
- `JAVA_HOME` is empty.
- `ANDROID_HOME` is empty.
- Android SDK Build Tools missing.
- Gradle cannot download dependencies.

## If Passed

Use this when `gradlew.bat assembleDebug` completes and creates `app-debug.apk`.

```text
Passed evidence:
APK path:
Build timestamp:
Next QA step: emulator install test
```

Do not upload the APK publicly from this step.

## If Failed

Use this when the toolchain exists but the Android build returns an error.

```text
Failed command:
First error line:
Last error line:
Likely file or module:
Next debug step:
```

Do not paste long logs with secrets, private paths, account emails, tokens, or browser tabs.

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

This evidence file allows no Play Console work.

Do not:

- upload APK or AAB files;
- create a Play Store release;
- buy or configure developer accounts;
- enable real payments;
- enable real loans, escrow, or token collateral.

## Founder Report Back

Send only this short status:

```text
Android debug build status: Blocked/Passed/Failed
java -version works: yes/no
JAVA_HOME visible: yes/no
ANDROID_HOME visible: yes/no
APK created: yes/no
First error line if failed:
```
