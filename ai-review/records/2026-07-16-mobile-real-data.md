# AI Review: mobile app on live backend data (mocks removed)

- Author AI: CLAUDE
- Reviewer AI: CODEX (когда подключится — founder сейчас интегрирует окружение)
- Branch: `feat/mobile-real-data` (base: `fix/mobile-webauth-gcsc-owner` @ `99f2838a`)
- Head for review: `4ea5573f`
- Status: `READY_FOR_REVIEW`
- Prepared at (UTC): `2026-07-16T05:05:00Z`

## Scope

Contractor-сторона приложения была витриной: лента — hardcoded `mockJobs`, заявки
писались только в AsyncStorage телефона (homeowner их не видел никогда), milestones
и чат — вымышленные. Этот бранч закрывает цикл на реальном backend API:

post job → лента (`GET /api/projects`) → заявка (`POST /api/bids`) → homeowner видит
enriched-заявки и принимает (`POST /api/bids/:id/accept` → escrow) → homeowner задаёт
milestones (новая форма — accept создаёт пустой эскроу) → contractor сабмитит →
approve → release. Чат-треды выводятся из реальных заявок/проектов (`p<projectId>`).

Новое: `lib/escrows.ts`, `lib/threads.ts`, `components/ThreadList.tsx`,
`components/ChatThreadView.tsx` (общие для обеих ролей — экраны были побайтово
одинаковы кроме подписей). `lib/mock.ts` удалён, импортов не осталось.

## Checks run by author

| Check | Result |
|---|---|
| `tsc --noEmit --pretty false` | PASS (exit 0) at `4ea5573f` |
| `grep -rn "lib/mock"` app/components | 0 matches |
| Runtime smoke против локального backend (json-mode, порт 4599) | PASS — детали ниже |

Smoke (curl, ровно те вызовы, что делает приложение): регистрация homeowner +
contractor (роль передаётся на шаге `/api/verify`, не `/api/register` — учтено),
POST project → id 102; contractor bid → **лёг в backend и виден homeowner**
(раньше терялся в телефоне); enriched-форма совпала с типом `EnrichedBid`
(`status/amount/contractor.full_name/contractor_verification.ready_for_bids`);
accept корректно заблокирован verification-gate
(`Contractor must be verified before bid acceptance`) — UI это предупреждает.

## Known limitations (честно, видно в UI-копирайте)

- Чат: собеседник реальный, история сообщений device-local (chat-backend нет).
- Lead tokens — локальная запись (нет `GET /api/leads`).
- Milestone release меняет статус в БД; on-chain settlement (gcscrow1111) — отдельная задача.
- Фото-пруфы не реализованы; submit шлёт только статус.
- Escrow/milestone путь runtime-смоуком не пройден (accept заблокирован
  verification-gate; нужен admin-аппрув документов) — формы ответов сверены с
  исходником backend (`{milestone}` во всех четырёх action-роутах).
- Homeowner «My jobs» всё ещё читает локальную копию (постит на backend) — след. шаг.

## Reviewer decision

- Reviewer decision: `PENDING`
- Reviewed at (UTC): `PENDING`
