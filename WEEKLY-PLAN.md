# GCSC — Недельный план 2026-06-12 → 2026-06-18

> Режим: автономный, задачи берутся подряд без остановки (пожизненное «да» founder).
> Стоп только на: деньги, секреты, внешние аккаунты, production release, destructive.
> Обновлять статусы по ходу: [ ] → [x]. Каждая задача = scoped commit.

## D1 — Чт 2026-06-12 · Безопасность money-путей бэкенда ✅
- [x] Race condition в milestone-эскроу (double-release) — CAS-фикс, smoke PASS, commit `5a5b272`
- [x] Race condition в bid-accept (двойной accept → два эскроу) — CAS + claim проекта, commit `92792a7`
- [x] Регрессионный тест на конкурентные переходы (double release/accept), commit `4bdfb0f`

## D2 — Пт 2026-06-13 · Аудит остальных check-then-act ✅
- [x] Пройдены wallet/connect, financing/prechecks, documents/:id/review
- [x] Вывод: money-критичных гонок вне D1 нет — wallet/document review идемпотентны (last-write-wins), financing prechecks = demo INSERT (SETTLEMENT off). Фиксить нечего.
- [x] Решение задокументировать вывод в ARCHITECTURE-TRUTH.md (перенесено в D5)

## D3 — Сб 2026-06-14 · MCP-сервер: качество ✅
- [x] `test/smoke.mjs` + `npm run check`: handshake + tools/list + schema-валидация (26 tools PASS), commit `a506312`
- [x] README: секции Test + Troubleshooting (cold start, 401/403, /token 404, build)
- [x] E2E read-only `gcsc_list_projects` к живому API — ok

## D4 — Вс 2026-06-15 · Фронт gcsc-store: долги ✅
- [x] Token-страница: demo-баннер НЕ нужен — Token.tsx уже честная статическая «Coming Soon», без вызовов API и фейковых цен (память исправлена)
- [x] Health-check: tsc OK, 17/17 валидаторов PASS, build OK
- [x] Мёртвые импорты dashboard: eslint чисто, чистить нечего

## D5 — Пн 2026-06-16 · Документация и правда архитектуры ✅
- [x] v3/ARCHITECTURE-TRUTH.md: race→FIXED + секция money-path atomicity (CAS/409), commit `844ce84`
- [x] Индекс: PROJECT_INDEX.md не существует → дополнил LOCAL_PROJECT_STRUCTURE.md (design-concepts, mcp-server, соседние репо)
- [x] Синк инструкций: .claude/CLAUDE.md приведён к AGENTS.md==GEMINI.md (на диске идентичны). ⚠️ НЕ закоммичено в C:\gcsc: рабочее дерево содержит pre-existing drift founder'а — требует его ревью перед коммитом.

## D6 — Вт 2026-06-17 · Founder Action Packet
- [ ] Документ-чеклист релиза: merge api-backend→main (фронт), push бэкенда (5a5b272+), DNS/хостинг карта
- [ ] Список всех founder-gated задач одним списком (email-провайдер, Stripe live, deploy)

## D7 — Ср 2026-06-18 · Ревью недели
- [ ] Прогнать ВСЕ тесты обоих репо, свести статус
- [ ] Обновить память проекта (project_state)
- [ ] Недельный отчёт founder'у: сделано / заблокировано / план следующей недели

## Ожидает founder (не блокирует план)
- «запушь бэкенд» → деплой фикса гонки на Railway
- «выкати на прод» → merge 62 коммитов фронта в main
- Email-провайдер (SMTP/Resend ключ) → починка sendEmail-заглушки
- Первый проект через UI на gcsc.store → проверка живого флоу
