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
 * If the element wasn't rendered on mount, a `deps` change attaches it.
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
  // Attach late if the element wasn't rendered on mount; otherwise update in
  // place. `post` flush runs after the DOM patch, so a newly rendered element
  // is already in the template ref.
  if (deps) {
    watch(deps, () => (handle ? handle.update(toValue(options)) : attach()), { flush: 'post' });
  }
  onBeforeUnmount(detach);

  return api;
}
