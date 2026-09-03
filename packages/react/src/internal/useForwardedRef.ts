import { useImperativeHandle, useRef, type ForwardedRef, type RefObject } from 'react';

/**
 * An internal ref object that also feeds a `forwardRef` consumer. Components
 * need a `RefObject` for {@link useEnhancer} while still exposing the root
 * element to callers; this gives them both from one ref.
 */
export function useForwardedRef<T>(forwarded: ForwardedRef<T>): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useImperativeHandle(forwarded, () => ref.current as T, []);
  return ref;
}
