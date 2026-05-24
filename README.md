# Alesia Zayats — CV Website

Lead IT Recruiter / Recruitment Team Lead — одностраничный CV-сайт с поддержкой двух языков.

**Live:** https://alesiaz19.github.io/alesia-cv/

## Особенности

- **Два языка** — EN/RU через `?lang=ru` в URL, автодетекция браузера
- **SEO** — meta/OG/Twitter/JSON-LD, sitemap, robots, hreflang
- **Дизайн** — тёмная тема, glassmorphism, адаптивная вёрстка
- **CV .docx** — кнопка скачивания актуального резюме
- **GitHub Pages** — деплой одной командой

## Структура

```
├── index.html          # Основная страница
├── style.css           # Единый файл стилей
├── script.js           # Рендеринг, переключение языка, анимации
├── data.js             # Весь контент (EN + RU)
├── Alesia_Zayats_CV.docx
├── robots.txt
├── sitemap.xml
├── img/                # Сертификаты (jpeg)
└── unpacked_cv/        # DOCX исходники (document.xml)
```

## Разработка

Открой `index.html` в браузере — всё работает из коробки.

### Редактирование контента

Все тексты в `data.js` — два блока (en, ru). Добавление/изменение секций — в `script.js` (функции `render*`).

### Редактирование DOCX

```bash
cp Alesia_Zayats_CV.docx cv_temp.zip
unzip -o cv_temp.zip -d unpacked_cv/
# правим unpacked_cv/word/document.xml
cd unpacked_cv && zip -r ../Alesia_Zayats_CV.docx * && cd ..
```

## Технологии

HTML5, CSS3 (CSS Variables, clamp, glassmorphism), Vanilla JS (ES6+).
