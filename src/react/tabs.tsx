import { useEffect, useRef, type ReactNode } from "react";
import { tabs as coreTabs, type TabsInstance } from "../core/index.js";
import { cx, useCore, useMkEvent } from "./utils.js";

export interface TabItem {
  /** Ключ вкладки; по умолчанию — индекс. */
  key?: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  index?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  "aria-label"?: string;
  className?: string;
}

/** Вкладки разделов одного экрана с акцентным подчёркиванием. */
export function Tabs({ items, index, defaultIndex = 0, onChange, className, ...aria }: TabsProps) {
  // Начальная вкладка фиксируется: дальше aria-selected и hidden ведёт core
  const initial = useRef(index ?? defaultIndex).current;
  const signature = items.map((it, i) => it.key ?? i).join("|");
  const [ref, inst] = useCore<TabsInstance, HTMLDivElement>((el) => coreTabs(el), [signature]);
  useMkEvent<{ index: number }>(ref, "mk:change", (d) => onChange?.(d.index));
  useEffect(() => {
    if (index !== undefined && inst.current && inst.current.index !== index) inst.current.select(index);
  }, [index, inst]);
  return (
    <div ref={ref} className={cx("mk-tabs", className)}>
      <div className="mk-tabs__list" {...aria}>
        {items.map((it, i) => (
          <button key={it.key ?? i} type="button" className="mk-tabs__tab" aria-selected={i === initial ? "true" : "false"} disabled={it.disabled}>
            {it.label}
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <div key={it.key ?? i} className="mk-tabs__panel" hidden={i !== initial}>
          {it.content}
        </div>
      ))}
    </div>
  );
}
