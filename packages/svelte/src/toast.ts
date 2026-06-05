import { enhanceToast, type ToastApi } from '@hydrateless/enhancers';

/**
 * Create a toast controller. Call in `onMount` and tear down in `onDestroy`:
 *
 * ```ts
 * import { onMount, onDestroy } from 'svelte';
 * import { createToast } from '@hydrateless/svelte';
 *
 * let toast: ReturnType<typeof createToast>;
 * onMount(() => (toast = createToast()));
 * onDestroy(() => toast?.destroy());
 * ```
 */
export function createToast(container: Document | HTMLElement = document): ToastApi {
  return enhanceToast(container);
}
