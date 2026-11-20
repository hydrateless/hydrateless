import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { EnhancerHandle } from '@hydrateless/enhancers';
import { useLatest } from './internal/useLatest.js';

/**
 * Attach any Hydrateless enhancer to the element in `ref` for the lifetime of a
 * component. Returns a ref holding the enhancer's imperative API (for example
 * `setValue`/`setOpen`), or `null` while nothing is enhanced. The instance is
 * attached once on mount and destroyed on unmount; when `deps` change, options
 * are updated in place via `handle.update()` so open overlays and active state
 * are preserved instead of torn down.
 *
 * Function-valued options (`onValueChange`, `onOpenChange`, ...) always call
 * the handler from the latest render, so they never need to appear in `deps`.
 * List non-function options that should update the enhancer in `deps`.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const api = useEnhancer(ref, enhanceTabs, { onValueChange: setTab });
 * // api.current?.setValue('install');
 * return <div className="hl-tabs" data-hl-tabs ref={ref}>...</div>;
 * ```
 */
export function useEnhancer<Options extends object, Api>(
  ref: RefObject<HTMLElement | null>,
  enhancer: (container: HTMLElement, options?: Partial<Options>) => EnhancerHandle<Api, Options>,
  options?: Partial<Options>,
  deps: DependencyList = [],
): RefObject<Api | null> {
  const api = useRef<Api | null>(null);
  const handleRef = useRef<EnhancerHandle<Api, Options> | null>(null);
  const syncedHandle = useRef<EnhancerHandle<Api, Options> | null>(null);
  const latest = useLatest(options as Record<string, unknown> | undefined);
  const latestEnhancer = useLatest(enhancer);

  const buildOptions = (): Partial<Options> => {
    const live: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(latest.current ?? {})) {
      if (value === undefined) continue;
      live[key] =
        typeof value === 'function'
          ? (...args: unknown[]) => {
              const fn = latest.current?.[key];
              return typeof fn === 'function' ? fn(...args) : undefined;
            }
          : value;
    }
    return live as Partial<Options>;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = latestEnhancer.current(el, buildOptions());
    handleRef.current = handle;
    api.current = handle.api;
    return () => {
      handleRef.current = null;
      api.current = null;
      handle.destroy();
    };
  }, [ref]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    if (syncedHandle.current !== handle) {
      syncedHandle.current = handle;
      return;
    }
    handle.update(buildOptions());
  }, deps);

  return api;
}
