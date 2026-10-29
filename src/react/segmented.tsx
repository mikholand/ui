import { useEffect, useRef } from "react";
import { segmented as coreSegmented, type SegmentedInstance } from "../core/index.js";
import { cx, useCore, useMkEvent } from "./utils.js";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  "aria-label": string;
  /** Во всю ширину. */
  block?: boolean;
  className?: string;
}

/** Переключатель 2–5 видов с переезжающей подложкой. */
export function Segmented({ options, value, defaultValue, onChange, block, className, ...aria }: SegmentedProps) {
  // Начальное значение фиксируется: дальше aria-checked ведёт core, иначе индикатор не узнает о смене
  const initial = useRef(value ?? defaultValue ?? options[0]?.value).current;
  const signature = options.map((o) => o.value + "\u0000" + o.label).join("\u0001");
  const [ref, inst] = useCore<SegmentedInstance, HTMLDivElement>((el) => coreSegmented(el), [signature]);
  useMkEvent<{ value: string }>(ref, "mk:change", (d) => onChange?.(d.value));
  useEffect(() => {
    if (value !== undefined && inst.current && inst.current.value !== value) inst.current.set(value);
    // set() сам двигает индикатор; при совпадении значения ничего не делает
  }, [value, inst]);
  return (
    <div ref={ref} className={cx("mk-segmented", block && "mk-segmented--block", className)} role="radiogroup" {...aria}>
      <span className="mk-segmented__indicator" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" data-value={o.value} aria-checked={o.value === initial ? "true" : "false"}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
