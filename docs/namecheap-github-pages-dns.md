# Namecheap DNS для GitHub Pages

Домен: `xprnet.org`

GitHub repository: `https://github.com/Melxisedek75/gcsc-website`

## GitHub Pages

В репозитории должен быть файл:

```text
CNAME
```

Содержимое:

```text
xprnet.org
```

После push в GitHub:

1. Открыть GitHub repository.
2. Перейти в `Settings` -> `Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main`.
5. Folder: `/root`.
6. Custom domain: `xprnet.org`.
7. Включить `Enforce HTTPS`, когда GitHub разрешит.

## Namecheap DNS

Namecheap:

1. Login в Namecheap.
2. Domain List.
3. Найти `xprnet.org`.
4. Нажать `Manage`.
5. Открыть вкладку `Advanced DNS`.
6. В `Host Records` добавить/проверить записи ниже.

### Root domain

```text
Type: A Record
Host: @
Value: 185.199.108.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.109.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.110.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.111.153
TTL: Automatic
```

### WWW

```text
Type: CNAME Record
Host: www
Value: Melxisedek75.github.io
TTL: Automatic
```

## Важно для почты

Не удалять MX/TXT/SPF/DKIM записи, связанные с Namecheap Private Email. Они нужны для `gcsc@xprnet.org`.

Для сайта нужны только A records для `@` и CNAME для `www`.

## Проверка

DNS может обновляться от нескольких минут до 24 часов.

После обновления:

```powershell
nslookup xprnet.org
nslookup www.xprnet.org
```

Ожидаемо:

- `xprnet.org` должен указывать на GitHub Pages IP `185.199.xxx.153`.
- `www.xprnet.org` должен указывать на `Melxisedek75.github.io`.
