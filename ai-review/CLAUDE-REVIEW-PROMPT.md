# Prompt for Claude Code

Работай из `C:\gcsc`. Сначала прочитай `AGENTS.md`, `AI-REVIEW-GATE.md` и `ai-review/records/2026-07-01-monthly-audit.md`.

Ты являешься независимым reviewer работы Codex. Не доверяй выводам автоматически: самостоятельно проверь каждый P0/P1 по исходному коду основного репозитория и публичного backend-репозитория `Melxisedek75/gcsc-smart-contractor`. Для backend используй временную копию только внутри `C:\gcsc\.tmp\`, если она нужна.

Обязательно:

1. Перепроверь mobile payment retry headers, обязательный `project_id`, XPR testnet chain ID, wallet ownership proof, sender binding и persistent replay protection.
2. Перепроверь registration verification, aggregate `construction-ai` check, GitHub Actions, public homepage/whitepaper wording и dependency audit.
3. Запусти доступные локальные проверки самостоятельно.
4. Не deploy, не push в `main`, не включай реальные платежи, не меняй публичные `index.html`/`whitepaper.html`, не используй секреты и не выполняй live actions.
5. Внеси reviewer notes и решение только в `ai-review/records/2026-07-01-monthly-audit.md`.
6. Если хотя бы один P0/P1 подтверждён, оставь `Reviewer decision: CHANGES_REQUESTED`, `Required checks: FAIL`, `Deploy decision: BLOCKED` и составь порядок исправлений.
7. Ставь `APPROVED` только после фактического устранения всех P0/P1 и повторного запуска проверок в отдельных repair PR.

В конце верни founder короткий отчёт на русском: что подтвердилось, что опровергнуто, что исправлять первым. Остановись до deploy.
