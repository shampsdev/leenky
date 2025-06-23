# Leenky

**Leenky** — это способ навести порядок в общении: теперь у каждого участника есть карточка, по которой его легко понять и найти. Проект объединяет комьюнити, предоставляя удобный способ создания сети полезных контактов в чатах.

## 🔗 Ссылки

- **Приложение**: [t.me/leenky_bot/app](https://t.me/leenky_bot/app)
- **Новостной канал**: [t.me/leenky_news](https://t.me/leenky_news)

## 🚀 Технические особенности

### Архитектура
Проект состоит из двух основных частей:

- **Серверная часть** (`/server`) - Go, REST API для бэкенда, Telegram Bot, PostgreSQL 16
- **Клиентская часть** (`/client`) - React мини-приложение с Vite

Используется **Docker** для контейнеризации, развернуто на **Docker Swarm**.

### Установка и запуск

#### Серверная часть
```bash
cd server

# Запуск через Docker Compose
docker-compose up -d

# Или локальная разработка
go mod download
make run-server  # Запуск API сервера
make run-bot     # Запуск Telegram бота
```

#### Клиентская часть
```bash
cd client

npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

Для того, чтобы подключить мини-апп в telegram, необходим https. Это может быть неудобно при локальной разработки, поэтому мы используем утилиту:
[bore](https://github.com/ekzhang/bore)

### Структура проекта

```
leenky/
├── server/                 # Серверная часть (Go)
│   ├── cmd/               # Точки входа приложений
│   │   ├── server/        # REST API сервер
│   │   ├── tgbot/         # Telegram бот
│   │   └── ...
│   ├── pkg/               # Бизнес-логика
│   │   ├── domain/        # Доменные модели
│   │   ├── repo/          # Репозитории
│   │   ├── usecase/       # Бизнес-логика
│   │   └── gateways/      # Внешние интеграции
│   ├── migrations/        # Миграции БД
│   └── docker-compose.yaml
├── client/                # Клиентская часть (React)
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   └── ...
│   ├── public/            # Статические файлы
│   └── package.json
└── README.md
```

### Основные технологии

#### Backend (Go)
- **Gin** - HTTP веб-фреймворк
- **go-telegram/bot** - Telegram Bot API
- **pgx/v5** - PostgreSQL драйвер
- **Squirrel** - SQL билдер
- **Bleve** - полнотекстовый поиск
- **Swagger** - документация API

#### Frontend (React)
- **React 19** - UI фреймворк
- **TypeScript** - типизация
- **@telegram-apps/sdk-react** - Telegram Mini Apps SDK
- **React Query** - управление состоянием сервера
- **React Hook Form** - работа с формами
- **React Router** - маршрутизация
- **Framer Motion** - анимации
- **TailwindCSS** - стилизация

### Развертывание

Приложение развернуто как Telegram Mini App и доступно через бота [@leenky_bot](https://t.me/leenky_bot).

---

**Автор**: [@shampsdev](https://t.me/shampsdev)
