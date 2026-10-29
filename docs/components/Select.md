Выбор одного значения из списка: свой trigger и dropdown поверх скрытого нативного `<select>`.

## Разметка

```html
<label class="mk-label" for="period">Период</label>
<div class="mk-select" data-mk-select data-placeholder="Выберите период">
  <select id="period" name="period">
    <option value="" hidden selected></option>
    <option value="7d">Последние 7 дней</option>
    <option value="30d">Последние 30 дней</option>
  </select>
</div>
<script>MikholandUI.init()</script>
```

Нативный `<select>` остаётся источником значения: форма отправляет его, событие `change` срабатывает на нём. Пустой скрытый вариант даёт плейсхолдер из `data-placeholder`.


## React

```tsx
import { Field, Select } from "@mikholand/ui/react";

<Field label="Период">
  {(f) => (
    <Select
      {...f}
      options={[{ value: "7d", label: "Последние 7 дней" }, { value: "30d", label: "Последние 30 дней" }]}
      value={period}
      onChange={setPeriod}
    />
  )}
</Field>
<Select placeholder="Все категории" options={categories} name="category" />
```

Пропсы: `options` (`{ value, label, disabled? }`), `value` или `defaultValue`, `onChange(value)`, `placeholder`, `name`, `id`, `disabled`. Нативный `<select>` внутри остаётся, поэтому значение уходит в форму как обычно.

## Поведение

- Dropdown рендерится в `body` с `position: fixed`, поэтому его не обрезает карточка или таблица с `overflow`.
- Открывается вниз, а если места нет — вверх; длинный список скроллится внутри, высота не больше 320px.
- Клавиатура: стрелки, Home, End, Enter и пробел выбирают, Escape закрывает, буквы ищут по началу названия.
- Закрывается по клику вне, по Escape и по Tab.
- `MikholandUI.select(el)` возвращает `{ value, set(value), open(), close(), destroy() }`. Событие `mk:change` всплывает с корня, в `detail.value` новое значение.

## Правила

- Больше 10–12 вариантов — нужен поиск; это будет отдельный компонент Combobox.
- Не используй select для двух-трёх вариантов, которые стоит видеть сразу: для них Segmented или Radio.
