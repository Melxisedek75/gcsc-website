# GCSC Agent Kit — Инструкция запуска

## Что это
Персональный AI-ассистент для проекта GCSC на базе sprut-agent-kit + Claude Opus 4.6.
Работает через Telegram и Web UI. Управляет 5 агентами: CMA, RAA, CA, TA, REA.

## Требования
- Windows 10/11 с Git Bash или WSL
- [Bun](https://bun.sh) — быстрый JS runtime
- [Claude CLI](https://claude.ai/download) — Anthropic CLI
- Telegram аккаунт (для бота)

## Установка (5 минут)

### Шаг 1 — Установи Bun
Открой PowerShell и выполни:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Шаг 2 — Скачай sprut-agent-kit
```bash
# В Git Bash:
cd ~/Desktop
git clone https://github.com/AlekseiUL/sprut-agent-kit.git sprut-base
```

### Шаг 3 — Скопируй GCSC конфиги
```bash
cp ~/Desktop/gcsc-agent-kit/SOUL.md ~/Desktop/sprut-base/SOUL.md
cp ~/Desktop/gcsc-agent-kit/AGENTS.md ~/Desktop/sprut-base/AGENTS.md
cp ~/Desktop/gcsc-agent-kit/settings.json ~/Desktop/sprut-base/settings.json
cp -r ~/Desktop/gcsc-agent-kit/skills/gcsc ~/Desktop/sprut-base/skills/
```

### Шаг 4 — Настрой API ключи
```bash
cd ~/Desktop/sprut-base
cp ~/Desktop/gcsc-agent-kit/.env.example .env
# Открой .env в Notepad и заполни ключи:
notepad .env
```

Минимально нужно заполнить:
- `ANTHROPIC_API_KEY` — получить на https://console.anthropic.com
- `TELEGRAM_BOT_TOKEN` — создать бота у @BotFather
- `TELEGRAM_ADMIN_ID` — узнать у @userinfobot

### Шаг 5 — Установи зависимости и запусти
```bash
cd ~/Desktop/sprut-base
bun install
bun run src/index.ts start --web
```

## После запуска

**Web UI:** http://localhost:4632
**Telegram:** открой своего бота и отправь /start

## Команды Telegram
```
/match кухня и ванная, Сиэтл, бюджет $50000
/value 123 Main St, Seattle WA 98101
/assess project_123
/escrow project_123
/status
/help
```

## Структура файлов
```
gcsc-agent-kit/
├── SOUL.md              ← Идентичность агента
├── AGENTS.md            ← Правила и архитектура
├── settings.json        ← Конфиг (модели, агенты, XPR)
├── .env.example         ← Шаблон API ключей
├── GCSC_README.md       ← Эта инструкция
└── skills/
    └── gcsc/
        ├── skill-cma.md ← Матчинг подрядчиков
        ├── skill-rea.md ← Оценка недвижимости
        └── skill-ta.md  ← Escrow и казначейство
```

## Поддержка
- GitHub GCSC: https://github.com/Melxisedek75/gcsc-website
- Сайт: https://melxisedek75.github.io/gcsc-website
- Twitter: @GCSC_Network
