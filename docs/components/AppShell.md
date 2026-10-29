Каркас рабочего приложения: тёмный shell с сайдбаром слева и светлая рабочая область со скруглёнными верхними углами.

## Разметка

```html
<div class="mk-app" data-mk-app>
  <aside class="mk-sidebar" aria-label="Основная навигация">
    <div class="mk-sidebar__brand">
      <a class="mk-sidebar__logo" href="/">полный логотип продукта</a>
      <a class="mk-sidebar__mark" href="/" aria-label="Название">знак продукта</a>
      <button class="mk-btn mk-btn--ghost mk-btn--icon mk-sidebar__close" data-mk-drawer-close aria-label="Закрыть меню"><svg>…</svg></button>
    </div>
    <nav class="mk-sidebar__scroll" aria-label="Разделы">
      <div class="mk-nav-section">
        <span class="mk-nav-section__label">Магазин</span>
        <a class="mk-nav-item" href="/orders" aria-current="page"><svg>…</svg><span class="mk-nav-item__text">Заказы</span><span class="mk-nav-item__count">24</span></a>
      </div>
    </nav>
    <div class="mk-sidebar__footer"><strong>Название аккаунта</strong>Тариф · версия</div>
  </aside>
  <div class="mk-main">
    <div class="mk-frame">
      <div class="mk-frame__scroll">
        <header class="mk-topbar">
          <div class="mk-topbar__title"><span class="mk-topbar__meta">Раздел · дата</span><h1 class="mk-topbar__heading">Заказы</h1></div>
          <div class="mk-topbar__actions">
            <button class="mk-btn mk-btn--secondary mk-hide-mobile">Экспорт</button>
            <button class="mk-btn mk-btn--primary">Новый заказ</button>
            <button class="mk-btn mk-btn--secondary mk-btn--icon mk-topbar__menu" data-mk-drawer-open aria-label="Открыть меню"><svg>…</svg></button>
          </div>
        </header>
        <main class="mk-workspace">…</main>
      </div>
    </div>
  </div>
</div>
<script>MikholandUI.init()</script>
```

Потребитель даёт логотип и знак продукта, пункты меню с иконками Lucide и содержимое `mk-workspace`.


## React

```tsx
import Link from "next/link";
import { AppShell, Sidebar, NavSection, NavItem, Main, Topbar, Workspace, Button } from "@mikholand/ui/react";

<AppShell>
  <Sidebar logo={<img src="/logo.svg" alt="Витрина" />} mark={<img src="/mark.svg" alt="" />}
    footer={<><strong>Керамика</strong>Тариф Старт</>}>
    <NavSection label="Магазин">
      <NavItem as={Link} href="/orders" icon={<ShoppingBag />} current count={24}>Заказы</NavItem>
      <NavItem as={Link} href="/goods" icon={<Package />}>Товары</NavItem>
    </NavSection>
  </Sidebar>
  <Main>
    <Topbar title="Заказы" meta="Магазин · 29 октября" actions={<>
      <Button hideOnMobile>Экспорт</Button>
      <Button variant="primary">Новый заказ</Button>
    </>} />
    <Workspace>…</Workspace>
  </Main>
</AppShell>
```

`Topbar` сам добавляет кнопку меню для телефона, `Sidebar` — кнопку закрытия drawer. `NavItem` принимает любой компонент ссылки через `as`. Событие открытия меню — `onDrawerChange` у `AppShell`.

## Ширины

| Ширина | Сайдбар |
| --- | --- |
| больше 1180px | `sidebar-width`, иконки и подписи |
| 721–1180px | `sidebar-width-compact`: только иконки, знак вместо логотипа; подписи остаются для скринридеров |
| до 720px | скрыт; кнопка `mk-topbar__menu` открывает его как drawer справа шириной `min(drawer-width, 88vw)` |

## Поведение drawer

- Открывается кнопкой с `data-mk-drawer-open`, закрывается кнопкой с `data-mk-drawer-close`, подложкой, Escape и переходом по ссылке.
- Пока открыт: скролл страницы заблокирован, фокус удерживается внутри, при закрытии возвращается на кнопку меню.
- На desktop и в компактном режиме drawer не используется; при расширении окна он закрывается сам.
- `MikholandUI.app(el)` возвращает `{ open, show(), hide(), destroy() }`, событие `mk:drawer` с `detail.open`.

## Правила

- Скроллится `mk-frame__scroll`, а не `body`. Верхний тёмный отступ 10px виден всегда.
- Topbar держи в одну строку. Второстепенные действия помечай `mk-hide-mobile` и дублируй в меню или в самой странице.
- Footer сайдбара системный: аккаунт, тариф, версия. Не промо-карточка.
- Счётчик в пункте меню — только число, без бейджа-заливки.
