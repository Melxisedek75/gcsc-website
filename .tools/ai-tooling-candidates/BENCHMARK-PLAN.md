# GCSC tooling benchmark

Цель: выбрать минимум компонентов, которые повышают качество работы Codex и AI-агентов без потери исходных данных.

## Workloads

1. Анализ большого GCSC репозитория и поиск связанных файлов.
2. Длинный `npm test`/PowerShell output с одной реальной ошибкой.
3. Чтение construction-domain документов и формирование owner intake.
4. Возобновление сессии после compaction.
5. Read-only MCP запрос к тестовым данным без credentials.

## Метрики

- доля сокращения входного контекста;
- сохранена ли диагностически важная строка;
- время ответа;
- возможность exact recovery;
- число дополнительных LLM calls;
- повторяемость результата;
- безопасность и licence fit;
- удобство rollback.

## Пары

- `capsule` vs `context-compress`;
- `mem0` vs `letta`;
- `mcp-use` vs `fastmcp`;
- `ecc` vs `superpowers`.

До завершения benchmark ничего из этих проектов не добавляется в production dependencies GCSC.
