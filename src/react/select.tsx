import { useEffect, type ChangeEvent } from "react";
import { select as coreSelect, type SelectInstance } from "../core/index.js";
import { ChevronDown } from "./icons.js";
import { cx, useCore } from "./utils.js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Текст, пока ничего не выбрано. Без него выбран первый вариант. */
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
}

/** Кастомный dropdown поверх скрытого нативного select: значение уходит в форму как обычно. */
export function Select({ options, value, defaultValue, onChange, placeholder, id, name, disabled, className, ...aria }: SelectProps) {
  const signature = options.map((o) => `${o.value}\u0000${o.label}\u0000${o.disabled ? 1 : 0}`).join("\u0001") + `|${placeholder ?? ""}|${disabled ? 1 : 0}`;
  const [ref, inst] = useCore<SelectInstance, HTMLDivElement>((el) => coreSelect(el), [signature]);

  useEffect(() => {
    // React уже выставил value нативному select, но подпись триггера обновляет только core
    if (value !== undefined && inst.current) inst.current.set(value);
  }, [value, inst]);

  const handle = (e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value);
  const controlled = value !== undefined;

  return (
    <div ref={ref} className={cx("mk-select", className)} data-placeholder={placeholder}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        {...(controlled ? { value } : { defaultValue: defaultValue ?? (placeholder ? "" : undefined) })}
        onChange={handle}
        {...aria}
      >
        {placeholder && <option value="" hidden />}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
      <button type="button" className="mk-select__trigger">
        <span className="mk-select__value" />
        <ChevronDown />
      </button>
    </div>
  );
}
