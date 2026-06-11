# 🏃 Cape Town Marathon 2027

**Africa's Major Marathon** — Next.js 15 + TypeScript + Tailwind CSS + Prisma + Neon PostgreSQL

## 📋 Что внутри

- **17 страниц** — полноценный сайт марафона
- **Анимации** — Framer Motion на каждой странице
- **База данных** — Neon PostgreSQL (бесплатно до 500MB)
- **Бронирование** — 5-шаговый визард с калькулятором
- **Блог** — с админ-панелью через Prisma
- **Аккаунт** — чеклист подготовки, документы, бронирования

---

## 🚀 БЫСТРЫЙ СТАРТ (для новичков)

### Шаг 1: Установи необходимые программы

1. **Node.js** — скачай с [nodejs.org](https://nodejs.org) (LTS версия)
2. **Git** — скачай с [git-scm.com](https://git-scm.com)
3. **VS Code** — скачай с [code.visualstudio.com](https://code.visualstudio.com) (рекомендуется)

### Шаг 2: Скачай проект

Открой терминал (в VS Code: `Ctrl + \``) и выполни:

```bash
cd Desktop
git clone <ссылка-на-твой-репозиторий>
cd cape-town-marathon
```

### Шаг 3: Установи зависимости

```bash
npm install
```

### Шаг 4: Настрой базу данных (Neon — бесплатно)

1. Зайди на [neon.tech](https://neon.tech)
2. Нажми **Sign Up** (регистрация через GitHub или email)
3. Создай новый проект → назови `cape-town-marathon`
4. Скопируй строку подключения (Connection String)
5. Создай файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
NEXTAUTH_SECRET="любой-случайный-текст-минимум-32-символа"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ **Важно**: замени строку `DATABASE_URL` на свою из Neon!

### Шаг 5: Инициализируй базу данных

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Шаг 6: Запусти локально

```bash
npm run dev
```

Открой в браузере: **http://localhost:3000**

---

## 🌐 ДЕПЛОЙ НА VERCEL (бесплатно)

### Шаг 1: Подготовь проект

Убедись, что всё работает локально, затем:

```bash
git add .
git commit -m "Ready for deploy"
```

### Шаг 2: Зарегистрируйся на Vercel

1. Зайди на [vercel.com](https://vercel.com)
2. Нажми **Sign Up** → выбери **Continue with GitHub**
3. Импортируй свой репозиторий

### Шаг 3: Настрой переменные окружения

В панели Vercel перейди в **Settings → Environment Variables** и добавь:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Твоя строка подключения из Neon |
| `NEXTAUTH_SECRET` | Тот же секретный ключ |

### Шаг 4: Деплой

Нажми **Deploy** — через 2-3 минуты сайт будет онлайн!

Vercel даст тебе бесплатный домен типа `cape-town-marathon.vercel.app`

---

## 📁 Структура проекта

```
cape-town-marathon/
├── app/                    # Страницы (Next.js App Router)
│   ├── (home)/             # Главная страница
│   ├── about-race/         # О марафоне
│   ├── prep-camp/          # Подготовительный лагерь
│   ├── race-week/          # Неделя гонки
│   ├── cape-town-guide/    # Гид по Кейптауну
│   ├── pricing/            # Цены
│   ├── booking/            # Бронирование
│   ├── account/            # Личный кабинет
│   ├── blog/               # Блог
│   ├── contact/            # Контакты
│   ├── terms/              # Условия
│   ├── privacy/            # Приватность
│   ├── refund/             # Возвраты
│   ├── cookies/            # Куки
│   └── layout.tsx          # Главный лейаут
├── components/             # Компоненты
│   ├── ui/                 # UI компоненты
│   └── effects/            # Эффекты (курсор)
├── lib/                    # Утилиты
│   ├── utils.ts            # Хелперы
│   └── prisma.ts           # Prisma клиент
├── prisma/
│   ├── schema.prisma       # Схема базы данных
│   └── seed.ts             # Тестовые данные
├── public/                 # Статические файлы
│   ├── images/             # Картинки
│   └── videos/             # Видео
├── package.json            # Зависимости
├── next.config.js          # Конфиг Next.js
├── tailwind.config.ts      # Конфиг Tailwind
└── tsconfig.json           # Конфиг TypeScript
```

---

## 🛠 Полезные команды

```bash
npm run dev          # Запуск локального сервера
npm run build        # Сборка для продакшена
npx prisma studio    # GUI для базы данных
npx prisma db push   # Обновить схему БД
npx prisma db seed   # Заполнить тестовыми данными
```

---

## 🎨 Цветовая схема

- **Teal** `#14b8a6` — основной акцентный цвет
- **Gold** `#f59e0b` — вторичный акцент
- **Dark** `#0a0a0a` — фон
- **White** `#ffffff` — текст

---

## 📞 Поддержка

Если что-то не работает:

1. Проверь, что Node.js установлен: `node -v` (должно быть v18+)
2. Удали папку `node_modules` и файл `package-lock.json`, затем снова `npm install`
3. Проверь файл `.env` — строка `DATABASE_URL` должна быть правильной

---

**Удачи с марафоном! 🏃‍♂️🏔️**
