# CODEX PROMPT — найти причину чёрного экрана standalone Android-сборки SmartContractor

Ты — CODEX, второй инженер пары (протокол `AI-REVIEW-GATE.md`). CLAUDE несколько итераций чинил проблему вслепую по скриншотам founder'а — нужен твой независимый взгляд с локальной диагностикой. Работай автономно, по-русски в отчёте.

## Симптом

Standalone APK (EAS build, profile `preview`) на **двух разных Android-телефонах** ведёт себя одинаково:
- Раньше: тёмный экран + оранжевый спиннер (ActivityIndicator из `app/_layout.tsx`, state `pending`) — навсегда.
- После фикса a0f686c6 (failsafe 4s): спиннер уходит, но экран остаётся **пустым тёмно-синим** (цвет `colors.bg`) — т.е. RootLayout рендерится, а контент `<Stack>` (expo-router) не отрисовывается.
- В **Expo Go** всё приложение работает (доходили до WebAuth pairing в кошельке).

## Где код

- Репо: `C:\gcsc` (git branch `main`), приложение: `mobile/smartcontractor/`.
- Бэкенд живой: `https://gcsc-backend-production.up.railway.app` (health 200, database postgres) — к чёрному экрану, скорее всего, отношения не имеет.

## Стек

Expo SDK 54, expo-router ~6.0.24, React 19.1.0, RN 0.81.5, **newArchEnabled: true** (app.json), Hermes, react-native-reanimated ~4.1.1 + react-native-worklets 0.5.1, nativewind ^4.2.6 (в коде почти не используется — экраны на StyleSheet), react-native-screens ~4.16, safe-area-context ~5.6. Entry: `index.js` (полифилы) → `expo-router/entry`. `.npmrc legacy-peer-deps=true`.

## Что уже сделано (хронология коммитов, все в main)

| Commit | Что | Результат на устройстве |
|---|---|---|
| 942244c9 | `.npmrc` legacy-peer-deps (EAS npm ci падал) | сборка прошла |
| c927d3be | `expo install --fix`: async-storage 3.1.1→2.2.0, worklets 0.10→0.5.1 (gradlew падал) | сборка прошла |
| 99e042d4 | `babel.config.js`: babel-preset-expo + `react-native-worklets/plugin` | чёрный + спиннер |
| 924f9fbe | `index.js` полифилы: react-native-get-random-values + Buffer (elliptic/@proton/signing-request) | чёрный + спиннер |
| a0f686c6 | safeStorage: таймаут 2.5s → in-memory fallback; failsafe 4s в `_layout.tsx` | спиннер уходит, экран пуст |
| (текущий) | `components/ErrorBoundary.tsx` + обёрнут `<Stack>` в `_layout.tsx` — render-ошибки покажутся текстом на экране | ждём новую сборку |

## Гипотезы CLAUDE (не проверены, проверь и опровергни/подтверди)

1. **New Architecture**: `newArchEnabled: true` + reanimated 4.1/worklets 0.5.1/screens 4.16 — самый частый источник «Expo Go работает, standalone чёрный». Проверка: собрать с `newArchEnabled: false`.
2. **expo-router Stack не может смонтировать первый экран** (что-то в `app/index.tsx` или группах `(auth)/(homeowner)/(contractor)`) — ErrorBoundary теперь должен показать текст, если это render-throw.
3. **nativewind/css-interop** без `metro.config.js` (`withNativeWind`) — в проекте нет metro.config.js вообще; css-interop может ломать рендер в release.
4. Полифилы установлены, но какой-то модуль (elliptic/BN) всё ещё кидает при загрузке route-модуля `(contractor)/bid.tsx` → цепочка import payments→webauth→@proton/signing-request может валить весь роутер при статической загрузке маршрутов.

## Что сделать (по шагам)

1. `cd C:\gcsc && git pull`, работай в `mobile/smartcontractor`.
2. **Локальная репродукция без EAS** (быстрый цикл вместо 15-мин облачных сборок): `npx expo start --no-dev --minify` + Expo Go — это выполняет JS в production-режиме и часто воспроизводит именно такие падения. Если воспроизвелось — итерируй локально.
3. Ещё точнее: `adb logcat *:E ReactNativeJS:V` при запуске установленного APK (если у founder подключён телефон по USB; попроси его включить отладку по USB). Ищи `FATAL`, `ReactNativeJS`, `ERROR` при старте.
4. Проверь гипотезы 1–4. Меняй **по одной переменной за раз**. Приоритет: (1) newArch off, (4) ленивая загрузка @proton/signing-request (dynamic import в момент подписи, а не статический), (3) metro.config.js + nativewind или выпилить nativewind.
5. Каждую правку — отдельным scoped commit в ветку `fix/mobile-blackscreen`, push. НЕ merge в main без записи ревью.
6. Итог — запись `ai-review/records/2026-07-06-mobile-blackscreen.md`: root cause, доказательство (лог/скрин), фикс, как проверял. Author: CODEX, Reviewer: CLAUDE.

## Сборка EAS (если нужна)

`eas-cli` установлен глобально. Логин: попроси у founder EXPO_TOKEN (создаётся на expo.dev/settings/access-tokens) — **не коммить токен в репо**. Команда: `$env:EXPO_TOKEN="..."; eas build --profile preview --platform android --non-interactive` из `mobile/smartcontractor`. Проект: `@melxisedek75/smartcontractor` (projectId в app.json).

## Границы

Обычные: без секретов в коде, без mainnet/реальных денег, без деплоя. Мобильная сборка и ветки — можно свободно.
