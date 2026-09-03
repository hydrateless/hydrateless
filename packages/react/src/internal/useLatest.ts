import { useRef, type RefObject } from 'react';

/**
 * A ref that always holds the latest value. Lets long-lived enhancers call
 * fresh callbacks without re-enhancing on every render.
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
