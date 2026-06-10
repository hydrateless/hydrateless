import { enhanceToast, type EnhanceToastOptions, type ToastApi } from '@hydrateless/enhancers';

let shared: ToastApi | null = null;

/**
 * Imperative toast API backed by a lazily-created document-level region (or a
 * `[data-hl-toast-region]` you render yourself, e.g. via `<ToastRegion>`).
 * Safe to call from any component — no provider required.
 */
export function useToast(options?: EnhanceToastOptions): ToastApi {
  return {
    show(message, opts) {
      // The toast enhancer always creates a region, so `api` is never null.
      const api = (shared ??= enhanceToast(document, options).api!);
      return api.show(message, opts);
    },
    dismiss(toast) {
      shared?.dismiss(toast);
    },
  };
}
