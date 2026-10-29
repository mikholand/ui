import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "./utils.js";
import { Spinner } from "./progress.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  /** Квадратная кнопка только с иконкой. Обязателен aria-label. */
  iconOnly?: boolean;
  /** Во всю ширину контейнера. */
  block?: boolean;
  /** Скрыть на ширине до 720px (второстепенные действия в topbar). */
  hideOnMobile?: boolean;
}

/** Классы кнопки для ссылок и чужих компонентов: <Link className={buttonClass({ variant: "primary" })}>. */
export function buttonClass({ variant = "secondary", iconOnly, block, hideOnMobile }: ButtonClassOptions = {}, extra?: string): string {
  return cx("mk-btn", `mk-btn--${variant}`, iconOnly && "mk-btn--icon", block && "mk-btn--block", hideOnMobile && "mk-hide-mobile", extra);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonClassOptions {
  /** Иконка справа от текста (или единственная иконка при iconOnly). */
  icon?: ReactNode;
  /** Идёт операция: кнопка недоступна, но не бледнеет, справа спиннер. */
  busy?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", iconOnly, block, hideOnMobile, icon, busy, className, children, type = "button", disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, iconOnly, block, hideOnMobile }, className)}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...rest}
    >
      {iconOnly ? icon : children}
      {!iconOnly && (busy ? <Spinner decorative /> : icon)}
    </button>
  );
});
