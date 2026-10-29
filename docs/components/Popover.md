Всплывающая панель с настройками, например фильтр: шапка и кнопки закреплены, тело скроллится.

## Разметка

```html
<div data-mk-popover data-align="start">
  <button class="mk-btn mk-btn--secondary" data-mk-popover-trigger>Фильтр <svg>…</svg></button>
  <div class="mk-popover">
    <div class="mk-popover__head">
      <h2 class="mk-popover__title">Фильтр заказов</h2>
      <button class="mk-btn mk-btn--ghost mk-btn--icon" data-mk-popover-close aria-label="Закрыть"><svg>x</svg></button>
    </div>
    <div class="mk-popover__body">…поля…</div>
    <div class="mk-popover__foot">
      <button class="mk-btn mk-btn--ghost" data-mk-popover-close>Сбросить</button>
      <button class="mk-btn mk-btn--primary" data-mk-popover-close>Показать 18</button>
    </div>
  </div>
</div>
<script>MikholandUI.init()</script>
```

Любой элемент с `data-mk-popover-close` закрывает панель. Потребитель сам обрабатывает клики по кнопкам действия.

## Поведение

- Ширина `min(320px, 100vw − 16px)`, не выходит за экран. Если не помещается, скроллится только тело, шапка и кнопки остаются видны.
- При открытии фокус встаёт на первое поле тела (или на элемент с `autofocus`).
- Закрывается по клику вне, по Escape и при уходе фокуса наружу; фокус возвращается на кнопку.
- Вложенные слои работают: select или меню внутри popover не закрывают его, первый Escape закрывает вложенный слой, второй — сам popover.
- `MikholandUI.popover(el)` возвращает `{ open, show(), hide(), destroy() }`, событие `mk:toggle` с `detail.open`.

## Правила

- Popover — для коротких настроек. Длинная форма из нескольких шагов — отдельная страница или модальное окно.
- Кнопка, открывающая фильтр, остаётся secondary; число применённых фильтров пиши в подписи: «Фильтр · 2».
