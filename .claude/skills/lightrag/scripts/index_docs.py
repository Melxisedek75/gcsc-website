"""
LightRAG — индексация документов GCSC
Запуск: python3 .claude/skills/lightrag/scripts/index_docs.py
"""

import asyncio
import os
import glob
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        from lightrag import LightRAG, QueryParam
        from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
        from lightrag.utils import EmbeddingFunc
    except ImportError:
        print("❌ LightRAG не установлен. Запусти:")
        print("   pip install 'lightrag-hku[api]' --break-system-packages")
        return

    working_dir = "./gcsc-knowledge"
    os.makedirs(working_dir, exist_ok=True)

    print("🚀 Инициализация LightRAG...")
    rag = LightRAG(
        working_dir=working_dir,
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=1536,
            max_token_size=8192,
            func=openai_embed,
        ),
    )

    # Документы для индексации
    patterns = [
        "docs/*.md",
        "AGENTS.md",
        "GEMINI.md",
        "gcsctoken111/*.ts",
        "gcscbuild11/*.ts",
    ]

    indexed = 0
    for pattern in patterns:
        for filepath in glob.glob(pattern):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                if len(content.strip()) < 50:
                    continue
                await rag.ainsert(content)
                print(f"  ✅ {filepath}")
                indexed += 1
            except Exception as e:
                print(f"  ⚠️  {filepath} — {e}")

    print(f"\n✅ Проиндексировано файлов: {indexed}")
    print(f"📁 База знаний: {working_dir}")

if __name__ == "__main__":
    asyncio.run(main())
