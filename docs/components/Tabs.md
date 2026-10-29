Вкладки для разделов одного экрана: акцентное подчёркивание переезжает между активными вкладками.

## Разметка

```html
<div class="mk-tabs" data-mk-tabs>
  <div class="mk-tabs__list" aria-label="Заказы">
    <button class="mk-tabs__tab" aria-selected="true">Активные · 24</button>
    <button class="mk-tabs__tab">Выполненные</button>
  </div>
  <div class="mk-tabs__panel">…</div>
  <div class="mk-tabs__panel">…</div>
</div>
<script>MikholandUI.init()</script>
```

Панели сопоставляются вкладкам по порядку. Роли `tablist`, `tab`, `tabpanel`, связи `aria-controls` и `aria-labelledby` скрипт расставит сам.

## Поведение

- Стрелки влево и вправо, Home, End переключают вкладки.
- Список вкладок скроллится горизонтально внутри себя, активная вкладка прокручивается в зону видимости.
- Событие `mk:change` с `detail.index`. `MikholandUI.tabs(el)` возвращает `{ index, select(i), destroy() }`.

## Правила

- Активная вкладка — только `accent-text` и подчёркивание, без заливки.
- Счётчик пишется в подписи через точку: «Активные · 24».
- Неактивные вкладки нейтральные, hover — `surface-soft`.
