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


## React

```tsx
import { Checkbox, Radio, ChoiceGroup } from "@mikholand/ui/react";

<ChoiceGroup label="Уведомления">
  <Checkbox checked={orders} onChange={(e) => setOrders(e.target.checked)}>Новые заказы</Checkbox>
  <Checkbox indeterminate={someSelected}>Все каналы</Checkbox>
</ChoiceGroup>
<ChoiceGroup label="Доставка" kind="radio">
  <Radio name="ship" value="courier" defaultChecked hint="1–2 дня, 390 ₽">Курьер</Radio>
  <Radio name="ship" value="pickup">Самовывоз</Radio>
</ChoiceGroup>
```

## Правила

- Подпись всегда внутри `<label>`, кликается вся строка.
- Radio только для взаимоисключающих вариантов внутри одной группы с общим `name`.
- Группа получает `role="group"` или `role="radiogroup"` и `aria-label`, если у неё нет видимого заголовка.
- Состояние «выбрано частично» у родительского checkbox задаётся свойством `indeterminate` из JS.
- Размер контрола 18px, checked — `accent`. Глобальные стили `input` не должны менять его размер.
