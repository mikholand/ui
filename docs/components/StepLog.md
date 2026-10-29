Лог шагов процесса: плотный список с маркером 28px, текстом и временем или статусом справа.

## Разметка

```html
<ol class="mk-steplog" aria-label="Импорт товаров">
  <li class="mk-steplog__item" data-state="done"><span class="mk-steplog__marker"><svg>check</svg></span><span class="mk-steplog__text">Нашли 86 товаров с ценой</span><span class="mk-steplog__meta">12:40:19</span></li>
  <li class="mk-steplog__item" data-state="current"><span class="mk-steplog__marker"><span class="mk-spinner mk-spinner--sm mk-spinner--neutral"></span></span><span class="mk-steplog__text" role="status" aria-live="polite">Загружаем фото: 41 из 86</span><span class="mk-steplog__meta">идёт</span></li>
  <li class="mk-steplog__item" data-state="upcoming">…</li>
</ol>
```


## React

```tsx
import { StepLog } from "@mikholand/ui/react";

<StepLog
  aria-label="Импорт товаров"
  items={[
    { text: "Нашли 86 товаров с ценой", meta: "12:40:19", state: "done" },
    { text: "Загружаем фото: 41 из 86", meta: "идёт", state: "current" },
    { text: "Разложим по категориям", meta: "ждёт", state: "upcoming" },
  ]}
/>
```

Маркеры (галочка, нейтральный спиннер, точка) компонент ставит сам по `state`.

## Правила

- Состояния различаются текстом и спокойной заливкой строки, а не цветом маркера: иконки и спиннер в маркере нейтральные.
- Текущий шаг пишет прогресс в тексте («41 из 86») и объявляется скринридеру через `role="status"`.
- Без декоративной временной шкалы и крупных номеров. Соединительные линии — только в Stepper.
