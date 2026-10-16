# Email Automation

Локальная отправка писем настроена через Namecheap Private Email SMTP.

## Файлы

- `C:\gcsc\execution\setup-email-env.ps1` - добавляет SMTP-настройки в `C:\gcsc\.env`.
- `C:\gcsc\execution\send-email.ps1` - отправляет письмо через SMTP.
- `C:\gcsc\.env.email.example` - пример без реального пароля.

## Настройки Namecheap Private Email

```text
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=gcsc@xprnet.org
SMTP_FROM=gcsc@xprnet.org
MAIL_TO=gcsc@xprnet.org
```

В `C:\gcsc\.env` нужно вручную заменить:

```text
SMTP_PASS=REPLACE_WITH_NAMECHEAP_PRIVATE_EMAIL_PASSWORD
```

на пароль от mailbox `gcsc@xprnet.org`.

Пароль нельзя писать в чат и нельзя коммитить в GitHub. Файл `.env` уже находится в `.gitignore`.

## Тест отправки

После ввода пароля:

```powershell
powershell -ExecutionPolicy Bypass -File C:\gcsc\execution\send-email.ps1 -Subject "GCSC email test" -Body "Email automation is working."
```

Если письмо пришло на `gcsc@xprnet.org`, локальный email-hook работает.
