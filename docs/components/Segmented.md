Переключатель между 2–5 взаимоисключающими видами или периодами, активная подложка плавно переезжает.

## Разметка

```html
<div class="mk-segmented" data-mk-segmented aria-label="Период графика">
  <button data-value="day">День</button>
  <button data-value="week" aria-checked="true">Неделя</button>
  <button data-value="month">Месяц</button>
</div>
<script>MikholandUI.init()</script>
```

`mk-segmented--block` растягивает переключатель на всю ширину, например на mobile.

## Поведение

- Роль `radiogroup`, у кнопок `role="radio"` и `aria-checked`; скрипт расставит их сам.
- Стрелки переключают вариант, фокус один на группу.
- Событие `mk:change` с `detail.value` (из `data-value` или текста кнопки).
- `MikholandUI.segmented(el)` возвращает `{ value, set(value), destroy() }`.

## Правила

- Подписи короткие, одно-два слова. Длинные варианты — в Select или Tabs.
- Переключает вид того же содержимого (график за день или неделю). Разные разделы экрана — это Tabs.
- Hover меняет только цвет текста, размеры не прыгают.
- Ставь segmented на `surface` (в карточку, тулбар, шапку виджета). Дорожка `surface-soft` прямо на `bg` в светлой теме почти не видна.
