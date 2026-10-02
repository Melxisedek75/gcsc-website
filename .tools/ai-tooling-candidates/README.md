# GCSC AI tooling candidates

Снимок shallow clone на 2026-10-01. Репозитории скачаны для локального сравнительного анализа; они пока не установлены в runtime и не подключены к GCSC.

## Кандидаты

| Каталог | Назначение | Следующий шаг |
|---|---|---|
| `ecc` | Универсальный слой skills/rules/MCP/memory для Codex и других harness | Проверить Codex surface и выбрать безопасный профиль |
| `superpowers` | Планирование, TDD, review workflow | Сравнить с текущими skills проекта |
| `capsule` | Codex-first compression и recoverable context | Локальный benchmark на логах GCSC |
| `context-compress` | MCP/CLI compression tool output | Локальный benchmark в conservative/balanced mode |
| `mem0` | Долговременная memory layer | Проверить хранение, удаление, source/date/confidence |
| `letta` | Stateful agents и persistent identity | Архитектурный fit-check, без внедрения в production |
| `mcp-use` | TypeScript MCP servers/apps и UI | Прототип read-only MCP для сайта |
| `fastmcp` | Python MCP servers/clients для AI backend | Прототип read-only MCP для construction agents |
| `high-end-site-reference` | Reference для Next.js/GSAP/Lenis/R3F landing page | Использовать только после проверки лицензии |
| `openai-plugins` | Официальный OpenAI Developers plugin source | Использовать официальную установку в Codex; secrets не коммитить |

## Предварительная целевая архитектура

1. OpenAI Developers plugin — официальные OpenAI docs, Agents SDK и ChatGPT Apps.
2. ECC — проектные правила, skills, review gates и portable workflow.
3. Capsule/context-compress — только после измерения качества и token savings.
4. Mem0-подобная versioned memory — для безопасной памяти агентов; Letta оставить экспериментальным.
5. `mcp-use` для TypeScript/web surfaces и `FastMCP` для Python agents.
6. Для презентационного сайта: Next.js/React + accessible UI + GSAP/ScrollTrigger + Lenis; R3F/WebGL только для hero/controlled scenes с mobile fallback.

## Ограничения

- Не выполнять npm/pip install без отдельной проверки зависимостей и лицензий.
- Не подключать внешние MCP, API keys, production databases, payments, blockchain writes или live escrow.
- Не копировать код из `high-end-site-reference`, пока лицензия не подтверждена.
- Все claims о token reduction проверять на одинаковых GCSC workloads.
