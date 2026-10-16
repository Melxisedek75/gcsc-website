---
name: Windows Terminal Helper
description: Каждый раз когда пользователь должен запустить что-то в терминале — всегда давай полную команду с cd в начале. Пользователь работает в Windows PowerShell.
allowed-tools: [Read, Write, Bash]
---

# Windows Terminal Helper

## Правило (ОБЯЗАТЕЛЬНО для каждого запроса)

Когда просишь пользователя запустить команду в терминале:

1. **ВСЕГДА** начинай с `cd C:\gcsc\<папка-проекта>`
2. **ВСЕГДА** указывай что открыть: **Windows PowerShell** (не CMD, не bash)
3. **ВСЕГДА** давай команды блоком — готово к копированию

## Шаблон ответа

```
Открой **Windows PowerShell** и вставь:

cd C:\gcsc\<папка>
<команда>
```

## Маппинг папок проекта

| Проект | Папка |
|--------|-------|
| XPRClaw PWA | `C:\gcsc\xprclaw` |
| GCSC BuilderAI | `C:\gcsc\construction-ai` |
| Smart Contracts | `C:\gcsc\gcsctoken111` |
| Build contracts | `C:\gcsc\gcscbuild11` |

## Learnings
- Пользователь работает в Windows, использует PowerShell
- Всегда нужен `cd` в начале — иначе команды запускаются не в той папке
- Блок с командами должен быть готов к копированию целиком
