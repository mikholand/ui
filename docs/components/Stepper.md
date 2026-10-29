Шаги мастера: круглые маркеры, тонкие линии, текущий шаг залит акцентом. Без скрипта.

## Разметка

```html
<ol class="mk-stepper" aria-label="Подключение канала">
  <li class="mk-step" data-state="done"><span class="mk-step__marker" aria-hidden="true"></span><span class="mk-step__body"><span class="mk-step__title">Канал</span><span class="mk-step__desc">@keramika_ru</span></span></li>
  <li class="mk-step" data-state="current" aria-current="step">…</li>
  <li class="mk-step" data-state="upcoming">…</li>
</ol>
```

Номер шага ставится автоматически, у пройденных шагов — галочка.

## Правила

- Только для пошаговых сценариев: подключение, онбординг внутри продукта, оформление. Для истории событий — StepLog.
- `data-state`: `done`, `current`, `upcoming`. Текущему шагу добавляй `aria-current="step"`.
- На ширине до 520px шаги складываются в колонку с вертикальными линиями.
- 3–6 шагов. Подписи короткие, пояснение — одна строка.
