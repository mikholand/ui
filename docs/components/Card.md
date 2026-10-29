Карточка виджета: шапка с заголовком и действиями, тело и необязательные кнопки внизу.

## Разметка

```html
<section class="mk-card">
  <div class="mk-card__head">
    <div class="mk-card__titles">
      <h2 class="mk-card__title">Очередь отправки</h2>
      <p class="mk-card__desc">Нужно отправить сегодня</p>
    </div>
    <div class="mk-card__actions"><button class="mk-btn mk-btn--ghost">Все</button></div>
  </div>
  <div class="mk-card__body">…</div>
  <div class="mk-card__foot">…кнопки…</div>
</section>
```

Для таблицы или списка во всю ширину карточки — `mk-card__body mk-card__body--flush`.

## Раскладка нескольких карточек

- Однотипные карточки одной высоты — grid с `gap: var(--space-4)`.
- Разновысотные виджеты — контейнер `mk-masonry` (CSS columns): колонки по 340px, без дыр под короткими карточками, на телефоне одна колонка.

## Правила

- Без рамки: карточку отделяют `surface` и `shadow-card`.
- Карточка одного цвета целиком, без серой шапки.
- Карточки в карточки не вкладывай. Вложенная зона — `surface-soft` с `radius-md`.
- Hover-поднятия нет.
