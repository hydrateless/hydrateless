/**
 * A teardown function returned by every enhancer. Calling it removes all
 * listeners and observers the enhancer registered and un-marks the affected
 * roots so they can be safely enhanced again (e.g. after a framework remount).
 */
export type Disposer = () => void;

/** A disposer that does nothing. Useful as a default/no-op in SSR guards. */
export const noop: Disposer = () => {};

/**
 * Attach an event listener and return a disposer that detaches it. Centralizing
 * add/remove pairing prevents the global-listener leaks that come from calling
 * an enhancer repeatedly in single-page apps.
 */
export function on<E extends Event = Event>(
  target: EventTarget,
  type: string,
  handler: (event: E) => void,
  options?: boolean | AddEventListenerOptions,
): Disposer {
  const listener = handler as EventListener;
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

/** Collapse many disposers into one. Each child runs at most once. */
export function combine(disposers: Disposer[]): Disposer {
  return () => {
    while (disposers.length) {
      const dispose = disposers.pop();
      if (dispose) dispose();
    }
  };
}

/**
 * Find component roots for `selector` within `container`. Unlike a plain
 * `querySelectorAll`, this also includes `container` itself when it matches,
 * so an enhancer works whether it is handed a broad container (e.g. `document`)
 * or the component root directly (as framework bindings do via a ref).
 */
export function selectRoots<T extends HTMLElement = HTMLElement>(
  container: Document | HTMLElement,
  selector: string,
): T[] {
  const found = Array.from(container.querySelectorAll<T>(selector));
  if (container instanceof Element && container.matches(selector)) {
    found.unshift(container as unknown as T);
  }
  return found;
}

let counter = 0;

/**
 * Generate a stable-enough unique id for wiring ARIA relationships. Combines a
 * monotonic counter with a short random suffix so ids are unique even across
 * multiple enhancer runs on the same document.
 */
export function uid(prefix = 'hl'): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
