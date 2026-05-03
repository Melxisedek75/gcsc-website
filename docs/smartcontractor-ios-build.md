# SmartContractor iOS Build Plan

Статус: planning document для iPhone/iOS направления. Это не готовая iOS app.

## Strategy

SmartContractor MVP идёт по стратегии:

1. PWA first.
2. Mobile UX polish.
3. Capacitor wrapper.
4. iPhone TestFlight.
5. App Store readiness.

Текущий web/PWA MVP:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

iOS scaffold:

```text
C:\gcsc\smartcontractor-mobile\ios\
```

## Recommended Ownership Split

Текущий iOS scaffold можно развивать отдельно, пока основной Codex работает над PWA/backend.

Основной Codex должен взять на себя:

- package-level изменения;
- Capacitor dependency install;
- build pipeline для PWA output;
- реальные iOS project files после `npx cap add ios`;
- backend integration for push notifications;
- production domain setup for universal links.

iOS направление держит:

- Apple requirements;
- iOS checklist;
- permissions map;
- native preview examples;
- TestFlight readiness notes.

## Bundle ID

Production:

```text
com.gcsc.smartcontractor
```

Dev/Staging:

```text
com.gcsc.smartcontractor.dev
com.gcsc.smartcontractor.staging
```

## Apple Developer Requirements

Нужно от владельца проекта:

- Apple Developer Program membership;
- доступ к App Store Connect;
- Team ID;
- production app name decision: `SmartContractor`;
- support URL;
- privacy policy URL;
- тестовый аккаунт для App Review;
- решение, какие payment/wallet flows доступны в review build.

Важно: если приложение продаёт реальные услуги или подписки, Apple review может внимательно смотреть на payment flow. Crypto/wallet flows нужно описывать аккуратно и проверять на соответствие Apple guidelines перед отправкой.

## iOS Permissions Later

Camera/photo evidence:

```text
NSCameraUsageDescription
NSPhotoLibraryUsageDescription
NSPhotoLibraryAddUsageDescription
```

Push notifications:

```text
aps-environment
UserNotifications permission prompt
```

Universal links:

```text
Associated Domains capability
applinks:<production-domain>
apple-app-site-association
```

Wallet links:

```text
custom URL schemes, if needed
universal link fallback
Capacitor Browser/App handling
```

## Capacitor Commands For Main Codex

Install:

```powershell
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
```

Initialize:

```powershell
npx cap init SmartContractor com.gcsc.smartcontractor
```

Add iOS:

```powershell
npx cap add ios
npx cap sync ios
npx cap open ios
```

Future plugins:

```powershell
npm install @capacitor/camera
npm install @capacitor/push-notifications
npm install @capacitor/app
npm install @capacitor/browser
npm install @capacitor/preferences
```

## First TestFlight Definition Of Done

- PWA loads inside Capacitor on iPhone.
- App respects safe areas.
- Login/auth works.
- Contractor and homeowner core screens load.
- Photo evidence capture works or has approved fallback.
- Push permission prompt does not appear too early.
- Deep links open the correct route.
- Wallet handoff has fallback when wallet app is absent.
- App Review notes are written.
- Privacy labels are drafted.

## Current Scaffold Files

```text
C:\gcsc\smartcontractor-mobile\ios\README.md
C:\gcsc\smartcontractor-mobile\ios\checklist.md
C:\gcsc\smartcontractor-mobile\ios\capacitor-commands.md
C:\gcsc\smartcontractor-mobile\ios\native-preview\AppDelegate.swift
```

