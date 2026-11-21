import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { EnhancerHandle } from '@hydrateless/enhancers';
import { useLatest } from './internal/useLatest.js';

/**
 * Attach any Hydrateless enhancer to the element in `ref` for the lifetime of a
 * component. Returns a ref holding the enhancer's imperative API (for example
 * `setValue`/`setOpen`), or `null` while nothing is enhanced. The instance is
 * attached once on mount and destroyed on unmount; when `deps` change, options
 * are updated in place via `handle.update()` so open overlays and active state
 * are preserved instead of torn down. If the element isn't rendered on mount,
 * the enhancer attaches on the first `deps` change after it appears.
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
  // Set when a handle was just created with fresh options, so the deps effect
  // that runs right after it doesn't push the same options again.
  const skipUpdate = useRef(false);
  const latest = useLatest(options as Record<string, unknown> | undefined);
  const latestEnhancer = useLatest(enhancer);

  // Callbacks route through the latest render, so a changed handler never
  // needs an update. Unset props are kept as `undefined`: the enhancer ignores
  // them on creation and reverts them to their defaults on update.
  const buildOptions = (): Partial<Options> => {
    const live: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(latest.current ?? {})) {
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

  const attach = () => {
    const el = ref.current;
    if (!el) return;
    const handle = latestEnhancer.current(el, buildOptions());
    handleRef.current = handle;
    api.current = handle.api;
    skipUpdate.current = true;
  };

  useEffect(() => {
    attach();
    return () => {
      const handle = handleRef.current;
      handleRef.current = null;
      api.current = null;
      handle?.destroy();
    };
  }, [ref]);

  useEffect(() => {
    const handle = handleRef.current;
    // The element wasn't rendered on mount; attach now that it may exist.
    if (!handle) {
      attach();
      skipUpdate.current = false;
      return;
    }
    if (skipUpdate.current) {
      skipUpdate.current = false;
      return;
    }
    handle.update(buildOptions());
  }, deps);

  return api;
}
