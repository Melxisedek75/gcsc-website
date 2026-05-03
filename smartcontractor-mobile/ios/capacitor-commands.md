# Recommended Capacitor Commands

Эти команды не запускались в этом scaffold, потому что задача ограничена iOS planning zone и запрещает менять `package.json`.

Команды ниже должен выполнить основной Codex, когда будет разрешено менять package-level файлы.

## Install Capacitor

```powershell
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
```

## Initialize Capacitor

```powershell
npx cap init SmartContractor com.gcsc.smartcontractor
```

Рекомендуемые значения:

```text
App name: SmartContractor
Package ID / Bundle ID: com.gcsc.smartcontractor
```

## Configure Web Output

В `capacitor.config.*` нужно указать `webDir`, который соответствует реальному build output PWA.

Пример:

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gcsc.smartcontractor',
  appName: 'SmartContractor',
  webDir: 'dist',
  server: {
    iosScheme: 'https'
  }
};

export default config;
```

Если MVP остаётся статическим HTML без build step, основной Codex должен сначала решить, как упаковывать `construction-ai/public/smartcontractor.html` в стабильный web output.

## Add iOS Platform

```powershell
npx cap add ios
npx cap sync ios
```

## Open Xcode

```powershell
npx cap open ios
```

## Typical Development Loop

```powershell
npm run build
npx cap sync ios
npx cap open ios
```

## Future Plugins

Вероятные Capacitor plugins:

```powershell
npm install @capacitor/camera
npm install @capacitor/push-notifications
npm install @capacitor/app
npm install @capacitor/browser
npm install @capacitor/preferences
```

Назначение:

- `@capacitor/camera` - photo evidence;
- `@capacitor/push-notifications` - lead/milestone/dispute alerts;
- `@capacitor/app` - deep link handling;
- `@capacitor/browser` - wallet/web handoff;
- `@capacitor/preferences` - small local settings only, not secrets.

## Do Not Do Yet

- Не создавать Apple certificates без решения пользователя.
- Не добавлять paid services без подтверждения.
- Не менять `package.json` в параллельной agent-задаче.
- Не объявлять этот scaffold готовым iOS app.

