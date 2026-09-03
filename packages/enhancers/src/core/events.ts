/** Options for {@link emit}. */
export interface EmitOptions {
  /** Allow listeners to `preventDefault()` the event. Defaults to `false`. */
  cancelable?: boolean;
}

/**
 * Event names every stateful enhancer emits, so frameworks and vanilla code
 * observe state changes through one vocabulary:
 *
 * - `hl:change`: a value changed; `detail: { value }`. The menu's value is the
 *   open submenu (or `null`), the accordion's is the array of open items.
 * - `hl:open-change`: something opened or closed; `detail: { open: boolean }`,
 *   plus component-specific context (the toast adds `toast`).
 * - `hl:select`: an item was committed; `detail: { value, item }` (cancelable).
 *   Checkable menu items add `checked`.
 * - `hl:command`: a command ran; `detail: { value, item }` (cancelable).
 */
export const Events = {
  change: 'hl:change',
  openChange: 'hl:open-change',
  select: 'hl:select',
  command: 'hl:command',
} as const;

/**
 * Dispatch a bubbling CustomEvent from `target`. Returns `false` when a
 * cancelable event was prevented by a listener.
 */
export function emit(
  target: EventTarget,
  type: string,
  detail?: unknown,
  options: EmitOptions = {},
): boolean {
  return target.dispatchEvent(
    new CustomEvent(type, { bubbles: true, cancelable: options.cancelable ?? false, detail }),
  );
}
