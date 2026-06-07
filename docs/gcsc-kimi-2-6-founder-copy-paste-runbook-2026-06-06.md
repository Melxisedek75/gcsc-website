# GCSC Kimi 2.6 Founder Copy-Paste Runbook

Date: 2026-06-06 PT

Status: founder-facing simple runbook for starting Kimi 2.6 safely.

Этот документ не разрешает публичную публикацию, замену `index.html` или `whitepaper.html`, live Supabase, admin activation, strict RLS apply, deploy settings, public beta launch, tester invites, legal/provider decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, app-store actions, secrets, production release или destructive actions.

## Главная Идея

Kimi 2.6 должен сначала понять проект, а не сразу запускать 100 ботов.

Первый запуск Kimi должен закончиться только одним результатом:

```text
UNDERSTANDING REPORT
WAITING_FOR_CODEX_APPROVAL
```

После этого ты присылаешь этот отчет в Codex. Codex проверяет отчет по hard gates. Только если отчет безопасный, Codex даст точную фразу:

```text
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY
```

Без этой фразы Kimi не должен запускать 100 worker bots.

## Что Нельзя Загружать Или Вставлять

Никогда не вставляй в Kimi:

- passwords;
- API keys;
- private keys;
- seed phrases;
- Magic Link URLs;
- Auth tokens;
- session cookies;
- Supabase service-role keys;
- database passwords;
- `.env` values;
- wallet material;
- payment data;
- bank/lender/escrow private data;
- private customer data;
- attorney advice;
- provider credentials;
- Apple/Google/Vercel/Namecheap login data;
- screenshots with private data.

Если Kimi просит это, остановись и напиши в Codex:

```text
Kimi requested forbidden private/live data. BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW.
```

## Файлы, Которые Можно Дать Kimi

Если Kimi поддерживает загрузку файлов, загрузи только эти локальные документы:

1. `AGENTS.md`
2. `docs/gcsc-active-context.md`
3. `docs/codex-nonstop-execution-hook.md`
4. `docs/gcsc-daily-work-mode-hook.md`
5. `docs/smartcontractor-backlog.md`
6. `docs/smartcontractor-two-week-plan-2026-05-30.md`
7. `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md`
8. `docs/whitepaper-v1-3-public-draft.md`
9. `docs/whitepaper-v1-3-public-outline.md`
10. `docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md`
11. `docs/whitepaper-v1-3-claim-risk-register.md`
12. `docs/whitepaper-v1-3-smartcontractor-product-integration-map.md`
13. `docs/whitepaper-v1-3-publication-gate.md`
14. `docs/whitepaper-v1-3-week-one-closeout-2026-06-06.md`
15. `docs/whitepaper-v1-3-autonomous-continuation-rule.md`
16. `docs/autonomous-status/2026-06-05-2225-week-two-live-boundary-handoff.md`
17. `docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md`
18. `docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md`
19. `docs/gcsc-kimi-2-6-understanding-report-intake-template-2026-06-06.md`
20. `docs/gcsc-kimi-2-6-100-worker-dispatch-board-2026-06-06.md`

Не загружай папку целиком. Не загружай `.env`, `_collected`, screenshots, credentials, private backups, wallet files, deployment exports или customer data.

## Шаг 1. Открой Kimi

1. Открой Kimi 2.6.
2. Создай новый чат или новый project.
3. Назови его примерно так:

```text
GCSC SmartContractor Kimi 2.6 Wave Two - Understanding Report Only
```

4. Загрузи разрешенные файлы из списка выше.
5. Если Kimi не умеет принимать много файлов, загрузи минимум:

```text
AGENTS.md
docs/gcsc-active-context.md
docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md
docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md
docs/gcsc-kimi-2-6-100-worker-dispatch-board-2026-06-06.md
```

## Шаг 2. Вставь Сообщение В Kimi

Открой файл:

```text
docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md
```

Найди раздел:

```text
## 3. Copy-Paste Prompt For Kimi 2.6
```

Скопируй весь текст внутри блока ```text ... ```.

