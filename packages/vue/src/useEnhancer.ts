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
 * and is destroyed on unmount. `options` may be a getter; it's re-read, and
 * the enhancer re-attached, whenever `deps` changes.
 *
 * ```vue
 * <script setup>
 * import { useTemplateRef } from 'vue';
 * import { enhanceTabs } from '@hydrateless/enhancers';
 * const host = useTemplateRef('host');
 * const api = useEnhancer(host, enhanceTabs, { activation: 'automatic' });
 * // api.value?.setValue('two');
 * </script>
 * <template><div data-hl-tabs ref="host">...</div></template>
 * ```
 */
export function useEnhancer<Options extends object, Api>(
  el: Ref<HTMLElement | null>,
  enhancer: (container: HTMLElement, options?: Partial<Options>) => EnhancerHandle<Api>,
  options?: MaybeRefOrGetter<Partial<Options>>,
  deps?: WatchSource<unknown>,
): ShallowRef<Api | null> {
  const api = shallowRef<Api | null>(null);
  let destroy: (() => void) | null = null;

  const detach = () => {
    destroy?.();
    destroy = null;
    api.value = null;
  };
  const attach = () => {
    detach();
    if (!el.value) return;
    const handle = enhancer(el.value, toValue(options));
    api.value = handle.api;
    destroy = handle.destroy;
  };

  onMounted(attach);
  if (deps) watch(deps, attach);
  onBeforeUnmount(detach);

  return api;
}
