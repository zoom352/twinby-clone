# Twinby Clone

Сайт знакомств по совместимости в духе [Twinby](https://twinby.com): свайпы анкет, «нейросетевой» процент совместимости, мэтчи и чат.

**Стек:** React 19 · TypeScript · Vite · Redux Toolkit · React Router · CSS Modules
**Архитектура:** [Feature-Sliced Design](https://feature-sliced.design/)

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # проверка типов + production-сборка
npm run lint
```

## Возможности

- Онбординг: анкета (имя, возраст, пол, кого ищу, интересы, о себе)
- Лента анкет: свайп мышью/пальцем, кнопками или стрелками ← → ↑ (суперлайк)
- Листание фото тапом по левой/правой половине карточки, раскрытие анкеты по «i»
- Процент совместимости по интересам, общие интересы подсвечены
- Мэтч, если симпатия взаимная → модалка «Это мэтч!»
- Список мэтчей и диалогов, чат с подсказками для первого сообщения и эмуляцией ответа («печатает…»)
- Редактирование профиля, удаление мэтча, выход
- Состояние сохраняется в `localStorage`

Бэкенда нет: данные анкет — моки в `entities/profile/api`, сетевые задержки эмулирует `shared/api/mockRequest`.

## Структура (FSD)

```
src/
├── app/                  # инициализация: store, роутер, провайдеры, глобальные стили
│   ├── providers/        #   StoreProvider, AppRouter, AuthGuard/GuestGuard
│   ├── store/            #   configureStore + persist в localStorage
│   └── types/global.d.ts #   глобальные RootState / AppDispatch
├── pages/                # onboarding, feed, matches, chat, profile, not-found
├── widgets/              # самостоятельные блоки страниц
│   ├── layout/           #   шапка + нижняя навигация
│   ├── swipe-deck/       #   колода карточек + кнопки действий
│   ├── match-modal/      #   «Это мэтч!»
│   ├── matches-list/     #   новые мэтчи и диалоги
│   └── chat-window/      #   окно переписки
├── features/             # пользовательские сценарии
│   ├── auth/             #   создание анкеты (логин)
│   ├── swipe-profile/    #   свайп: SwipeableCard, SwipeActions, thunk swipeProfile
│   ├── send-message/     #   отправка сообщения, подсказки, автоответ
│   ├── edit-profile/
│   ├── unmatch/
│   └── logout/
├── entities/             # бизнес-сущности (slice + ui + api)
│   ├── user/             #   сессия текущего пользователя
│   ├── profile/          #   анкеты-кандидаты, совместимость, ProfileCard
│   ├── match/            #   мэтчи
│   └── message/          #   сообщения чата
└── shared/               # переиспользуемое без бизнес-логики
    ├── api/  config/  lib/  ui/
    └── lib/store/        #   useAppDispatch, useAppSelector, createAppAsyncThunk
```

### Правила

- Слой импортирует только из слоёв **ниже**: `app → pages → widgets → features → entities → shared`.
- Слайсы одного слоя не импортируют друг друга. Исключение — явный cross-import через `@x`:
  `entities/match` берёт тип `Profile` из `entities/profile/@x/match`.
- Импорт снаружи — только через публичный API слайса (`index.ts`).
- Redux-слайсы живут в `entities/*/model`; сценарии, затрагивающие несколько сущностей
  (свайп → мэтч, выход → сброс всего), — thunk'и и компоненты в `features`.
- `RootState`/`AppDispatch` объявлены глобально в `app/types`, поэтому `shared/lib/store`
  типизирует хуки, ничего не импортируя из `app`.
