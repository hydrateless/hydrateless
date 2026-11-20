import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
  type WatchSource,
} from 'vue';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/**
 * Attach a Hydrateless enhancer to a template ref for the lifetime of the
 * component. This is the one low-level escape hatch in `@hydrateless/vue`:
 * every component in the package is built on it, and you can use it directly
 * for markup the components don't cover. Returns a shallow ref to the
 * enhancer's imperative API (`setValue`, `setOpen`, and so on), `null` until
 * mounted. The enhancer runs client-side only, so components stay SSR-safe,
 * and is destroyed on unmount. When `deps` changes, `options` is re-read and
 * applied in place via `handle.update()`, preserving open overlays and state.
 */
export function useEnhancer<Options extends object, Api>(
  el: Ref<HTMLElement | null>,
  enhancer: (container: HTMLElement, options?: Partial<Options>) => EnhancerHandle<Api, Options>,
  options?: MaybeRefOrGetter<Partial<Options>>,
  deps?: WatchSource<unknown>,
): ShallowRef<Api | null> {
  const api = shallowRef<Api | null>(null);
  let handle: EnhancerHandle<Api, Options> | null = null;

  const detach = () => {
    handle?.destroy();
    handle = null;
    api.value = null;
  };
  const attach = () => {
    detach();
    if (!el.value) return;
    handle = enhancer(el.value, toValue(options));
    api.value = handle.api;
  };

  onMounted(attach);
  if (deps) watch(deps, () => handle?.update(toValue(options)));
  onBeforeUnmount(detach);

  return api;
}
