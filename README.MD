# CDWorld

Статический сайт магазина CD-дисков. Проект полностью переведён с **Bootstrap 5.2.2 + собственных CSS-файлов** на **Tailwind CSS v4** (utility-first, сборка через официальный CLI).

---

## Быстрый старт

```bash
# 1. Установить зависимости (нужен Node.js 18+)
npm install

# 2. Собрать CSS
npm run build

# 3. Открыть mainpage.html в браузере
```

Для разработки — режим наблюдения, CSS пересобирается при каждом изменении HTML/JS:

```bash
npm run dev
```

> `css/tailwind.css` — **сгенерированный** файл. Не редактируйте его вручную: все изменения делаются в `src/input.css` и в классах HTML, после чего выполняется `npm run build`.

---

## Структура проекта

```
CDWorld/
├── css/
│   └── tailwind.css      # собранный и минифицированный Tailwind (генерируется)
├── src/
│   └── input.css         # точка входа Tailwind: шрифт, токены, базовые стили
├── js/
│   └── js.js             # переключение play/pause на странице товара
├── fonts/                # локальный вариативный шрифт Unbounded
├── img/                  # обложки, логотип, иконки соцсетей
├── mainpage.html         # главная страница
├── productpage.html      # страница товара / оформление заказа
├── package.json          # скрипты сборки и devDependencies
└── README.MD
```

### Что изменилось по сравнению с исходной версией

| Было | Стало |
|---|---|
| `css/bootstrap.css` (~249 КБ) | удалён |
| `css/style.css` | удалён, стили перенесены в утилиты Tailwind |
| `css/productpage.css` | удалён, стили перенесены в утилиты Tailwind |
| `css/tailwind.css` | добавлен, ~17 КБ после минификации |
| `src/input.css` | добавлен — единственный источник кастомных стилей и токенов |
| `package.json` / `package-lock.json` | добавлены для сборки Tailwind |
| `.gitignore` | добавлен (`node_modules`, служебные файлы ОС) |

Итоговый CSS уменьшился примерно **с 249 КБ до 17 КБ** — Bootstrap больше не подключается, в сборку попадают только реально используемые классы.

---

## Как выполнялся перевод на Tailwind

### 1. Аудит исходного проекта

Сначала я выписал все места, где использовался Bootstrap и собственный CSS:

- сетка Bootstrap: `.container`, `.row`, `.col-*`, `.d-flex`, `.justify-content-*`, `.align-items-*`, `.gap-*`;
- утилиты отступов: `.pt-2`, `.pt-5`, `.my-2`, `.mx-5`, `.py-4`, `.me-2`, `.w-100`;
- кастомные компоненты: `.product_card`, `.card_button`, `.advantage_card`, `.advantage_card_label`, `.logo_link`, `.nav_link`, `.social_icon`, `.order_form`, `.cover`, `.play_button`;
- состояния: `:hover` (масштаб, цвет кнопок), `:hover` обложки (размытие + появление кнопки play);
- адаптивность: `col-sm-4`, `col-md-3`, `col-lg-2` и т. п.

### 2. Подключение Tailwind CSS v4

Bootstrap и два самописных CSS-файла были удалены. Вместо них добавлен Tailwind v4, который собирается официальным CLI — без CDN, поэтому сайт работает офлайн и не зависит от внешней сети.

`package.json`:

```json
{
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./css/tailwind.css --watch",
    "build": "tailwindcss -i ./src/input.css -o ./css/tailwind.css --minify"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.3.4",
    "tailwindcss": "^4.3.4"
  }
}
```

В Tailwind v4 больше не нужен `tailwind.config.js`: конфигурация живёт прямо в CSS.

### 3. Точка входа `src/input.css`

```css
@import "tailwindcss";

/* Явно ограничиваем файлы, которые Tailwind сканирует на классы */
@source "../*.html";
@source "../js/*.js";

/* Локальный вариативный шрифт вместо внешнего */
@font-face {
  font-family: "Unbounded";
  src: url("../fonts/Unbounded-VariableFont_wght.ttf") format("truetype");
  font-weight: 100 900;
  font-display: swap;
}

/* Дизайн-токены проекта в терминах Tailwind */
@theme {
  --font-sans: "Unbounded", ui-sans-serif, system-ui, sans-serif;

  --color-brand-start: #ff8566;
  --color-brand-end: #feb47b;

  --shadow-card: 10px 10px 5px rgb(200 200 200);
  --radius-card: 20px;
}

@layer base {
  body {
    @apply bg-white font-sans text-black antialiased;
  }
}
```

