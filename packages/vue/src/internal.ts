import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import type { Disposer } from '@hydrateless/enhancers';

/** Join truthy class names into a single string. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a host-element ref and attach `enhance` to it once mounted, disposing
 * automatically on unmount. The enhancer runs client-side only, so components
 * stay SSR-safe.
 */
export function useHostEnhancer(enhance: (el: HTMLElement) => Disposer): Ref<HTMLElement | null> {
  const host = ref<HTMLElement | null>(null);
  let dispose: Disposer | null = null;

  onMounted(() => {
    if (host.value) dispose = enhance(host.value);
  });
  onBeforeUnmount(() => {
    dispose?.();
    dispose = null;
  });

  return host;
}
