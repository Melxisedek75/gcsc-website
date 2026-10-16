"""
LightRAG — запрос к базе знаний GCSC
Запуск: python3 .claude/skills/lightrag/scripts/query.py "вопрос" hybrid
"""

import asyncio
import sys
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "Что такое GCSC?"
    mode = sys.argv[2] if len(sys.argv) > 2 else "hybrid"

    try:
        from lightrag import LightRAG, QueryParam
        from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
        from lightrag.utils import EmbeddingFunc
    except ImportError:
        print("❌ LightRAG не установлен.")
        return

    working_dir = "./gcsc-knowledge"
    if not os.path.exists(working_dir):
        print("❌ База знаний не найдена. Сначала запусти index_docs.py")
        return

    rag = LightRAG(
        working_dir=working_dir,
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=1536,
            max_token_size=8192,
            func=openai_embed,
        ),
    )

    print(f"🔍 Запрос: {query}")
    print(f"📊 Режим: {mode}\n")

    result = await rag.aquery(query, param=QueryParam(mode=mode))
    print("💡 Ответ:")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
