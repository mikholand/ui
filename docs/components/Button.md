Кнопка действия: primary для главного действия экрана, secondary для остальных, ghost для тихих, danger для удаления.

## Разметка

```html
<button class="mk-btn mk-btn--primary">Сохранить</button>
<button class="mk-btn mk-btn--secondary">Экспорт <svg>…</svg></button>
<button class="mk-btn mk-btn--ghost mk-btn--icon" aria-label="Ещё действия"><svg>…</svg></button>
```

Ссылка, которая выглядит как кнопка, — тот же класс на `<a>`.


## React

```tsx
import { Button, buttonClass } from "@mikholand/ui/react";
import { Download, MoreHorizontal } from "lucide-react";

<Button variant="primary">Сохранить</Button>
<Button icon={<Download />}>Экспорт</Button>
<Button variant="ghost" iconOnly icon={<MoreHorizontal />} aria-label="Ещё действия" />
<Button variant="primary" busy>Сохраняем</Button>

// Ссылка, оформленная как кнопка (например, next/link):
<Link href="/orders/new" className={buttonClass({ variant: "primary" })}>Новый заказ</Link>
```

Пропсы: `variant` (`primary`, `secondary` по умолчанию, `ghost`, `danger`), `icon` (справа от текста), `iconOnly`, `block`, `hideOnMobile`, `busy` (недоступна, не бледнеет, спиннер справа), плюс все атрибуты `<button>`.

## Варианты

| Класс | Когда |
| --- | --- |
| `mk-btn--primary` | Одно главное действие в зоне: «Сохранить», «Опубликовать». Не больше одной primary в группе. |
| `mk-btn--secondary` | Остальные действия: «Экспорт», «Фильтр», «Отмена» в формах. |
| `mk-btn--ghost` | Тихие действия в тулбарах и строках таблиц. |
| `mk-btn--danger` | Удаление и другие необратимые действия. |
| `mk-btn--icon` | Только иконка, квадрат `control-height`. Обязателен `aria-label`. |
| `mk-btn--block` | Во всю ширину контейнера, например в мобильной форме. |

## Правила

- Иконка ставится справа от текста. Слева — только у icon-only кнопок и в навигации.
- Иконки Lucide, outline, `stroke-width: 2`, размер задаёт `icon-size`.
- У secondary нет синего ни в одном состоянии, hover — только `surface-soft`.
- Hover и active меняют только оттенок. Никаких теней, `translateY` и `scale`.
- Текст кнопки — глагол действия: «Добавить канал», а не «Добавление».
- Недоступное действие — атрибут `disabled` (у ссылки `aria-disabled="true"`).
