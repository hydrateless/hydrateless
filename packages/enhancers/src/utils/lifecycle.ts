/**
 * A teardown function returned by every enhancer. Calling it removes all
 * listeners and observers the enhancer registered and un-marks the affected
 * roots so they can be safely enhanced again (e.g. after a framework remount).
 */
export type Disposer = () => void;

/**
 * Attach an event listener and return a disposer that detaches it. Centralizing
 * add/remove pairing prevents the global-listener leaks that come from calling
 * an enhancer repeatedly in single-page apps.
 */
export function on(
  target: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): Disposer {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
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
 * `querySelectorAll`, this also includes `container` itself when it matches —
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
