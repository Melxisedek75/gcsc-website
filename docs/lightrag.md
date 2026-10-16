# LightRAG — Локальная документация GCSC

> Репозиторий: https://github.com/HKUDS/LightRAG
> Пакет PyPI: `lightrag-hku`
> Статья: EMNLP 2025 — «LightRAG: Simple and Fast Retrieval-Augmented Generation»

---

## Что это и зачем GCSC

**LightRAG** — система для умного поиска по документам, которая сочетает два подхода:
- **Векторный поиск** — находит похожие по смыслу фрагменты
- **Граф знаний (Knowledge Graph)** — понимает связи между сущностями

**Применение в GCSC:**
- AI агенты (CMA, RAA, CA, TA, REA) смогут искать по всей документации проекта
- Поиск по whitepaper, смарт-контрактам, юридическим документам
- Ответы на вопросы подрядчиков и домовладельцев с контекстом из базы знаний
- Анализ строительных проектов с учётом всех связей между сущностями

---

## Установка

```bash
# Минимальная установка
pip install lightrag-hku

# С API сервером
pip install "lightrag-hku[api]"

# Или через uv (рекомендуется)
uv tool install "lightrag-hku[api]"
```

---

## Быстрый старт

```python
import asyncio
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from lightrag.utils import EmbeddingFunc

# Инициализация
rag = LightRAG(
    working_dir="./gcsc-knowledge",
    llm_model_func=gpt_4o_mini_complete,
    embedding_func=EmbeddingFunc(
        embedding_dim=1536,
        max_token_size=8192,
        func=openai_embed,
    ),
)

# Индексация документов
with open("whitepaper.txt") as f:
    asyncio.run(rag.ainsert(f.read()))

# Запрос
result = asyncio.run(rag.aquery(
    "Как работает механика burn токенов GCSC?",
    param=QueryParam(mode="hybrid")  # hybrid = vector + knowledge graph
))
print(result)
```

---

## Режимы запросов

| Режим | Описание | Лучше для |
|-------|---------|-----------|
| `naive` | Простой векторный поиск | Быстрые ответы |
| `local` | Поиск по локальному контексту | Конкретные факты |
| `global` | Глобальные связи в графе | Общие концепции |
| `hybrid` | Комбинация всех подходов | **Рекомендуется для GCSC** |

```python
# Примеры запросов для GCSC

# Найти информацию о подрядчике
result = await rag.aquery(
    "Какие требования к лицензии подрядчика в Сиэтле?",
    param=QueryParam(mode="hybrid")
)

# Найти связи между смарт-контрактами
result = await rag.aquery(
    "Как gcscstake111 взаимодействует с Treasury?",
    param=QueryParam(mode="global")
)

# Проверить соответствие токеномики
result = await rag.aquery(
    "Каков процент burn при цене GCSC выше $1?",
    param=QueryParam(mode="local")
)
```

---

## Поддерживаемые LLM бэкенды

```python
# OpenAI (основной для GCSC)
from lightrag.llm.openai import gpt_4o_mini_complete

# Anthropic Claude
from lightrag.llm.anthropic import claude_complete

# Ollama (локальный, бесплатный)
from lightrag.llm.ollama import ollama_model_complete

# OpenAI-compatible (любой совместимый API)
from lightrag.llm.openai import openai_complete_if_cache
```

---

## Хранилища данных

### Векторное хранилище
```python
# По умолчанию (файловое, для разработки)
vector_storage="NanoVectorDBStorage"

# PostgreSQL + pgvector (для продакшена)
vector_storage="PGVectorStorage"

# ChromaDB (лёгкое, локальное)
vector_storage="ChromaVectorDBStorage"
```

### Граф знаний
```python
# По умолчанию (JSON файлы)
graph_storage="JsonKVStorage"

# PostgreSQL
graph_storage="PGKVStorage"

# Redis
graph_storage="RedisKVStorage"
```

---

## REST API сервер

```bash
# Запуск сервера
lightrag-server --host 0.0.0.0 --port 9621 --working-dir ./gcsc-knowledge

# Аутентификация через заголовок
curl -H "X-API-Key: your_key" http://localhost:9621/query \
  -d '{"query": "Что такое GCSC?", "mode": "hybrid"}'
```

### Основные эндпоинты
| Эндпоинт | Метод | Описание |
|---------|-------|---------|
| `/documents` | POST | Загрузить документ для индексации |
| `/query` | POST | Запрос к базе знаний |
| `/graph` | GET | Просмотр графа знаний |
| `/health` | GET | Статус сервера |

---

## Интеграция с AI агентами GCSC

```python
# Пример для Contractor Matching Agent (CMA)
class ContractorMatchingAgent:
    def __init__(self):
        self.rag = LightRAG(
            working_dir="./gcsc-knowledge",
            llm_model_func=gpt_4o_mini_complete,
        )

    async def find_contractor(self, job_description: str, location: str):
        # Ищем релевантных подрядчиков через базу знаний
        context = await self.rag.aquery(
            f"Подрядчики для работы: {job_description} в {location}",
            param=QueryParam(mode="hybrid")
        )
        return context

# Пример для Risk Assessment Agent (RAA)
class RiskAssessmentAgent:
    async def assess_credit_risk(self, contractor_id: str):
        # Запрашиваем историю и связи из графа знаний
        risk_context = await self.rag.aquery(
            f"Кредитная история и репутация подрядчика {contractor_id}",
            param=QueryParam(mode="global")
        )
        return risk_context
```

---

## Документы для индексации в GCSC

Рекомендуется проиндексировать:
1. `whitepaper.md` — весь whitepaper проекта
2. Смарт-контракты (`.ts` файлы) — логика всех контрактов
3. `docs/mppx-xpr-network.md` — документация платёжного модуля
4. `CLAUDE.md` / `AGENTS.md` — архитектура проекта
5. Строительное законодательство США по штатам
6. Документация XPR Network

```python
import os
import asyncio
from lightrag import LightRAG

rag = LightRAG(working_dir="./gcsc-knowledge", ...)

# Индексация всех документов
docs_to_index = [
    "docs/mppx-xpr-network.md",
    "AGENTS.md",
    "gcsctoken111/gcsctoken111.contract.ts",
    "gcsctoken111/gcscstake111.contract.ts",
    # ... остальные контракты
]

async def index_all():
    for doc_path in docs_to_index:
        if os.path.exists(doc_path):
            with open(doc_path, "r") as f:
                await rag.ainsert(f.read())
            print(f"✅ Проиндексирован: {doc_path}")

asyncio.run(index_all())
```

---

## Переменные окружения (.env)

Добавь в файл `.env` проекта:

```
# LightRAG
LIGHTRAG_WORKING_DIR=./gcsc-knowledge
LIGHTRAG_API_KEY=your_secret_key
LIGHTRAG_HOST=0.0.0.0
LIGHTRAG_PORT=9621

# LLM для LightRAG
OPENAI_API_KEY=your_openai_key
```

---

## Ссылки

- [GitHub репозиторий](https://github.com/HKUDS/LightRAG)
- [PyPI пакет](https://pypi.org/project/lightrag-hku/)
- [Статья EMNLP 2025](https://arxiv.org/abs/2410.05779)
- [Swagger UI](http://localhost:9621/docs) — после запуска сервера
