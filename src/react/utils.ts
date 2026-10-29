import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { Instance } from "../core/index.js";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Привязывает поведение из core к DOM-узлу на время жизни компонента.
 * deps пересоздают экземпляр (например, когда меняется набор вариантов select).
 */
export function useCore<T extends Instance, E extends HTMLElement = HTMLElement>(
  factory: (el: E) => T,
  deps: ReadonlyArray<unknown> = []
): [RefObject<E | null>, RefObject<T | null>] {
  const ref = useRef<E | null>(null);
  const inst = useRef<T | null>(null);
  useIsoLayoutEffect(() => {
    if (!ref.current) return;
    inst.current = factory(ref.current);
    return () => {
      inst.current?.destroy();
      inst.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [ref, inst];
}

/** Подписка на всплывающее событие mk:* с корня компонента. */
export function useMkEvent<D>(ref: RefObject<HTMLElement | null>, type: string, handler: ((detail: D) => void) | undefined) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e: Event) => {
      if (e.target === el || el.contains(e.target as Node)) saved.current?.((e as CustomEvent<D>).detail);
    };
    el.addEventListener(type, fn);
    return () => el.removeEventListener(type, fn);
  }, [ref, type]);
}