Вставь его в Kimi.

В конце добавь одну строку:

```text
Important: return ONLY the first UNDERSTANDING REPORT and final verdict WAITING_FOR_CODEX_APPROVAL. Do not dispatch workers yet.
```

Нажми send.

## Шаг 3. Что Должен Вернуть Kimi

Правильный первый ответ Kimi должен быть только отчетом о понимании.

В нем должны быть разделы:

1. Mission summary.
2. Current state.
3. Non-negotiable boundaries.
4. Proposed 100-bot allocation.
5. Expected output package.
6. Integration safety model.
7. Questions or contradictions.
8. Final controller verdict.

В конце должно быть:

```text
WAITING_FOR_CODEX_APPROVAL
```

Если Kimi пишет, что уже запустил ботов, уже начал работу, создал файлы, сделал deploy, менял public website, сделал live action или просит secrets, не продолжай.

Сразу отправь мне в Codex:

```text
Kimi did not stop at UNDERSTANDING REPORT. Please review for unsafe behavior.
```

## Шаг 4. Отправь Отчет В Codex

Когда Kimi вернет первый отчет:

1. Скопируй весь отчет Kimi.
2. Вставь его в Codex.
3. Напиши сверху:

```text
Проверь UNDERSTANDING REPORT от Kimi 2.6 по checklist и скажи APPROVE или REVISE.
```

Codex проверит отчет по файлу:

```text
docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md
```

## Шаг 5. Если Codex Одобрит

Если Codex даст точную фразу:

```text
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY
```

Только тогда вставь эту фразу в Kimi.

После этого Kimi может использовать dispatch board:

```text
docs/gcsc-kimi-2-6-100-worker-dispatch-board-2026-06-06.md
```

Kimi должен вернуть:

- controller executive summary;
- stream status table A-J;
- 100 worker reports or missing worker list;
- unsafe recommendations rejected;
- top 25 safe local-only Codex integration candidates;
- exact integration order;
- founder-only blockers;
- final verdict.

## Шаг 6. Если Codex Не Одобрит

Если Codex даст:

```text
NOT_APPROVED_REVISE_UNDERSTANDING_REPORT
```

Вставь в Kimi только Codex correction response.

Не запускай 100 ботов.

Kimi должен вернуть только revised `UNDERSTANDING REPORT`.

## Шаг 7. Когда Kimi Вернет 100 Worker Reports

Не копируй эти отчеты в проект вручную.

Сохрани:

- controller summary;
- worker reports;
- any proposed local-only files;
- blocked/rejected items.

Если работаешь в `C:\gcsc`, можно подготовить intake folder:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-output-intake
npm run print:kimi-latest-intake-paths
```

Потом положи Kimi output только в созданную `.tmp\kimi-wave-one-output-intake-*` папку по stream folders. Не клади туда secrets/private data.

## Красные Флаги

Остановись и вернись в Codex, если Kimi:

- говорит, что может publish/deploy/launch;
- предлагает менять `index.html` или `whitepaper.html`;
- просит API key, password, Magic Link URL, wallet key или `.env`;
- предлагает live Supabase apply;
- предлагает real payments, real loans, escrow release, repayment routing, stablecoin settlement или token collateral;
- говорит, что legal/provider approval уже получен;
- предлагает XPR/FIO signature/action;
- предлагает invite testers или launch beta без отдельного founder approval.

## Минимальное Сообщение Для Codex После Kimi

Когда первый Kimi report готов, отправь в Codex:

```text
Проверь UNDERSTANDING REPORT от Kimi 2.6.

[вставь отчет Kimi сюда]
```

Codex дальше скажет:

- approve;
- revise;
- blocked unsafe.

## Текущий Рекомендованный Режим

Сначала запускаем только понимание задачи. Не запускаем 100 ботов сразу.

Причина: проект уже большой, public/legal/money/Web3 boundaries критичны, и ошибка одного controller prompt может создать 100 неправильных отчетов. Лучше потратить один цикл на проверку понимания, чем потом чистить хаос.
