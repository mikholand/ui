Checkbox для независимых настроек и множественного выбора, radio для одного варианта из группы.

## Разметка

```html
<fieldset class="mk-choice-group" role="group" aria-label="Уведомления">
  <span class="mk-label">Уведомления</span>
  <label class="mk-check"><input type="checkbox" checked> Новые заказы</label>
</fieldset>

<fieldset class="mk-choice-group" role="radiogroup" aria-label="Доставка">
  <label class="mk-check">
    <input type="radio" name="ship" checked>
    <span>Курьер<span class="mk-check__hint">1–2 дня, 390 ₽</span></span>
  </label>
</fieldset>
```

## Правила

- Подпись всегда внутри `<label>`, кликается вся строка.
- Radio только для взаимоисключающих вариантов внутри одной группы с общим `name`.
- Группа получает `role="group"` или `role="radiogroup"` и `aria-label`, если у неё нет видимого заголовка.
- Состояние «выбрано частично» у родительского checkbox задаётся свойством `indeterminate` из JS.
- Размер контрола 18px, checked — `accent`. Глобальные стили `input` не должны менять его размер.
