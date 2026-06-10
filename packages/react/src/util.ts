import { useRef, type RefObject } from 'react';

/** Join truthy class names into a single string. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * A ref that always holds the latest value. Lets long-lived enhancers call
 * fresh callbacks without re-enhancing on every render.
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
