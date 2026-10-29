/** Общий интерфейс всех инициализированных компонентов. */
export interface Instance {
  destroy(): void;
}

export interface SegmentedInstance extends Instance {
  readonly value: string | null;
  set(value: string): void;
}
export interface TabsInstance extends Instance {
  readonly index: number;
  select(index: number): void;
}
export interface SelectInstance extends Instance {
  readonly value: string;
  set(value: string): void;
  open(): void;
  close(): void;
}
export interface AppInstance extends Instance {
  /** Открыт ли мобильный drawer. */
  readonly open: boolean;
  show(): void;
  hide(): void;
}
export interface FloatingInstance extends Instance {
  readonly open: boolean;
  show(): void;
  hide(): void;
}
export interface PaginationInstance extends Instance {
  readonly page: number;
  go(page: number): void;
  update(options: { total?: number; pageSize?: number; page?: number }): void;
}

export declare const version: string;

/** Находит в root все элементы с data-mk-* и оживляет их. Повторный вызов пропускает уже инициализированные. */
export declare function init(root?: ParentNode): Instance[];

export declare function segmented(root: HTMLElement, options?: { onChange?: (value: string) => void }): SegmentedInstance;
export declare function tabs(root: HTMLElement, options?: { onChange?: (index: number) => void }): TabsInstance;
export declare function select(root: HTMLElement, options?: { onChange?: (value: string) => void }): SelectInstance;
export declare function app(root: HTMLElement, options?: { closeOnNavigate?: boolean }): AppInstance;
/** panel — готовая панель (например, React-портал в body); иначе берётся .mk-menu внутри root и переносится в body. */
export declare function menu(root: HTMLElement, options?: { onSelect?: (value: string) => void; panel?: HTMLElement }): FloatingInstance;
/** panel — готовая панель (например, React-портал в body); иначе берётся .mk-popover внутри root и переносится в body. */
export declare function popover(root: HTMLElement, options?: { panel?: HTMLElement }): FloatingInstance;
export declare function pagination(
  root: HTMLElement,
  options?: { total?: number; pageSize?: number; page?: number; noun?: string; onChange?: (page: number) => void }
): PaginationInstance;
/** Ставит panel (position: fixed) под или над trigger, не выходя за экран. */
export declare function placeFloating(trigger: Element, panel: HTMLElement, align?: "start" | "end"): void;
