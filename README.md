# Vue Lottery App

SPA на Vue 3 + TypeScript: лотерея та адмін-панель користувачів на базі [DummyJSON](https://dummyjson.com)
(лабораторна робота №5: маршрутизація, Repository pattern, JWT-авторизація).

## Стек

Vue 3 (Composition API), Vue Router, Pinia, VeeValidate + Yup, Bootstrap 5 (SCSS), Vite, ESLint.

## Структура

```
src/
  api/http-client.ts          єдиний HTTP-клієнт (Bearer-токен, авто-refresh при 401)
  services/
    interfaces.ts             Readable, Pageable, Creatable, Editable, Deletable
    user.service.ts           репозиторій користувачів
    auth.service.ts           login / refresh / me
    service-provider.ts       фабрика сервісів
  stores/                     Pinia: auth (токени + localStorage), users (локальний стан)
  router/index.ts             маршрути, meta (title, requiresAuth, layout), guards
  layouts/                    DefaultLayout, AuthLayout
  components/layout/          AppHeader, AppNavigation, AppLogo
  views/                      сторінки (lazy loading)
  validation/schemas.ts       Yup-схеми форм
```

## Маршрути

| Шлях              | Сторінка                          | Доступ       |
| ----------------- | --------------------------------- | ------------ |
| `/`               | Головна                           | усі          |
| `/about`          | Про автора                        | усі          |
| `/lottery`        | Лотерея                           | усі          |
| `/users`          | Список (`?page=2&q=john`)         | авторизовані |
| `/users/new`      | Створення користувача             | авторизовані |
| `/users/:id`      | Профіль користувача               | авторизовані |
| `/users/:id/edit` | Редагування (вкладений маршрут)   | авторизовані |
| `/login`          | Вхід (`AuthLayout`)               | гості        |
| `*`               | 404                               | усі          |

Тестовий акаунт: `emilys` / `emilyspass`.

## Запуск

```sh
cp .env.example .env
npm install
npm run dev
```

## Деплой на GitHub Pages

1. У `.env` вкажіть `VITE_BASE_URL=/<назва-репозиторію>/`.
2. `npm run deploy` — збирає проєкт, копіює `index.html` у `404.html` (щоб працювали прямі
   посилання на кшталт `/users/5`) і публікує `dist` у гілку `gh-pages`.
3. У налаштуваннях репозиторію: Settings → Pages → Branch: `gh-pages`.
