Плотная таблица для реестров и списков: шапка 12px uppercase, мягкий hover, горизонтальный скролл внутри своего контейнера.

## Разметка

```html
<div class="mk-table-wrap">
  <table class="mk-table">
    <thead>
      <tr>
        <th scope="col">Заказ</th>
        <th scope="col" class="mk-num" aria-sort="descending"><button class="mk-table__sort">Сумма <svg>chevron-down</svg></button></th>
        <th scope="col">Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <td><span class="mk-table__primary">ORD-20481</span><span class="mk-table__secondary">сегодня, 12:40</span></td>
        <td class="mk-num">4 580 ₽</td>
        <td class="mk-shrink"><span class="mk-status mk-status--success">Оплачен</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

В карточке таблица идёт в `mk-card__body--flush`.

## Классы ячеек

| Класс | Когда |
| --- | --- |
| `mk-num` | Числа и суммы: по правому краю, без переноса. |
| `mk-shrink` | Колонка по ширине содержимого: статус, действия, checkbox. |
| `mk-wrap` | Длинный текст, которому разрешено переноситься (по умолчанию ячейки в одну строку). |
| `mk-table__primary`, `mk-table__secondary` | Две строки в ячейке: главное и пояснение. |

## Поведение

- Сортировку выполняет приложение. Таблица показывает состояние: `aria-sort="ascending"` или `"descending"` на `th`, кнопка `mk-table__sort` внутри.
- Выбранная строка — `aria-selected="true"`.
- Пустая таблица — `<div class="mk-empty"><span class="mk-empty__title">Нет заказов за период</span>Попробуйте выбрать другой период</div>` вместо `table`.

## Правила

- Цифры выравниваются автоматически: в таблице включён `tabular-nums`.
- Внутри строк — никаких карточек и крупных бейджей, только текст, статус-пилюля и ghost-кнопки.
- Горизонтальный скролл только у `mk-table-wrap`, страница не скроллится вбок.
