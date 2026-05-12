# Founder Android Setup Checklist

Date: 2026-05-12 PT

Purpose: give the founder a simple step-by-step path to prepare this Windows computer for building the SmartContractor Android debug APK.

This checklist is only for local Android build setup. It requires no secrets and no Play Console.

## Before You Start

Do not paste passwords into chat.

Do not share:

- Google password.
- Supabase keys.
- payment keys.
- wallet seed phrase.
- Android signing password.
- private API keys.

This checklist does not require Google Play Console and does not publish the app.

## Step 1 - Install JDK 17

Goal: make `java -version` work in PowerShell.

What to do:

1. Install JDK 17 or newer.
2. After install, restart PowerShell.
3. Run:

```powershell
java -version
```

Good result:

```text
java version "17..."
```

If PowerShell says Java is not recognized, `JAVA_HOME` or PATH is not ready yet.

## Step 2 - Set JAVA_HOME

Goal: make Windows tell Gradle where Java is installed.

Check it:

```powershell
echo $env:JAVA_HOME
```

Good result: it prints a JDK folder path.

Example shape:

```text
C:\Program Files\Java\jdk-17
```

Do not paste any password here. `JAVA_HOME` is only a folder path.

## Step 3 - Install Android Studio

Goal: install Android SDK tools safely.

What to do:

1. Install Android Studio.
2. Open Android Studio once.
3. Let it install Android SDK, Platform Tools, and Build Tools.
4. Do not create a Play Console release.
5. Do not upload anything.

## Step 4 - Set ANDROID_HOME

Goal: make Windows tell Gradle where Android SDK is installed.

Check it:

```powershell
echo $env:ANDROID_HOME
```

Good result: it prints an Android SDK folder path.

Example shape:

```text
C:\Users\rivne\AppData\Local\Android\Sdk
```

Do not paste passwords. `ANDROID_HOME` is only a folder path.

## Step 5 - Run Safe Project Checks

From PowerShell:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-wrapper
npm run check:android-toolchain-preflight
npm run check:founder-android-setup
```

Good result: all three checks pass.

## Step 6 - Try The Local Android Debug Build

Run:

```powershell
cd C:\gcsc\construction-ai\android
.\gradlew.bat assembleDebug
```

Good result: Gradle creates a debug APK locally.

Expected APK folder:

```text
C:\gcsc\construction-ai\android\app\build\outputs\apk\debug
```

This is a local debug build only. It is not a public Android release.

## Report Back

Send only this safe status:

```text
java -version works: yes/no
JAVA_HOME visible: yes/no
ANDROID_HOME visible: yes/no
android wrapper check: passed/failed
assembleDebug result: passed/failed
```

Do not send screenshots that show passwords, tokens, browser tabs with private accounts, or hidden files.
