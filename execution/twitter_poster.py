"""
GCSC Twitter Auto-Poster
========================
Автоматически публикует посты о проекте GCSC в Twitter/X.
Запуск: python3 execution/twitter_poster.py

Работает на стандартных библиотеках Python + requests.
НЕ требует tweepy.

Ключи хранятся в .env файле проекта.
"""

import os
import sys
import random
import time
import hmac
import hashlib
import base64
import urllib.parse
import json
from datetime import datetime, timezone

# ── Загрузка .env вручную (без python-dotenv) ────────────────────────────────

def load_env(path=".env"):
    """Читает .env файл и загружает переменные."""
    env_path = path
    if not os.path.exists(env_path):
        # Попробуем найти .env рядом со скриптом
        script_dir = os.path.dirname(os.path.abspath(__file__))
        env_path = os.path.join(script_dir, "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, value = line.partition("=")
                    os.environ.setdefault(key.strip(), value.strip())

load_env()

API_KEY             = os.getenv("TWITTER_API_KEY", "")
API_SECRET          = os.getenv("TWITTER_API_SECRET", "")
ACCESS_TOKEN        = os.getenv("TWITTER_ACCESS_TOKEN", "")
ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET", "")

# ── Контент для постов ────────────────────────────────────────────────────────

POSTS = [
    """🏗️ GCSC — это не просто токен.

Это первый DAO-протокол для строительной индустрии на $13T.
Реальные контракторы. Реальные дома. Реальная экономика.

XPR Network + AI агенты + смарт-контракты = новое строительство.

$GCSC #XPRNetwork #DeFi #Construction #Web3""",

    """🔥 Как работает burn механика $GCSC:

• Цена < $0.50 → сжигается 50% комиссий
• Цена $0.50–$1.00 → сжигается 30%
• Цена > $1.00 → 10% burn + 50% стейкерам

Дефляционная модель встроена в смарт-контракт.
Математика работает за вас.

$GCSC #Tokenomics #DeFi #XPRNetwork""",

    """💼 Как GCSC зарабатывает СЕЙЧАС:

Подрядчик платит $50 за лид в $GCSC токенах.
→ 50% сжигается (дефляция)
→ 50% в Treasury DAO

Первый лид гарантирован на 100%.
AI Agent (CMA) подбирает заявки автоматически.

$GCSC #Construction #AIAgent #XPRNetwork""",

    """💰 Стейкинг $GCSC = 12% APY

• Минимальный период: 30 дней
• Автоматическое начисление в смарт-контракте gcscstake111
• Выплаты из: подписок + займов + страховых премий

Пассивный доход от реальной строительной экономики.

$GCSC #Staking #DeFi #PassiveIncome #XPRNetwork""",

    """🤖 5 AI агентов уже в разработке для GCSC:

1️⃣ CMA — подбор подрядчиков по заявкам
2️⃣ RAA — кредитный скоринг на блокчейне
3️⃣ CA — проверка лицензий подрядчиков
4️⃣ TA — управление DAO Treasury
5️⃣ REA — оценка недвижимости + скрининг арендаторов

Люди решают "что". AI делает "как".

$GCSC #AIAgents #LangChain #Web3 #Construction""",

    """🏠 Real Estate DAO в GCSC — это:

Строим Tiny Homes → рабочие живут бесплатно →
через 10 лет выкупают по цене 40–60% от рынка.

20% всего Treasury заблокировано в RE DAO.
Токен $GCSC обеспечен реальными активами.

$GCSC #RealEstate #DAO #Construction #XPRNetwork""",

    """📱 Приложение SMART-CONTRACTOR уже в дизайне:

BASIC $49/mo — 3 лида/мес
PRO $99/mo — 10 лидов + Analytics
ENTERPRISE $199/mo — Unlimited + API

iOS + Android + WebAuth кошелёк + NFC оплата.

Домовладелец находит проверенного подрядчика за 2 минуты.

$GCSC #SmartContractor #HomeOwners #Web3App""",

    """⚡ Займы для подрядчиков без банков:

• 0.5–2% APR (vs 8–15% в банке)
• Одобрение через AI агента RAA за минуты
• Лимит: до $50,000 для Tier 1
• Обеспечение: Equipment NFT + репутация

Proton Loan + GCSC протокол = финансирование для тех, кому банки отказывают.

$GCSC #DeFi #Loans #Construction #XPRNetwork""",

    """👷 Worker 401K в GCSC — первый в истории:

• 2–5 $GCSC в день за работу
• Сверхурочные ×1.5
• Loyalty бонус за стаж
• Всё автоматически стейкится

Строительный рабочий получает пенсионный план прямо в смарт-контракте.

$GCSC #Workers #401K #Construction #DeFi""",

    """🚀 Прогресс GCSC на сегодня:

✅ gcsctoken111 — задеплоен на Proton Testnet
✅ 10 модулей смарт-контрактов — написаны
✅ LightRAG база знаний — интегрирована
✅ 5 AI агентов — в разработке
✅ mppx-xpr-network — интегрирован

Строим публично. Следи за каждым шагом 👀

$GCSC #BuildInPublic #XPRNetwork #DeFi""",

    """🔗 Почему XPR Network для GCSC?

✅ Нулевые комиссии за транзакции
✅ Sub-500ms финальность
✅ WebAuth кошелёк (биометрия + NFC)
✅ Proton Loan — встроенное кредитование
✅ SimpleDEX — ликвидность

Идеальная инфраструктура для реального бизнеса.

$GCSC #XPRNetwork #Proton #ZeroFee #Web3""",

    """💎 Почему два токена в GCSC?

$GCSC = governance + инвестиции (max 1B supply)
$GCST = стейблкоин для платежей (привязан к $1)

$GCST обеспечен:
• 50% USDC/USDT
• 30% стейкнутый $GCSC
• 20% реальные активы

Стабильность для бизнеса. Рост для инвесторов.

$GCSC $GCST #DualToken #DeFi #Construction""",
]

# ── OAuth 1.0a подпись (без внешних библиотек) ───────────────────────────────

def oauth_signature(method, url, params, consumer_secret, token_secret):
    """Создаёт HMAC-SHA1 подпись для OAuth 1.0a."""
    sorted_params = "&".join(
        f"{urllib.parse.quote(k, safe='')}"
        f"={urllib.parse.quote(str(v), safe='')}"
        for k, v in sorted(params.items())
    )
    base_string = "&".join([
        urllib.parse.quote(method.upper(), safe=""),
        urllib.parse.quote(url, safe=""),
        urllib.parse.quote(sorted_params, safe=""),
    ])
    signing_key = f"{urllib.parse.quote(consumer_secret, safe='')}&{urllib.parse.quote(token_secret, safe='')}"
    hashed = hmac.new(
        signing_key.encode("utf-8"),
        base_string.encode("utf-8"),
        hashlib.sha1,
    )
    return base64.b64encode(hashed.digest()).decode("utf-8")


def build_auth_header(method, url, extra_params=None):
    """Создаёт Authorization header для Twitter API."""
    nonce = base64.b64encode(os.urandom(32)).decode("utf-8").rstrip("=")
    timestamp = str(int(time.time()))

    oauth_params = {
        "oauth_consumer_key": API_KEY,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": timestamp,
        "oauth_token": ACCESS_TOKEN,
        "oauth_version": "1.0",
    }

    all_params = {**oauth_params}
    if extra_params:
        all_params.update(extra_params)

    signature = oauth_signature(method, url, all_params, API_SECRET, ACCESS_TOKEN_SECRET)
    oauth_params["oauth_signature"] = signature

    header_parts = ", ".join(
        f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"'
        for k, v in sorted(oauth_params.items())
    )
    return f"OAuth {header_parts}"


# ── Публикация твита ─────────────────────────────────────────────────────────

def post_tweet():
    """Публикует случайный пост о GCSC через Twitter API v2."""
    try:
        import requests
    except ImportError:
        print("❌ Модуль 'requests' не найден.")
        print("   Установи: pip install requests --break-system-packages")
        return False

    # Проверяем ключи
    if not all([API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET]):
        print("❌ Ошибка: Twitter API ключи не найдены в .env")
        return False

    # Выбираем пост (разный утром и вечером)
    hour = datetime.now(timezone.utc).hour
    seed = datetime.now(timezone.utc).strftime("%Y%m%d") + ("AM" if hour < 12 else "PM")
    random.seed(seed)
    post_text = random.choice(POSTS)

    print(f"📤 Публикация поста...")
    print("─" * 50)
    print(post_text)
    print("─" * 50)

    url = "https://api.twitter.com/2/tweets"
    payload = {"text": post_text}
    auth_header = build_auth_header("POST", url)

    response = requests.post(
        url,
        headers={
            "Authorization": auth_header,
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=30,
    )

    if response.status_code in (200, 201):
        data = response.json()
        tweet_id = data.get("data", {}).get("id", "")
        print(f"✅ Пост опубликован!")
        print(f"🔗 https://twitter.com/i/web/status/{tweet_id}")
        print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        return True
    else:
        print(f"❌ Ошибка Twitter API: {response.status_code}")
        print(f"   {response.text}")
        if response.status_code == 403:
            print()
            print("   👆 Как исправить:")
            print("   1. Зайди на developer.twitter.com")
            print("   2. Выбери свой App → Settings")
            print("   3. App permissions → Read and Write")
            print("   4. Пересгенерируй Access Token + Secret")
            print("   5. Обнови TWITTER_ACCESS_TOKEN и TWITTER_ACCESS_TOKEN_SECRET в .env")
        return False


# ── Запуск ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("🏗️  GCSC Twitter Auto-Poster")
    print(f"⏰  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    success = post_tweet()
    sys.exit(0 if success else 1)
