Progress bar для операций с известным процентом и spinner для коротких неопределённых ожиданий.

## Разметка

```html
<div class="mk-progress-field">
  <div class="mk-progress-field__row"><span id="lbl">Загрузка каталога</span><span class="mk-progress-field__value">64%</span></div>
  <div class="mk-progress" role="progressbar" aria-labelledby="lbl" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64">
    <span class="mk-progress__bar" style="width:64%"></span>
  </div>
</div>

<span class="mk-spinner" role="status" aria-label="Загрузка"></span>
<button class="mk-btn mk-btn--primary" disabled aria-busy="true">Сохраняем <span class="mk-spinner" aria-hidden="true"></span></button>
```


## React

```tsx
import { Progress, Spinner, Button } from "@mikholand/ui/react";

<Progress value={64} label="Загрузка каталога" />
<Spinner size="lg" label="Загружаем заказы" />
<Spinner size="sm" tone="neutral" decorative />  {/* рядом с текстом статуса */}
<Button variant="primary" busy>Сохраняем</Button>
```

## Варианты спиннера

| Класс | Когда |
| --- | --- |
| `mk-spinner` | 18px, по умолчанию. |
| `mk-spinner--sm`, `mk-spinner--lg` | 16px рядом с текстом, 20px отдельно. |
| `mk-spinner--neutral` | Без акцента: внутри маркеров лога и в неинтерактивных местах. |
| внутри `mk-btn` | Берёт цвет текста кнопки. Кнопка с `aria-busy="true"` не бледнеет. |

## Правила

- Progress bar высотой 8px, трек `surface-soft`, заливка `accent`. Атрибуты `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` обязательны.
- Spinner — для ожиданий без известного процента: проверка файла, ответ сервиса. Полноэкранных прелоадеров нет.
- Статус загрузки показывай рядом с конкретным файлом, текст статуса — с `role="status"` и `aria-live="polite"`.
- Без теней и свечения.
