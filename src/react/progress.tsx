import { useId, type ReactNode } from "react";
import { cx } from "./utils.js";

export interface ProgressProps {
  value: number;
  max?: number;
  label: ReactNode;
  /** Показывать процент справа от подписи. По умолчанию да. */
  showValue?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, label, showValue = true, className }: ProgressProps) {
  const id = `mk-p${useId().replace(/:/g, "")}`;
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={cx("mk-progress-field", className)}>
      <div className="mk-progress-field__row">
        <span id={id}>{label}</span>
        {showValue && <span className="mk-progress-field__value">{pct}%</span>}
      </div>
      <div className="mk-progress" role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <span className="mk-progress__bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /** neutral — без акцента, для маркеров и неинтерактивных мест. */
  tone?: "accent" | "neutral";
  /** Текст для скринридера. Без него спиннер объявляет «Загрузка». */
  label?: string;
  /** Спиннер рядом с текстом статуса: скрыт от скринридера. */
  decorative?: boolean;
  className?: string;
}

export function Spinner({ size = "md", tone = "accent", label = "Загрузка", decorative, className }: SpinnerProps) {
  return (
    <span
      className={cx("mk-spinner", size !== "md" && `mk-spinner--${size}`, tone === "neutral" && "mk-spinner--neutral", className)}
      {...(decorative ? { "aria-hidden": true } : { role: "status", "aria-label": label })}
    />
  );
}
