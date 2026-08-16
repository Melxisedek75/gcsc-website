# Independent SOL Ultra Review Gate

Этот файл задаёт независимую проверку изменений GCSC/SmartContractor. Он заменяет
обязательную привязку к паре Codex/Claude независимыми ролями и execution contexts.

## Роли и execution contexts

- `SOL_ULTRA` -- внутренний capability profile GCSC, который разрешается в
  `highest available Codex reasoning configuration`, доступную в безопасной
  локальной среде. Это не официальное название публичной модели.
- Для новой работы с `Author AI: CODEX_AUTHOR` reviewer по умолчанию --
  `SOL_ULTRA_REVIEWER`. Допустимые независимые альтернативы: `CODEX_REVIEWER`
  и `CLAUDE_REVIEWER`.
- Автор указывает `Author context ID`, reviewer -- `Reviewer context ID`:
  идентификаторы task/thread/session должны быть конкретными, не placeholder и
  различаться. Author and reviewer execution contexts must differ.
- Роли автора и reviewer также различаются. Same-context self-approval
  запрещён, даже если оба запуска используют Codex.
- Reviewer получает только bounded evidence packet: base/head SHA, changed
  files, requirements, команды проверок, risk boundaries и путь review record.
  Авторский reasoning transcript не передаётся как доказательство ревью.

## Обязательное правило

Ни один merge, deploy, production integration, live payment, live loan, escrow,
XPR action или публичная публикация не выполняется только на основании автора.

1. Автор создаёт отдельную ветку/worktree и файл
   `ai-review/records/YYYY-MM-DD-short-name.md` из `ai-review/TEMPLATE.md`.
2. Автор указывает scope, risk tier, изменённые файлы, обязательные проверки,
   `Author context ID` и известные ограничения, затем ставит
   `READY_FOR_REVIEW`.
3. Для новой Codex-authored работы назначается fresh
   `SOL_ULTRA_REVIEWER` в отдельном execution context через
   `ai-review/coordination/inbox/codex-review/`.
4. Reviewer самостоятельно читает diff и повторно запускает все обязательные
   проверки. Для runtime, authentication, payment, contract, database или CI
   изменений в том же record фиксируется отдельный `Independent QA/security`.
5. P0/P1 переводят record в `CHANGES_REQUESTED`. После исправления требуется
   новый независимый review pass с другим reviewer context.
6. Только isolated reviewer может поставить `Reviewer decision: APPROVED` и
   `Required checks: PASS`.
7. `APPROVED` only permits merge consideration. Merge is not automatic и
   требует явного integration action после проверки record.
8. `Deploy decision` и все live-risk boundaries остаются
   `BLOCKED_FOUNDER` до отдельного evidence-backed founder approval без
   секретов. Review approval и `AI_REVIEW_GATE=PASS` не разрешают deploy.
9. Перед рассмотрением merge запускается технический gate:

```powershell
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/YYYY-MM-DD-short-name.md
```

Технический gate не заменяет это policy. New-role records не могут заявлять
`AI_REVIEW_GATE=PASS`, пока validator не поддерживает их поля и context IDs.

## Правило «зелёное перед передачей» (один круг ревью)

Цель: ревью проходит **за один проход** (`READY_FOR_REVIEW` → `APPROVED`), без повторных кругов из-за того, что можно было поймать самому.

Перед тем как поставить `READY_FOR_REVIEW`, автор ОБЯЗАН:

1. Прогнать **весь** набор обязательных проверок задачи сам (node --check, полные тест-сюиты, `tsc --noEmit`, все относящиеся валидаторы, pg-smoke и т.д.) точно теми командами, которыми их будет гонять reviewer — без временных CLI-обходов (напр. без `--testTimeout`, если правка должна работать и без него).
2. Тесты, склонные к «мигающим» сбоям (тайминги, генерация ключей, сеть, БД), прогнать **2–3 раза подряд** и убедиться, что стабильно зелёные. Медленный Windows-runner founder'а — целевая среда; ориентируйся на неё.
3. Исправить **все** найденные проблемы **одним заходом** (не «починил одно → нашёл второе → новый круг»). Пройтись по всему списку находок ревьюера сразу.
4. В review-запись вписать точные команды и их результат (PASS/xx-of-yy), чтобы reviewer воспроизвёл в один проход.

Reviewer, найдя проблему, которую автор обязан был поймать по этому правилу, помечает её как процессное нарушение в записи. Дважды подряд у одного автора — правило усиливается.

## Risk tiers

- `DOCUMENTATION`: один независимый `SOL_ULTRA_REVIEWER`.
- `RUNTIME`: runtime, authentication, payment, contract, database или CI;
  reviewer плюс независимый QA/security pass в том же record.
- `LIVE_RISK`: любая работа с production, публичной публикацией, деньгами,
  подписями, внешними аккаунтами или destructive action; reviewer и QA/security
  не снимают `BLOCKED_FOUNDER`.

## Coordination и совместимость

- Локальная запись и evidence: `ai-review/records/`.
- Новые review requests для SOL Ultra: `ai-review/coordination/inbox/codex-review/`.
- Порядок packet, claim и результата определён в
  `ai-review/coordination/PROTOCOL.md`.
- Draft Pull Request может быть evidence surface, но не заменяет независимый
  context и не даёт права на merge.
- Прямые рабочие изменения в `main` запрещены. Один PR содержит одну
  законченную задачу и одну review-запись.
- Исторические records с `CODEX`/`CLAUDE` остаются читаемыми и не
  переписываются. Они могут использовать legacy compatibility только в
  `LegacyRecord` mode; новые работы не используют этот режим и обязаны иметь
  role/context fields.

## Статусы

- `READY_FOR_REVIEW`: автор закончил первый проход.
- `CHANGES_REQUESTED`: reviewer нашёл обязательные исправления.
- `APPROVED`: reviewer подтвердил diff и проверки.
- `BLOCKED`: merge/deploy запрещён.
- `READY`: локальный review gate пройден; это разрешает только merge
  consideration и не отменяет `BLOCKED_FOUNDER` для deploy/live-risk.

## Live-risk

Следующие действия всегда требуют отдельный evidence-backed founder approval:
production deploy, публичная замена сайта, секреты и внешние аккаунты, live
Supabase, реальные платежи/займы/escrow, stablecoin/token collateral, XPR/FIO
подписи, legal/provider commitments, мобильная публикация и destructive actions.
До него `Deploy decision` и применимые live-risk boundaries равны
`BLOCKED_FOUNDER`.

## Текущий статус

Аудит от 2026-07-01 находится в `ai-review/records/2026-07-01-monthly-audit.md`. Его решение: `CHANGES_REQUESTED`; deploy и реальные платежи заблокированы до устранения P0/P1.
