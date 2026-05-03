# SmartContractor Mobile Roadmap

Date: 2026-05-03

## Goal

SmartContractor must work on:

- Android phones;
- iPhone;
- desktop browser;
- future native app store builds.

## Recommended Path

### Phase 1: Mobile Web / PWA

This is the fastest and cheapest path.

The same codebase works on Android, iPhone, and desktop.
Users can open SmartContractor in the browser and add it to the home screen.

Completed first steps:

- mobile responsive layout for `smartcontractor.html`;
- PWA manifest;
- service worker;
- mobile theme color;
- iPhone home-screen metadata.

Local URL:

```text
http://localhost:3002/smartcontractor.html
```

### Phase 2: Production Web App

Before real users:

- Supabase Auth;
- role-based dashboards;
- homeowner dashboard;
- contractor dashboard;
- job details page;
- bid marketplace;
- loan center;
- secure RLS policies;
- payment verification for bid unlocks;
- admin/treasury approval for loans.

### Phase 3: Native Wrappers

After the PWA works well, wrap the same app for stores:

- Android: Capacitor or React Native / Expo;
- iPhone: Capacitor or React Native / Expo.

Recommended first native route:

```text
Capacitor
```

Reason:

- reuses the existing web app;
- cheaper in coding time;
- easier to maintain while the product is changing fast;
- can later add native push notifications, camera, file upload, and wallet deep links.

### Phase 4: Full Native App

Only after product-market validation:

- React Native / Expo;
- native navigation;
- push notifications;
- app store payments if needed;
- deeper WebAuth/XPR wallet integration.

## Important Notes

The current MVP is still a development prototype.
The mobile app should not go public until authentication and database security are tightened.

