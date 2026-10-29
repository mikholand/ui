import type { HTMLAttributes, ReactNode, TableHTMLAttributes, ThHTMLAttributes } from "react";
import { ChevronDown } from "./icons.js";
import { cx } from "./utils.js";

/** Таблица в контейнере с собственным горизонтальным скроллом. Разметку строк пишешь обычными tr/td. */
export function Table({ className, children, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="mk-table-wrap">
      <table className={cx("mk-table", className)} {...rest}>{children}</table>
    </div>
  );
}

export type SortDirection = "ascending" | "descending";

export interface SortHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "onClick"> {
  /** Текущее направление, если таблица отсортирована по этой колонке. */
  sort?: SortDirection;
  onSort: () => void;
  numeric?: boolean;
  children: ReactNode;
}

/** Заголовок колонки с сортировкой. Сортирует приложение, компонент показывает состояние. */
export function SortHeader({ sort, onSort, numeric, className, children, ...rest }: SortHeaderProps) {
  return (
    <th scope="col" aria-sort={sort} className={cx(numeric && "mk-num", className)} {...rest}>
      <button type="button" className="mk-table__sort" onClick={onSort}>
        {children}
        <ChevronDown />
      </button>
    </th>
  );
}

/** Две строки в ячейке: главное и пояснение. */
export function CellText({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <>
      <span className="mk-table__primary">{primary}</span>
      {secondary != null && <span className="mk-table__secondary">{secondary}</span>}
    </>
  );
}

export function EmptyState({ title, children, className, ...rest }: HTMLAttributes<HTMLDivElement> & { title: ReactNode }) {
  return (
    <div className={cx("mk-empty", className)} {...rest}>
      <span className="mk-empty__title">{title}</span>
      {children}
    </div>
  );
}
