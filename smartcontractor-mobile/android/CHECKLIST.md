# SmartContractor Android Checklist

Date: 2026-05-03

## Phase 0: PWA Readiness

- [ ] Confirm `smartcontractor.html` works on Android Chrome.
- [ ] Confirm mobile layout covers homeowner and contractor flows.
- [ ] Confirm `manifest.webmanifest` has app name, icons, theme color, and start URL.
- [ ] Confirm `service-worker.js` does not cache stale app shell during active development.
- [ ] Confirm HTTPS production domain before native deep links.
- [ ] Confirm login/session behavior on mobile.

## Phase 1: Capacitor Wrapper

- [ ] Decide exact web output directory for Capacitor.
- [ ] Add Capacitor packages in the main app package owner area.
- [ ] Create `capacitor.config.ts` or `capacitor.config.json`.
- [ ] Use app id `com.gcsc.smartcontractor`.
- [ ] Generate Android project with `npx cap add android`.
- [ ] Run `npx cap sync android` after every web asset update.
- [ ] Open in Android Studio and confirm clean Gradle sync.
- [ ] Run on emulator.
- [ ] Run on a real Android phone.

## Phase 2: Native Capabilities

- [ ] Add Camera plugin for progress/photo evidence.
- [ ] Add Push Notifications after Firebase Cloud Messaging is configured.
- [ ] Add App Links for job, bid, dispute, and claim URLs.
- [ ] Test WebAuth/XPR wallet outbound and return links.
- [ ] Add file upload flow for licenses, permits, and insurance documents.
- [ ] Add location permission only if routing requires it.

## Phase 3: Security And Compliance

- [ ] Verify Supabase Auth and RLS before any public test.
- [ ] Confirm no secrets are bundled into Android assets.
- [ ] Add privacy policy covering photos, notifications, location, wallet links, and account data.
- [ ] Add terms for contractor credit and dispute evidence.
- [ ] Confirm Play Store data safety answers.

## Phase 4: Store Preparation

- [ ] Create launcher icons.
- [ ] Create adaptive icon foreground/background.
- [ ] Prepare screenshots for phone sizes.
- [ ] Prepare short and full Play Store descriptions.
- [ ] Create internal testing track.
- [ ] Invite first testers.
- [ ] Capture feedback before public release.

