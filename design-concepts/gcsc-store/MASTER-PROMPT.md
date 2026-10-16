# GCSC Master Prompt — «Living Blueprint»

Скопируй блок ниже целиком в любой AI-инструмент (Claude, v0.dev, Lovable, Magic MCP)
или скажи Claude Code: «сделай сайт по MASTER-PROMPT».

---

```
ROLE
You are a senior creative developer from an award-winning studio (Awwwards/FWA level).
You build interactive corporate websites that win design awards while remaining strict,
credible, and enterprise-grade. You never ship generic SaaS landing pages.

PRODUCT
GCSC (gcsc.store) — escrow infrastructure for the $13T construction industry.
Homeowners fund a project escrow; verified contractors build; money releases
milestone-by-milestone with on-chain audit (XPR Network). The product replaces
trust with verifiable process. Audience: homeowners, contractors, institutional
partners. Tone: serious money infrastructure — but alive, not dull.

ART DIRECTION — "THE LIVING BLUEPRINT"
The entire site is an architectural blueprint that comes alive as you scroll.
Mix exactly these styles: Parallax Storytelling + HUD/engineering FUI overlays +
Swiss Modernism 2.0 typography + Dimensional Layering + Interactive Product Demo.
- Background: deep ink-blue blueprint paper (#0A1628 → #0D1D33), with a faint
  blueprint grid (1px lines, 8% opacity) and subtle paper grain texture.
- Accent: blueprint cyan (#4FC3F7) for drawing lines, signal amber (#FFB300)
  for money/escrow events, mint green (#00E5A0) for released/verified states.
- Typography: Space Grotesk (display, tight tracking, huge scale contrast:
  hero ≥ 96px desktop) + Inter (body) + JetBrains Mono (data, coordinates,
  annotations — used HEAVILY as HUD labels like "ESCROW: $38,500 / LOCKED").
- Every section has engineering annotations: dimension lines, crosshair
  registration marks, coordinates, dotted leader lines — like a real drawing.

THE CENTERPIECE — SCROLL-DRIVEN CONSTRUCTION SCENE (mandatory, this IS the site)
A large isometric house built from SVG line-art sits pinned (position sticky)
while the user scrolls through 5 story chapters. With each chapter, the house
DRAWS ITSELF progressively (animate SVG stroke-dashoffset, staggered):
  Chapter 1 — empty lot + blueprint grid. HUD: "PROJECT POSTED · 3 VERIFIED BIDS"
  Chapter 2 — foundation lines draw in. Amber money-particles flow from a wallet
              icon into a vault icon. HUD: "ESCROW FUNDED · $38,500 LOCKED"
  Chapter 3 — walls + roof draw in. HUD: "MILESTONE 2/4 SUBMITTED · IN REVIEW"
  Chapter 4 — windows/details draw; a green checkmark stamps the drawing like a
              building-permit seal (scale+rotate spring animation).
              Money-particles flow vault → contractor. "RELEASED · 0.4s FINALITY"
  Chapter 5 — completed house glows; an audit-trail ledger writes itself line
              by line in mono font (typewriter), each line with a tx-hash.
Use GSAP ScrollTrigger (scrub: true) or equivalent IntersectionObserver math.
The text chapters scroll on the left/right third; the scene stays pinned.

MANDATORY INTERACTIVE ELEMENTS (all of them)
1. ESCROW SIMULATOR — a real interactive widget (not a mock): visitor drags a
   budget slider, clicks "Fund escrow", then clicks through Submit → Approve →
   Release on 3 milestones and WATCHES animated money particles move between
   Homeowner / Vault / Contractor nodes, progress ring filling, mono ledger
   appending entries with fake tx-hashes. Gamified but strict.
2. CUSTOM CURSOR — crosshair/registration-mark cursor on desktop; on hover over
   interactive elements it expands into a circle with a mono label ("FUND",
   "RELEASE", "VIEW"). Falls back to normal cursor on touch devices.
3. MAGNETIC CTAs — primary buttons subtly attract the cursor (translate ≤ 8px,
   spring back). Button hover: a blueprint-line border draws around it.
4. LIVE COUNTERS — escrow totals/metrics count up with tabular JetBrains Mono
   digits when scrolled into view; one metric has a live "pulse" dot.
5. KINETIC HERO TYPE — the hero headline reveals word-by-word (clip-path or
   translateY mask, 60ms stagger); one key word ("verified" / "released")
   continuously cycles through 3 states with a vertical roll every 2.5s.

PAGE STRUCTURE
1. HUD nav bar: logo as a drawing-stamp, mono section coordinates (01/05…),
   "Launch App" CTA. Slim. Fixed. Gains blueprint-paper blur on scroll.
2. Hero: kinetic headline "Construction, financed like infrastructure." +
   sub-line + 2 CTAs + a thin HUD strip of live metrics. The isometric house
   peeks from below, partially drawn, inviting scroll.
3. The 5-chapter scroll-driven construction scene (the centerpiece).
4. Escrow simulator section: "Try the rail yourself."
5. Dual-audience split: two large interactive panels (Homeowner / Contractor)
   that tilt 3° toward cursor (perspective transform) and reveal role-specific
   guarantees as annotated blueprint callouts.
6. Trust & proof: verification pipeline drawn as an engineering diagram with
   animated checkpoints (license → insurance → documents → wallet → READY).
7. Final CTA: a building-permit style stamped card "PERMIT TO BUILD — GRANTED",
   with the stamp animating in on scroll. One gold CTA.
8. Footer: blueprint title-block (like a real drawing's corner table: project
   name, revision, date, "XPR TESTNET · NO LIVE FUNDS").

MOTION SPEC
- GSAP + ScrollTrigger (CDN ok) or vanilla rAF; 60fps; transform/opacity only.
- Enter: 500-700ms cubic-bezier(0.16,1,0.3,1); exits 60% shorter; stagger 40-60ms.
- Respect prefers-reduced-motion: kill parallax/pinning, keep content readable.
- No layout shift: reserve all space; CLS < 0.1.

QUALITY BAR / ANTI-PATTERNS (hard rules)
- This must NOT look like a SaaS template: no centered-hero + 3-feature-cards +
  testimonial pattern; no generic purple gradients; no stock illustrations;
  no emoji icons (inline SVG only, single stroke-width family).
- Density of craft: every section must contain at least one bespoke detail
  (annotation, draw-on line, hover reveal, mono data readout).
- WCAG AA: contrast ≥ 4.5:1, visible focus rings (cyan), full keyboard nav,
  44px touch targets; mobile-first responsive at 375/768/1024/1440.
- Single self-contained index.html (inline CSS/JS, Google Fonts, GSAP CDN) —
  production-clean code, commented section by section.

DELIVER
One complete HTML file implementing ALL of the above. Do not simplify. Do not
replace the scroll-driven scene with static cards. If something must be cut for
size, cut copy length — never interactivity.
```

---

## Как использовать

| Где | Как |
|-----|-----|
| **Claude Code (я)** | скажи: «сделай сайт по MASTER-PROMPT» |
| **v0.dev / Lovable** | вставь блок целиком в поле запроса |
| **Magic MCP** | используй для генерации отдельных компонентов (simulator, nav) |

## Почему это сработает (vs прошлые концепты)

Прошлые концепты использовали 1 стиль из базы («Trust & Authority») — получился
типовой лендинг. Этот промт принудительно смешивает 5 продвинутых стилей
(Parallax Storytelling, HUD/FUI, Swiss Modernism 2.0, Dimensional Layering,
Interactive Product Demo), требует scroll-driven сцену как ЦЕНТР сайта,
а не карточки, и запрещает шаблонные паттерны в явном виде.
