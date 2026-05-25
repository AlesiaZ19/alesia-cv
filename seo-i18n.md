# SEO & i18n Audit — Alesia Zayats CV

## Архитектура мультиязычности

### Хранение текста
- `data.js` — единый объект `cvData` с двумя локалями: `cvData.en` и `cvData.ru`
- Весь контент (заголовки, описания, навыки, контакты) хранится ТОЛЬКО в JS
- HTML не содержит текста — только `id`-контейнеры с fallback-значениями

### Рендеринг
- `script.js` → `renderPage(lang)` → 12 специализированных `render*` функций
- Вызывается мгновенно при загрузке: `renderPage(currentLang)` в конце скрипта
- Скрипты загружаются с `defer` (не блокируют парсинг DOM)

## Что уже реализовано ✅

### URL-роутинг
- `?lang=ru` / без параметра = EN
- `detectLanguage()`: URL → localStorage → `navigator.language`
- `initUrl()`: синхронизирует URL с текущим языком через `history.replaceState`
- Защита от битых URL: `langParam.startsWith('ru')` вместо `=== 'ru'`

### Мета-теги (динамически в `renderMeta`)
- `<title>` — `d.pageTitle`
- `meta[name="description"]` — `d.about.text`
- `og:title`, `og:description`, `og:locale`, `og:url`
- `twitter:title`, `twitter:description`
- `link[rel="canonical"]` — обновляется под язык
- `html lang` — `document.documentElement.lang`

### Hreflang (статические в HTML)
```html
<link rel="alternate" hreflang="en" href="https://.../?lang=en">
<link rel="alternate" hreflang="ru" href="https://.../?lang=ru">
<link rel="alternate" hreflang="x-default" href="https://.../">
```
Не требуют динамического обновления — hreflang всегда указывает на все версии.

### JSON-LD (частично динамически)
- `url` ✅
- `description` ✅
- `alumniOf` ✅
- `worksFor` ✅

## Что нужно доделать ❌

### JSON-LD: `jobTitle` не синхронизируется
```js
// В renderMeta() нужно добавить:
data.jobTitle = d.heroTitle; // Разный для EN/RU
```

### JSON-LD: `knowsAbout` не синхронизируется
```js
// В renderMeta() нужно добавить:
data.knowsAbout = d.skills.items; // Разный для EN/RU
```

## План фикса

### 1. `renderMeta()` — добавить синхронизацию `jobTitle` и `knowsAbout`
```js
data.jobTitle = d.heroTitle;
data.knowsAbout = d.skills.items;
```

### 2. Проверить `sitemap.xml`
- `/?lang=ru` — URL корректен, параметр единственный
- Дата `lastmod` актуальна

### 3. Проверить `robots.txt`
- `Allow: /`
- Sitemap указан

## Схема данных

```
renderPage(lang)
 ├── renderMeta(d, lang)
 │    ├── document.title = d.pageTitle
 │    ├── og:title / twitter:title = d.pageTitle
 │    ├── description / og:description = d.about.text
 │    ├── og:locale = ru_RU | en_US
 │    ├── canonical = pageUrl
 │    └── JSON-LD:
 │         ├── url = pageUrl
 │         ├── description = d.about.text
 │         ├── jobTitle = d.heroTitle          ← NEW
 │         ├── knowsAbout = d.skills.items     ← NEW
 │         ├── alumniOf = d.education.items[].institution
 │         └── worksFor = d.experience.items[0].company
 ├── renderHero(d)
 ├── renderAbout(d)
 ├── ...
 └── updateLangToggle(lang)
```
