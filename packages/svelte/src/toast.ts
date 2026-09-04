import { enhanceToast, type EnhanceToastOptions, type ToastApi } from '@hydrateless/enhancers';

/**
 * Imperative toast API. Toasts render into the page's `[data-hl-toast-region]`
 * (mount a `<ToastRegion>` to control where it lives); when none exists, one
 * is appended to `<body>` on the first `show`. Safe to call during component
 * initialization and on the server, since nothing touches the DOM until
 * `show`/`dismiss` run.
 *
 * ```svelte
 * <script lang="ts">
 *   import { useToast } from '@hydrateless/svelte';
 *
 *   const toast = useToast();
 * </script>
 *
 * <button onclick={() => toast.show('Saved', { intent: 'success' })}>Save</button>
 * ```
 */
export function useToast(options?: EnhanceToastOptions): ToastApi {
  // Resolved per call rather than cached: `enhanceToast` hands back the live
  // API of an already-enhanced region, so this follows a `<ToastRegion>` that
  // mounts or unmounts after `useToast()` was called.
  const resolve = (): ToastApi | null => enhanceToast(undefined, options).api;
  return {
    show(message, opts) {
      const api = resolve();
      if (!api) throw new Error('useToast().show() needs a document to render into');
      return api.show(message, opts);
    },
    dismiss(toast) {
      resolve()?.dismiss(toast);
    },
    dismissAll() {
      resolve()?.dismissAll();
    },
  };
}
