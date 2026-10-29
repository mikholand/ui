import type { ReactNode } from "react";
import { CheckIcon, DotIcon } from "./icons.js";
import { Spinner } from "./progress.js";
import { cx } from "./utils.js";

export type StepState = "done" | "current" | "upcoming";

export interface StepperStep {
  title: ReactNode;
  description?: ReactNode;
  state: StepState;
}

/** Шаги мастера. До 520px складываются в колонку. */
export function Stepper({ steps, className, ...aria }: { steps: StepperStep[]; className?: string; "aria-label"?: string }) {
  return (
    <ol className={cx("mk-stepper", className)} {...aria}>
      {steps.map((s, i) => (
        <li key={i} className="mk-step" data-state={s.state} aria-current={s.state === "current" ? "step" : undefined}>
          <span className="mk-step__marker" aria-hidden="true" />
          <span className="mk-step__body">
            <span className="mk-step__title">{s.title}</span>
            {s.description && <span className="mk-step__desc">{s.description}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export interface StepLogItem {
  text: ReactNode;
  meta?: ReactNode;
  state: StepState;
}

/** Лог шагов процесса. Текущий шаг объявляется скринридеру. */
export function StepLog({ items, className, ...aria }: { items: StepLogItem[]; className?: string; "aria-label"?: string }) {
  return (
    <ol className={cx("mk-steplog", className)} {...aria}>
      {items.map((it, i) => (
        <li key={i} className="mk-steplog__item" data-state={it.state}>
          <span className="mk-steplog__marker">
            {it.state === "done" ? <CheckIcon /> : it.state === "current" ? <Spinner size="sm" tone="neutral" decorative /> : <DotIcon />}
          </span>
          <span className="mk-steplog__text" {...(it.state === "current" ? { role: "status", "aria-live": "polite" as const } : {})}>{it.text}</span>
          {it.meta != null && <span className="mk-steplog__meta">{it.meta}</span>}
        </li>
      ))}
    </ol>
  );
}