Что это даёт:

- `font-sans` теперь использует локальный Unbounded;
- `from-brand-start`, `to-brand-end` — фирменный градиент шапки и формы;
- `shadow-card` — тень карточек товара;
- `rounded-card` — радиус 20px у карточек, обложки и формы.

### 4. Замена сетки Bootstrap на CSS Grid

Bootstrap-сетка заменена на `grid` с теми же точками перелома:

| Bootstrap | Tailwind | Колонок |
|---|---|---|
| `col-12` | `grid-cols-1` | 1 |
| `col-sm-4` | `sm:grid-cols-3` | 3 |
| `col-md-3` | `md:grid-cols-4` | 4 |
| `col-lg-2` | `lg:grid-cols-6` | 6 |
| `col-md-6` | `md:grid-cols-2` | 2 |
| `col-lg-3` | `lg:grid-cols-4` | 4 |

Пример каталога:

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
```

Пример блока преимуществ:

```html
<div class="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-4">
```

Контейнер Bootstrap заменён на:

```html
<div class="container mx-auto px-4">
```

### 5. Замена флекс-утилит

Bootstrap и Tailwind используют одинаковые имена для большинства флекс-утилит, поэтому здесь миграция почти механическая:

- `d-flex` → `flex`;
- `flex-column` → `flex-col`;
- `justify-content-between` → `justify-between`;
- `align-items-center` → `items-center`.

### 6. Пересчёт отступов

Важно: шкалы отступов у Bootstrap и Tailwind **не совпадают**. У Bootstrap `5` = `3rem`, у Tailwind `5` = `1.25rem`. Поэтому отступы пересчитывались вручную:

| Bootstrap | Значение | Tailwind |
|---|---|---|
| `pt-2` / `my-2` / `me-2` | `0.5rem` | `pt-2` / `my-2` / `me-2` |
| `py-4` | `1.5rem` | `py-6` |
| `gap-4` | `1.5rem` | `gap-6` |
| `mx-5` | `3rem` | `mx-12` (в форме заменено на адаптивный padding) |
| `pt-5` | `3rem` | `pt-12` |
| `padding-top: 80px` | `80px` | `pt-20` |

### 7. Перенос кастомных классов в утилиты

Каждый самописный класс был разложен на Tailwind-утилиты прямо в HTML.

**Карточка товара** (`.product_card`):

```html
<a href="productpage.html"
   class="block rounded-2xl border border-black bg-white p-4 text-black no-underline
          shadow-card transition-transform duration-[250ms] hover:scale-105">
```

**Кнопка «В корзину»** (`.card_button`):

```html
<button type="button"
        class="mt-2 w-full whitespace-nowrap rounded-[5px] border border-black bg-black p-2
               text-white transition-colors hover:bg-white hover:text-black">
```

**Карточка преимущества** (`.advantage_card`):

```html
<div class="flex h-full flex-col items-center justify-center rounded-card
            border-[3px] border-black p-3 text-center">
```

**Ссылки навигации** (`.nav_link`, `.logo_link`):

```html
<a class="text-black no-underline transition-transform duration-100 hover:scale-110">
```

**Иконки соцсетей** (`.social_icon`): размер задаётся самим SVG через `size-8`, а анимация — на ссылке:

```html
<a class="mx-1 inline-block transition-transform duration-[250ms] hover:scale-110">
    <svg class="size-8">...</svg>
</a>
```

**Форма заказа** (`.order_form`):

```html
<form class="flex h-full flex-col justify-center rounded-card border border-white
             bg-linear-to-r from-brand-start to-brand-end p-6 sm:p-10">
```

**Кнопка отправки** (`#order_submit`):

```html
<input type="submit"
       class="mt-2 w-full cursor-pointer rounded-xl border border-black bg-black py-3
              text-white transition duration-200 hover:scale-105 hover:bg-white hover:text-black">
```

