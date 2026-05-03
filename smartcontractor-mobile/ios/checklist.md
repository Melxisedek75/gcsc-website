# SmartContractor iOS Checklist

## Phase 0 - PWA Readiness

- [ ] Проверить mobile layout в Safari на iPhone.
- [ ] Проверить install-to-home-screen поведение PWA.
- [ ] Проверить offline/service-worker fallback.
- [ ] Проверить touch targets минимум 44x44 pt.
- [ ] Проверить safe areas: notch, Dynamic Island, bottom home indicator.
- [ ] Проверить формы, keyboard overlap и autofill.
- [ ] Проверить, что critical flows работают без desktop-only hover.

## Phase 1 - Capacitor Setup

- [ ] Основной Codex подтверждает, где лежит package root для mobile wrapper.
- [ ] Добавить Capacitor packages в разрешённой зоне package-level изменений.
- [ ] Настроить `webDir` на build output PWA.
- [ ] Создать `capacitor.config`.
- [ ] Выполнить `npx cap add ios`.
- [ ] Выполнить `npx cap sync ios`.
- [ ] Открыть `ios/App/App.xcworkspace` в Xcode.

## Phase 2 - Apple Developer

- [ ] Apple Developer Program активен.
- [ ] Team ID известен.
- [ ] Bundle ID создан: `com.gcsc.smartcontractor`.
- [ ] App record создан в App Store Connect.
- [ ] Signing & Capabilities настроены в Xcode.
- [ ] TestFlight internal testing включён.

## Phase 3 - iOS Permissions

- [ ] Добавить camera usage description.
- [ ] Добавить photo library usage description.
- [ ] Добавить photo library add usage description.
- [ ] Добавить push notification capability.
- [ ] Добавить associated domains для universal links.
- [ ] Проверить wallet URL schemes и fallback links.

## Phase 4 - MVP TestFlight

- [ ] Собрать Debug build на реальном iPhone.
- [ ] Проверить login/auth.
- [ ] Проверить homeowner project view.
- [ ] Проверить contractor lead flow.
- [ ] Проверить photo evidence capture.
- [ ] Проверить push permission prompt.
- [ ] Проверить universal link open.
- [ ] Проверить wallet handoff.
- [ ] Собрать Archive в Xcode.
- [ ] Отправить build в TestFlight.

## Phase 5 - App Store Readiness

- [ ] Privacy Nutrition Labels подготовлены.
- [ ] App Tracking Transparency не включать без реальной необходимости.
- [ ] Support URL готов.
- [ ] Privacy Policy URL готов.
- [ ] Скриншоты iPhone подготовлены.
- [ ] Review notes объясняют тестовые аккаунты и payment/wallet flows.

