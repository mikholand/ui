Пагинация длинных списков: страницы по 32px, стрелки и отчёт «1–20 из 112».

## Разметка

```html
<nav class="mk-pagination" data-mk-pagination data-total="112" data-page-size="20" data-page="1" data-noun="заказов"></nav>
<script>MikholandUI.init()</script>
```

Содержимое строит скрипт из атрибутов. Когда данные приходят с сервера, обновляй через API: `MikholandUI.pagination(el).update({ total, page })`.

## Поведение

- До 7 страниц показываются все; дальше — первая, последняя и соседние с текущей, пропуски — «…».
- Текущая страница с `aria-current="page"`, отчёт с `aria-live="polite"`, стрелки на краях становятся недоступны.
- Событие `mk:change` с `detail.page`; `MikholandUI.pagination(el, { total, pageSize, page, onChange })` возвращает `{ page, go(n), update(opts), destroy() }`.

## Правила

- Пагинация стоит под таблицей, внутри той же карточки, с отступом `space-3`.
- Для лент, где важно «показать ещё», пагинация не нужна — кнопка «Показать ещё 20» понятнее.
