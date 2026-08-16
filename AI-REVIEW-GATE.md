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
  идентификаторы должны быть UUID, выданными execution environment, и
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
2. Автор указывает `Change ID`, scope, один из risk tiers `DOCS`, `STANDARD`,
   `HIGH` или `LIVE`, изменённые файлы, обязательные проверки,
   `Author context ID` и известные ограничения, затем ставит
   `READY_FOR_REVIEW`.
3. Для новой Codex-authored работы назначается fresh
   `SOL_ULTRA_REVIEWER` в отдельном execution context через
   `ai-review/coordination/inbox/codex-review/`.
4. Reviewer самостоятельно читает diff и повторно запускает все обязательные
   проверки. Для `HIGH` и `LIVE` в том же record фиксируется
   `Independent QA/security: PASS` и изолированный `QA/security context ID`.
5. P0/P1 переводят record в `CHANGES_REQUESTED`. После исправления требуется
   новый независимый review pass с другим reviewer context.
6. Только isolated reviewer может поставить `Reviewer decision: APPROVED` и
   `Required checks: PASS`, записать `Reviewer attested head/tree` и создать
   отдельный review-only commit под reviewer identity.
   После reviewed head разрешено менять только текущий tracked regular
   Markdown review record и вычисляемый из `Change ID` парный review request.
   Coordination scripts, binaries, второй record или любой другой payload
   требуют нового reviewed head и нового review pass.
   `Reviewed at (UTC)`, author result/limitations, reviewer diff inspection,
   independently rerun checks, findings, final rationale и `Status: APPROVED`
   должны содержать завершённые evidence, а не placeholders.
7. `APPROVED` only permits merge consideration. Merge is not automatic и
   требует явного integration action после проверки record.
8. `Deploy decision` и все live-risk boundaries остаются
   `BLOCKED_FOUNDER` до отдельного evidence-backed founder approval без
   секретов. Review approval и `AI_REVIEW_GATE=PASS` не разрешают deploy.
9. Перед рассмотрением merge запускается технический gate:

```powershell
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/YYYY-MM-DD-short-name.md -Operation Merge
```

Отдельный deploy gate запускается только после evidence-backed founder approval:

```powershell
powershell -ExecutionPolicy Bypass -File execution/ai-review-gate.ps1 -ReviewFile ai-review/records/YYYY-MM-DD-short-name.md -Operation Deploy
```

Обе команды являются проверками policy и не выполняют merge или deploy сами.
Локальный gate всегда отклоняет `LIVE` и `Deploy`; их может разрешить только
отдельный founder-controlled runner с проверяемой внешней identity/evidence.

## Правило «зелёное перед передачей» (один круг ревью)

Цель: ревью проходит **за один проход** (`READY_FOR_REVIEW` → `APPROVED`), без повторных кругов из-за того, что можно было поймать самому.

Перед тем как поставить `READY_FOR_REVIEW`, автор ОБЯЗАН:

1. Прогнать **весь** набор обязательных проверок задачи сам (node --check, полные тест-сюиты, `tsc --noEmit`, все относящиеся валидаторы, pg-smoke и т.д.) точно теми командами, которыми их будет гонять reviewer — без временных CLI-обходов (напр. без `--testTimeout`, если правка должна работать и без него).
2. Тесты, склонные к «мигающим» сбоям (тайминги, генерация ключей, сеть, БД), прогнать **2–3 раза подряд** и убедиться, что стабильно зелёные. Медленный Windows-runner founder'а — целевая среда; ориентируйся на неё.
3. Исправить **все** найденные проблемы **одним заходом** (не «починил одно → нашёл второе → новый круг»). Пройтись по всему списку находок ревьюера сразу.
4. В review-запись вписать точные команды и их результат (PASS/xx-of-yy), чтобы reviewer воспроизвёл в один проход.

Reviewer, найдя проблему, которую автор обязан был поймать по этому правилу, помечает её как процессное нарушение в записи. Дважды подряд у одного автора — правило усиливается.

## Risk tiers

- `DOCS`: documentation-only change; `Independent QA/security` и
  `QA/security context ID` равны `NOT_REQUIRED`.
- `STANDARD`: обычное non-live изменение; `Independent QA/security` и
  `QA/security context ID` равны `NOT_REQUIRED`.
- `HIGH`: security-sensitive или high-blast-radius изменение; требуется
  `Independent QA/security: PASS` и concrete non-placeholder
  `QA/security context ID`, отличающийся от author/reviewer context IDs.
- `LIVE`: production, публичная публикация, деньги, подписи, внешние аккаунты
  или destructive action; требуется тот же QA/security evidence, но reviewer
  и QA/security не снимают `BLOCKED_FOUNDER`.

Validator вычисляет минимальный tier из реального `Base commit...Head commit`
diff: изменение любого файла кроме `.md`, `.txt` и `.csv` требует минимум
`HIGH`. Поэтому runtime нельзя понизить до `STANDARD` декларацией в record.

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
  переписываются. `-LegacyRecord` явно подтверждает архивный режим, но всегда
  fail-closed и не может разрешить Merge или Deploy. Любая интегрируемая работа
  должна получить новый strict record с role/context fields.

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
Новый record начинает с `Deploy decision: BLOCKED_FOUNDER`,
`Live-risk decision: BLOCKED_FOUNDER` и `Founder evidence: PENDING`.
Поля `Founder approval head` и `Founder approval operation` также начинаются с
`PENDING`.

После безопасного независимого review для merge только `Reviewer decision`
становится `APPROVED`, `Required checks` -- `PASS`, а `Merge decision` --
`READY`. Если merge не запрашивает live action, перед `-Operation Merge`
также указываются `Live-risk decision: NOT_REQUIRED` и
`Founder evidence: NOT_REQUIRED`; это разрешает лишь merge consideration и не
снимает live-risk границы. Deploy остаётся `BLOCKED_FOUNDER`, пока отдельное
founder approval не зафиксирует
`Live-risk decision: FOUNDER_APPROVED`, безопасную ссылку в `Founder evidence`
с разрешённым форматом, точный reviewed SHA в `Founder approval head`, scope
`Merge`, `Deploy` или `MergeAndDeploy` в `Founder approval operation` и
`Deploy decision: READY`, после чего запускается соответствующий явный gate.

## Текущий статус

Аудит от 2026-07-01 находится в `ai-review/records/2026-07-01-monthly-audit.md`. Его решение: `CHANGES_REQUESTED`; deploy и реальные платежи заблокированы до устранения P0/P1.
