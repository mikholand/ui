import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils.js";

export interface KpiProps {
  label: ReactNode;
  value: ReactNode;
  /** Изменение к прошлому периоду, уже отформатированное: «+12,4%», «−3,1%». */
  delta?: ReactNode;
  /** Хорошо или плохо, по смыслу, а не по знаку. */
  trend?: "up" | "down";
  /** Пояснение после дельты: «к прошлой неделе». */
  meta?: ReactNode;
  className?: string;
}

export function Kpi({ label, value, delta, trend, meta, className }: KpiProps) {
  return (
    <div className={cx("mk-kpi", className)}>
      <span className="mk-kpi__label">{label}</span>
      <span className="mk-kpi__value">{value}</span>
      {(delta != null || meta != null) && (
        <span className="mk-kpi__meta">
          {delta != null && <span className={cx("mk-kpi__delta", trend && `mk-kpi__delta--${trend}`)}>{delta}</span>}
          {meta}
        </span>
      )}
    </div>
  );
}

export function KpiGrid({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mk-kpi-grid", className)} {...rest}>{children}</div>;
}
