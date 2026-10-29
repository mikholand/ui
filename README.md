# mikholand UI

Плотная дизайн-система для рабочих интерфейсов и Telegram Mini App: реестры, заказы, фильтры, панели управления. Строгий B2B-характер, один акцент `#3259ff`, светлая и тёмная темы.

Система устроена слоями, и каждый можно использовать отдельно:

| Слой | Что это | Импорт |
| --- | --- | --- |
| Токены | Цвета двух тем, типографика, отступы, радиусы, тени | `@mikholand/ui/tokens.css`, `tokens` из `@mikholand/ui` |
| CSS-компоненты | Классы `mk-*`: вся визуальная часть | `@mikholand/ui/styles.css` |
| Поведение | Select, вкладки, меню, popover, пагинация, мобильное меню. Без зависимостей | `@mikholand/ui/core` или `<script>` с CDN |
| React | Тонкие обёртки с типами над классами и поведением | `@mikholand/ui/react` |

Правила использования — в [docs/guidelines.md](docs/guidelines.md), по каждому компоненту — в [docs/components](docs/components). Витрина всех компонентов — `preview/index.html`.

## Установка

```bash
npm i @mikholand/ui
```

## React и Next.js

```tsx
// app/layout.tsx — один раз
import "@mikholand/ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { AppShell, Sidebar, NavSection, NavItem, Main, Topbar, Workspace, Button, Card, CardHeader, CardBody, Table, Status } from "@mikholand/ui/react";

export default function Orders() {
  return (
    <AppShell>
      <Sidebar logo={<img src="/logo.svg" alt="Витрина" />} mark={<img src="/mark.svg" alt="" />}>
        <NavSection label="Магазин">
          <NavItem as={Link} href="/orders" icon={<ShoppingBag />} current count={24}>Заказы</NavItem>
        </NavSection>
      </Sidebar>
      <Main>
        <Topbar title="Заказы" meta="Магазин" actions={<>
          <Button hideOnMobile>Экспорт</Button>
          <Button variant="primary">Новый заказ</Button>
        </>} />
        <Workspace>
          <Card>
            <CardHeader title="Последние заказы" description="5 из 24 за неделю" />
            <CardBody flush>
              <Table>…</Table>
            </CardBody>
          </Card>
        </Workspace>
      </Main>
    </AppShell>
  );
}
```

Модуль `@mikholand/ui/react` помечен `"use client"`, его можно импортировать из серверных компонентов. Иконки система не тащит: передавай свои, например из `lucide-react`.

## Обычный HTML без сборки

```html
<html lang="ru" data-theme="light">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mikholand/ui@0.1/dist/styles.css">
</head>
<body>
  <div class="mk-select" data-mk-select>
    <select><option>Сегодня</option><option selected>Последние 7 дней</option></select>
  </div>
  <button class="mk-btn mk-btn--primary">Сохранить</button>

  <script src="https://cdn.jsdelivr.net/npm/@mikholand/ui@0.1/dist/mikholand-ui.global.js"></script>
  <script>MikholandUI.init()</script>
</body>
</html>
```

Интерактивные компоненты размечаются атрибутами `data-mk-*` и оживают после `MikholandUI.init()`. Повторный вызов безопасен: уже инициализированные элементы пропускаются.

## Тема

Тема задаётся атрибутом на `<html>`: `data-theme="light"` или `data-theme="dark"`. Все цвета компонентов берутся из токенов, поэтому смена атрибута перекрашивает всё сразу.

## Токены в коде

```ts
import { tokens } from "@mikholand/ui";

tokens.colors.dark.accent;     // "#3259ff"
tokens.radius["radius-lg"];    // "16px"
```

Текстовые стили доступны классами `mk-text-<стиль>`: `mk-text-h1`, `mk-text-body`, `mk-text-caption` и т. д.

## Разработка

```bash
npm ci
npm run check     # типы и сборка
npm run preview   # витрина: http://localhost:3200/preview/
```

Значения правятся только в `tokens/tokens.json`. Подробнее о слоях и правилах — в [CLAUDE.md](CLAUDE.md).

## Релиз

1. Поднять `version` в `package.json` и закоммитить в `main`.
2. На GitHub: Releases → Draft a new release → тег `v<версия>` или `<версия>` (создать при публикации, цель `main`) → описать изменения → Publish release.
3. Workflow `publish.yml` проверит, что тег совпадает с версией, соберёт пакет и опубликует его в npm.
