import { onMounted, onUnmounted, shallowRef, type Ref, type ShallowRef } from 'vue';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/**
 * Attach any Hydrateless enhancer to a template ref for the lifetime of a
 * component. Returns a shallow ref to the enhancer's imperative API; the
 * instance is destroyed automatically on unmount.
 *
 * ```ts
 * const el = ref<HTMLElement | null>(null);
 * const tabs = useEnhancer(el, enhanceTabs);
 * tabs.value?.setValue('install');
 * ```
 */
export function useEnhancer<Api = null>(
  target: Ref<HTMLElement | null | undefined>,
  enhance: (container: HTMLElement) => EnhancerHandle<Api>,
): ShallowRef<Api | null> {
  const api = shallowRef<Api | null>(null);
  let destroy: (() => void) | null = null;

  onMounted(() => {
    if (!target.value) return;
    const handle = enhance(target.value);
    api.value = handle.api;
    destroy = handle.destroy;
  });

  onUnmounted(() => {
    destroy?.();
    destroy = null;
    api.value = null;
  });

  return api;
}
