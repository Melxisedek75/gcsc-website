# 📦 GCSC Project Hub - Централизованное хранилище

**Дата создания:** 14.04.2026  
**Проект:** GCSC — Global Construction Smart Contract  
**Сеть:** XPR Network (Proton Blockchain)

---

## 📂 Структура папки

```
GCSC_Project_Hub/
├── README.md                          ← Этот файл
├── documentation/                     ← Основная документация проекта
│   ├── GCSC-PROJECT-KNOWLEDGE.md     ← Полная база знаний (11K)
│   ├── GCSC-CUSTOM-INSTRUCTIONS.txt  ← Инструкции для AI
│   ├── whitepaper.html               ← HTML версия whitepaper
│   └── whitepaper-v1.1.pdf           ← PDF версия whitepaper
│
├── node-info/                        ← Информация о Block Producer
│   └── BLOCK_PRODUCER_INFO.md        ← Полная информация о ноде gcscnetwork1
│
├── website/                          ← Файлы сайта
│   ├── node.html                     ← ✨ НОВАЯ страница голосования за BP
│   └── index.html                    ← Главная страница (с обновленной навигацией)
│
└── code/                             ← Код (будет заполнено)
    └── (смарт-контракты, AI-агенты, утилиты)
```

---

## 🚀 Что нового?

### ✅ Создано: node.html - Страница голосования за Block Producer

**Файл:** `website/node.html`

Полнофункциональная одностраничная веб-приложение с:

1. **Hero секция** 
   - Заголовок: "Vote for GCSC Block Producer"
   - Подзаголовок и кнопка "Vote on WebAuth"
   - 4 основных статистики (Uptime, Location, Consensus, Status)

2. **Why Vote Section**
   - 6 карточек с причинами голосовать за GCSC
   - Real Ecosystem, 100% Reinvestment, Decentralization, Zero Cost, AI-Powered, Growing Impact

3. **How to Vote - 4 Steps**
   - Пошаговая инструкция голосования
   - Интерактивные карточки с описанием каждого шага

4. **Node Statistics**
   - 8 информационных блоков
   - BP Account, Network, Status, Uptime, Location, Infrastructure, Sync Type, Rewards Usage

5. **DPoS Explanation**
   - Понятное объяснение механизма голосования на XPR Network

6. **Full Responsive Design**
   - Mobile-first подход
   - Dark theme (#0D1B2A) + Gold accents (#F4A300)
   - Плавные анимации при скролле
   - Работает на всех устройствах

### ✅ Обновлено: index.html - Навигация

Добавлена ссылка **"Node"** в навигацию сайта:
- Главная навигация
- Мобильная навигация
- Ссылает на `node.html`

---

## 📋 Информация о GCSC Block Producer

**BP Аккаунт:** `gcscnetwork1`  
**Сеть:** XPR Network  
**Статус:** Active Block Producer  
**Uptime:** 99.9%  
**Локация:** Helsinki, Finland (Hetzner)  

### Система вознаграждения (DPoS)

- Топ-21 BP получают награды из 1% годовой инфляции XPR Network
- 1 застейканный XPR = 1 голос
- GCSC реинвестирует 100% доходов в развитие платформы

---

## 🔗 Быстрые ссылки

| Ресурс | Ссылка |
|--------|--------|
| **Главный сайт** | https://melxisedek75.github.io/gcsc-website |
| **Twitter** | https://twitter.com/GCSC_Network |
| **WebAuth Wallet** | https://webauth.com |
| **XPR Network** | https://xprnetwork.org |
| **DEX** | https://dex.protonnz.com |
| **GitHub** | https://github.com/Melxisedek75/gcsc-website |

---

## 📊 Технические детали

### Frontend (node.html)
```
- HTML5 + CSS3 + JavaScript (Vanilla)
- Single Page Application (SPA)
- Полностью встроенные CSS и JS
- Адаптивный дизайн (mobile-first)
- Dark theme: #0D1B2A
- Gold accents: #F4A300
- Animations: scroll-reveal, fade-in
```

### Интеграция с сайтом
```
- Добавлена ссылка в главную навигацию
- Доступна из меню на всех страницах
- Мобильная версия поддержана
```

---

## 📁 Файлы в этой папке

### documentation/
- **GCSC-PROJECT-KNOWLEDGE.md** — Полная документация проекта с описанием:
  - О проекте (задача, целевая аудитория, проблема)
  - Токен-система (GCSC + GCST)
  - 10 смарт-контрактов
  - 5 AI-агентов
  - Два сегмента (DCC + Homeowner)
  - Дорожная карта
  - Технический стек
  - Machine Payments Protocol

- **GCSC-CUSTOM-INSTRUCTIONS.txt** — Инструкции для AI-помощников

- **whitepaper.html + whitepaper-v1.1.pdf** — Whitepaper проекта

### node-info/
- **BLOCK_PRODUCER_INFO.md** — Развернутая информация о:
  - BP аккаунте gcscnetwork1
  - Статистике ноды
  - Системе DPoS на XPR Network
  - Дорожной карте GCSC

### website/
- **node.html** ✨ Новая страница голосования за BP
- **index.html** — Обновленная главная страница с ссылкой на Node

---

## 🎯 Как использовать эту папку

1. **Быстрый доступ к информации**
   - Все документы о проекте в одном месте
   - Структурировано по типам информации

2. **Для AI-помощников (Claude, Gemini и т.д.)**
   - Читайте `documentation/GCSC-PROJECT-KNOWLEDGE.md` перед началом работы
   - Следуйте `GCSC-CUSTOM-INSTRUCTIONS.txt`

3. **Для разработчиков**
   - Код будет добавлен в папку `code/`
   - Все смарт-контракты, AI-агенты, утилиты
   - Версионирование по компонентам

4. **Для маркетинга**
   - Используйте информацию из `node-info/` для PR
   - node.html можно кастомизировать под разные компании/партнеры

---

## 🛠️ Следующие шаги

### Планируется добавить:
- [ ] Список всех смарт-контрактов с кодом
- [ ] Python AI-агенты (CMA, RAA, CA, TA, REA)
- [ ] Тесты контрактов
- [ ] Deployment инструкции
- [ ] API документация
- [ ] Мобильное приложение (SMART-CONTRACTOR)
- [ ] Real Estate DAO контракты

### Для Node:
- [ ] Мониторинг uptime
- [ ] Статистика блоков
- [ ]历史 голосов
- [ ] Интеграция с Hyperion для real-time данных

---

## 👤 Контакты

**Email:** gcscdao@gmail.com  
**Twitter:** @GCSC_Network  
**GitHub:** Melxisedek75

---

## 📜 Лицензия

GCSC Project © 2026. All rights reserved.

---

**Last Updated:** 14.04.2026 | Created by Claude Haiku 4.5

---

## 🎉 Статус проекта

| Компонент | Статус | Дата |
|-----------|--------|------|
| **node.html** | ✅ Готово | 14.04.2026 |
| **Навигация на сайте** | ✅ Обновлена | 14.04.2026 |
| **Документация** | ✅ Собрана | 14.04.2026 |
| **GCSC_Project_Hub** | ✅ Создан | 14.04.2026 |

---

**🚀 GCSC на XPR Network — Decentralizing Construction Finance**
