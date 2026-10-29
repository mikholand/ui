Меню действий над объектом: открывается кнопкой, пункты выбираются мышью и с клавиатуры.

## Разметка

```html
<div data-mk-menu data-align="start">
  <button class="mk-btn mk-btn--secondary" data-mk-menu-trigger>Действия <svg>chevron-down</svg></button>
  <div class="mk-menu" aria-label="Действия с заказом">
    <button class="mk-menu__item"><svg>…</svg>Редактировать<span class="mk-menu__hint">E</span></button>
    <div class="mk-menu__sep"></div>
    <button class="mk-menu__item mk-menu__item--danger"><svg>…</svg>Удалить заказ</button>
  </div>
</div>
<script>MikholandUI.init()</script>
```

`data-align="start"` выравнивает меню по левому краю кнопки, по умолчанию — по правому. Группы подписываются `mk-menu__label`, разделяются `mk-menu__sep`.

## Поведение

- Меню переносится в `body` и позиционируется `fixed`, поэтому его не обрезают карточки и таблицы. Открывается вниз, при нехватке места — вверх.
- Клавиатура: стрелки вниз и вверх на кнопке открывают меню на первом или последнем пункте; внутри — стрелки, Home, End, буквы для поиска; Enter выбирает; Escape и Tab закрывают.
- После выбора меню закрывается, фокус возвращается на кнопку, всплывает событие `mk:select` с `detail.value` (из `data-value` или текста пункта без подсказки).
- `MikholandUI.menu(el, { onSelect })` возвращает `{ open, show(), hide(), destroy() }`.

## Правила

- В пунктах меню иконка слева: это список, а не кнопка.
- Опасное действие — последним, после разделителя, с `mk-menu__item--danger`.
- Недоступный пункт оставляй видимым с `disabled` и причиной в тексте: «Счёт (нет реквизитов)».
