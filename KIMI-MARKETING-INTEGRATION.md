# Задача для свежей сессии: интеграция маркетинг-дизайна Kimi в gcsc-store

> Прочитай этот файл и выполни интеграцию. Режим: marketing-only.
> Founder одобрил: дизайн Kimi идёт на МАРКЕТИНГ-страницы; рабочее приложение
> (Dashboard/Wallet/auth/API) остаётся из текущего gcsc-store.

## Источник и цель
- **Источник (дизайн Kimi):** `C:\Users\rivne\Downloads\gcsc-frontend-handoff\`
  Стек: Vite + React 19 + TS + Tailwind + React Router 7 + shadcn/radix + framer-motion
  + GSAP + three.js/@react-three + lenis + recharts. Премиум тёмный дизайн.
- **Цель:** `C:\gcsc-store` (Vite + React + TS + Tailwind + React Router, ветка `api-backend`).

## Что ПЕРЕНОСИМ из handoff Kimi в gcsc-store
- Маркетинг-страницы: **Home, Pricing, About, Security, Contact** (`src/pages/`).
- Дизайн-компоненты (`src/components/`): Navbar, Footer, Layout, AuroraBackground,
  ParticleNetwork, DecryptText, MagneticButton, StarBorder + любые их зависимости.
- Tailwind-токены: смержить цвета/шрифты/keyframes/animations из
  `gcsc-frontend-handoff/tailwind.config.js` в `gcsc-store/tailwind.config`.
- Шрифты (Space Grotesk / Inter / JetBrains Mono) — `<link>` в `index.html`.
- Ассеты: `public/aurora-cta-bg.jpg`, `escrow-flow-bg.jpg`, `hero-particles-texture.png`.
- Дизайн-стили из `src/index.css` (классы brand-gradient, mesh-gradient-bg и т.п.) —
  смержить, не затирая существующие токены gcsc-store.

## Что НЕ ТРОГАЕМ (оставляем рабочее из gcsc-store)
- `src/pages/Dashboard.tsx` + ВСЕ модульные панели `src/pages/dashboard/*` (рабочие:
  auth, проекты, биды, escrow, compliance, admin — подключены к API).
- `src/pages/Wallet.tsx` (рабочий WebAuth), `src/pages/ContractorProfile.tsx`.
- `src/services/api.ts` (26 методов к backend).
- Существующий lazy-роутинг в `src/App.tsx` (react-router + BrowserRouter).

## Reconciliation (обязательно)
1. **Роутинг:** Kimi на `react-router-dom` + хэш-ссылки (`href="#/dashboard"`).
   gcsc-store на `react-router` + чистые URL + lazy. → Привести страницы Kimi к
   паттерну gcsc-store: `<Link to="/...">`, заменить `#/`-ссылки на нормальные роуты,
   lazy-загрузка маркетинг-страниц.
2. **Зависимости в gcsc-store** (добавить + npm install): gsap, @gsap/react,
   lenis (или @studio-freight/lenis), three, @react-three/fiber, @react-three/drei,
   tailwindcss-animate, react-countup + любые radix, что используют маркетинг-страницы.
   (framer-motion / lucide / recharts уже есть.)
3. **index.html:** взять шрифты Kimi; ИСПРАВИТЬ title/meta на гибридные:
   title = "GCSC Smart Contractor — Escrow-Protected Construction Payments";
   meta description без слова blockchain/XPR (уже поправлено в handoff-копии).

## Чистка сообщения (гибридная модель — КРИТИЧНО)
- Убрать со ВСЕХ маркетинг-поверхностей слова: blockchain, crypto, XPR, on-chain,
  "smart contract" (как крипто), web3, staking, DeFi, wallet/token (в крипто-смысле).
  Заменять на: "Protected Project Agreement", "Milestone Payments", "Verified Progress",
  "Secure Escrow".
- **Token-страница Kimi:** перенести содержание в раздел «Vision / For Investors»,
  явно помеченный как долгосрочное видение, ИЛИ убрать из основной навигации.
  (В текущем gcsc-store Token = статичная "Coming Soon" — можно оставить её, а дизайн
  Kimi применить опционально.)
- Hero у Kimi уже гибридный ("Construction payments protected by escrow") — сохранить.

## Производительность
- ParticleNetwork оставить lazy (three.js тяжёлый). Lazy-загрузка роутов.
- three.js + drei + gsap = большой бандл → code-split, замерить Core Web Vitals (LCP<2.5s).

## НЕ ДУБЛИРОВАТЬ
- В gcsc-store УЖЕ есть страницы Home/Pricing/About/Security/Token/Contact/Wallet/Dashboard.
  Маркетинговые — ЗАМЕНИТЬ дизайном Kimi. Функциональные (Dashboard/Wallet) — оставить.

## Гейты перед коммитом (все зелёные)
`npx tsc -b --noEmit` · `npx eslint src/` · все 17 `npm run check:*` · `npm run build`.

## Деплой
- Закоммитить в ветку `api-backend` gcsc-store, можно пушить.
- Прод-деплой публичного сайта + домен (DNS) = с founder (дать точные DNS-значения).

## Заметки
- Среда раньше падала с `uv_spawn` — если повторится, перезапустить приложение.
- Дизайн Kimi — премиум, founder его одобрил; сохранить визуал, поменять только
  сообщение + роутинг + интеграцию.
