import { useCallback, useRef, type ForwardedRef, type RefObject } from 'react';

/**
 * An internal ref object that also feeds a `forwardRef` consumer. Components
 * need a `RefObject` for {@link useEnhancer} while still exposing the root
 * element to callers; this gives them both from one ref. The returned object
 * doubles as a callback ref, so the consumer's ref (object or function) is
 * updated whenever the element mounts, changes, or unmounts, not just once.
 */
export function useForwardedRef<T>(
  forwarded: ForwardedRef<T>,
): RefObject<T | null> & ((node: T | null) => void) {
  const inner = useRef<T | null>(null);
  const forwardedRef = useRef(forwarded);
  forwardedRef.current = forwarded;

  const callback = useCallback((node: T | null) => {
    inner.current = node;
    const target = forwardedRef.current;
    if (typeof target === 'function') target(node);
    else if (target) target.current = node;
  }, []);

  // Give the callback a live `current` so it satisfies `RefObject` for
  // `useEnhancer` while React calls it as a function on mount/unmount.
  const ref = callback as typeof callback & { current: T | null };
  Object.defineProperty(ref, 'current', {
    configurable: true,
    get: () => inner.current,
    set: (node: T | null) => {
      inner.current = node;
    },
  });
  return ref;
}
