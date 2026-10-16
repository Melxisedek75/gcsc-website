# GCSC Local Project Structure

Эта папка `C:\gcsc` теперь является центральной локальной папкой для Global Construction Smart Contract.

## Главное

- `C:\gcsc` - основной корень проекта на компьютере.
- `C:\gcsc\.git` - подключение к GitHub `Melxisedek75/gcsc-website`.
- `C:\gcsc\contracts` - актуальные файлы контрактов, восстановленные из `origin/main`.
- `C:\gcsc\_collected` - найденные отдельные папки GCSC/XPR, собранные в одно место.
- `C:\gcsc\_local_backup_before_github_sync_20260502-213510` - backup локальных файлов перед восстановлением GitHub-версии.

## Собранные папки

- `C:\gcsc\_collected\gcsc-agent-kit`
- `C:\gcsc\_collected\gcsc-website-repo`
- `C:\gcsc\_collected\GCSC_Backup`
- `C:\gcsc\_collected\xprclaw`
- `C:\gcsc\_collected\xprclaw_download_site`

## GitHub

Remote:

```text
origin https://github.com/Melxisedek75/gcsc-website.git
```

Синхронизация выполнена с веткой `origin/main`. PR refs также скачаны локально как `origin/pr/1` и `origin/pr/2`.

## Новые артефакты (2026-06)

- `C:\gcsc\design-concepts\gcsc-store\` — концепты главной страницы gcsc.store: `living-blueprint.html` (интерактивный scroll-driven сайт + эскроу-симулятор), 3 ранних концепта, и `MASTER-PROMPT.md` (промт «Living Blueprint» для генерации сайта).
- `C:\gcsc\WEEKLY-PLAN.md` — текущий недельный план автономной работы (статусы D1–D7).

## Соседний репозиторий — приложение

Фронт-приложение и его API-инструменты живут в ОТДЕЛЬНОМ репо `C:\gcsc-store` (`Melxisedek75/gcsc-store`, рабочая ветка `api-backend`):

- `C:\gcsc-store\src` — Vite + TypeScript приложение (dashboard, страницы).
- `C:\gcsc-store\mcp-server` — MCP-сервер (26 инструментов `gcsc_*` поверх backend API; `npm run check` — smoke-тест; подключение: `claude mcp add gcsc -- node C:/gcsc-store/mcp-server/dist/index.js`).

Бэкенд-API (Node, `pure-server.js`) — в третьем репо `C:\gcsc-smart-contractor` (см. `v3/ARCHITECTURE-TRUTH.md`).

## Правило на будущее

Если нужно искать файлы проекта, начинать с `C:\gcsc`.
