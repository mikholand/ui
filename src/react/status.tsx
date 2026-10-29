import type { HTMLAttributes } from "react";
import { cx } from "./utils.js";

export type StatusTone = "success" | "warning" | "danger" | "process" | "neutral";

export interface StatusProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  /** Точка перед текстом — для плотных таблиц. */
  dot?: boolean;
}

/** Статус-пилюля: цвет всегда вместе со словом. */
export function Status({ tone = "neutral", dot, className, children, ...rest }: StatusProps) {
  return (
    <span className={cx("mk-status", tone !== "neutral" && `mk-status--${tone}`, className)} {...rest}>
      {dot && <span className="mk-status__dot" />}
      {children}
    </span>
  );
}
