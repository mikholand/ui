import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cx } from "./utils.js";

export interface FieldProps {
  label: ReactNode;
  /** id поля; если не задан, сгенерируется и передастся в children-функцию. */
  id?: string;
  hint?: ReactNode;
  /** Текст ошибки: заменяет подсказку и помечает поле aria-invalid. */
  error?: ReactNode;
  className?: string;
  children: (field: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode;
}

/** Подпись, поле и подсказка или ошибка, связанные через id и aria-describedby. */
export function Field({ label, id, hint, error, className, children }: FieldProps) {
  const auto = useId();
  const fieldId = id ?? `mk-f${auto.replace(/:/g, "")}`;
  const noteId = `${fieldId}-note`;
  const note = error ?? hint;
  return (
    <div className={cx("mk-field", className)}>
      <label className="mk-label" htmlFor={fieldId}>{label}</label>
      {children({ id: fieldId, "aria-invalid": error ? true : undefined, "aria-describedby": note ? noteId : undefined })}
      {note && <span id={noteId} className={cx("mk-hint", !!error && "mk-hint--error")}>{note}</span>}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...rest }, ref) {
  return <input ref={ref} className={cx("mk-input", className)} aria-invalid={invalid || rest["aria-invalid"] || undefined} {...rest} />;
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, className, ...rest }, ref) {
  return <textarea ref={ref} className={cx("mk-input", className)} aria-invalid={invalid || rest["aria-invalid"] || undefined} {...rest} />;
});
