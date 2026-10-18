---
name: fsd-guard
description: >
  Use this when adding or editing any import in src/, when creating a new slice,
  entity, feature, widget or page, or when the user asks to check architecture
  layering. Enforces Feature-Sliced Design rules for twinby-clone: import
  directions, public API barrels, cross-imports via @x, widget cycles.
type: project
---

# fsd-guard

Проверяет и чинит слои FSD в `twinby-clone`. Ловит 5 классов ошибок:

| Вид | Severity | Что значит |
|---|---|---|
| `upward` | error | импорт «вверх»: `entities → pages`, `shared → entities`, `pages → app` |
| `sideways` | error | импорт между слайсами одного слоя напрямую, без `@x` |
| `widget-cycle` | error | виджеты импортируют друг друга по кругу |
| `missing-x` | error | импорт через `@x`, но файла `@x/<слайс>.ts` нет |
| `deep` | warn | импорт глубже публичного API (`@/entities/profile/model/types`) |

## Запуск

```bash
npm run fsd          # только errors, exit 1 при нарушении
npm run fsd:strict   # errors + warns, exit 1 при любом
npm run verify       # fsd + lint + build, три зелёных прохода
node .agents/skills/fsd-guard/scripts/check-fsd.mjs --json   # машинный отчёт
```

## Порядок слоёв (снизу вверх)

```
shared < entities < features < widgets < pages < app
```

`@/app` импортирует только `src/main.tsx`.

## Разрешённые направления

| Импортёр | Можно импортировать |
|---|---|
| `shared/*` | `shared/*` |
| `entities/*` | `entities/*` (через `@x`), `shared/*` |
| `features/*` | `features/*` (через `@x`), `entities/*`, `shared/*` |
| `widgets/*` | `widgets/*`, `features/*`, `entities/*`, `shared/*` |
| `pages/*` | `widgets/*`, `features/*`, `entities/*`, `shared/*` |
| `app/*` | все слои ниже |

## Правила

1. **Публичный API.** Импорт слайса — `@/<слой>/<слайс>`, резолвится в его `index.ts`.
   Импорт глубже — `deep`-warning. Единственные документированные глубокие входы:
   - `@/shared/lib/store` — типизированные `useAppSelector`, `useAppDispatch`, `createAppAsyncThunk`
     (импортирует `app/types/global.d.ts`, поэтому в `shared/lib/index.ts` его не кладём — вышел бы `shared → app`);
   - `@/app/store/store` — стор для `StoreProvider`.
2. **`shared` — одна библиотека.** Сегменты `lib / ui / config / api` не изолированы друг от друга:
   `shared/ui/*` спокойно импортирует `@/shared/lib`. Внутри `shared/ui` компоненты реэкспортируются
   через `shared/ui/index.ts`, между собой напрямую не ходят.
3. **`@x` для межслайсовых импортов на одном слое.** Слайс `B` заводит `src/<слой>/B/@x/<A>.ts`
   и реэкспортирует оттуда типы/селекторы для `A`. Пример в проекте: `entities/profile/@x/match.ts`.
   В `index.ts` такие файлы не добавляем — `index.ts` широкий, `@x` узкий.
4. **Виджеты свободно импортируют друг друга** (декомпозиция страницы), но цикл `A ⇄ B` — ошибка.
   Общий кусок → ниже по слоям (`entities`/`features`) или отдельный виджет-примитив.
5. **Типы.** Импорт типа — тоже импорт. Между слайсами — `import type` (`verbatimModuleSyntax` включён).
   `import type` освобождает от `sideways`, но не от `upward`.
6. **Redux.** Слайсы живут в `entities/*/model`, thunk'и с побочными эффектами — в `features/*/model`.
   Импорт слайса — только через публичный API (`@/entities/match`), не через `model/matchesSlice`.
7. **Новый слайс** создаётся по шаблону: `model/` (types + slice), `ui/` (Component + `Component.module.css`),
   `lib/`, обязательный `index.ts` с паблик-API.

## Конфиг правил

В начале `scripts/check-fsd.mjs` — блок `RULES`. Там подкручивается под проект:
`sharedSegmentIsolation` (включить — и `shared/ui → shared/lib` станет нарушением),
`widgetCrossImport` (`allow` | `warn` | `error`), `statePaths`, `allowDeepIn`.

## Алгоритм работы

1. Прогон `npm run fsd:strict` до правок — зафиксируй базовую линию.
2. Для каждого нарушения: определи вид по таблице, предложи минимальную правку
   (публичный `index.ts`, `@x`-файл, перенос общего кода ниже по слоям).
3. Если правка меняет архитектуру (новый `@x`, перенос типа) — сначала опиши её автору, потом делай.
4. После правок: `npm run verify`.
5. В отчёте — `файл:строка`, вид нарушения, предложенное исправление. Список «нужно решение автора»
   отдельным блоком; молча архитектруру не перестраивать.
