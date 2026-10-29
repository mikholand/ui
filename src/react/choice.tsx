import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./utils.js";

interface BaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
  /** Пояснение второй строкой под подписью. */
  hint?: ReactNode;
}

function Label({ children, hint }: { children?: ReactNode; hint?: ReactNode }) {
  if (!hint) return <>{children}</>;
  return (
    <span>
      {children}
      <span className="mk-check__hint">{hint}</span>
    </span>
  );
}

export interface CheckboxProps extends BaseProps {
  /** «Выбрано частично» у родительского checkbox. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ children, hint, indeterminate, className, ...rest }, ref) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <label className={cx("mk-check", className)}>
      <input ref={inner} type="checkbox" {...rest} />
      <Label hint={hint}>{children}</Label>
    </label>
  );
});

export const Radio = forwardRef<HTMLInputElement, BaseProps>(function Radio({ children, hint, className, ...rest }, ref) {
  return (
    <label className={cx("mk-check", className)}>
      <input ref={ref} type="radio" {...rest} />
      <Label hint={hint}>{children}</Label>
    </label>
  );
});

export interface ChoiceGroupProps {
  label: ReactNode;
  /** radio — взаимоисключающие варианты, checkbox — независимые. */
  kind?: "checkbox" | "radio";
  children: ReactNode;
  className?: string;
}

export function ChoiceGroup({ label, kind = "checkbox", children, className }: ChoiceGroupProps) {
  const text = typeof label === "string" ? label : undefined;
  return (
    <fieldset className={cx("mk-choice-group", className)} role={kind === "radio" ? "radiogroup" : "group"} aria-label={text}>
      <span className="mk-label">{label}</span>
      {children}
    </fieldset>
  );
}
