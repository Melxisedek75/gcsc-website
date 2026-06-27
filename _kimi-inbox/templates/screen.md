# Шаблон: React Native экран для SmartContractor

Скопируй ниже, замени `[плейсхолдеры]`, отправь Kimi.

---

Сгенерируй React Native экран `[ИМЯ_ФАЙЛА].tsx` для мобильного приложения SmartContractor.

**Назначение:** [одно предложение что экран делает, для какой роли — homeowner или contractor]

**Stack:**
- Expo Router (file-based routing)
- TypeScript строгий, без `any`
- React 18 функциональные компоненты, hooks
- StyleSheet.create для стилей

**Дизайн-токены — импортируй из `'../../lib/tokens'`:**
- `colors.{brand, bg, surface, text, textMuted, textDim, accent, danger, warning, homeowner, contractor, border}`
- `spacing.{xs, sm, md, lg, xl, xxl}`
- `radius.{sm, md, lg, pill}`
- `typography.{display, h1, h2, h3, body, bodyStrong, caption, micro}`

**Готовые компоненты (импорт из `'../../components/X'`):**
- `Screen`, `Header`, `Card`, `Button`, `Input`, `Badge`, `Avatar`, `PaymentSheet`

**Match style of:**
- `app/(homeowner)/post-job.tsx` (форма + payment)
- `app/(homeowner)/jobs.tsx` (список + cards)
- `app/(homeowner)/profile.tsx` (детали + actions)

**Требования:**
- Не используй внешние UI-библиотеки (только react-native + наши компоненты)
- Все цвета и spacing — только через токены, никаких хардкодов
- Тексты на английском (US-приложение)
- Default export — компонент с именем как у файла (например `JobDetail`)

**Что нужно на экране:**
[ОПИСАНИЕ — какие блоки, какие данные показывать, какие кнопки. Будь конкретен.]

**Данные на входе:**
[если есть props или query params — перечисли]

Выдай один файл в одном code-блоке. Без объяснений, без комментариев — только код.
