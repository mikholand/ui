import { createElement, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { app as coreApp, type AppInstance } from "../core/index.js";
import { Button } from "./button.js";
import { MenuIcon, XIcon } from "./icons.js";
import { cx, useCore, useMkEvent } from "./utils.js";

export interface AppShellProps {
  children: ReactNode;
  className?: string;
  /** Закрывать мобильное меню при переходе по ссылке. По умолчанию да. */
  closeOnNavigate?: boolean;
  onDrawerChange?: (open: boolean) => void;
}

/** Каркас: тёмный shell, сайдбар 272px → 82px (до 1180px) → drawer справа (до 720px). */
export function AppShell({ children, className, closeOnNavigate = true, onDrawerChange }: AppShellProps) {
  const [ref] = useCore<AppInstance, HTMLDivElement>((el) => coreApp(el, { closeOnNavigate }), [closeOnNavigate]);
  useMkEvent<{ open: boolean }>(ref, "mk:drawer", (d) => onDrawerChange?.(d.open));
  return (
    <div ref={ref} className={cx("mk-app", className)}>
      {children}
      <button type="button" className="mk-backdrop" tabIndex={-1} aria-label="Закрыть меню" data-mk-drawer-close="" />
    </div>
  );
}

export interface SidebarProps {
  /** Полный логотип продукта (слева сверху). */
  logo: ReactNode;
  /** Знак продукта для сжатого сайдбара. */
  mark: ReactNode;
  /** Ссылка с логотипа. */
  homeHref?: string;
  footer?: ReactNode;
  children: ReactNode;
  "aria-label"?: string;
}

export function Sidebar({ logo, mark, homeHref = "/", footer, children, ...aria }: SidebarProps) {
  return (
    <aside className="mk-sidebar" aria-label={aria["aria-label"] ?? "Основная навигация"}>
      <div className="mk-sidebar__brand">
        <a className="mk-sidebar__logo" href={homeHref}>{logo}</a>
        <a className="mk-sidebar__mark" href={homeHref}>{mark}</a>
        <Button variant="ghost" iconOnly className="mk-sidebar__close" data-mk-drawer-close="" aria-label="Закрыть меню" icon={<XIcon />} />
      </div>
      <nav className="mk-sidebar__scroll" aria-label="Разделы">{children}</nav>
      {footer && <div className="mk-sidebar__footer">{footer}</div>}
    </aside>
  );
}

export function NavSection({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="mk-nav-section">
      {label && <span className="mk-nav-section__label">{label}</span>}
      {children}
    </div>
  );
}

type NavItemOwnProps<E extends ElementType> = {
  /** Компонент ссылки, например Link из next/link. По умолчанию <a>. */
  as?: E;
  icon: ReactNode;
  /** Текущий раздел. */
  current?: boolean;
  count?: ReactNode;
  children: ReactNode;
  className?: string;
};
export type NavItemProps<E extends ElementType = "a"> = NavItemOwnProps<E> & Omit<ComponentPropsWithoutRef<E>, keyof NavItemOwnProps<E>>;

export function NavItem<E extends ElementType = "a">({ as, icon, current, count, children, className, ...rest }: NavItemProps<E>) {
  return createElement(
    as ?? "a",
    { className: cx("mk-nav-item", className), "aria-current": current ? "page" : undefined, ...rest },
    icon,
    <span className="mk-nav-item__text">{children}</span>,
    count != null ? <span className="mk-nav-item__count">{count}</span> : null
  );
}

/** Светлая рабочая область со своим скроллом. */
export function Main({ children }: { children: ReactNode }) {
  return (
    <div className="mk-main">
      <div className="mk-frame">
        <div className="mk-frame__scroll">{children}</div>
      </div>
    </div>
  );
}

export interface TopbarProps {
  title: ReactNode;
  meta?: ReactNode;
  /** Кнопки справа. Второстепенным ставь hideOnMobile. */
  actions?: ReactNode;
}

export function Topbar({ title, meta, actions }: TopbarProps) {
  return (
    <header className="mk-topbar">
      <div className="mk-topbar__title">
        {meta && <span className="mk-topbar__meta">{meta}</span>}
        <h1 className="mk-topbar__heading">{title}</h1>
      </div>
      <div className="mk-topbar__actions">
        {actions}
        <Button iconOnly className="mk-topbar__menu" data-mk-drawer-open="" aria-label="Открыть меню" icon={<MenuIcon />} />
      </div>
    </header>
  );
}

export function Workspace({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cx("mk-workspace", className)}>{children}</main>;
}
