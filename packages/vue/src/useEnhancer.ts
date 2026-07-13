import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref,
  type ShallowRef,
  type WatchSource,
} from 'vue';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/**
 * Attach any Hydrateless enhancer to a host element for the lifetime of a
 * component. Returns a template ref to bind onto the element you want
 * enhanced plus a shallow ref to the enhancer's imperative API (e.g.
 * `setValue`/`setOpen`). The enhancer runs client-side only (so components
 * stay SSR-safe) and is destroyed automatically on unmount. Pass a reactive
 * `source` to destroy and re-attach whenever an enhancer option changes.
 *
 * ```vue
 * <script setup>
 * const { host, api } = useEnhancer((el) => enhanceTabs(el));
 * // api.value?.setValue('two');
 * </script>
 * <template><div data-hl-tabs ref="host">…</div></template>
 * ```
 */
export function useEnhancer<Api = null>(
  enhance: (el: HTMLElement) => EnhancerHandle<Api>,
  source?: WatchSource<unknown>,
): { host: Ref<HTMLElement | null>; api: ShallowRef<Api | null> } {
  const host = ref<HTMLElement | null>(null);
  const api = shallowRef<Api | null>(null);
  let destroy: (() => void) | null = null;

  const detach = () => {
    destroy?.();
    destroy = null;
    api.value = null;
  };
  const attach = () => {
    detach();
    if (!host.value) return;
    const handle = enhance(host.value);
    api.value = handle.api;
    destroy = handle.destroy;
  };

  onMounted(attach);
  if (source) watch(source, attach);
  onBeforeUnmount(detach);

  return { host, api };
}
