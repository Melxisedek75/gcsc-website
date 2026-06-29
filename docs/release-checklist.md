# SmartContractor — Release Checklist

End-to-end checklist for shipping a build to internal testers, beta, or production stores. Pair with `docs/app-store-listing.md` (copy) and `docs/brand-assets.md` (icons).

---

## Prerequisites (one-time setup)

### Apple
- [ ] Apple Developer Program enrollment — $99/yr — https://developer.apple.com/programs/
- [ ] App Store Connect access — create app with `com.gcsc.smartcontractor` bundle id
- [ ] App-specific password generated at https://appleid.apple.com (for `eas submit`)
- [ ] Apple Team ID copied from https://developer.apple.com/account → Membership

### Google
- [ ] Google Play Console enrollment — $25 one-time — https://play.google.com/console
- [ ] Service account JSON downloaded from Google Cloud Console
  - Permission: "Service Account User" on the Play Console
  - Save as `mobile/smartcontractor/play-store-service-account.json` (gitignore'd)
- [ ] App created with `com.gcsc.smartcontractor` package name

### EAS (Expo Application Services)
- [ ] `npm install -g eas-cli`
- [ ] `eas login` with the GCSC Expo account
- [ ] `eas project:init` from `mobile/smartcontractor/`
- [ ] Update `eas.json` `submit.production.ios.{appleId,ascAppId,appleTeamId}` with real values

### Backend
- [ ] Production backend at `https://gcsc-backend-production.up.railway.app/` reachable
- [ ] All required env vars set on Railway:
  - `JWT_SECRET`
  - `XPR_ENDPOINT` (mainnet or testnet)
  - `HYPERION_NODES` (CSV)
  - `EMAIL_FROM`, SMTP config
- [ ] CORS allows the production app's deep-link callbacks

### Privacy & Terms
- [ ] Privacy Policy live at https://gcsc.io/privacy
- [ ] Terms of Service live at https://gcsc.io/terms
- [ ] Support page live at https://gcsc.io/support (email + FAQ)

### Brand assets
- [ ] `assets/icon.png` 1024×1024 (no transparency)
- [ ] `assets/adaptive-icon.png` 1024×1024 (transparent)
- [ ] `assets/splash.png` 1284×2778
- [ ] `assets/notification-icon.png` 96×96 (monochrome)
- [ ] All exported from `docs/brand-assets.md` SVG sources

---

## Per-release workflow

### 1. Pre-flight (in repo)

```powershell
cd C:\gcsc\mobile\smartcontractor

# Make sure type-check is green
npx tsc --noEmit

# Bump the human-visible version in app.json (auto-build numbers come from EAS)
# Edit "version": "0.1.0" → "0.1.1" or "0.2.0" depending on scope
```

Commit the version bump:

```powershell
cd C:\gcsc
git add mobile/smartcontractor/app.json
git -c commit.gpgsign=false commit -m "chore(mobile): release vX.Y.Z"
git push
```

### 2. Build

```powershell
cd C:\gcsc\mobile\smartcontractor

# Internal preview (TestFlight + internal track) — non-blocking, run in parallel
eas build --platform all --profile preview --non-interactive

# Production builds when ready to submit
eas build --platform all --profile production --non-interactive
```

Build status: https://expo.dev/accounts/gcsc/projects/smartcontractor/builds

### 3. Smoke-test on a real device

Install the preview build via the QR code from `eas build:list --status=finished --limit=1`.

E2E flow to verify:
- [ ] Onboarding plays on first launch
- [ ] Sign up → verify OTP → connect WebAuth (use `ownerstest15` or `contructor15`)
- [ ] Post a job (homeowner) → publish fee 25 XPR signs in WebAuth → job appears in My jobs
- [ ] Buy a Lead Token (contractor) → 50 XPR signs → counter increments
- [ ] Submit a bid → appears in My bids → homeowner View bids → Accept → contractor sees Won
- [ ] Approve a milestone (homeowner) → contractor Milestones shows Paid
- [ ] Open a dispute → confirmation shown
- [ ] Settings → notifications toggle persists across restart
- [ ] Sign out → return to role select

### 4. Submit

```powershell
cd C:\gcsc\mobile\smartcontractor

eas submit --platform ios --latest --profile production
eas submit --platform android --latest --profile production
```

Both stores ask one-time:
- Apple: an app-specific password (paste, EAS caches it)
- Google: confirms the service account file path

### 5. Store-side configuration

#### App Store Connect
- [ ] Build appears in TestFlight within ~15 min after submission
- [ ] Add internal testers, send invite
- [ ] Once tested, submit to App Review with copy from `docs/app-store-listing.md`
- [ ] Declare cryptocurrency use (not exchange) in App Privacy questionnaire

#### Google Play Console
- [ ] Build appears in Internal Testing within ~10 min
- [ ] Promote to Closed Testing or Production when ready
- [ ] Fill Data Safety form using `docs/privacy-policy.md` as source
- [ ] Declare Financial Services category (escrow)

### 6. Post-release

- [ ] Create a tag in the repo: `git tag mobile-vX.Y.Z && git push --tags`
- [ ] Update `docs/app-store-listing.md` "What's new" with release notes
- [ ] Monitor crash reports in `eas insights` and Sentry (when wired)
- [ ] Watch reviews in App Store / Play Console for first 48h

---

## Troubleshooting

### Build fails on iOS code-signing
EAS handles certificates automatically. If you see "no provisioning profile":
```powershell
eas credentials --platform ios
```
Select the project, regenerate the distribution profile.

### Android upload rejected: "App bundle missing native debug symbols"
Add to `eas.json` → `build.production.android`:
```json
"buildType": "app-bundle",
"resourceClass": "medium"
```

### "App icon contains transparency"
App Store rejects transparent icons. Re-export from `docs/brand-assets.md` SVG with a solid background. Adaptive icon (Android) is the only one allowed to have transparency.

### "Privacy policy URL returns 404"
App Store Connect validates the URL. Ensure https://gcsc.io/privacy returns 200 before submitting.

---

## Files referenced by this workflow

| File | Purpose |
|------|---------|
| `mobile/smartcontractor/app.json` | Expo config — name, bundle id, deep links |
| `mobile/smartcontractor/eas.json` | Build + submit profiles |
| `docs/app-store-listing.md` | App Store / Play Store copy |
| `docs/brand-assets.md` | Icon + branding source |
| `docs/email-templates.md` | Transactional email templates |
| `docs/privacy-policy.md` | TODO — needs founder + legal review |
| `docs/terms-of-service.md` | TODO — needs founder + legal review |
