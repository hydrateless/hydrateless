import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { EnhancerHandle } from '@hydrateless/enhancers';
import { useLatest } from './internal/useLatest.js';

/**
 * Attach any Hydrateless enhancer to the element in `ref` for the lifetime of a
 * component. Returns a ref holding the enhancer's imperative API (for example
 * `setValue`/`setOpen`), or `null` while nothing is enhanced. The instance is
 * destroyed on unmount, and destroyed and re-created when `deps` change, so no
 * listeners leak across renders.
 *
 * Function-valued options (`onValueChange`, `onOpenChange`, ...) always call
 * the handler from the latest render, so they never need to appear in `deps`.
 * Other options are read when the enhancer is created; list the ones that
 * should trigger re-enhancement in `deps`.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const api = useEnhancer(ref, enhanceTabs, { onValueChange: setTab });
 * // api.current?.setValue('install');
 * return <div data-hl-tabs ref={ref}>...</div>;
 * ```
 */
export function useEnhancer<Options extends object, Api>(
  ref: RefObject<HTMLElement | null>,
  enhancer: (container: HTMLElement, options?: Partial<Options>) => EnhancerHandle<Api>,
  options?: Partial<Options>,
  deps: DependencyList = [],
): RefObject<Api | null> {
  const api = useRef<Api | null>(null);
  const latest = useLatest(options as Record<string, unknown> | undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Route callbacks through the latest render so a changed handler never
    // forces a destroy/re-enhance cycle (which would reset the enhancer's
    // state). Unset props are dropped so they don't shadow enhancer defaults.
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
    const handle = enhancer(el, live as Partial<Options>);
    api.current = handle.api;
    return () => {
      api.current = null;
      handle.destroy();
    };
    // The caller decides which option changes warrant re-enhancement.
  }, deps);

  return api;
}
