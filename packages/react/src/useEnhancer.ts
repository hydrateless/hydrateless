import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/**
 * Attach any Hydrateless enhancer to a DOM node for the lifetime of a
 * component. Returns a ref to spread onto the element you want enhanced plus
 * a ref to the enhancer's imperative API (e.g. `setValue`/`setOpen`). The
 * instance is destroyed automatically on unmount (and before re-running when
 * `deps` change), so there are no leaked listeners across renders.
 *
 * ```tsx
 * const { ref, api } = useEnhancer<HTMLDivElement, TabsApi>((el) => enhanceTabs(el));
 * // api.current?.setValue('two');
 * return <div data-hl-tabs ref={ref}>…</div>;
 * ```
 */
export function useEnhancer<T extends HTMLElement = HTMLElement, Api = null>(
  enhance: (container: HTMLElement) => EnhancerHandle<Api>,
  deps: DependencyList = [],
): { ref: RefObject<T | null>; api: RefObject<Api | null> } {
  const ref = useRef<T | null>(null);
  const api = useRef<Api | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = enhance(el);
    api.current = handle.api;
    return () => {
      api.current = null;
      handle.destroy();
    };
    // The caller controls re-initialization through `deps`.
  }, deps);

  return { ref, api };
}
