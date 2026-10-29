import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils.js";

/** Карточка виджета. Принимает все атрибуты <section>. */
export type CardProps = HTMLAttributes<HTMLElement>;

export function Card({ className, children, ...rest }: CardProps) {
  return <section className={cx("mk-card", className)} {...rest}>{children}</section>;
}

export interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Уровень заголовка, по умолчанию h2. */
  as?: "h2" | "h3" | "h4";
}

export function CardHeader({ title, description, actions, as: H = "h2" }: CardHeaderProps) {
  return (
    <div className="mk-card__head">
      <div className="mk-card__titles">
        <H className="mk-card__title">{title}</H>
        {description && <p className="mk-card__desc">{description}</p>}
      </div>
      {actions && <div className="mk-card__actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ flush, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { flush?: boolean }) {
  return <div className={cx("mk-card__body", flush && "mk-card__body--flush", className)} {...rest}>{children}</div>;
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mk-card__foot", className)} {...rest}>{children}</div>;
}

/** Плотная раскладка разновысотных карточек колонками по 340px. */
export function Masonry({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mk-masonry", className)} {...rest}>{children}</div>;
}
