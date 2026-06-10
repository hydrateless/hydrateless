import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import type { EnhancerHandle } from '@hydrateless/enhancers';

/** Join truthy class names into a single string. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a host-element ref and attach `enhance` to it once mounted, exposing
 * the instance's imperative API and destroying it automatically on unmount.
 * The enhancer runs client-side only, so components stay SSR-safe.
 */
export function useHostEnhancer<Api = null>(
  enhance: (el: HTMLElement) => EnhancerHandle<Api>,
): {
  host: Ref<HTMLElement | null>;
  api: ShallowRef<Api | null>;
} {
  const host = ref<HTMLElement | null>(null);
  const api = shallowRef<Api | null>(null);
  let destroy: (() => void) | null = null;

  onMounted(() => {
    if (!host.value) return;
    const handle = enhance(host.value);
    api.value = handle.api;
    destroy = handle.destroy;
  });
  onBeforeUnmount(() => {
    destroy?.();
    destroy = null;
    api.value = null;
  });

  return { host, api };
}
