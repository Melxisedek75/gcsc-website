# Предложение: замена публичного index.html на v1.3 (C3)

Дата: 2026-07-19. Автор: CLAUDE. Статус: **ждёт решения founder — сам НЕ заменяю.**

## Side-by-side

| Критерий | Текущий публичный `index.html` | Кандидат `index-v1-3-static-draft.html` |
|---|---|---|
| Размер | 15.1 KB | 8.3 KB |
| Внешние зависимости | Tailwind CDN + AOS + Google Fonts (5 внешних загрузок) | 0 — полностью самодостаточный CSS |
| Framing | «AI Infrastructure for Construction Finance», упоминает decentralized/escrow/blockchain 10 раз | «Construction Trust Infrastructure» — trust-first, финансы через партнёров; blockchain/escrow/token: 0 упоминаний |
| Риск-лексика (investment/staking/yield/NFT) | нет | нет |
| Соответствие whitepaper v1.3 (гибридная модель) | нет — довзросло-Web3 подача | да — канон, проверен `check:smartcontractor` (validate-homepage-v1-3-static-draft) |
| SEO/robots | индексируется | сейчас noindex + NO-GO баннер (снять при публикации) |

## Рекомендация

Заменить: кандидат честнее (соответствует состоянию продукта «no real money»), быстрее (нет CDN), и согласован с whitepaper v1.3 и всеми 499 валидаторами. Текущая страница обещает decentralized escrow, которого публично нет.

## Чек-лист публикации (только founder)

1. [ ] Прочитать `index-v1-3-static-draft.html` в браузере (открыть файл двойным кликом).
2. [ ] Решение GO/NO-GO. При GO:
3. [ ] Claude готовит publish-версию: удаляет draft-баннер, `noindex`, «Not Approved» строки; ссылки проверены.
4. [ ] Codex/Claude cross-review публикационной версии (AI-REVIEW-GATE).
5. [ ] Founder коммитит замену `index.html` (или говорит «заменяй» — тогда заменяю я и пушу).
6. [ ] Проверка live-страницы на gcsc.io / GitHub Pages.

Rollback: `git revert` одного коммита возвращает старую страницу.
