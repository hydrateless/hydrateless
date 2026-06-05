import { onMounted, onUnmounted, type Ref } from 'vue';
import type { Disposer } from '@hydrateless/enhancers';

/**
 * Attach any Hydrateless enhancer to a template ref for the lifetime of a
 * component. The enhancer's disposer is called automatically on unmount.
 *
 * ```ts
 * const el = ref<HTMLElement | null>(null);
 * useEnhancer(el, enhanceTabs);
 * ```
 */
export function useEnhancer(
  target: Ref<HTMLElement | null | undefined>,
  enhance: (container: HTMLElement) => Disposer,
): void {
  let dispose: Disposer | null = null;

  onMounted(() => {
    if (target.value) dispose = enhance(target.value);
  });

  onUnmounted(() => {
    dispose?.();
    dispose = null;
  });
}
