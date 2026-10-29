import { cloneElement, isValidElement, useRef, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { popover as corePopover, type FloatingInstance } from "../core/index.js";
import { Button } from "./button.js";
import { XIcon } from "./icons.js";
import { useMounted } from "./floating.js";
import { useCore, useMkEvent } from "./utils.js";

export interface PopoverProps {
  trigger: ReactElement;
  title: ReactNode;
  children: ReactNode;
  /** Кнопки внизу. Оберни закрывающие в <PopoverClose>. */
  footer?: ReactNode;
  align?: "start" | "end";
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Панель с настройками, например фильтр. Вложенные select и меню её не закрывают. */
export function Popover({ trigger, title, children, footer, align = "end", onOpenChange, className }: PopoverProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Панель рендерится порталом в body, чтобы React-события внутри неё доходили до обработчиков
  const [ref] = useCore<FloatingInstance, HTMLDivElement>(
    (el) => (panelRef.current ? corePopover(el, { panel: panelRef.current }) : { destroy() {}, open: false, show() {}, hide() {} }),
    [mounted, align]
  );
  useMkEvent<{ open: boolean }>(ref, "mk:toggle", (d) => onOpenChange?.(d.open));
  if (!isValidElement(trigger)) throw new Error("Popover: trigger должен быть React-элементом");
  return (
    <div ref={ref} className={className} data-align={align}>
      {cloneElement(trigger as ReactElement<Record<string, unknown>>, { "data-mk-popover-trigger": "" })}
      {mounted && createPortal(
      <div ref={panelRef} className="mk-popover" hidden>
        <div className="mk-popover__head">
          <h2 className="mk-popover__title">{title}</h2>
          <Button variant="ghost" iconOnly data-mk-popover-close="" aria-label="Закрыть" icon={<XIcon />} />
        </div>
        <div className="mk-popover__body">{children}</div>
        {footer && <div className="mk-popover__foot">{footer}</div>}
      </div>,
      document.body
      )}
    </div>
  );
}

/** Делает вложенный элемент закрывающим popover (после его собственного onClick). */
export function PopoverClose({ children }: { children: ReactElement }) {
  return cloneElement(children as ReactElement<Record<string, unknown>>, { "data-mk-popover-close": "" });
}