**Шапка** — фиксированная на главной и абсолютная на странице товара:

```html
<!-- mainpage.html -->
<header class="fixed inset-x-0 top-0 z-10 bg-linear-to-r from-brand-start to-brand-end py-3">

<!-- productpage.html -->
<header class="absolute inset-x-0 top-0 z-10 bg-linear-to-r from-brand-start to-brand-end py-3">
```

### 8. Состояния и интерактивность

- Наведение на карточку — `hover:scale-105` + `transition-transform`.
- Наведение на обложку альбома — группа `group` на контейнере, размытие `group-hover:blur-sm`, появление кнопки `group-hover:opacity-100`.
- Play/pause — класс `hidden` из Tailwind, которым управляет `js/js.js`; SVG pause по умолчанию имеет `hidden`.
- Якорные ссылки получили `scroll-mt-24 sm:scroll-mt-20`, чтобы заголовки не прятались под фиксированной шапкой.

### 9. Адаптивность

- Сетки каталога и преимуществ повторяют поведение Bootstrap на всех брейкпоинтах.
- Шапка на узких экранах складывается в две строки (`flex-col` → `sm:flex-row`), поэтому больше нет горизонтальной прокрутки.
- Форма заказа и обложка на мобильных становятся в одну колонку, отступы уменьшаются через `p-6 sm:p-10` и `pt-28 sm:py-24`.

### 10. Мелкие исправления, найденные по пути

- `js/js.js` использовал неявные глобальные переменные `play_circle` / `pause_circle`. Теперь работа идёт через явно полученные элементы `playCircleSvg` / `pauseCircleSvg`.
- Путь к скрипту `/js/js.js` заменён на относительный `js/js.js` — страница работает и при открытии через `file://`, и при размещении в подпапке.
- Исправлена опечатка в SVG логотипа: `fill="blackr"` → `fill="black"`.
- Ссылки соцсетей `www.vk.com` и `www.telegram.com` заменены на корректные `https://vk.com` и `https://telegram.org`.
- В форме убрано `text-align: justify` у подписи к чекбоксу — на узких экранах она растягивалась по словам.
- Изображениям добавлены осмысленные `alt`, иконкам-ссылкам — `aria-label`.

---

## Как поддерживать проект дальше

1. **Меняете разметку** — используйте утилиты Tailwind прямо в `class`.
2. **Нужен новый цвет, тень, радиус или шрифт** — добавьте токен в `@theme` в `src/input.css`, например:
   ```css
   @theme {
     --color-accent: #ff5a36;
     --shadow-soft: 0 8px 24px rgb(0 0 0 / 0.12);
   }
   ```
   После сборки появятся `bg-accent`, `text-accent`, `shadow-soft` и т. д.
3. **Нужен повторяющийся сложный компонент** — сначала попробуйте собрать его из утилит; если комбинация повторяется, оформите её через `@utility` в `src/input.css`.
4. **После любых изменений** запускайте `npm run build` (или держите `npm run dev`).

> В Tailwind v4 директива `@apply` используется только в базовом слое (`src/input.css`). В HTML применяются обычные классы — это упрощает чтение разметки и не создаёт скрытых зависимостей.

---

## Проверка результата

Миграция проверена в headless-браузере:

- главная и страница товара на ширинах **390, 768, 1024 и 1440 px**;
- отсутствие горизонтальной прокрутки на мобильных;
- сетка каталога: 1 / 3 / 4 / 6 колонок на соответствующих брейкпоинтах;
- hover-эффекты карточек, ссылок и обложки;
- появление кнопки play при наведении и переключение play → pause по клику;
- сборка `npm run build` завершается без ошибок и предупреждений.

---

## Осталось за рамками миграции

Это не относится к переводу на Tailwind, но стоит знать:

- форма заказа пока не отправляет данные (`action=""`), это только вёрстка;
- карточки товаров в каталоге статичны и продублированы вручную — при подключении бэкенда их лучше генерировать из данных;
- кнопка «В корзину» вложена в ссылку-карточку (унаследовано из исходной вёрстки) — при развитии проекта стоит разделить ссылку и кнопку.
