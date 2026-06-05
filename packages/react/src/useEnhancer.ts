import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { Disposer } from '@hydrateless/enhancers';

/**
 * Attach any Hydrateless enhancer to a DOM node for the lifetime of a
 * component. Returns a ref to spread onto the element you want enhanced; the
 * enhancer's disposer is called automatically on unmount (and before re-running
 * when `deps` change), so there are no leaked listeners across renders.
 *
 * ```tsx
 * const ref = useEnhancer<HTMLDivElement>(enhanceTabs);
 * return <div data-hl-tabs ref={ref}>…</div>;
 * ```
 */
export function useEnhancer<T extends HTMLElement = HTMLElement>(
  enhance: (container: HTMLElement) => Disposer,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return enhance(el);
    // The caller controls re-initialization through `deps`.
  }, deps);

  return ref;
}
