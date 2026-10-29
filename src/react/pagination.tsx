import { useEffect } from "react";
import { pagination as corePagination, type PaginationInstance } from "../core/index.js";
import { cx, useCore, useMkEvent } from "./utils.js";

export interface PaginationProps {
  total: number;
  pageSize?: number;
  page: number;
  onChange: (page: number) => void;
  /** Существительное в отчёте: «1–20 из 112 заказов». */
  noun?: string;
  "aria-label"?: string;
  className?: string;
}

export function Pagination({ total, pageSize = 20, page, onChange, noun, className, ...aria }: PaginationProps) {
  const [ref, inst] = useCore<PaginationInstance, HTMLElement>((el) => corePagination(el, { total, pageSize, page, noun }), [noun]);
  useMkEvent<{ page: number }>(ref, "mk:change", (d) => onChange(d.page));
  useEffect(() => {
    inst.current?.update({ total, pageSize, page });
  }, [total, pageSize, page, inst]);
  return <nav ref={ref} className={cx("mk-pagination", className)} aria-label={aria["aria-label"] ?? "Страницы"} />;
}
