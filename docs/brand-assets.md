# SmartContractor — Brand Assets

Visual identity reference. Use these for the App Store icon, Play Store feature graphic, gcsc.io favicon, social profile images, and any marketing collateral. Last updated 2026-06-28.

---

## Color palette

### Primary

| Token | Hex | Use |
|-------|-----|-----|
| `brand` | `#5B6CFF` | Primary actions, links, brand mark |
| `accent` | `#00C896` | Success, on-chain confirmations, accepted bids |
| `homeowner` | `#7CA0FF` | Role color for homeowners (lighter blue) |
| `contractor` | `#F59E0B` | Role color for contractors (warm orange) |

### Neutral (dark mode default)

| Token | Hex | Use |
|-------|-----|-----|
| `bg` | `#0A0B0F` | App background |
| `surface` | `#16181F` | Card background |
| `surfaceAlt` | `#1F2230` | Card variant background |
| `text` | `#F1F2F6` | Primary text |
| `textMuted` | `#9BA0B0` | Secondary text |
| `textDim` | `#6B7080` | Tertiary text |
| `border` | `#2A2E3D` | Card borders, dividers |

### Status

| Token | Hex | Use |
|-------|-----|-----|
| `warning` | `#E0B341` | Pending review, attention needed |
| `danger` | `#FF6B6B` | Errors, disputes, rejection |

---

## Typography

### Stack

```
-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

Native system fonts on every platform — no web font download.

### Scale (mobile)

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 32 | 700 | Hero, onboarding titles |
| `h1` | 28 | 700 | Screen headers |
| `h2` | 22 | 700 | Card titles, section headers |
| `h3` | 18 | 600 | List item titles |
| `bodyStrong` | 16 | 600 | Emphasized body |
| `body` | 16 | 400 | Default body |
| `caption` | 14 | 400 | Secondary info |
| `micro` | 12 | 600 | Labels, badges |

Line height: 1.4 for body, 1.2 for display/headings.

---

## App icon

SVG below is the source of truth. 1024×1024 PNG export feeds App Store + Play Store. Smaller exports (16, 32, 64, 128, 192, 256, 512) for favicons and social profiles.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5B6CFF"/>
      <stop offset="100%" stop-color="#3D4ECC"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00C896"/>
      <stop offset="100%" stop-color="#00E6AB"/>
    </linearGradient>
  </defs>

  <!-- Background — rounded square, iOS will mask anyway but Android keeps it -->
  <rect width="1024" height="1024" rx="180" fill="url(#bg)"/>

  <!-- Glyph: stacked milestone bars forming an "S" curve, evoking signed-off progress -->
  <g transform="translate(192,260)">
    <rect x="0"   y="0"   width="640" height="64" rx="32" fill="url(#bar)"/>
    <rect x="160" y="120" width="480" height="64" rx="32" fill="#ffffff" opacity="0.85"/>
    <rect x="0"   y="240" width="640" height="64" rx="32" fill="url(#bar)"/>
    <rect x="160" y="360" width="480" height="64" rx="32" fill="#ffffff" opacity="0.55"/>
    <rect x="0"   y="480" width="640" height="64" rx="32" fill="#ffffff" opacity="0.30"/>
  </g>
</svg>
```

### Icon variants

- **Full color** (above) — primary use.
- **Monochrome** — replace `url(#bg)` with `#0A0B0F` and all bars with `#ffffff` for stencil/print.
- **Inverted** — flip the gradient: white background, brand-color bars. For light-themed contexts.

### Icon export checklist

- [ ] 1024×1024 PNG (no transparency, no rounded corners on the export — App Store applies its own mask)
- [ ] 1024×1024 PNG with transparency for Android adaptive icon foreground
- [ ] 512×512 monochrome PNG for monochrome themed Android icons
- [ ] 192×192, 512×512 PNG for `manifest.json` PWA icons
- [ ] 32×32 ICO for browser favicon

---

## Logo lockup (wordmark + glyph)

For headers, signatures, and marketing.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 120" width="720" height="120">
  <defs>
    <linearGradient id="lg-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5B6CFF"/>
      <stop offset="100%" stop-color="#3D4ECC"/>
    </linearGradient>
  </defs>

  <!-- Glyph block on the left -->
  <rect x="0" y="0" width="120" height="120" rx="24" fill="url(#lg-bg)"/>
  <g transform="translate(24,32)">
    <rect x="0"  y="0"  width="72" height="8" rx="4" fill="#00C896"/>
    <rect x="20" y="16" width="52" height="8" rx="4" fill="#ffffff" opacity="0.85"/>
    <rect x="0"  y="32" width="72" height="8" rx="4" fill="#00C896"/>
    <rect x="20" y="48" width="52" height="8" rx="4" fill="#ffffff" opacity="0.55"/>
  </g>

  <!-- Wordmark -->
  <text x="148" y="78" font-family="-apple-system, Segoe UI, Roboto, sans-serif"
        font-size="56" font-weight="700" fill="#0A0B0F">
    SmartContractor
  </text>
</svg>
```

### Wordmark spelling

- One word: **SmartContractor** (no space, no hyphen).
- Title-case `S` and `C`. Never all caps in body copy.
- All-caps only in tab labels or status badges where typography requires it.

---

## Spacing scale

Match the mobile app tokens. Reuse these on marketing pages.

| Token | px |
|-------|----|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 32 |
| `xxl` | 48 |

---

## Radius scale

| Token | px | Use |
|-------|----|-----|
| `sm` | 6 | Tags, chips |
| `md` | 12 | Inputs, secondary cards |
| `lg` | 16 | Primary cards |
| `pill` | 9999 | Pills, badges, status chips |

---

## Voice quick rules

(See `docs/site-copy.md` for the full tone guide.)

- Lead with what we do, not how. "Pay only for the work that's done" > "Decentralized escrow platform."
- US English. Sentence case for headings.
- Never describe the GCSC token as an investment.
- Never use: revolutionary, disrupting, game-changer, paradigm shift, "the future of X."
- Load-bearing phrases: "milestone escrow," "on-chain proof," "verified contractors."

---

## File outputs needed (TODO before App Store / Play Store submission)

| File | Size | Source |
|------|------|--------|
| `assets/icon-1024.png` | 1024×1024 | App icon SVG (no transparency) |
| `assets/icon-adaptive-fg.png` | 1024×1024 | App icon SVG (transparent bg) |
| `assets/icon-monochrome.png` | 512×512 | Monochrome variant |
| `assets/feature-graphic.png` | 1024×500 | Play Store feature graphic (logo + tagline) |
| `assets/social-og.png` | 1200×630 | Open Graph image for gcsc.io |
| `assets/social-twitter.png` | 1200×675 | Twitter card image |
| `assets/favicon.ico` | 32×32 multi-res | Browser tab |

Render with any SVG-to-PNG tool: `npx sharp-cli`, online converter, or design app. The SVG sources above are the canonical templates.
