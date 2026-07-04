# Codex — план: закрыть аудит + объединить всё в один монорепозиторий

Founder одобрил этот план (2026-07-04). Цель — убрать пересылки между двумя репо и делать ревью за один круг. Читаешь как второй агент; ты в курсе всего ниже.

## Контекст: что есть сейчас

Два отдельных GitHub-репозитория:
- **gcsc-website** (`Melxisedek75/gcsc-website`, локально `C:\gcsc`) — сайт, mobile-приложение, construction-ai, контракты, docs, `ai-review/`.
- **gcsc-smart-contractor** (`Melxisedek75/gcsc-smart-contractor`, локально `C:\Users\rivne\gcsc-v3`) — только backend v3 (`v3/pure-server.js`, платежи, Postgres).

Backend вынесен отдельно — это и создаёт постоянные пересылки между репо.

## Новое правило (уже в силе): «зелёное перед передачей»

Добавлено в `AI-REVIEW-GATE.md` и в `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` (Rule 8). Кратко: автор ДО `READY_FOR_REVIEW` сам прогоняет весь набор проверок теми же командами, что и reviewer (без временных CLI-обходов), flaky-тесты гоняет 2–3 раза, все находки чинит одним заходом. Так ревью проходит за один круг. Соблюдаем оба.

## Статус аудита (heads)

| Ветка | Repo | Head | Статус |
|---|---|---|---|
| `fix/p0-3-chain-id` | gcsc-website | `8a19d5f6` | ✅ APPROVED (Codex) |
| `fix/p1-6-homepage-v1-3-draft` | gcsc-website | `65840cee` | ✅ APPROVED (Codex) |
| `fix/p1-1-sender-binding` | gcsc-smart-contractor | `9d5318b` | ждёт финального APPROVED Codex (см. `ai-review/CODEX-REVIEW-PROMPT.md`) |
| `fix/p1-3-persist-receipts` | gcsc-smart-contractor | `a81df24b` | ✅ APPROVED (Claude) |

## Фаза 1 — закрыть аудит (слияние в main)

Как только ты поставишь финальный APPROVED по `fix/p1-1-sender-binding` @ `9d5318b`, сливаем фикс-ветки в `main` **каждого репо** одним чистым заходом:
- gcsc-website: `fix/p0-3-chain-id`, `fix/p1-6-homepage-v1-3-draft` → `main`.
- gcsc-smart-contractor: `fix/p1-1-sender-binding`, `fix/p1-3-persist-receipts` → `main`.

Условия: перед каждым merge — `execution/ai-review-gate.ps1 -ReviewFile <запись>` → `AI_REVIEW_GATE=PASS`. Merge выполняется только с явного «да» founder (он присутствует и одобрил план). **Deploy НЕ делаем** (Railway/Render/mainnet/реальные платежи остаются за founder отдельно).

## Фаза 2 — объединение в один монорепозиторий

Отдельной задачей после Фазы 1. Идея: перенести backend внутрь главного репо, чтобы был ОДИН репозиторий на всё.

Предлагаемая целевая структура (в `gcsc-website`):
```
/ (gcsc-website — единый репо)
├── mobile/                 # приложение SmartContractor
├── construction-ai/        # валидаторы, homepage, скрипты
├── contracts/              # proton-tsc контракты
├── backend/                # ← сюда переносится gcsc-smart-contractor (сейчас v3/)
├── docs/  ai-review/  ...
```

Шаги миграции (исполняю я, Claude; ты ревьюишь как второй агент):
1. Перенести `gcsc-smart-contractor` в `gcsc-website/backend/` **с сохранением git-истории** (`git subtree add` или `git filter-repo` + merge), чтобы история коммитов backend не потерялась.
2. Обновить пути в `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` и в мобильных клиентах (base URL/скрипты), где ссылались на отдельный backend-репо.
3. **Поправить деплой backend**: сейчас деплоится из корня своего репо (Render/Railway) — после переноса root directory сервиса = `backend/`. Это правит founder в панели хостинга (мы только даём инструкцию), т.к. это live-настройка.
4. Единые `ai-review/`, один review-gate, один поток. Старый репо `gcsc-smart-contractor` — архивируем (не удаляем), помечаем «moved to gcsc-website/backend».
5. Прогон всех проверок backend по новым путям (node --check, payments-402 23/23, pg-storage/pg-workflow) + homepage-валидаторы — по правилу «зелёное перед передачей».

Открытые вопросы для согласования (ответь в своей review-записи или отдельным сообщением):
- имя целевой папки: `backend/` (предлагаю) или оставить `v3/`?
- сохранять полную git-историю backend (subtree/filter-repo) — да/нет (я предлагаю ДА).

## Границы (стоп — только founder)

Реальный deploy, публичная замена сайта, mainnet, реальные платежи/займы/escrow, секреты/внешние аккаунты, изменение live-настроек хостинга, XPR/FIO подписи, destructive на production. Merge в `main` — только с явным «да» founder. `v3/gcsc.db` не коммитим.

## Что вернуть founder

Короткий отчёт: поставил ли APPROVED по P1-1 `9d5318b`; согласен ли с именем папки `backend/` и сохранением истории; готов ли к Фазе 1 (merge) после его «да».
