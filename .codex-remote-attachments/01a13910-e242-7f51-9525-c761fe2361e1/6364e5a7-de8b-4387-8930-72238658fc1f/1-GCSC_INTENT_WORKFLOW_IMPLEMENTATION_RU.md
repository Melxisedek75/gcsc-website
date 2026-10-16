# INTENT → SPEC → PLAN: отчет внедрения и передача
Дата: 13 октября 2026 (America/Los_Angeles).

Правило добавлено в глобальный AGENTS.md доступной облачной среды Codex: /root/.codex/AGENTS.md. Это не личный desktop пользователя.

| Локальный проект | Commit | Результат |
|---|---|---|
| /workspace/scratch/617994d91695/gcsc-smart-contractor | b58d358b8c2026aea8e9ab0149e026bacdea5f6a | AGENTS.md + INTENT/SPEC/PLAN/REPORT |
| /workspace/sites/alpha-lux-sunlit | 1d7d6df9d0144133e461ab8aa857f5b09b48c620 | AGENTS.md + INTENT/SPEC/PLAN/REPORT |
| /workspace/sites/alpha-lux-lead-radar | d373f63540bd6ad54c6f3390ff4f4a28c895d42e | AGENTS.md + INTENT/SPEC/PLAN/REPORT |
| /workspace/sites/melxisedek-agent-hub | 97de1fdb01e4836b93fa6fde0c00515129df4c45 | AGENTS.md + INTENT/SPEC/PLAN/REPORT |

Проверено: существование документов, текст правила, git diff --cached --check, состав отдельных коммитов. Посторонние незакоммиченные изменения не включены. Код приложения не изменялся.

Не проверено и не выполнено: перенос на личный desktop; загрузчик контекста действующих API-агентов; новая независимая сессия агента; push и публикация. Исторические копии без подтвержденного активного Git checkout не изменялись. Полное внедрение во всю экосистему остается незавершенным.

## Поручение desktop Codex / Melxisedek
Найди фактический активный checkout и прочитай существующие AGENTS.md. Сохрани все прежние правила. Добавь следующий блок в глобальный AGENTS.md реального Codex configuration directory и в подтвержденные проекты. Не меняй ключи, модели или разрешения.

```text
For substantial features, integrations, refactors, and multi-session work,
use docs/tasks/<task-id>/INTENT.md, SPEC.md, and PLAN.md before implementation.
Read current code and applicable instructions first. Record assumptions and
resolve factual gaps using evidence. Map acceptance criteria to requirements,
implementation steps, and verification. Keep PLAN.md current and finish with
REPORT.md showing evidence and remaining limitations. Continue authorized work
without routine approval stops. Skip this workflow for simple edits/questions.
On resumption, read the task files and check the actual repository state.
```

Для API runtime найди реальный вход обработки задачи; загружай документы именно текущего task-id с commit/version, не все документы репозитория. Проверяй task-id, исключай путь за пределы docs/tasks и секреты. Не объявляй интеграцию выполненной по наличию документов. Проверь одну безопасную сложную задачу от намерения до результата; запусти новую сессию без истории и проверь, что агент называет фактический следующий шаг. Запиши точные проверки и scoped commit в REPORT.md.

## Как пользоваться
1. Опиши желаемый результат, кому он нужен, ограничения и признак успеха.
2. Агент записывает INTENT: зачем и что получить.
3. SPEC: конкретные проверяемые правила.
4. PLAN: действия, прогресс и следующий шаг.
5. REPORT: доказательства, что результат работает, и оставшиеся ограничения.
6. При смене чата передай четыре актуальных файла или доступ к их папке и попроси сверить реальный код. Простые переводы и небольшие изменения обходятся без полного процесса.

Пример: кнопка «Купить лид». INTENT — подрядчик резервирует лид без двойной оплаты. SPEC — проверка входа, статуса лида, отмены и повторного запроса. PLAN — сервер, интерфейс, проверки. REPORT — наблюдаемые результаты проверок; неподтвержденные реальные платежи не объявляются проверенными.
