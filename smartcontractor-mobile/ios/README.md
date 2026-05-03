# SmartContractor iOS Direction

Статус: starter scaffold для будущего iPhone/iOS направления. Это не готовое нативное приложение и не сгенерированный Xcode-проект.

## Цель

Подготовить отдельную дорожку для SmartContractor MVP на iPhone:

- сохранить текущую стратегию `PWA first`;
- позже обернуть готовый web/PWA MVP через Capacitor;
- заранее зафиксировать Apple requirements, bundle id, permissions и iOS-specific integrations;
- не смешивать iOS-план с backend, Supabase, public HTML или package-level настройками.

## Текущая база

Web/PWA MVP живёт здесь:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

Manifest и service worker уже существуют в web/PWA части. iOS направление должно использовать этот MVP как источник интерфейса, а не переписывать продукт с нуля.

## Предлагаемый Bundle ID

Рекомендуемый production bundle id:

```text
com.gcsc.smartcontractor
```

Варианты для окружений:

```text
com.gcsc.smartcontractor.dev
com.gcsc.smartcontractor.staging
com.gcsc.smartcontractor
```

Почему так:

- коротко и понятно для Apple Developer Console;
- соответствует бренду SmartContractor;
- оставляет место для dev/staging/prod сборок;
- не привязано к временной папке, домену или имени агента.

## Рекомендуемый путь реализации

1. Довести PWA MVP до стабильного mobile UX в браузере iPhone/Safari.
2. Добавить Capacitor в основной mobile/workspace слой, когда основной Codex будет готов менять package-level файлы.
3. Сгенерировать iOS проект через Capacitor.
4. Открыть проект в Xcode и настроить Signing & Capabilities.
5. Проверить camera/photo evidence, push notifications, universal links и wallet links на реальном iPhone.
6. Подготовить TestFlight build.

## Будущие iOS Features

### Camera / Photo Evidence

Нужно для:

- фото прогресса работ;
- evidence к milestone approval;
- claim/dispute evidence;
- contractor completion proof.

Будущие permissions:

```text
NSCameraUsageDescription
NSPhotoLibraryUsageDescription
NSPhotoLibraryAddUsageDescription
```

### Push Notifications

Нужно для:

- новых lead alerts;
- milestone approval;
- dispute/claim updates;
- loan/credit status;
- subscription/payment notices.

Потребуется:

- Apple Push Notification service capability;
- APNs key/certificate;
- backend push provider или отдельный notification service;
- пользовательское согласие на iOS.

### Universal Links

Нужно для:

- открытия job details из email/SMS;
- contractor invite links;
- homeowner project links;
- magic link / auth callback flows;
- deep links из web в app.

Потребуется:

- production domain;
- `apple-app-site-association`;
- Associated Domains capability в Xcode;
- routing map внутри app/web layer.

### Wallet Links

Нужно для:

- WebAuth wallet flows;
- XPR/GCSC payment confirmations;
- будущих wallet handoff links.

Потребуется:

- список поддерживаемых URL schemes;
- проверка iOS Safari/WebView behavior;
- fallback на web flow, если wallet app не установлен.

## Что здесь есть

- `README.md` - общий starter plan;
- `checklist.md` - пошаговый iOS readiness checklist;
- `capacitor-commands.md` - рекомендуемые команды для основного Codex;
- `native-preview/AppDelegate.swift` - пример будущей native entry-point логики, не production app.

## Чего здесь нет

- нет Xcode project;
- нет рабочей iOS сборки;
- нет изменений в `package.json`;
- нет изменений в backend/Supabase/public HTML;
- нет Apple signing assets.

