---
name: LightRAG
description: Индексирует документы GCSC и отвечает на вопросы через базу знаний с графом связей. Используй когда нужно найти информацию по проекту, проверить соответствие whitepaper, или дать AI агентам доступ к знаниям GCSC.
allowed-tools: [Read, Write, Bash, Glob]
---

# LightRAG — База знаний GCSC

## Goal
Построить и использовать умную базу знаний GCSC на основе всех документов проекта. AI агенты могут запрашивать её для поиска контекста.

## Input
- Команда «проиндексируй документы» — первичная индексация
- Команда «спроси базу знаний: [вопрос]» — запрос к базе
- Команда «запусти LightRAG сервер» — старт REST API

## Steps

### Первичная установка
```bash
pip install "lightrag-hku[api]" --break-system-packages
```

### Индексация всех документов GCSC
```bash
python3 .claude/skills/lightrag/scripts/index_docs.py
```

### Запрос к базе знаний
```bash
python3 .claude/skills/lightrag/scripts/query.py "твой вопрос" hybrid
```

### Запуск REST API сервера
```bash
lightrag-server --host 0.0.0.0 --port 9621 --working-dir ./gcsc-knowledge
```

## Режимы запросов
- `hybrid` — рекомендуется, сочетает векторный поиск + граф знаний
- `local` — конкретные факты из документов
- `global` — общие концепции и связи
- `naive` — простой поиск, самый быстрый

## Документы для индексации
Скрипт автоматически индексирует:
- `docs/*.md` — вся документация
- `AGENTS.md` — архитектура проекта
- `gcsctoken111/*.ts` — смарт-контракты
- `gcscbuild11/*.ts` — контракты build модуля

## Output Format
Ответ из базы знаний с указанием источников и связей из графа.

## Learnings
- Документация: docs/lightrag.md
- Рабочая папка базы знаний: ./gcsc-knowledge
- Требует OPENAI_API_KEY в .env для LLM
