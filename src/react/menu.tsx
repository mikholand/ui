import { cloneElement, isValidElement, Fragment, useRef, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { menu as coreMenu, type FloatingInstance } from "../core/index.js";
import { useMounted } from "./floating.js";
import { cx, useCore, useMkEvent } from "./utils.js";

export type MenuEntry =
  | { label: string; icon?: ReactNode; hint?: ReactNode; danger?: boolean; disabled?: boolean; onSelect?: () => void }
  | { separator: true }
  | { group: string };

export interface MenuProps {
  /** Кнопка-триггер: обычно <Button>. */
  trigger: ReactElement;
  items: MenuEntry[];
  "aria-label"?: string;
  /** По какому краю триггера выравнивать. По умолчанию end. */
  align?: "start" | "end";
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Меню действий. Панель рендерится в body поверх всего, клавиатура как у нативного меню. */
export function Menu({ trigger, items, align = "end", onOpenChange, className, ...aria }: MenuProps) {
  const signature = items.map((it) => ("label" in it ? `${it.label}${it.disabled ? "!" : ""}` : "separator" in it ? "—" : `#${it.group}`)).join("|");
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Панель рендерится порталом в body, чтобы React-события внутри неё доходили до обработчиков
  const [ref] = useCore<FloatingInstance, HTMLDivElement>(
    (el) => (panelRef.current ? coreMenu(el, { panel: panelRef.current }) : { destroy() {}, open: false, show() {}, hide() {} }),
    [mounted, signature, align]
  );
  useMkEvent<{ value: string }>(ref, "mk:select", (d) => {
    const it = items[Number(d.value)];
    if (it && "label" in it) it.onSelect?.();
  });
  useMkEvent<{ open: boolean }>(ref, "mk:toggle", (d) => onOpenChange?.(d.open));
  if (!isValidElement(trigger)) throw new Error("Menu: trigger должен быть React-элементом");
  return (
    <div ref={ref} className={className} data-align={align}>
      {cloneElement(trigger as ReactElement<Record<string, unknown>>, { "data-mk-menu-trigger": "" })}
      {mounted && createPortal(
      <div ref={panelRef} className="mk-menu" hidden aria-label={aria["aria-label"]}>
        {items.map((it, i) => (
          <Fragment key={i}>
            {"separator" in it ? (
              <div className="mk-menu__sep" />
            ) : "group" in it ? (
              <span className="mk-menu__label">{it.group}</span>
            ) : (
              <button type="button" className={cx("mk-menu__item", it.danger && "mk-menu__item--danger")} data-value={String(i)} disabled={it.disabled}>
                {it.icon}
                {it.label}
                {it.hint && <span className="mk-menu__hint">{it.hint}</span>}
              </button>
            )}
          </Fragment>
        ))}
      </div>,
      document.body
      )}
    </div>
  );
}
